import { Complexity } from "../GlobalTypes";


export type SortingData = {
    title: string
    desc: string
    complexity: Complexity

}

export const sortingDesc: SortingData[] = [
    {
        title: 'Bubble Sort',
        desc: 'Bubble sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.',
        complexity : {
            worst: 'nsquared',
            best: 'n',
            average: 'nsquared',
            space: 'constant'
        }
    },
    {
        title: 'Merge Sort',
        desc: 'Merge sort is a divide-and-conquer algorithm that splits the array into halves until each subarray contains a single element. It then merges the subarrays back together in sorted order to produce the final sorted array.',
        complexity: {
            worst: 'nlogn',
            best: 'nlogn',
            average: 'nlogn',
            space: 'n'
        }
    },
    {
        title: 'Quick Sort',
        desc: 'Quicksort is a fast, recursive sorting algorithm that efficiently organizes data. It selects a pivot element, partitions the array into smaller and larger values, and then recursively sorts each partition.',
        complexity: {
            worst: 'nsquared',
            best: 'nlogn',
            average: 'nlogn',
            space: 'logn'
        }
    },
    {
        title: 'Selection Sort',
        desc: 'Selection sort is a straightforward sorting algorithm that works by repeatedly finding the smallest element from the unsorted portion of the array and swapping it with the first unsorted element. This process continues, moving the boundary of the sorted portion one step forward each time until the entire array is sorted.',
        complexity: {
            worst: 'nsquared',
            best: 'nsquared',
            average: 'nsquared',
            space: 'constant'
        }
    },
    {
        title: 'Insertion Sort',
        desc: 'Insertion sort builds a sorted portion of the array by taking one element at a time and inserting it into its correct position. It works by comparing the current element with those before it and shifting elements to make space as needed.',
        complexity: {
            worst: 'nsquared',
            best: 'n',
            average: 'nsquared',
            space: 'constant'
        }
    }
];
