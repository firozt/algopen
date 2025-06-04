'use client'
import React from 'react'
import './index.css'
import NavBar from '../components/NavBar/NavBar'
import { ROUTEMAPPINGS, Theme } from '../../utils/constants'
import SlideButton from '../components/SlideButton/SlideButton'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import TypeWriter from '../components/TypeWriter/TypeWriter'
import Card from '../components/Card/Card'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer/Footer'

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

	const { scrollY } = useScroll();
	const serviceOffsetY = useTransform(scrollY, [0, 400], [0, -50]);
	const smoothServiceY = useSpring(serviceOffsetY, {
		stiffness: 50,
		damping: 20,
		mass: 1
	});

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
						<h2><TypeWriter text={['An algorithm simulator?','A visualising tool?','The all in one.']}/></h2>
						
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
				<img style={{position:'relative',bottom:'10px',zIndex:'0',marginBottom:'5rem'}} src={'/transition.svg'}/>
				<div id='services'>
					<header style={{textAlign:'center',position:'relative',top:'-100px'}}>
						<h1>Services⚙️</h1>
						<p style={{position:'relative',bottom:'20px'}}>(its all free forever)</p>
					</header>
					<motion.section id='card-container'  style={{ y: smoothServiceY, position:'relative',top:'50px' }}>
						<Card onClick={() => router.push(ROUTEMAPPINGS.GraphVisualiser)} heading='Graph Data Structure' iconSrc='/graphIcon.svg' />
						<Card onClick={() => router.push(ROUTEMAPPINGS.HeapVisualiser)} heading='Heap Algorithm' iconSrc='/heapIcon.svg' />
						<Card onClick={() => router.push(ROUTEMAPPINGS.SortingVisualiser)} heading='Sorting Visualiser' iconSrc='/sortingIcon.svg' />
						<Card onClick={() => router.push(ROUTEMAPPINGS.PathfindingVisualiser)} heading='Path finding Algorithm' iconSrc='/pathfindingIcon.svg' />
						<Card onClick={() => 1} heading='Coming Soon...' />
						<Card onClick={() => 1} heading='Coming Soon...' />
					</motion.section>
				</div>
			</div>
			<div id='divider'><div></div></div>
			<Footer scrollToSection={scrollToSection} />
		</>
	)
}

export default Index