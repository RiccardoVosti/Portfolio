let container;

// --- IMPOSTAZIONI GRIGLIA E GIOCO ---
const spacing = 40; 
let shipGridY; 
let bullets = [];
let enemies = [];
let enemyGridDir = -1; 
let lastMoveTime = 0;
let moveInterval = 400; // Gli alieni scattano ogni 0.4 secondi
let lastShotTime = 0;

function setup() {
  container = document.getElementById("javaani");
  const c = createCanvas(container.clientWidth, container.clientHeight);
  c.parent("javaani");
  textAlign(CENTER, CENTER);
  
  shipGridY = floor(height / spacing / 2);
  spawnEnemies();
}

function draw() {
  background(10); // Sfondo scuro quasi nero
  
  // 1. DISEGNO GRIGLIA DI SFONDO (Linee sottili e scure)
  stroke(30);
  strokeWeight(1);
  for (let x = 0; x <= width; x += spacing) line(x, 0, x, height);
  for (let y = 0; y <= height; y += spacing) line(0, y, width, y);

  // 2. INTERATTIVITÀ MOUSE (Navicella a scatti sulla griglia)
  if (mouseY > 0 && mouseY < height) {
    shipGridY = floor(mouseY / spacing);
  }

  // 3. LOGICA NEMICI (Sincronizzata con il tempo)
  if (millis() - lastMoveTime > moveInterval) {
    updateEnemyStep();
    lastMoveTime = millis();
  }

  // 4. SPARO AUTOMATICO (Basato sulla posizione della nave)
  if (millis() - lastShotTime > 300) {
    bullets.push({ 
      x: spacing * 1.5, 
      y: shipGridY * spacing + spacing / 2 
    });
    lastShotTime = millis();
  }

  updateBullets();
  displayGame();
}

function spawnEnemies() {
  enemies = [];
  let startCol = floor(width / spacing) - 2;
  // Creiamo un'ondata di nemici verdi a destra
  for (let i = startCol; i > startCol - 2; i--) {
    for (let j = 0; j < floor(height / spacing); j++) {
      if (random() > 0.6) { // Riempimento casuale
        enemies.push({ gridX: i, gridY: j, alive: true });
      }
    }
  }
}

function updateEnemyStep() {
  let hitEdge = false;
  for (let e of enemies) {
    if (e.alive) {
      e.gridX += enemyGridDir;
      if (e.gridX <= 1) hitEdge = true; // Se arrivano alla nave
    }
  }
  if (hitEdge) spawnEnemies(); 
}

function updateBullets() {
  for (let b of bullets) {
    b.x += 15; // Velocità proiettile orizzontale
    for (let e of enemies) {
      if (e.alive) {
        let ex = e.gridX * spacing + spacing / 2;
        let ey = e.gridY * spacing + spacing / 2;
        // Collisione precisa sulla cella
        if (dist(b.x, b.y, ex, ey) < spacing / 2) {
          e.alive = false;
          b.x = width + 100;
        }
      }
    }
  }
  bullets = bullets.filter(b => b.x < width);
}

function displayGame() {
  fill(80, 255, 0); // TUTTO VERDE BRAND
  noStroke();
  textSize(spacing * 0.8);

  // Navicella (Posizionata a sinistra, segue mouseY a scatti)
  push();
  translate(spacing / 2, shipGridY * spacing + spacing / 2);
  rotate(HALF_PI);
  text("▲", 0, 0);
  pop();

  // Proiettili
  for (let b of bullets) {
    text("-", b.x, b.y);
  }

  // Alieni (Ora Verdi)
  for (let e of enemies) {
    if (e.alive) {
      text("👾", e.gridX * spacing + spacing / 2, e.gridY * spacing + spacing / 2);
    }
  }
}

function windowResized() {
  if (container) {
    resizeCanvas(container.clientWidth, container.clientHeight);
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