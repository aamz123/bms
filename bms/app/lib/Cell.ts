// Cell.ts

// Type for cell life status
export type CellLifeStatus = "Alive" | "Dead";

// Cell class with individual cell attributes
export class Cell {
    cellID: number;
    stateOfCharge: number; // State of Charge (SoC) in percentage
    capacity: number;      // Capacity in watt-hours (Wh)
    currentTemperature: number; // Real-time temperature in °C
    cycleCount: number;     // Total charging cycles completed
    healthStatus: number;   // Health Status in percentage
    voltage: number;        // Voltage in volts (V)
    cellLife: CellLifeStatus; // Dead/Alive status
    canDischarge: boolean;   // Property to track if the cell can discharge

    constructor(
        cellID: number,
        stateOfCharge: number = 100,
        capacity: number = 25,
        currentTemperature: number = 17,
        cycleCount: number = 0,
        healthStatus: number = 100,
        voltage: number = 1.5,
        cellLife: CellLifeStatus = "Alive"
    ) {
        this.cellID = cellID;
        this.stateOfCharge = stateOfCharge;
        this.capacity = capacity;
        this.currentTemperature = currentTemperature;
        this.cycleCount = cycleCount;
        this.healthStatus = healthStatus;
        this.voltage = voltage;
        this.cellLife = cellLife;
        this.canDischarge = true; // Initially, the cell can discharge
    }

    // Calculate remaining lifespan based on cycle count and health status
    updateHealthStatus(): void {
        // Placeholder calculation for cell health based on cycles
        this.healthStatus = Math.max(100 - this.cycleCount * 0.5, 0);
    }

    // Method to charge the cell
    charge(amount: number): void {
        // Charge the cell, ensuring the change is in increments of 1
        if (amount > 0) {
            const chargeIncrement = Math.min(amount, 100 - this.stateOfCharge);
            this.stateOfCharge += Math.max(chargeIncrement, 1); // Charge must be at least 1
            // Ensure the charge does not exceed 100%
            if (this.stateOfCharge > 100) {
                this.stateOfCharge = 100;
            }
        }
    }

    // Method to discharge the cell
    discharge(amount: number): void {
        console.log(`Discharging cell ${this.cellID}`);
        if (this.stateOfCharge > 0 && this.cellLife === "Alive" && this.canDischarge) {
            // Discharge in increments of 1
            const dischargeAmount = Math.min(amount, this.stateOfCharge);
            this.stateOfCharge -= Math.max(dischargeAmount, 1); // Ensure decrement is at least 1
            
            // Increase temperature by a fixed amount of 0.5 per discharge
            this.currentTemperature += 0.5; // Increase temperature

            this.updateHealthStatus(); // Update health based on usage

            // Check if temperature threshold is reached to set cooldown
            if (this.currentTemperature >= 21) { // Assuming 21°C is the threshold
                console.log(`Cell ${this.cellID} reached temperature threshold. Cooling down.`);
                this.canDischarge = false; // Prevent further discharging
            }
        }
    }

    // Method to cool down the cell
    coolDown(): void {
        // Decrease temperature during cooldown
        if (this.currentTemperature > 17) { // Assuming 17°C as the optimal cool down temperature
            this.currentTemperature -= 0.5; // Decrease temperature

            // If cooled down sufficiently, allow discharging again
            if (this.currentTemperature <= 17) {
                this.canDischarge = true; // Allow discharging again
            }
        }
    }
}
