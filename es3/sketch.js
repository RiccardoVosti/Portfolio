let Engine, Composite, World, Body, Bodies, Mouse, MouseConstraint, Constraint;
let font;
let engine, world;
let bodies = [];
let fallButton, resetButton;
let dynamicTextSize;
let mConstraint; // The magic link for grabbing

function preload() {
  Engine = Matter.Engine;
  Composite = Matter.Composite;
  World = Matter.World;
  Bodies = Matter.Bodies;
  Body = Matter.Body;
  Mouse = Matter.Mouse;
  MouseConstraint = Matter.MouseConstraint;
  Constraint = Matter.Constraint;
  font = loadFont('NeueMontreal-Medium.otf');
}

function setup() {
  initSketch();
}

function initSketch() {
  if (engine) {
    World.clear(engine.world);
    Engine.clear(engine);
    bodies = [];
  }

  const container = document.getElementById("javaani");
  const w = container ? container.clientWidth : windowWidth;
  const h = container ? container.clientHeight : windowHeight;

  const c = createCanvas(w, h, WEBGL);
  if (container) c.parent("javaani");

  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0;

  // --- 85% Width Scaling ---
  textFont(font);
  let baseSize = 100;
  textSize(baseSize);
  let maxLineWidth = max(textWidth("Good design"), textWidth("Need structure"));
  dynamicTextSize = baseSize * ((w * 0.85) / maxLineWidth);
  textSize(dynamicTextSize);
  textAlign(CENTER, CENTER);

  // --- Mouse Setup for Grabbing ---
  // We must map the p5 canvas to Matter.js mouse
  const mouse = Mouse.create(c.elt);
  
  // Custom pixel ratio for high-density screens (Retina)
  mouse.pixelRatio = pixelDensity();

  mConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1, // Lower = more "swing" and stretch
      damping: 0.1,    // Adds a little organic weight
      render: { visible: false }
    }
  });

  // This ensures the mouse works correctly in WEBGL (remapping center 0,0)
  mConstraint.mouse.pixelRatio = pixelDensity();

  World.add(world, mConstraint);

  // --- Buttons ---
  if (!fallButton) {
    fallButton = createButton('BREAK STRUCTURE');
    fallButton.mousePressed(makeItFall);
    styleButton(fallButton);
  }
  if (!resetButton) {
    resetButton = createButton('RESET');
    resetButton.mousePressed(initSketch);
    styleButton(resetButton);
  }

  resetButton.hide();
  fallButton.show();
  centerButton(fallButton, w, 130);

  createStaticPhrase("Good design", -dynamicTextSize * 0.5); 
  createStaticPhrase("Need structure", dynamicTextSize * 0.5);

  let thickness = 400;
  let floor = Bodies.rectangle(0, h/2 + thickness/2, w * 5, thickness, { isStatic: true });
  let leftWall = Bodies.rectangle(-w/2 - thickness/2, 0, thickness, h * 5, { isStatic: true });
  let rightWall = Bodies.rectangle(w/2 + thickness/2, 0, thickness, h * 5, { isStatic: true });

  World.add(world, [floor, leftWall, rightWall]);
}

function makeItFall() {
  const container = document.getElementById("javaani");
  const w = container ? container.clientWidth : windowWidth;

  world.gravity.y = 1.8; 
  fallButton.hide();
  resetButton.show();
  centerButton(resetButton, w, 130);
  
  for (let b of bodies) {
    Body.setStatic(b.body, false);
    // Initial break is now subtler
    Body.setAngularVelocity(b.body, random(-0.05, 0.05)); 
    Body.applyForce(b.body, b.body.position, {
      x: random(-0.02, 0.02), 
      y: 0
    });
  }
}

function draw() {
  background(0);

  // Remap mouse for WEBGL coordinate system so the constraint knows where we are
  // WEBGL (0,0) is center, Matter.js mouse (0,0) is top-left
  let mX = mouseX - width / 2;
  let mY = mouseY - height / 2;
  
  // Inject the remapped coordinates into the Matter mouse
  mConstraint.mouse.position.x = mX;
  mConstraint.mouse.position.y = mY;

  Engine.update(engine);

  for (let b of bodies) {
    b.show();
  }
}

// --- Helpers ---
function centerButton(btn, canvasWidth, yPos) {
  let btnWidth = btn.elt.offsetWidth;
  btn.position(canvasWidth / 2 - btnWidth / 2, yPos);
}

function styleButton(btn) {
  btn.style('background-color', '#00ff00');
  btn.style('color', '#000000');
  btn.style('font-family', 'Neue Montreal, sans-serif');
  btn.style('font-size', '16px');
  btn.style('padding', '12px 24px');
  btn.style('border', 'none');
  btn.style('border-radius', '50px');
  btn.style('cursor', 'pointer');
}

function createStaticPhrase(phrase, yOffset) {
  let currentX = -textWidth(phrase) / 2;
  for (let i = 0; i < phrase.length; i++) {
    let char = phrase[i];
    let charW = textWidth(char);
    if (char !== " ") {
      let xPos = currentX + charW / 2;
      let newLetter = new Letter(world, xPos, yOffset, char, dynamicTextSize);
      bodies.push(newLetter);
    }
    currentX += charW; 
  }
}

class Letter {
  constructor(world, x, y, char, size) {
    this.char = char;
    let boxW = textWidth(char) * 0.9; 
    let boxH = size * 0.75; 
    this.body = Bodies.rectangle(x, y, boxW, boxH, {
      restitution: 0.4,
      friction: 0.3,
      isStatic: true 
    });
    World.add(world, this.body);
  }
  show() {
    let pos = this.body.position;
    let angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotateZ(angle);
    fill(0, 255, 0); 
    noStroke();
    text(this.char, 0, 0); 
    pop();
  }
}

function windowResized() {
  initSketch();
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