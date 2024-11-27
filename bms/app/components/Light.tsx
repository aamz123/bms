import React from "react";

type LightProps = {
  position: "front-left" | "front-right" | "rear-left" | "rear-right";
  isOn: boolean;
};

const Light: React.FC<LightProps> = ({ position, isOn }) => {
  return (
    <div
      className={`absolute h-[80px] w-[80px] rounded-br-[50px] rounded-tl-[50px] bg-[rgba(50,_49,_49,_0.6)] opacity-80 shadow-[0px_0px_10px_rgba(0,_0,_0,_0.3)] [transform-origin:center] ${position} ${isOn ? "on" : ""}`}
    ></div>
  );
};

export default Light;
