import { COLORS } from "@utils/constants"
import { Complexity } from "../GlobalTypes"

export type AlgoData = {
  name: string,
  desc: string,
  complexitiy: Complexity
}


// colors for cells
export const colors = [COLORS.WHITE,COLORS.BLACK,COLORS.GREEN,COLORS.RED] 


// algorithm data for display
export const algorithms: AlgoData[] = [
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
