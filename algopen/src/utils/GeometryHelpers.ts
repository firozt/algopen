import { Vector2D } from "../app/GlobalTypes"




/**
 * Checks wether a node is within 100 units to anothers centerpoint within a list of nodes
 *
 * @param pos - vector position of the node to check
 * @param previousPositions - a list of node positions to check against
 * @returns returns wether another node is within nodePadding (default 100) units
 */
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


/**
    returns a nodes bounding box, given its radius
 *
 * @param nodeCenter - vector position of the node
 * @param radius - the radius of the node
 * @returns [topleft, topright, bottomleft, bottomright] points of the bounding rect
 */
function getBoundingPoints(nodeCenter: Vector2D, radius=0,): Vector2D[] {
    return [
        {x:nodeCenter.x-radius,y:nodeCenter.y-radius}, // top left
        {x:nodeCenter.x+radius,y:nodeCenter.y-radius}, // top right
        {x:nodeCenter.x-radius,y:nodeCenter.y+radius}, // bottom left
        {x:nodeCenter.x+radius,y:nodeCenter.y+radius}, // bottom right
    ];
}


function intersectsLine(p1: Vector2D,p2: Vector2D,nodeCenter: Vector2D): boolean {
    // we define the line in y=mx+c format
    const grad = (p2.y-p1.y)/(p2.x-p1.x) // grad
    
    // sub in p1 to find c
    const constant = p1.y - (grad*p1.x)
    const boundingRectPoint = getBoundingPoints(nodeCenter,50)
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


/**
    Checks wether a node, at poistion nodecenter, will intersect a line drawn between every other node
 *
 * @param nodeCenter - vector position of node 1
 * @param previousPositions - a list of vector position of all nodes to check against
 * @returns true if it intersects with another drawn line else false
 */
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

/**
    returns the points the new line, shortened by 30 units for a node
 *
 * @param pos1 - vector position of node 1
 * @param pos2 - vector position of node 2
 * @returns [point1.x, point1.y, point2.x, point2.y]
 */
export function getLinePoints(pos1: Vector2D, pos2: Vector2D): number[]{
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Calculate shortened start and end points
    const offsetX = (dx / length) * 30;
    const offsetY = (dy / length) * 30;

    const newStartX = pos1.x + offsetX;
    const newStartY = pos1.y + offsetY;
    const newEndX = pos2.x - offsetX;
    const newEndY = pos2.y - offsetY;

    return [newStartX, newStartY, newEndX, newEndY]
}