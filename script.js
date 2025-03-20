const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const image = new Image().src="Images/invader1.png";
class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

// Clase EnemyGroup (Maneja todos los enemigos)
class EnemyGroup {
    constructor(rows, cols, enemyWidth, enemyHeight, padding, speedX, speedY) {
        this.rows = rows;
        this.cols = cols;
        this.enemyWidth = enemyWidth;
        this.enemyHeight = enemyHeight;
        this.padding = padding;
        this.speedX = speedX;
        this.speedY = speedY;
        this.direction = 1; // 1 = derecha, -1 = izquierda
        this.enemies = [];

        this.createEnemies();
    }

    // Crear la cuadrícula de enemigos
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

    // Dibujar todos los enemigos
    draw(ctx) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.enemies[r][c].draw(ctx);
            }
        }
    }

    // Mover todos los enemigos
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

        // Si toca el borde, cambia de dirección y baja
        if (shouldMoveDown) {
            this.direction *= -1;
            this.move
        }
        // Mover los enemigos en la dirección actual
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.enemies[r][c].move(this.speedX * this.direction, 0);
            }
        }
}
}
// Crear un grupo de enemigos
const enemyGroup = new EnemyGroup(1, 15, 2, 2, 8, 0.5, 20);

// Bucle del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemyGroup.draw(ctx);
    enemyGroup.move();
    requestAnimationFrame(gameLoop);
}

gameLoop();



