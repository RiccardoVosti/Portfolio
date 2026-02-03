let riccardo;
let miaTexture;

function preload() {
  riccardo = loadModel('Riccardo.obj', true);
  miaTexture = loadImage('Riccardo.jpg');
}

function setup() {
  const container = document.getElementById("javaani");
  const w = container ? container.clientWidth : windowWidth;
  const h = container ? container.clientHeight : windowHeight;

  const c = createCanvas(w, h, WEBGL);
  if (container) c.parent("javaani");


}

function draw() {


  background(10); // Sfondo molto scuro per far risaltare il verde

  //orbitControl();

  // --- SET LUCI ---

  // 1. Luce Ambientale (morbida e soffusa per non avere ombre nere totali)
  ambientLight(80);

  // 2. Luce Frontale Morbida (Bianca)
  // Direzione: verso il modello (0, 0, -1)
  directionalLight(200, 200, 200, 0, 0, -1);

  // 3. Rim Light Verde (Posizionata dietro e lateralmente)
  // Sintassi: color(R, G, B), posizione(X, Y, Z)
  // X: -500 (sinistra), Y: -500 (alto), Z: -500 (dietro il modello)
  pointLight(0, 255, 0, -500, -500, -500);
  // Enfatizzare il contorno
  pointLight(0, 255, 0, 500, 500, -500);



  push();
  // Orientamento e rotazione automatica
  rotateX(PI);
  rotateY(frameCount * 0.01);

  scale(2.5);
  noStroke();

    texture(miaTexture);
    textureMode(NORMAL);
  
  
  

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