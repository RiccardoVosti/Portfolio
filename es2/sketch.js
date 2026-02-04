let riccardo;
let miaTexture;
let modelReady = false;







function setup() {
  const container = document.getElementById("javaani");
  
  // 1. Create the master unit (Static, handles centering)
  const centerer = document.createElement('div');
  centerer.className = 'loader-centerer';
  centerer.id = 'p5-loader';

  // 2. Inject the spinning triangle and the pulsing dots
  // Note: We use spans for dots to trigger the sequence animation
  centerer.innerHTML = `
    <div class="triangle-loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <div class="loading-text">
      Loading avatar<span class="dot-anim">.</span><span class="dot-anim">.</span><span class="dot-anim">.</span>
    </div>
  `;
  



  container.appendChild(centerer);

  // 3. Canvas Setup
  const w = container ? container.clientWidth : windowWidth;
  const h = container ? container.clientHeight : windowHeight;
  let c = createCanvas(w, h, WEBGL);
  if (container) c.parent("javaani");

  // 4. Asset Loading
  riccardo = loadModel('Riccardo.obj', true, () => {
    miaTexture = loadImage('Riccardo.jpg', () => {
      // Once loaded, remove the loader
      const loaderElem = document.getElementById('p5-loader');
      if (loaderElem) loaderElem.remove();
      modelReady = true;
    });
  });
}






function windowResized() {
  const container = document.getElementById("javaani");
  if (container) {
    // Get the new width and height of the container
    const w = container.clientWidth;
    const h = container.clientHeight;
    
    // Resize the p5 canvas to match
    resizeCanvas(w, h);
  }
}








function draw() {
  background(0);

  if (modelReady) {
    renderScene();
  }
}







function renderScene() {
  // 1. STATIC LIGHTING (Remains fixed while model spins)
  ambientLight(50); // Lowered slightly to make the green pop
  
  // Frontal white light for visibility
  directionalLight(150, 150, 150, 0, 0, -1);

  // --- GREEN SPOTLIGHT: BEHIND AND HIGHER ---
  // Position: x=0 (centered), y=-600 (very high), z=-500 (deep behind model)
  // Direction: x=0, y=1 (pointing down), z=0.8 (pointing forward towards model)
  let spotX = 0;
  let spotY = -600; 
  let spotZ = -500;
  
  spotLight(
    0, 255, 0,               // Color: Pure Green
    spotX, spotY, spotZ,     // Position
    0, 1, 0.8,               // Direction (Down and Forward)
    PI / 3,                  // Angle of the cone (60 degrees)
    25                      // Concentration (Higher = sharper focus)
  );

  // 2. MODEL TRANSFORMATIONS
  push(); 
    rotateX(PI); 
    rotateY(frameCount * 0.01); 
    scale(2.5);
    noStroke();
    
    if (miaTexture) {
      texture(miaTexture);
    }
    
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