import GlobalSettings from './GlobalSettings';

export class Node {
    cellId: number;
    next: Node | null;
    prev: Node | null;
  
    constructor(cellId: number) {
      this.cellId = cellId;
      this.next = null;
      this.prev = null;
    }
  }
  
  export  class DoublyLinkedList {
    head: Node | null;
    tail: Node | null;
    size: number;
  
    constructor(size: number) {
      this.head = null;
      this.tail = null;
      this.size = 0;
  
      const ids = Array.from({ length: size }, (_, i) => i); // Cell IDs from 0 to size-1
      this.shuffle(ids);
      ids.forEach(id => this.addNode(id));
    }
  
    shuffle(arr: number[]): void {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  
    addNode(cellId: number): void {
      const newNode = new Node(cellId);
      if (this.tail) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      } else {
        this.head = this.tail = newNode;
      }
      this.size++;
    }
  
    removeNodes(count: number): Node[] {
      const isSkipQuadrant1 = GlobalSettings.isSkipQuadrant1;
      const isSkipQuadrant2 = GlobalSettings.isSkipQuadrant2;
      const isSkipQuadrant3 = GlobalSettings.isSkipQuadrant3;
      const isSkipQuadrant4 = GlobalSettings.isSkipQuadrant4;
    
      // If all skip flags are true, consider them as false
      if (isSkipQuadrant1 && isSkipQuadrant2 && isSkipQuadrant3 && isSkipQuadrant4) {
        GlobalSettings.isSkipQuadrant1 = false;
        GlobalSettings.isSkipQuadrant2 = false;
        GlobalSettings.isSkipQuadrant3 = false;
        GlobalSettings.isSkipQuadrant4 = false;
      }
    
      const dischargedCells: Node[] = [];
      let removedCount = 0;
      let currentNode = this.head;
    
      while (removedCount < count && currentNode !== null) {
        const cellId = currentNode.cellId;
        const quadrant = getQuadrant(cellId);
    
        if (
          (quadrant === 1 && isSkipQuadrant1) ||
          (quadrant === 2 && isSkipQuadrant2) ||
          (quadrant === 3 && isSkipQuadrant3) ||
          (quadrant === 4 && isSkipQuadrant4)
        ) {
          // Skip this cell and move to the next
          currentNode = currentNode.next;
        } else {
          // Remove this cell
          dischargedCells.push(currentNode);
    
          // Update pointers
          if (currentNode.prev) {
            currentNode.prev.next = currentNode.next;
          } else {
            this.head = currentNode.next;
          }
    
          if (currentNode.next) {
            currentNode.next.prev = currentNode.prev;
          } else {
            this.tail = currentNode.prev;
          }
    
          this.size--;
          removedCount++;
          currentNode = currentNode.next;
        }
      }
    
      return dischargedCells;
    }
  
    addNodeToTail(cell: Node): void {
      if (!cell) return;
      this.addNode(cell.cellId);
    }

    // Print the list from head to tail (Node values)
    printList(): void {
        let currentNode = this.head;
        const nodeValues: number[] = [];
    
        while (currentNode !== null) {
            nodeValues.push(currentNode.cellId);
            currentNode = currentNode.next;
        }

        console.log("Doubly Linked List (Head to Tail):", nodeValues.join(" -> "));
    }

    
  }

  // Helper function to get the quadrant of a cell
  function getQuadrant(cellId: number): number {
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