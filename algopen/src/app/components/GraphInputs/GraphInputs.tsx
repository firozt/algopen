import { motion } from 'framer-motion'
import React from 'react'
import { MOBILE_WIDTH } from '../../constants'
import './index.css'
import SlideButton from '../SlideButton/SlideButton'

type Props = {
	showInputs: boolean
	selectedTab: number
	setSelectedTab: React.Dispatch<number>
	setTextArea: (newVal: string) => void
	textArea: string
	visualise: () => void
}


const infoText = [
	<p key={0}>
		Enter in array format, each node label seperated by a comma ( , ) below <br/>
		More info can be found <a target='_BLANK' href='https://www.w3schools.com/dsa/dsa_data_binarytrees_arrayImpl.php'>here</a>
	</p>,
	<p key={1}>
		Enter the graph in adjancency list format with the weighting in brackets, i.e: <br/>
		nodeX : neighbourA(2),neighbourB(3) <br/>
		nodeY... <br/>
		For a directed graph, begin line 1 with &apos;directed&apos;
	</p>,
	<p key={2}>
		Enter the graph in adjancency list format, i.e: <br/>
		nodeX : neighbourA,neighbourB <br/>
		nodeY... <br/>
		For a directed graph, begin line 1 with &apos;directed&apos;
	</p>
]

const GraphInputs = ({showInputs, selectedTab, setSelectedTab, setTextArea, textArea, visualise}: Props) => {
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
					{infoText[selectedTab]}
					<hr style={{marginTop: '10px',color: 'rgba(128, 128, 128, 0.427)'}}/>
				</div>
				<textarea value={textArea} onChange={(e)=> setTextArea(e.target.value)} id="text-input"></textarea>
			</div>
			<SlideButton title='Visualise' onClick={visualise} />

		</motion.div>
	)
}

export default GraphInputs