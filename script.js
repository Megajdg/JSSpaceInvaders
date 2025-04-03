const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src="Images/invader1.png";
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
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.active = false; // Desactivar la bala si sale del canvas
        }
    }
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
    shoot() {
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

// Crear grupo de enemigos
const enemyGroup = new EnemyGroup(2, 10, 10, 10, 3, 0.3, 15);

// Bucle del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemyGroup.draw(ctx);
    enemyGroup.move();
    enemyGroup.shoot();
    requestAnimationFrame(gameLoop);
}

gameLoop();