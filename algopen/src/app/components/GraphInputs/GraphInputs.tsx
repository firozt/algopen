import { motion } from 'framer-motion'
import React from 'react'
import { MOBILE_WIDTH } from '../../constants'

type Props = {
	showInputs: boolean
	selectedTab: number
	setSelectedTab: React.Dispatch<number>
	setTextArea: React.Dispatch<string>
	visualise: () => void
}


const infoText = [
	'Enter in array format, each node label seperated by a comma ( , ) below',
	'Enter the graph in adjancency list format with the weighting in brackets, i.e:\nnodeX : neighbourA(2),neighbourB(3)\nnodeY...\nFor a directed graph, begin line 1 with \'directed\'',
	'Enter the graph in adjancency list format, i.e:\nnodeX : neighbourA,neighbourB\nnodeY...\nFor a directed graph, begin line 1 with \'directed\'',
]

const GraphInputs = ({showInputs, selectedTab, setSelectedTab, setTextArea, visualise}: Props) => {
	return (
		<motion.div
			className="inputs"
			initial={{ x: 0 }}
			animate={{ x: showInputs ? 0 : innerWidth < MOBILE_WIDTH ? -1000 : -400 }}
			transition={{ duration: .35 ,ease: 'easeInOut'}}
		>
			<div id="top-inputs">
				<div className="selections">
					<ul id="tab-container">
						<button onClick={() => setSelectedTab(0)} className={selectedTab == 0 ? 'selected' : ''}>Binary Tree</button>
						<button onClick={() => setSelectedTab(1)} className={selectedTab == 1 ? 'selected' : ''}>Weighted Graph</button>
						<button onClick={() => setSelectedTab(2)} className={selectedTab == 2 ? 'selected' : ''}>Graph</button>
					</ul>
				</div>
				<div id="info">
					<p>{infoText[selectedTab]}</p>
					<hr style={{marginTop: '10px',color: 'rgba(128, 128, 128, 0.427)'}}/>
				</div>
				<textarea onChange={(e) => setTextArea(e.target.value)} id="text-input"></textarea>
			</div>
			<div id="visualise" className="v-wrapper">
				<a id="visualise-test" onClick={() => visualise()}>
					<span >Visualise</span>
				</a>
			</div>
		</motion.div>
	)
}

export default GraphInputs