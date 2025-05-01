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

function zoomStage(scaleBy=1.5) {
    const oldScale = stage.scaleX();
    const newScale = oldScale * scaleBy;

	const center = getVisibleCenter()
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: stage.width() / 2 - center.x * newScale,
      y: stage.height() / 2 - center.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
}

function getVisibleCenter() {
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

const layer = new Konva.Layer();
stage.add(layer);

function createNode(x, y, val, draggable = false) {
    const group = new Konva.Group({ x, y, draggable }); 

    const circle = new Konva.Circle({
        radius: 30,
        fill: 'black',
        stroke: 'white',
        strokeWidth: 2,
    });

    const text = new Konva.Text({
        text: val.toString(),
        fontSize: 20,
        fill: 'white',
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

function connectCircles(x1, y1, x2, y2) {
    const line = new Konva.Line({
        points: [x1, y1, x2, y2],
        stroke: 'black',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
    });
    layer.add(line);
}

function getLevel(index) {
    return Math.floor(Math.log2(index + 1));
}

function generateTree(tree_array) {
    const d = tree_array.filter(item => item !== 'null').length * 20;
    const dy = 90;

    const dfs = (index, x, y) => {
        if (index >= tree_array.length || tree_array[index] == 'null') return;
        const level = getLevel(index) + 1;

        const left = 2 * index + 1;
        const right = 2 * index + 2;

        const new_y = y + dy;
        const new_x = d / level;

        if (left < tree_array.length &&  tree_array[left] != 'null') {
            connectCircles(x, y, x - new_x, new_y);
            dfs(left, x - new_x, new_y);
        }
        if (right < tree_array.length  &&  tree_array[right] != 'null') {
            connectCircles(x, y, x + new_x, new_y);
            dfs(right, x + new_x, new_y);
        }
        createNode(x, y, tree_array[index]);
    };

    dfs(0, 375, 75);
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

function handleSelection(index){
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


    if (buttons[index].classList.length > 0) {
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



function createDraggableNode(x,y,val){
    const node = createNode(x, y, val, true);
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


function graphVisualiser(input) {

    const parseInput = (input) => {
        // get all unique nodes
        const unique_nodes = new Set(input.replaceAll(' ','').split(/[,\n:]+/)) // contains set of all unique nodes
        const parsedInput = input.replaceAll(' ','').split('\n') // contains user input, each index is new line

        const nodeMapping = {}

        let start_distance = 100
        console.log(unique_nodes)
        unique_nodes.forEach(node => {
            nodeMapping[node] = createDraggableNode(start_distance,50,node)
            start_distance += 100
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
    const input = document.getElementById('text-input').value

    if (selected == 0) {
        const parsed_input = input.replaceAll('[','').replaceAll(']','').replaceAll(' ','').split(',')
        generateTree(parsed_input)
        console.log('tree visualising')
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
    const textarea = document.getElementById('text-input');
    
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
    document.getElementById('text-input').value = textarea
}

checkLocalStorageStartup() // checks local storage for previous sessions
saveToLocalStorage() // creates listener for saving to local storage
visualise('1,2,3,null,4,5,6')