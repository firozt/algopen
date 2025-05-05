import Konva from "../../../node_modules/konva/lib/index-types";

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