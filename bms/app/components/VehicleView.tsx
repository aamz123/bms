"use client";
import { useState, useEffect } from "react";
import Light from "./Light";
import InputView from "./InputView";
import { Battery } from '../models/Battery';
import { Cell } from '../models/Cell';
import { batteryInstance } from "../models/batterySingleton";
import GlobalSettings from '../models/GlobalSettings';
import LogOutput from "./LogOutput";

const updateSkipQuadrant1 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant1 = value;
};

const updateSkipQuadrant2 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant2 = value;
};

const updateSkipQuadrant3 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant3 = value;
};

const updateSkipQuadrant4 = (value: boolean) => {
  GlobalSettings.isSkipQuadrant4 = value;
};

const updateSuperCharged = (value: boolean) => {
  GlobalSettings.isSuperCharged = value;
};

export default function VehicleView() {

  const [selectedTab, setSelectedTab] = useState("distance");
  const [superChargingOn, setSuperChargingOn] = useState(false);
  const [overNightChargingOn, setOverNightChargingOn] = useState(false);
  const [distance, setDistance] = useState(""); // State to hold distance input




  const [lightsOn, setLightsOn] = useState<boolean>(false);

  const toggleLights = (): void => {
    setLightsOn(!lightsOn);
  };



  const updateQ1Temperature = (value: number) => {
    GlobalSettings.q1temperature = value;
  } // Temperature for Q1

  const updateQ2Temperature = (value: number) => {
    GlobalSettings.q2temperature = value;
  } // Temperature for Q2

  const updateQ3Temperature = (value: number) => {
    GlobalSettings.q3temperature = value;
  } // Temperature for Q3

  const updateQ4Temperature = (value: number) => {
    GlobalSettings.q4temperature = value;
  } // Temperature for Q4

  const [q1Temperature, setQ1Temperature] = useState("30"); // Temperature for Q1
  const [q2Temperature, setQ2Temperature] = useState("30"); // Temperature for Q2
  const [q3Temperature, setQ3Temperature] = useState("40"); // Temperature for Q3
  const [q4Temperature, setQ4Temperature] = useState("60"); // Temperature for Q4


  //Battery Stuff
  const [battery, setBattery] = useState(batteryInstance);


  const updateBatteryState = () => {
    setBattery({ ...batteryInstance }); // Trigger re-render by updating state
  };

  useEffect(() => {
    // This effect runs once on mount and every time batteryInstance is updated
    const interval = setInterval(() => {
      updateBatteryState(); // Update the state to trigger re-render
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, [battery]);

  const toggleSuperCharging = () => {
    console.log('Starting Supercharging');
    if (superChargingOn) {
      setSuperChargingOn(false);
      updateSuperCharged(false);
    }
    else {
      setSuperChargingOn(true);
      updateSuperCharged(true);
    }
    batteryInstance.charge(updateBatteryState);
  };

  const toggleOverNightCharging = () => {
    console.log('Starting Overnightcharging');
    if (overNightChargingOn) {
      setOverNightChargingOn(false);
    }
    else {
      setOverNightChargingOn(true);
    }
    batteryInstance.charge(updateBatteryState);
  };

  const handleStart = () => {

    const parsedDistance = parseFloat(distance); // Convert distance to a number
    if (isNaN(parsedDistance)) {
      console.error("Please enter a valid number for distance.");
      return;
    }

    const numberOfCells = Math.floor(Number(parsedDistance) / 2); // Calculate cells to discharge
    console.log(`Starting travel for ${distance} km, discharging ${numberOfCells} cells.`);
    batteryInstance.discharge(numberOfCells, updateBatteryState); // Call the discharge function
  };

  return (
    <div className="vehicle-container">
      <div className="flex flex-col items-center w-[6%] absolute top-[3rem] left-[22rem]">
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
      <div className="flex flex-col items-center w-[6%] absolute top-[3rem] left-[37rem]">
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
      <div className="vehicle-body">
        {/* Engine Section */}
        <div className="vehicle-section engine">
          <div className="wheel wheel-left"></div>Engine
          <div className="wheel wheel-right"></div>
        </div>

        {/* Battery Section */}
        <div className="vehicle-section battery">
          <div className="grid gap-5 z-10">
            {battery.battery.map((cell: Cell, index: number) => {

              const charge = cell.stateOfCharge; // Generate random charge for each battery cell
              const chargeColor = cell.getCellChargeColor(); // Get color based on charge


              return (
                <div
                  key={cell.cellId}
                  className={`battery-icon_wrapper lvl${cell.cellId} relative w-[34px] h-[30px] border-2 ${charge === 0 ? "border-[#FF4C4C]" : "border-[#333]"
                    } rounded-md group m-[5px]`}
                  style={{
                    boxShadow: cell.temperature > 28
                      ? '0 0 5px 5px rgba(255, 0, 0, 0.6)' // Red glow for high temperature
                      : cell.temperature == 25
                        ? '0 0 5px 5px rgba(0, 255, 0, 0.6)' // Green glow for low temperature
                        : '0 0 5px 5px rgba(255, 255, 0, 0.6)', // Yellow glow for moderate temperature
                  }}
                >
                  {/* White top indicator */}
                  <div className="absolute top-[-5px] left-1/2 transform -translate-x-1/2 bg-white rounded-[6px] w-[12px] h-[3px]" />

                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-semibold z-10  ">
                    {charge}%
                  </span>
                  {/* Inner fill based on charge level */}
                  <div
                    className={`absolute bottom-0 w-full ${chargeColor} rounded-b-md ${charge > 94 ? "rounded-t-md" : ""
                      }`}
                    style={{ height: `${charge}%` }}
                  ></div>

                  {/* Tooltip for showing details on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-gray-700 text-white text-sm rounded py-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-50">
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
      <div className="flex flex-col items-center w-[6%] absolute bottom-[4rem] left-[22rem] z-50">
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
        <span className="mt-2">{q3Temperature}°C</span>{" "}
        {/* Temperature display above the slider Q2*/}
      </div>
      <div className="flex flex-col items-center w-[6%] absolute bottom-[4rem] left-[37rem] z-50">
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
        <span className="mt-2">{q4Temperature}°C</span>{" "}
        {/* Temperature display above the slider Q2*/}
      </div>
      <LogOutput />
      <div className="inputsection absolute bottom-0 py-1">
        {/* Tabs */}

        <div className="tabs flex space-x-2 px-2 py-1 bg-gray-200 border-t border-gray-300 rounded-t-md mt-8 ">
          <button
            onClick={() => setSelectedTab("distance")}
            className={`tab-button px-4 py-2 font-semibold rounded-md ${selectedTab === "distance"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800"
              } hover:bg-blue-400 transition duration-200`}
          >
            Plan your travel
          </button>
          <button
            onClick={() => setSelectedTab("charging")}
            className={`tab-button px-4 py-2 font-semibold rounded-md ${selectedTab === "charging"
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
              <div className="flex items-center justify-center py-2">
                <button
                  onClick={toggleSuperCharging}
                  className={`px-4 py-2 rounded-md ${superChargingOn
                    ? "bg-red-500 text-white"
                    : "bg-green-300 text-gray-700"
                    } transition duration-200`}
                >
                  {superChargingOn ? "Stop Charging" : "Super Charge"}
                </button>
                <button
                  onClick={toggleOverNightCharging}
                  className={`px-4 py-2 rounded-md ${overNightChargingOn
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
    </div>
  );
}
