import React from 'react'
import './index.css'

type Props = {
    iconSrc?: string,
    heading?: string
    onClick?: () => void
}

const Card = ({iconSrc, heading, onClick}: Props) => {
    return (
        <div onClick={onClick} className='card-container'>
            {iconSrc &&<img src={iconSrc}/>}
            {heading&&<h1>{heading}</h1>}
        </div>
    )
}

export default Card