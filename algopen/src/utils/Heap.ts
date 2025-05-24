export enum HEAP_TYPE {
    MIN = 'min',
    MAX = 'max'
}

export class Heap {
    static type: HEAP_TYPE = HEAP_TYPE.MIN; // default to min heap

    public static insert(heap: number[], val: number): number[] {
        const newHeap = [...heap, val];
        return newHeap;
    }

    private static HEAPIFY_CONDITION(parent: number, child: number): boolean {
        if (this.type == HEAP_TYPE.MIN) {
            return parent <= child;
        } else {
            return parent >= child;
        }
    }

    public static peek(heap: number[]): number | null {
        return heap[0] ?? null;
    }

    private static getParentNodeIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private static swap(heap: number[], indexA: number, indexB: number) {
        const temp = heap[indexA];
        heap[indexA] = heap[indexB];
        heap[indexB] = temp;
    }

    public static async heapify(
        heap: number[], 
        beforeSwap?: (parentIndex: number,last_inserted: number) => void,
        afterSwap?: () => void
    ):Promise<number[]> {
        let last_inserted = heap.length - 1;

        while (this.getParentNodeIndex(last_inserted) >= 0) {
            const parentIndex = this.getParentNodeIndex(last_inserted);
            const parent = heap[parentIndex];
            const child = heap[last_inserted];

            if (this.HEAPIFY_CONDITION(parent, child)) break;
            if (beforeSwap) {
                await beforeSwap(parentIndex, last_inserted);
            } 
            Heap.swap(heap, last_inserted, parentIndex);
            if (afterSwap) {
                afterSwap()
            }
            last_inserted = parentIndex;
        }
        return heap;
    }
    public static async heapifyStep(heap: number[], handleSwap?: (parentIndex: number,last_inserted: number) => void): number[] {
        let last_inserted = heap.length - 1;

        const parentIndex = this.getParentNodeIndex(last_inserted);
        if (parentIndex <= 0) return

        const parent = heap[parentIndex];
        const child = heap[last_inserted];

        if (this.HEAPIFY_CONDITION(parent, child)) return;
        if (handleSwap) {
            await handleSwap(parentIndex, last_inserted);
        } 
        Heap.swap(heap, last_inserted, parentIndex);
        last_inserted = parentIndex;
        return heap;
    }
}
