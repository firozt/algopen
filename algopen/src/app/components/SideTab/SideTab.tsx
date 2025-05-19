'use client'
import { motion } from 'framer-motion'
import React from 'react'
import { MOBILE_WIDTH } from '../../../utils/constants'
import './index.css'
import { Vector2D } from '../../GlobalTypes'

type Props = {
    showContent?: boolean,
    children?: React.ReactNode
    styles?: React.CSSProperties
    newPos?: Vector2D
}


const SideTab = ({showContent=true, children,styles,newPos}: Props) => {
    return (
		<motion.div
			className="side-tab"
            style={styles}
			initial={{ x: 0, y: 0 }}
			// animate={{ x: showContent ? 0 : innerWidth < MOBILE_WIDTH ? -1000 : -400 }}
			// animate={{y: showContent ? 0 : innerHeight-90 }}
            animate={!showContent ? newPos : {x:0,y:0}}
			transition={{ duration: .35 ,ease: 'easeInOut'}}
		>
            {
                children
            }
		</motion.div>
    )
}

export default SideTab