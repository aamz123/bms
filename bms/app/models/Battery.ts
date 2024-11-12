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
  dischargeQueue: DoublyLinkedList; //Queue if we are following approach 2.
  dischargedCells: number[];
  chargingQueue: number[];
  observers: Function[] = [];

  constructor() {
    this.battery = Array.from({ length: 100 }, (_, cellId) => new Cell(cellId));
    this.batteryTemperature = this.calculateBatteryTemperature();
    this.batteryVoltage = this.calculateBatteryVoltage();
    this.numberOfCellsCharging = 0;
    this.numberOfCellsDischarging = 0;
    this.stateOfCharge = this.calculateStateOfCharge();
    this.numberOfDeadCells = 0; // Default to 0 for now
    this.dischargeQueue = new DoublyLinkedList(100); //initialize discharge queue.
    this.dischargedCells = [];
    this.chargingQueue = [];
  }

  // Method to add observers
  addObserver(observer: Function) {
    this.observers.push(observer);
  }

  // Notify observers about state changes
  notifyObservers() {
    this.observers.forEach((observer) => observer());
  }

  // Calculate the average temperature of the battery
  calculateBatteryTemperature(): number {
    const totalTemperature = this.battery.reduce(
      (total, cell) => total + cell.temperature,
      0
    );
    return totalTemperature / this.battery.length;
  }

  // Calculate the average voltage of the battery
  calculateBatteryVoltage(): number {
    const totalVoltage = this.battery.reduce(
      (total, cell) => total + cell.voltage,
      0
    );
    return totalVoltage / this.battery.length;
  }

  // Calculate the average state of charge of the battery
  calculateStateOfCharge(): number {
    const totalStateOfCharge = this.battery.reduce(
      (total, cell) => total + cell.stateOfCharge,
      0
    );
    return totalStateOfCharge / this.battery.length;
  }

  // Function to update the number of cells charging or discharging
  updateCellStatus() {
    this.numberOfCellsCharging = this.battery.filter(
      (cell) => cell.chargingStatus === "C"
    ).length;
    this.numberOfCellsDischarging = this.battery.filter(
      (cell) => cell.chargingStatus === "D"
    ).length;
  }

  discharge(numberOfCells: number, updateBatteryState: () => void): void {
    const dischargedCellNodes = this.dischargeQueue.removeNodes(numberOfCells);
    const cellIndices = dischargedCellNodes.map((cellNode) => cellNode.cellId);
    this.dischargedCells.push(...cellIndices);

    //change charge status of all the cells to D
    cellIndices.forEach((index) => {
      const cell = this.battery[index];
      cell.chargingStatus = "D"; // Mark as discharging
    });

    // Gradually discharge all selected cells simultaneously
    const dischargeInterval = setInterval(() => {
      let allDepleted = true;

      cellIndices.forEach((index) => {
        const cell = this.battery[index];
        if (cell.stateOfCharge > 0) {
          // Reduce state of charge by 10%
          cell.stateOfCharge = Math.max(0, cell.stateOfCharge - 10);
          cell.chargingStatus = "C";
          allDepleted = false; // Mark that at least one cell is still discharging
        }
      });

      // Trigger a UI re-render by updating the state
      updateBatteryState();

      // Stop interval if all cells are fully discharged
      if (allDepleted) {
        clearInterval(dischargeInterval);
        console.log("All selected cells have been fully discharged.");

        //change charge status of all the cells to Idle
        cellIndices.forEach((index) => {
          const cell = this.battery[index];
          cell.chargingStatus = "I"; // Mark as idle
        });
      }
    }, 1000); // 1 second delay for each 10% discharge
  }

  charge(
    numberOfCellsChargedAtATime: number,
    updateBatteryState: () => void
  ): void {
    // Move discharged cells to charging queue
    this.chargingQueue.push(...this.dischargedCells);
    this.dischargedCells = []; // Clear discharged cells

    //change charge status of all the cells to C
    this.chargingQueue.forEach((index) => {
      const cell = this.battery[index];
      cell.chargingStatus = "C"; // Mark as discharging
    });

    let currentBatchStartIndex = 0;
    let allCellsBelow100 = true;

    const chargingInterval = setInterval(() => {
      // Stop charging when all cells are at 100%
      if (!allCellsBelow100) {
        clearInterval(chargingInterval);
        console.log("Charging complete for all cells.");
        return;
      }

      allCellsBelow100 = false; // Reset flag, assume all cells are at 100% unless proven otherwise

      // Get the next batch of cells to charge
      const cellsToCharge = this.chargingQueue.slice(
        currentBatchStartIndex,
        currentBatchStartIndex + numberOfCellsChargedAtATime
      );

      // Charge each cell in the current batch by 10% if they haven't reached 80% or 100%
      cellsToCharge.forEach((cellIndex) => {
        const cell = this.battery[cellIndex];

        if (cell.stateOfCharge < 100) {
          allCellsBelow100 = true; // At least one cell still needs charging, so keep the interval going

          // If cell is below 80%, charge up to 80%, then stop until all cells in the batch reach 80%
          if (cell.stateOfCharge < 80) {
            cell.stateOfCharge = Math.min(cell.stateOfCharge + 10, 80);
          } else {
            // Continue charging cells from 80% to 100%
            cell.stateOfCharge = Math.min(cell.stateOfCharge + 10, 100);
          }

          // Update UI with the latest state
          updateBatteryState();
          console.log(`Charging cell ${cellIndex} to ${cell.stateOfCharge}%`);

          // Move fully charged cells to the discharging queue
          if (cell.stateOfCharge === 100) {
            cell.chargingStatus = 'I';
            this.dischargeQueue.addNode(cellIndex);
            console.log(
              `Cell ${cellIndex} is fully charged and moved to the discharge queue.`
            );
          }
        }
      });

      // If all cells in the batch are 80% or above, move to the next batch
      const allBatchCellsAtTarget = cellsToCharge.every(
        (cellIndex) => this.battery[cellIndex].stateOfCharge >= 80
      );

      if (allBatchCellsAtTarget) {
        currentBatchStartIndex += numberOfCellsChargedAtATime;

        // Reset to the first batch if all cells in `chargingQueue` have reached 80% but aren't all at 100%
        if (currentBatchStartIndex >= this.chargingQueue.length) {
          currentBatchStartIndex = 0;
        }

        // Filter out cells already at 100% to avoid charging them again
        this.chargingQueue = this.chargingQueue.filter(
          (cellIndex) => this.battery[cellIndex].stateOfCharge < 100
        );
      }
    }, 1000); // 1-second delay between charging updates
  }
}

