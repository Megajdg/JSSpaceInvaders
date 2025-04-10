const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const player1Img = new Image();
player1Img.src = "Images/Player73x52.png";

const player2Img = new Image();
player2Img.src = "Images/Player73x52.png";

const enemyImg = new Image();
enemyImg.src = "Images/invader1.png";
let totalKills = 0;
class Player {
  constructor(x, color, leftKey, rightKey, shootKey) {
    this.x = x;
    this.y = canvas.height - 30;
    this.width = 40;
    this.height = 10;
    this.color = color;
    this.speed = 2;
    this.score = 0;
    this.lives = 5;
    this.bullets = [];
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.shootKey = shootKey;
    this.cooldown = 0;
  }

  draw() {
    ctx.drawImage(
      this.color === "red" ? player1Img : player2Img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  move(keysPressed) {
    if (keysPressed[this.leftKey]) this.x -= this.speed;
    if (keysPressed[this.rightKey]) this.x += this.speed;
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
  }

  shoot(keysPressed) {
    if (keysPressed[this.shootKey] && this.cooldown <= 0) {
      if (this.bullets.length < 3) {
        this.bullets.push(new Bullet(this.x + this.width / 2, this.y, -7, this.color));
        this.cooldown = 20;
      }
    }
    if (this.cooldown > 0) this.cooldown--;
  }

  updateBullets() {
    this.bullets.forEach(bullet => bullet.move());
    this.bullets = this.bullets.filter(b => b.y > 0);
  }

  drawBullets() {
    this.bullets.forEach(b => b.draw());
  }
  substractLives(){
    this.lives --;
  }
}

class Bullet {
  constructor(x, y, speed, color) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.speed = speed;
    this.color = color;
  }

  move() {
    this.y += this.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
class BulletEnemy {
  constructor(x, y, speedY = 5) {
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.speedY = speedY;
    this.active = true;
  }

  move() {
    this.y += this.speedY;
    if (this.y > canvas.height) this.active = false;

  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red"; // o "lime" per verd
    ctx.fill();
    ctx.closePath();
  }
}
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 9;
    this.height = 9;
    this.status = 1;
  }

  draw() {
    if (this.status === 1) {
      ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    }
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

}

class EnemyGroup {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.enemies = [];
    this.direction = 1;
    this.speedX = 0.08;
    this.speedY = 10;
    this.padding = 0.1;
    this.bullets = [];
    this.createEnemies();
  }

  createEnemies() {
    this.enemies = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = 60 + c * (14 + this.padding);  // 20 = ample enemic
        const y = 30 + r * (7 + this.padding);  // 20 = alt enemic
        this.enemies.push(new Enemy(x, y));
      }
    }
  }

  draw() {
    this.enemies.forEach(enemy => enemy.draw());
    enemyGroup.bullets.forEach(b => b.draw(ctx));
  }
  enemyShoot() {
    // 0,8% de probabilitat per frame
    if (Math.random() < 0.008 && this.enemies.length > 0) {
      const shooter = this.enemies[Math.floor(Math.random() * this.enemies.length)];
      const bullete = new BulletEnemy(shooter.x + shooter.width / 2, shooter.y + shooter.height, 4);
      this.bullets.push(bullete);
    }
  }
  move() {
    let shouldMoveDown = false;
    for (let e of this.enemies) {
      if ((e.x + e.width >= canvas.width && this.direction === 1) ||
        (e.x <= 0 && this.direction === -1)) {
        shouldMoveDown = true;
        break;
      }
    }

    if (shouldMoveDown) {
      this.direction *= -1;
      this.enemies.forEach(e => e.move(0, this.speedY));
    } else {
      this.enemies.forEach(e => e.move(this.speedX * this.direction, 0));
    }
    this.enemyShoot(); // fer disparar aleatòriament
    this.bullets.forEach(b => b.move());
  }


  checkCollision(bullet) {
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (
        bullet.x > e.x &&
        bullet.x < e.x + e.width &&
        bullet.y > e.y &&
        bullet.y < e.y + e.height &&
        e.status === 1
      ) {
        e.status = 0;
        this.enemies.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

// Setup
const player1 = new Player(200, "red", "a", "d", "s");
const player2 = new Player(500, "cyan", "ArrowLeft", "ArrowRight", "0");
const enemyGroup = new EnemyGroup(5, 10);
const keysPressed = {};

document.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`P1: ${player1.score}`, 20, 20);
  ctx.fillText(`P2: ${player2.score}`, canvas.width - 80, 20);
}

function checkWin() {
  player1.bullets.forEach((b, i) => {
    if (enemyGroup.checkCollision(b)) {
      player1.bullets.splice(i, 1);
      player1.score++;
      totalKills++;
    }
  });

  player2.bullets.forEach((b, i) => {
    if (enemyGroup.checkCollision(b)) {
      player2.bullets.splice(i, 1);
      player2.score++;
      totalKills++;
    }
  });
}
let gameOver = false;

function endGame() {
  gameOver = true;

  let winnerText = "";
  if (player1.score > player2.score) {
    winnerText = "Jugador 1 guanya!";
  } else if (player2.score > player1.score) {
    winnerText = "Jugador 2 guanya!";
  } else {
    winnerText = "Empat!";
  }

  ctx.fillStyle = "yellow";
  ctx.font = "28px Arial";
  ctx.fillText("Fi del joc!", canvas.width / 2 - 60, canvas.height / 2 - 20);
  ctx.fillText(winnerText, canvas.width / 2 - 80, canvas.height / 2 + 20);
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  enemyGroup.move();
  enemyGroup.draw();


  player1.move(keysPressed);
  player1.shoot(keysPressed);
  player1.updateBullets();
  player1.draw();
  player1.drawBullets();

  player2.move(keysPressed);
  player2.shoot(keysPressed);
  player2.updateBullets();
  player2.draw();
  player2.drawBullets();

  // Check for collisions
  player1.bullets.forEach((b, i) => {
    if (enemyGroup.checkCollision(b)) {
      player1.bullets.splice(i, 1);
      player1.score++;
    }
  });

  player2.bullets.forEach((b, i) => {
    if (enemyGroup.checkCollision(b)) {
      player2.bullets.splice(i, 1);
      player2.score++;
    }
  });
  enemyGroup.bullets.forEach((b) => {
    if (
      b.x > player1.x && b.x < player1.x + player1.width &&
      b.y > player1.y && b.y < player1.y + player1.height
    ) {
      player1.substractLives();
      b.active = false;
    }
  })
  enemyGroup.bullets.forEach((b) => {
    if (
      b.x > player2.x && b.x < player2.x + player2.width &&
      b.y > player2.y && b.y < player2.y + player2.height
    ) {
      player2.substractLives();
      b.active = false;
    }
  });
  if (!gameOver) {
  
    // Mostrar vides
    ctx.fillStyle = "white";
    ctx.font = "5px Arial";
    ctx.fillText("Jugador 1: " + player1.lives + " vides", 20, 25);
    ctx.fillText("Jugador 2: " + player2.lives + " vides", canvas.width - 95, 25);
  }
  drawScore();
  checkWin();
  if (enemyGroup.enemies.length === 0 && totalKills < 100) {
    enemyGroup.speedX += 0.1; // Enemics més ràpids
    enemyGroup.createEnemies();
  }
  requestAnimationFrame(gameLoop);
    // Comprovar si han perdut
    if (player1.lives <= 0 || player2.lives <= 0) {
      endGame();
    }
}

gameLoop();