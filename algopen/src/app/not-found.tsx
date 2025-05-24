'use client'
import React from 'react'
import ErrorMsg from './components/ErrorMsg/ErrorMsg';
import SlideButton from './components/SlideButton/SlideButton';
import { ROUTEMAPPINGS } from '../utils/constants';
import { redirect } from "next/navigation";



const NotFound = () => {
  return (
    <div style={{
        backgroundColor:'black',
        color:'white',
        height:'100vh',
        width:'100vw',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundImage:'url(/bg.svg)'
      }}>
        <div style={{
          padding:'25px',
          borderRadius:'10px',
          width:'400px',
          border:'3px solid rgb(148, 148, 148)',
          backdropFilter:'blur(5px)',
        }}>
          <h1 style={{fontSize:'72px',textAlign:'center',color:'white'}}>404</h1>
          <p style={{fontSize:'32px',textAlign:'center',color:'white', position:'relative',bottom:'30px'}}>Page Not Found</p>
          <ErrorMsg severity={0} message='This page could not be found, if issues persist please email dev@ramizabdulla.me'/>
          <SlideButton hoveredTitle='🏠' styles={{height:'50px',backgroundColor:'#cf4c43',color:'black'}} onClick={() => redirect(ROUTEMAPPINGS.LandingPage)} title='Home' />
          
        </div>
    </div>
  );
}

export default NotFound
