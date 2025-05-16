import React from 'react'
import { Vector2D } from '../../GlobalTypes'
import Konva from 'konva'
import { Group, Circle, Text} from 'react-konva'
import { NODE_RADIUS, COLORS, NODE_COLOR, LINE_WIDTH, TEXT_COLOR } from '../../constants'

type Props = {
    pos: Vector2D,
    label: string,
    draggable: boolean,
    onDrag: (e: Konva.KonvaEventObject<DragEvent>) => void
}

const GraphNode = ({pos,label,draggable=false,onDrag}: Props) => {
return (
        <Group
            id={label}
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
}

export default GraphNode