'use client'

import React, { useState } from 'react'
import './index.css'

type Props = {
	title: string
	hoveredTitle?: string
    onClick: () => void
	styles?: React.CSSProperties
}

const SlideButton = ({title,hoveredTitle=title,onClick,styles}: Props) => {
	const [buttonText, setButtonText] = useState<string>(title)

	return (
		<div className="v-wrapper" style={styles}>
			<a 
				id="visualise-test" 
				onClick={onClick}
				onMouseEnter={hoveredTitle ? () => setTimeout(() => setButtonText(hoveredTitle),200) : () => null} 
				onMouseLeave={hoveredTitle ? () => setButtonText(title) : () => null}
			>
				<span >{buttonText}</span>
			</a>
		</div>
	)
}

export default SlideButton