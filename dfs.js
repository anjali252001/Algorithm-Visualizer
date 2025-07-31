/**
 * Depth-First Search (DFS) Algorithm Implementation
 * Used for cycle detection in directed graphs
 */

class DFSVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.graph = new Graph();
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 5;
        this.visitedCount = 0;
        this.cycleCount = 0;
        this.time = 0;
        this.cycles = [];
        
        // Colors for visualization
        this.colors = {
            unvisited: '#E0E0E0',
            visiting: '#FFE135',
            visited: '#87CEEB',
            cycle: '#F44336',
            edge: '#333333',
            cycleEdge: '#F44336',
            nodeText: '#333333',
            background: '#FFFFFF'
        };
        
        // Node and edge rendering properties
        this.nodeRadius = 20;
        this.edgeWidth = 2;
        this.arrowSize = 8;
        
        this.setupEventListeners();
        this.generateRandomGraph();
        this.draw();
    }

    /**
     * Sets up mouse event listeners for graph interaction
     */
    setupEventListeners() {
        let selectedNode = null;
        let isCreatingEdge = false;
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.isRunning) return;
            
            const pos = Utils.getMousePos(this.canvas, e);
            const clickedNode = this.graph.findNodeAt(pos.x, pos.y, this.nodeRadius);
            
            if (clickedNode) {
                selectedNode = clickedNode;
                isCreatingEdge = true;
            } else {
                // Create new node
                const newNode = this.graph.addNode(pos.x, pos.y);
                this.draw();
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (!isCreatingEdge || !selectedNode) return;
            
            const pos = Utils.getMousePos(this.canvas, e);
            this.draw();
            
            // Draw temporary edge line
            this.ctx.strokeStyle = this.colors.edge;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(selectedNode.x, selectedNode.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (!isCreatingEdge || !selectedNode) return;
            
            const pos = Utils.getMousePos(this.canvas, e);
            const targetNode = this.graph.findNodeAt(pos.x, pos.y, this.nodeRadius);
            
            if (targetNode && targetNode !== selectedNode) {
                // Create edge between selected and target node
                this.graph.addEdge(selectedNode.id, targetNode.id);
                this.draw();
            }
            
            selectedNode = null;
            isCreatingEdge = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            selectedNode = null;
            isCreatingEdge = false;
        });
    }

    /**
     * Starts the DFS cycle detection visualization
     */
    async startDFS() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.visitedCount = 0;
        this.cycleCount = 0;
        this.time = 0;
        this.cycles = [];
        this.graph.reset();
        this.updateStatus('Running DFS for cycle detection...');
        this.updateStats();
        
        await this.runDFS();
        
        if (this.cycles.length > 0) {
            this.updateStatus(`Cycle detection complete. Found ${this.cycles.length} cycle(s)`);
        } else {
            this.updateStatus('No cycles detected. Graph is acyclic');
        }
        
        this.isRunning = false;
    }

    /**
     * Implements the DFS algorithm for cycle detection
     */
    async runDFS() {
        const nodes = this.graph.getAllNodes();
        
        // Visit all unvisited nodes
        for (let node of nodes) {
            if (node.state === 'unvisited' && !this.isPaused) {
                await this.dfsVisit(node);
            }
            
            // Check if paused
            while (this.isPaused && this.isRunning) {
                await Utils.delay(100);
            }
        }
    }

    /**
     * DFS visit function that explores from a given node
     * @param {GraphNode} node - Starting node for DFS
     */
    async dfsVisit(node) {
        // Mark as currently being visited (gray in DFS terminology)
        node.state = 'visiting';
        node.discoveryTime = ++this.time;
        this.visitedCount++;
        
        this.updateStats();
        this.draw();
        await Utils.delay(Utils.speedToDelay(this.animationSpeed));
        
        // Explore all neighbors
        for (let [neighborId, edge] of node.neighbors) {
            const neighbor = edge.node;
            
            if (neighbor.state === 'unvisited') {
                neighbor.parent = node;
                await this.dfsVisit(neighbor);
            } else if (neighbor.state === 'visiting') {
                // Back edge found - cycle detected!
                await this.highlightCycle(node, neighbor);
                this.cycleCount++;
                this.updateStats();
            }
            
            // Check if paused
            while (this.isPaused && this.isRunning) {
                await Utils.delay(100);
            }
            
            if (!this.isRunning) return;
        }
        
        // Mark as completely visited (black in DFS terminology)
        node.state = 'visited';
        node.finishTime = ++this.time;
        
        this.draw();
        await Utils.delay(Utils.speedToDelay(this.animationSpeed) / 2);
    }

    /**
     * Highlights a detected cycle
     * @param {GraphNode} fromNode - Node that creates the back edge
     * @param {GraphNode} toNode - Node that the back edge points to
     */
    async highlightCycle(fromNode, toNode) {
        // Mark the cycle edge
        const edge = fromNode.neighbors.get(toNode.id);
        if (edge) {
            edge.state = 'cycle';
        }
        
        // Find and mark all nodes in the cycle
        const cycleNodes = this.findCycleNodes(fromNode, toNode);
        this.cycles.push(cycleNodes);
        
        // Highlight cycle nodes with animation
        for (let node of cycleNodes) {
            node.state = 'cycle';
            this.draw();
            await Utils.delay(Utils.speedToDelay(this.animationSpeed) / 3);
        }
        
        // Mark edges in the cycle
        for (let i = 0; i < cycleNodes.length; i++) {
            const currentNode = cycleNodes[i];
            const nextNode = cycleNodes[(i + 1) % cycleNodes.length];
            
            const edge = currentNode.neighbors.get(nextNode.id);
            if (edge) {
                edge.state = 'cycle';
            }
        }
        
        this.draw();
    }

    /**
     * Finds all nodes that are part of a cycle
     * @param {GraphNode} fromNode - Node that creates the back edge
     * @param {GraphNode} toNode - Node that the back edge points to
     * @returns {Array} Array of nodes in the cycle
     */
    findCycleNodes(fromNode, toNode) {
        const cycleNodes = [toNode];
        let current = fromNode;
        
        // Trace back from fromNode to toNode to find the cycle
        while (current && current !== toNode) {
            cycleNodes.unshift(current);
            current = current.parent;
        }
        
        return cycleNodes;
    }

    /**
     * Pauses the algorithm execution
     */
    pause() {
        this.isPaused = true;
        this.updateStatus('Paused');
    }

    /**
     * Resumes the algorithm execution
     */
    resume() {
        this.isPaused = false;
        this.updateStatus('Running DFS for cycle detection...');
    }

    /**
     * Resets the visualization
     */
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.visitedCount = 0;
        this.cycleCount = 0;
        this.time = 0;
        this.cycles = [];
        this.graph.reset();
        this.updateStatus('Ready');
        this.updateStats();
        this.draw();
    }

    /**
     * Clears the graph
     */
    clear() {
        this.graph.clear();
        this.reset();
    }

    /**
     * Generates a random directed graph
     */
    generateRandomGraph() {
        const nodeCount = Utils.randomInt(6, 10);
        this.graph.generateRandomGraph(
            nodeCount, 
            this.canvas.width, 
            this.canvas.height, 
            0.25
        );
        this.reset();
    }

    /**
     * Adds a cycle to the graph for demonstration
     */
    addCycle() {
        if (this.isRunning) return;
        this.graph.addCycle();
        this.reset();
    }

    /**
     * Sets the animation speed
     * @param {number} speed - Speed value (1-10)
     */
    setSpeed(speed) {
        this.animationSpeed = speed;
    }

    /**
     * Draws the entire graph
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges first (so they appear behind nodes)
        this.drawEdges();
        
        // Draw nodes
        this.drawNodes();
    }

    /**
     * Draws all edges in the graph
     */
    drawEdges() {
        const edges = this.graph.getAllEdges();
        
        for (let edge of edges) {
            this.drawEdge(edge.from, edge.to, edge.state);
        }
    }

    /**
     * Draws a single edge with arrow
     * @param {GraphNode} fromNode - Source node
     * @param {GraphNode} toNode - Target node
     * @param {string} edgeState - State of the edge (normal, cycle)
     */
    drawEdge(fromNode, toNode, edgeState = 'normal') {
        const color = edgeState === 'cycle' ? this.colors.cycleEdge : this.colors.edge;
        
        // Calculate edge endpoints (accounting for node radius)
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        const unitX = dx / distance;
        const unitY = dy / distance;
        
        const startX = fromNode.x + unitX * this.nodeRadius;
        const startY = fromNode.y + unitY * this.nodeRadius;
        const endX = toNode.x - unitX * this.nodeRadius;
        const endY = toNode.y - unitY * this.nodeRadius;
        
        // Draw edge line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = edgeState === 'cycle' ? this.edgeWidth + 1 : this.edgeWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // Draw arrowhead
        this.drawArrowhead(endX, endY, unitX, unitY, color);
    }

    /**
     * Draws an arrowhead at the end of an edge
     * @param {number} x - X coordinate of arrow tip
     * @param {number} y - Y coordinate of arrow tip
     * @param {number} unitX - X component of unit vector
     * @param {number} unitY - Y component of unit vector
     * @param {string} color - Arrow color
     */
    drawArrowhead(x, y, unitX, unitY, color) {
        const size = this.arrowSize;
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - size * unitX + size * 0.5 * unitY,
            y - size * unitY - size * 0.5 * unitX
        );
        this.ctx.lineTo(
            x - size * unitX - size * 0.5 * unitY,
            y - size * unitY + size * 0.5 * unitX
        );
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Draws all nodes in the graph
     */
    drawNodes() {
        const nodes = this.graph.getAllNodes();
        
        for (let node of nodes) {
            this.drawNode(node);
        }
    }

    /**
     * Draws a single node
     * @param {GraphNode} node - Node to draw
     */
    drawNode(node) {
        // Determine node color based on state
        let fillColor = this.colors.unvisited;
        let strokeColor = '#333333';
        let strokeWidth = 2;
        
        switch (node.state) {
            case 'visiting':
                fillColor = this.colors.visiting;
                strokeWidth = 3;
                break;
            case 'visited':
                fillColor = this.colors.visited;
                break;
            case 'cycle':
                fillColor = this.colors.cycle;
                strokeColor = '#B71C1C';
                strokeWidth = 3;
                break;
        }
        
        // Draw node circle
        this.ctx.fillStyle = fillColor;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = strokeWidth;
        
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw node label
        this.ctx.fillStyle = this.colors.nodeText;
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.label, node.x, node.y);
        
        // Draw discovery/finish times for visited nodes (for educational purposes)
        if (node.state === 'visited' && node.discoveryTime > 0) {
            this.ctx.font = '10px Arial';
            this.ctx.fillStyle = '#666666';
            this.ctx.fillText(
                `${node.discoveryTime}/${node.finishTime}`,
                node.x,
                node.y + this.nodeRadius + 12
            );
        }
    }

    /**
     * Updates the algorithm status display
     * @param {string} status - Status message
     */
    updateStatus(status) {
        const statusElement = document.getElementById('dfs-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    /**
     * Updates the statistics display
     */
    updateStats() {
        const visitedElement = document.getElementById('dfs-visited-count');
        const cycleElement = document.getElementById('dfs-cycle-count');
        
        if (visitedElement) {
            visitedElement.textContent = this.visitedCount;
        }
        
        if (cycleElement) {
            cycleElement.textContent = this.cycleCount;
        }
    }

    /**
     * Checks if the algorithm can start
     * @returns {boolean} True if can start
     */
    canStart() {
        return !this.isRunning && this.graph.getAllNodes().length > 0;
    }
}
