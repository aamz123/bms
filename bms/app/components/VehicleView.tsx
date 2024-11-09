"use client";
import { useState, useEffect } from "react";
import Light from "./Light";
import InputView from "./InputView";
import {Battery} from '../models/Battery';
import {Cell} from '../models/Cell';

export default function VehicleView() {
  const [lightsOn, setLightsOn] = useState<boolean>(false);

  const toggleLights = (): void => {
    setLightsOn(!lightsOn);
  };

  const [battery, setBattery] = useState<Battery>(new Battery());

  const [leftTemperature, setLeftTemperature] = useState("20"); // Temperature for left side
  const [rightTemperature, setRightTemperature] = useState("20"); // Temperature for right side
  
  
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
            {battery.battery.map((cell : Cell, index : number) => {
              
              const charge = cell.stateOfCharge; // Generate random charge for each battery cell
              const chargeColor = cell.getCellChargeColor(); // Get color based on charge
              
              
              return (
                <div
                  key={cell.cellId}
                  className={`battery-icon_wrapper lvl${cell.cellId} relative w-[34px] h-[30px] border-2 ${
                    charge === 0 ? "border-[#FF4C4C]" : "border-[#333]"
                  } rounded-md group`}
                  
                >
                  {/* White top indicator */}
                  <div className="absolute top-[-5px] left-1/2 transform -translate-x-1/2 bg-white rounded-[6px] w-[12px] h-[3px]" />

                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-semibold">
                    {charge}%
                  </span>
                  {/* Inner fill based on charge level */}
                  <div
                    className={`w-full ${chargeColor} rounded-b-md ${
                      charge > 94 ? "rounded-t-md" : ""
                    }`}
                    style={{ height: `${charge}%` }}
                  ></div>

                  {/* Tooltip for showing details on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-700 text-white text-sm rounded py-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Cell ID: {cell.cellId}<br />
                    Temperature: {cell.temperature}°C<br />
                    State of Charge: {cell.stateOfCharge}%<br />
                    Voltage: {cell.voltage}V<br />
                    Quadrant: {cell.quadrant}<br />
                    Charging Status: {cell.chargingStatus === 'C' ? 'Charging' : cell.chargingStatus === 'D' ? 'Discharging' : 'Idle'}
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

      <InputView  battery={battery} setBattery={setBattery}/>
    </div>
  );
}
