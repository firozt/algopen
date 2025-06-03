'use client'
import React, { useEffect, useRef } from 'react'
import { Rect } from 'react-konva'
import { COLORS } from '../../../utils/constants'
import { Vector2D } from '../../GlobalTypes'
import Konva from 'konva'

type Props = {
    position: Vector2D
    fill: COLORS
    height: number
    width: number
    animate?: boolean
}

const SortingRect = ({position,fill, height, width,animate=false}: Props) => {
    const ref = useRef<Konva.Rect>(null);
    useEffect(() => {
        
        const cur = ref.current;

        if (animate && cur) {
            const tween = new Konva.Tween({
            node: cur,
            duration: 1,
            x: position.x,
            y: position.y,
            easing: Konva.Easings.EaseInOut,
        });

        tween.play();
        return () => tween.destroy();
        }
    }, [animate, position.x, position.y])

    return (
        <>
            <Rect 
            ref={ref}
            x={position.x}
            y={position.y}
            width={width}
            height={height}
            fill={fill}
            />
        </>
    )
}

export default SortingRect