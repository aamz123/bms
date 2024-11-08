// "use client";
// import dynamic from "next/dynamic";
// const VehicleView = dynamic(() => import("./components/VehicleView"), {
//   ssr: false,
// });
// export default function Home() {
//   return (
//     <div>
//       <h1 className="text-2xl text-center h-[30px]">
//         Battery Management System - Team 4
//       </h1>
//       <div>
//         <VehicleView />
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from 'react';
import { batteries, charging, discharging } from './app'; // Ensure these imports are correct
import './globals.css'; // Ensure Tailwind CSS is imported

const BatteryManager = () => {
    const [chargingEnabled, setChargingEnabled] = useState(false);
    const [dischargingEnabled, setDischargingEnabled] = useState(false);
    const [chargingIntervalId, setChargingIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [dischargingIntervalId, setDischargingIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [batteryStats, setBatteryStats] = useState(batteries); // Store battery stats

    const updateUI = () => {
        setBatteryStats([...batteries]); // Trigger a re-render with the updated stats
    };

    const startDischarging = () => {
        if (!dischargingEnabled) {
            const id = setInterval(() => {
                discharging(updateUI); // Pass the updateUI function as an argument
            }, 1000); // Adjust the interval as needed
            setDischargingIntervalId(id);
            setDischargingEnabled(true);
        }
    };

    const stopDischarging = () => {
        if (dischargingIntervalId) {
            clearInterval(dischargingIntervalId); // Clear the interval
            setDischargingIntervalId(null); // Reset the interval ID
            setDischargingEnabled(false); // Update the state to indicate discharging is stopped
            console.log("Discharging stopped"); // Log to confirm action
        }
    };

    const startCharging = () => {
        if (!chargingEnabled) {
            const id = setInterval(() => {
                charging(updateUI); // Pass the updateUI function as an argument
            }, 1000); // Adjust the interval as needed
            setChargingIntervalId(id);
            setChargingEnabled(true);
        }
    };

    const stopCharging = () => {
        if (chargingIntervalId) {
            clearInterval(chargingIntervalId); // Clear the interval
            setChargingIntervalId(null); // Reset the interval ID
            setChargingEnabled(false); // Update the state to indicate charging is stopped
            console.log("Charging stopped"); // Log to confirm action
        }
    };

    const resetBatteries = () => {
        console.log('Batteries reset');
        // Reset logic goes here
    };

    return (
        <div className="container mx-auto p-4 h-screen flex flex-col">
            <h1 className="text-2xl font-bold text-center mb-4">Battery Management System</h1>

            <div className="flex justify-around mb-4">
                <button
                    onClick={startCharging}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                    Start Charging
                </button>
                <button
                    onClick={stopCharging}
                    className={`bg-blue-700 text-white font-bold py-2 px-4 rounded hover:bg-blue-900 ${!chargingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!chargingEnabled}
                >
                    Stop Charging
                </button>
                <button
                    onClick={startDischarging}
                    className={`bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 ${dischargingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={dischargingEnabled}
                >
                    Start Discharging
                </button>
                <button
                    onClick={stopDischarging}
                    className={`bg-red-700 text-white font-bold py-2 px-4 rounded hover:bg-red-900 ${!dischargingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!dischargingEnabled}
                >
                    Stop Discharging
                </button>
                <button
                    onClick={resetBatteries}
                    className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
                >
                    Reset Batteries
                </button>
            </div>

            <div className="flex-grow overflow-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800">
                            <th className="border px-4 py-2">Battery #</th>
                            <th className="border px-4 py-2">Charge Level (%)</th>
                            <th className="border px-4 py-2">Voltage (V)</th>
                            <th className="border px-4 py-2">Temperature (°C)</th>
                            <th className="border px-4 py-2">Health (%)</th>
                            <th className="border px-4 py-2">Dead Cells</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batteryStats.map((battery, batteryIndex) => (
                            <tr key={batteryIndex} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">Battery {batteryIndex + 1}</td>
                                <td className="border px-4 py-2">{battery.overallChargeLevel.toFixed(2)}%</td>
                                <td className="border px-4 py-2">{battery.overallVoltage.toFixed(2)} V</td>
                                <td className="border px-4 py-2">{battery.overallTemperature.toFixed(2)} °C</td>
                                <td className="border px-4 py-2">{battery.overallHealthStatus.toFixed(2)}%</td>
                                <td className="border px-4 py-2">{battery.numberOfDeadCells}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-6">
                    <h2 className="text-xl font-bold">Cell Data</h2>
                    <table className="min-w-full table-auto border-collapse mt-2">
                        <thead>
                            <tr className="bg-gray-200 text-gray-800">
                                <th className="border px-4 py-2">Battery #</th>
                                <th className="border px-4 py-2">Cell ID</th>
                                <th className="border px-4 py-2">SoC (%)</th>
                                <th className="border px-4 py-2">Temperature (°C)</th>
                                <th className="border px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batteryStats.map((battery, batteryIndex) => (
                                battery.cells.map((cell, cellIndex) => (
                                    <tr key={`${batteryIndex}-${cellIndex}`} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">Battery {batteryIndex + 1}</td>
                                        <td className="border px-4 py-2">{cell.cellID}</td>
                                        <td className="border px-4 py-2">{cell.stateOfCharge.toFixed(2)}%</td>
                                        <td className="border px-4 py-2">{cell.currentTemperature.toFixed(2)} °C</td>
                                        <td className="border px-4 py-2">{cell.cellLife}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BatteryManager;

