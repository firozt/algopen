import React from 'react';
import { Arrow, Group, Line, Rect, Text } from 'react-konva';
import { COLORS, LINE_WIDTH } from '@utils/constants';

type Props = {
    points: number[];
    directional: boolean;
    weight?: string;
};

const GraphEdge = ({ points, directional, weight }: Props) => {
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
                    x={midX - (weight.length * 12)/2}
                    y={midY - 12}
                    width={(weight.length * 12)}
                    height={24}
                    fill="#eee"
                    cornerRadius={12}
                />
                <Text
                x={midX}
                y={midY}
                text={weight}
                fontFamily='monospace'
                fontSize={18}
                verticalAlign="middle"
                align="center"
                width={weight.length * 18}
                height={30}
                offsetX={(weight.length * 18) / 2}
                offsetY={15}
                />
            </>
        )}
        </Group>
    );
};

export default GraphEdge;
