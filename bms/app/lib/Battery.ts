// Battery.ts

import { Cell, CellLifeStatus } from './Cell';

// Battery class to manage overall battery status and cells
export class Battery {
    cells: Cell[];
    overallChargeLevel!: number;
    overallVoltage!: number;
    overallTemperature!: number;
    overallHealthStatus!: number;
    numberOfDeadCells!: number;

    constructor(cells: Cell[]) {
        this.cells = cells;
        this.updateBatteryStats();
    }

    // Calculate overall battery stats
    updateBatteryStats(): void {
        this.overallChargeLevel = this.calculateOverallCharge();
        this.overallVoltage = this.calculateOverallVoltage();
        this.overallTemperature = this.calculateOverallTemperature();
        this.overallHealthStatus = this.calculateOverallHealth();
        this.numberOfDeadCells = this.calculateDeadCells();
    }

    // Calculate overall charge level by averaging the SoC of all cells
    calculateOverallCharge(): number {
        const totalSoC = this.cells.reduce((acc, cell) => acc + cell.stateOfCharge, 0);
        return totalSoC / this.cells.length;
    }

    // Calculate overall voltage by summing up voltages of all cells
    calculateOverallVoltage(): number {
        return this.cells.reduce((acc, cell) => acc + cell.voltage, 0);
    }

    // Calculate overall temperature by averaging temperatures of all cells
    calculateOverallTemperature(): number {
        const totalTemperature = this.cells.reduce((acc, cell) => acc + cell.currentTemperature, 0);
        return totalTemperature / this.cells.length;
    }

    // Calculate overall health status based on individual cell health statuses
    calculateOverallHealth(): number {
        const totalHealth = this.cells.reduce((acc, cell) => acc + cell.healthStatus, 0);
        return totalHealth / this.cells.length;
    }

    // Calculate the number of dead cells in the battery
    calculateDeadCells(): number {
        return this.cells.filter(cell => cell.cellLife === "Dead").length;
    }

    // Discharge cells based on distance and ambient temperature
    dischargeCells(distance: number, ambientTemperature: number): void {
        const requiredDischarge = this.calculateRequiredDischarge(distance);

        // Discharge cells based on temperature; cells closer to ambient temperature are prioritized
        this.cells.forEach(cell => {
            if (cell.cellLife === "Alive") {
                // Calculate temperature factor (1 when temp matches ambient, decreasing as it diverges)
                const temperatureFactor = 1 - Math.min(Math.abs(cell.currentTemperature - ambientTemperature) / 100, 1);
                const dischargeRate = Math.max(requiredDischarge * temperatureFactor, 0);

                // Discharge cell and update its state of charge
                cell.stateOfCharge = Math.max(cell.stateOfCharge - dischargeRate, 0);
                if (cell.stateOfCharge === 0) {
                    cell.cellLife = "Dead"; // Mark the cell as dead if the charge is depleted
                }
            }
        });

        // Update overall battery stats after discharge
        this.updateBatteryStats();
    }

    // Calculate discharge based on target distance (assuming energy per km)
    calculateRequiredDischarge(distance: number): number {
        const energyPerKm = 1; // Placeholder: energy consumption per km, adjust as needed
        return distance * energyPerKm;
    }
}
