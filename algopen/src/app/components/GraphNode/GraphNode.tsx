'use client'
import React, { useEffect, useRef } from 'react'
import { NodeInfo, Vector2D } from '../../GlobalTypes'
import Konva from 'konva'
import { Group, Circle, Text} from 'react-konva'
import { NODE_RADIUS, COLORS, NODE_COLOR, LINE_WIDTH, TEXT_COLOR } from '../../constants'


type AnimateProps = {
    start: Vector2D
    duration: number
}

type Props = {
    node: NodeInfo
    onDrag?: (e: Konva.KonvaEventObject<DragEvent>) => void
    onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void
    animation?: AnimateProps
}


const GraphNode = ({ node, onDrag, onDragEnd, animation }: Props) => {
    const groupRef = useRef<Konva.Group>(null);
    const startPos = animation ? animation.start : node.position;


    useEffect(() => {
        if (!(animation && groupRef.current) || node.dragged == true) {
            return
        }

        const generateAnimationObj = () => {
            return new Konva.Tween({
                node: groupRef.current,
                duration: 1,
                x: node.position.x,
                y: node.position.y,
                easing: Konva.Easings.EaseInOut,
            });
        }
        
        generateAnimationObj().play()
    });

    return (
        <Group
        ref={groupRef}
        id={node.id}
        x={startPos.x}
        y={startPos.y}
        draggable={onDrag != undefined}
        onDragMove={onDrag}
        onDragEnd={onDragEnd}
        >
        <Circle
            radius={NODE_RADIUS}
            fill={COLORS.BLACK}
            stroke={NODE_COLOR}
            strokeWidth={LINE_WIDTH}
        />
        <Text
            text={node.label}
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
    };

export default GraphNode;
