import Konva from "konva";
import { Vector2d } from "../types";
import { createNode } from "./SceneController";

export function getBoundingRectPoints(nodeCenter: Vector2d, padding=0,): Vector2d[] {
    const node = createNode(nodeCenter, 'test', true, new Konva.Layer());
    const boundingRect = node.getClientRect();
    node.destroy();

    return [
        { x: boundingRect.x-padding, y: boundingRect.y-padding }, // top-left
        { x: boundingRect.x+boundingRect.width+padding, y: boundingRect.y-padding}, // top-right
        { x: boundingRect.x-padding, y: boundingRect.y + boundingRect.height+padding }, // bottom-left
        { x: boundingRect.x+ boundingRect.width+padding, y: boundingRect.y + boundingRect.height+padding } // bottom-right
    ];
}

export function saveToLocalStorage(){
    const textarea = document.getElementById('text-input') as HTMLTextAreaElement;
    
    textarea.addEventListener('input', function() {
        const textareaValue = textarea.value;
        localStorage.setItem('textareaContent', textareaValue);
    });
}

export function checkLocalStorageStartup() {
    let textarea = localStorage.getItem('textareaContent')
    if (!textarea) {
        textarea = '1,null,2,null,null,2,3'
    }
    const textareaElement = document.getElementById('text-input') as HTMLTextAreaElement;
    textareaElement.value = textarea
}


export function randomInt(lower: number,upper: number){
	return Math.floor(Math.random()*(upper-lower))+lower
}

export function closeToAnotherNode(pos: Vector2d,previousPositions: Vector2d[],nodePadding=100): boolean{
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

function intersectsLine(p1: Vector2d,p2: Vector2d,nodeCenter: Vector2d): boolean {
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
export function intersectsAllLines(nodeCenter: Vector2d,previousPositions: Vector2d[]): boolean {
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

export function loadLastSelectedTab(onLoad: (arg: number) => void) {
    const selected: string = localStorage.getItem('selected') ?? '0'
    onLoad(JSON.parse(selected))
}
