export enum COLORS {
    BLACK = 'black',
    WHITE = 'white',
    RED = 'red'
}

export enum Theme {
    DARK = 'dark',
    LIGHT = 'light'
}


export enum ROUTEMAPPINGS {
    GraphVisualiser = 'graph-visualiser',
    MazeSolver = 'maze-solver',
    HeapVisualiser = 'heap-visualiser',
    LandingPage = 'landing',
    Terms = 'terms-and-services',
    SortingVisualiser='sorting-visualiser',
    PathfindingVisualiser='pathfinding-visualiser'
}

export const NODE_RADIUS = 30
export const NODE_COLOR: COLORS = COLORS.BLACK
export const NODE_TEXT_COLOR: COLORS = COLORS.WHITE
export const LINE_WIDTH = 2
export const TEXT_COLOR = COLORS.WHITE
export const MAX_PLACEMENT_ATTEMPTS = 300
export const MOBILE_WIDTH = 968
export const PHONE_WIDTH = 450
export const HEADER_HEIGHT = 60
export const INPUTS_WIDTH = 200 // accounts for stage 1.5 scale
export const NODE_STARTUP_ANIMATION_DURATION = .5