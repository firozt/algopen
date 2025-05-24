'use client'
import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import './index.css'
import { SlideDirection } from '../../../utils/constants'


type Props = {
    showContent?: boolean,
    children?: React.ReactNode
    styles?: React.CSSProperties
    slide?: SlideDirection
    slideBuffer?: number // doesnt slide off screen fully, by x px
}




const SideTab = ({showContent=true, children,styles,slide, slideBuffer=0}: Props) => {


    
    const containerRef = useRef<HTMLDivElement|null>(null)
    
type SlideVector = { x: number; y: number }

    const slideMapping: Partial<Record<SlideDirection, SlideVector>> = {
    [SlideDirection.UP]: {
        x: 0,
        y: -1 * ((containerRef.current?.offsetHeight ?? 0) - slideBuffer),
    },
    [SlideDirection.LEFT]: {
        x: -1 * ((containerRef.current?.offsetWidth ?? 0) - slideBuffer),
        y: 0,
    },
    }


    return (
		<motion.div
            ref={containerRef}
			className="side-tab"
            style={styles}
			initial={{x:0,y:0}}
            animate={!showContent && slide ? slideMapping[slide] : {x:0,y:0}}
			transition={{ duration: .35 ,ease: 'easeInOut'}}
		>
            {
                children
            }
		</motion.div>
    )
}

export default SideTab