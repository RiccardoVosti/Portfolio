let Engine, Composite, World, Body, Bodies, Mouse, MouseConstraint, Constraint;
let font;
let engine, world;
let bodies = [];
let fallButton, resetButton;
let dynamicTextSize;
let mConstraint;






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
    frameRate(60);
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

    engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10
    });
    world = engine.world;
    world.gravity.y = 0;

    let marginX = 0;
    let marginTop = 10;

    // 1. Define Button Position
    let buttonY = marginTop + 120;
    let buttonHeight = 40; // Approximate height of your styled button

    textFont(font);
    let baseSize = 100;
    textSize(baseSize);
    let maxLineWidth = max(textWidth("Good design"), textWidth("needs structure"));
    dynamicTextSize = baseSize * ((w * 0.97) / maxLineWidth);
    textSize(dynamicTextSize);

    if (!fallButton) {
        fallButton = createButton('BOOM!');
        fallButton.mousePressed(makeItFall);
        styleButton(fallButton);
    }
    if (!resetButton) {
        resetButton = createButton('Reset');
        resetButton.mousePressed(initSketch);
        styleButton(resetButton);
    }

    resetButton.hide();
    fallButton.show();

    fallButton.position(marginX + 10, buttonY);
    resetButton.position(marginX + 10, buttonY);

    // Physics Setup
    const mouse = Mouse.create(c.elt);
    mouse.pixelRatio = pixelDensity();
    mConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.08,
            damping: 0.1,
            render: {
                visible: false
            }
        }
    });
    World.add(world, mConstraint);

    // 2. NEW CALCULATION FOR TEXT POSITION
    // Convert screen Y to WEBGL Y (subtract h/2) and add the 50px offset
    let startX = -w / 2 + marginX + 10;
    let relativeGap = dynamicTextSize/2.7;
    let textStartY = (buttonY + buttonHeight + relativeGap) - (h / 2);

    // Create Phrases
    createStaticPhrase("Good design", textStartY, startX);
    createStaticPhrase("needs structure", textStartY + (dynamicTextSize * 0.9), startX);

    // Boundaries
    let thickness = 400;
    let floor = Bodies.rectangle(0, h / 2 + thickness / 2, w * 5, thickness, {
        isStatic: true
    });
    let leftWall = Bodies.rectangle(-w / 2 - thickness / 2, 0, thickness, h * 5, {
        isStatic: true
    });
    let rightWall = Bodies.rectangle(w / 2 + thickness / 2, 0, thickness, h * 5, {
        isStatic: true
    });

    World.add(world, [floor, leftWall, rightWall]);
}





function draw() {
    background(0, 255, 0);

    // Adjust mouse for WEBGL center origin
    let mX = mouseX - width / 2;
    let mY = mouseY - height / 2;
    mConstraint.mouse.position.x = mX;
    mConstraint.mouse.position.y = mY;

    Engine.update(engine);

    // Cursor logic
    let isOverAny = false;
    if (mConstraint.body) {
        cursor('grabbing');
    } else {
        for (let b of bodies) {
            if (Matter.Bounds.contains(b.body.bounds, {
                    x: mX,
                    y: mY
                })) {
                isOverAny = true;
                break;
            }
        }
        isOverAny ? cursor('grab') : cursor(ARROW);
    }

    for (let b of bodies) {
        b.show();
    }
}






function createStaticPhrase(phrase, yPos, startX) {
    let currentX = startX;
    textSize(dynamicTextSize); // Ensure correct size for textWidth
    for (let i = 0; i < phrase.length; i++) {
        let char = phrase[i];
        let charW = textWidth(char);
        if (char !== " ") {
            // Calculate center of the character
            let xPos = currentX + charW / 2;
            let newLetter = new Letter(world, xPos, yPos, char, dynamicTextSize);
            bodies.push(newLetter);
        }
        currentX += charW;
    }
}





class Letter {
    constructor(world, x, y, char, size) {
        this.char = char;
        textSize(size);

        // --- MODIFIED HITBOX BOUNDARIES ---
        // boxW is slightly reduced to prevent the "snagging" that causes overlaps
        let boxW = textWidth(char) * 0.85;
        let boxH = size * 0.85;

        this.body = Bodies.rectangle(x, y, boxW, boxH, {
            restitution: 0.2, // Lower bounce prevents letters from clipping through on impact
            friction: 0.2,
            slop: 0.05, // Small buffer to allow engine to resolve overlaps better
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
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(dynamicTextSize);
        text(this.char, 0, 0);
        pop();
    }
}





function makeItFall() {
    world.gravity.y = 1.8;
    fallButton.hide();
    resetButton.show();
    for (let b of bodies) {
        Body.setStatic(b.body, false);
        Body.applyForce(b.body, b.body.position, {
            x: random(-0.02, 0.02),
            y: -0.05
        });
        Body.setAngularVelocity(b.body, random(-0.1, 0.1));
    }
}





function styleButton(btn) {
    // Initial State (Normal)
    btn.style('background-color', 'transparent'); // Transparent background
    btn.style('color', '#000000'); // Black text
    btn.style('border', '2px solid #000000'); // Black stroke (outline)

    // Shared Styles
    btn.style('font-family', 'Neue-Montreal, sans-serif');
    btn.style('font-size', '24px');
    btn.style('padding', '5px 15px');
    btn.style('border-radius', '50px');
    btn.style('cursor', 'pointer');
    // Smooth transition

    // Hover State
    btn.mouseOver(() => {
        btn.style('background-color', '#000000'); // Black background
        btn.style('color', '#00ff00'); // Green text
    });

    // Return to Normal State
    btn.mouseOut(() => {
        btn.style('background-color', 'transparent');
        btn.style('color', '#000000');
        btn.style('border', '2px solid #000000');
    });
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