"use client";
import { useState } from "react";
import { batteryInstance } from "../models/batterySingleton";

export default function InputView({
  updateBatteryState,
  theme,
}: {
  updateBatteryState: () => void;
  theme: boolean;
}) {
  const [selectedTab, setSelectedTab] = useState("distance");
  const [distance, setDistance] = useState("");
  const [superChargingOn, setSuperChargingOn] = useState(false);
  const [overNightChargingOn, setOverNightChargingOn] = useState(false);

  const handleStart = () => {
    const parsedDistance = parseFloat(distance);
    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      console.error("Please enter a valid positive number for distance.");
      return;
    }
    console.log(`Starting travel for ${parsedDistance} km.`);
    batteryInstance.discharge2(parsedDistance, updateBatteryState);
  };

  const toggleSuperCharging = () => {
    setSuperChargingOn(!superChargingOn);
    batteryInstance.charge2(7, updateBatteryState);
  };

  const toggleOverNightCharging = () => {
    setOverNightChargingOn(!overNightChargingOn);
    batteryInstance.charge2(4, updateBatteryState);
  };

  return (
    <div
      className={`tabs-section h-[120px] w-[400px] ${
        theme ? "bg-[#1212125b] text-white" : "bg-[#f0f0f0] text-black"
      }`}
    >
      <div className={`tabs flex justify-between rounded-t-md px-4 py-1 ${theme ? "bg-[#00000000]" : "bg-gray-200"}`}>
        <button
          onClick={() => setSelectedTab("distance")}
          className={`tab-button rounded-md px-4 py-2 font-semibold ${
            selectedTab === "distance"
              ? theme
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : theme
              ? "bg-[#444] text-gray-300"
              : "bg-white text-gray-800"
          }`}
        >
          Plan your travel
        </button>
        <button
          onClick={() => setSelectedTab("charging")}
          className={`tab-button rounded-md px-4 py-2 font-semibold ${
            selectedTab === "charging"
              ? theme
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : theme
              ? "bg-[#444] text-gray-300"
              : "bg-white text-gray-800"
          }`}
        >
          Park your vehicle
        </button>
      </div>
      <div className={`tab-content w-full rounded-b-md px-4 ${theme ? "bg-[#2b2b2b] border-gray-600" : "bg-gray-100 border-gray-300"}`}>
        {selectedTab === "distance" && (
          <div className="distance-tab">
            <span>Enter distance to travel (km)</span>
            <div className="mb-2 flex items-center space-x-2">
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className={`h-10 max-w-xs rounded-md border ${
                  theme ? "border-gray-600 bg-[#2e2e2e] text-white" : "border-gray-300 bg-white text-black"
                } p-2 focus:outline-none`}
              />
              <button
                onClick={handleStart}
                className={`h-10 rounded-md px-4 py-2 transition duration-200 ${
                  theme ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
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
                    ? theme
                      ? "bg-red-600 text-white"
                      : "bg-red-500 text-white"
                    : theme
                    ? "bg-green-600 text-white"
                    : "bg-green-300 text-gray-700"
                }`}
              >
                {superChargingOn ? "Stop Charging" : "Super Charge"}
              </button>
              <button
                onClick={toggleOverNightCharging}
                className={`w-1/2 rounded-md px-4 py-2 ${
                  overNightChargingOn
                    ? theme
                      ? "bg-red-600 text-white"
                      : "bg-red-500 text-white"
                    : theme
                    ? "bg-green-600 text-white"
                    : "bg-green-300 text-gray-700"
                }`}
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
