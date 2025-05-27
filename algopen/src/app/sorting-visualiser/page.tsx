'use client'

import React, { useEffect, useRef, useState } from 'react'
import { handleWheelZoom, zoomStage } from '../../utils/SceneController';

import './index.css'
import SideTab from '../components/SideTab/SideTab'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'
import NavBar from '../components/NavBar/NavBar'
import { COLORS, HEADER_HEIGHT, PHONE_WIDTH, Theme } from '../../utils/constants'
import SlideButton from '../components/SlideButton/SlideButton'
import { Stage, Layer, Rect} from "react-konva";
import { Vector2D } from '../GlobalTypes';
import Konva from 'konva';
import DisplayControls from '../components/DisplayControls/DisplayControls';
import ToolBar from '../components/ToolBar/ToolBar';

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
	const [dimensions, setDimensions] = useState<Vector2D>({ x: 500, y: 500 });
    const [parsedInput, setParsedInput] = useState<number[]>([])
    const [errorMsg, setErrorMsg] = useState<string>('')
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

                            <textarea placeholder='[16,32,-10,4,0..,3,-1]' value={textArea} onChange={(e)=> setTextArea(e.target.value)} id="text-input"></textarea>
                        </div>
                        <div className='btn-wrapper'>
                            <SlideButton onClick={parseInputs} styles={{height:'40px',width:'100%'}} title='Create Array'/>
                            <SlideButton onClick={() => 1} styles={{height:'40px',width:'100%'}} title='Run Algorithm'/>
                        </div>
                    </div>
                    {
                        dimensions.x <= PHONE_WIDTH && <ToolBar title='Sorting Input Controller' toggle={() => setShowSideTab(prev=>!prev)} />
                    }
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
                height={dimensions.y-HEADER_HEIGHT-5}
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