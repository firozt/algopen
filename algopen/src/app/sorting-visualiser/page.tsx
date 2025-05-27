'use client'

import React, { useEffect, useRef, useState } from 'react'
import { handleWheelZoom, zoomStage } from '../../utils/SceneController';

import './index.css'
import SideTab from '../components/SideTab/SideTab'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'
import NavBar from '../components/NavBar/NavBar'
import { COLORS, HEADER_HEIGHT, Theme } from '../../utils/constants'
import SlideButton from '../components/SlideButton/SlideButton'
import { Stage, Layer, Rect} from "react-konva";
import { Vector2D } from '../GlobalTypes';
import Konva from 'konva';
import DisplayControls from '../components/DisplayControls/DisplayControls';

const RECT_WIDTH = 30
const RECT_GAP = 10

// type Props = {
// 
// }


const sortingDesc = [
    'Bubble sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.This algorithm has a complexity of big O of O(N*N)',
    'under construction, please check again at a later date',
    'under construction, please check again at a later date',
    'under construction, please check again at a later date',
    'under construction, please check again at a later date',

]

const Page = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [textArea, setTextArea] = useState<string>('')
    const [showSideTab, setShowSideTab] = useState<boolean>(true)
	const [dimensions, setDimensions] = useState<Vector2D>({ x: 0, y: 0 });
    const [parsedInput, setParsedInput] = useState<number[]>([])
    const [errorMsg, setErrorMsg] = useState<string>('')
    const stageRef = useRef<Konva.Stage | null>(null); 
    

        useEffect(() => {
            const newDimensions: Vector2D = {
                x: window.innerWidth,
                y: window.innerHeight,
            } 
            setDimensions(newDimensions);
        },[])

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

            setParsedInput(parsedArray as number[]);
            setErrorMsg('');
        } catch {
            setErrorMsg('Unable to parse text input, make sure it’s a valid JSON array of numbers');
        }
        }


    const sortingAlgorithms = [
        { label: 'Bubble Sort', index: 0 },
        { label: 'Merge Sort', index: 1 },
        { label: 'Quick Sort', index: 2 },
        { label: 'Selection Sort', index: 3 },
        { label: 'Insertion Sort', index: 4 },
    ];

    const sortedAlgorithms = [...sortingAlgorithms].sort((a, b) => {
        if (a.index === selectedTab) return -1;
        if (b.index === selectedTab) return 1;
        return a.index - b.index;
    });
    return (    
        <>
            <NavBar theme={Theme.DARK}/>
            <div className='sorting-vis'>
                <SideTab
                slide='left'
                showContent={showSideTab}
                >
                    <div className='side-input'>
                        <header>
                            <div className='selection-input'>
                                {/* <p className={selectedTab == 0 ? 'selected' : ''} onClick={() => setSelectedTab(0)}>Bubble Sort</p> */}
                                {/* <p className={selectedTab == 1 ? 'selected' : ''} onClick={() => setSelectedTab(1)}>Merge Sort</p> */}
                                {/* <p className={selectedTab == 2 ? 'selected' : ''} onClick={() => setSelectedTab(2)}>Quick Sort</p> */}
                                {/* <p className={selectedTab == 3 ? 'selected' : ''} onClick={() => setSelectedTab(3)}>Selection Sort</p> */}
                                {/* <p className={selectedTab == 4 ? 'selected' : ''} onClick={() => setSelectedTab(4)}>Insertion Sort</p> */}
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

                        <div className='text-area-wrapper'>
                            <textarea placeholder='[16,32,-10,4,0..,3,-1]' value={textArea} onChange={(e)=> setTextArea(e.target.value)} id="text-input"></textarea>
                        </div>
                    </div>
                    <div className='btn-wrapper'>
                        <SlideButton onClick={parseInputs} styles={{height:'50px'}} title='Create Array'/>
                        <SlideButton onClick={() => 1} styles={{height:'50px'}} title='Run Algorithm'/>
                    </div>
                </SideTab>
                <DisplayControls
                zoomStage={(zoomBy) => zoomStage(zoomBy,stageRef?.current,dimensions.x)}
                toggleShow={() =>setShowSideTab(prev => !prev)}
                />
                <Stage
                onWheel={(e) => {
                    const stage = stageRef.current;
                    if (stage) handleWheelZoom(e, stage);
                }}
                ref={stageRef} 
                width={dimensions.x} 
                height={dimensions.y-HEADER_HEIGHT}
                draggable
                style={{cursor:'grab'}}
                >
                    <Layer>
                        {
                            parsedInput.map((item, idx) =>
                            <Rect 
                            key={idx}
                            x={425 + ((RECT_GAP+RECT_WIDTH) * idx)}
                            y={dimensions.y/2-50}
                            width={RECT_WIDTH}
                            height={item*10}
                            fill={COLORS.BLACK}
                            />
                            )
                        }
                    </Layer>
                </Stage>
            </div>
        </>
    )
}

export default Page