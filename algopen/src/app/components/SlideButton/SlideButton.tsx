'use client'

import React, { useState } from 'react'
import './index.css'

type Props = {
	title: string
	hoveredTitle?: string
    onClick: () => void
}

const SlideButton = ({title,hoveredTitle=title,onClick}: Props) => {
	const [buttonText, setButtonText] = useState<string>(title)

	return (
		<div className="v-wrapper">
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