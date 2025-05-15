import Konva from 'konva'
import { Group, Circle, Text, Arrow } from 'react-konva';
import { Line } from 'react-konva';
import { Vector2D } from '../app/GlobalTypes';
import React from 'react';
import { COLORS, HEADER_HEIGHT, LINE_WIDTH, MOBILE_WIDTH, NODE_COLOR, NODE_RADIUS, TEXT_COLOR } from '../app/constants';

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


export function connectCircles(pos1: Vector2D, pos2: Vector2D): React.ReactNode {
    return  <Line
        points={[pos1.x, pos1.y, pos2.x, pos2.y]}
        stroke="black"
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
    />
}

export function createNode(pos: Vector2D, val: string, draggable = false, onDrag?: (e: Konva.KonvaEventObject<DragEvent>) => void): React.ReactNode {
    return (
        <Group
            id={val}
            x={pos.x}
            y={pos.y}
            draggable={draggable}
            onDragMove={onDrag}
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

export function createEdge(points: number[], directional: boolean, weight?: string){
    const arrowNode = (
        <Arrow
            points={points}        
            stroke={COLORS.BLACK}
            strokeWidth={LINE_WIDTH}
            fill={COLORS.BLACK}
            pointerLength={10}
            pointerWidth={10}
        />)
    const lineNode = (
        <Line
            points={points}        
            stroke={COLORS.BLACK}
            strokeWidth={LINE_WIDTH}
            fill={COLORS.BLACK}
            pointerLength={10}
            pointerWidth={10}
        />)

    if (weight) {
        const midX = (points[0] + points[2]) / 2;
        const midY = (points[1] + points[3]) / 2;
        const textNode = (
            <Text
                x={midX}
                y={midY}
                text={weight}
                fontSize={28}
                verticalAlign= {'middle'}
                align={'middle'}
                width={weight.length * 28}
                height={30}
            />)
        return (
            <Group>
                {
                    directional ? arrowNode : lineNode
                }
                {
                    textNode
                }
            </Group>
        )
    } else {
        return (
            directional ? arrowNode : lineNode
        )
    }
}

