import React from 'react';
import { COLORS, LINE_WIDTH } from '../../constants';
import { Arrow, Group, Line, Rect, Text } from 'react-konva';

type Props = {
    points: number[];
    directional: boolean;
    weight?: string;
};

const GraphEdge = ({ points, directional, weight }: Props) => {
    console.log(`weight: ${weight}`)
    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;

    return (
        <Group>
        {directional ? (
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
            />
        )}
        {weight && (
            <>
                <Rect
                    x={midX - (weight.length * 18) / 2}
                    y={midY - 15}
                    width={(weight.length * 18)}
                    height={30}
                    fill="#eee"
                    cornerRadius={8}
                />
                <Text
                x={midX}
                y={midY}
                text={weight}
                fontFamily='monospace'
                fontSize={28}
                verticalAlign="middle"
                align="center"
                width={weight.length * 28}
                height={30}
                offsetX={(weight.length * 28) / 2}
                offsetY={15}
                />
            </>
        )}
        </Group>
    );
};

export default GraphEdge;
