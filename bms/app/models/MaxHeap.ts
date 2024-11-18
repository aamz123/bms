import { Cell } from "./Cell";

export class MaxHeap<T> {
    public heap: T[] = [];
    private comparator: (a: T, b: T) => number;
  
    constructor(comparator: (a: T, b: T) => number) {
      this.comparator = comparator;
    }
  
    private getParentIndex(childIndex: number): number {
      return Math.floor((childIndex - 1) / 2);
    }
  
    private getLeftChildIndex(parentIndex: number): number {
      return 2 * parentIndex + 1;
    }
  
    private getRightChildIndex(parentIndex: number): number {
      return 2 * parentIndex + 2;
    }
  
    private swap(index1: number, index2: number): void {
      [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
  
    insert(value: T): void {
      this.heap.push(value);
      this.heapifyUp();
    }
  
    private heapifyUp(): void {
      let index = this.heap.length - 1;
      while (index > 0) {
        const parentIndex = this.getParentIndex(index);
        if (this.comparator(this.heap[index], this.heap[parentIndex]) > 0) {
          this.swap(index, parentIndex);
          index = parentIndex;
        } else {
          break;
        }
      }
    }
  
    extractMax(): T | null {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop()!;
  
      const maxValue = this.heap[0];
      this.heap[0] = this.heap.pop()!;
      this.heapifyDown();
      return maxValue;
    }
  
    public heapifyDown(): void {
      let index = 0;
      const length = this.heap.length;
  
      while (true) {
        const leftChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);
        let largest = index;
  
        if (leftChildIndex < length && this.comparator(this.heap[leftChildIndex], this.heap[largest]) > 0) {
          largest = leftChildIndex;
        }
  
        if (rightChildIndex < length && this.comparator(this.heap[rightChildIndex], this.heap[largest]) > 0) {
          largest = rightChildIndex;
        }
  
        if (largest !== index) {
          this.swap(index, largest);
          index = largest;
        } else {
          break;
        }
      }
    }
  
    peek(): T | null {
      return this.heap.length > 0 ? this.heap[0] : null;
    }
  
    getHeap(): T[] {
      return this.heap;
    }

    public reheap(): void {
      const length = this.heap.length;
  
      // Start from the last non-leaf node and move up to the root
      for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
          this.heapifyDownFrom(i);
      }
  }
  
  // Helper function to heapify down from a specific index
  private heapifyDownFrom(index: number): void {
      const length = this.heap.length;
  
      while (true) {
          const leftChildIndex = this.getLeftChildIndex(index);
          const rightChildIndex = this.getRightChildIndex(index);
          let largest = index;
  
          if (leftChildIndex < length && this.comparator(this.heap[leftChildIndex], this.heap[largest]) > 0) {
              largest = leftChildIndex;
          }
  
          if (rightChildIndex < length && this.comparator(this.heap[rightChildIndex], this.heap[largest]) > 0) {
              largest = rightChildIndex;
          }
  
          if (largest !== index) {
              this.swap(index, largest);
              index = largest;
          } else {
              break;
          }
      }
  }
  
  }
  
  // Comparator function for sorting based on bestAvailableChargeValue
//   const compareCells = (a: Cell, b: Cell): number => ;
  
  // Example usage with Cell class
  // const cellHeap = new MaxHeap<Cell>((a, b) => a.bestAvailableChargeValue - b.bestAvailableChargeValue); // Max-Heap
  
//   // Sample Cell objects
//   const cell1 = new Cell(1);
//   cell1.bestAvailableChargeValue = 50;
  
//   const cell2 = new Cell(2);
//   cell2.bestAvailableChargeValue = 80;
  
//   const cell3 = new Cell(3);
//   cell3.bestAvailableChargeValue = 30;
  
//   cellHeap.insert(cell1);
//   cellHeap.insert(cell2);
//   cellHeap.insert(cell3);
  
//   console.log("Heap:", cellHeap.getHeap().map(cell => cell.bestAvailableChargeValue)); // [80, 50, 30]
//   console.log("Max:", cellHeap.extractMax()?.bestAvailableChargeValue); // 80
//   console.log("Heap after extract:", cellHeap.getHeap().map(cell => cell.bestAvailableChargeValue)); // [50, 30]
  