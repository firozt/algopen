import React from 'react'
import './index.css'

type Props = {
	title: string
    onClick: () => void
}

const SlideButton = ({title,onClick}: Props) => {
	return (
		<div className="v-wrapper">
			<a id="visualise-test" onClick={onClick}>
				<span >{title}</span>
			</a>
		</div>
	)
}

export default SlideButton