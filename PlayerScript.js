// Definir la clase Player
class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.health = 50;
        this.lifes = 5;
    }

    shoot() {
        // Crear el div de la bala
        let bullet = $('<div class="bullet"></div>');
        bullet.css({
            position: 'absolute',
            // Centrar la bala en el jugador
            left: $(`#${this.name}`).position().left + $(`#${this.name}`).width() / 2 - 5, 
            top: $(`#${this.name}`).position().top - 10, // Justo encima de P1
        });
        
        // Añadir la bala al body
        $('body').append(bullet);

        // Mover la bala hacia arriba
        let interval = setInterval(() => {
            let currentTop = bullet.position().top;

            // Mover la bala hacia arriba
            bullet.css('top', currentTop - 10 + 'px');

            // Eliminar la bala si se sale de la pantalla
            if (currentTop < 0) { // Si la bala se sale por arriba
                clearInterval(interval);
                bullet.remove();
            }
        }, 10);
    }

    // Métodos para mover el jugador
    moveRight(speed) {
        let sprite = $(`#${this.name}`);
        let currentLeft = sprite.position().left;
        sprite.css("left", currentLeft + speed + 'px');
        console.log(`${this.name}`, currentLeft);
    }

    moveLeft(speed) {
        let sprite = $(`#${this.name}`);
        let currentLeft = sprite.position().left;
        sprite.css("left", currentLeft - speed + 'px');
        console.log(`${this.name}`, currentLeft);
    }
}

// Variable para manejar las teclas presionadas
let keysPressed = {
    37: false, // Flecha izquierda (Jugador 2)
    39: false, // Flecha derecha (Jugador 2)
    65: false, // Tecla 'A' (Jugador 1)
    68: false, // Tecla 'D' (Jugador 1)
    32: false, // Espacio (Disparo Jugador 1)
    45: false  // Tecla '0' (Disparo Jugador 2)
};

$(function () {
    // Crear jugadores
    let player1 = new Player('P1', 1);
    let player2 = new Player('P2', 2);
    let speed = 5;

    // Detectar las teclas presionadas
    document.addEventListener('keydown', function(event) {
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
    document.addEventListener('keyup', function(event) {
        keysPressed[event.keyCode] = false; // Marcar la tecla como no presionada
    });

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

    // Iniciar la animación del movimiento
    movePlayers();
});