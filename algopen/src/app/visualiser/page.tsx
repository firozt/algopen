'use client'

import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import { Stage, Layer, Line } from "react-konva";
import { Vector2D } from '../GlobalTypes';
import { HEADER_HEIGHT, INPUTS_WIDTH, MAX_PLACEMENT_ATTEMPTS, MOBILE_WIDTH } from '../constants';
import { connectCircles, createEdge, createNode, createNodeConnection, getSafeCorners, getVisibleCenter } from '../../utils/SceneController';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import GraphInputs from '../components/GraphInputs/GraphInputs';
import { closeToAnotherNode, getLevel, intersectsAllLines, randomInt } from '../../utils/Misc';
import { Vector2d } from 'konva/lib/types';
import { getLinePoints } from '../../utils/GeometryHelpers';


type NodeInfo = {
	position: Vector2D
	label: string // unique
}

type EdgeInfo = {
	labelFrom: string
	labelTo: string
	weight?: string
	directed: boolean
}

const Page = () => {
	const [textArea, setTextArea] = useState<string>('')
	const [groupToRender, setGroupToRender] = useState<React.ReactNode[]>([]) // list of nodes to render from konva

	const [nodeInfoList, setNodeInfoList] = useState<NodeInfo[]>([])
	const [edgeInfoList, setEdgeInfoList] = useState<EdgeInfo[]>([])
	
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

	const isDirectional = (input: string): [string, boolean] => {
		console.log( input.split('\n')[0].toLowerCase())
		const res = input.length > 0 && input.split('\n')[0].toLowerCase() == 'directed'

		if (res) {
			input = input.replace(/directed\n/i,'')
		}
		return [input,res]
	}


	function generateAllNodePositions(unique_nodes: Set<string>): NodeInfo[] {
		const nodeList: NodeInfo[] = []
		const previousPositions: Vector2d[] = [] // holds previous x,y values
		unique_nodes.forEach(node => {
			let random_x
			let random_y
			let attempts = 0

			const safeCorners = safeZone
			const buffer = unique_nodes.size > 7 ? (unique_nodes.size-5) * 30 : 0
			const nodeMinDistance = unique_nodes.size < 9 ? 1500 / (unique_nodes.size+1)  : 150
			do {
				random_x = randomInt(safeCorners[0].x-buffer,safeCorners[1].x+buffer)
				random_y = randomInt(safeCorners[0].y-buffer,safeCorners[2].y+buffer)
				attempts += 1
				if (attempts == MAX_PLACEMENT_ATTEMPTS) console.log('could not find suitable position')
			} while (
				attempts <= MAX_PLACEMENT_ATTEMPTS &&
				(
					closeToAnotherNode({x: random_x, y: random_y}, previousPositions, nodeMinDistance) || 
					intersectsAllLines({x: random_x, y: random_y}, previousPositions)
				)
			)
			
			const validPosition: Vector2D = {x:random_x,y:random_y}
			previousPositions.push(validPosition)
			nodeList.push({
				label: node,
				position: validPosition,
			})
		})
		return nodeList
	}


	function graphVisualiser(input: string, directional: boolean) {
		const parseInput = (input: string): [NodeInfo[], string[]]  => {
			// get all unique nodes

			const unique_nodes = new Set(input.replaceAll(' ','').split(/[,\n:]+/))  // regex splits on comma, newline and colon // contains set of all unique nodes
			const parsedInput = input.replaceAll(' ','').split('\n')  // contains user input, each index is new line

			return [generateAllNodePositions(unique_nodes),parsedInput]
		}

		const [nodeList, parsedInput] = parseInput(input)
		setNodeInfoList(nodeList)
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
		setEdgeInfoList(edgeList)
	}



	const visualise = () => {
		const input = textArea
		console.log(textArea)

		setGroupToRender([])

		if (window.innerWidth < MOBILE_WIDTH) {
			setShowInputs(false)
		}

		if (selectedTab == 0) {
			const parsed_input = input.replaceAll('[','').replaceAll(']','').replaceAll(' ','').split(',')
			console.log('tree visualising')
			generateTree(parsed_input)
		}
			// else if (selected == 1) {
					// console.log('tree traversal')
					// const [parsed, directional] = isDirectional(input)
					// graphWeightedVisualiser(parsed,directional)
			// }
			else if (selectedTab == 2) {
					console.log('graph visualiser')
					const [parsed, directional] = isDirectional(input)

					graphVisualiser(parsed,directional)
			} 
			// else {
					// console.warn('Selected could not be parsed : ' + selected)
			// }
	}



	const addNodesToRender = (node: React.ReactNode) => {
		setGroupToRender(prev => [...prev, node]);
	};

	function generateTree(tree_array: string[]) {
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
				addNodesToRender(connectCircles(pos,
					{
						x: pos.x - new_x,
						y:  new_y
					},
				));
				dfs(left, 
						{
							x: pos.x - new_x,
							y: new_y
						}
				);
			}
			if (right < tree_array.length  &&  tree_array[right] != 'null') {
				addNodesToRender(connectCircles(pos, 
					{
						x: pos.x + new_x,
						y:  new_y
					},
				));
				dfs(
					right,
					{
						x: pos.x + new_x,
						y: new_y
					}
				);
			}
		addNodesToRender(createNode(pos, tree_array[index],false));
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


	function zoomStage(scaleBy=1.5) {
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

	const handleNodeDrag = (e) => {
		const label = e.target.id();
		const newPosition: Vector2D = {
			x: e.target.x(), 
			y: e.target.y() 
		} 
		const newData: NodeInfo = {
			label: label,
			position: newPosition,
		} 

		setNodeInfoList(
			nodeInfoList.map((target) => 
				target.label == label ? newData : target
			)
		)
	}


	return (
		<div>
			<NavBar/>
			<section className="content">
				<GraphInputs selectedTab={selectedTab} setSelectedTab={setSelectedTab} visualise={visualise} showInputs={showInputs} setTextArea={setTextArea} />
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
							{ // binary trees
								selectedTab == 0 &&
								groupToRender.map((node,idx) => {
									return (
										<React.Fragment key={idx}>{node}</React.Fragment>
									)
								}) 
							}
							{selectedTab === 2 && (
							<>
								{nodeInfoList.map((item, idx) => (
								<React.Fragment key={`node-${idx}`}>
									{createNode(item.position, item.label, true, handleNodeDrag)}
								</React.Fragment>
								))}
								{edgeInfoList.map((edge, idx) => {
								const fromNode = nodeInfoList.find((t) => t.label === edge.labelFrom);
								const toNode = nodeInfoList.find((t) => t.label === edge.labelTo);
								if (!fromNode || !toNode) return null;
								const points = getLinePoints(fromNode.position, toNode.position);
								return (
									<React.Fragment key={`edge-${idx}`}>
									{createEdge(points, edge.directed)}
									</React.Fragment>
								);
								})}
							</>
							)}

						</Layer>
					</Stage>
				</div>
			</section>
		</div>
  )
}

export default Page