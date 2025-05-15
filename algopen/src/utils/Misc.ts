import Konva from "konva";
import { Vector2D } from "../app/GlobalTypes";
import { createNode } from "./SceneController";
import { KonvaEventObject, NodeConfig } from "konva/lib/Node";

export function getBoundingPoints(nodeCenter: Vector2D, radius=0,): Vector2D[] {
    return [
        {x:nodeCenter.x-radius,y:nodeCenter.y-radius}, // top left
        {x:nodeCenter.x+radius,y:nodeCenter.y-radius}, // top right
        {x:nodeCenter.x-radius,y:nodeCenter.y+radius}, // bottom left
        {x:nodeCenter.x+radius,y:nodeCenter.y+radius}, // bottom right
    ];
}

export function saveToLocalStorage(){
    const textarea = document.getElementById('text-input') as HTMLTextAreaElement;
    
    textarea.addEventListener('input', function() {
        const textareaValue = textarea.value;
        localStorage.setItem('textareaContent', textareaValue);
    });
}

export function getLevel(index: number): number {
    return Math.floor(Math.log2(index + 1));
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
    const nodeCenterPoint = getBoundingPoints(nodeCenter,50)
    let previousRes

    // check each point is above/below line
    // for an intersection atleast one point will differ to others (max 3),
    // returns true if rect intersects line else false
    for(let i = 0; i < nodeCenterPoint.length; i++) {
        const pos = nodeCenterPoint[i]
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

export function loadLastSelectedTab(onLoad: (arg: number) => void) {
    const selected: string = localStorage.getItem('selected') ?? '0'
    onLoad(JSON.parse(selected))
}

export function handleWheelZoom(e: KonvaEventObject<WheelEvent, unknown>, stage: Konva.Stage){
    e.evt.preventDefault();

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    const scaleBy = 1.01;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
};