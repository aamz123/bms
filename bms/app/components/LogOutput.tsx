import { useState, useEffect, useRef } from "react";

const LogOutput = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null); // Reference to the log container for scrolling

  // Capture logs by overriding console.log
  useEffect(() => {
    const originalConsoleLog = console.log;

    console.log = (...args: any[]) => {
      // Push log to state
      setLogs((prevLogs) => [...prevLogs, ...args.map(String)]);
      // Call the original console.log to ensure logs are shown in the browser console
      originalConsoleLog(...args);
    };

    return () => {
      // Restore original console.log when the component is unmounted
      console.log = originalConsoleLog;
    };
  }, []);

  // Auto-scroll to the bottom of the log container whenever logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logContainerRef}
      className="log-output absolute top-0 right-0 w-[300px] h-[100vh] bg-gray-900 text-white p-4 overflow-y-auto"
    >
      <h2 className="text-lg font-semibold mb-2">Console Output</h2>
      <div className="logs">
        {logs.map((log, index) => (
          <div key={index} className="log-item">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogOutput;
