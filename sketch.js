let anchoCanvas, altoCanvas; // Ancho y alto del canvas
let jugadorX = 15; // Posición X del jugador
let jugadorY; // Posición Y del jugador 
let anchoRaqueta; // Ancho de la raqueta
let altoRaqueta; // Alto de la raqueta
let computadoraX; // Posición X de la computadora
let computadoraY; // Posición Y de la computadora
let pelotaX, pelotaY; // Posiciones X e Y de la pelota
let diametroPelota; // Diámetro de la pelota
let velocidadPelotaX = 2; // Velocidad de la pelota en dirección X
let velocidadPelotaY = 2; // Velocidad de la pelota en dirección Y
let anguloPelota = 0; // Ángulo de rotación de la pelota
let grosorMarco = 10; // Grosor de los bordes del canvas
let jugadorScore = 0; // Puntaje del jugador
let computadoraScore = 0; // Puntaje de la computadora
let fondo; // Imagen de fondo
let barraJugador; // Imagen de la raqueta del jugador
let barraComputadora; // Imagen de la raqueta de la computadora
let bola; // Imagen de la pelota
let sonidoRebote; // Sonido de rebote de la pelota
let sonidoGol; // Sonido de un gol
let teclaArribaPresionada = false; // Estado de la tecla de arriba
let teclaAbajoPresionada = false; // Estado de la tecla de abajo

function preload() {
    // Cargar imágenes y sonidos antes de iniciar el juego
    fondo = loadImage('./sprinters/fondo2.png'); // Cargar imagen de fondo
    barraJugador = loadImage('./sprinters/barra1.png'); // Cargar imagen de la raqueta del jugador
    barraComputadora = loadImage('./sprinters/barra2.png'); // Cargar imagen de la raqueta de la computadora
    bola = loadImage('./sprinters/bola.png'); // Cargar imagen de la pelota
    sonidoRebote = loadSound('./sound/bounce.wav'); // Cargar sonido de rebote
    sonidoGol = loadSound('./sound/jingle_win_synth_02.wav'); // Cargar sonido 
}

function setup() {
    // Dimensionar el canvas al tamaño de la ventana
    anchoCanvas = windowWidth * 0.9; // 90% del ancho de la ventana
    altoCanvas = windowHeight * 0.75; // 70% de la altura de la ventana
    createCanvas(anchoCanvas, altoCanvas); // Crear el canvas con las dimensiones especificadas
    // Dimensiones dinámicas de las raquetas y pelota
    anchoRaqueta = anchoCanvas * 0.02; // 2% del ancho del canvas
    altoRaqueta = altoCanvas * 0.25; // 25% del alto del canvas
    computadoraX = anchoCanvas - anchoRaqueta - 15; // Posición X de la raqueta de la computadora

    jugadorY = height / 2 - altoRaqueta / 2; // Centrar la raqueta del jugador verticalmente
    computadoraY = height / 2 - altoRaqueta / 2; // Centrar la raqueta de la computadora verticalmente
    diametroPelota = altoCanvas * 0.05; // 5% del alto del canvas para el diámetro de la pelota
    resetPelota(); // Reiniciar la posición y velocidad de la pelota
    // Dibujar el texto "Centra by Diego" en la parte superior

    // Crear un botón para reiniciar el juego
    let botonReinicio = createButton('Reiniciar Juego'); // Crear el botón
    botonReinicio.position(anchoCanvas / 2 - 20, altoCanvas - 570); // Posicionar el botón
    botonReinicio.size(150, 50); // Ajustar el tamaño del botón
    botonReinicio.mousePressed(reiniciarJuego); // Asocia la función de reinicio al botón
    botonReinicio.class('boton-reinicio'); // Aplicar clase CSS al botón
    
}

function draw() {
    background(fondo); // Establecer el fondo del canvas
    dibujarMarcos(); // Dibujar los bordes del canvas
    dibujarRaquetas(); // Dibujar las raquetas del jugador y de la computadora
    dibujarPelota(); // Dibujar la pelota
    mostrarPuntaje(); // Mostrar el puntaje del jugador y la computadora
    moverPelota(); // Actualizar la posición de la pelota
    moverComputadora(); // Actualizar la posición de la raqueta de la computadora
    verificarColisiones(); // Verificar colisiones entre la pelota y las raquetas

    // Mover la raqueta del jugador según las teclas presionadas
    if (teclaArribaPresionada) {
        jugadorY -= altoRaqueta * 0.1; // Mueve un 10% de la altura de la raqueta
    }
    if (teclaAbajoPresionada) {
        jugadorY += altoRaqueta * 0.1; // Mueve un 10% de la altura de la raqueta
    }

    // Limitar la posición de la raqueta del jugador dentro de los bordes
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function dibujarMarcos() {
    fill(color("#000000")); // Establecer el color negro para los marcos
    rect(0, 0, width, grosorMarco); // Marco superior
    rect(0, height - grosorMarco, width, grosorMarco); // Marco inferior
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta); // Dibujar la raqueta del jugador
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta); // Dibujar la raqueta de la computadora
}

function dibujarPelota() {
    push(); // Guardar el estado actual del transformador
    translate(pelotaX, pelotaY); // Mover el origen al centro de la pelota
    rotate(anguloPelota); // Rotar la pelota según su ángulo
    imageMode(CENTER); // Establecer el modo de imagen al centro
    image(bola, 0, 0, diametroPelota, diametroPelota); // Dibujar la pelota
    pop(); // Restaurar el estado anterior del transformador
}

function mostrarPuntaje() {
    textSize(24); // Establecer un tamaño de texto más pequeño
    textAlign(CENTER, CENTER); // Centrar el texto
    fill(color("#FFF")); // Establecer el color blanco para el texto
    
    // Mostrar la etiqueta "Jugador" sobre el puntaje del jugador
    text("Jugador", width / 4, grosorMarco + 10); // Mostrar la etiqueta del jugador con un pequeño ajuste vertical
    text(jugadorScore, width / 4, grosorMarco * 3 + 20); // Mostrar el puntaje del jugador con padding
    
    // Mostrar la etiqueta "Máquina" sobre el puntaje de la computadora
    text("Máquina", 3 * width / 4, grosorMarco + 10); // Mostrar la etiqueta de la máquina con un pequeño ajuste vertical
    text(computadoraScore, 3 * width / 4, grosorMarco * 3 + 20); // Mostrar el puntaje de la computadora con padding
}

function moverPelota() {
    pelotaX += velocidadPelotaX; // Actualizar la posición X de la pelota
    pelotaY += velocidadPelotaY; // Actualizar la posición Y de la pelota

    // Ajustar el ángulo de la pelota en función de su velocidad
    let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
    anguloPelota += velocidadTotal * 0.05; // Aumentar el ángulo según la velocidad total

    // Colisión con el marco superior e inferior
    if (pelotaY - diametroPelota / 2 < grosorMarco || // Si la pelota toca el marco superior
        pelotaY + diametroPelota / 2 > height - grosorMarco) { // Si la pelota toca el marco inferior
        velocidadPelotaY *= -1; // Invertir la dirección vertical
    }
}

function moverComputadora() {
    // Mover la raqueta de la computadora según la posición de la pelota
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4; // Mover hacia abajo
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4; // Mover hacia arriba
    }
    // Limitar la posición de la raqueta de la computadora dentro de los bordes
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function verificarColisiones() {
    // Colisión con la raqueta del jugador
    if (pelotaX - diametroPelota / 2 < jugadorX + anchoRaqueta && // Si la pelota toca la raqueta del jugador
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2); // Calcular el punto de impacto
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3; // Calcular el ángulo de rebote
        velocidadPelotaY = 10 * sin(factorAngulo); // Actualizar la velocidad vertical
        velocidadPelotaX *= -1; // Invertir la dirección horizontal
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Colisión con la raqueta de la computadora
    if (pelotaX + diametroPelota / 2 > computadoraX && // Si la pelota toca la raqueta de la computadora
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2); // Calcular el punto de impacto
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3; // Calcular el ángulo de rebote
        velocidadPelotaY = 10 * sin(factorAngulo); // Actualizar la velocidad vertical
        velocidadPelotaX *= -1; // Invertir la dirección horizontal
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Colisión con los bordes izquierdo y derecho (anotación y reinicio)
    if (pelotaX < 0) { // Si la pelota pasa del borde izquierdo
        computadoraScore++; // Incrementar el puntaje de la computadora
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar el marcador actual
        resetPelota(); // Reiniciar la pelota
    } else if (pelotaX > width) { // Si la pelota pasa del borde derecho
        jugadorScore++; // Incrementar el puntaje del jugador
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar el marcador actual
        resetPelota(); // Reiniciar la pelota
    }
}

function narrarMarcador() {
    // Crear un mensaje de narración con el puntaje actual
    let narrador = new SpeechSynthesisUtterance(`El marcador es ${jugadorScore} a ${computadoraScore}`);
    window.speechSynthesis.speak(narrador); // Reproducir el mensaje
}

function resetPelota() {
    // Reiniciar la posición y velocidad de la pelota
    pelotaX = width / 2; // Centrar la pelota en el canvas
    pelotaY = height / 2; // Centrar la pelota en el canvas
    velocidadPelotaX = 5 * (Math.random() > 0.5 ? 1 : -1); // Velocidad aleatoria en X
    velocidadPelotaY = 5 * (Math.random() > 0.5 ? 1 : -1); // Velocidad aleatoria en Y
    anguloPelota = 0; // Reiniciar el ángulo de la pelota
}

// Manejar el movimiento de la raqueta del jugador con el teclado
function keyPressed() {
    if (keyCode === UP_ARROW) {
        teclaArribaPresionada = true; // Marcar que se presionó la tecla de arriba
    } else if (keyCode === DOWN_ARROW) {
        teclaAbajoPresionada = true; // Marcar que se presionó la tecla de abajo
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        teclaArribaPresionada = false; // Marcar que se soltó la tecla de arriba
    } else if (keyCode === DOWN_ARROW) {
        teclaAbajoPresionada = false; // Marcar que se soltó la tecla de abajo
    }
}

// Manejar el redimensionamiento de la ventana
function windowResized() {
    setup(); // Llama a setup para ajustar el tamaño del canvas
    // Verifica la orientación al redimensionar
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Reiniciar el puntaje
    jugadorScore = 0; // Puntaje del jugador
    computadoraScore = 0; // Puntaje de la computadora
    // Reiniciar la posición de las raquetas
    jugadorY = height / 2 - altoRaqueta / 2; // Centrar la raqueta del jugador
    computadoraY = height / 2 - altoRaqueta / 2; // Centrar la raqueta de la computadora
    // Reiniciar la pelota
    resetPelota(); // Llamar a la función para reiniciar la pelota
}
