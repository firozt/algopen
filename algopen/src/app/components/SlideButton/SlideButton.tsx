import React from 'react'
import './index.css'

type Props = {
    onClick: () => void
}

const SlideButton = ({onClick}: Props) => {
	return (
		<div className="v-wrapper">
			<a id="visualise-test" onClick={onClick}>
				<span >Visualise</span>
			</a>
		</div>
	)
}

export default SlideButton