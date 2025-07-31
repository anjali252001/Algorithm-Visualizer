/**
 * Main application controller
 * Handles UI interactions and coordinates between different algorithm visualizers
 */

class AlgorithmVisualizer {
    constructor() {
        this.currentAlgorithm = 'bfs';
        this.bfsVisualizer = null;
        this.dfsVisualizer = null;
        
        this.initializeApplication();
    }

    /**
     * Initializes the application and sets up event listeners
     */
    initializeApplication() {
        // Initialize visualizers
        this.bfsVisualizer = new BFSVisualizer('bfs-canvas');
        this.dfsVisualizer = new DFSVisualizer('dfs-canvas');
        
        // Setup tab switching
        this.setupTabSwitching();
        
        // Setup control buttons
        this.setupControlButtons();
        
        // Setup speed controls
        this.setupSpeedControls();
        
        // Update initial button states
        this.updateButtonStates();
        
        console.log('Algorithm Visualizer initialized successfully');
    }

    /**
     * Sets up tab switching functionality
     */
    setupTabSwitching() {
        const bfsTab = document.getElementById('bfs-tab');
        const dfsTab = document.getElementById('dfs-tab');
        const bfsPanel = document.getElementById('bfs-panel');
        const dfsPanel = document.getElementById('dfs-panel');
        const bfsInstructions = document.getElementById('bfs-instructions');
        const dfsInstructions = document.getElementById('dfs-instructions');

        bfsTab.addEventListener('click', () => {
            this.switchToAlgorithm('bfs');
            
            // Update tab appearance
            bfsTab.classList.add('active');
            dfsTab.classList.remove('active');
            
            // Update panel visibility
            bfsPanel.classList.add('active');
            dfsPanel.classList.remove('active');
            
            // Update instructions
            bfsInstructions.classList.add('active');
            dfsInstructions.classList.remove('active');
            
            this.updateButtonStates();
        });

        dfsTab.addEventListener('click', () => {
            this.switchToAlgorithm('dfs');
            
            // Update tab appearance
            dfsTab.classList.add('active');
            bfsTab.classList.remove('active');
            
            // Update panel visibility
            dfsPanel.classList.add('active');
            bfsPanel.classList.remove('active');
            
            // Update instructions
            dfsInstructions.classList.add('active');
            bfsInstructions.classList.remove('active');
            
            this.updateButtonStates();
        });
    }

    /**
     * Sets up control button event listeners
     */
    setupControlButtons() {
        // BFS Controls
        document.getElementById('bfs-generate-maze').addEventListener('click', () => {
            this.bfsVisualizer.generateMaze();
            this.updateButtonStates();
        });

        document.getElementById('bfs-clear').addEventListener('click', () => {
            this.bfsVisualizer.clear();
            this.updateButtonStates();
        });

        document.getElementById('bfs-start').addEventListener('click', () => {
            if (this.bfsVisualizer.canStart()) {
                this.bfsVisualizer.startBFS();
                this.updateButtonStates();
            }
        });

        document.getElementById('bfs-pause').addEventListener('click', () => {
            if (this.bfsVisualizer.isRunning && !this.bfsVisualizer.isPaused) {
                this.bfsVisualizer.pause();
            } else if (this.bfsVisualizer.isRunning && this.bfsVisualizer.isPaused) {
                this.bfsVisualizer.resume();
            }
            this.updateButtonStates();
        });

        document.getElementById('bfs-reset').addEventListener('click', () => {
            this.bfsVisualizer.reset();
            this.updateButtonStates();
        });

        // DFS Controls
        document.getElementById('dfs-generate-graph').addEventListener('click', () => {
            this.dfsVisualizer.generateRandomGraph();
            this.updateButtonStates();
        });

        document.getElementById('dfs-add-cycle').addEventListener('click', () => {
            this.dfsVisualizer.addCycle();
            this.updateButtonStates();
        });

        document.getElementById('dfs-clear').addEventListener('click', () => {
            this.dfsVisualizer.clear();
            this.updateButtonStates();
        });

        document.getElementById('dfs-start').addEventListener('click', () => {
            if (this.dfsVisualizer.canStart()) {
                this.dfsVisualizer.startDFS();
                this.updateButtonStates();
            }
        });

        document.getElementById('dfs-pause').addEventListener('click', () => {
            if (this.dfsVisualizer.isRunning && !this.dfsVisualizer.isPaused) {
                this.dfsVisualizer.pause();
            } else if (this.dfsVisualizer.isRunning && this.dfsVisualizer.isPaused) {
                this.dfsVisualizer.resume();
            }
            this.updateButtonStates();
        });

        document.getElementById('dfs-reset').addEventListener('click', () => {
            this.dfsVisualizer.reset();
            this.updateButtonStates();
        });
    }

    /**
     * Sets up speed control sliders
     */
    setupSpeedControls() {
        // BFS Speed Control
        const bfsSpeedSlider = document.getElementById('bfs-speed');
        const bfsSpeedValue = document.getElementById('bfs-speed-value');

        bfsSpeedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            bfsSpeedValue.textContent = speed;
            this.bfsVisualizer.setSpeed(speed);
        });

        // DFS Speed Control
        const dfsSpeedSlider = document.getElementById('dfs-speed');
        const dfsSpeedValue = document.getElementById('dfs-speed-value');

        dfsSpeedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            dfsSpeedValue.textContent = speed;
            this.dfsVisualizer.setSpeed(speed);
        });
    }

    /**
     * Switches to a specific algorithm
     * @param {string} algorithm - Algorithm to switch to ('bfs' or 'dfs')
     */
    switchToAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        // Stop any running algorithms when switching
        if (this.bfsVisualizer.isRunning) {
            this.bfsVisualizer.reset();
        }
        if (this.dfsVisualizer.isRunning) {
            this.dfsVisualizer.reset();
        }
    }

    /**
     * Updates button states based on current algorithm state
     */
    updateButtonStates() {
        this.updateBFSButtonStates();
        this.updateDFSButtonStates();
    }

    /**
     * Updates BFS button states
     */
    updateBFSButtonStates() {
        const generateBtn = document.getElementById('bfs-generate-maze');
        const clearBtn = document.getElementById('bfs-clear');
        const startBtn = document.getElementById('bfs-start');
        const pauseBtn = document.getElementById('bfs-pause');
        const resetBtn = document.getElementById('bfs-reset');

        const isRunning = this.bfsVisualizer.isRunning;
        const isPaused = this.bfsVisualizer.isPaused;
        const canStart = this.bfsVisualizer.canStart();

        // Enable/disable buttons
        generateBtn.disabled = isRunning;
        clearBtn.disabled = isRunning;
        startBtn.disabled = !canStart || isRunning;
        pauseBtn.disabled = !isRunning;
        resetBtn.disabled = false;

        // Update pause button text
        if (isRunning && isPaused) {
            pauseBtn.textContent = 'Resume';
        } else {
            pauseBtn.textContent = 'Pause';
        }
    }

    /**
     * Updates DFS button states
     */
    updateDFSButtonStates() {
        const generateBtn = document.getElementById('dfs-generate-graph');
        const addCycleBtn = document.getElementById('dfs-add-cycle');
        const clearBtn = document.getElementById('dfs-clear');
        const startBtn = document.getElementById('dfs-start');
        const pauseBtn = document.getElementById('dfs-pause');
        const resetBtn = document.getElementById('dfs-reset');

        const isRunning = this.dfsVisualizer.isRunning;
        const isPaused = this.dfsVisualizer.isPaused;
        const canStart = this.dfsVisualizer.canStart();

        // Enable/disable buttons
        generateBtn.disabled = isRunning;
        addCycleBtn.disabled = isRunning;
        clearBtn.disabled = isRunning;
        startBtn.disabled = !canStart || isRunning;
        pauseBtn.disabled = !isRunning;
        resetBtn.disabled = false;

        // Update pause button text
        if (isRunning && isPaused) {
            pauseBtn.textContent = 'Resume';
        } else {
            pauseBtn.textContent = 'Pause';
        }
    }

    /**
     * Handles keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardShortcuts(event) {
        // Prevent shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT') return;

        switch (event.key.toLowerCase()) {
            case ' ': // Spacebar - Start/Pause
                event.preventDefault();
                if (this.currentAlgorithm === 'bfs') {
                    if (this.bfsVisualizer.canStart()) {
                        this.bfsVisualizer.startBFS();
                    } else if (this.bfsVisualizer.isRunning) {
                        if (this.bfsVisualizer.isPaused) {
                            this.bfsVisualizer.resume();
                        } else {
                            this.bfsVisualizer.pause();
                        }
                    }
                } else {
                    if (this.dfsVisualizer.canStart()) {
                        this.dfsVisualizer.startDFS();
                    } else if (this.dfsVisualizer.isRunning) {
                        if (this.dfsVisualizer.isPaused) {
                            this.dfsVisualizer.resume();
                        } else {
                            this.dfsVisualizer.pause();
                        }
                    }
                }
                this.updateButtonStates();
                break;

            case 'r': // R - Reset
                if (this.currentAlgorithm === 'bfs') {
                    this.bfsVisualizer.reset();
                } else {
                    this.dfsVisualizer.reset();
                }
                this.updateButtonStates();
                break;

            case 'c': // C - Clear
                if (this.currentAlgorithm === 'bfs') {
                    this.bfsVisualizer.clear();
                } else {
                    this.dfsVisualizer.clear();
                }
                this.updateButtonStates();
                break;

            case 'g': // G - Generate
                if (this.currentAlgorithm === 'bfs') {
                    this.bfsVisualizer.generateMaze();
                } else {
                    this.dfsVisualizer.generateRandomGraph();
                }
                this.updateButtonStates();
                break;

            case '1': // 1 - Switch to BFS
                document.getElementById('bfs-tab').click();
                break;

            case '2': // 2 - Switch to DFS
                document.getElementById('dfs-tab').click();
                break;
        }
    }

    /**
     * Initializes keyboard shortcuts
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });
    }

    /**
     * Shows help information
     */
    showHelp() {
        const helpText = `
Keyboard Shortcuts:
• Spacebar: Start/Pause algorithm
• R: Reset visualization
• C: Clear grid/graph
• G: Generate random maze/graph
• 1: Switch to BFS
• 2: Switch to DFS

Mouse Controls:
• BFS: Click to toggle walls
• DFS: Click to create nodes, drag to create edges
        `;
        
        alert(helpText);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the main application instance
    const app = new AlgorithmVisualizer();
    
    // Initialize keyboard shortcuts
    app.initializeKeyboardShortcuts();
    
    // Periodically update button states to handle async state changes
    setInterval(() => {
        app.updateButtonStates();
    }, 100);
    
    // Add help functionality (optional)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'h' || event.key === 'H') {
            if (!event.target.tagName === 'INPUT') {
                app.showHelp();
            }
        }
    });
    
    console.log('Algorithm Visualizer application started');
});
