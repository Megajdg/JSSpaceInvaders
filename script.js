const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src="Images/invader1.png";
// Variable para manejar las teclas presionadas
let keysPressed = {
    37: false, // Flecha izquierda (Jugador 2)
    39: false, // Flecha derecha (Jugador 2)
    65: false, // Tecla 'A' (Jugador 1)
    68: false, // Tecla 'D' (Jugador 1)
    32: false, // Espacio (Disparo Jugador 1)
    45: false  // Tecla '0' (Disparo Jugador 2)
};
 // Animar el movimiento continuo mientras se mantenga presionada la tecla
 function movePlayers() {
    // Jugador 1 (Teclas 'A' y 'D')
    if (keysPressed[65]) { // 'A' (Jugador 1)
        player1.moveLeft(PlayerSpeed);
    }
    if (keysPressed[68]) { // 'D' (Jugador 1)
        player1.moveRight(PlayerSpeed);
    }

    // Jugador 2 (Teclas flecha izquierda y derecha)
    if (keysPressed[37]) { // Flecha izquierda (Jugador 2)
        player2.moveLeft(PlayerSpeed);
    }
    if (keysPressed[39]) { // Flecha derecha (Jugador 2)
        player2.moveRight(PlayerSpeed);
    }

    // Llamar nuevamente para continuar el movimiento mientras las teclas estén presionadas
    requestAnimationFrame(movePlayers);
}
class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 5;
        this.status = 1; // 1 = vivo, 0 = eliminado
    }
    draw(ctx) {//Dibuja el enemigo
        if (this.status === 1) {
            ctx.drawImage(image, this.x, this.y, this.width, this.height);
        }
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}
class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.lifes = 5;
        this.canShoot = true;
    }

    // Método para detectar colisión entre la bala y el enemigo
    checkCollision(bullet, enemy) {
        let bulletPos = bullet.position();
        let enemyElement = $(`#${enemy.name}`);
    
        let enemyPos = enemyElement.position();
        let enemyWidth = enemyElement.width();
        let enemyHeight = enemyElement.height();
    
        return (
            bulletPos.left >= enemyPos.left &&
            bulletPos.left <= enemyPos.left + enemyWidth &&
            bulletPos.top >= enemyPos.top &&
            bulletPos.top <= enemyPos.top + enemyHeight
        );
    }

    shoot() {

        if (!this.canShoot) return; // Si no puede disparar, no hacer nada

        this.canShoot = false; // Deshabilitar disparo hasta que se suelte la tecla

        // Crear el div de la bala
        let bullet = $('<div class="bullet"></div>');
        bullet.css({
            position: 'absolute',
            // Centrar la bala en el jugador
            left: $(`#${this.name}`).position().left + $(`#${this.name}`).width() / 2 - 15,
            top: $(`#${this.name}`).position().top - 20, // Justo encima de P1
        });

        // Añadir la bala al body
        $('body').append(bullet);

        // Mover la bala hacia arriba
        let interval = setInterval(() => {
            let currentTop = bullet.position().top;

            // Mover la bala hacia arriba
            bullet.css('top', currentTop - 10 + 'px');

            // Verificar colisión con los enemigos
            let enemy = new Enemy(0,0,5,5);
            enemy.forEach((enemy) => {
                if (checkCollision(bullet, npc)) {
                    clearInterval(interval);
                    bullet.remove(); 
                    enemy.remove();
                }
            });

            // Eliminar la bala si se sale de la pantalla
            if (currentTop < 0) { // Si la bala se sale por arriba
                clearInterval(interval);
                bullet.remove();
            }
        }, 10);
    }

    // Método para perder una vida
    loseLife = function () {
        this.lifes--;
        console.log(`${this.name} ha sido alcanzado. Vidas restantes: ${this.lifes}`);

        if (this.lifes <= 0) {
            console.log(`${this.name} ha sido eliminado.`);
            $(`#${this.name}`).remove(); // Eliminar el sprite del jugador
        }
    };

    // Métodos para mover el jugador
    moveRight(PlayerSpeed) {
        let sprite = $(`#${this.name}`);
        let currentLeft = sprite.position().left;
        if (currentLeft < 1000)
            sprite.css("left", currentLeft + PlayerSpeed + 'px');
        console.log(`${this.name}`, currentLeft);
    }

    moveLeft(PlayerSpeed) {
        let sprite = $(`#${this.name}`);
        let currentLeft = sprite.position().left;
        if (currentLeft > 20) {
            sprite.css("left", currentLeft - PlayerSpeed + 'px');
            console.log(`${this.name}`, currentLeft);
        }
    }
}
class Bullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 2;
        this.height = 5;
        this.speed = speed;
        this.active = true;
    }

    draw(ctx) {
        if (this.active) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    move() {
        this.y = this.speed; 
        if (this.y < 0) {
            this.active = false; // Desactivar bala al salir del canvas
        }
    }
}

// Clase EnemyGroup (maneja a todos los enemigos)
class EnemyGroup {
    constructor(rows, cols, enemyWidth, enemyHeight, padding, speedX, speedY) {
        this.rows = rows;
        this.cols = cols;
        this.enemyWidth = enemyWidth;
        this.enemyHeight = enemyHeight;
        this.padding = padding;
        this.speedX = speedX;
        this.speedY = speedY;
        this.direction = 1;
        this.enemies = [];
        this.bullets = []; // Lista de balas

        this.createEnemies();
    }

    createEnemies() {
        for (let r = 0; r < this.rows; r++) {
            this.enemies[r] = [];
            for (let c = 0; c < this.cols; c++) {
                let x = c * (this.enemyWidth + this.padding) + 5;
                let y = r * (this.enemyHeight + this.padding) + 5;
                this.enemies[r][c] = new Enemy(x, y, this.enemyWidth, this.enemyHeight);
            }
        }
    }

    draw(ctx) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.enemies[r][c].draw(ctx);
            }
        }
        // Dibujar balas
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    move() {
        let shouldMoveDown = false;

        // Verificar si algún enemigo toca el borde
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let enemy = this.enemies[r][c];
                if (enemy.status === 1) {
                    if ((enemy.x + enemy.width >= canvas.width && this.direction === 1) ||
                        (enemy.x <= 0 && this.direction === -1)) {
                        shouldMoveDown = true;
                        break;
                    }
                }
            }
        }

        // Cambiar dirección si toca el borde
        if (shouldMoveDown) {
            this.direction *= -1;
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.enemies[r][c].move(0, this.speedY);
                }
            }
        }

        // Mover enemigos
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.enemies[r][c].move(this.speedX * this.direction, 0);
            }
        }

        // Mover balas
        this.bullets.forEach(bullet => bullet.move());
        this.bullets = this.bullets.filter(bullet => bullet.active);
    }

    // Método para que los enemigos disparen aleatoriamente
    shoot2() {
        if (Math.random() < 0.02) { // Probabilidad del 2% por frame
            let activeEnemies = [];

            for (let r = this.rows - 1; r >= 0; r--) { // Solo los de la fila más baja pueden disparar
                for (let c = 0; c < this.cols; c++) {
                    if (this.enemies[r][c].status === 1) {
                        activeEnemies.push(this.enemies[r][c]);
                    }
                }
            }

            if (activeEnemies.length > 0) {
                let shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
                this.bullets.push(new Bullet(shooter.x + shooter.width / 2, shooter.y + shooter.height, 2));
            }
        }
    }
}
// Crear jugadores
let player1 = new Player('P1', 1);
let player2 = new Player('P2', 2);
let PlayerSpeed = 5;
$(function () {
   

    // Detectar las teclas presionadas
    document.addEventListener('keydown', function (event) {
        keysPressed[event.keyCode] = true;

        if (event.keyCode == 37) { // Flecha izquierda (Jugador 2)
            player2.moveLeft(PlayerSpeed);
        }
        else if (event.keyCode == 39) { // Flecha derecha (Jugador 2)
            player2.moveRight(PlayerSpeed);
        }
        else if (event.keyCode == 65) { // Tecla 'A' (Jugador 1)
            player1.moveLeft(PlayerSpeed);
        }
        else if (event.keyCode == 68) { // Tecla 'D' (Jugador 1)
            player1.moveRight(PlayerSpeed);
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

    // Crear grupo de enemigos
});
const enemyGroup = new EnemyGroup(2, 10, 10, 10, 3, 0.3, 15);

// Bucle del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemyGroup.draw(ctx);
    enemyGroup.move();
    enemyGroup.shoot2();
    requestAnimationFrame(gameLoop);
}
// Iniciar la animación del movimiento
movePlayers();

gameLoop();
