import Konva from 'konva';
import { LINE_WIDTH, NODE_COLOR, NODE_RADIUS, TEXT_COLOR } from "./constants";
import { getVisibleCenter } from "./libs/SceneController";
import { Vector2d } from '../../node_modules/konva/lib/types';

console.log('js running')

const width = window.innerWidth;
const height = window.innerHeight;

// initialise stage for the website
const stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true
});

// Adding mousehweel event listener for the stage
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

// Zoom
function zoomStage(scaleBy=1.5) {
    const oldScale = stage.scaleX();
    const newScale = oldScale * scaleBy;

	const center = getVisibleCenter(stage)
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: stage.width() / 2 - center.x * newScale,
      y: stage.height() / 2 - center.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
}


const layer = new Konva.Layer();
stage.add(layer);

function createNode(pos: Vector2d, val: string, draggable = false) {
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

function connectCircles(pos1: Vector2d, pos2: Vector2d) {
    const line = new Konva.Line({
        points: [pos1.x, pos1.y, pos2.x, pos2.y],
        stroke: 'black',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
    });
    layer.add(line);
}

function getLevel(index: number): number {
    return Math.floor(Math.log2(index + 1));
}

function generateTree(tree_array: string[]) {
    const d = tree_array.filter(item => item !== 'null').length * 20;
    const dy = 90;

    const dfs = (index: number, pos: Vector2d) => {
        if (index >= tree_array.length || tree_array[index] == 'null') return;
        const level = getLevel(index) + 1;

        const left = 2 * index + 1;
        const right = 2 * index + 2;

        const new_y = pos.y + dy;
        const new_x = d / level;

        if (left < tree_array.length &&  tree_array[left] != 'null') {
            connectCircles(pos,
                {
                    x: pos.x - new_x,
                    y:  new_y
                }
            );
            dfs(left, 
                {
                    x: pos.x - new_x,
                    y: new_y
                }
            );
        }
        if (right < tree_array.length  &&  tree_array[right] != 'null') {
            connectCircles(pos, 
                {
                    x: pos.x + new_x,
                    y:  new_y
                }
            );
            dfs(
                right,
                {
                    x: pos.x + new_x,
                    y: new_y
                }
            );
        }
        createNode(pos, tree_array[index]);
    };

    dfs(0, {x:375, y: 75});
    layer.draw()
}

function resetStage() {
    stage.getChildren().forEach(layer => {
        if (layer instanceof Konva.Layer) {
          layer.destroyChildren(); // remove all shapes in this layer
          layer.draw();            // redraw to apply the changes
        }
    });
    
}

let selected = 0

function handleSelection(index: number){
    console.log('asdlkja')
    selected = index
    const buttons = [
        document.getElementById('treebuilder'),
        document.getElementById('treetraversal'),
        document.getElementById('graphvisualiser'),
    ]

    const infoText = [
        'Enter in array format, each node label seperated by a comma ( , ) below',
        'tree traversal - TODO',
        'Enter the graph in adjancency list format, i.e:\nnodeX : neighbourA,neighbourB\nnodeY...',
    ]


    if (buttons[index] && buttons[index].classList.length > 0) {
        // already selected
        return
    }

    buttons.forEach((val,idx) => {
        if (idx == index) {
            val.classList = ['selected']
        }
        else {
            val.classList = []
        }
    })

    const infoTextVal = document.getElementById('info-text')
    infoTextVal.innerHTML = infoText[index]
}

class GraphNode {
    constructor(x,y,neighbours = []) {
        this.x = x
        this.y = y
        this.neighbours = neighbours
    }
}



function createDraggableNode(pos: Vector2d, val: string){
    const node = createNode(pos, val, true);
    return node
}

function createNodeConnection(node1, node2){
    const line = new Konva.Arrow({
        points: [], // will be set below
        stroke: 'black',
        strokeWidth: 2,
        pointerLength: 10,
        pointerWidth: 10,
        fill: 'black',
    });
    layer.add(line)

    const updateLine = () => {
            const pos1 = node1.getPosition()
            const pos2 = node2.getPosition()
        
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
        
            line.points([newStartX, newStartY, newEndX, newEndY]);
            layer.batchDraw();
    }

    node1.on('dragmove', updateLine);
    node2.on('dragmove', updateLine);
    updateLine() // initial draw of lines
}

function randomInt(lower,upper){
	return Math.floor(Math.random()*(upper-lower))+lower
}

function closeToAnotherNode(x,y,previousPositions,nodePadding=100){
	for(let i = 0; i < previousPositions.length; i++){
		const x2 = previousPositions[i].x
		const y2 = previousPositions[i].y
		const dist = Math.floor(Math.sqrt((x-x2)**2 + (y-y2)**2))
		if (dist < nodePadding){
			return true
		}
	}
	return false
}

function graphVisualiser(input: string) {

    const parseInput = (input: string) => {
        input.replace
        // get all unique nodes
        const unique_nodes = new Set(input.replaceAll(' ','').split(/[,\n:]+/)) // contains set of all unique nodes
        const parsedInput = input.replaceAll(' ','').split('\n') // contains user input, each index is new line

        const nodeMapping: any = {} // str -> node obj
		const previousPositions: Vector2d[] = [] // holds previous x,y values

		// safe zone is x between 50,700 | y between 50, 500
        unique_nodes.forEach(node => {
			let random_x
			let random_y
			do {
				random_x = randomInt(50,700)
				random_y = randomInt(50,550)
			} while (closeToAnotherNode(random_x,random_y,previousPositions,150))

			previousPositions.push({x:random_x,y:random_y})
            nodeMapping[node] = createDraggableNode(
                {
                    x:random_x,
                    y:random_y
                },
                node
            )

        })


        return [nodeMapping,parsedInput]
    }

    const [nodeMapping, parsedInput] = parseInput(input)

    parsedInput.forEach((line) => {
        const [node, neighbours] = line.split(':') // first index goes to parent node, rest are neighbours
        neighbours.split(',').forEach(neighbour => {
            const nodeFromObj = nodeMapping[node]
            const nodeToObj = nodeMapping[neighbour]
            createNodeConnection(nodeFromObj,nodeToObj)
        }) 
    })

}


// Main
function visualise() {
    resetStage()
    const textarea = document.getElementById('text-input') as HTMLTextAreaElement
    const input = textarea.value


    if (selected == 0) {
        const parsed_input = input.replaceAll('[','').replaceAll(']','').replaceAll(' ','').split(',')
        console.log('tree visualising')
        generateTree(parsed_input)
    }
    if (selected == 1) {
        console.log('tree traversal')
    }
    if (selected == 2) {
        console.log('graph visualiser')
        graphVisualiser(input)
    }
}



// misc functions

function saveToLocalStorage(){
    const textarea = document.getElementById('text-input') as HTMLTextAreaElement;
    
    textarea.addEventListener('input', function() {
        const textareaValue = textarea.value;
        localStorage.setItem('textareaContent', textareaValue);
        console.log('Saved to localStorage:', textareaValue);
    });
}

function checkLocalStorageStartup() {
    let textarea = localStorage.getItem('textareaContent')
    if (!textarea) {
        textarea = '1,null,2,null,null,2,3'
    }
    const textareaElement = document.getElementById('text-input') as HTMLTextAreaElement;
    textareaElement.value = textarea

}

checkLocalStorageStartup() // checks local storage for previous sessions
saveToLocalStorage() // creates listener for saving to local storage


window.visualise = visualise;
window.handleSelection = handleSelection
window.zoomStage = zoomStage