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
  calculateGrid();
}


const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";

document.querySelectorAll("a").forEach(link => {
  const originalText = link.textContent;
  const letters = originalText.split("");

  // sostituisce il testo con span
  link.textContent = "";
  const spans = letters.map(letter => {
    const span = document.createElement("span");
    span.textContent = letter;
    link.appendChild(span);
    return span;
  });

  let animating = false;

  link.addEventListener("mouseenter", () => {
    if (animating) return;
    animating = true;

    spans.forEach((span, i) => {
      let iterations = 0;

      const interval = setInterval(() => {
        span.textContent =
          chars[Math.floor(Math.random() * chars.length)];

        iterations++;

        if (iterations > 5) {
          span.textContent = letters[i];
          clearInterval(interval);

          if (i === spans.length - 1) {
            animating = false;
          }
        }
      }, 25 + i * 15); // ← ordered offset
    });
  });

});
