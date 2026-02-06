let points = [];
let container;
const cellSize = 8;
let scrollX = 0;

function setup() {
  container = document.getElementById("javaani");

  // We create a canvas, but we'll resize it immediately to be safe
  const c = createCanvas(10, 10); 
  c.parent("javaani");

  // Call a custom resize function to snap it to the container
  handleInitialResize();
}

function handleInitialResize() {
  if (container) {
    // OffsetWidth/Height are the most reliable for Flexbox containers
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    
    resizeCanvas(w, h);
    inizializzaTesto();
  }
}

// Ensure it snaps again once the entire window (CSS, Fonts, etc.) is loaded
window.addEventListener('load', () => {
  handleInitialResize();
});

function windowResized() {
  // Re-measure the container accurately
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  
  resizeCanvas(w, h);
  
  // Re-calculate the points based on the new dimensions
  inizializzaTesto();
}

function inizializzaTesto() {
  points = [];
  let pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0);
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);

  pg.push();
  pg.translate(width / 2, height / 1.7);
  
  // 1. HORIZONTAL SIZE: Adjust the width/7 to width/6.5 if you want it wider
  let fontBaseSize = width / 7; 
  pg.textSize(fontBaseSize);
  
  // 2. VERTICAL MARGIN: Change this value (in pixels) to increase/decrease the gap
  let verticalMargin = 50; 
  let availableHeight = height - (verticalMargin * 2);

  // 3. STRETCH CALCULATION:
  // This forces the text height to equal the available height
  // The 0.7 offset accounts for the natural whitespace in font glyphs
  let stretchY = availableHeight / (fontBaseSize * 0.7);
  
  pg.scale(1.0, stretchY);
  
  pg.text("SMIRKSTUDIO", 0, 0);
  pg.pop();

  pg.loadPixels();
  
  for (let x = 0; x < width; x += cellSize) {
    for (let y = 0; y < height; y += cellSize) {
      let index = (x + y * width) * 4;
      if (pg.pixels[index] > 128) {
        points.push({ x: x, y: y });
      }
    }
  }
  pg.remove();
}

function draw() {
  background(5, 10, 5);

  // Background Grid
  stroke(0, 40, 0);
  strokeWeight(1);
  for (let x = 0; x <= width; x += cellSize) line(x, 0, x, height);
  for (let y = 0; y <= height; y += cellSize) line(0, y, width, y);

  if (frameCount % 4 === 0) {
    scrollX += cellSize;
  }

  noStroke();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    // Responsive position: modulo current width to keep it on screen
    let renderX = (p.x + scrollX) % width;
    let renderY = p.y;

    let d = dist(mouseX, mouseY, renderX, renderY);
    let offsetX = 0;
    let offsetY = 0;

    if (d < 100) {
      let force = map(d, 0, 200, 20, 0);
      let nX = noise(p.x * 0.05, frameCount * 0.2);
      let nY = noise(p.y * 0.05, frameCount * 0.1 + 100);

      offsetX = round(map(nX, 0, 1, -force, force)) * cellSize;
      offsetY = round(map(nY, 0, 1, -force, force)) * cellSize;
    }

    let finalX = renderX + offsetX;
    let finalY = renderY + offsetY;

    fill(0, 255, 70, 50);
    rect(finalX, finalY, cellSize, cellSize);

    fill(0, 255, 0);
    rect(finalX + 1, finalY + 1, cellSize - 2, cellSize - 2);
  }
}

// Hacker Effect logic remains the same
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a,.logotesto");
  const GLYPHS = "X#%&@$01+-*/<>[]{}☺";

  links.forEach((link) => {
    const originalText = link.innerText;
    let interval = null;
    link.addEventListener("mouseenter", () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        link.innerText = originalText.split("").map((l, i) => {
          if (i < iteration) return originalText[i];
          if (l === " ") return " ";
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join("");
        if (iteration >= originalText.length) clearInterval(interval);
        iteration += 1;
      }, 40);
    });
    link.addEventListener("mouseleave", () => {
      clearInterval(interval);
      link.innerText = originalText;
    });
  });
});