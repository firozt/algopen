import { Vector2D } from "../app/GlobalTypes"

export function closeToAnotherNode(pos: Vector2D,previousPositions: Vector2D[],nodePadding=100): boolean{
    for(let i = 0; i < previousPositions.length; i++){
        const x2 = previousPositions[i].x
        const y2 = previousPositions[i].y
        const dist = Math.floor(Math.sqrt((pos.x-x2)**2 + (pos.y-y2)**2))
        if (dist < nodePadding){
            return true
        }
    }
    return false
}

function intersectsLine(p1: Vector2D,p2: Vector2D,nodeCenter: Vector2D): boolean {
    // we define the line in y=mx+c format
    const grad = (p2.y-p1.y)/(p2.x-p1.x) // grad
    
    // sub in p1 to find c
    const constant = p1.y - (grad*p1.x)
    const boundingRectPoint = getBoundingRectPoints(nodeCenter,50)
    let previousRes

    // check each point is above/below line
    // for an intersection atleast one point will differ to others (max 3),
    // returns true if rect intersects line else false
    for(let i = 0; i < boundingRectPoint.length; i++) {
        const pos = boundingRectPoint[i]
        const res = pos.y > (grad * pos.x) + constant
        if (res == previousRes || previousRes == undefined ){
            previousRes = res
        } else {
            return true
        }
    }
    return false
}

// TODO make this better complexity (currently O(N^2))
export function intersectsAllLines(nodeCenter: Vector2D,previousPositions: Vector2D[]): boolean {
    for (let i = 0; i < previousPositions.length; i++) {
        for (let j = 1; j < previousPositions.length; j++) {
            if (j==i) continue
            const res = intersectsLine(previousPositions[i],previousPositions[j],nodeCenter)
            if (res)
                return true
        }
    }
    return false
}
