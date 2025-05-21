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
    
    const slideMapping = {
    'down':{x:0,y:  containerRef?.current?.offsetHeight-slideBuffer}, // - container height
    'left':{x:-containerRef?.current?.offsetWidth+slideBuffer,y:0}
    }


    return (
		<motion.div
            ref={containerRef}
			className="side-tab"
            style={styles}
			initial={{x:0,y:0}}
            animate={!showContent ? slideMapping[slide] : {x:0,y:0}}
			transition={{ duration: .35 ,ease: 'easeInOut'}}
		>
            {
                children
            }
		</motion.div>
    )
}

export default SideTab