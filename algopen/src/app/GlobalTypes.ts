export type Vector2D = {
    x: number,
    y: number
}


export type NodeInfo = {
	position: Vector2D
	label: string 
	id: string
	dragged?: boolean
}

export type EdgeInfo = {
	idFrom: string
	idTo: string
	weight?: string
	directed: boolean
}
