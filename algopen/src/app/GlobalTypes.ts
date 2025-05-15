export type Vector2D = {
    x: number,
    y: number
}


export type NodeInfo = {
	position: Vector2D
	label: string // unique
}

export type EdgeInfo = {
	labelFrom: string
	labelTo: string
	weight?: string
	directed: boolean
}
