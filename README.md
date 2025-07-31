# Interactive Algorithm Visualizer

A comprehensive web-based tool for visualizing graph traversal algorithms with interactive examples and educational features.

## Features

### 🔍 **Breadth-First Search (BFS) - Shortest Path Finding**
- **Use Case**: Find the shortest path in an unweighted maze/grid
- **Real-world Application**: GPS navigation, network routing, puzzle solving
- **Features**:
  - Interactive grid with clickable walls
  - Random maze generation
  - Step-by-step visualization with color-coded cells
  - Guaranteed shortest path discovery
  - Statistics tracking (nodes visited, path length)

### 🌳 **Depth-First Search (DFS) - Cycle Detection**
- **Use Case**: Detect cycles in directed graphs
- **Real-world Application**: Circular dependency detection in task scheduling, deadlock detection
- **Features**:
  - Interactive directed graph creation
  - Click to add nodes, drag to create edges
  - Random graph generation with cycle injection
  - Visual cycle highlighting
  - Discovery/finish time display for educational purposes

### 🎮 **Interactive Controls**
- Start, pause, and reset functionality
- Variable speed control (1-10x speed)
- Real-time statistics display
- Keyboard shortcuts for efficient control
- Responsive design for different screen sizes

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start exploring the algorithms!

### File Structure
```
Algorithm Visualizer/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
└── js/
    ├── main.js          # Application controller
    ├── utils.js         # Utility functions
    ├── graph.js         # Graph data structures
    ├── bfs.js           # BFS implementation
    └── dfs.js           # DFS implementation
```

## How to Use

### BFS - Shortest Path Visualization
1. **Setup**:
   - Click "Generate Random Maze" for a random maze
   - Or manually click on grid cells to toggle walls
   - Green cell = Start, Red cell = Goal

2. **Run Algorithm**:
   - Click "Start BFS" to begin visualization
   - Watch as BFS explores level by level (breadth-first)
   - Yellow cells = Frontier (currently being explored)
   - Blue cells = Visited
   - Orange path = Shortest path found

3. **Controls**:
   - Adjust speed with the slider
   - Pause/Resume during execution
   - Reset to try again

### DFS - Cycle Detection
1. **Setup**:
   - Click "Generate Random Graph" for a random directed graph
   - Click "Add Cycle" to intentionally create cycles
   - Or manually create nodes (click) and edges (drag between nodes)

2. **Run Algorithm**:
   - Click "Start DFS" to begin cycle detection
   - Watch as DFS explores deeply (depth-first)
   - Yellow nodes = Currently visiting
   - Blue nodes = Completely visited
   - Red nodes/edges = Cycle detected

3. **Understanding the Visualization**:
   - Numbers below nodes show discovery/finish times
   - Red highlighted elements indicate detected cycles
   - Statistics show total cycles found

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Spacebar** | Start/Pause algorithm |
| **R** | Reset visualization |
| **C** | Clear grid/graph |
| **G** | Generate random maze/graph |
| **1** | Switch to BFS tab |
| **2** | Switch to DFS tab |
| **H** | Show help |

## Algorithm Details

### Breadth-First Search (BFS)
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V) for the queue
- **Guarantees**: Finds shortest path in unweighted graphs
- **Use Cases**: 
  - Shortest path in unweighted graphs
  - Level-order tree traversal
  - Social network analysis (degrees of separation)
  - Web crawling

### Depth-First Search (DFS)
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V) for the recursion stack
- **Cycle Detection**: Uses white/gray/black coloring
  - White (unvisited) → Gray (visiting) → Black (visited)
  - Back edge to gray node indicates cycle
- **Use Cases**:
  - Cycle detection in directed graphs
  - Topological sorting
  - Finding strongly connected components
  - Dependency resolution

## Educational Features

### Visual Learning
- **Color-coded states** help understand algorithm progression
- **Step-by-step animation** shows exactly how algorithms work
- **Statistics tracking** provides quantitative insights
- **Interactive controls** allow experimentation at your own pace

### Code Structure
The codebase is designed to be educational and modular:

- **`utils.js`**: Common utility functions and helpers
- **`graph.js`**: Graph data structures (Graph, Node, Grid classes)
- **`bfs.js`**: BFS algorithm implementation with visualization
- **`dfs.js`**: DFS algorithm implementation with cycle detection
- **`main.js`**: Application controller and UI management

### Key Programming Concepts Demonstrated
- **Object-Oriented Programming**: Classes for graphs, nodes, and visualizers
- **Asynchronous Programming**: Using async/await for animation timing
- **Event-Driven Programming**: Mouse and keyboard event handling
- **Canvas API**: 2D graphics rendering and animation
- **Algorithm Design**: Queue-based BFS and stack-based DFS
- **Data Structures**: Graphs, queues, sets, and maps

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Fully Supported |
| Firefox | 55+ | ✅ Fully Supported |
| Safari | 11+ | ✅ Fully Supported |
| Edge | 79+ | ✅ Fully Supported |

## Customization

### Adding New Algorithms
To add a new algorithm visualizer:

1. Create a new JavaScript file (e.g., `dijkstra.js`)
2. Implement the algorithm class following the existing pattern
3. Add UI elements to `index.html`
4. Update `main.js` to handle the new algorithm
5. Add appropriate styling to `styles.css`

### Modifying Visualizations
- Colors can be customized in the `colors` object of each visualizer
- Animation speeds are controlled by the `speedToDelay()` function
- Grid/canvas sizes can be adjusted in the constructor parameters

## Performance Notes

- **Grid Size**: BFS visualization uses a 30x20 grid by default for optimal performance
- **Graph Size**: DFS visualization handles 6-10 nodes efficiently
- **Animation**: Uses `requestAnimationFrame` for smooth animations
- **Memory**: Automatic cleanup prevents memory leaks during repeated runs

## Troubleshooting

### Common Issues

1. **Algorithm not starting**: 
   - Ensure start and goal positions are set (BFS)
   - Ensure graph has nodes (DFS)

2. **Slow performance**:
   - Increase animation speed using the slider
   - Close other browser tabs
   - Use a modern browser

3. **Visual glitches**:
   - Refresh the page
   - Clear browser cache
   - Ensure JavaScript is enabled

### Support
For questions or issues:
- Check the browser console for error messages
- Ensure all files are in the correct directory structure
- Verify that JavaScript is enabled in your browser

## Educational Applications

### Classroom Use
- **Computer Science courses**: Algorithm analysis and visualization
- **Mathematics**: Graph theory and discrete mathematics
- **Problem Solving**: Understanding search strategies

### Self-Learning
- **Algorithm study**: Visual understanding of abstract concepts
- **Interview preparation**: Common algorithms in technical interviews
- **Programming practice**: Understanding implementation details

## Future Enhancements

Potential additions to consider:
- **A* Search Algorithm**: Heuristic-based pathfinding
- **Dijkstra's Algorithm**: Weighted shortest path
- **Minimum Spanning Tree**: Kruskal's or Prim's algorithm
- **Network Flow**: Max flow algorithms
- **Export functionality**: Save visualizations as images/videos
- **Step-by-step mode**: Manual control over each algorithm step

## License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute for educational purposes.

## Acknowledgments

- Inspired by classic algorithm visualization tools
- Built with modern web technologies for accessibility
- Designed with education and understanding as primary goals
