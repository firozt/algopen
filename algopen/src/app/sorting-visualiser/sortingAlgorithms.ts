export const BubbleSort = async (
    arr: number[],
    onSwap?:(i: number, j: number) => void
) => {
    const result = [...arr]; 
    const len = result.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                if (onSwap) await onSwap(j, j + 1);
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
            }
        }
    }
};

async function merge(arr: number[], start: number, mid: number, end: number, onUpdate?: (fullArray: number[], l: number, r: number) => void)
{
    let start2 = mid + 1;

    // If the direct merge is already sorted
    if (arr[mid] <= arr[start2]) {
        return;
    }

    // Two pointers to maintain start
    // of both arrays to merge
    while (start <= mid && start2 <= end){
        if (onUpdate) await onUpdate(arr.slice(), start, start2)
        
        // If element 1 is in right place
        if (arr[start] <= arr[start2]){
            start++;
        } else {
            const value = arr[start2];
            let index = start2;

            // Shift all the elements between element 1
            // element 2, right by 1.
            while (index != start) {
                // if (onUpdate) await onUpdate(arr.slice(),start,start2)
                arr[index] = arr[index - 1];
                index--;
            }
            arr[start] = value;

            // Update all the pointers
            start++;
            mid++;
            start2++;
        }
    }
}

/* l is for left index and r is right index 
of the sub-array of arr to be sorted */
export const MergeSort = async (arr: number[], l: number, r: number, onUpdate?: (fullArray: number[], l: number, r: number) => void) => {
    if (l < r) {
        
        // Same as (l + r) / 2, but avoids overflow
        // for large l and r
        const m = l + Math.floor((r - l) / 2);

        // Sort first and second halves
        await MergeSort(arr, l, m, onUpdate);
        await MergeSort(arr, m + 1, r, onUpdate);

        await merge(arr, l, m, r, onUpdate);

        if (onUpdate) await onUpdate(arr.slice(),l,r)
    }
}
