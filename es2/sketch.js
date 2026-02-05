let riccardo;
let miaTexture;
let modelReady = false;

function setup() {
  frameRate(60);
  const container = document.getElementById("javaani");
  
  // (Loader logic remains the same here...)
  const centerer = document.createElement('div');
  centerer.className = 'loader-centerer';
  centerer.id = 'p5-loader';
  centerer.innerHTML = `<div class="triangle-loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
                        <div class="loading-text">Loading avatar...</div>`;
  container.appendChild(centerer);

  // Initialize Canvas
  let c = createCanvas(container.offsetWidth, container.offsetHeight, WEBGL);
  c.parent("javaani");
  c.style('display', 'block'); 
  pixelDensity(1); 

  // --- THE SYNC FIX ---
  // Manually trigger the resize logic once to set the correct perspective and aspect ratio immediately
  windowResized();

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
    // Re-measure and resize
    resizeCanvas(container.offsetWidth, container.offsetHeight);
    
    // Fix perspective to prevent stretching/clipping on resize
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
  ambientLight(80);

  // --- SPINNING LIGHT MATH ---
  // Calculates horizontal orbit (X and Z)
  let lightSpeed = frameCount * -0.05; // Negative = opposite of model
  let radius = 500;
  let lx = cos(lightSpeed) * radius;
  let lz = sin(lightSpeed) * radius;

  // Orbiting Green Lights
  pointLight(0, 255, 0, lx, 0, lz);
  pointLight(0, 255, 0, -lx, 0, -lz);

  // 3. DRAW THE MODEL
  push();
    rotateX(PI);
    rotateY(frameCount * 0.01); // Model spins the other way
    
    // Adjusted scale logic to fit the container better
    let modelScale = (height * 0.4) / 100; 
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