import Konva from 'konva';
import { LINE_WIDTH, MAX_PLACEMENT_ATTEMPTS, NODE_COLOR, NODE_RADIUS, TEXT_COLOR } from "./constants";
import { connectCircles, createDraggableNode, createNode, getVisibleCenter, initialiseStage, resetStage } from "./libs/SceneController";
import { Vector2d } from './types';
import { Group } from 'konva/lib/Group';
import { checkLocalStorageStartup, closeToAnotherNode, getBoundingRectPoints, intersectsAllLines, loadLastSelectedTab, randomInt, saveToLocalStorage } from './libs/Misc';

console.log('js running')


// initialise stage for the website
const stage = initialiseStage()
const layer = new Konva.Layer();
stage.add(layer);


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
                },
                layer
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
                },
                layer
            );
            dfs(
                right,
                {
                    x: pos.x + new_x,
                    y: new_y
                }
            );
        }
        createNode(pos, tree_array[index],false,layer);
    };

    dfs(0, {x:375, y: 75});
    layer.draw()
}


function handleSelection(index: number){
    // save new selected to local storage
    localStorage.setItem('selected',JSON.stringify(index))

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
            (val as HTMLElement).className = 'selected'
        }
        else {
            (val as HTMLElement).className = ''
        }
    })

    const infoTextVal = document.getElementById('info-text') as HTMLElement
    infoTextVal.innerHTML = infoText[index]
}



function createNodeConnection(node1: Group, node2: Group){
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



// Places node on scene, tries to place at a random position. 
// On the random position does checks to see if its a valid position i.e not too close
// to another node or intersects a node/edge.
// If valid places and goes next
function graphVisualiser(input: string) {
    const parseInput = (input: string): [{ [key: string]: Konva.Group }, string[]]  => {
        input.replace
        // get all unique nodes
        const unique_nodes = new Set(input.replaceAll(' ','').split(/[,\n:]+/)) // contains set of all unique nodes
        const parsedInput = input.replaceAll(' ','').split('\n') // contains user input, each index is new line

        const nodeMapping: { [key: string]: Konva.Group } = {} // str -> node obj
		const previousPositions: Vector2d[] = [] // holds previous x,y values
        
		// safe zone is x between 50,700 | y between 50, 500 on startup
        unique_nodes.forEach(node => {
			let random_x
			let random_y
            let attempts = 0
            do {
                random_x = randomInt(50,700)
                random_y = randomInt(50,550)
                attempts += 1
            } while (
                attempts <= MAX_PLACEMENT_ATTEMPTS &&
                (
                    closeToAnotherNode({x: random_x, y: random_y}, previousPositions, 150) || 
                    intersectsAllLines({x: random_x, y: random_y}, previousPositions)
                )
            )
            

			previousPositions.push({x:random_x,y:random_y})
            nodeMapping[node] = createDraggableNode(
                {
                    x:random_x,
                    y:random_y
                },
                node,
                layer
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
    resetStage(stage)
    const textarea = document.getElementById('text-input') as HTMLTextAreaElement
    const input = textarea.value
    const selected: number = JSON.parse(localStorage.getItem('selected') ?? '-1')

    if (selected == 0) {
        const parsed_input = input.replaceAll('[','').replaceAll(']','').replaceAll(' ','').split(',')
        console.log('tree visualising')
        generateTree(parsed_input)
    }
    else if (selected == 1) {
        console.log('tree traversal')
    }
    else if (selected == 2) {
        console.log('graph visualiser')
        graphVisualiser(input)
    } else {
        console.warn('Selected could not be parsed : ' + selected)
    }
}



// misc functions and listeners


checkLocalStorageStartup(); // checks local storage for previous sessions
saveToLocalStorage(); // creates listener for saving to local storage
loadLastSelectedTab(handleSelection);


// stops scrolling when user is trying to pan around the canvas
document.getElementById('screen')?.addEventListener('touchmove',  (e) => {
    e.preventDefault();
}, { passive: false });


// changes text of button on hover
const button = document.getElementById('visualise-test') as HTMLSpanElement
button.addEventListener('mouseover',  (e) => {
    const span = button.childNodes[0] as HTMLSpanElement
    span.innerText = 'Go'
}, { passive: false });

button.addEventListener('mouseout', (e) => {
    const span = button.childNodes[0] as HTMLSpanElement
    span.innerText = 'Visualise'
}, {passive: false });

// brings these function to global scope
(window as any).visualise = visualise;
(window as any).handleSelection = handleSelection;
(window as any).zoomStage = zoomStage;
(window as any).saveToLocalStorage = saveToLocalStorage