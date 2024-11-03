// bmsProcessor.ts

import { Cell } from './Cell';
import { Battery } from './Battery';

// Constants
const THRESHOLD_TEMPERATURE = 21; // Maximum allowable temperature in °C
const TEMP_INCREASE_RATE = 1; // Increase temperature by 1°C per discharge cycle
const COOLDOWN_RATE = 0.5; // Temperature decrease per cooldown cycle (optional: increase to make cooling more effective)
const CHARGE_RATE_BASE = 10; // Base charging rate per unit time (increase for more prominent charging)
const DISCHARGE_INTERVAL = 1000; // Discharge every second
const DISCHARGE_AMOUNT_PER_INTERVAL = 5; // Amount to discharge per interval (increase for more prominent discharge)

// Create mock cells
export const createMockCells = (count: number): Cell[] => {
    return Array.from({ length: count }, (_, i) => new Cell(i));
};

// Create batteries with cells
export const createBatteries = (cellCount: number, batteryCount: number): Battery[] => {
    const cells = createMockCells(cellCount);
    const batteries: Battery[] = [];

    // Distribute cells into batteries
    const cellsPerBattery = cellCount / batteryCount; // 100 / 4 = 25 cells per battery
    for (let i = 0; i < batteryCount; i++) {
        const batteryCells = cells.slice(i * cellsPerBattery, (i + 1) * cellsPerBattery);
        batteries.push(new Battery(batteryCells));
    }

    return batteries;
};

export function processCharging(battery: Battery, chargeMode: "supercharge" | "plugIn"): void {
    const chargingRate = chargeMode === "supercharge" ? CHARGE_RATE_BASE * 2 : CHARGE_RATE_BASE;

    const eligibleCells = battery.cells.filter(cell =>
        cell.currentTemperature < THRESHOLD_TEMPERATURE
    );

    eligibleCells.sort((a, b) => a.currentTemperature - b.currentTemperature);

    if (eligibleCells.length > 0) {
        const targetCell = eligibleCells[0];

        // Charge the target cell
        targetCell.charge(chargingRate);
        targetCell.currentTemperature += TEMP_INCREASE_RATE; // This can also be adjusted to increase the rate of heating.

        // Check if the target cell exceeds the temperature threshold
        if (targetCell.currentTemperature >= THRESHOLD_TEMPERATURE) {
            console.log(`Charging stopped for Cell ${targetCell.cellID} due to high temperature.`);
            targetCell.canDischarge = false; // Prevent further charging from this cell

            // Optionally, switch to another cell if charging is still needed
            const nextEligibleCells = battery.cells.filter(cell =>
                cell.currentTemperature < THRESHOLD_TEMPERATURE && cell.canDischarge
            );

            if (nextEligibleCells.length > 0) {
                const nextCell = nextEligibleCells[0];
                console.log(`Switching charging to Cell ${nextCell.cellID}`);
                processCharging(battery, chargeMode); // Recursively call charging for the next eligible cell
            }
        }
    } else {
        console.log("No eligible cells to charge.");
    }

    // Cool down all cells not actively charging
    coolDownCells(battery.cells);
    battery.updateBatteryStats();
}



export function processDischarging(battery: Battery, travelDistance: number, ambientTemperature: number, updateUI: () => void) {
    const totalPowerNeeded = calculatePowerNeeded(travelDistance);
    let remainingPowerNeeded = totalPowerNeeded;
    let currentCell: Cell | null = null; // Track the current cell being discharged

    console.log("Total power needed:", totalPowerNeeded);

    const dischargeInterval = setInterval(() => {
        if (remainingPowerNeeded <= 0) {
            clearInterval(dischargeInterval);
            console.log("Discharging completed.");
            return;
        }

        // Filter cells eligible for discharging
        const eligibleCells = battery.cells.filter(cell =>
            cell.cellLife === "Alive" &&
            cell.currentTemperature < THRESHOLD_TEMPERATURE &&
            cell.canDischarge
        );

        if (eligibleCells.length > 0) {
            // If there's no current cell or the current cell is not eligible, choose a new one
            if (!currentCell || !eligibleCells.includes(currentCell)) {
                const randomIndex = Math.floor(Math.random() * eligibleCells.length);
                currentCell = eligibleCells[randomIndex];
                console.log(`Switching to Cell ${currentCell.cellID}`);
            }

            // Use the random discharge amount
            const dischargeAmount = Math.min(getRandomDischargeAmount(DISCHARGE_AMOUNT_MIN, DISCHARGE_AMOUNT_MAX), remainingPowerNeeded);
            console.log(`Discharging Cell ${currentCell.cellID} by ${dischargeAmount}`);
            currentCell.discharge(dischargeAmount);
            remainingPowerNeeded -= dischargeAmount;

            // Increase the temperature prominently
            currentCell.currentTemperature += TEMP_INCREASE_RATE;

            // Check if the selected cell's temperature exceeds the threshold after discharging
            if (currentCell.currentTemperature >= THRESHOLD_TEMPERATURE) {
                console.log(`Cell ${currentCell.cellID} reached temperature threshold. Cooling down.`);
                currentCell.canDischarge = false; // Prevent further discharging from this cell

                // Switch to the next cell
                switchToNextCell(battery, currentCell);
                currentCell = null; // Reset current cell
            }

            // Update the UI after each discharge
            updateUI();
        } else {
            console.log("No eligible cells to discharge.");
        }

        // Cool down all cells after each discharge interval
        coolDownCells(battery.cells);

        // Update battery stats after discharging
        battery.updateBatteryStats();
    }, DISCHARGE_INTERVAL);
}

// Cooling function for cells
const coolDownCells = (cells: Cell[]) => {
    cells.forEach(cell => {
        if (!cell.canDischarge) {
            if (cell.currentTemperature > 17) { // Assuming 17°C as the optimal cool down temperature
                cell.currentTemperature -= COOLDOWN_RATE; // Decrease temperature during cooldown
            }
            // If cooled down sufficiently, allow discharging again
            if (cell.currentTemperature <= 17) {
                cell.canDischarge = true; // Allow discharging again
                console.log(`Cell ${cell.cellID} has cooled down and can discharge again.`);
            }
        }
    });
};

// Utility function to calculate power needed based on distance
function calculatePowerNeeded(distance: number): number {
    const powerPerKm = 10; // Adjust this based on your requirements
    return distance * powerPerKm;
}


function switchToNextCell(battery: Battery, currentCell: Cell): void {
    // Logic to find a non-adjacent cell within the battery
    const availableCells = battery.cells.filter(cell =>
        cell.cellLife === "Alive" &&
        cell.currentTemperature < THRESHOLD_TEMPERATURE &&
        Math.abs(cell.cellID - currentCell.cellID) > 1
    );
    const nextCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (nextCell) {
        console.log(`Switching to Cell ${nextCell.cellID}`);
    }
}

// Utility function to get a random discharge amount within a specified range
function getRandomDischargeAmount(min: number, max: number): number {
    return Math.random() * (max - min) + min; // Random value between min and max
}



// Update DISCHARGE_AMOUNT_PER_INTERVAL in your constants
const DISCHARGE_AMOUNT_MIN = 1; // Minimum amount to discharge
const DISCHARGE_AMOUNT_MAX = 5; // Maximum amount to discharge

