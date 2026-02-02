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