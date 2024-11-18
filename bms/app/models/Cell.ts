// Cell.ts
export class Cell {
    cellId: number;         // Unique ID for each cell in the grid. This is also the index of the Battery array
    stateOfCharge: number; // Percentage of charge (0-100)
    chargeColor: string;   // Color for UI representation (e.g., based on stateOfCharge)
    temperature: number;   // Temperature of the individual cell (in °C)
    voltage: number;       // Voltage of the individual cell
    numberOfChargeCycles: number; // Number of charge cycles
    bestAvailableChargeValue: number; // Best available charge value (calculated)
    quadrant: number;       // Quadrant where the cell is located in the 10x10 grid
    chargingStatus: 'C' | 'D' | 'I'; // Charging status: C - Charging, D - Discharging, I - Idle. Update this when charging discharging
  
    constructor(cellId: number) {
      this.cellId = cellId;
      this.stateOfCharge = 100; // Default 100% charge
      this.chargeColor = this.getCellChargeColor(); 
      this.temperature = 25; // Default room temperature
      this.voltage = 3.7; // Typical voltage for a lithium-ion cell
      this.numberOfChargeCycles = 0; // Default number of cycles
      this.bestAvailableChargeValue = this.calculateDischargingBAC();
      this.quadrant = this.getQuadrant(); // Determine quadrant when the cell is created
      this.chargingStatus = 'I';
    }
  
    // Method to calculate best available charge value based on some formula
    calculateBestAvailableChargeValue(): number {
      // Steve to implement this method
      return ( 1
      );
    }

    // Method to get charge color based on stateOfCharge percentage
  getCellChargeColor(): string {
    
    if (this.stateOfCharge < 20) return "bg-[#FF4C4C]"; // Red
    if (this.stateOfCharge >= 20 && this.stateOfCharge < 40) return "bg-[#FFA94C]"; // Orange
    if (this.stateOfCharge >= 40 && this.stateOfCharge < 60) return "bg-[#FFD700]"; // Gold
    if (this.stateOfCharge >= 60 && this.stateOfCharge < 80) return "bg-[#A3E635]"; // Lime Green
    if(this.stateOfCharge == 80 && this.chargingStatus == 'C') return "bg-[#FF4C4C]"
    return "bg-[#4CAF50]"; // Forest Green (for charge 80% and above)
  }

  // Function to get the quadrant number based on the index of the cell
  getQuadrant(): number {
    const row = Math.floor(this.cellId / 10);  // Determine the row (0–9)
    const col = this.cellId % 10;              // Determine the column (0–9)

    // Quadrants are divided as:
    // Quadrant 1: (row: 0-4, col: 0-4)
    // Quadrant 2: (row: 0-4, col: 5-9)
    // Quadrant 3: (row: 5-9, col: 0-4)
    // Quadrant 4: (row: 5-9, col: 5-9)

    if (row < 5) {
      return col < 5 ? 1 : 2; // Quadrant 1 (top-left), Quadrant 2 (top-right)
    } else {
      return col < 5 ? 3 : 4; // Quadrant 3 (bottom-left), Quadrant 4 (bottom-right)
    }
  }

  calculateDischargingBAC() : number{
    return 1/(this.temperature+1) * 1/(this.numberOfChargeCycles+1) * this.stateOfCharge;
  }

  calculateChargingBAC() : number {
    return 1/(this.temperature+1) * 1/(this.numberOfChargeCycles+1) * 1/(this.stateOfCharge);
  }

  }
  