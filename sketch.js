let container;

function setup() {
  container = document.getElementById("javaani");

  const c = createCanvas(
    container.clientWidth,
    container.clientHeight
  );
  c.parent("javaani");

  textAlign(CENTER, CENTER);

}


function draw() {
  background(10);
  stroke(30);
  noFill();

}


function windowResized() {
  resizeCanvas(
    container.clientWidth,
    container.clientHeight
  );
 
}


