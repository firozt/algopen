'use client'

import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import SideTab from '../components/SideTab/SideTab'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'
import NavBar from '../components/NavBar/NavBar'
import { COLORS, HEADER_HEIGHT, MOBILE_WIDTH, PHONE_WIDTH, Theme } from '@/utils/constants'
import SlideButton from '../components/SlideButton/SlideButton'
import { Stage, Layer } from "react-konva";
import { Vector2D } from '../GlobalTypes';
import Konva from 'konva';
import ToolBar from '../components/ToolBar/ToolBar';
import { BubbleSort, InsertionSort, MergeSort, QuickSort, SelectionSort } from './sortingAlgorithms';
import SortingRect from '../components/SortingRect/SortingRect';
import TabManager from '../components/TabManager/TabManager'


// type Props = {
// 
// }

type SortingData = {
    title: string
    desc: string
    worstCaseTime?: string // filename under /public/
    bestCaseTime: string
    spaceComplexity: string
    averageComplexity: string
}

const sortingDesc: SortingData[] = [
    {
        title: 'Bubble Sort',
        desc: 'Bubble sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.',
        worstCaseTime: 'nsquared',
        averageComplexity: 'nsquared',
        bestCaseTime: 'n',
        spaceComplexity: 'constant'
    },
    {
        title: 'Merge Sort',
        desc: 'Merge sort is a divide-and-conquer algorithm that splits the array into halves until each subarray contains a single element. It then merges the subarrays back together in sorted order to produce the final sorted array.',
        worstCaseTime: 'nlogn',
        bestCaseTime: 'nlogn',
        averageComplexity:'nlogn',
        spaceComplexity: 'n',
    },
    {
        title: 'Quick Sort',
        desc:'Quicksort is a fast, recursive sorting algorithm that efficiently organizes data. It selects a pivot element, partitions the array into smaller and larger values, and then recursively sorts each partition.',
        worstCaseTime: 'nsquared',
        averageComplexity:'nlogn',
        bestCaseTime: 'nlogn',
        spaceComplexity: 'logn',

    },
    {
        title: 'Selection Sort',
        desc:'Selection sort is a straightforward sorting algorithm that works by repeatedly finding the smallest element from the unsorted portion of the array and swapping it with the first unsorted element. This process continues, moving the boundary of the sorted portion one step forward each time until the entire array is sorted.',
        worstCaseTime: 'nsquared',
        averageComplexity: 'nsquared',
        bestCaseTime: 'nsquared',
        spaceComplexity: 'constant',
    },
    {
        title: 'Insertion Sort',
        desc:'Insertion sort builds a sorted portion of the array by taking one element at a time and inserting it into its correct position. It works by comparing the current element with those before it and shifting elements to make space as needed.',
        worstCaseTime: 'nsquared',
        averageComplexity: 'nsquared',
        bestCaseTime: 'n',
        spaceComplexity: 'constant'
    },

]

const generateRandomArray = (length = 100, min = -100, max = 100): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

const Page = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [textArea, setTextArea] = useState<string>(String(generateRandomArray(500)))
    const [showSideTab, setShowSideTab] = useState<boolean>(true)
	const [dimensions, setDimensions] = useState<Vector2D>({ x: 500, y: 500 });
    const [parsedInput, setParsedInput] = useState<number[]>([])
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [curSelectedIndex, setCurSelectedIdx] = useState<number[]>([])
    const [comparisons, setComparisons] = useState<number>(0)
    const [sliderSpeed, setSliderSpeed] = useState<number>(50)
    const stageRef = useRef<Konva.Stage | null>(null); 
    const sliderSpeedRef = useRef(sliderSpeed);
    
    useEffect(() => {
        sliderSpeedRef.current = sliderSpeed;
    }, [sliderSpeed]);

    useEffect(() => {
        const updateSize = () => {
            setDimensions({ x: window.innerWidth, y: window.innerHeight });
            console.log(dimensions.x<=PHONE_WIDTH)

        };
        updateSize()
        window.addEventListener('resize',updateSize);
        return () => window.removeEventListener('resize', updateSize);
    },[dimensions.x]);


        const parseInputs = () => {
            let curInput = textArea
            if (curInput.length < 1) return
            if (textArea[0] != '[') curInput = `[${textArea}]`

        try {
            const parsedArray: unknown = JSON.parse(curInput);

            if (!Array.isArray(parsedArray)) {
                throw new Error('Input is not an array');
            }

            const isValid = parsedArray.every(item => typeof item === 'number');

            if (!isValid) {
                throw new Error('Array contains non-number elements');
            }

            setParsedInput(normalizeInput(parsedArray as number[]));
            setErrorMsg('');
        } catch {
            setErrorMsg('Unable to parse text input, make sure it’s a valid JSON array of numbers');
        }
        }

    const runAlgo = async () => {
        setComparisons(0)
        if (dimensions.x < MOBILE_WIDTH/2) setShowSideTab(false)
        const onSwap = (i: number, j: number, change=true): Promise<void> => {
            return new Promise(resolve => {
                setTimeout(() => {
                    setCurSelectedIdx([i,j])
                    if (!change) {
                        setComparisons(prev => prev+1) 
                    } else {
                        setParsedInput(prev => {
                            const newArr = [...prev];
                            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
                            return newArr;
                        });
                    }
                    resolve();
                }, sliderSpeedRef.current);
            });
        };
        const onUpdate = async (fullArray: number[], l: number, r: number): Promise<void> => {
            return new Promise(resolve => {
                
                setTimeout(() => {
                    setComparisons(prev => prev+1)
                    setCurSelectedIdx([l,r])
                    setParsedInput(fullArray);
                    resolve();
                }, sliderSpeedRef.current);
            });
        };


        if (selectedTab == 0) {
            await BubbleSort(parsedInput,onSwap)
        }

        if (selectedTab == 1) {
            await MergeSort(parsedInput,0,parsedInput.length-1,onUpdate)
        }

        if (selectedTab == 2) {
            await QuickSort(parsedInput,0,parsedInput.length-1,onUpdate)
        }

        if (selectedTab == 3) {
            await SelectionSort(parsedInput,onUpdate)
        }

        if (selectedTab == 4) {
            await InsertionSort(parsedInput,onUpdate)
        }

        setCurSelectedIdx([-1])
    }

    const normalizeInput = (arr: number[]): number[] => {
        const maxAbs = Math.max(...arr.map(Math.abs));
        if (maxAbs === 0) return arr.map(() => 0); // Avoid division by zero
        return arr.map(n => n / maxAbs);
    }

    // constants for canvas rect styling

    const rectGap = 0.02*dimensions.x / parsedInput.length // 2% padding
    const inputsWidth = 400 + rectGap
    const workAreaWidth = 0.99*dimensions.x - (dimensions.x < MOBILE_WIDTH/2 ? 0 : inputsWidth) 
    const rectWidth = (0.98*workAreaWidth/parsedInput.length) 
    const maxHeight = 0.45*dimensions.y
    return (    
        <>
            <NavBar theme={Theme.DARK}/>
            <div className='sorting-vis'>
                <SideTab
                slide={dimensions.x <= PHONE_WIDTH ? 'up' : 'left'}
                showContent={showSideTab}
                slideBuffer={dimensions.x <= PHONE_WIDTH ? 45 : 0}
                >
                    <div className='side-input'>
                        <div id='top-inputs'>
                            <header>
                                <TabManager 
                                data={sortingDesc.map(item => item.title)} 
                                onClick={(index) => {setSelectedTab(index);setComparisons(0)}}
                                selected={selectedTab} 
                                />
                            </header>
                            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>
                            <p id='algo-desc'>{sortingDesc[selectedTab].desc}</p>
                            <div style={{paddingTop:'15px',paddingBottom:'15px'}}>
                                <div className='stats'>
                                    <p>Worst Case</p>
                                    <img className='complexity' src={'/O.svg'}/>
                                    <img className='complexity' src={`/${sortingDesc[selectedTab].worstCaseTime}.svg`}/>
                                </div>
                                <div className='stats'>
                                    <p>Average Case</p>
                                    <img className='complexity' src={'/theta.svg'}/>
                                    <img className='complexity' src={`/${sortingDesc[selectedTab].averageComplexity}.svg`}/>
                                </div>
                                <div className='stats'>
                                    <p>Best Case</p>
                                    <img className='complexity' src={'/omega.svg'}/>
                                    <img className='complexity' src={`/${sortingDesc[selectedTab].bestCaseTime}.svg`}/>
                                </div>
                                <div className='stats'>
                                    <p>Space complexity: </p>
                                    <img className='complexity' src={'/O.svg'}/>
                                    <img className='complexity' src={`/${sortingDesc[selectedTab].spaceComplexity}.svg`}/>
                                </div>
                                <div className='stats'>
                                    <p>Number of comparisons</p>
                                    <p style={{fontSize:'16px'}}>{comparisons == 0 ? 'Run Algorithm' : comparisons}</p>
                                </div>
                                <div className='setting'>
                                    <p>Speed</p>
                                    <input type='range' max={200} min={0} value={sliderSpeed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSliderSpeed(Number(e.target.value))}/>
                                </div>
                                <button onClick={() => setTextArea(String(generateRandomArray(Math.floor(Math.random()*100))))}>Generate Random Array</button>
                            </div>
                            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                                {errorMsg.length > 0 && <ErrorMsg message={errorMsg} severity={0}/>}
                            </div>
                            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>

                            <textarea value={textArea} onChange={(e)=> setTextArea(e.target.value)} id="text-input"></textarea>
                        </div>
                        <div className='btn-wrapper'>
                            <SlideButton onClick={parseInputs} styles={{height:'40px',width:'100%'}} title='Create Array'/>
                            <SlideButton onClick={runAlgo} styles={{height:'40px',width:'100%'}} title='Run Algorithm'/>
                        </div>
                    </div>
                    {
                        dimensions.x <= PHONE_WIDTH && <ToolBar title='Sorting Input Controller' toggle={() => setShowSideTab(prev=>!prev)} />
                    }
                </SideTab>
                <Stage
                ref={stageRef} 
                width={dimensions.x} 
                height={dimensions.y-HEADER_HEIGHT-5}
                >
                    <Layer>
                        {
                            parsedInput.map((item, idx) =>
                            <React.Fragment key={idx}>
                                <SortingRect 
                                    position={{
                                        x: (dimensions.x < MOBILE_WIDTH/2 ? 0 : inputsWidth) + ((rectGap+rectWidth)*idx+rectGap),
                                        y: dimensions.x < MOBILE_WIDTH/2 ? (2*dimensions.y/3) : (dimensions.y/2)
                                    }}
                                    width={rectWidth}
                                    height={item == 0 ? 1 :  -1*item*maxHeight}
                                    fill={curSelectedIndex.includes(idx) ? COLORS.RED : COLORS.BLACK}
                                />
                            </React.Fragment>
                            )
                        }
                    </Layer>
                </Stage>
            </div>
        </>
    )
}

export default Page