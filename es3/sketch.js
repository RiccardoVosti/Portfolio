let engine, world, mConstraint;
let letters = [];
let font;
let section;
let btnBoom, btnReset;
let ground, wallLeft, wallRight, ceiling;

const paddingLeft = 10; // Increased slightly so letters don't spawn inside the 10px wall
const verticalGap = 0.85;

function preload() {
  font = loadFont('NeueMontreal-Medium.otf');
}

function setup() {
  // 1. INJECT CSS INTO THE PAGE HEAD
  const style = document.createElement('style');
  style.innerHTML = `
   
    #javaani {
      width: 100%;
      height: calc(100vh - 145px);
      position: relative;
      display: block;
      overflow: hidden;
    }
    canvas {
      display: block;
    }
    /* Hover logic - Black background, Green text, Instant swap */
    .dynamic-button:hover {
      background-color: #000 !important;
      color: #00FF00 !important;
      border-color: #000 !important;
    }
  `;
  document.head.appendChild(style);

  section = select('#javaani');
  let canvasWidth = section.elt.offsetWidth;
  let canvasHeight = section.elt.offsetHeight;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('javaani');

  engine = Matter.Engine.create();
  world = engine.world;

  createBoundaries();

  let canvasMouse = Matter.Mouse.create(canvas.elt);
  canvasMouse.pixelRatio = pixelDensity(); 
  mConstraint = Matter.MouseConstraint.create(engine, {
    mouse: canvasMouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
  });
  Matter.World.add(world, mConstraint);

  btnBoom = createButton('BOOM!');
  applyButtonStyle(btnBoom);
  btnBoom.mousePressed(explodeText);

  btnReset = createButton('Reset');
  applyButtonStyle(btnReset);
  btnReset.hide();
  btnReset.mousePressed(resetText);

  initText();
}

function applyButtonStyle(btn) {
  btn.parent('javaani');
  btn.addClass('dynamic-button');
  btn.position(10, 5); // Adjusted slightly to clear the 10px top/left boundaries
  
  btn.style('font-family', 'NeueMontreal-Medium, sans-serif');
  btn.style('font-size', '24px');
  btn.style('padding', '8px 20px');
  btn.style('background', 'transparent');
  btn.style('color', '#000');
  btn.style('border', '2px solid #000');
  btn.style('border-radius', '50px');
  btn.style('cursor', 'pointer');
  btn.style('z-index', '999');
  btn.style('transition', 'none'); 
}

function initText() {
  letters.forEach(l => Matter.World.remove(world, l));
  letters = [];

  let line1 = "Good design";
  let line2 = "needs structure";
  
  textFont(font);
  textSize(100);
  let maxW = max(textWidth(line1), textWidth(line2));
  let finalFontSize = 100 * ((width - paddingLeft * 2) / maxW);
  
  let totalBlockHeight = finalFontSize * (1 + verticalGap);

  // ADJUSTED START Y:
  // We calculate the button area (~60px) + 50px buffer = 110px.
  // We ensure startY is at least 110px or 1/4 of the height, whichever is greater.
  let buttonSafeZone = 110; 
  let desiredStart = (height * 0.25); 
  let startY = max(buttonSafeZone, desiredStart);

  setupLetterBodies(line1, paddingLeft, startY, finalFontSize);
  setupLetterBodies(line2, paddingLeft, startY + (finalFontSize * verticalGap), finalFontSize);
}

function createBoundaries() {
  if (ground) Matter.World.remove(world, [ground, wallLeft, wallRight, ceiling]);
  
  let t = 500; 
  
  // 1. Calculate a proportional gap
  let proportionalGap = width * 0.03; 
  
  // 2. CLAMP the gap: Minimum 10px, Maximum 40px
  // This prevents it from disappearing on mobile or being huge on desktop
  let gap = constrain(proportionalGap, 10, 40); 

  // Bottom (Floor)
  ground = Matter.Bodies.rectangle(width/2, (height - gap) + t/2, width, t, { 
    isStatic: true, friction: 0.8 
  });
  
  // Top (Ceiling)
  ceiling = Matter.Bodies.rectangle(width/2, gap - t/2, width, t, { isStatic: true });
  
  // Left Wall
  wallLeft = Matter.Bodies.rectangle(gap - t/2, height/2, t, height, { isStatic: true });
  
  // Right Wall
  wallRight = Matter.Bodies.rectangle((width - gap) + t/2, height/2, t, height, { isStatic: true });

  Matter.World.add(world, [ground, ceiling, wallLeft, wallRight]);
}

function setupLetterBodies(str, startX, centerY, fontSize) {
  textSize(fontSize);
  let currentX = startX;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let charW = textWidth(char);
    if (char !== ' ') {
      let body = Matter.Bodies.rectangle(
        currentX + charW / 2, 
        centerY, 
        charW * 0.7, 
        fontSize * 0.75, 
        { isStatic: true, friction: 0.8, restitution: 0.5 }
      );
      body.char = char;
      body.size = fontSize;
      body.originalPos = { x: body.position.x, y: body.position.y };
      body.originalAngle = body.angle;
      letters.push(body);
      Matter.World.add(world, body);
    }
    currentX += charW;
  }
}

function explodeText() {
  btnBoom.hide();
  btnReset.show();
  letters.forEach(body => {
    Matter.Body.setStatic(body, false);
    Matter.Body.applyForce(body, body.position, {
      // Made force lighter (changed from 0.05/0.15 to 0.02/0.08)
      x: random(-0.02, 0.02) * body.mass,
      y: random(-0.08, -0.04) * body.mass
    });
  });
}

function resetText() {
  btnReset.hide();
  btnBoom.show();
  letters.forEach(body => {
    Matter.Body.setStatic(body, true);
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(body, 0);
    Matter.Body.setPosition(body, { x: body.originalPos.x, y: body.originalPos.y });
    Matter.Body.setAngle(body, body.originalAngle);
  });
}

function draw() {
  background(0, 255, 0); // Green background

  // --- HIGH PRECISION PHYSICS LOOP ---
  // On full screens, letters move more pixels per frame. 
  // Sub-stepping (running the engine 2+ times) prevents clipping.
  let subSteps = 2; 
  for (let i = 0; i < subSteps; i++) {
    // We divide the normal frame time (1000/60) by the number of steps
    Matter.Engine.update(engine, (1000 / 60) / subSteps);
  }
  // ------------------------------------

  // Handle Cursor States
  if (mConstraint.body) {
    cursor('grabbing');
  } else {
    let h = false;
    for (let b of letters) {
      if (Matter.Query.point([b], { x: mouseX, y: mouseY }).length > 0) {
        h = true; 
        break;
      }
    }
    h ? cursor('grab') : cursor(ARROW);
  }

  // Draw the Letters
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(font);

  for (let body of letters) {
    push();
    translate(body.position.x, body.position.y);
    rotate(body.angle);
    textSize(body.size);
    text(body.char, 0, 0);
    pop();
  }
}

function windowResized() {
  let canvasWidth = section.elt.offsetWidth;
  let canvasHeight = section.elt.offsetHeight;
  resizeCanvas(canvasWidth, canvasHeight);
  createBoundaries();
  initText();
  btnReset.hide();
  btnBoom.show();
}