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
      const dischargedCells: Node[] = [];
      for (let i = 0; i < count && this.head !== null; i++) {
        const cell = this.head;
        dischargedCells.push(cell); // Store the removed cells
        this.head = this.head.next;
        if (this.head) {
          this.head.prev = null;
        } else {
          this.tail = null;
        }
        this.size--;
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
  