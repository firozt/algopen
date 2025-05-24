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

    public static async  pop(
        heap: number[],
        beforeSwap?: (parentIndex: number,last_inserted: number) => void,
        afterSwap?: () => void
    ): Promise<number[]> {
        const newHeap = heap
        await Heap.swap(newHeap,0,newHeap.length-1, beforeSwap, afterSwap)
        newHeap.pop()
        if (afterSwap) afterSwap()

        return await Heap.buildHeap(newHeap,beforeSwap,afterSwap)
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

    private static async swap(heap: number[], 
        indexA: number, 
        indexB: number,
        beforeSwap?: (parentIndex: number,last_inserted: number) => void,
        afterSwap?: () => void
    ) {
        if (beforeSwap) await beforeSwap(indexA,indexB)
        const temp = heap[indexA];
        heap[indexA] = heap[indexB];
        heap[indexB] = temp;
        if (afterSwap) await afterSwap()
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
            await Heap.swap(heap, last_inserted, parentIndex, beforeSwap, afterSwap);
            last_inserted = parentIndex;
        }
        return heap;
    }

    public static getLeftChild(heap: number[],index:number): number| null{
        if (2*index+1 >= heap.length) return null
        return heap[2*index+1]
    }

    public static getRightChild(heap: number[],index:number): number | null{
        if (2*index+2 >= heap.length) return null
        return heap[2*index+2]
    }

    public static async buildHeap(
        heap: number[], 
        beforeSwap?: (parentIndex: number,last_inserted: number) => void,
        afterSwap?: () => void
    ):Promise<number[]> {
        console.log('building heap')
        let curIndex = 0
        while (Heap.getLeftChild(heap,curIndex) != null || Heap.getRightChild(heap,curIndex) != null){
            console.log('in building heap')

            const leftChild = Heap.getLeftChild(heap,curIndex)
            const rightChild = Heap.getRightChild(heap,curIndex)
            const cur = heap[curIndex]
            console.log(leftChild, rightChild, cur)
            if (leftChild != null && cur > leftChild) {
                console.log('in swapping left')
                await Heap.swap(heap,curIndex,curIndex*2+1, beforeSwap, afterSwap)
                curIndex = curIndex*2+1
                continue
            }
            if (rightChild !=  null && cur > rightChild) {
                console.log('in swapping right')
                await Heap.swap(heap,curIndex,2*curIndex+2, beforeSwap, afterSwap)
                curIndex = curIndex*2+2
                continue
            }
            break

        }
        return heap
    }

    // public static async heapifyStep(heap: number[], handleSwap?: (parentIndex: number,last_inserted: number) => void): number[] {
    //     let last_inserted = heap.length - 1;

    //     const parentIndex = this.getParentNodeIndex(last_inserted);
    //     if (parentIndex <= 0) return

    //     const parent = heap[parentIndex];
    //     const child = heap[last_inserted];

    //     if (this.HEAPIFY_CONDITION(parent, child)) return;
    //     if (handleSwap) {
    //         await handleSwap(parentIndex, last_inserted);
    //     } 
    //     Heap.swap(heap, last_inserted, parentIndex);
    //     last_inserted = parentIndex;
    //     return heap;
    // }
}
