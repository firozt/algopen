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

type Complexity = {
  best?: string
  worst: string
  average?: string
  space: string
}

type AlgoData = {
  name: string,
  desc: string,
  complexitiy: Complexity
}

const algorithms: AlgoData[] = [
  {
    name:'Depth First Search',
    desc:"Depth First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking. In pathfinding, DFS can find a path from a start node to a goal node by exploring deep paths first. However, it doesn't guarantee the shortest path and may get stuck in deep or infinite paths without proper checks.",
    complexitiy: {
      worst: 'vpe',
      space: 'v'
    }
  },
  {
    name:'Breath First Search',
    desc:"Breadth First Search is a graph traversal algorithm that explores all neighbors at the current depth before moving to the next level. In pathfinding, BFS is ideal for finding the shortest path in an unweighted graph. It uses a queue to ensure nodes are visited in order of their distance from the start node.",
    complexitiy: {
      worst: 'vpe',
      space: 'v'

    }
  },
  {
    name:'Dijkstra',
    desc:'TODO',
    complexitiy: {
      worst: 'vpe',
      space: 'v'

    }
  },
  
  {
    name:'A Star',
    desc:'TODO',
    complexitiy: {
      worst: 'vpe',
      space: 'v'

    }
  },
  {
    name:'Swarm',
    desc:'TODO',
    complexitiy: {
      worst: 'vpe',
      space: 'v'

    }
  },
  {
    name:'Greedy BFS',
    desc:'TODO',
    complexitiy: {
      worst: 'vpe',
      space: 'v'
    }
  },

]

const Page = () => {
  // const [parsedInput, setParsedInput] = useState<number[]>([])
  const [dimensions, setDimensions] = useState<Vector2D>({ x: 500, y: 500 });
  const [selected, setSelected] = useState<number>(0)
  const stageRef = useRef<Konva.Stage | null>(null); 
  
  useEffect(() => {
      const updateSize = () => {
          setDimensions({ x: window.innerWidth, y: window.innerHeight });
          console.log(dimensions.x<=PHONE_WIDTH)

      };
      updateSize()
      window.addEventListener('resize',updateSize);
      return () => window.removeEventListener('resize', updateSize);
  },[dimensions.x]);


    useEffect(() => {
        // redirect('/not-found')
    },[])
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
          <div>
            <div>
              <TabManager 
              data={algorithms.map(item => item.name)} 
              onClick={(index) => setSelected(index)}
              selected={selected}
              />
            </div>
            <hr style={{border:'1px solid #9999', margin:'1rem',marginTop:'0',marginBottom:'0'}}/>
            <p style={{padding:'15px'}}>
              {
                algorithms[selected].desc
              }
            </p>
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
            <SlideButton onClick={() => 1} styles={{height:'50px'}} title='Run Algorithm' />
          </div>
        </SideTab>
        <Stage
        ref={stageRef} 
        width={dimensions.x} 
        height={dimensions.y-HEADER_HEIGHT-5}
        >
          <Layer>
              <Rect
              x={400}
              y={dimensions.y/2}
              height={100}
              width={100}
              fill={COLORS.BLACK}
              />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Page