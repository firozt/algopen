import React from 'react'
import './index.css'

type Props = {
    message: string
    severity: number
}

const SEVERITY_COLORS = [
    '#cf4c43',
    '#ce773c'
]

const ErrorMsg = ({message, severity}: Props) => {
    
    const styles: React.CSSProperties = {
        backgroundColor: SEVERITY_COLORS[severity]
    }
    return (
        <div id='error-wrapper' style={styles}>
            <p>
                {message}
            </p>
        </div>
    )
}

export default ErrorMsg