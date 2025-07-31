/**
 * Utility functions for the Algorithm Visualizer
 * Contains common helper functions used across different modules
 */

class Utils {
    /**
     * Generates a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a random float between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random float
     */
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Calculates Euclidean distance between two points
     * @param {Object} point1 - First point {x, y}
     * @param {Object} point2 - Second point {x, y}
     * @returns {number} Distance
     */
    static distance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Debounces a function call
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Interpolates between two colors
     * @param {string} color1 - Starting color (hex)
     * @param {string} color2 - Ending color (hex)
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {string} Interpolated color (hex)
     */
    static interpolateColor(color1, color2, factor) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Creates a delay for async operations
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Converts speed slider value to delay in milliseconds
     * @param {number} speed - Speed value (1-10)
     * @returns {number} Delay in milliseconds
     */
    static speedToDelay(speed) {
        // Speed 1 = 500ms delay, Speed 10 = 50ms delay
        return 550 - (speed * 50);
    }

    /**
     * Clamps a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Generates a unique ID
     * @returns {string} Unique ID
     */
    static generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Gets mouse position relative to canvas
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Mouse position {x, y}
     */
    static getMousePos(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /**
     * Checks if a point is inside a rectangle
     * @param {Object} point - Point {x, y}
     * @param {Object} rect - Rectangle {x, y, width, height}
     * @returns {boolean} True if point is inside rectangle
     */
    static pointInRect(point, rect) {
        return point.x >= rect.x && 
               point.x <= rect.x + rect.width && 
               point.y >= rect.y && 
               point.y <= rect.y + rect.height;
    }

    /**
     * Checks if a point is inside a circle
     * @param {Object} point - Point {x, y}
     * @param {Object} circle - Circle {x, y, radius}
     * @returns {boolean} True if point is inside circle
     */
    static pointInCircle(point, circle) {
        const distance = Utils.distance(point, circle);
        return distance <= circle.radius;
    }

    /**
     * Converts RGB values to hex color
     * @param {number} r - Red value (0-255)
     * @param {number} g - Green value (0-255)
     * @param {number} b - Blue value (0-255)
     * @returns {string} Hex color
     */
    static rgbToHex(r, g, b) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Formats a number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
