/**
 * Breadth-First Search (BFS) Algorithm Implementation
 * Used for finding shortest path in unweighted grids/graphs
 */

class BFSVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.grid = new Grid(this.canvas.width, this.canvas.height, 20);
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 5;
        this.visitedCount = 0;
        this.pathLength = 0;
        
        // Colors for visualization
        this.colors = {
            empty: '#FFFFFF',
            wall: '#333333',
            start: '#4CAF50',
            goal: '#F44336',
            visited: '#87CEEB',
            frontier: '#FFE135',
            path: '#FF6B35',
            border: '#DDDDDD'
        };
        
        this.setupEventListeners();
        this.draw();
    }

    /**
     * Sets up mouse event listeners for grid interaction
     */
    setupEventListeners() {
        let isDrawing = false;
        let drawMode = 'wall';
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.isRunning) return;
            
            const pos = Utils.getMousePos(this.canvas, e);
            const cell = this.grid.getCellAt(pos.x, pos.y);
            
            if (cell) {
                isDrawing = true;
                if (cell.type === 'start' || cell.type === 'goal') {
                    return;
                }
                
                drawMode = cell.type === 'wall' ? 'empty' : 'wall';
                this.grid.toggleWall(cell.col, cell.row);
                this.draw();
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing || this.isRunning) return;
            
            const pos = Utils.getMousePos(this.canvas, e);
            const cell = this.grid.getCellAt(pos.x, pos.y);
            
            if (cell && cell.type !== 'start' && cell.type !== 'goal') {
                if ((drawMode === 'wall' && cell.type === 'empty') ||
                    (drawMode === 'empty' && cell.type === 'wall')) {
                    this.grid.toggleWall(cell.col, cell.row);
                    this.draw();
                }
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });
    }

    /**
     * Starts the BFS algorithm visualization
     */
    async startBFS() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.visitedCount = 0;
        this.pathLength = 0;
        this.grid.reset();
        this.updateStatus('Running BFS...');
        this.updateStats();
        
        const result = await this.runBFS();
        
        if (result.pathFound) {
            this.updateStatus('Path found!');
            await this.highlightPath(result.path);
        } else {
            this.updateStatus('No path exists');
        }
        
        this.isRunning = false;
    }

    /**
     * Implements the BFS algorithm
     * @returns {Object} Result object with pathFound and path
     */
    async runBFS() {
        const queue = [this.grid.start];
        const visited = new Set();
        
        this.grid.start.distance = 0;
        this.grid.start.state = 'frontier';
        visited.add(this.grid.start);
        
        while (queue.length > 0 && !this.isPaused) {
            // Wait for animation delay
            await Utils.delay(Utils.speedToDelay(this.animationSpeed));
            
            const current = queue.shift();
            current.state = 'visited';
            this.visitedCount++;
            
            // Check if we reached the goal
            if (current === this.grid.goal) {
                const path = this.reconstructPath(current);
                this.pathLength = path.length - 1; // Exclude start node
                this.updateStats();
                return { pathFound: true, path: path };
            }
            
            // Explore neighbors
            const neighbors = this.grid.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    neighbor.parent = current;
                    neighbor.distance = current.distance + 1;
                    neighbor.state = 'frontier';
                    queue.push(neighbor);
                }
            }
            
            this.updateStats();
            this.draw();
            
            // Check if paused
            while (this.isPaused && this.isRunning) {
                await Utils.delay(100);
            }
        }
        
        return { pathFound: false, path: [] };
    }

    /**
     * Reconstructs the path from goal to start
     * @param {Object} goalCell - The goal cell
     * @returns {Array} Array of cells representing the path
     */
    reconstructPath(goalCell) {
        const path = [];
        let current = goalCell;
        
        while (current !== null) {
            path.unshift(current);
            current = current.parent;
        }
        
        return path;
    }

    /**
     * Highlights the found path with animation
     * @param {Array} path - Array of cells in the path
     */
    async highlightPath(path) {
        for (let i = 1; i < path.length - 1; i++) { // Skip start and goal
            await Utils.delay(Utils.speedToDelay(this.animationSpeed) / 2);
            path[i].state = 'path';
            this.draw();
        }
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
        this.updateStatus('Running BFS...');
    }

    /**
     * Resets the visualization
     */
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.visitedCount = 0;
        this.pathLength = 0;
        this.grid.reset();
        this.updateStatus('Ready');
        this.updateStats();
        this.draw();
    }

    /**
     * Clears the grid
     */
    clear() {
        this.grid.clear();
        this.reset();
    }

    /**
     * Generates a random maze
     */
    generateMaze() {
        if (this.isRunning) return;
        this.grid.generateMaze();
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
     * Draws the entire grid
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.cols; col++) {
                const cell = this.grid.cells[row][col];
                this.drawCell(cell);
            }
        }
        
        // Draw grid lines
        this.drawGridLines();
    }

    /**
     * Draws a single cell
     * @param {Object} cell - Cell to draw
     */
    drawCell(cell) {
        const x = cell.x;
        const y = cell.y;
        const size = this.grid.cellSize;
        
        // Determine cell color based on type and state
        let color = this.colors.empty;
        
        if (cell.type === 'wall') {
            color = this.colors.wall;
        } else if (cell.type === 'start') {
            color = this.colors.start;
        } else if (cell.type === 'goal') {
            color = this.colors.goal;
        } else if (cell.state === 'visited') {
            color = this.colors.visited;
        } else if (cell.state === 'frontier') {
            color = this.colors.frontier;
        } else if (cell.state === 'path') {
            color = this.colors.path;
        }
        
        // Fill cell
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
        
        // Draw border
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, size, size);
        
        // Draw labels for start and goal
        if (cell.type === 'start' || cell.type === 'goal') {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const text = cell.type === 'start' ? 'S' : 'G';
            this.ctx.fillText(text, x + size/2, y + size/2);
        }
    }

    /**
     * Draws grid lines
     */
    drawGridLines() {
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let col = 0; col <= this.grid.cols; col++) {
            const x = col * this.grid.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let row = 0; row <= this.grid.rows; row++) {
            const y = row * this.grid.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Updates the algorithm status display
     * @param {string} status - Status message
     */
    updateStatus(status) {
        const statusElement = document.getElementById('bfs-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    /**
     * Updates the statistics display
     */
    updateStats() {
        const visitedElement = document.getElementById('bfs-visited-count');
        const pathElement = document.getElementById('bfs-path-length');
        
        if (visitedElement) {
            visitedElement.textContent = this.visitedCount;
        }
        
        if (pathElement) {
            pathElement.textContent = this.pathLength;
        }
    }

    /**
     * Checks if the algorithm can start
     * @returns {boolean} True if can start
     */
    canStart() {
        return !this.isRunning && this.grid.start && this.grid.goal;
    }
}
