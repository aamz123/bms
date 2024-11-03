import Image from "next/image";
import BatteryIndicator from "./components/batteryindicator";
import VehicleView from "./components/VehicleView";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl text-center h-[30px]">
        Battery Management System - Team 4
      </h1>
      <VehicleView />{" "}
    </div>
    //return <div > <BatteryIndicator /></div>;
  );
}
