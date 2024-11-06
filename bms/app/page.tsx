// import VehicleView from "./components/VehicleView";

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
// "use client";

// import React, { useState } from 'react';
// import { batteries, charging, discharging } from './app'; // Ensure these imports are correct
// import './globals.css'; // Ensure Tailwind CSS is imported

// const BatteryManager = () => {
//     const [chargingEnabled, setChargingEnabled] = useState(false);
//     const [dischargingEnabled, setDischargingEnabled] = useState(false);
//     const [chargingIntervalId, setChargingIntervalId] = useState<NodeJS.Timeout | null>(null);
//     const [dischargingIntervalId, setDischargingIntervalId] = useState<NodeJS.Timeout | null>(null);
//     const [batteryStats, setBatteryStats] = useState(batteries); // Store battery stats

//     const updateUI = () => {
//         setBatteryStats([...batteries]); // Trigger a re-render with the updated stats
//     };

//     const startDischarging = () => {
//         if (!dischargingEnabled) {
//             const id = setInterval(() => {
//                 discharging(updateUI); // Pass the updateUI function as an argument
//             }, 1000); // Adjust the interval as needed
//             setDischargingIntervalId(id);
//             setDischargingEnabled(true);
//         }
//     };

//     const stopDischarging = () => {
//         if (dischargingIntervalId) {
//             clearInterval(dischargingIntervalId); // Clear the interval
//             setDischargingIntervalId(null); // Reset the interval ID
//             setDischargingEnabled(false); // Update the state to indicate discharging is stopped
//             console.log("Discharging stopped"); // Log to confirm action
//         }
//     };

//     const startCharging = () => {
//         if (!chargingEnabled) {
//             const id = setInterval(() => {
//                 charging(updateUI); // Pass the updateUI function as an argument
//             }, 1000); // Adjust the interval as needed
//             setChargingIntervalId(id);
//             setChargingEnabled(true);
//         }
//     };

//     const stopCharging = () => {
//         if (chargingIntervalId) {
//             clearInterval(chargingIntervalId); // Clear the interval
//             setChargingIntervalId(null); // Reset the interval ID
//             setChargingEnabled(false); // Update the state to indicate charging is stopped
//             console.log("Charging stopped"); // Log to confirm action
//         }
//     };

//     const resetBatteries = () => {
//         console.log('Batteries reset');
//         // Reset logic goes here
//     };

//     return (
//         <div className="container mx-auto p-4 h-screen flex flex-col">
//             <h1 className="text-2xl font-bold text-center mb-4">Battery Management System</h1>

//             <div className="flex justify-around mb-4">
//                 <button
//                     onClick={startCharging}
//                     className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
//                 >
//                     Start Charging
//                 </button>
//                 <button
//                     onClick={stopCharging}
//                     className={`bg-blue-700 text-white font-bold py-2 px-4 rounded hover:bg-blue-900 ${!chargingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={!chargingEnabled}
//                 >
//                     Stop Charging
//                 </button>
//                 <button
//                     onClick={startDischarging}
//                     className={`bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 ${dischargingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={dischargingEnabled}
//                 >
//                     Start Discharging
//                 </button>
//                 <button
//                     onClick={stopDischarging}
//                     className={`bg-red-700 text-white font-bold py-2 px-4 rounded hover:bg-red-900 ${!dischargingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={!dischargingEnabled}
//                 >
//                     Stop Discharging
//                 </button>
//                 <button
//                     onClick={resetBatteries}
//                     className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
//                 >
//                     Reset Batteries
//                 </button>
//             </div>

//             <div className="flex-grow overflow-auto">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {batteryStats.map((battery, batteryIndex) => (
//                         <div key={batteryIndex} className="p-4 border rounded shadow-md flex flex-col">
//                             <h2 className="text-xl font-semibold mb-2">Battery {batteryIndex + 1}</h2>
//                             <div className="mb-2">
//                                 <p><strong>Charge Level:</strong> {battery.overallChargeLevel.toFixed(2)}%</p>
//                                 <p><strong>Voltage:</strong> {battery.overallVoltage.toFixed(2)} V</p>
//                                 <p><strong>Temperature:</strong> {battery.overallTemperature.toFixed(2)} °C</p>
//                                 <p><strong>Health:</strong> {battery.overallHealthStatus.toFixed(2)}%</p>
//                                 <p><strong>Dead Cells:</strong> {battery.numberOfDeadCells}</p>
//                             </div>

//                             <h3 className="text-lg font-semibold mt-2">Cells:</h3>
//                             <div className="flex flex-col overflow-y-auto max-h-60"> {/* Set max height for scrolling */}
//                                 <table className="min-w-full border-collapse">
//                                     <thead>
//                                         <tr className="bg-blue-600 text-white">
//                                             <th className="border px-2 py-1 text-left">Cell ID</th>
//                                             <th className="border px-2 py-1 text-left">SoC</th>
//                                             <th className="border px-2 py-1 text-left">Temp</th>
//                                             <th className="border px-2 py-1 text-left">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {battery.cells.map((cell, cellIndex) => ( // Show all cells
//                                             <tr key={cellIndex} className="hover:bg-gray-100">
//                                                 <td className="border px-2 py-1">{cell.cellID}</td>
//                                                 <td className="border px-2 py-1">{cell.stateOfCharge.toFixed(2)}%</td>
//                                                 <td className="border px-2 py-1">{cell.currentTemperature.toFixed(2)} °C</td>
//                                                 <td className="border px-2 py-1">{cell.cellLife}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BatteryManager;
"use client";
import dynamic from "next/dynamic";
const VehicleView = dynamic(() => import("./components/VehicleView"), {
  ssr: false,
});
export default function Home() {
  return (
    <div>
      <h1 className="text-2xl text-center h-[30px]">
        Battery Management System - Team 4
      </h1>
      <div>
        <VehicleView />
      </div>
    </div>
  );
}
