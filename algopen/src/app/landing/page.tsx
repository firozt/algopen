'use client'
import React from 'react'
import './index.css'
import NavBar from '../components/NavBar/NavBar'
import { ROUTEMAPPINGS, Theme } from '../../utils/constants'
import SlideButton from '../components/SlideButton/SlideButton'
import { motion } from 'framer-motion'
import TypeWriter from '../components/TypeWriter/TypeWriter'
import Card from '../components/Card/Card'
import { useRouter } from 'next/navigation'

const getStartedStyles: React.CSSProperties = {
	height:'60px',
	width:'220px',
	border:'none',
	overflow:'hidden',
	borderRadius:'15px'
}

const Index = () => {
	const router = useRouter();
	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
		el.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<>
			<div id='top'/>
			<NavBar  theme={Theme.LIGHT}/>
			<div className='landing-page'>
				<section>
					<motion.div
					className='title-card'
					initial={{x:-50,y:50,opacity:0}}
					transition={{duration:.5,ease:'easeOut'}}
					animate={{x:0,y:0,opacity:'1'}}
					>
						<img id='title' src={'/title.svg'}/>
						<h2><TypeWriter text={['An algorithm simulator?','A visualising tool?','We do it all.']}/></h2>
						
					</motion.div>
					<motion.div
					className='about'
					initial={{x:50,y:50,opacity:0}}
					transition={{duration:.5,ease:'easeOut'}}
					animate={{x:0,y:0,opacity:'1'}}
					>
						<div>
							<h3>Who Are We?</h3>
							<p>
								We are developers, educators passionate about making 
								data strucutres and algorithms and graph theory, 
								a notorious topic for Math and CS students, more intuitive
								for visual learners. 
								<br/> <br/>
								We believe that learning complex ideas shouldnt feel overwhelming.
								Thats why weve built a platform where anyone can interact and simulate 
								with foundational data structures and algorithms.
							</p>
						</div>
						{/* <img src={'/graph.svg'}/> */}
					</motion.div>
				</section>
				<motion.div 
				id='get-started'
				initial={{opacity:0}}
				transition={{duration:.5,ease:'easeIn'}}
				animate={{opacity:1}}
				>
					<SlideButton onClick={() => scrollToSection('services')} styles={getStartedStyles} title='Get Started 🚀'/>
				</motion.div>
			</div>
			<div className='landing-services'>
				<img src={'/transition.svg'}/>
				<div id='services'>
					<header>
						<h1>Services⚙️</h1>
						<p>(its all free forever)</p>
					</header>
					<section id='card-container'>
						<Card onClick={() => router.push(ROUTEMAPPINGS.GraphVisualiser)} heading='Graph Data Structure' iconSrc='/graphIcon.svg' />
						<Card onClick={() => router.push(ROUTEMAPPINGS.HeapVisualiser)} heading='Heap Algorithm' iconSrc='/heapIcon.svg' />
						<Card onClick={() => 1} heading='Coming Soon...' />
						<Card onClick={() => 1} heading='Coming Soon...'  />
						<Card onClick={() => 1} heading='Coming Soon...'  />
						<Card onClick={() => 1} heading='Coming Soon...'  />
					</section>
				</div>
			</div>
			<div id='divider'><div></div></div>
			<footer id='landing-footer'>
				<h3>AlgoPen visualising tool</h3>
				<div>
					<p onClick={() => scrollToSection('top')}>About</p>
					<p onClick={() => scrollToSection('services')}>Services</p>
					<a href='https://ramizabdulla.me/#contact'>Contact</a>
				</div>
				<div id='last-footer'>
					<p>Designed and Developed by <span style={{color:'#DE5454'}}>Ramiz Abdulla</span></p>
					{/* <p>© Copyright algopen.ramizabdulla.me All Rights Reserved 2025</p> */}
					<p onClick={() => router.push(ROUTEMAPPINGS.Terms)} style={{textDecoration:'underline',cursor:'pointer'}}> Terms and Services</p>
				</div>
			</footer>
		</>
	)
}

export default Index