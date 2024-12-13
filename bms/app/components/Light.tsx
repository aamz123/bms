import React from "react";

type LightProps = {
  position: "front-left" | "front-right" | "rear-left" | "rear-right";
  isOn: boolean;
};

const Light: React.FC<LightProps> = ({ position, isOn }) => {
  const lightColor =
    position === "front-left" || position === "front-right"
      ? "bg-yellow-400" // Headlights
      : "bg-red-500"; // Tail lights
  return (
    <div
      className={`absolute h-[80px] w-[80px] rounded-br-[50px] rounded-tl-[50px] opacity-80 [transform-origin:center] ${position} ${isOn ? `${lightColor} shadow-[0_0_15px_5px_rgba(255,_255,_0,_0.7)]` : "bg-[rgba(50,_49,_49,_0.6)] shadow-[0px_0px_10px_rgba(0,_0,_0,_0.3)]"}`}
    ></div>
  );
};

export default Light;
