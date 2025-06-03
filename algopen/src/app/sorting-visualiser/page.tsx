'use client'

import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import SideTab from '../components/SideTab/SideTab'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'
import NavBar from '../components/NavBar/NavBar'
import { COLORS, HEADER_HEIGHT, MOBILE_WIDTH, PHONE_WIDTH, Theme } from '../../utils/constants'
import SlideButton from '../components/SlideButton/SlideButton'
import { Stage, Layer } from "react-konva";
import { Vector2D } from '../GlobalTypes';
import Konva from 'konva';
import ToolBar from '../components/ToolBar/ToolBar';
import { BubbleSort, MergeSort } from './sortingAlgorithms';
import SortingRect from '../components/SortingRect/SortingRect';


enum AlgoName {
    BUBBLE_SORT = 'Bubble Sort',
    MERGE_SORT = 'Merge Sort',
    SELECTION_SORT = 'Selection Sort',
    QUICK_SORT = 'Quick Sort',
    INSERTION_SORT = 'Insertion Sort'
}

// type Props = {
// 
// }


const sortingDesc = [
    'Bubble sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.This algorithm has a complexity of big O of O(N*N)',
    'Merge Sort divides the list, sorts each half, and merges them. It runs in O(n log n) time. It’s stable but uses extra memory.',
    'under construction, please check again at a later date',
    'under construction, please check again at a later date',
    'under construction, please check again at a later date',

]

const Page = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [textArea, setTextArea] = useState<string>('12,3,41,9,5,1,32,-12,-3,-4,-15,9,1,15')
    const [showSideTab, setShowSideTab] = useState<boolean>(true)
	const [dimensions, setDimensions] = useState<Vector2D>({ x: 500, y: 500 });
    const [parsedInput, setParsedInput] = useState<number[]>([])
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [curSelectedIndex, setCurSelectedIdx] = useState<number[]>([])
    const stageRef = useRef<Konva.Stage | null>(null); 
    
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

    const sortingAlgorithms: { label: AlgoName; index: number }[] = [
    { label: AlgoName.BUBBLE_SORT, index: 0 },
    { label: AlgoName.MERGE_SORT, index: 1 },
    { label: AlgoName.QUICK_SORT, index: 2 },
    { label: AlgoName.SELECTION_SORT, index: 3 },
    { label: AlgoName.INSERTION_SORT, index: 4 },
    ];

    const sortedAlgorithms = [...sortingAlgorithms].sort((a, b) => {
        if (a.index === selectedTab) return -1;
        if (b.index === selectedTab) return 1;
        return a.index - b.index;
    });

    const runAlgo = async () => {
        if (dimensions.x < MOBILE_WIDTH/2) setShowSideTab(false)
        const onSwap = (i: number, j: number): Promise<void> => {
            return new Promise(resolve => {
                setTimeout(() => {
                    setParsedInput(prev => {
                        const newArr = [...prev];
                        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
                        return newArr;
                    });
                    setCurSelectedIdx([j])
                    resolve();
                }, 50);
            });
        };
        const onUpdate = async (fullArray: number[], l: number, r: number): Promise<void> => {
            return new Promise(resolve => {
                setTimeout(() => {
                    setParsedInput(fullArray);
                    setCurSelectedIdx([l,r])
                    resolve();
                }, 100);
            });
        };

        const selectedAlgo = sortedAlgorithms[0]

        if (selectedAlgo.label == AlgoName.BUBBLE_SORT) {
            await BubbleSort(parsedInput,onSwap)
        }

        if (selectedAlgo.label == AlgoName.MERGE_SORT) {
            await MergeSort(parsedInput,0,parsedInput.length-1,onUpdate)
        }

        setCurSelectedIdx([-1])
    }

    const normalizeInput = (arr: number[]): number[] => {
        const maxAbs = Math.max(...arr.map(Math.abs));
        if (maxAbs === 0) return arr.map(() => 0); // Avoid division by zero
        return arr.map(n => n / maxAbs);
    }

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
                                <div className='selection-input'>
                                    {sortedAlgorithms.map(({ label, index }) => (
                                        <p
                                        key={index}
                                        className={selectedTab === index ? 'selected' : ''}
                                        onClick={() => setSelectedTab(index)}
                                        >
                                        {label}
                                        </p>
                                    ))}
                                </div>
                            </header>
                            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>
                            <p id='algo-desc'>{sortingDesc[selectedTab]}</p>
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
                                    height={-1*item*maxHeight}
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