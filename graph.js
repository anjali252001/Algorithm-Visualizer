/**
 * Graph data structures and related utilities
 * Contains classes for representing graphs, nodes, and edges
 */

/**
 * Represents a node in a graph
 */
class GraphNode {
    constructor(id, x, y, label = '') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.label = label || id.toString();
        this.neighbors = new Map(); // Map of nodeId -> edge
        this.state = 'unvisited'; // unvisited, visiting, visited, cycle
        this.parent = null;
        this.distance = Infinity;
        this.discoveryTime = -1;
        this.finishTime = -1;
    }

    /**
     * Adds a neighbor to this node
     * @param {GraphNode} neighbor - The neighbor node
     * @param {number} weight - Edge weight (default 1)
     */
    addNeighbor(neighbor, weight = 1) {
        this.neighbors.set(neighbor.id, {
            node: neighbor,
            weight: weight,
            state: 'normal' // normal, highlighted, cycle
        });
    }

    /**
     * Removes a neighbor from this node
     * @param {string} neighborId - ID of neighbor to remove
     */
    removeNeighbor(neighborId) {
        this.neighbors.delete(neighborId);
    }

    /**
     * Gets all neighbor nodes
     * @returns {Array} Array of neighbor nodes
     */
    getNeighbors() {
        return Array.from(this.neighbors.values()).map(edge => edge.node);
    }

    /**
     * Resets node state for new algorithm run
     */
    reset() {
        this.state = 'unvisited';
        this.parent = null;
        this.distance = Infinity;
        this.discoveryTime = -1;
        this.finishTime = -1;
        
        // Reset edge states
        for (let edge of this.neighbors.values()) {
            edge.state = 'normal';
        }
    }
}

/**
 * Represents a graph data structure
 */
class Graph {
    constructor() {
        this.nodes = new Map();
        this.nodeCount = 0;
    }

    /**
     * Adds a node to the graph
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} label - Node label
     * @returns {GraphNode} The created node
     */
    addNode(x, y, label = '') {
        const id = this.nodeCount++;
        const node = new GraphNode(id, x, y, label);
        this.nodes.set(id, node);
        return node;
    }

    /**
     * Removes a node from the graph
     * @param {string} nodeId - ID of node to remove
     */
    removeNode(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Remove all edges to this node
        for (let otherNode of this.nodes.values()) {
            otherNode.removeNeighbor(nodeId);
        }

        this.nodes.delete(nodeId);
    }

    /**
     * Adds an edge between two nodes
     * @param {string} fromId - Source node ID
     * @param {string} toId - Target node ID
     * @param {number} weight - Edge weight
     */
    addEdge(fromId, toId, weight = 1) {
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        
        if (fromNode && toNode) {
            fromNode.addNeighbor(toNode, weight);
        }
    }

    /**
     * Removes an edge between two nodes
     * @param {string} fromId - Source node ID
     * @param {string} toId - Target node ID
     */
    removeEdge(fromId, toId) {
        const fromNode = this.nodes.get(fromId);
        if (fromNode) {
            fromNode.removeNeighbor(toId);
        }
    }

    /**
     * Gets a node by ID
     * @param {string} nodeId - Node ID
     * @returns {GraphNode} The node or null
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    /**
     * Gets all nodes in the graph
     * @returns {Array} Array of all nodes
     */
    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    /**
     * Gets all edges in the graph
     * @returns {Array} Array of edge objects {from, to, weight}
     */
    getAllEdges() {
        const edges = [];
        for (let node of this.nodes.values()) {
            for (let [neighborId, edge] of node.neighbors) {
                edges.push({
                    from: node,
                    to: edge.node,
                    weight: edge.weight,
                    state: edge.state
                });
            }
        }
        return edges;
    }

    /**
     * Clears all nodes and edges
     */
    clear() {
        this.nodes.clear();
        this.nodeCount = 0;
    }

    /**
     * Resets all nodes for new algorithm run
     */
    reset() {
        for (let node of this.nodes.values()) {
            node.reset();
        }
    }

    /**
     * Generates a random graph
     * @param {number} nodeCount - Number of nodes to create
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} edgeProbability - Probability of edge creation (0-1)
     */
    generateRandomGraph(nodeCount, width, height, edgeProbability = 0.3) {
        this.clear();
        
        const margin = 50;
        const nodes = [];
        
        // Create nodes with random positions
        for (let i = 0; i < nodeCount; i++) {
            const x = Utils.randomInt(margin, width - margin);
            const y = Utils.randomInt(margin, height - margin);
            const node = this.addNode(x, y, `T${i + 1}`); // Task nodes
            nodes.push(node);
        }
        
        // Create random edges (directed)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < nodes.length; j++) {
                if (i !== j && Math.random() < edgeProbability) {
                    this.addEdge(nodes[i].id, nodes[j].id);
                }
            }
        }
    }

    /**
     * Adds a cycle to the graph for demonstration
     */
    addCycle() {
        const nodes = this.getAllNodes();
        if (nodes.length < 3) return;
        
        // Select 3-4 random nodes to form a cycle
        const cycleSize = Math.min(Utils.randomInt(3, 4), nodes.length);
        const cycleNodes = Utils.shuffleArray(nodes).slice(0, cycleSize);
        
        // Create cycle edges
        for (let i = 0; i < cycleNodes.length; i++) {
            const from = cycleNodes[i];
            const to = cycleNodes[(i + 1) % cycleNodes.length];
            this.addEdge(from.id, to.id);
        }
    }

    /**
     * Finds a node at given coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} radius - Search radius
     * @returns {GraphNode} Found node or null
     */
    findNodeAt(x, y, radius = 20) {
        for (let node of this.nodes.values()) {
            if (Utils.distance({x, y}, {x: node.x, y: node.y}) <= radius) {
                return node;
            }
        }
        return null;
    }
}

/**
 * Represents a grid for pathfinding algorithms
 */
class Grid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.floor(width / cellSize);
        this.rows = Math.floor(height / cellSize);
        this.cells = [];
        this.start = null;
        this.goal = null;
        
        this.initializeGrid();
    }

    /**
     * Initializes the grid with empty cells
     */
    initializeGrid() {
        this.cells = [];
        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.cells[row][col] = {
                    row: row,
                    col: col,
                    x: col * this.cellSize,
                    y: row * this.cellSize,
                    type: 'empty', // empty, wall, start, goal
                    state: 'unvisited', // unvisited, frontier, visited, path
                    parent: null,
                    distance: Infinity,
                    gScore: Infinity,
                    fScore: Infinity
                };
            }
        }
        
        // Set default start and goal
        this.setStart(1, 1);
        this.setGoal(this.cols - 2, this.rows - 2);
    }

    /**
     * Sets the start position
     * @param {number} col - Column
     * @param {number} row - Row
     */
    setStart(col, row) {
        if (this.start) {
            this.start.type = 'empty';
        }
        if (this.isValidCell(col, row)) {
            this.start = this.cells[row][col];
            this.start.type = 'start';
        }
    }

    /**
     * Sets the goal position
     * @param {number} col - Column
     * @param {number} row - Row
     */
    setGoal(col, row) {
        if (this.goal) {
            this.goal.type = 'empty';
        }
        if (this.isValidCell(col, row)) {
            this.goal = this.cells[row][col];
            this.goal.type = 'goal';
        }
    }

    /**
     * Toggles a wall at given position
     * @param {number} col - Column
     * @param {number} row - Row
     */
    toggleWall(col, row) {
        if (this.isValidCell(col, row)) {
            const cell = this.cells[row][col];
            if (cell.type === 'empty') {
                cell.type = 'wall';
            } else if (cell.type === 'wall') {
                cell.type = 'empty';
            }
        }
    }

    /**
     * Gets cell at given grid coordinates
     * @param {number} col - Column
     * @param {number} row - Row
     * @returns {Object} Cell object or null
     */
    getCell(col, row) {
        if (this.isValidCell(col, row)) {
            return this.cells[row][col];
        }
        return null;
    }

    /**
     * Gets cell at given pixel coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} Cell object or null
     */
    getCellAt(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return this.getCell(col, row);
    }

    /**
     * Checks if cell coordinates are valid
     * @param {number} col - Column
     * @param {number} row - Row
     * @returns {boolean} True if valid
     */
    isValidCell(col, row) {
        return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
    }

    /**
     * Gets neighbors of a cell
     * @param {Object} cell - Cell object
     * @returns {Array} Array of neighbor cells
     */
    getNeighbors(cell) {
        const neighbors = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // 4-directional
        ];
        
        for (let [dx, dy] of directions) {
            const col = cell.col + dx;
            const row = cell.row + dy;
            const neighbor = this.getCell(col, row);
            
            if (neighbor && neighbor.type !== 'wall') {
                neighbors.push(neighbor);
            }
        }
        
        return neighbors;
    }

    /**
     * Clears the grid (removes walls but keeps start/goal)
     */
    clear() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.cells[row][col];
                if (cell.type === 'wall') {
                    cell.type = 'empty';
                }
                cell.state = 'unvisited';
                cell.parent = null;
                cell.distance = Infinity;
                cell.gScore = Infinity;
                cell.fScore = Infinity;
            }
        }
    }

    /**
     * Resets grid state for new algorithm run
     */
    reset() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.cells[row][col];
                cell.state = 'unvisited';
                cell.parent = null;
                cell.distance = Infinity;
                cell.gScore = Infinity;
                cell.fScore = Infinity;
            }
        }
    }

    /**
     * Generates a random maze using recursive backtracking
     */
    generateMaze() {
        // First, fill with walls
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.cells[row][col].type !== 'start' && 
                    this.cells[row][col].type !== 'goal') {
                    this.cells[row][col].type = 'wall';
                }
            }
        }
        
        // Then carve out paths
        const stack = [];
        const startCell = this.cells[1][1];
        startCell.type = 'empty';
        stack.push(startCell);
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const unvisitedNeighbors = this.getUnvisitedMazeNeighbors(current);
            
            if (unvisitedNeighbors.length > 0) {
                const next = unvisitedNeighbors[Utils.randomInt(0, unvisitedNeighbors.length - 1)];
                
                // Remove wall between current and next
                const wallCol = (current.col + next.col) / 2;
                const wallRow = (current.row + next.row) / 2;
                this.cells[wallRow][wallCol].type = 'empty';
                
                next.type = 'empty';
                stack.push(next);
            } else {
                stack.pop();
            }
        }
        
        // Ensure start and goal are accessible
        this.ensureAccessibility();
    }

    /**
     * Gets unvisited neighbors for maze generation
     * @param {Object} cell - Current cell
     * @returns {Array} Array of unvisited neighbors
     */
    getUnvisitedMazeNeighbors(cell) {
        const neighbors = [];
        const directions = [
            [-2, 0], [2, 0], [0, -2], [0, 2]
        ];
        
        for (let [dx, dy] of directions) {
            const col = cell.col + dx;
            const row = cell.row + dy;
            
            if (this.isValidCell(col, row) && this.cells[row][col].type === 'wall') {
                neighbors.push(this.cells[row][col]);
            }
        }
        
        return neighbors;
    }

    /**
     * Ensures start and goal are accessible
     */
    ensureAccessibility() {
        // Clear area around start
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const cell = this.getCell(this.start.col + dc, this.start.row + dr);
                if (cell && cell.type === 'wall') {
                    cell.type = 'empty';
                }
            }
        }
        
        // Clear area around goal
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const cell = this.getCell(this.goal.col + dc, this.goal.row + dr);
                if (cell && cell.type === 'wall') {
                    cell.type = 'empty';
                }
            }
        }
    }
}
