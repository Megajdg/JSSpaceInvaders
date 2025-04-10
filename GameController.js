// Variable para manejar las teclas presionadas
let keysPressed = {
    37: false, // Flecha izquierda (Jugador 2)
    39: false, // Flecha derecha (Jugador 2)
    65: false, // Tecla 'A' (Jugador 1)
    68: false, // Tecla 'D' (Jugador 1)
    32: false, // Espacio (Disparo Jugador 1)
    45: false  // Tecla '0' (Disparo Jugador 2)
};

//#############################################################################################################################################################################################################################################################################################################//
//Deteccion de teclas
//#############################################################################################################################################################################################################################################################################################################//
$(function () {
    // Crear jugadores
    let player1 = new Player('P1', 1);
    let player2 = new Player('P2', 2);
    let speed = 5;

    // Detectar las teclas presionadas
    document.addEventListener('keydown', function (event) {
        keysPressed[event.keyCode] = true;

        if (event.keyCode == 37) { // Flecha izquierda (Jugador 2)
            player2.moveLeft(speed);
        }
        else if (event.keyCode == 39) { // Flecha derecha (Jugador 2)
            player2.moveRight(speed);
        }
        else if (event.keyCode == 65) { // Tecla 'A' (Jugador 1)
            player1.moveLeft(speed);
        }
        else if (event.keyCode == 68) { // Tecla 'D' (Jugador 1)
            player1.moveRight(speed);
        }
        else if (event.keyCode == 32) { // Espacio (Disparo Jugador 1)
            player1.shoot();
        }
        else if (event.keyCode == 45) { // Tecla '0' (Disparo Jugador 2)
            player2.shoot();
        }
    }, true);

    // Detectar cuando las teclas dejan de ser presionadas
    document.addEventListener('keyup', function (event) {
        keysPressed[event.keyCode] = false; // Marcar la tecla como no presionada

        // Volver a habilitar el disparo cuando se suelta la tecla de disparo
        if (event.keyCode == 32) { // Espacio (Jugador 1)
            player1.canShoot = true;
        }
        else if (event.keyCode == 45) { // Tecla '0' (Jugador 2)
            player2.canShoot = true;
        }
    });
//#############################################################################################################################################################################################################################################################################################################//
//Funcion para el collider de las balas 
//#############################################################################################################################################################################################################################################################################################################//
    function OntriggerBullet(){
        
    }

//#############################################################################################################################################################################################################################################################################################################//
//Funcion de mover players
//#############################################################################################################################################################################################################################################################################################################//

    // Animar el movimiento continuo mientras se mantenga presionada la tecla
    function movePlayers() {
        // Jugador 1 (Teclas 'A' y 'D')
        if (keysPressed[65]) { // 'A' (Jugador 1)
            player1.moveLeft(speed);
        }
        if (keysPressed[68]) { // 'D' (Jugador 1)
            player1.moveRight(speed);
        }

        // Jugador 2 (Teclas flecha izquierda y derecha)
        if (keysPressed[37]) { // Flecha izquierda (Jugador 2)
            player2.moveLeft(speed);
        }
        if (keysPressed[39]) { // Flecha derecha (Jugador 2)
            player2.moveRight(speed);
        }

        // Llamar nuevamente para continuar el movimiento mientras las teclas estén presionadas
        requestAnimationFrame(movePlayers);
    }
//#############################################################################################################################################################################################################################################################################################################//
//Funcion de "Update"
//#############################################################################################################################################################################################################################################################################################################//

    function gameLoop(){
        movePlayers();
        
    }
    // Iniciar la animación del movimiento
    gameLoop();
});