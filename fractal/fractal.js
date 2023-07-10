// Initialize canvas
const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// Function to draw the fractal
function drawFractal(x, y, size) {
  if (size <= 1) {
    ctx.fillRect(x, y, 1, 1);
  } else {
    const newSize = size / 3;
    drawFractal(x, y, newSize); // Top-left square
    drawFractal(x + newSize, y, newSize); // Top-middle square
    drawFractal(x + 2 * newSize, y, newSize); // Top-right square
    drawFractal(x, y + newSize, newSize); // Middle-left square
    drawFractal(x + 2 * newSize, y + newSize, newSize); // Middle-right square
    drawFractal(x, y + 2 * newSize, newSize); // Bottom-left square
    drawFractal(x + newSize, y + 2 * newSize, newSize); // Bottom-middle square
    drawFractal(x + 2 * newSize, y + 2 * newSize, newSize); // Bottom-right square
  }
}

// Clear the canvas
ctx.clearRect(0, 0, width, height);

// Set initial position and size
const initialX = 0;
const initialY = 0;
const initialSize = Math.min(width, height);

// Call the drawFractal function
drawFractal(initialX, initialY, initialSize);
