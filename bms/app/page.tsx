"use client";
import dynamic from "next/dynamic";
const VehicleView = dynamic(() => import("./components/VehicleView"), {
  ssr: false,
});
export default function Home() {
  return (
    <div>
      <h1 className="text-2xl text-center h-[30px]">
        Battery Management System - Team 4
      </h1>
      <div>
        <VehicleView />
      </div>
    </div>
  );
}
