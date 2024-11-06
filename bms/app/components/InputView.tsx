"use client";
import { useState } from "react";
export default function InputView() {
  const [selectedTab, setSelectedTab] = useState("distance");
  const [chargingOn, setChargingOn] = useState(false);
  const [distance, setDistance] = useState(""); // State to hold distance input
  const toggleCharging = () => {
    setChargingOn(!chargingOn); // Toggle charging state
  };
  const handleStart = () => {
    console.log(`Starting travel for ${distance} km`); // Replace with actual functionality
  };
  return (
    <div className="inputsection absolute bottom-0 py-1">
      {/* Tabs */}

      <div className="tabs flex  space-x-2 px-2 py-1 bg-gray-200 border-t border-gray-300 rounded-t-md mt-8 ">
        <button
          onClick={() => setSelectedTab("distance")}
          className={`tab-button px-4 py-2 font-semibold rounded-md ${
            selectedTab === "distance"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800"
          } hover:bg-blue-400 transition duration-200`}
        >
          Plan your travel
        </button>
        <button
          onClick={() => setSelectedTab("charging")}
          className={`tab-button px-4 py-2 font-semibold rounded-md ${
            selectedTab === "charging"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800"
          } hover:bg-blue-400 transition duration-200`}
        >
          Park your vehicle
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content w-full px-4 bg-gray-100 border border-t-0 border-gray-300 rounded-b-md">
        {selectedTab === "distance" && (
          <div className="distance-tab">
            <span>Enter distance to travel (km)</span>
            <div className="flex items-center mb-2 space-x-2">
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="p-2 border border-gray-300 rounded-md  max-w-xs focus:outline-none focus:ring focus:ring-blue-500 h-10"
              />
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 h-10"
              >
                Start Travel
              </button>
            </div>
          </div>
        )}
        {selectedTab === "charging" && (
          <div className="charging-tab">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={toggleCharging}
                className={`px-4 py-2 rounded-md ${
                  chargingOn
                    ? "bg-red-500 text-white"
                    : "bg-green-300 text-gray-700"
                } transition duration-200`}
              >
                {chargingOn ? "Stop Charging" : "Start Charging"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
