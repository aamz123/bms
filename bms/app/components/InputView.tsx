"use client";
import { useState } from "react";
import { batteryInstance } from "../models/batterySingleton";
import { Battery } from "../models/Battery";
export default function InputView({
  updateBatteryState,
}: {
  updateBatteryState: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState("distance");
  const [distance, setDistance] = useState(""); // State to hold distance input
  const [superChargingOn, setSuperChargingOn] = useState(false);
  const [overNightChargingOn, setOverNightChargingOn] = useState(false);

  const handleStart = () => {
    const parsedDistance = parseFloat(distance); // Convert distance to a number
    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      console.error("Please enter a valid positive number for distance.");
      return;
    }
    console.log(`Starting travel for ${parsedDistance} km.`);
    batteryInstance.discharge2(parsedDistance, updateBatteryState);
    //batteryInstance.discharge(parsedDistance / 2, updateBatteryState);
  };

  const toggleSuperCharging = () => {
    setSuperChargingOn(!superChargingOn);
    batteryInstance.charge2(7, updateBatteryState);
    //batteryInstance.charge(updateBatteryState);
  };

  const toggleOverNightCharging = () => {
    setOverNightChargingOn(!overNightChargingOn);
    batteryInstance.charge2(4, updateBatteryState);
    //batteryInstance.charge(updateBatteryState);
  };

  return (
    <div className="tabs-section h-[120px] w-[400px]">
      <div className="tabs flex justify-between rounded-t-md border-t border-gray-300 bg-gray-200 px-4 py-1">
        <button
          onClick={() => setSelectedTab("distance")}
          className={`tab-button rounded-md px-4 py-2 font-semibold ${
            selectedTab === "distance"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800"
          } transition duration-200 hover:bg-blue-400`}
        >
          Plan your travel
        </button>
        <button
          onClick={() => setSelectedTab("charging")}
          className={`tab-button rounded-md px-4 py-2 font-semibold ${
            selectedTab === "charging"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800"
          } transition duration-200 hover:bg-blue-400`}
        >
          Park your vehicle
        </button>
      </div>

      <div className="tab-content w-full rounded-b-md border border-t-0 border-gray-300 bg-gray-100 px-4">
        {selectedTab === "distance" && (
          <div className="distance-tab">
            <span>Enter distance to travel (km)</span>
            <div className="mb-2 flex items-center space-x-2">
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="h-10 max-w-xs rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                onClick={handleStart}
                className="h-10 rounded-md bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
              >
                Start Travel
              </button>
            </div>
          </div>
        )}
        {selectedTab === "charging" && (
          <div className="charging-tab">
            <div className="flex items-center justify-between space-x-3 py-2">
              <button
                onClick={toggleSuperCharging}
                className={`w-1/2 rounded-md px-4 py-2 ${
                  superChargingOn
                    ? "bg-red-500 text-white"
                    : "bg-green-300 text-gray-700"
                } transition duration-200`}
              >
                {superChargingOn ? "Stop Charging" : "Super Charge"}
              </button>
              <button
                onClick={toggleOverNightCharging}
                className={`w-1/2 rounded-md px-4 py-2 ${
                  overNightChargingOn
                    ? "bg-red-500 text-white"
                    : "bg-green-300 text-gray-700"
                } transition duration-200`}
              >
                {overNightChargingOn ? "Stop Charging" : "Over Night"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
