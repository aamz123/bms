import { Cell } from "./Cell";
import {DoublyLinkedList} from "./Queue"


export class Battery {
  battery: Cell[]; // Array to hold 100 cells
  batteryTemperature: number; // Average temperature of the battery
  batteryVoltage: number; // Average voltage of the battery
  numberOfCellsCharging: number; // Number of cells currently charging
  numberOfCellsDischarging: number; // Number of cells currently discharging
  stateOfCharge: number; // Average state of charge for the battery
  numberOfDeadCells: number; // Number of dead cells, default to 0
  dischargeQueue: DoublyLinkedList //Queue if we are following approach 2. 

  constructor() {
    this.battery = Array.from({ length: 100 }, (_, cellId) => new Cell(cellId));
    this.batteryTemperature = this.calculateBatteryTemperature();
    this.batteryVoltage = this.calculateBatteryVoltage();
    this.numberOfCellsCharging = 0;
    this.numberOfCellsDischarging = 0;
    this.stateOfCharge = this.calculateStateOfCharge();
    this.numberOfDeadCells = 0; // Default to 0 for now
    this.dischargeQueue = new DoublyLinkedList(100); //initialize discharge queue. 
    
  }

  // Calculate the average temperature of the battery
  calculateBatteryTemperature(): number {
    const totalTemperature = this.battery.reduce((total, cell) => total + cell.temperature, 0);
    return totalTemperature / this.battery.length;
  }

  // Calculate the average voltage of the battery
  calculateBatteryVoltage(): number {
    const totalVoltage = this.battery.reduce((total, cell) => total + cell.voltage, 0);
    return totalVoltage / this.battery.length;
  }

  // Calculate the average state of charge of the battery
  calculateStateOfCharge(): number {
    const totalStateOfCharge = this.battery.reduce((total, cell) => total + cell.stateOfCharge, 0);
    return totalStateOfCharge / this.battery.length;
  }

  // Function to update the number of cells charging or discharging
  updateCellStatus() {
    this.numberOfCellsCharging = this.battery.filter(cell => cell.chargingStatus === 'C').length;
    this.numberOfCellsDischarging = this.battery.filter(cell => cell.chargingStatus === 'D').length;
  }


  discharge(numberOfCells: number, setBatteryState: React.Dispatch<React.SetStateAction<Battery>>): void {
    
    
    
    const dischargedCells = this.dischargeQueue.removeNodes(numberOfCells);
    const cellIndices = dischargedCells.map(cellNode => cellNode.cellId);

    // Gradually discharge all selected cells simultaneously
    const dischargeInterval = setInterval(() => {
        
      let allDepleted = true;

      const updatedBattery = { ...this, battery: [...this.battery] };
        cellIndices.forEach(index => {
            const cell = updatedBattery.battery[index];
            if (cell.stateOfCharge > 0) {
                // Reduce state of charge by 10%
                cell.stateOfCharge = Math.max(0, cell.stateOfCharge - 10);
                allDepleted = false; // Mark that at least one cell is still discharging
            }
        });

        
        console.log(`Current state of charge for cells: ${cellIndices.map(index => updatedBattery.battery[index].stateOfCharge).join(", ")}`);
        // Trigger a UI re-render by updating the state
        setBatteryState(updatedBattery);


        // Stop interval if all cells are fully discharged
        if (allDepleted) {
            clearInterval(dischargeInterval);
            console.log("All selected cells have been fully discharged.");
        }
    }, 1000); // 1 second delay for each 10% discharge

    
  }

}

