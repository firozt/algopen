import React from 'react'
import './index.css'

type Props = {
    data: string[],
    onClick: (index: number) => void,
    selected: number,
}

const TabManager = ({data,onClick,selected}: Props) => {
    return (
        <div className='selection-input'>
            <p
                key={-1}
                className={'selected'}
                onClick={() => onClick(selected)}
                >
                {data[selected]}
            </p>
            {data.map(( item, index ) => (
                index != selected &&
                <p
                key={index}
                onClick={() => onClick(index)}
                >
                {item}
                </p>
            ))}
        </div>
    )
}

export default TabManager