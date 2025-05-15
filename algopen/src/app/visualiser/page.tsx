'use client'

import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import { Stage, Layer} from "react-konva";
import { EdgeInfo, NodeInfo, Vector2D } from '../GlobalTypes';
import { HEADER_HEIGHT, INPUTS_WIDTH, MOBILE_WIDTH } from '../constants';
import { createEdge, createNode, getSafeCorners, getVisibleCenter } from '../../utils/SceneController';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import GraphInputs from '../components/GraphInputs/GraphInputs';
import { getLevel } from '../../utils/Misc';
import { generateRandomPoints, getLinePoints, } from '../../utils/GeometryHelpers';

const Page = () => {
	const [textArea, setTextArea] = useState<string[]>(['1,null,2,null,null,3,4','directed\nA:B(3)\nB:C(2)\nC:A(1.2)','A:B,C,D'])

	const [nodeInfoList, setNodeInfoList] = useState<NodeInfo[][]>([[],[],[]]) // one for each tab
	const [edgeInfoList, setEdgeInfoList] = useState<EdgeInfo[][]>([[],[],[]]) // one for each tab


	const [selectedTab, setSelectedTab] = useState<number>(0)
	const [dimensions, setDimensions] = useState<Vector2D>({ x: 0, y: 0 });
	const [center, setCenter] = useState<Vector2D>();
	const [safeZone, setSafeZone] = useState<Vector2D[]>([])
	const [showInputs, setShowInputs] = useState<boolean>(true);
	const stageRef = useRef<Konva.Stage | null>(null); 


	useEffect(() => {
		const newDimensions: Vector2D = {
			x: window.innerWidth,
			y: window.innerHeight,
		} 
		setDimensions(newDimensions);

		
		if (stageRef.current) {
			let newCenter: Vector2D
			if (newDimensions.x < MOBILE_WIDTH) {
				
				newCenter = {
					x:newDimensions.x/2,
					y:newDimensions.y/2+INPUTS_WIDTH,
				}
			} else {

				newCenter = {
					x:newDimensions.x/2+INPUTS_WIDTH,
					y:newDimensions.y/2-HEADER_HEIGHT,
				}
			}

		setCenter(newCenter)
		setSafeZone(getSafeCorners(newCenter,newDimensions.x))
		}
	}, []);

	// parses input to see if user wants directional grapinh
	const isDirectional = (input: string): [string, boolean] => {
		const res = input.length > 0 && input.split('\n')[0].toLowerCase() == 'directed'

		if (res) {
			input = input.replace(/directed\n/i,'')
		}
		return [input,res]
	}

	const graphWeightedVisualiser = (input: string, directional: boolean) => {
		const parseInput = (input: string) : [NodeInfo[], string[]]  => {
			// first takes out the weights in the form '(number)' then removes whitespace, now in the same form as pre weighted
			const unique_nodes = new Set(
				input
				.replaceAll(/\(.*?\)/g, '')   // Remove anything inside ( )
				.replaceAll(' ', '')          // Remove spaces
				.split(/[,\n:]+/)             // Split by comma, newline, or colon
			);

			const parsedInput = input.replaceAll(' ','').split('\n')  // contains user input, each index is new line

			
			// first create, place and store the unique nodes

			return [generateRandomPoints(unique_nodes,safeZone),parsedInput]
		}

		const [nodeList, parsedInput] = parseInput(input)
		updateNodeList(nodeList)
		parsedInput.forEach((line) => {
			const [node, neighbours] = line.split(':'); // first index is parent, rest are neighbours
			neighbours.split(',').forEach(neighbour => {
				const nodeToObj = neighbour.replace(/\(.*?\)/g, '')
				const weightval = neighbour.match(/\(.*?\)/g)?.toString().replaceAll('(','').replaceAll(')','') ?? '1';
				pushToEdgeList({
					labelFrom: node,
					labelTo: nodeToObj,
					weight: weightval,
					directed: directional
				})
			})
		});
		

	}

	const graphVisualiser = (input: string, directional: boolean) => {
		const parseInput = (input: string): [NodeInfo[], string[]]  => {
			// get all unique nodes

			const unique_nodes = new Set(input.replaceAll(' ','').split(/[,\n:]+/))  // regex splits on comma, newline and colon // contains set of all unique nodes
			const parsedInput = input.replaceAll(' ','').split('\n')  // contains user input, each index is new line

			return [generateRandomPoints(unique_nodes,safeZone),parsedInput]
		}

		const [nodeList, parsedInput] = parseInput(input)
		updateNodeList(nodeList)
		const edgeList: EdgeInfo[] = []
		parsedInput.forEach((line) => {
			const [node, neighbours] = line.split(':') // first index goes to parent node, rest are neighbours
			neighbours.split(',').forEach(neighbour => {
				edgeList.push({
					labelFrom: node,
					labelTo: neighbour,
					directed: directional,
				})
			}) 
		})
		updateEdgeList(edgeList)
	}

	// resets current stage
	const resetStage = () => {
		updateEdgeList([])
		updateNodeList([])
	}


	const visualise = () => {
		// setSafeZone(getSafeCorners(center,dimensions.x))
		const input = textArea[selectedTab]
		resetStage()


		if (selectedTab == 0) {
			const parsed_input = input.replaceAll('[','').replaceAll(']','').replaceAll(' ','').split(',')
			console.log('tree visualising')
			generateTree(parsed_input)
		}
		else if (selectedTab == 1) {
			console.log('tree traversal')
			const [parsed, directional] = isDirectional(input)
			graphWeightedVisualiser(parsed,directional)
		}
		else if (selectedTab == 2) {
			console.log('graph visualiser')
			const [parsed, directional] = isDirectional(input)

			graphVisualiser(parsed,directional)
		} 
		else {
			throw new Error('Selected could not be parsed : ' + selectedTab)
		}
		if (window.innerWidth < MOBILE_WIDTH) {
			setShowInputs(false)
		}
	}


	const updateEdgeList = (edgeInfoList: EdgeInfo[]) => {
		setEdgeInfoList(prev => 
			prev.map((item,idx) =>
				idx == selectedTab ? edgeInfoList : item
			)
		)
	}

	const updateNodeList = (nodeInfoList: NodeInfo[]) => {
		setNodeInfoList(prev => 
			prev.map((item,idx) =>
				idx == selectedTab ? nodeInfoList : item
			)
		)
	}

	const pushToEdgeList = (edgeInfo: EdgeInfo) => {
		setEdgeInfoList(prev => {
			const newList = [...prev[selectedTab], edgeInfo];
			return prev.map((item, idx) =>
				idx === selectedTab ? newList : item
			);
		});
	};


	const pushToNodeList = (nodeInfo: NodeInfo) => {
		setNodeInfoList(prev => {
			const newList = [...prev[selectedTab], nodeInfo];
			console.log('pushing', nodeInfo.label, 'new list len:', newList.length);
			return prev.map((item, idx) =>
				idx === selectedTab ? newList : item
			);
		});
	};


	const generateTree = (tree_array: string[]) => {
		const d = tree_array.filter(item => item !== 'null').length * 20;
		const dy = 90;

		const dfs = (index: number, pos: Vector2D) => {
			if (index >= tree_array.length || tree_array[index] == 'null') return;
				const level = getLevel(index) + 1;

				const left = 2 * index + 1;
				const right = 2 * index + 2;

			const new_y = pos.y + dy;
			const new_x = d / level;

			if (left < tree_array.length &&  tree_array[left] != 'null') {
				pushToEdgeList({
					labelFrom: tree_array[index],
					labelTo: tree_array[left],
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
			if (right < tree_array.length  &&  tree_array[right] != 'null') {
				pushToEdgeList({
					labelFrom: tree_array[index],
					labelTo: tree_array[right],
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
				label: tree_array[index]
			})
			// addNodesToRender(createNode(pos, tree_array[index],false));
		};
		dfs(0,{
			x:center.x,
			y:center.y-(innerHeight/4)
		});
	}


	const  handleWheelZoom = (e: KonvaEventObject<WheelEvent, unknown>, stage: Konva.Stage) => {
		e.evt.preventDefault();

		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();

		const mousePointTo = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		};

		let direction = e.evt.deltaY > 0 ? 1 : -1;

		if (e.evt.ctrlKey) {
			direction = -direction;
		}

		const scaleBy = 1.05;
		const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

		stage.scale({ x: newScale, y: newScale });

		const newPos = {
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale,
		};
		stage.position(newPos);
	};


	const zoomStage = (scaleBy=1.5) => {
		const stage = stageRef.current
		const oldScale = stage.scaleX();
		const newScale = oldScale * scaleBy;

		const center = getVisibleCenter(stage, dimensions.x)
		stage.scale({ x: newScale, y: newScale });

		const newPos = {
			x: stage.width() / 2 - center.x * newScale,
			y: stage.height() / 2 - center.y * newScale,
		};

		stage.position(newPos);
		stage.batchDraw();
	}

	const handleNodeDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
		const label = e.target?.id();
		const newPosition: Vector2D = {
			x: e.target.x(), 
			y: e.target.y() 
		} 
		const newData: NodeInfo = {
			label: label,
			position: newPosition,
		} 

		updateNodeList(
			nodeInfoList[selectedTab].map((target) => 
				target.label == label ? newData : target
			)
		)
	}


	return (
		<div>
			<NavBar/>
			<section className="content">
				<GraphInputs 
				textArea={textArea[selectedTab]} 
				selectedTab={selectedTab} 
				setSelectedTab={setSelectedTab} 
				visualise={visualise} 
				showInputs={showInputs} 
				setTextArea={(newVal: string) => setTextArea(prev => prev.map((item,idx)=>idx==selectedTab ? newVal : item))} 
				/>
				<div className="display" id='container' >
					<div className="display-controls">
						<button onClick={() => setShowInputs(!showInputs)} id="fullscreen-btn">
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4.25 13.25H0.75V9.75M13.25 9.75V13.25H9.75M9.75 0.75H13.25V4.25M0.75 4.25V0.75H4.25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
						<button onClick={() => zoomStage(1.3)}><p>+</p></button>
						<button onClick={() => zoomStage(0.7)}><p>-</p></button>
					</div>
					<Stage 
						onWheel={(e) => handleWheelZoom(e, stageRef.current)}
						ref={stageRef} 
						width={dimensions.x} 
						height={dimensions.y-HEADER_HEIGHT}
						draggable
					>
						<Layer>
							{ 
								(
									<> 
										{nodeInfoList[selectedTab].map((item, idx) => (
										<React.Fragment key={`node-${idx}`}>
											{createNode(item.position, item.label, true, handleNodeDrag)}
										</React.Fragment>
										))}
										{edgeInfoList[selectedTab].map((edge, idx) => {
										const fromNode = nodeInfoList[selectedTab].find((t) => t.label === edge.labelFrom);
										const toNode = nodeInfoList[selectedTab].find((t) => t.label === edge.labelTo);
										if (!fromNode || !toNode) return null;
										const points = getLinePoints(fromNode.position, toNode.position);
										return (
											<React.Fragment key={`edge-${idx}`}>
											{createEdge(points, edge.directed,edge.weight)}
											</React.Fragment>
										);
										})}
									</>
								)
							}
						</Layer>
					</Stage>
				</div>
			</section>
		</div>
	)
}

export default Page