import Konva from 'konva'
import { Vector2D } from '../app/GlobalTypes';
import { HEADER_HEIGHT, MOBILE_WIDTH } from './constants';

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
