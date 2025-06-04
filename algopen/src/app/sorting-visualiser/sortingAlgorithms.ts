export const BubbleSort = async (
    arr: number[],
    onSwap?:(i: number, j: number, change?: boolean) => void
) => {
    const result = [...arr]; 
    const len = result.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (onSwap) await onSwap(j, j + 1, false); // dont change array, only increment count

            if (result[j] > result[j + 1]) {
                if (onSwap) await onSwap(j, j + 1); // doesnt increment count, only changes array
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
            }
        }
    }
};

// does in place merge sort
async function merge(
    arr: number[], 
    start: number, 
    mid: number, 
    end: number, 
    onUpdate?: (fullArray: number[], l: number, r: number) => void
){
    let start2 = mid + 1;
    if (arr[mid] <= arr[start2]) {
        return;
    }

    while (start <= mid && start2 <= end){
        if (onUpdate) await onUpdate(arr.slice(), start, start2)
        
        if (arr[start] <= arr[start2]){
            start++;
        } else {
            const value = arr[start2];
            let index = start2;

            while (index != start) {
                arr[index] = arr[index - 1];
                index--;
            }
            arr[start] = value;

            start++;
            mid++;
            start2++;
        }
    }
}

export const MergeSort = async (arr: number[], 
    l: number, 
    r: number, 
    onUpdate?: (fullArray: number[], l: number, r: number) => void
) => {
    if (l < r) {
        
        const m = l + Math.floor((r - l) / 2);

        await MergeSort(arr, l, m, onUpdate);
        await MergeSort(arr, m + 1, r, onUpdate);

        await merge(arr, l, m, r, onUpdate);

        if (onUpdate) await onUpdate(arr.slice(),l,r)
    }
}

const partition = async (
    arr: number[], 
    low: number, 
    high: number,
    onUpdate?: (fullArray: number[], l: number, r: number) => void
): Promise<number> => {

    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j, onUpdate);
        }
    }

    await swap(arr, i + 1, high, onUpdate);
    return i + 1;
}

const swap = async (arr: number[], 
    i: number, 
    j: number, 
    onUpdate?: (fullArray: number[], l: number, r: number) => void

) => {
    const temp = arr[i];
    if (onUpdate) await onUpdate(arr, i, j)
    arr[i] = arr[j];
    arr[j] = temp;
}

export const QuickSort = async (
    arr: number[], 
    low: number, 
    high: number,
    onUpdate?: (fullArray: number[], l: number, r: number) => void
) => {
    if (low < high) {

        const pi = await partition(arr, low, high, onUpdate);

        await QuickSort(arr, low, pi - 1,onUpdate);
        await QuickSort(arr, pi + 1, high,onUpdate);
    }
}

export const SelectionSort = async (
    arr: number[],
    onSwap?: (arr: number[],i: number, j: number) => void
) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            if (onSwap) await onSwap(arr,j, min_idx); 
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (onSwap) await onSwap(arr,i, min_idx); 

        const temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
    }
};

export const InsertionSort = async (
    arr: number[],
    onUpdate?: (fullArray: number[], l: number, r: number) => void
) => {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            if (onUpdate) await onUpdate([...arr], j, i);
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
