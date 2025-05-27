'use client'
import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import './index.css'


type Props = {
    showContent?: boolean,
    children?: React.ReactNode
    styles?: React.CSSProperties
    slide?: 'up' | 'left'
    slideBuffer?: number // doesnt slide off screen fully, by x px
}




const SideTab = ({showContent=true, children,styles,slide, slideBuffer=0}: Props) => {


    
    const containerRef = useRef<HTMLDivElement|null>(null)
    
    const slideMapping = {
    'up':{x:0,y:  -1*(containerRef?.current?.offsetHeight ?? 0)+slideBuffer}, 
    'left':{x:(containerRef?.current?.offsetWidth ?? 0) * -1 +slideBuffer,y:0}
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