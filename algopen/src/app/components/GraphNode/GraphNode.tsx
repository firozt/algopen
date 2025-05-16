'use client'
import React, { useEffect, useRef } from 'react'
import { Vector2D } from '../../GlobalTypes'
import Konva from 'konva'
import { Group, Circle, Text} from 'react-konva'
import { NODE_RADIUS, COLORS, NODE_COLOR, LINE_WIDTH, TEXT_COLOR } from '../../constants'


type AnimateProps = {
    start: Vector2D
    duration: number
}

type Props = {
    pos: Vector2D,
    label: string,
    draggable: boolean,
    onDrag: (e: Konva.KonvaEventObject<DragEvent>) => void
    animation?: AnimateProps
    id: string
}


const GraphNode = ({ pos, label, id ,draggable = false, onDrag, animation }: Props) => {
    const groupRef = useRef<Konva.Group>(null);

    const startPos = animation ? animation.start : pos;

    useEffect(() => {
        if (animation && groupRef.current) {
        const tween = new Konva.Tween({
            node: groupRef.current,
            duration: 1,
            x: pos.x,
            y: pos.y,
            easing: Konva.Easings.EaseInOut,
        });

        tween.play();

        return () => tween.destroy(); 
        }
    }, [animation]);

    return (
        <Group
        ref={groupRef}
        id={id}
        x={startPos.x}
        y={startPos.y}
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
            text={label}
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