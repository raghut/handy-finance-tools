<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    // Import p5 only in client-side context to avoid SSR issues
    import type p5 from 'p5'; 
    
    // Define a custom interface for our p5 instance with the additional method
    interface CustomP5 extends p5 {
      clearDrawingArea?: () => void;
    }
    
    // Define a proper touch object interface
    interface TouchPoint {
      x: number;
      y: number;
      id: number;
    }
  
    // --- Reactive Svelte Variables for UI Controls ---
    let symmetry = 6;         // Default number of symmetrical segments
    let strokeColor = '#FFC800'; // Default pen color: orange
    let strokeWeight = 4;       // Default pen size
  
    // --- Internal Svelte State ---
    let p5Instance: CustomP5;             // Using our custom type
    let canvasContainerElement: HTMLElement; // Type annotation for the container
    
    // Track previous touch positions for mobile
    let prevTouchX = 0;
    let prevTouchY = 0;
    let isTouching = false;
  
    // --- Constants ---
    const controlAreaHeight = 80; // Estimated height for the controls bar at the bottom
    
    // Use a browser import to avoid SSR issues
    let P5: any;
    
    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';

    // --- Lifecycle Hooks ---
    onMount(async () => {
      // Add body class for scoped styling - only in browser context
      if (isBrowser) {
        document.body.classList.add('kaleidoscope-active');
      
        // Dynamically import p5 only in the browser
        const p5Module = await import('p5');
        P5 = p5Module.default;
        
        // The p5.js sketch function
        const sketch = (p: CustomP5) => {
          p.setup = () => {
            // Create the canvas inside the designated container
            // Use window dimensions directly for initial setup, adjusted for controls
            let initialCanvasWidth = window.innerWidth;
            let initialCanvasHeight = window.innerHeight - controlAreaHeight;
            p.createCanvas(initialCanvasWidth, initialCanvasHeight);
            p.angleMode(p.DEGREES); // Use degrees for rotation
            p.background(25);       // Dark background for the drawing area
          };
    
          p.draw = () => {
            // Use reactive Svelte variables for drawing parameters
            p.stroke(strokeColor);
            p.strokeWeight(strokeWeight);
    
            // Translate origin to the center for symmetrical drawing
            p.translate(p.width / 2, p.height / 2);
    
            // Draw if mouse is pressed and moved within canvas boundaries
            if (p.mouseIsPressed && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
              drawSymmetricalLines(p, p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
            }
          };
          
          // Helper function to draw symmetrical lines
          function drawSymmetricalLines(p: CustomP5, currentX: number, currentY: number, previousX: number, previousY: number) {
            // Check for actual movement to avoid dots on static clicks/touches
            if (p.dist(currentX, currentY, previousX, previousY) > 0.1) { 
              // Calculate positions relative to the centered origin
              let mx = currentX - p.width / 2;
              let my = currentY - p.height / 2;
              let pmx = previousX - p.width / 2;
              let pmy = previousY - p.height / 2;
              
              let currentAngle = 360 / symmetry; // Calculate angle based on current symmetry

              // Loop to draw each symmetrical segment
              for (let i = 0; i < symmetry; i++) {
                p.push(); // Save current drawing state
                p.rotate(i * currentAngle); // Rotate for the current segment

                // Draw the primary line
                p.line(mx, my, pmx, pmy);

                // Draw the reflected (mirrored) line
                p.push(); // Save state before scaling for reflection
                p.scale(1, -1); // Reflect vertically
                p.line(mx, my, pmx, pmy);
                p.pop(); // Restore state after reflection

                p.pop(); // Restore state after rotation
              }
            }
          }
          
          // Touch event handlers
          p.touchStarted = function() {
            if (p.touches && p.touches.length > 0) {
              // Cast p.touches[0] to a TouchPoint to access x and y safely
              const touch = p.touches[0] as unknown as TouchPoint;
              if (touch && touch.x > 0 && touch.x < p.width && touch.y > 0 && touch.y < p.height) {
                prevTouchX = touch.x;
                prevTouchY = touch.y;
                isTouching = true;
              }
            }
            return false; // Prevent default
          };
          
          p.touchMoved = function() {
            if (isTouching && p.touches && p.touches.length > 0) {
              // Cast p.touches[0] to a TouchPoint to access x and y safely
              const touch = p.touches[0] as unknown as TouchPoint;
              if (touch && touch.x > 0 && touch.x < p.width && touch.y > 0 && touch.y < p.height) {
                // Draw the symmetrical lines for touch movement
                drawSymmetricalLines(p, touch.x, touch.y, prevTouchX, prevTouchY);
                // Update previous touch position
                prevTouchX = touch.x;
                prevTouchY = touch.y;
              }
            }
            return false; // Prevent default
          };
          
          p.touchEnded = function() {
            isTouching = false;
            prevTouchX = 0;
            prevTouchY = 0;
            return false; // Prevent default
          };
    
          // p5.js's own window resize handler
          p.windowResized = () => {
            let newCanvasWidth = window.innerWidth;
            let newCanvasHeight = window.innerHeight - controlAreaHeight;
            p.resizeCanvas(newCanvasWidth, newCanvasHeight);
            p.background(25); // Clear and redraw background on resize
          };
    
          // Method to clear the canvas, callable from Svelte
          p.clearDrawingArea = () => {
            p.background(25);
          };
        };
    
        // Create the p5 instance, targeting the canvasContainerElement
        p5Instance = new P5(sketch, canvasContainerElement) as CustomP5;
    
        // Initial call to ensure canvas is sized correctly if window is already at final size
        // This is useful if onMount fires after an initial resize event.
        if (p5Instance) {
            let currentCanvasWidth = window.innerWidth;
            let currentCanvasHeight = window.innerHeight - controlAreaHeight;
            p5Instance.resizeCanvas(currentCanvasWidth, currentCanvasHeight);
            p5Instance.background(25);
        }
      }
    });
  
    onDestroy(() => {
      // Remove body class when component unmounts - only in browser context
      if (isBrowser) {
        document.body.classList.remove('kaleidoscope-active');
      }
      
      // Clean up the p5 instance when the Svelte component is destroyed
      if (p5Instance) {
        p5Instance.remove();
      }
    });
  
    // --- Svelte UI Event Handlers ---
    function handleClearCanvas() {
      if (p5Instance?.clearDrawingArea) {
        p5Instance.clearDrawingArea();
      }
    }
  </script>
  
  <svelte:head>
    <title>Kaleido Scope - Interactive Drawing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
  </svelte:head>
  
  <div class="app-container">
    <div bind:this={canvasContainerElement} class="canvas-host">
      </div>
  
    <div class="controls-container">
      <div class="control-group">
        <label for="colorPicker">Color:</label>
        <input type="color" id="colorPicker" bind:value={strokeColor} />
      </div>
  
      <div class="control-group">
        <label for="weightSlider">Size: {strokeWeight}</label>
        <input type="range" id="weightSlider" min="1" max="32" step="1" bind:value={strokeWeight} />
      </div>
  
      <div class="control-group">
        <label for="symmetrySlider">Symmetry: {symmetry}</label>
        <input type="range" id="symmetrySlider" min="2" max="24" step="1" bind:value={symmetry} />
      </div>
  
      <button on:click={handleClearCanvas}>Clear</button>
    </div>
  </div>
  
  <style>
    /* Keep background style scoped to this component only */
    :global(body.kaleidoscope-active) {
      background-color: #101010; 
      color: #f0f0f0;
      overflow: hidden;
      touch-action: none;
    }
    
    /* Instead of setting these on the global body, use scoped styles */
    :global(:root) {
      --app-background: initial;
      --app-text: initial;
    }
    
    /* Apply kaleidoscope background only while component is mounted */
    :global(.kaleidoscope-active .app-container) {
      background-color: #101010;
    }
  
    .app-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: #101010;
      font-family: Arial, sans-serif;
      color: #f0f0f0;
    }
  
    .canvas-host {
      width: 100%;
      touch-action: none;
    }
  
    /* Style the p5 canvas globally if it's created by p5.js */
   :global(.canvas-host canvas) {
      display: block;
      border: 1px solid #333;
      box-sizing: border-box;
      touch-action: none;
    }
  
    .controls-container {
      padding: 10px 15px;
      background-color: #181818;
      border-radius: 8px;
      box-shadow: 0 -2px 5px rgba(0,0,0,0.3);
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      align-items: center;
      justify-content: center;
      
      position: fixed;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      
      width: auto;
      min-width: 300px;
      max-width: calc(100% - 40px);
      box-sizing: border-box;
      z-index: 10;
    }
  
    .control-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  
    .control-group label {
      font-size: 0.9em;
      white-space: nowrap;
    }
  
    input[type="color"] {
      border: 1px solid #555;
      border-radius: 4px;
      height: 28px;
      width: 40px;
      padding: 0 2px;
      background-color: transparent;
      cursor: pointer;
    }
  
    input[type="range"] {
      cursor: pointer;
      min-width: 80px;
    }
  
    button {
      padding: 8px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9em;
      transition: background-color 0.2s ease-in-out;
    }
  
    button:hover {
      background-color: #0056b3;
    }
    
    /* Additional mobile-specific styles */
    @media (max-width: 480px) {
      .controls-container {
        padding: 8px 12px;
        gap: 10px;
      }
      
      input[type="range"] {
        min-width: 60px;
      }
      
      .control-group label {
        font-size: 0.8em;
      }
    }
  </style>

<!--
  **Key Changes and How to Use:**
  
  1.  **Installation:**
      * You need a Svelte project setup. If you don't have one, you can create it using `npm create svelte@latest my-kaleidoscope-app`.
      * Install p5.js: `npm install p5` (or `yarn add p5`) in your project directory.
  
  2.  **File Structure:**
      * Save the code above into a file like `src/App.svelte` or `src/lib/Kaleidoscope.svelte` (and then import it into `App.svelte`).
  
  3.  **Running the App:**
      * Use `npm run dev` in your project's terminal to start the Svelte development server.
  
  4.  **How it Works (Svelte Specifics):**
      * **`onMount` and `onDestroy`:** These are Svelte lifecycle functions. `onMount` is used to initialize the p5.js sketch when the component is added to the DOM. `onDestroy` is crucial for cleaning up the p5.js instance when the component is removed, preventing memory leaks.
      * **`bind:this={canvasContainerElement}`:** This Svelte directive binds the `div` element to the `canvasContainerElement` variable in the script. This variable is then passed to the `new p5(sketch, canvasContainerElement)` constructor so p5 knows where to create its canvas.
      * **Reactive Variables (`symmetry`, `strokeColor`, `strokeWeight`):** These are declared with `let` in the `<script>` section. Svelte automatically tracks changes to them. When you interact with the input controls (e.g., move a slider), these variables update.
      * **Binding Controls (`bind:value`):**
          * `bind:value={strokeColor}` on the color input links its value to the `strokeColor` Svelte variable.
          * Similarly for the range sliders and their respective variables.
      * **Passing Data to p5.js:** The p5 sketch function (`sketch`) is a closure. It can directly access the Svelte reactive variables (`symmetry`, `strokeColor`, `strokeWeight`) from its parent scope. This is how the p5 sketch gets the latest drawing parameters.
      * **Styling:** CSS is scoped to the component by default in Svelte (in the `<style>` block). `:global()` is used to style elements outside the component's direct scope, like the `body` or the `canvas` element created by p5.js (which is targeted via its parent `.canvas-host canvas`).
      * **Controls Layout:** The controls are now in a `position: fixed` container at the bottom of the screen for easier access, similar to many drawing applications.
  
  This Svelte version provides a more structured and maintainable way to build the interactive kaleidoscope, leveraging Svelte's reactivity and component model while integrating the powerful drawing capabilities of p5.
-->