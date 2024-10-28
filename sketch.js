let anchoCanvas, altoCanvas;

let jugadorX = 15;
let jugadorY;
let anchoRaqueta;
let altoRaqueta;

let computadoraX;
let computadoraY;

let pelotaX, pelotaY;
let diametroPelota;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;
let anguloPelota = 0;

let grosorMarco = 10;

let jugadorScore = 0;
let computadoraScore = 0;

let fondo;
let barraJugador;
let barraComputadora;
let bola;
let sonidoRebote;
let sonidoGol;

function preload() {
    fondo = loadImage('fondo1.png');
    barraJugador = loadImage('barra1.png');
    barraComputadora = loadImage('barra2.png');
    bola = loadImage('bola.png');
    sonidoRebote = loadSound('./bounce.wav');
    sonidoGol = loadSound('./jingle_win_synth_02.wav');
}

function setup() {
    // Dimensionar el canvas al tamaño de la ventana
    anchoCanvas = windowWidth * 0.9;
    altoCanvas = windowHeight * 0.7;
    createCanvas(anchoCanvas, altoCanvas);
    
    // Dimensiones dinámicas
    anchoRaqueta = anchoCanvas * 0.02; // 2% del ancho del canvas
    altoRaqueta = altoCanvas * 0.25; // 25% del alto del canvas
    computadoraX = anchoCanvas - anchoRaqueta - 15;

    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraY = height / 2 - altoRaqueta / 2;
    diametroPelota = altoCanvas * 0.05; // 5% del alto del canvas
    resetPelota();
}

function draw() {
    background(fondo);
    dibujarMarcos();
    dibujarRaquetas();
    dibujarPelota();
    mostrarPuntaje();
    moverPelota();
    moverComputadora();
    verificarColisiones();
}

function dibujarMarcos() {
    fill(color("#000000"));
    rect(0, 0, width, grosorMarco); // Marco superior
    rect(0, height - grosorMarco, width, grosorMarco); // Marco inferior
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
    push();
    translate(pelotaX, pelotaY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bola, 0, 0, diametroPelota, diametroPelota);
    pop();
}

function mostrarPuntaje() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(color("#2B3FD6"));
    text(jugadorScore, width / 4, grosorMarco * 3);
    text(computadoraScore, 3 * width / 4, grosorMarco * 3);
}

function moverPelota() {
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Ajustar el ángulo de la pelota en función de su velocidad
    let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
    anguloPelota += velocidadTotal * 0.05;

    // Colisión con el marco superior e inferior
    if (pelotaY - diametroPelota / 2 < grosorMarco || 
        pelotaY + diametroPelota / 2 > height - grosorMarco) {
        velocidadPelotaY *= -1;
    }
}

function moverComputadora() {
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4;
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4;
    }
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function verificarColisiones() {
    // Colisión con la raqueta del jugador
    if (pelotaX - diametroPelota / 2 < jugadorX + anchoRaqueta && 
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3; // Ángulo máximo de 60 grados
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Colisión con la raqueta de la computadora
    if (pelotaX + diametroPelota / 2 > computadoraX && 
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3; // Ángulo máximo de 60 grados
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Colisión con los bordes izquierdo y derecho (anotación y reinicio)
    if (pelotaX < 0) {
        computadoraScore++;
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar marcador
        resetPelota();
    } else if (pelotaX > width) {
        jugadorScore++;
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar marcador
        resetPelota();
    }
}

function narrarMarcador() {
    let narrador = new SpeechSynthesisUtterance(`El marcador es ${jugadorScore} a ${computadoraScore}`);
    window.speechSynthesis.speak(narrador);
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    velocidadPelotaX = 5 * (Math.random() > 0.5 ? 1 : -1);
    velocidadPelotaY = 5 * (Math.random() > 0.5 ? 1 : -1);
    anguloPelota = 0;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        jugadorY -= altoRaqueta * 0.1; // Mueve un 10% de la altura de la raqueta
    } else if (keyCode === DOWN_ARROW) {
        jugadorY += altoRaqueta * 0.1; // Mueve un 10% de la altura de la raqueta
    }
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

// Manejar el redimensionamiento de la ventana
function windowResized() {
    setup(); // Llama a setup para reajustar las dimensiones
}
