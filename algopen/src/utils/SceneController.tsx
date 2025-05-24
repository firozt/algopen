import Konva from 'konva'
import { Vector2D } from '../app/GlobalTypes';
import { HEADER_HEIGHT, MOBILE_WIDTH } from './constants';
import { KonvaEventObject } from 'konva/lib/Node';

export function getSafeCorners(center: Vector2D, width: number): Vector2D[] {
    const isMobile = width <= MOBILE_WIDTH
    if (!isMobile) {
        return [
            {x:430,y:30}, // top left
            {x:center.x+(center.x-430),y:30}, // top right
            {x:430,y:(center.y*2)+HEADER_HEIGHT/2}, // bottome left
            {x:center.x+(center.x-430),y:(center.y*2)+HEADER_HEIGHT/2}, // bottom right
        ]
    } else {
        return [
            {x:660,y:35}, // top left
            {x:(center.x-400)*2,y: 35}, // top right
            {x:660,y:(center.y*2)-100}, // bottom left
            {x:(center.x-400)*2,y:(center.y*2)-100} // bottom right
        ]
    }
}

export function getVisibleCenter(stage: Konva.Stage, windowWidth: number) {
    const scale = stage.scaleX(); // assuming uniform scale for x and y
    const position = stage.position();
    const width = stage.width();
    const height = stage.height();
    // Convert center screen point to stage coordinates
    const center = {
        x: (width / 2 - position.x) / scale,
        y: (height / 2 - position.y) / scale,
    };

    if (windowWidth <= MOBILE_WIDTH) {
        center.y += 300
    } else {
        center.x += 400
    }

    return center;
}


export const handleWheelZoom = (e: KonvaEventObject<WheelEvent, unknown>, stage: Konva.Stage) => {
    e.evt.preventDefault();

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (pointer == null) {
        throw new Error('pointer is null for handling wheel zoom')
    }

    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
};


export const zoomStage = (scaleBy=1.5, stage: Konva.Stage|null, screenWidth: number) => {

    if (stage == null) {
        throw new Error('Stage is null')
    }

    const oldScale = stage.scaleX();
    const newScale = oldScale * scaleBy;

    const center = getVisibleCenter(stage, screenWidth)
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
        x: stage.width() / 2 - center.x * newScale,
        y: stage.height() / 2 - center.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
}

	const handleNodeDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
		const id = e.target?.id();
		const node = nodeInfoList[selectedTab].find(node => node.id == id)
		if (node == null) {
			throw new Error('Node clicked cannot be found')
		}

		const newPosition: Vector2D = {
			x: e.target.x(), 
			y: e.target.y() 
		} 

		const newData: NodeInfo = {
			label: node.label,
			// position: newPosition,
			position: newPosition,
			id: id,
			dragging: true
		} 

		updateNode(node.id,newData)
	}
