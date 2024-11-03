import React from "react";

type LightProps = {
  position: "front-left" | "front-right" | "rear-left" | "rear-right";
  isOn: boolean;
};

const Light: React.FC<LightProps> = ({ position, isOn }) => {
  return <div className={`light ${position} ${isOn ? "on" : ""}`}></div>;
};

export default Light;
