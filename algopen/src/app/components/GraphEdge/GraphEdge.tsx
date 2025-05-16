import React from 'react'
import { COLORS, LINE_WIDTH } from '../../constants'
import { Arrow, Group, Line, Text } from 'react-konva'

type Props = {
    points: number[]
    directional: boolean
    weight?: string
}



const GraphEdge = ({points,directional,weight}: Props) => {
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

export default GraphEdge