'use client'
import React, { useEffect, useRef } from 'react'
import { NodeInfo, Vector2D } from '../../GlobalTypes'
import Konva from 'konva'
import { Group, Circle, Text} from 'react-konva'
import { NODE_RADIUS, COLORS, LINE_WIDTH, TEXT_COLOR } from '../../../utils/constants'


type AnimateProps = {
    start: Vector2D
    duration: number
}

type Props = {
    node: NodeInfo
    onDrag?: (e: Konva.KonvaEventObject<DragEvent>) => void
    onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void
    animation?: AnimateProps
    fill?: COLORS
}


const GraphNode = ({ node, onDrag, onDragEnd, animation, fill=COLORS.BLACK }: Props) => {
    const groupRef = useRef<Konva.Group>(null);
    const startPos = animation ? animation.start : node.position;


    useEffect(() => {
        const group = groupRef.current;

        if (animation && group && node.dragging !== true) {
            const tween = new Konva.Tween({
            node: group, // ✅ Type-safe
            duration: 1,
            x: node.position.x,
            y: node.position.y,
            easing: Konva.Easings.EaseInOut,
        });

        tween.play();
        return () => tween.destroy();
        }
    }, [animation, node.dragging, node.position.x, node.position.y]);


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
            fill={fill}
            stroke={fill}
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
