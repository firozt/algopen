'use client'
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import { Stage, Layer} from "react-konva";
import { EdgeInfo, NodeInfo, Vector2D } from '../GlobalTypes';
import { HEADER_HEIGHT, INPUTS_WIDTH, MOBILE_WIDTH, NODE_STARTUP_ANIMATION_DURATION, Theme } from '@utils/constants';
import { getSafeCorners, handleWheelZoom, zoomStage } from '@utils/SceneController';
import Konva from 'konva';
import GraphInputs from '../components/GraphInputs/GraphInputs';
import { getLevel } from '@utils/Misc';
import { generateRandomPoints, getLinePoints, } from '@utils/GeometryHelpers';
import GraphEdge from '../components/GraphEdge/GraphEdge';
import GraphNode from '../components/GraphNode/GraphNode';
import DisplayControls from '../components/DisplayControls/DisplayControls';

const Page = () => {
	const [textArea, setTextArea] = useState<string[]>(['1,null,2,null,null,3,4','directed\nA:B(3)\nB:C(2)\nC:A(1.2)','A:B,C,D'])

	const [nodeInfoList, setNodeInfoList] = useState<NodeInfo[][]>([[],[],[]]) // one for each tab
	const [edgeInfoList, setEdgeInfoList] = useState<EdgeInfo[][]>([[],[],[]]) // one for each tab

	const [showEdges,setShowEdges] = useState<boolean>(false)
	const [selectedTab, setSelectedTab] = useState<number>(0)
	const [dimensions, setDimensions] = useState<Vector2D>({ x: 0, y: 0 });
	const [center, setCenter] = useState<Vector2D>({x:0,y:0});
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

	//  -----------------------------------------------------
	// updater / setter method wrappers for usestates

	const updateNode = (nodeId: string, newData: NodeInfo) => {
		updateNodeList(
			nodeInfoList[selectedTab].map((target) => 
				target.id == nodeId ? newData : target
			)
		)
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

	//  -----------------------------------------------------


	const pushToNodeList = (nodeInfo: NodeInfo) => {
		setNodeInfoList(prev => {
			const newList = [...prev[selectedTab], nodeInfo];
			return prev.map((item, idx) =>
				idx === selectedTab ? newList : item
			);
		});
	};

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
					idFrom: node,
					idTo: nodeToObj,
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
					idFrom: node,
					idTo: neighbour,
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


	/*  -----------------------------------------------------
	 *	event handlers
	*/
	const visualise = () => {
		// setSafeZone(getSafeCorners(center,dimensions.x))
		const input = textArea[selectedTab]
		resetStage()
		setShowEdges(false)


		if (selectedTab == 0) {
			const parsed_input = input.replaceAll('[','').replaceAll(']','').replaceAll(' ','').split(',')
			generateTree(parsed_input)
		}
		else if (selectedTab == 1) {
			const [parsed, directional] = isDirectional(input)
			graphWeightedVisualiser(parsed,directional)
		}
		else if (selectedTab == 2) {
			const [parsed, directional] = isDirectional(input)

			graphVisualiser(parsed,directional)
		} 
		else {
			throw new Error('Selected could not be parsed : ' + selectedTab)
		}
		if (window.innerWidth < MOBILE_WIDTH) {
			setShowInputs(false)
		}
		setTimeout(() => setShowEdges(true), NODE_STARTUP_ANIMATION_DURATION*2000)
	}

	const generateTree = (tree_array: string[] | number[]) => {
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
			if (right < tree_array.length  &&  tree_array[right] != 'null') {
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
			x:center.x,
			y:center.y-(innerHeight/4)
		});
	}

	const handleNodeDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
		const id = e.target?.id();
		const node = nodeInfoList[selectedTab].find(node => node.id == id)
		if (node == null) {
			throw new Error('Node clicked cannot be found')
		}

		const newPosition: Vector2D = {
			x: e.target.x(), 
			y: e.target.y() 
		} 

		const newData: NodeInfo = {
			label: node.label,
			// position: newPosition,
			position: newPosition,
			id: id,
			dragging: true
		} 

		updateNode(node.id,newData)
	}

	return (
		<div>
			<NavBar theme={Theme.DARK}/>
			<section className="content">
				<GraphInputs 
				textArea={textArea[selectedTab]} 
				selectedTab={selectedTab} 
				// newPos={{ x:dimensions.x < MOBILE_WIDTH ? -1000 : -400,y:0 }}
				slideDirection={'left'}
				setSelectedTab={(index) => {
					if (selectedTab == index) return // no action needed

					// wait for animation if something exists
					if (edgeInfoList[index].length > 0) {
						setShowEdges(false)
						setTimeout(() => setShowEdges(true),NODE_STARTUP_ANIMATION_DURATION*2000)
					}
					setSelectedTab(index)
					
				}} 
				visualise={visualise} 
				showInputs={showInputs} 
				setTextArea={(newVal: string) => setTextArea(prev => prev.map((item,idx)=>idx==selectedTab ? newVal : item))} 
				/>
				<div className="display" id='container' >
					<DisplayControls
					zoomStage={(zoomBy) => zoomStage(zoomBy,stageRef?.current,dimensions.x)}
					toggleShow={() =>setShowInputs(prev => !prev)}
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
					>
						<Layer>
							{ 
								(
									<>  
										{nodeInfoList[selectedTab].map((item, idx) => ( // creating nodes
										<React.Fragment key={`node-${idx}`}>
											<GraphNode  
												node={item}
												onDrag={handleNodeDrag} 
												onDragEnd={() => updateNode(item.id,{...item,dragging: false})}
												animation={{
													start: center,
													duration:NODE_STARTUP_ANIMATION_DURATION,
												}}
											/>
										</React.Fragment>
										))}
										{edgeInfoList[selectedTab].map((edge, idx) => { // creating edges to said nodes
										const fromNode = nodeInfoList[selectedTab].find((t) => t.id === edge.idFrom);
										const toNode = nodeInfoList[selectedTab].find((t) => t.id === edge.idTo);
										if (!fromNode || !toNode) return null;
										const points = getLinePoints(fromNode.position, toNode.position);
										return (
											<React.Fragment key={`edge-${idx}`}>
												<GraphEdge 
													points={showEdges ? points : [0,0,0,0]} 
													directional={edge.directed} 
													weight={edge.weight} 
												/>
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