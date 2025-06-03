import './index.css'

type Props = {
    zoomStage?: (zoomBy: number) => void
    toggleShow: () => void
}

const DisplayControls = ({zoomStage,toggleShow}: Props) => {
  return (
    <div className="display-controls">
        <button onClick={toggleShow} id="fullscreen-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.25 13.25H0.75V9.75M13.25 9.75V13.25H9.75M9.75 0.75H13.25V4.25M0.75 4.25V0.75H4.25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
        {
          zoomStage &&
          <>
            <button onClick={() => zoomStage(1.3)}><p>+</p></button>
            <button onClick={() => zoomStage(0.7)}><p>-</p></button>
          </>
        }
    </div>
  )
}

export default DisplayControls