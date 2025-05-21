'use client'
import React, {  useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import SideTab from '../components/SideTab/SideTab'
import SlideButton from '../components/SlideButton/SlideButton'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'
import {  Vector2D } from '../GlobalTypes'
import Konva from 'konva'
import { Circle, Layer, Stage } from 'react-konva'
import { HEADER_HEIGHT, SlideDirection } from '../../utils/constants'
import { handleWheelZoom } from '../../utils/SceneController'


enum ERROR_MESSAGES {
	EmptyInput='The input you wrote is empty, please enter a (max 4 digit) number inside the node',
	NoValidNumbers='The input you wrote does not contain any numbers, please enter a max 4 digit number within the node, note that this feature does not support floating points'
}



const btnStyles = {
	height:'100%'
}

	// type Props = {}

const Page = () => {
	const [dimensions, setDimensions] = useState<Vector2D>({x:-1,y:-1});
	const [inputVal, setInputVal] = useState<string>('')
	const [errorMsg, setErrorMsg] = useState<string>('')
	const [showSideBar, setShowSidebar] = useState<boolean>(true)
	// const [heapHead,setHeapHead] = useState<TreeNode|null>(null)
	// const [edgeNodeList, setEdgeNodeList] = useState<EdgeInfo[]>([])
	// const [nodeInfoList, setNodeInfoList] = useState<NodeInfo[]>([])
	const [selectedTab, setSelectedTab] = useState<number>(0)
	const stageRef = useRef<Konva.Stage | null>(null);

	useEffect(() => {
		const updateSize = () => {
			console.log({ x: window.innerWidth, y: window.innerHeight })
			setDimensions({ x: window.innerWidth, y: window.innerHeight });
		};
		updateSize()
		window.addEventListener('resize',updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);


	const parseInput = (): boolean => {
		setErrorMsg('')
		if (inputVal.length < 1) {
			setErrorMsg(ERROR_MESSAGES.EmptyInput)
			return false
		}
		const numberOnly = inputVal.match(/-?\d+(\.\d+)?/)
		if (numberOnly == null) {
			setErrorMsg(ERROR_MESSAGES.NoValidNumbers)
			return false
		}
		return true
	}

	const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 4) return
		setInputVal(e.target.value)
	}

	// const arrayToHeap = (inputArray: number[]): TreeNode => {
	// 	const dfsTraversal = (curIndex): TreeNode => {
	// 		if (curIndex >= inputArray.length || inputArray[curIndex] == null ) return null
	// 		const curNode: TreeNode = {
	// 			val: inputArray[curIndex],
	// 			left: null,
	// 			right: null,
	// 		}
	// 		const left = 2 * curIndex + 1;
	// 		const right = 2 * curIndex + 2;
	// 		if (left < inputArray.length && inputArray[left] != null) {
	// 			curNode.left = dfsTraversal(left)
	// 		}
	// 		if (right < inputArray.length && inputArray[right] != null) {
	// 			curNode.right = dfsTraversal(right)
	// 		}
	// 		return curNode
	// 	}
	// 	return dfsTraversal(inputArray)
	// }


	const handlePush = () => {
		if (!parseInput()) return // invalid input

	}

	// const createHeap =(input: string)  => {
	// 	const parseInput = (input: string): string[] => {

	// 	}
	// }

return (
	<>
		<NavBar />
		<SideTab
		showContent={showSideBar}
		styles={{
			height:'fit-content',
			borderRight:'3px solid black',
			borderBottom:'3px solid black',
			bottom:'0'
		}}
		slide={SlideDirection.DOWN}
		slideBuffer={50}
		>
			<header className='heap-vis-header'>
				<p>Heap Input Controller</p>
				<div onClick={() => setShowSidebar(prev => !prev)}>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4.25 13.25H0.75V9.75M13.25 9.75V13.25H9.75M9.75 0.75H13.25V4.25M0.75 4.25V0.75H4.25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</div>
			</header>
			<section>
				<p className={selectedTab == 0 ? 'selected': ''} onClick={() => setSelectedTab(0)}>Min Heap</p>
				<p className={selectedTab == 1 ? 'selected': ''} onClick={() => setSelectedTab(1)}>Max Heap</p>
			</section>
			<div className='heap-vis-container'>
				<p>
					To push to the heap click on the node below and write the desired
					number to push onto the heap
				</p>
				<div className='input-container'>
					<input value={inputVal} placeholder='0000' onChange={handleInputChange} id='heap-input' className={errorMsg.length > 1 ? 'pulsate-error' : inputVal.length < 1 ? 'pulsate' : ''}/>
				</div>
				{
					errorMsg && <ErrorMsg message={errorMsg} severity={0} />
				}
				<div className='btn-group'>
					<SlideButton onClick={() => handlePush()} title='Push Node' styles={btnStyles} />
					<SlideButton onClick={() => 1} title='Pop Heap'  styles={btnStyles}/>
				</div>
			</div>
		</SideTab>
		<Stage 
			onWheel={(e) => {
				const stage = stageRef.current;
				if (stage) handleWheelZoom(e, stage);
			}}
			ref={stageRef} 
			width={dimensions.x} 
			height={dimensions.y-HEADER_HEIGHT}
			draggable
			style={{
				cursor:'pointer'
			}}
		>
			<Layer>
				<Circle
					radius={30}
					fill={'black'}
					x={500}
					y={500}
				/>
			</Layer>
		</Stage>
	</>
)
}

export default Page