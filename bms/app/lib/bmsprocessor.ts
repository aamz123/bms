// bmsProcessor.ts

import { Cell } from './Cell';
import { Battery } from './Battery';

// Constants
const THRESHOLD_TEMPERATURE = 21; // Maximum allowable temperature in °C
const OPTIMAL_TEMPERATURE = 17; // Optimal temperature in °C
const TEMP_INCREASE_RATE = 1; // Temperature increase rate per discharge/charge cycle
const COOLDOWN_RATE = 0.5; // Temperature decrease rate per cooldown cycle
const CHARGE_RATE_BASE = 10; // Base charging rate per unit time
const DISCHARGE_INTERVAL = 1000; // Discharge every second
const DISCHARGE_AMOUNT_PER_INTERVAL = 5; // Amount to discharge per interval

// Create mock cells
export const createMockCells = (count: number): Cell[] => {
    return Array.from({ length: count }, (_, i) => new Cell(i));
};

// Create batteries with cells
export const createBatteries = (cellCount: number, batteryCount: number): Battery[] => {
    const cells = createMockCells(cellCount);
    const batteries: Battery[] = [];
    const cellsPerBattery = cellCount / batteryCount;
    
    for (let i = 0; i < batteryCount; i++) {
        const batteryCells = cells.slice(i * cellsPerBattery, (i + 1) * cellsPerBattery);
        batteries.push(new Battery(batteryCells));
    }

    return batteries;
};

// Charging Process
export function processCharging(battery: Battery, chargeMode: "supercharge" | "plugIn"): void {
    const chargingRate = chargeMode === "supercharge" ? CHARGE_RATE_BASE * 2 : CHARGE_RATE_BASE;

    const eligibleCells = battery.cells.filter(cell =>
        cell.currentTemperature < THRESHOLD_TEMPERATURE
    );

    eligibleCells.sort((a, b) => a.currentTemperature - b.currentTemperature);

    if (eligibleCells.length > 0) {
        const targetCell = eligibleCells[0];
        targetCell.charge(chargingRate);
        targetCell.currentTemperature += TEMP_INCREASE_RATE; // Increase temperature on charging

        if (targetCell.currentTemperature >= THRESHOLD_TEMPERATURE) {
            console.log(`Charging stopped for Cell ${targetCell.cellID} due to high temperature.`);
            targetCell.canDischarge = false;

            const nextEligibleCells = battery.cells.filter(cell =>
                cell.currentTemperature < THRESHOLD_TEMPERATURE && cell.canDischarge
            );

            if (nextEligibleCells.length > 0) {
                const nextCell = nextEligibleCells[0];
                console.log(`Switching charging to Cell ${nextCell.cellID}`);
                processCharging(battery, chargeMode); // Recursively call charging
            }
        }
    } else {
        console.log("No eligible cells to charge.");
    }

    coolDownCells(battery.cells); // Apply cooling during charging
    battery.updateBatteryStats();
}

// Discharging Process
export function processDischarging(battery: Battery, travelDistance: number, ambientTemperature: number, updateUI: () => void) {
    const totalPowerNeeded = calculatePowerNeeded(travelDistance);
    let remainingPowerNeeded = totalPowerNeeded;
    let currentCell: Cell | null = null;

    console.log("Total power needed:", totalPowerNeeded);

    const dischargeInterval = setInterval(() => {
        if (remainingPowerNeeded <= 0) {
            clearInterval(dischargeInterval);
            console.log("Discharging completed.");
            return;
        }

        const eligibleCells = battery.cells.filter(cell =>
            cell.cellLife === "Alive" &&
            cell.currentTemperature < THRESHOLD_TEMPERATURE &&
            cell.canDischarge
        );

        if (eligibleCells.length > 0) {
            if (!currentCell || !eligibleCells.includes(currentCell)) {
                const randomIndex = Math.floor(Math.random() * eligibleCells.length);
                currentCell = eligibleCells[randomIndex];
                console.log(`Switching to Cell ${currentCell.cellID}`);
            }

            const dischargeAmount = Math.min(getRandomDischargeAmount(DISCHARGE_AMOUNT_MIN, DISCHARGE_AMOUNT_MAX), remainingPowerNeeded);
            console.log(`Discharging Cell ${currentCell.cellID} by ${dischargeAmount}`);
            currentCell.discharge(dischargeAmount);
            remainingPowerNeeded -= dischargeAmount;

            currentCell.currentTemperature += TEMP_INCREASE_RATE;

            if (currentCell.currentTemperature >= THRESHOLD_TEMPERATURE) {
                console.log(`Cell ${currentCell.cellID} reached temperature threshold. Cooling down.`);
                currentCell.canDischarge = false;

                switchToNextCell(battery, currentCell);
                currentCell = null; // Reset current cell
            }

            updateUI(); // Update the UI after each discharge
        } else {
            console.log("No eligible cells to discharge.");
        }

        coolDownCells(battery.cells); // Cool down cells after each discharge cycle
        battery.updateBatteryStats();
    }, DISCHARGE_INTERVAL);
}

// Cooling function for cells
const coolDownCells = (cells: Cell[]) => {
    cells.forEach(cell => {
        if (!cell.canDischarge) {
            if (cell.currentTemperature > OPTIMAL_TEMPERATURE) {
                cell.currentTemperature -= COOLDOWN_RATE;
            }

            if (cell.currentTemperature <= OPTIMAL_TEMPERATURE) {
                cell.canDischarge = true; // Allow discharging again after cooling
                console.log(`Cell ${cell.cellID} has cooled down and can discharge again.`);
            }
        }
    });
};

// Calculate power required for the travel distance
function calculatePowerNeeded(distance: number): number {
    const powerPerKm = 10; // Power needed per km (adjust as needed)
    return distance * powerPerKm;
}

// Switch to the next cell that is not adjacent to the current one
function switchToNextCell(battery: Battery, currentCell: Cell): void {
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

// Get a random discharge amount within the specified range
function getRandomDischargeAmount(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

// Update the constants for discharge
const DISCHARGE_AMOUNT_MIN = 1;
const DISCHARGE_AMOUNT_MAX = 5;
