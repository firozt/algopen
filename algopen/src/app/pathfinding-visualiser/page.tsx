'use client'
import React, { useEffect } from 'react'
import './index.css'
import { redirect } from 'next/navigation'

const Page = () => {

    useEffect(() => {
        redirect('/not-found')
    },[])
  return (
    <div>
    </div>
  )
}

export default Page