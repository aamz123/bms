// components/BatteryIndicator.js
"use client";
import React, { useState } from 'react';

const BatteryIndicator = () => {
  const [distance, setDistance] = useState(''); // State to hold distance input
  const [leftTemperature, setLeftTemperature] = useState("20"); // Temperature for left side
  const [rightTemperature, setRightTemperature] = useState("20"); // Temperature for right side

  const charge = 34; // Charge level can be dynamic or static for testing

  const handleStart = () => {
    console.log(`Starting travel for ${distance} km`); // Replace with actual functionality
  };

  return (
    <div className="flex flex-col items-center gap-4 h-screen w-screen p-4">

      <div>BATTERY MANAGEMENT SYSTEM</div>
      <div className="flex items-center">
      <div className="flex flex-col items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={leftTemperature}
            onChange={(e) => setLeftTemperature(e.target.value)}
            className="w-30 h-48 transform rotate-90"
          />
          <span className="mt-2">{leftTemperature}°C</span> {/* Temperature display below the slider */}
        </div>

        <div className="grid grid-cols-10 gap-5">
          {Array.from({ length: 100 }).map((_, index) => (
            <div
              key={index}
              className={`battery-icon_wrapper lvl${index + 1} relative w-[20px] h-[40px] border-2 rounded-[4px] flex flex-col justify-end group`}
            >
              <div className="absolute top-[-5px] left-1/2 transform -translate-x-1/2 bg-current rounded-[6px] w-[12px] h-[3px]" />
              
              {/* Display the battery icon based on the charge level */}
              {charge < 20 && (
                <div className="battery-icon_1 w-full h-[8px] bg-red-600"></div>
              )}
              {charge >= 20 && charge < 40 && (
                <div className="battery-icon_2 w-full h-[16px] bg-orange-600"></div>
              )}
              {charge >= 40 && charge < 60 && (
                <div className="battery-icon_3 w-full h-[24px] bg-yellow-600"></div>
              )}
              {charge >= 60 && charge < 80 && (
                <div className="battery-icon_4 w-full h-[32px] bg-green-400"></div>
              )}
              {charge >= 80 && (
                <div className="battery-icon_5 w-full h-full rounded-[2px] bg-green-600"></div>
              )}
              
              {/* Tooltip for showing details on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-700 text-white text-sm rounded py-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Charge: {charge}%
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={rightTemperature}
            onChange={(e) => setRightTemperature(e.target.value)}
            className="w-30 h-48 transform rotate-90"
          />
          <span className="mt-2">{rightTemperature}°C</span> {/* Temperature display below the slider */}
        </div>

      </div>
      <div className="flex flex-col items-center mb-4">
        <input
          type="text"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Enter distance to travel (km)"
          className="p-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleStart}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Start Travel
        </button>
      </div>
    </div>
  );
};

export default BatteryIndicator;
