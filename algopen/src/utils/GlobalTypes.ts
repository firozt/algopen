
// simple 2d position type
export type Vector2D = {
    x: number,
    y: number
}

// holds data needed for a graph node
export type NodeInfo = {
	position: Vector2D
	label: string // unique
}


// holds data needed for an edge
export type EdgeInfo = {
	labelFrom: string
	labelTo: string
	weight?: string
	directed: boolean
}
