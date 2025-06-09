'use client'
import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import SideTab from '../components/SideTab/SideTab'
import { Layer, Rect, Stage } from 'react-konva'
import { Vector2D } from '../GlobalTypes'
import Konva from 'konva'
import { HEADER_HEIGHT, PHONE_WIDTH, Theme, COLORS } from '@utils/constants'
import NavBar from '../components/NavBar/NavBar'
import TabManager from '../components/TabManager/TabManager'
import SlideButton from '../components/SlideButton/SlideButton'
import { algorithms, colors } from './data'



const Page = () => {
  const [matrix, setMatrix] = useState<number[][]>([])
  const [dimensions, setDimensions] = useState<Vector2D>({ x: 500, y: 500 });
  const [selected, setSelected] = useState<number>(0)
  const stageRef = useRef<Konva.Stage | null>(null); 

    // canvas numbers
  const padding = 5
  const inputWidth = 400
  const totalX = dimensions.x - (2*padding) - inputWidth
  const totalY = dimensions.y - (2*padding) - HEADER_HEIGHT
  const numRectX = 15
  const rectWidth = totalX/numRectX
  const numRectY = Math.round(totalY/rectWidth)
  
  useEffect(() => {
      const updateSize = () => {
          setDimensions({ x: window.innerWidth, y: window.innerHeight });
          console.log(dimensions.x<=PHONE_WIDTH)

      };
      updateSize()
      window.addEventListener('resize',updateSize);
      return () => window.removeEventListener('resize', updateSize);
  },[dimensions.x]);

  useEffect(()=>{
    const newMatrix: number[][] = []
    for(let i = 0; i < numRectY; i++) {
      newMatrix.push(Array(numRectX).fill(0))
    }
    setMatrix(newMatrix)
  },[numRectY,numRectX])



  const matrixCellHandler = (pos: Vector2D, val: number) => {
    let newVal = (val + 1) % (colors.length)

    while (newVal > 1 && valExists(newVal) ){
      newVal = (newVal + 1) % (colors.length)
    }

    setMatrix(prev => 
      prev.map((item,r_idx) =>
        r_idx == pos.x ?
        item.map((col,c_idx) => 
          c_idx == pos.y ?
          newVal:
          col
        ):
        item
      )
    )
    console.log(`(${pos.x},${pos.y}) - ${val}`)
  }

  // const setAllValsToX = (oldVal: number, newVal: number) => {
  //   setMatrix(prev =>
  //     prev.map(col =>
  //       col.map(val => 
  //         val == oldVal ?
  //         newVal:
  //         val
  //       )
  //     )
  //   )
  // }

  const valExists = (val: number): boolean => {
    return matrix.some(row => row.includes(val))
  }

  return (
    <div>
      <NavBar theme={Theme.DARK} />
      <div className='path-finding'>
        <SideTab
          slide={dimensions.x <= PHONE_WIDTH ? 'up' : 'left'}
          showContent={true}
          slideBuffer={dimensions.x <= PHONE_WIDTH ? 45 : 0}
          styles={{height:`calc( 100% - ${HEADER_HEIGHT}px)`}}
          >
          <div style={{overflow:'scroll'}}>
            <TabManager 
              data={algorithms.map(item => item.name)} 
              onClick={(index) => setSelected(index)}
              selected={selected}
            />
            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>
            <p style={{padding:'15px'}}>
              {
                algorithms[selected].desc
              }
            </p>
            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>
            <div className='tutorial'>
              <p>Green -&gt; Maze Start</p>
              <p>Red -&gt; Maze End</p>
              <p>Black -&gt; Maze Wall</p>
              <p>Yellow -&gt; Visited Node</p>
              <p>Click on a cell multiple times to cycle between these values. Note in a maze, there can only be one start and end node </p>
            </div>
            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>
            <div className='stats'>
              <p>Worst Case:</p>
              <div>
                <img src={'O.svg'}/>
                <img src={`${algorithms[selected].complexitiy.worst}.svg`}/>
              </div>
            </div>
            <div className='stats'>
              <p>Space:</p>
              <div>
                <img src={'O.svg'}/>
                <img src={`${algorithms[selected].complexitiy.space}.svg`}/>
              </div>
            </div>
            <div className='stats'>
              <p># of visited nodes:</p>
              <div>
                <p style={{textAlign:'center'}}>Run Algo</p>
              </div>
            </div>
          </div>
          <SlideButton onClick={() => 1} styles={{height:'50px'}} title='Run Algorithm' />
        </SideTab>
        <Stage
        ref={stageRef} 
        width={dimensions.x} 
        height={dimensions.y-HEADER_HEIGHT}
        style={{cursor:'pointer'}}
        >
          <Layer>
            {
              matrix.map((item,idx) => 
                item.map((val,idx2) => 
                <Rect
                key={`${idx}-${idx2}`}
                x={(inputWidth + padding) + rectWidth * idx2}
                y={padding + (rectWidth * idx)}
                width={rectWidth}
                height={rectWidth}
                stroke={COLORS.BLACK}
                strokeWidth={1}
                fill={colors[val]}
                onClick={() => matrixCellHandler({x:idx, y:idx2},val)}
                />
            )
              )
            }
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Page