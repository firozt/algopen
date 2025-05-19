'use client'
import React, { use, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import './index.css'
import SideTab from '../components/SideTab/SideTab'
import SlideButton from '../components/SlideButton/SlideButton'
import ErrorMsg from '../components/ErrorMsg/ErrorMsg'


enum ERROR_MESSAGES {
	EmptyInput='The input you wrote is empty, please enter a (max 4 digit) number inside the node',
	NoValidNumbers='The input you wrote does not contain any numbers, please enter a max 4 digit number within the node, note that this feature does not support floating points'
}

const btnStyles = {
	height:'100%'
}

	// type Props = {}

	const page = () => {

		const [inputVal, setInputVal] = useState<string>('')
		const [errorMsg, setErrorMsg] = useState<string>('')
		const [showSideBar, setShowSidebar] = useState<boolean>(true)
		const parseInput = (): boolean => {
			setErrorMsg('')

			if (inputVal.length < 1) {
				setErrorMsg(ERROR_MESSAGES.EmptyInput)
				return
			}

			const numberOnly = inputVal.match(/-?\d+(\.\d+)?/)

			if (numberOnly == null) {
				setErrorMsg(ERROR_MESSAGES.NoValidNumbers)
				return
			}
		}

		const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.value.length > 4) return
			setInputVal(e.target.value)
		}


		const handlePush = () => {
			parseInput()
		}

	return (
		<>
			<NavBar />
			<SideTab
			showContent={showSideBar}
			styles={{
				height:'fit-content',
				borderRight:'3px solid black',
				borderBottom:'3px solid black'
			}}
			newPos={{x:0,y:innerHeight-90 }}
			>
				<header className='heap-vis-header'>
					<p>Heap Input Controller</p>
					<div onClick={() => setShowSidebar(prev => !prev)}>
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M4.25 13.25H0.75V9.75M13.25 9.75V13.25H9.75M9.75 0.75H13.25V4.25M0.75 4.25V0.75H4.25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
				</header>
				<div className='heap-vis-container'>
					<p>
						To push to the heap click on the node below and write the desired
						number to push onto the heap
					</p>
					<div className='input-container'>
						<input value={inputVal} placeholder='0000' onChange={handleInputChange} id='heap-input' className={errorMsg.length > 1 ? 'pulsate-error' : inputVal.length < 1 ? 'pulsate' : ''}/>
					</div>
					{
						errorMsg && <ErrorMsg message={errorMsg} severity={0} />
					}
					<div className='btn-group'>
						<SlideButton onClick={() => handlePush()} title='Push Node' styles={btnStyles} />
						<SlideButton onClick={() => 1} title='Pop Heap'  styles={btnStyles}/>
					</div>
				</div>
			</SideTab>
		</>
	)
	}

	export default page