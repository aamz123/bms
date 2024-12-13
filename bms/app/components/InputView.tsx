"use client";
import { useEffect, useState } from "react";
import { batteryInstance } from "../models/batterySingleton";

export default function InputView({
  updateBatteryState,
  setIsTravelling,
  isTravelling,
  setIsCharging,
  isCharging,
  theme,
}: {
  updateBatteryState: () => void;
  setIsTravelling: (travelling: boolean) => void;
  isTravelling: boolean;
  theme: boolean;
  setIsCharging: (charging: boolean) => void;
  isCharging: boolean;
}) {
  const [selectedTab, setSelectedTab] = useState("distance");
  const [distance, setDistance] = useState("");
  const [superChargingOn, setSuperChargingOn] = useState(false);
  const [overNightChargingOn, setOverNightChargingOn] = useState(false);
  const [travellingText, setTravellingText] = useState("Travelling.");
  const [chargingText, setChargingText] = useState("Charging.");
  useEffect(() => {
    if (isTravelling) {
      const interval = setInterval(() => {
        setTravellingText((prev) =>
          prev === "Travelling."
            ? "Travelling.."
            : prev === "Travelling.."
              ? "Travelling..."
              : "Travelling.",
        );
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTravelling]);
  useEffect(() => {
    if (isCharging) {
      const interval = setInterval(() => {
        setChargingText((prev) =>
          prev === "Charging."
            ? "Charging.."
            : prev === "Charging.."
              ? "Charging..."
              : "Charging.",
        );
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCharging]);
  const sanitizeIntegerInput = (value: string, maxDistance: number): string => {
    // Step 1: Remove all non-digit characters
    let sanitizedValue = value.replace(/[^0-9]/g, "");

    // Step 2: Remove unnecessary leading zeros ("000" -> "0", "012" -> "12")
    sanitizedValue = sanitizedValue.replace(/^0+/, "");

    // Step 3: If empty after removing zeros, default to "0"
    if (sanitizedValue === "") {
      sanitizedValue = "0";
    }

    // Step 4: Clamp the value to the range 0 to maxDistance
    const numericValue = parseInt(sanitizedValue, 10);
    if (numericValue > maxDistance) {
      sanitizedValue = maxDistance.toString();
      console.log(
        "%cWarning: Not enough charge you need to charge your battery along the way, distance reduced to available limit.",
        "color: red; font-weight: bold;",
      );
    }

    return sanitizedValue;
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxDistance = batteryInstance.getCurrentTravelDistance();
    const sanitizedValue = sanitizeIntegerInput(
      event.target.value,
      maxDistance,
    );
    setDistance(sanitizedValue);
  };
  const stopTravel = (stopType: string) => {
    let parsedDistance = parseFloat(distance);
    if (stopType === "early") {
      let remainingDistance =
        parsedDistance - batteryInstance.distanceTravelled;
      batteryInstance.cancelTravel();
      console.log(
        `%cINFO: Travel stopped early at ${batteryInstance.distanceTravelled.toFixed(1)} km.`,
        "color: orange; font-weight: bold;",
      );
      setDistance(remainingDistance.toFixed(0));
    } else if (stopType === "full") {
      console.log(
        `%cINFO: Finished travel for ${parsedDistance} km.`,
        "color: green; font-weight: bold;",
      );
      const maxDistance = batteryInstance.getCurrentTravelDistance();
      if (parsedDistance > maxDistance) {
        setDistance(maxDistance.toFixed(0));
      }
    }
    setIsTravelling(false);
  };
  const stopCharge = () => {
    batteryInstance.cancelCharge(); // Set the flag to cancel charging
    setSuperChargingOn(false);
    setOverNightChargingOn(false);
    setIsCharging(false);
    console.log(`%cINFO: Charging stopped.`, "color: red; font-weight: bold;");
  };
  const handleStart = () => {
    if (isTravelling) {
      return;
    }
    let parsedDistance = parseFloat(distance);
    console.log(
      `%cINFO: Starting travel for ${parsedDistance} km.`,
      "color: green; font-weight: bold;",
    );
    setIsTravelling(true);
    batteryInstance.discharge2(parsedDistance, updateBatteryState, stopTravel);
  };
  const startSuperCharging = () => {
    setSuperChargingOn(true);
    setIsCharging(true);
    console.log(
      `%cINFO: Supercharge started.`,
      "color: green; font-weight: bold;",
    );
    batteryInstance.charge2(7, updateBatteryState, stopCharge);
  };

  const startOverNightCharging = () => {
    setOverNightChargingOn(!overNightChargingOn);
    setIsCharging(true);
    console.log(
      `%cINFO: Overnight charge started.`,
      "color: green; font-weight: bold;",
    );
    batteryInstance.charge2(4, updateBatteryState, stopCharge);
  };

  return (
    <div
      className={`tabs-section h-[120px] w-[400px] rounded-lg ${
        theme ? "bg-[#1212125b] text-white" : "bg-[#f0f0f0] text-black"
      }`}
    >
      <div
        className={`tabs flex justify-between rounded-t-md px-4 py-1 ${theme ? "bg-[#00000000]" : "bg-gray-200"}`}
      >
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
          disabled={isTravelling || isCharging}
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
          disabled={isTravelling || isCharging}
        >
          Park your vehicle
        </button>
      </div>
      <div
        className={`tab-content w-full rounded-b-md px-4 ${theme ? "border-gray-600 bg-[#2b2b2b]" : "border-gray-300 bg-gray-100"}`}
      >
        {selectedTab === "distance" && (
          <div className="distance-tab">
            {!isTravelling ? (
              <div>
                <span>Distance to travel (km)</span>
                <div className="mb-2 flex items-center space-x-2 py-1">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    onKeyDown={(e) => {
                      // Block invalid keys (e.g., 'e', '+', '-')
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      // Prevent pasting invalid characters
                      const pastedText = e.clipboardData.getData("Text");
                      if (/[^0-9]/.test(pastedText)) {
                        e.preventDefault();
                      }
                    }}
                    value={distance}
                    onChange={handleInputChange}
                    placeholder="Enter travel distance"
                    className={`h-10 w-full rounded-md border ${
                      theme
                        ? "border-gray-600 bg-[#2e2e2e] text-white"
                        : "border-gray-300 bg-white text-black"
                    } p-2 focus:outline-none`}
                  />
                  <button
                    onClick={handleStart}
                    className={`h-10 w-[160px] rounded-md px-4 py-2 transition duration-200 ${
                      theme
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={isTravelling || !(parseFloat(distance) > 0)}
                  >
                    {isTravelling ? "Travelling..." : "Start Travel"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2 flex items-center space-x-2 py-4">
                <div className="mr-3 flex w-full flex-row items-center justify-between">
                  <span className="w-1/2 text-lg font-semibold italic">
                    {travellingText}
                  </span>
                  <span className="w-1/2 text-right text-base font-medium italic">
                    {batteryInstance.distanceTravelled.toFixed(1)} / {distance}
                    km
                  </span>
                </div>

                <button
                  onClick={() => {
                    stopTravel("early");
                  }}
                  className={`h-10 w-[160px] rounded-md px-4 py-2 transition duration-200 ${theme ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}
                >
                  Stop Travel
                </button>
              </div>
            )}
          </div>
        )}
        {selectedTab === "charging" && (
          <div className="charging-tab">
            {!isCharging ? (
              <div className="flex items-center justify-between space-x-3 py-2">
                <button
                  onClick={startSuperCharging}
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
                  onClick={startOverNightCharging}
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
            ) : (
              <div className="mb-2 flex items-center space-x-2 py-4">
                <div className="mr-3 flex w-full flex-row items-center justify-between">
                  <span className="w-full text-lg font-semibold italic">
                    {chargingText}
                  </span>
                </div>

                <button
                  onClick={() => {
                    stopCharge();
                  }}
                  className={`h-10 w-[240px] rounded-md px-4 py-2 transition duration-200 ${theme ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}
                >
                  Stop Charge
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
