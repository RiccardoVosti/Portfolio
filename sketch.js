let points = [];
let container;
const cellSize = 10;
let scrollX = 0; // Variabile per lo scorrimento

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
  pg.translate(width / 2, height / 2);
  let fontBaseSize = width / 7;
  pg.textSize(fontBaseSize);
  // Rapporto di stretch basato sull'altezza del canvas
  let stretchY = height / (fontBaseSize * 0.9);
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

  // 1. Disegno della griglia
  stroke(0, 40, 0); 
  strokeWeight(1);
  for (let x = 0; x <= width; x += cellSize) line(x, 0, x, height);
  for (let y = 0; y <= height; y += cellSize) line(0, y, width, y);

  // 2. Movimento "A BLOCCO" (Snap Movement)
  // Cambia il valore '10' per regolare la velocità: 
  // più alto è il numero, più lenta è l'animazione.
  if (frameCount % 10 === 0) {
    scrollX += cellSize; 
  }

  // 3. Disegno dei pixel
  noStroke();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    // Calcolo posizione con modulo per il loop
    // Ora renderX sarà SEMPRE un multiplo di cellSize
    let renderX = (p.x + scrollX) % width;
    let renderY = p.y;

    // Effetto LED Retro
    fill(0, 255, 70, 50); // Glow
    rect(renderX, renderY, cellSize, cellSize); 
    
    fill(0, 255, 0); // Pixel pieno
    rect(renderX + 1, renderY + 1, cellSize - 2, cellSize - 2);
  }
}







// --- LOGICA TESTO NAVIGAZIONE ---
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