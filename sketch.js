let points = [];
let container;
const cellSize =8;
let scrollX = 0;

function setup() {
  container = document.getElementById("javaani");
  let w = container ? container.clientWidth : 800;
  let h = container ? container.clientHeight : 400;

  const c = createCanvas(w, h);
  c.parent("javaani");

  inizializzaTesto();
}

function inizializzaTesto() {
  points = [];
  let pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0);
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);

  // Stretch verticale per occupare tutto il canvas
  pg.push();
  pg.translate(width / 2, height/1.7);
  let fontBaseSize = width / 7;
  pg.textSize(fontBaseSize);
  let stretchY = height / (fontBaseSize * 0.8);
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

  // 1. Disegno della griglia di sfondo
  stroke(0, 40, 0);
  strokeWeight(1);
  for (let x = 0; x <= width; x += cellSize) line(x, 0, x, height);
  for (let y = 0; y <= height; y += cellSize) line(0, y, width, y);

  // 2. Movimento a scatti (Ticker speed)
  if (frameCount % 4 === 0) {
    scrollX += cellSize;
  }

  // 3. Disegno dei pixel con interazione Noise
  noStroke();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    // Posizione di base calcolata con lo scorrimento
    let renderX = (p.x + scrollX) % width;
    let renderY = p.y;

    // --- LOGICA INTERAZIONE MOUSE + NOISE ---
    let d = dist(mouseX, mouseY, renderX, renderY);
    let offsetX = 0;
    let offsetY = 0;

    // Se il mouse è vicino (raggio 150px), calcola la distorsione
    if (d < 200) {
      // Forza dell'effetto basata sulla vicinanza
      let force = map(d, 0, 200, 20, 0);

      // Usiamo il noise di p5 per un movimento organico ma "grigliato"
      // L'uso di round() * cellSize costringe il pixel a restare nei binari della griglia
      let nX = noise(p.x * 0.05, frameCount * 0.2);
      let nY = noise(p.y * 0.05, frameCount * 0.1 + 100);

      offsetX = round(map(nX, 0, 1, -force, force)) * cellSize;
      offsetY = round(map(nY, 0, 1, -force, force)) * cellSize;
    }

    let finalX = renderX + offsetX;
    let finalY = renderY + offsetY;

    // Disegno del Pixel LED
    // Glow esterno
    fill(0, 255, 70, 50);
    rect(finalX, finalY, cellSize, cellSize);

    // Core del pixel
    // Se il pixel è "disturbato" dal mouse, diventa leggermente più luminoso
    if (d < 150) fill(0, 255, 0);
    else fill(0, 255, 0);
    
    rect(finalX + 1, finalY + 1, cellSize - 2, cellSize - 2);
  }
}

// --- LOGICA TESTO NAVIGAZIONE (Hacker Effect sui link) ---
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