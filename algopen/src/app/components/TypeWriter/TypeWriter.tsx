import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'

type Props = {
    text?: string[]
}

const TypeWriter = ({text}: Props) => {
  return (
    <div>
        <Typewriter
        words={text}
        loop={1} 
        cursor
        cursorStyle="_"
        typeSpeed={80}
        deleteSpeed={50}
        delaySpeed={1000}
        />
    </div>
  )
}

export default TypeWriter