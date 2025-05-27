'use client'
import React, { useEffect } from 'react'
import './index.css'
import { redirect } from 'next/navigation'
import ToolBar from '../components/ToolBar/ToolBar'

const Page = () => {

    useEffect(() => {
        // redirect('/not-found')
    },[])
  return (
    <div>
        <ToolBar toggle={() => 1} title='this is the title' />
    </div>
  )
}

export default Page