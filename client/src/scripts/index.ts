import Konva from 'konva';
import { MAX_PLACEMENT_ATTEMPTS, MOBILE_WIDTH } from "./constants";
import { connectCircles, createDraggableNode, createNode, createNodeConnection, createWeightedNodeConnection, getVisibleCenter, initialiseStage, resetStage } from "./libs/SceneController";
import { Vector2d } from './types';
import { checkLocalStorageStartup, closeToAnotherNode, intersectsAllLines, loadLastSelectedTab, randomInt, saveToLocalStorage } from './libs/Misc';

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

// function getVisibleCorners(stage: Konva.Stage, isMobile: boolean): Vector2d[] {
//     const box = stage.getClientRect({ relativeTo: stage.getStage(), skipTransform: false });
//     const topLeft = { x: box.x, y: box.y } as Vector2d
//     const topRight = { x: box.x + box.width, y: box.y } as Vector2d
//     const bottomRight = { x: box.x + box.width, y: box.y + box.height } as Vector2d
//     const bottomLeft = { x: box.x, y: box.y + box.height } as Vector2d

//     if (isMobile) {
//         topLeft.y += 300
//         topRight.y += 300
//     } else {
//         topLeft.x += 300
//         bottomLeft.x += 300
//     }


//     [topLeft, topRight, bottomRight, bottomLeft].forEach((item,idx) => {
//         createNode(item,JSON.stringify(idx),false,layer)
//     })

//     return [topLeft, topRight, bottomRight, bottomLeft];
// }

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


    const center = getVisibleCenter(stage)

    dfs(0,{
        x:center.x,
        y:center.y-(innerHeight/4)
    });
    layer.draw()
}


function handleSelection(index: number){
    // save new selected to local storage
    localStorage.setItem('selected',JSON.stringify(index))

    const buttons = [...(document.getElementById('tab-container')?.children ?? [])];

    const infoText = [
        'Enter in array format, each node label seperated by a comma ( , ) below',
        'Enter the graph in adjancency list format with the weighting in brackets, i.e:\nnodeX : neighbourA(2),neighbourB(3)\nnodeY...\nFor a directed graph, begin line 1 with \'directed\'',
        'Enter the graph in adjancency list format, i.e:\nnodeX : neighbourA,neighbourB\nnodeY...\nFor a directed graph, begin line 1 with \'directed\'',
    ]


    if (buttons[index] && buttons[index].classList.length > 0) {
        // already selected
        return
    }

    buttons?.forEach((val,idx) => {

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






function graphWeightedVisualiser(input: string, directional: boolean) {
    const parseInput = (input: string) : [{ [key: string]: Konva.Group }, string[]]  => {
        // first takes out the weights in the form '(number)' then removes whitespace, now in the same form as pre weighted
        const unique_nodes = new Set(
            input
              .replaceAll(/\(.*?\)/g, '')   // Remove anything inside ( )
              .replaceAll(' ', '')          // Remove spaces
              .split(/[,\n:]+/)             // Split by comma, newline, or colon
        );

        const parsedInput = input.replaceAll(' ','').split('\n')  // contains user input, each index is new line

        
        // first create, place and store the unique nodes

        return [placeAllNodes(unique_nodes),parsedInput]
    }

    const [nodeMapping, parsedInput] = parseInput(input)

    parsedInput.forEach((line) => {
        const [node, neighbours] = line.split(':'); // first index is parent, rest are neighbours
        neighbours.split(',').forEach(neighbour => {
            const nodeFromObj = nodeMapping[node]
            const nodeToObj = nodeMapping[neighbour.replace(/\(.*?\)/g, '')] // remove weighting
            const weightval = neighbour.match(/\(.*?\)/g)?.toString().replaceAll('(','').replaceAll(')','') ?? '1';
            createWeightedNodeConnection(nodeFromObj,nodeToObj,weightval,directional,layer)
        })
    });
    

}

// Places node on scene, tries to place at a random position. 
// On the random position does checks to see if its a valid position i.e not too close
// to another node or intersects a node/edge.
// If valid places and goes next
function placeAllNodes(unique_nodes: Set<string>): { [key: string]: Konva.Group } {
    const nodeMapping: { [key: string]: Konva.Group } = {} // str -> node obj
    const previousPositions: Vector2d[] = [] // holds previous x,y values
    unique_nodes.forEach(node => {
        let random_x
        let random_y
        let attempts = 0
        const buffer = unique_nodes.size > 7 ? (unique_nodes.size-5) * 30 : 0
        const nodeMinDistance = unique_nodes.size < 9 ? 1500 / unique_nodes.size  : 150
        do {
            random_x = randomInt(50,1300+buffer)
            random_y = randomInt(50,1100+buffer)
            attempts += 1
            if (attempts == MAX_PLACEMENT_ATTEMPTS) console.log('could not find suitable position')
        } while (
            attempts <= MAX_PLACEMENT_ATTEMPTS &&
            (
                closeToAnotherNode({x: random_x, y: random_y}, previousPositions, nodeMinDistance) || 
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

    return nodeMapping

}


function graphVisualiser(input: string, directional: boolean) {
    const parseInput = (input: string): [{ [key: string]: Konva.Group }, string[]]  => {
        // get all unique nodes

        const unique_nodes = new Set(input.replaceAll(' ','').split(/[,\n:]+/))  // regex splits on comma, newline and colon // contains set of all unique nodes
        const parsedInput = input.replaceAll(' ','').split('\n')  // contains user input, each index is new line

        return [placeAllNodes(unique_nodes),parsedInput]
    }

    const [nodeMapping, parsedInput] = parseInput(input)

    parsedInput.forEach((line) => {
        const [node, neighbours] = line.split(':') // first index goes to parent node, rest are neighbours
        neighbours.split(',').forEach(neighbour => {
            const nodeFromObj = nodeMapping[node]
            const nodeToObj = nodeMapping[neighbour]
            createNodeConnection(nodeFromObj,nodeToObj,directional,layer)
        }) 
    })

}


function isDirectional(input: string): [string, boolean] {
    console.log( input.split('\n')[0].toLowerCase())
    const res = input.length > 0 && input.split('\n')[0].toLowerCase() == 'directed'

    if (res) {
        input = input.replace(/directed\n/i,'')
    }

    return [input,res]
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
        const [parsed, directional] = isDirectional(input)
        graphWeightedVisualiser(parsed,directional)
    }
    else if (selected == 2) {
        console.log('graph visualiser')
        const [parsed, directional] = isDirectional(input)

        graphVisualiser(parsed,directional)
    } else {
        console.warn('Selected could not be parsed : ' + selected)
    }
}



// misc functions and listeners


checkLocalStorageStartup(); // checks local storage for previous sessions
saveToLocalStorage(); // creates listener for saving to local storage
loadLastSelectedTab(handleSelection );


// stops scrolling when user is trying to pan around the canvas
document.getElementById('screen')?.addEventListener('touchmove',  (e) => {
    e.preventDefault();
}, { passive: false });


// changes text of button on hover
const button = document.getElementById('visualise-test') as HTMLSpanElement
button.addEventListener('mouseover',  () => {
    const span = button.childNodes[0] as HTMLSpanElement
    span.innerText = 'Go'
}, { passive: false });

button.addEventListener('mouseout', () => {
    const span = button.childNodes[0] as HTMLSpanElement
    span.innerText = 'Visualise'
}, {passive: false });

// brings these function to global scope



// createNode({x:700,y:35},'tl',false,layer)
// createNode({x:innerWidth+700,y:35},'tr',false,layer)
// createNode({x:innerWidth+700,y:425+innerHeight},'br',false,layer)
// createNode({x:700,y:425+innerHeight},'bl',false,layer)

createNode(getVisibleCenter(stage),'wag1',false,layer)

//  TODO store in local?
let isFullscreen = false;

function fullscreenStage() {
    const minimiseSVG = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.75 9.75H4.25V13.25M9.75 13.25V9.75H13.25M13.25 4.25H9.75V0.75M4.25 0.75V4.25H0.75" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    const maximiseSVG = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.25 13.25H0.75V9.75M13.25 9.75V13.25H9.75M9.75 0.75H13.25V4.25M0.75 4.25V0.75H4.25" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    const prevClasses = 'inputs';
    isFullscreen = !isFullscreen;

    const inputs = Array.from(document.getElementsByClassName(prevClasses));
    const button = document.getElementById('fullscreen-btn');

    if (!inputs.length || !button) {
        throw new Error('Cannot locate div inputs or button');
    }

    if (isFullscreen) {
        // Maximize: slide out (move inputs off-screen with animation)
        inputs.forEach(item => {
            item.classList.remove('slide-in');  // Remove slide-in before sliding out
            item.classList.add('slide-out');    // Apply slide-out class to move off-screen

            item.addEventListener('transitionend', function handler() {
                item.classList.add('no-display');  // Ensure element is hidden after sliding out
                item.classList.remove('slide-out'); // Remove slide-out to reset it
                item.removeEventListener('transitionend', handler);
            });
        });
        button.innerHTML = minimiseSVG;
    } else {
        // Minimize: slide in (bring inputs back into view)
        inputs.forEach(item => {
            item.classList.remove('no-display');  // Make the element visible

            // Force a reflow to ensure the transition triggers correctly
            void item.offsetWidth;  // This is necessary to restart the transition

            item.classList.remove('slide-out');  // Remove the slide-out class
            item.classList.add('slide-in');      // Apply the slide-in class to slide back in
        });
        button.innerHTML = maximiseSVG;
    }
}



interface GlobalType {
    visualise : () => void
    saveToLocalStorage : () => void
    zoomStage : (scaleBy: number) => void
    handleSelection : (index: number) => void 
    fullscreenStage : () => void
}

(window as unknown as GlobalType).visualise = visualise;
(window as unknown as GlobalType).handleSelection = handleSelection;
(window as unknown as GlobalType).zoomStage = zoomStage;
(window as unknown as GlobalType).saveToLocalStorage = saveToLocalStorage;
(window as unknown as GlobalType).fullscreenStage = fullscreenStage;