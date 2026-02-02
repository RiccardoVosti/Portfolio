let container;

function setup() {
  container = document.getElementById("javaani");

  const canvas = createCanvas(container.clientWidth, innerHeight/100*86);
  canvas.parent("javaani");
}

function draw() {
  background(20);
  fill(255);
  
}

function windowResized() {
  resizeCanvas(container.clientWidth, innerHeight/100*86);
}
