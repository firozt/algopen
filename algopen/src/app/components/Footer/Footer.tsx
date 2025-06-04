'use client'
import React from 'react'
import { ROUTEMAPPINGS } from '@utils/constants'
import { useRouter } from 'next/navigation'
import './index.css'


type Props = {
    scrollToSection: (id: string) => void
}

const Footer = ({scrollToSection}: Props) => {
    const router = useRouter();
    
    return (
        <footer id='landing-footer'>
            {/* <h3>AlgoPen visualising tool</h3> */}
            <div style={{display:'flex',flexDirection:'row',gap:'15px'}}>
                <p onClick={() => scrollToSection('top')}>About</p>
                <p onClick={() => scrollToSection('services')}>Services</p>
                <a href='https://ramizabdulla.me/#contact'>Contact</a>
				</div>
                <p style={{textAlign:'center'}}>© Copyright algopen.ramizabdulla.me All Rights Reserved 2025</p>
            <div id='last-footer'>
                <p>Designed and Developed by <span style={{color:'#DE5454'}}>Ramiz Abdulla</span></p>
                <p onClick={() => router.push(ROUTEMAPPINGS.Terms)} style={{textDecoration:'underline',cursor:'pointer'}}> Terms and Services</p>
            </div>
        </footer>
    )
}

export default Footer