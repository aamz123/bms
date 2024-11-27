"use client";
import { useState, useEffect } from "react";
import Light from "./Light";
import InputView from "./InputView";
import { Cell } from "../models/Cell";
import { batteryInstance } from "../models/batterySingleton";
import GlobalSettings from "../models/GlobalSettings";
import LogOutput from "./LogOutput";

const updateSkipQuadrant1 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant1 = value;
  console.log("quad 1" + value); // for checking if the value is changing or not
};

const updateSkipQuadrant2 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant2 = value;
  console.log("quad 2" + value); // for checking if the value is changing or not
};

const updateSkipQuadrant3 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant3 = value;
  console.log("quad 3" + value); // for checking if the value is changing or not
};

const updateSkipQuadrant4 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant4 = value;
  console.log("quad 4" + value); // for checking if the value is changing or not
};

const updateSuperCharged = (value: boolean) => {
  GlobalSettings.isSuperCharged = value;
};
//added overnight chanegd
const updateOverNightCharged = (value: boolean) => {
  GlobalSettings.isSuperCharged = value;
};

export default function VehicleView() {
  const [lightsOn, setLightsOn] = useState<boolean>(false);
  const [q1Temperature, setQ1Temperature] = useState("25"); // Temperature for Q1
  const [q2Temperature, setQ2Temperature] = useState("25"); // Temperature for Q2
  const [q3Temperature, setQ3Temperature] = useState("25"); // Temperature for Q3
  const [q4Temperature, setQ4Temperature] = useState("25"); // Temperature for Q4
  //Battery Stuff
  const [battery, setBattery] = useState(batteryInstance);
  const [overallBatteryLevel, setOverallBatteryLevel] = useState(0);
  const [travelDistance, setTravelDistance] = useState(0);
  const toggleLights = (): void => {
    setLightsOn(!lightsOn);
  };

  const updateQ1Temperature = (value: number) => {
    GlobalSettings.q1temperature = value;
  }; // Temperature for Q1

  const updateQ2Temperature = (value: number) => {
    GlobalSettings.q2temperature = value;
  }; // Temperature for Q2

  const updateQ3Temperature = (value: number) => {
    GlobalSettings.q3temperature = value;
  }; // Temperature for Q3

  const updateQ4Temperature = (value: number) => {
    GlobalSettings.q4temperature = value;
  }; // Temperature for Q4

  updateQ1Temperature(parseFloat(q1Temperature));
  updateQ2Temperature(parseFloat(q2Temperature));
  updateQ3Temperature(parseFloat(q3Temperature));
  updateQ4Temperature(parseFloat(q4Temperature));

  const updateBatteryState = () => {
    const currentSOC = batteryInstance.calculateStateOfCharge();
    const currentTravelDistance = batteryInstance.getCurrentTravelDistance();
    // Update state to trigger re-render
    setBattery({ ...batteryInstance }); // Clone batteryInstance to force state update
    setOverallBatteryLevel(currentSOC);
    setTravelDistance(currentTravelDistance);
  };

  useEffect(() => {
    // This effect runs once on mount and every time batteryInstance is updated
    const interval = setInterval(() => {
      updateBatteryState(); // Update the state to trigger re-render
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, [battery]);

  return (
    <div className="-z-10 flex h-[calc(100vh_-_30px)] items-center justify-start bg-[#f0f0f0] px-4 py-[10%]">
      <div className="relative top-[-40px] z-[8] flex h-[500px] w-[84%] flex-row items-center rounded-[50px] bg-[#cccccc] shadow-[0_4px_8px_rgba(0,_0,_0,_0.2)]">
        <div className="absolute left-[46%] top-[-30px] mb-2 flex -translate-x-[40%] flex-row space-x-3">
          <p>Overall Battery Level: {overallBatteryLevel.toFixed(1)}%</p>
          <p>Available Travel Distance: {travelDistance.toFixed(1)} km</p>
        </div>
        {/* Engine Section */}
        <div className="engine relative flex h-full flex-[0.2] items-center justify-center rounded-bl-[50px] rounded-tl-[50px] bg-[#a0a0a0] text-center text-[1.2em] font-bold text-white [text-orientation:upright] [writing-mode:vertical-rl]">
          <div className="wheel absolute right-[-40%] top-[-9%] z-[-5] flex h-[80px] w-[140px] items-center justify-center rounded-[50%] bg-[#333] shadow-[0px_4px_8px_rgba(0,_0,_0,_0.4)]"></div>
          Engine
          <div className="wheel absolute bottom-[-9%] right-[-40%] z-[-5] flex h-[80px] w-[140px] items-center justify-center rounded-[50%] bg-[#333] shadow-[0px_4px_8px_rgba(0,_0,_0,_0.4)]"></div>
        </div>

        {/* Battery Section */}
        <div className="battery relative flex flex-[0.8] items-center justify-center bg-[#b0b0b0] p-[10px] text-center text-[1.2em] font-bold text-white">
          <div className="z-10 grid gap-5">
            <div className="absolute right-[30px] top-[5%] flex w-[6%] flex-col items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={q2Temperature}
                onChange={(e) => {
                  setQ2Temperature(e.target.value); // Update the state with a number
                  updateQ2Temperature(parseFloat(e.target.value)); // Pass the number to the function
                }}
                className="w-30"
              />
              <span className="mt-2">{q2Temperature}°C</span>{" "}
              {/* Temperature display above the slider Q2*/}
            </div>
            <div className="absolute left-[30px] top-[5%] z-50 flex w-[6%] flex-col items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={q1Temperature}
                onChange={(e) => {
                  setQ1Temperature(e.target.value); // Update the state with a number
                  updateQ1Temperature(parseFloat(e.target.value)); // Pass the number to the function
                }}
                className="w-30"
              />
              <span className="mt-2">{q1Temperature}°C</span>{" "}
              {/* Temperature display above the slider Q1*/}
            </div>
            <div className="absolute bottom-[5%] left-[30px] flex w-[6%] flex-col items-center">
              <span className="mt-2">{q3Temperature}°C</span>{" "}
              <input
                type="range"
                min="0"
                max="100"
                value={q3Temperature}
                onChange={(e) => {
                  setQ3Temperature(e.target.value); // Update the state with a number
                  updateQ3Temperature(parseFloat(e.target.value)); // Pass the number to the function
                }}
                className="w-30"
              />
              {/* Temperature display above the slider Q3*/}
            </div>
            <div className="absolute bottom-[5%] right-[30px] z-50 flex w-[6%] flex-col items-center">
              <span className="mt-2">{q4Temperature}°C</span>{" "}
              <input
                type="range"
                min="0"
                max="100"
                value={q4Temperature}
                onChange={(e) => {
                  setQ4Temperature(e.target.value); // Update the state with a number
                  updateQ4Temperature(parseFloat(e.target.value)); // Pass the number to the function
                }}
                className="w-30"
              />
              {/* Temperature display above the slider Q4*/}
            </div>
            {battery.battery.map((cell: Cell, index: number) => {
              const charge = cell.stateOfCharge; // Generate random charge for each battery cell
              const chargeColor = cell.getCellChargeColor(); // Get color based on charge
              // Determine the box shadow color based on the temperature
              const boxShadowColor =
                cell.temperature <= 25
                  ? "0 0 5px 5px rgba(0, 255, 0, 0.6)" // Green for cool temperature (<= 25°C)
                  : cell.temperature <= 29
                    ? "0 0 5px 5px rgba(255, 255, 0, 0.6)" // Yellow for moderate temperature (26°C - 29°C)
                    : cell.temperature <= 34
                      ? "0 0 5px 5px rgba(255, 165, 0, 0.6)" // Orange for hot temperature (29°C - 34°C)
                      : "0 0 5px 5px rgba(255, 0, 0, 0.6)"; // Red for extremely hot temperature (> 34°C)
              return (
                <div
                  key={cell.cellId}
                  className={`battery-icon_wrapper lvl${
                    cell.cellId
                  } relative h-[30px] w-[34px] border-2 ${
                    charge === 0 ? "border-[#FF4C4C]" : "border-[#333]"
                  } group m-[5px] rounded-md`}
                  style={{
                    boxShadow: boxShadowColor,
                  }}
                >
                  {/* White top indicator */}
                  <div className="absolute left-1/2 top-[-5px] h-[3px] w-[12px] -translate-x-1/2 transform rounded-[6px] bg-white" />

                  <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-xs font-semibold text-white">
                    {charge}%
                  </span>
                  {/* Inner fill based on charge level */}
                  <div
                    className={`absolute bottom-0 w-full ${chargeColor} rounded-b-md ${
                      charge > 94 ? "rounded-t-md" : ""
                    }`}
                    style={{ height: `${charge}%` }}
                  ></div>

                  {/* Tooltip for showing details on hover */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 w-max -translate-x-1/2 transform rounded bg-gray-700 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Cell ID: {cell.cellId}
                    <br />
                    Temperature: {cell.temperature}°C
                    <br />
                    State of Charge: {cell.stateOfCharge}%<br />
                    Voltage: {cell.voltage}V<br />
                    Quadrant: {cell.quadrant}
                    <br />
                    Cycles: {cell.numberOfChargeCycles} <br />
                    Charging Status:{" "}
                    {cell.chargingStatus === "C"
                      ? "Charging"
                      : cell.chargingStatus === "D"
                        ? "Discharging"
                        : "Idle"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Baggage Section */}
        <div className="baggage relative flex h-full flex-[0.2] items-center justify-center rounded-br-[50px] rounded-tr-[50px] bg-[#a0a0a0] text-center text-[1.2em] font-bold text-white [text-orientation:upright] [writing-mode:vertical-rl]">
          <div className="wheel absolute left-[-40%] top-[-9%] z-[-5] flex h-[80px] w-[140px] items-center justify-center rounded-[50%] bg-[#333] shadow-[0px_4px_8px_rgba(0,_0,_0,_0.4)]"></div>
          Baggage
          <div className="wheel absolute bottom-[-9%] left-[-40%] z-[-5] flex h-[80px] w-[140px] items-center justify-center rounded-[50%] bg-[#333] shadow-[0px_4px_8px_rgba(0,_0,_0,_0.4)]"></div>
        </div>
        {/* Front and Back Labels */}
        <div className="absolute left-[4px] top-[40%] rounded-[3px] bg-[rgba(255,_255,_255,_0.8)] p-[2px_5px] text-[0.8em] text-[#333] [text-orientation:upright] [writing-mode:vertical-rl]">
          Front
        </div>
        <div className="absolute right-[4px] top-[43%] rounded-[3px] bg-[rgba(255,_255,_255,_0.8)] p-[2px_5px] text-[0.8em] text-[#333] [text-orientation:upright] [writing-mode:vertical-rl]">
          Rear
        </div>

        <Light position="front-left" isOn={lightsOn} />
        <Light position="front-right" isOn={lightsOn} />
        <Light position="rear-left" isOn={lightsOn} />
        <Light position="rear-right" isOn={lightsOn} />
      </div>

      <div className="absolute bottom-0 left-[40%] mb-2 -translate-x-[40%]">
        <InputView updateBatteryState={updateBatteryState} />
      </div>

      {/* Log Output */}
      <LogOutput />
    </div>
  );
}
