import Konva from 'konva'
import { Vector2d } from '../types';
import { Group } from 'konva/lib/Group';
import { NODE_RADIUS, NODE_COLOR, LINE_WIDTH, TEXT_COLOR } from '../constants';

export function getVisibleCenter(stage: Konva.Stage) {
    const scale = stage.scaleX(); // assuming uniform scale for x and y
    const position = stage.position();
    const width = stage.width();
    const height = stage.height();
    // Convert center screen point to stage coordinates
    const center = {
        x: (width / 2 - position.x) / scale,
        y: (height / 2 - position.y) / scale,
    };

    return center;
}

export function initialiseStage(): Konva.Stage {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
        draggable: true
    });

    stage.on('wheel', (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
    
        if (!pointer) {
            console.warn('Developer Error: Pointer is null on zoom out')
            return
        }
    
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
    
        const direction = e.evt.deltaY > 0 ? 1 : -1;
        const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    
        stage.scale({ x: newScale, y: newScale });
    
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
    
        stage.position(newPos);
        stage.batchDraw();
    });

    // base layer
    const layer = new Konva.Layer();
    stage.add(layer);
    
    
    return stage
}

export function connectCircles(pos1: Vector2d, pos2: Vector2d, layer: Konva.Layer) {
    const line = new Konva.Line({
        points: [pos1.x, pos1.y, pos2.x, pos2.y],
        stroke: 'black',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
    });
    layer.add(line);
}


export function resetStage(stage: Konva.Stage) {
    stage.getChildren().forEach(layer => {
        if (layer instanceof Konva.Layer) {
          layer.destroyChildren(); // remove all shapes in this layer
          layer.draw();            // redraw to apply the changes
        }
    });
    
}

export function createNode(pos: Vector2d, val: string, draggable = false, layer: Konva.Layer): Group {
    // group will contain circle node and text on the circle node
    const group = new Konva.Group({ 
        x: pos.x, 
        y: pos.y, 
        draggable 
    }); 

    const circle = new Konva.Circle({
        radius: NODE_RADIUS,
        fill: NODE_COLOR,
        stroke: NODE_COLOR, // same color as node
        strokeWidth: LINE_WIDTH,
    });

    const text = new Konva.Text({
        text: val.toString(),
        fontSize: 20,
        fill: TEXT_COLOR,
        align: 'center',
        verticalAlign: 'middle',
        width: 60,
        height: 60,
        offsetX: 30,
        offsetY: 30
    });

    group.add(circle);
    group.add(text);
    layer.add(group);

    return group;
}


export function createDraggableNode(pos: Vector2d, val: string, layer: Konva.Layer): Group{
    const node = createNode(pos, val, true, layer);
    return node
}
