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


document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");
  const glyphs = "☻☺✸✦✶✱→✚⚇⚉"; 

  // --- IMPOSTAZIONI VELOCITÀ ---
  const REFRESH_RATE = 30;   // Velocità del "flicker" dei simboli (in millisecondi). Più basso = più frenetico.
  const REVEAL_SPEED = 0.9; // Velocità di ritorno del testo originale. Più alto = più veloce (es. 0.5 è veloce, 0.1 è lentissimo).
  // -----------------------------

  links.forEach((link) => {
    const originalText = link.innerText;
    let interval = null;

    link.addEventListener("mouseenter", () => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        link.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            if (letter === " ") return " ";
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }

        // Qui usiamo la variabile per controllare la velocità di rivelazione
        iteration += REVEAL_SPEED; 
      }, REFRESH_RATE); // Qui usiamo la variabile per il refresh dei simboli
    });

    link.addEventListener("mouseleave", () => {
      clearInterval(interval);
      link.innerText = originalText;
    });
  });
});