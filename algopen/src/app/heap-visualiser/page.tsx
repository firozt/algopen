'use client'
import React, {  useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import SideTab from '../components/SideTab/SideTab'
import SlideButton from '../components/SlideButton/SlideButton'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'
import {  EdgeInfo, NodeInfo, Vector2D } from '../GlobalTypes'
import Konva from 'konva'
import { Layer, Stage } from 'react-konva'
import { COLORS, HEADER_HEIGHT, SlideDirection, Theme } from '../../utils/constants'
import { handleWheelZoom } from '../../utils/SceneController'
import { Heap, HEAP_TYPE } from '../../utils/Heap'
import { getLevel } from '../../utils/Misc'
import GraphNode from '../components/GraphNode/GraphNode'
import GraphEdge from '../components/GraphEdge/GraphEdge'
import { getLinePoints } from '../../utils/GeometryHelpers'


enum ERROR_MESSAGES {
	EmptyInput='The input you wrote is empty, please enter a (max 4 digit) number inside the node',
	NoValidNumbers='Your input contains a non numeric character, please enter a 4 digit number'
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
	const [heapArr,setHeapArr] = useState<number[][]>([[],[]])
	const [edgeNodeList, setEdgeNodeList] = useState<EdgeInfo[][]>([[],[]])
	const [nodeInfoList, setNodeInfoList] = useState<NodeInfo[][]>([[],[]])
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

	
	useEffect(() => {
		// just inserted
		generateTree(heapArr)

		const runHeapify = async () => {
			await Heap.heapify(heapArr[selectedTab], onSwap,()=>generateTree(heapArr));
			generateTree(heapArr);
		};
		runHeapify();
	}, [heapArr]);



	const onSwap = (parent: number, child: number) => {
	return new Promise<void>((resolve) => {
		setNodeInfoList(prev =>
		prev.map((tab, index) =>
			index === selectedTab
			? tab.map(a =>
				a.id == String(parent) || a.id == String(child)
					? { ...a, fill: COLORS.RED }
					: a
				)
			: tab
		)
		);

		setTimeout(() => {
			setNodeInfoList(prev =>
			prev.map((tab, index) =>
				index === selectedTab
				? tab.map(a =>
					a.id === String(parent) || a.id === String(child)
						? { ...a, fill: COLORS.BLACK }
						: a
					)
				: tab
			)
			);
			resolve();  // resolve promise after timeout finishes
			generateTree(heapArr)
			}, 1000);
		});
	};


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


	const pushToEdgeList = (edgeInfo: EdgeInfo) => {
		setEdgeNodeList(prev => {
			const newList = [...prev[selectedTab], edgeInfo];
			return prev.map((item, idx) =>
				idx === selectedTab ? newList : item
			);
		});
	};

	//  -----------------------------------------------------


	const pushToNodeList = (nodeInfo: NodeInfo) => {
		setNodeInfoList(prev => {
			const newList = [...prev[selectedTab], nodeInfo];
			return prev.map((item, idx) =>
				idx === selectedTab ? newList : item
			);
		});
	};

	const generateTree = (input: number[][]) => {
		const tree_array = input[selectedTab]

		setNodeInfoList([[],[]])
		setEdgeNodeList([[],[]])
		const d = 100;
		const dy = 90;


		const dfs = (index: number, pos: Vector2D) => {
				const level = getLevel(index) + 1;

				const left = 2 * index + 1;
				const right = 2 * index + 2;

			const new_y = pos.y + dy;
			const new_x = d / level;

			if (left < tree_array.length) {
				pushToEdgeList({
					idFrom: String(index),
					idTo: String(left),
					directed: false,
				});
				dfs(
					left, 
					{
						x: pos.x - new_x,
						y: new_y
					}
				);
			}
			if (right < tree_array.length) {
				pushToEdgeList({
					idFrom: String(index),
					idTo: String(right),
					directed: false,
				});
				dfs(
					right,
					{
						x: pos.x + new_x,
						y: new_y
					}
				);
			}

			pushToNodeList({
				position: pos,
				label: String(tree_array[index]),
				id: String(index),
				dragging:false,
			})
		};

		dfs(0,{
			x:700,
			y:500-(innerHeight/4)
		});
	}



	const handlePush = () => {
		setInputVal('')
		if (!parseInput()) return // invalid input
		const input = Number(inputVal)
		setHeapArr(prev =>
			prev.map((tab, index) =>
				index === selectedTab
				? [...tab, input]
				: tab
			)
		)


		// setHeapArr(prev => Heap.insert(prev,input))
	}

const popHeap = async () => {
	const newHeap = await Heap.pop(heapArr[selectedTab], onSwap, () => generateTree(heapArr));
	generateTree(heapArr);
	
	setHeapArr(prev =>
		prev.map((tab, index) =>
			index === selectedTab ? newHeap : tab
		)
	);
	generateTree(heapArr);

};


return (
	<div className='heap-vis'>
		<NavBar theme={Theme.DARK} />
		<SideTab
		showContent={showSideBar}
		styles={{
			position: 'fixed',
			top: `${HEADER_HEIGHT}px`,
			border: '3px solid black',
			maxHeight:`${errorMsg.length > 0 ? '480' : '400'}px`,
			justifyContent:'center',
			overflowY: 'hidden',
			transition:'all .5s ease',
			transformOrigin: 'bottom',
			zIndex:'1'
		}}
		slide={SlideDirection.UP}
		slideBuffer={50}
		>

			<section>
				<p className={selectedTab == 0 ? 'selected': ''} onClick={() => {setSelectedTab(0);Heap.type = HEAP_TYPE.MIN}}>Min Heap</p>
				<p className={selectedTab == 1 ? 'selected': ''} onClick={() => {setSelectedTab(1);Heap.type = HEAP_TYPE.MAX}}>Max Heap</p>
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
					<SlideButton onClick={() => popHeap()} title='Pop Heap'  styles={btnStyles}/>
				</div>
			</div>
			<header className='heap-vis-header'>
				<p>Heap Input Controller</p>
				<div onClick={() => setShowSidebar(prev => !prev)}>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4.25 13.25H0.75V9.75M13.25 9.75V13.25H9.75M9.75 0.75H13.25V4.25M0.75 4.25V0.75H4.25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</div>
			</header>
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
				{
					nodeInfoList[selectedTab].map((item,idx) => {
						return (
							<React.Fragment key={`node-${idx}`}>
							<GraphNode
							node={{
								position: item.position,
								label: item.label,
								id: item.id,
								dragging: item.dragging,
							}}
							fill={item.fill}
							/>
							</React.Fragment>
						)
					})
				}
				{
					edgeNodeList[selectedTab].map((edge,idx) => {
						const fromNode = nodeInfoList[selectedTab].find((t) => t.id === edge.idFrom);
						const toNode = nodeInfoList[selectedTab].find((t) => t.id === edge.idTo);
						if (fromNode == undefined || toNode == undefined) {
							return <></>
						}
						const points = getLinePoints(fromNode.position, toNode.position);

						return (
							<React.Fragment key={`edge-${idx}`}>
								<GraphEdge 
									directional ={false}
									points={points}
								/>
							</React.Fragment>
						)
					})
				}
			</Layer>
		</Stage>
	</div>
)
}

export default Page