import './index.css'

type Props = {
    iconSrc?: string,
    heading?: string
    onClick?: () => void
}

const Card = ({iconSrc, heading, onClick}: Props) => {
    return (
        <div onClick={onClick} className='card-container'>
            {iconSrc &&
            <>
                <img src={iconSrc}/>
                <div id='vertical-div'></div>
            </>
            }
            {heading&&<h1 className={iconSrc ? 'title' : ''}>{heading}</h1>}
        </div>
    )
}

export default Card