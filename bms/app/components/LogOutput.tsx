import { useState, useEffect, useRef } from "react";

const LogOutput = ({theme}:{theme:boolean}) => {
  const [logs, setLogs] = useState<{ text: string; style: string }[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null); // Reference to the log container for scrolling

  useEffect(() => {
    const originalConsoleLog = console.log;

    console.log = (...args: any[]) => {
      const styledLogs: { text: string; style: string }[] = [];
      let i = 0;

      // Parse `%c` and split text and style
      while (i < args.length) {
        if (typeof args[i] === "string" && args[i].startsWith("%c")) {
          const text = args[i].substring(2);
          const style = args[i + 1] || "";

          // Filter out Fast Refresh logs
          if (!text.includes("Fast Refresh")) {
            styledLogs.push({ text, style });
          }
          i += 2; // Skip the next argument since it's the style
        } else {
          const text = String(args[i]);

          // Filter out Fast Refresh logs
          if (!text.includes("Fast Refresh")) {
            styledLogs.push({ text, style: "" });
          }
          i++;
        }
      }

      setLogs((prevLogs) => [...prevLogs, ...styledLogs]); // Add the parsed logs to the state

      // Call the original console.log
      originalConsoleLog(...args);
    };

    return () => {
      console.log = originalConsoleLog; // Restore the original console.log
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logContainerRef}
      className={`fixed right-0 top-[30px] z-[10] h-[calc(100vh_-_30px)] w-[25%] overflow-y-auto rounded-lg border ${
        theme
          ? "border-gray-600 bg-[#1e1e1e38] text-white"
          : "border-b-[#12121213] bg-[##cbd5e1] text-black"
      } font-medium shadow-lg backdrop-opacity-90`}
      
    >
      <h2 className={`sticky top-0 w-full border-b-2 text-center text-lg font-bold ${
  theme
    ? "border-b-[#444] bg-[#2e2e2eb7] text-white"
    : "border-b-[#1212123b] bg-[#fafafa8c] text-black"
}`}
>
        Console Output
      </h2>
      <div className="logs pt-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className="log-item mb-2 text-sm font-bold"
            style={{ whiteSpace: "pre-wrap", ...parseStyle(log.style) }}
          >
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
};

// Utility to convert CSS style strings into style objects
const parseStyle = (styleString: string): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  styleString.split(";").forEach((style) => {
    const [key, value] = style.split(":").map((s) => s.trim());
    if (key && value) {
      styles[toCamelCase(key)] = value;
    }
  });
  return styles;
};

// Utility to convert CSS property names to camelCase
const toCamelCase = (str: string) =>
  str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export default LogOutput;
