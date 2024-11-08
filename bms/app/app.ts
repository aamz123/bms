// app.ts

import { Battery } from './lib/Battery';
import { createBatteries } from './lib/bmsprocessor';
import { processCharging, processDischarging } from './lib/bmsprocessor';

const cellCount = 100; // Total number of cells
const batteryCount = 1; // Total number of batteries

export let batteries = createBatteries(cellCount, batteryCount); // Create 4 batteries with 25 cells

// User Input Example
const ambientTemperature = 25; // Ambient temperature in °C
const travelDistance = 50;     // Distance in km

// Check if the battery is eligible for charging based on temperature
function isBatteryEligibleForCharging(battery: Battery): boolean {
    return battery.cells.some(cell => cell.cellLife === "Alive" && cell.currentTemperature < 21); // Adjust threshold as needed
}

// Check if the battery is eligible for discharging based on temperature
function isBatteryEligibleForDischarging(battery: Battery): boolean {
    return battery.cells.some(cell => cell.cellLife === "Alive" && cell.currentTemperature < 21); // Adjust threshold as needed
}

// Modify the discharging function to accept a callback for UI updates
export function discharging(updateUI: () => void) {
    // Discharge cells for each battery
    batteries.forEach((battery, index) => {
        if (isBatteryEligibleForDischarging(battery)) {
            console.log(`Processing discharging for Battery ${index + 1}:`);
            processDischarging(battery, travelDistance, ambientTemperature, updateUI); // Pass the updateUI callback
            console.log(`Stats after discharging Battery ${index + 1}:`, battery);
        } else {
            console.log(`Battery ${index + 1} is not eligible for discharging due to temperature limits.`);
        }
    });
}

// Modify the charging function to charge all batteries
export function charging(updateUI: () => void) {
    batteries.forEach((battery, index) => {
        if (isBatteryEligibleForCharging(battery)) {
            console.log(`Charging Battery ${index + 1}:`);
            processCharging(battery, "supercharge"); // Process charging for each battery
            updateUI(); // Call the callback to update the UI after processing
        } else {
            console.log(`Battery ${index + 1} is not eligible for charging due to temperature limits.`);
        }
    });
}

// Exporting the necessary functions
export { processDischarging };
