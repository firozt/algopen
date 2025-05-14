'use client'

import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import { Stage, Layer, Circle, Group } from "react-konva";
import { Vector2D } from '../GlobalTypes';
import { COLORS, HEADER_HEIGHT, INPUTS_WIDTH, MOBILE_WIDTH } from '../constants';
import { connectCircles, createNode, getSafeCorners, getVisibleCenter } from '../../utils/SceneController';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { motion } from 'framer-motion';


// type Props = {}

const infoText = [
	'Enter in array format, each node label seperated by a comma ( , ) below',
	'Enter the graph in adjancency list format with the weighting in brackets, i.e:\nnodeX : neighbourA(2),neighbourB(3)\nnodeY...\nFor a directed graph, begin line 1 with \'directed\'',
	'Enter the graph in adjancency list format, i.e:\nnodeX : neighbourA,neighbourB\nnodeY...\nFor a directed graph, begin line 1 with \'directed\'',
]


const Page = () => {


	const [textArea, setTextArea] = useState<string>('')
	const [groupToRender, setGroupToRender] = useState<React.ReactNode[]>([]) // list of nodes to render from konva
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
			// else if (selected == 2) {
					// console.log('graph visualiser')
					// const [parsed, directional] = isDirectional(input)

					// graphVisualiser(parsed,directional)
			// } else {
					// console.warn('Selected could not be parsed : ' + selected)
			// }
	}

	function getLevel(index: number): number {
			return Math.floor(Math.log2(index + 1));
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


	return (
		<div>
			<NavBar/>
			<section className="content">
				{/* <div className="inputs"> */}
				<motion.div
				className="inputs"
        initial={{ x: 0 }}
        animate={{ x: showInputs ? 0 : innerWidth < MOBILE_WIDTH ? -1000 : -400 }}
        transition={{ duration: .35 ,ease: 'easeInOut'}}
				>
					<div id="top-inputs">
						<div className="selections">
							<ul id="tab-container">
								<button onClick={() => setSelectedTab(0)} className={selectedTab == 0 ? 'selected' : ''}>Binary Tree</button>
								<button onClick={() => setSelectedTab(1)} className={selectedTab == 1 ? 'selected' : ''}>Weighted Graph</button>
								<button onClick={() => setSelectedTab(2)} className={selectedTab == 2 ? 'selected' : ''}>Graph</button>
							</ul>
						</div>
						<div id="info">
							<p>{infoText[selectedTab]}</p>
							<hr style={{marginTop: '10px',color: 'rgba(128, 128, 128, 0.427)'}}/>
						</div>
						<textarea onChange={(e) => setTextArea(e.target.value)} id="text-input"></textarea>
					</div>
					<div id="visualise" className="v-wrapper">
						<a id="visualise-test" onClick={() => visualise()}>
							<span >Visualise</span>
						</a>
					</div>
				</motion.div>
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
									groupToRender.map((node,idx) => {
										return (
											<React.Fragment key={idx}>{node}</React.Fragment>
										)
									})
								}
								{/* {console.log(groupToRender.length)} */}
							</Layer>

						</Stage>
				</div>
			</section>
		</div>
  )
}

export default Page