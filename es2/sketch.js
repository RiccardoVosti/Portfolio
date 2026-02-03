let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // Carichiamo il modello FaceMesh di ml5
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  describe('Video capture with head tracking and filters.');
  createCanvas(720, 400);

  // Inizializzazione webcam
  capture = createCapture(VIDEO);
  capture.size(720, 400);
  capture.hide();

  // Avvia il rilevamento della faccia
  faceMesh.detectStart(capture, gotFaces);
  
  textFont('Courier New'); // Font monospaziato per dati più leggibili
}

function draw() {
  background(51);

  // Disegniamo il video
  image(capture, 0, 0, 720, 400);

  // Applichiamo i tuoi filtri
  filter(INVERT);
  filter(GRAY);
  filter(POSTERIZE, 15);

  // Se viene rilevata una faccia, estraiamo i dati
  if (faces.length > 0) {
    let face = faces[0];
    // Usiamo il punto 0 (naso/centro faccia)
    let nose = face.keypoints[0];
    
    let xPos = Math.round(nose.x);
    let yPos = Math.round(nose.y);

    // --- VISUALIZZAZIONE DATI ---
    
    // 1. Disegniamo un mirino sulla testa
    stroke(0, 255, 0); // Verde acceso per contrastare con il filtro GRAY
    strokeWeight(2);
    noFill();
    line(xPos - 10, yPos, xPos + 10, yPos);
    line(xPos, yPos - 10, xPos, yPos + 10);
    ellipse(xPos, yPos, 25, 25);

    // 2. Box con i dati scritti (in alto a sinistra)
    resetMatrix(); // Assicura che il testo non sia influenzato da trasformazioni
    noStroke();
    fill(0, 200); // Sfondo scuro semitrasparente
    rect(10, 10, 180, 70, 5);
    
    fill(0, 255, 0); // Testo verde "Matrix style"
    textSize(14);
    text("HEAD TRACKING ACTIVE", 20, 30);
    
    textSize(18);
    fill(255);
    text(`COORD X: ${xPos}`, 20, 50);
    text(`COORD Y: ${yPos}`, 20, 70);
  }
}

// Callback per aggiornare i risultati del tracking
function gotFaces(results) {
  faces = results;
}