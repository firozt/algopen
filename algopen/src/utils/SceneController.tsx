import Konva from 'konva'
import { Group, Circle, Text, Arrow } from 'react-konva';
import { Layer } from 'konva/lib/Layer';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { LineConfig } from 'konva/lib/shapes/Line';
import { Line } from 'react-konva';
import { Vector2D } from '../app/GlobalTypes';
import React, { EventHandler } from 'react';
import { COLORS, HEADER_HEIGHT, INPUTS_WIDTH, LINE_WIDTH, MOBILE_WIDTH, NODE_COLOR, NODE_RADIUS, TEXT_COLOR } from '../app/constants';

export function getSafeCorners(center: Vector2D, width: number): Vector2D[] {
    const isMobile = width <= MOBILE_WIDTH
    console.log('isMobile? ' + isMobile)
    if (!isMobile) {
        return [
            {x:430,y:30}, // top left
            {x:center.x+(center.x-430),y:30}, // top right
            {x:430,y:(center.y*2)+HEADER_HEIGHT/2}, // bottome left
            {x:center.x+(center.x-430),y:(center.y*2)+HEADER_HEIGHT/2}, // bottom right
        ]
    } else {
        return [
            {x:660,y:35}, // top left
            {x:(center.x-400)*2,y: 35}, // top right
            {x:660,y:(center.y*2)-100}, // bottom left
            {x:(center.x-400)*2,y:(center.y*2)-100} // bottom right
        ]
    }
}


type EdgeInfo = {
	labelFrom: string
	labelTo: string
	weight?: string
	directed: boolean
}

type NodeInfo = {
	position: Vector2D
	label: string // unique
}


export function getVisibleCenter(stage: Konva.Stage, windowWidth: number) {
    console.log('width = '+windowWidth)
    const scale = stage.scaleX(); // assuming uniform scale for x and y
    const position = stage.position();
    const width = stage.width();
    const height = stage.height();
    // Convert center screen point to stage coordinates
    const center = {
        x: (width / 2 - position.x) / scale,
        y: (height / 2 - position.y) / scale,
    };

    if (windowWidth <= MOBILE_WIDTH) {
        center.y += 300
    } else {
        center.x += 400
    }

    return center;
}

export function initialiseStage(): Konva.Stage {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
        draggable: true,
        scale:{x:.6,y:.6},
    });

    stage.on('wheel', (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
    
        if (!pointer) {
            console.warn('Developer Error: Pointer is null on zoom out')
            return
        }
    
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
    
        const direction = e.evt.deltaY > 0 ? 1 : -1;
        const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    
        stage.scale({ x: newScale, y: newScale });
    
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
    
        stage.position(newPos);
        stage.batchDraw();
    });

    // base layer
    const layer = new Konva.Layer();
    stage.add(layer);
    
    
    return stage
}

export function connectCircles(pos1: Vector2D, pos2: Vector2D): React.ReactNode {
    return  <Line
        points={[pos1.x, pos1.y, pos2.x, pos2.y]}
        stroke="black"
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
    />
}


// export function resetStage(stage: Konva.Stage) {
//     stage.getChildren().forEach(layer => {
//         if (layer instanceof Konva.Layer) {
//           layer.destroyChildren(); // remove all shapes in this layer
//           layer.draw();            // redraw to apply the changes
//         }
//     });
    
// }

export function createNode(pos: Vector2D, val: string, draggable = false, onDrag?: (e: any) => void): React.ReactNode {
    return (
        <Group
            id={val}
            x={pos.x}
            y={pos.y}
            draggable={draggable}
            onDragMove={onDrag}
            // onMouseOver={() => setFillColor(COLORS.RED)}
            // onMouseOut={() => setFillColor(NODE_COLOR)}
            >
        <Circle
            radius={NODE_RADIUS}
            fill={COLORS.BLACK}
            stroke={NODE_COLOR}
            strokeWidth={LINE_WIDTH}
        />
        <Text
            text={val}
            fontSize={20}
            fill={TEXT_COLOR}
            align="center"
            verticalAlign="middle"
            width={60}
            height={60}
            offsetX={NODE_RADIUS}
            offsetY={NODE_RADIUS}
        />
        </Group>
    );
}



    // group will contain circle node and text on the circle node
    // const group = new Konva.Group({ 
    //     x: pos.x, 
    //     y: pos.y, 
    //     draggable 
    // }); 

    // const circle = new Konva.Circle({
    //     radius: NODE_RADIUS,
    //     fill: NODE_COLOR,
    //     stroke: NODE_COLOR, // same color as node
    //     strokeWidth: LINE_WIDTH,
    // });

    // const text = new Konva.Text({
    //     text: val.toString(),
    //     fontSize: 20,
    //     fill: TEXT_COLOR,
    //     align: 'center',
    //     verticalAlign: 'middle',
    //     width: 60,
    //     height: 60,
    //     offsetX: NODE_RADIUS,
    //     offsetY: NODE_RADIUS
    // });


    // group.add(circle);
    // group.add(text);


    // group.on('mouseover',() => {
    //     circle.fill('red')
    // })
    // group.on('mouseout',() => {
    //     circle.fill('black')

    // })

    // return group;
// }


export function createDraggableNode(pos: Vector2D, val: string, layer: Konva.Layer): Group{
    const node = createNode(pos, val, true, layer);
    return node
}

function updateLine(node1: Konva.Group, node2: Konva.Group, line: Konva.Line, layer: Konva.Layer){
    const pos1 = node1.getPosition()
    const pos2 = node2.getPosition()

    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Calculate shortened start and end points
    const offsetX = (dx / length) * 30;
    const offsetY = (dy / length) * 30;

    const newStartX = pos1.x + offsetX;
    const newStartY = pos1.y + offsetY;
    const newEndX = pos2.x - offsetX;
    const newEndY = pos2.y - offsetY;

    line.points([newStartX, newStartY, newEndX, newEndY]);
    layer.batchDraw();
}

export function createEdge(points: number[], directional: boolean){

    return directional ? (
        <Arrow 
            points={points}        
            stroke={COLORS.BLACK}
            strokeWidth={LINE_WIDTH}
            fill={COLORS.BLACK}
            pointerLength={10}
            pointerWidth={10}
        /> 
    ) : (
        <Line
            points={points}        
            stroke={COLORS.BLACK}
            strokeWidth={LINE_WIDTH}
            fill={COLORS.BLACK}
            pointerLength={10}
            pointerWidth={10}
        />
    )

    // const line = createLine(
    //     directional
    //     ,{
    //     points: [], // will be set below
    //     stroke: 'black',
    //     strokeWidth: 2,
    //     pointerLength: 10,
    //     pointerWidth: 10,
    //     fill: 'black',
    // });
    // layer.add(line)

    // node1.on('dragmove', () => updateLine(node1,node2,line,layer));
    // node2.on('dragmove', () => updateLine(node1,node2,line,layer));
    // updateLine(node1,node2,line,layer)  // initial draw of lines
}

function createLine(directional=false, config: ArrowConfig | LineConfig): Konva.Arrow | Konva.Line {
    return directional ? new Konva.Arrow(config as ArrowConfig) : new Konva.Line(config as LineConfig) 
}


export function createWeightedNodeConnection(node1: Group, node2: Group, weighting: string, directional: boolean, layer: Konva.Layer){

    const group = new Konva.Group()

    const line = createLine(
        directional
        ,{
        points: [], // will be set below
        stroke: 'black',
        strokeWidth: 2,
        pointerLength: 10,
        pointerWidth: 10,
        fill: 'black',
    });
    layer.add(line)

    
    const text = new Konva.Text({
        text: weighting,
        fontSize: 28,
        fill: 'black',
        verticalAlign: 'middle',
        align:'middle',
        width: weighting.length * 28,
        height: 30,
        offsetX: 30,
        offsetY: 30
    });
    
    group.add(line)
    group.add(text)
    layer.add(group)
    

    node1.on('dragmove', () => {updateLine(node1,node2,line,layer); updateText(line,text,layer)});
    node2.on('dragmove', () => {updateLine(node1,node2,line,layer); updateText(line,text,layer)});

      // initial draw of lines
    updateLine(node1,node2,line,layer)
    updateText(line,text,layer)
}
function updateText(line: Konva.Arrow | Konva.Line,text: Konva.Text, layer: Layer) {
    const linePoints = line.points()
    const point1: Vector2D = {x:linePoints[0],y:linePoints[1]}
    const point2: Vector2D = {x:linePoints[2],y:linePoints[3]}

    const buffer: Vector2D = {x:-0,y:-0}

    const midpoint: Vector2D = {
        x: ((point1.x+point2.x)/2)+buffer.x,
        y: ((point1.y+point2.y)/2)+buffer.y
    }

    text.position(midpoint)
    text.zIndex(0)
    layer.batchDraw()
}

