"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const VehicleView = dynamic(() => import("./components/VehicleView"), {
  ssr: false,
});
export default function Home() {
  const [toggledark, setToggledark] = useState(false);

  return (
    <div>
      <div
        className={`relative flex h-[30px] items-center ${
          toggledark ? "bg-[#1e1e1e93] text-white" : "bg-white text-black"
        }`}
      >
        <button
          onClick={() => {
            setToggledark((f) => !f);
            // console.log(toggledark);
          }}
          className="absolute left-0 top-0 text-xl"
        >
          {toggledark ? "☀️" : "🌙"}
        </button>
        <div className={`w-full text-center text-2xl`}>
          Battery Management System - Team 4
        </div>
      </div>

      <div>
        <VehicleView theme={toggledark} />
      </div>
    </div>
  );
}
