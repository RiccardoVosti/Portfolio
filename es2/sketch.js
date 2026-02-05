let riccardo;
let miaTexture;
let modelReady = false;

function setup() {
  frameRate(60);
  const container = document.getElementById("javaani");
  
  // Create Loader (same as your previous logic)
  const centerer = document.createElement('div');
  centerer.className = 'loader-centerer';
  centerer.id = 'p5-loader';
  centerer.innerHTML = `
    <div class="triangle-loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
    <div class="loading-text">Loading avatar<span class="dot-anim">.</span><span class="dot-anim">.</span><span class="dot-anim">.</span></div>
  `;
  container.appendChild(centerer);

  // Measure container width/height correctly
  const w = container.clientWidth;
  const h = container.clientHeight;
  
  let c = createCanvas(w, h, WEBGL);
  c.parent("javaani");

  pixelDensity(1); 

  riccardo = loadModel('Riccardo.obj', true, () => {
    miaTexture = loadImage('Riccardo.jpg', () => {
      const loaderElem = document.getElementById('p5-loader');
      if (loaderElem) loaderElem.remove();
      modelReady = true;
    });
  });
}





function windowResized() {
  const container = document.getElementById("javaani");
  if (container) {
    resizeCanvas(container.clientWidth, container.clientHeight);
    let aspect = width / height;
    perspective(PI / 3, aspect, 0.1, 10000);
  }
}







function draw() {
  clear ();

  if (modelReady) {
    renderScene();
  }
}






function renderScene() {


  // 1. Basic visibility
  ambientLight(60); 
  directionalLight(200, 200, 200, 0, 0, -1);

  // 2. THE GREEN GLOW (Rim Light)
  // Positioned at Z: -500 (Behind the model)
  // We add two to create a wide wash of light
  pointLight(0, 255, 0, -200, 0, -500); 
  pointLight(0, 255, 0, 200, 0, -500);

  push();
    rotateX(PI);
    rotateY(frameCount * 0.01);
    
    let modelScale = (height * 0.35) / 100; 
    scale(modelScale); 
    
    noStroke();
    if (miaTexture) texture(miaTexture);
    model(riccardo);
  pop();
}






function renderScene() {
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, -1);
  pointLight(0, 255, 0, -500, -500, -500);
  pointLight(0, 255, 0, 500, 500, -500);

  push();
  rotateX(PI);
  rotateY(frameCount * 0.01);
  scale(2.5);
  noStroke();
  texture(miaTexture);
  model(riccardo);
  pop();
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