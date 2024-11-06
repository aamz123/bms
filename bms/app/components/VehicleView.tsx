"use client";
import { useState } from "react";
import Light from "./Light";
import InputView from "./InputView";
export default function VehicleView() {
  const [lightsOn, setLightsOn] = useState<boolean>(false);

  const toggleLights = (): void => {
    setLightsOn(!lightsOn);
  };

  const [leftTemperature, setLeftTemperature] = useState("20"); // Temperature for left side
  const [rightTemperature, setRightTemperature] = useState("20"); // Temperature for right side
  //const charge = 34; // Charge level can be dynamic or static for testing
  // Utility function to generate a random charge level between 0 and 100
  const getRandomCharge = () => Math.floor(Math.random() * 101);
  return (
    <div className="vehicle-container">
      <div className="flex flex-col items-center w-[6%]">
        <input
          type="range"
          min="0"
          max="100"
          value={leftTemperature}
          onChange={(e) => setLeftTemperature(e.target.value)}
          className="w-30 h-48 transform rotate-90"
        />
        <span className="mt-2">{leftTemperature}°C</span>{" "}
        {/* Temperature display below the slider */}
      </div>
      <div className="vehicle-body">
        {/* Engine Section */}
        <div className="vehicle-section engine">
          <div className="wheel wheel-left"></div>Engine
          <div className="wheel wheel-right"></div>
        </div>

        {/* Battery Section */}
        <div className="vehicle-section battery">
          <div className="grid gap-5 z-10">
            {Array.from({ length: 100 }).map((_, index) => {
              const charge = getRandomCharge(); // Generate random charge for each battery cell
              return (
                <div
                  key={index}
                  className={`battery-icon_wrapper lvl${
                    index + 1
                  } relative w-[20px] h-[40px] border-2 rounded-[4px] flex flex-col justify-end group`}
                >
                  <div className="absolute top-[-5px] left-1/2 transform -translate-x-1/2 bg-current rounded-[6px] w-[12px] h-[3px]" />

                  {/* Display the battery icon based on the charge level */}
                  {charge < 20 && (
                    <div className="battery-icon_1 w-full h-[8px] bg-[#FF4C4C]"></div>
                  )}
                  {charge >= 20 && charge < 40 && (
                    <div className="battery-icon_2 w-full h-[12px] bg-[#FFA94C]"></div>
                  )}
                  {charge >= 40 && charge < 60 && (
                    <div className="battery-icon_3 w-full h-[16px] bg-[#FFD700]"></div>
                  )}
                  {charge >= 60 && charge < 80 && (
                    <div className="battery-icon_4 w-full h-[20px] bg-[#A3E635]"></div>
                  )}
                  {charge >= 80 && (
                    <div className="battery-icon_5 w-full h-full rounded-[2px] bg-[#4CAF50]"></div>
                  )}

                  {/* Tooltip for showing details on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-700 text-white text-sm rounded py-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Charge: {charge}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Baggage Section */}
        <div className="vehicle-section baggage">
          <div className="wheel wheel-rear-left"></div>Baggage
          <div className="wheel wheel-rear-right"></div>
        </div>
        {/* Front and Back Labels */}
        <div className="front-label">Front</div>
        <div className="back-label">Rear</div>

        <Light position="front-left" isOn={lightsOn} />
        <Light position="front-right" isOn={lightsOn} />
        <Light position="rear-left" isOn={lightsOn} />
        <Light position="rear-right" isOn={lightsOn} />
      </div>
      <div className="flex flex-col items-center w-[6%]">
        <input
          type="range"
          min="0"
          max="100"
          value={rightTemperature}
          onChange={(e) => setRightTemperature(e.target.value)}
          className="w-30 h-48 transform rotate-90"
        />
        <span className="mt-2">{rightTemperature}°C</span>{" "}
        {/* Temperature display below the slider */}
      </div>

      <InputView />
    </div>
  );
}
