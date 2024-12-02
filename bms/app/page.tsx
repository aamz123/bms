"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const VehicleView = dynamic(() => import("./components/VehicleView"), {
  ssr: false,
});
export default function Home() {
  const [toggledark,setToggledark]=useState(false)

  return (
    <div>
    <div className={`${
    toggledark ? "bg-[#1e1e1e93] text-white" : "bg-white text-black"}`}>
        <button onClick={()=>{
        setToggledark(f=>!f)
        // console.log(toggledark);
      }} className="text-4xl">{toggledark ?"☀️":"🌙"}</button>
      <div
  className={`text-2xl text-center h-[30px] 
  `}
>
  Battery Management System - Team 4
</div>
</div>

      <div>
        <VehicleView theme={toggledark}/>
      </div>
    </div>
  );
}
