import { Cell } from "./Cell";
import { DoublyLinkedList } from "./Queue"
import GlobalSettings from './GlobalSettings';
import { MaxHeap } from "./MaxHeap"


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
  cellHeap: MaxHeap<Cell>;
  dischargingCells1: Cell[] = [];
  chargingCells1: Cell[] = [];
  //totalChargeAvailable = 0;

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
    this.cellHeap = new MaxHeap<Cell>((a, b) => a.bestAvailableChargeValue - b.bestAvailableChargeValue);

    this.battery.forEach(cell => {
      this.cellHeap.insert(cell);
    });
    this.reduceIdleTemperature();
    console.log("new battery created")
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

  calculateIdleCellAvgTemperature(): number {
    const totalTemperature = this.cellHeap.heap.reduce(
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

  charge(updateBatteryState: () => void): void {

    // Determine charging parameters based on isSuperCharged
    const isSuperCharged = GlobalSettings.isSuperCharged;
    const numberOfCellsChargedAtATime = isSuperCharged ? 7 : 4;
    const chargeIncrement = isSuperCharged ? 10 : 5;
    const delay = isSuperCharged ? 500 : 1000;

    /*const numberOfCellsChargedAtATime = 4;
    const chargeIncrement = 10;
    const delay = 1000;*/


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
            cell.stateOfCharge = Math.min(cell.stateOfCharge + chargeIncrement, 80);
          } else {
            // Continue charging cells from 80% to 100%
            cell.stateOfCharge = Math.min(cell.stateOfCharge + chargeIncrement, 100);
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
    }, delay); // 1-second delay between charging updates
  }

  public async discharge2(distance: number, updateBatteryState: () => void): Promise<void> {
    this.calculateDischargingBAC();
    var totalChargeNeeded = distance * 10; // total charge percent of needed 
    //this.totalChargeAvailable = 0;
    this.getCells(totalChargeNeeded);

    while (totalChargeNeeded > 0) {
      // const dischargeInterval = setInterval(() => {
      if (this.getTotalAvailabeCharge() >= totalChargeNeeded) {

        // start discharging
        for (let i = 0; i < this.dischargingCells1.length; i++) {
          const cell = this.dischargingCells1[i];


          cell.chargingStatus = "D";
          if (cell.stateOfCharge > 0) {

            // Reduce state of charge by 10%
            cell.stateOfCharge = Math.max(0, cell.stateOfCharge - 10);
            totalChargeNeeded = Math.max(0, totalChargeNeeded - 10);
            if (cell.stateOfCharge == 0 || cell.stateOfCharge == 50) {
              cell.numberOfChargeCycles++;
            }

            // TODO
            // need to add logic to consider ambient temp
            // need to pass in which quadrant the sun is, and then add more temp increment for cells in that quadrant
            // will implement after front end part is completed 
            var quadTemp = GlobalSettings.getQuadrantTemp(cell.getQuadrant());
            console.log("Quadrant " + cell.getQuadrant() + " Temperature is % " + quadTemp)
            cell.temperature = Math.round(cell.temperature + 5 * quadTemp / 100);
            if (cell.temperature > this.calculateIdleCellAvgTemperature() + 5) {
              cell.chargingStatus = "I";
              cell.bestAvailableChargeValue = cell.calculateDischargingBAC();
              this.cellHeap.insert(cell);
              this.dischargingCells1.splice(i, 1);
            }
          }
        }
        updateBatteryState();
      } else {
        this.getCells(totalChargeNeeded);
      }
      console.log(this.calculateIdleCellAvgTemperature());
      console.log("need: " + totalChargeNeeded + "available: " + this.getTotalAvailabeCharge() + "lenght: " + this.dischargingCells1.length);
      await this.sleep(200);

    }
    this.pushBackIntoHeap();
    console.log("heaplenght" + this.cellHeap.heap.length)
  }

  public async charge2(numberOfCellsChargedAtATime: number, updateBatteryState: () => void) {
    this.calculateChargingBAC();
    while (this.calculateStateOfCharge() != 100) {
      this.getChargingCells(numberOfCellsChargedAtATime);
      for (let i = 0; i < this.chargingCells1.length; i++) {
        var cell = this.chargingCells1[i];
        cell.chargingStatus = "C";
        if (cell.stateOfCharge < 100) {
          cell.stateOfCharge = Math.min(100, cell.stateOfCharge + 10);
          var quadTemp = GlobalSettings.getQuadrantTemp(cell.getQuadrant());
          cell.temperature = Math.round(cell.temperature + 5 * quadTemp / 100);
          if (cell.temperature > 80) {
            cell.chargingStatus = "I";
            cell.bestAvailableChargeValue = cell.calculateChargingBAC();
            this.cellHeap.insert(cell);
            this.chargingCells1.splice(i, 1);
          }
        }
      }
      updateBatteryState();
      await this.sleep(400);
    }
    this.pushBackIntoHeap();
    console.log("heaplenght" + this.cellHeap.heap.length)
  }

  private pushBackIntoHeap() {
    this.dischargingCells1.forEach(cell => {
      cell.chargingStatus = "I"
      var index = this.cellHeap.heap.findIndex(c => c.cellId == cell.cellId)
      if (index == -1) {
        this.cellHeap.insert(cell);
      } else {
        this.cellHeap.heap[index] = cell;
      }
    });
    this.dischargingCells1 = [];

    this.chargingCells1.forEach(cell => {
      cell.chargingStatus = "I"
      var index = this.cellHeap.heap.findIndex(c => c.cellId == cell.cellId)
      if (index == -1) {
        this.cellHeap.insert(cell);
      } else {
        this.cellHeap.heap[index] = cell;
      }
    })
    this.chargingCells1 = [];
  }

  private calculateChargingBAC() {
    this.cellHeap.heap.forEach(cell => {
      cell.bestAvailableChargeValue = cell.calculateChargingBAC();
    })
    this.cellHeap.reheap();
  }

  private calculateDischargingBAC() {
    this.cellHeap.heap.forEach(cell => {
      cell.bestAvailableChargeValue = cell.calculateDischargingBAC();
    })
    this.cellHeap.reheap();
  }

  private getCells(totalChargeNeeded: number) {
    while (this.getTotalAvailabeCharge() < totalChargeNeeded) {
      var cell = this.cellHeap.extractMax();
      if (cell) {
        this.dischargingCells1.push(cell);
      }
    }
  }

  private getTotalAvailabeCharge(): number {
    var totalAvailable = 0;
    this.dischargingCells1.forEach(cell => {
      totalAvailable += cell.stateOfCharge;
    });
    return totalAvailable;
  }

  private getChargingCells(maxCellCount: number) {
    for (var i = 0; i < maxCellCount; i++) {
      var cell = this.cellHeap.extractMax();
      if (cell) {
        this.chargingCells1.push(cell);
      }
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private reduceIdleTemperature() {
    const reduceTemp = setInterval(() => {
      this.cellHeap.heap.forEach(cell => {
        if (cell.chargingStatus == "I" && cell.temperature > 25) {
          cell.temperature -= 1
          cell.bestAvailableChargeValue = cell.calculateDischargingBAC();
        }
      });
      //console.log("reduced")
    }, 1000);
  }


  getQuadrant(cellId: number): number {
    if (cellId < 0 || cellId > 99) {
      throw new Error("cellId must be between 0 and 99");
    }

    const row = Math.floor(cellId / 10);
    const col = cellId % 10;

    if (row < 5 && col < 5) {
      return 1; // Quadrant 1
    } else if (row < 5 && col >= 5) {
      return 2; // Quadrant 2
    } else if (row >= 5 && col < 5) {
      return 3; // Quadrant 3
    } else {
      return 4; // Quadrant 4
    }
  }
}
