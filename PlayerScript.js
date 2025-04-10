//#############################################################################################################################################################################################################################################################################################################//
//Player, Disparo del Player, Muerte y Movimiento 
//#############################################################################################################################################################################################################################################################################################################//

// Definir la clase Player
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
            console.log(currentTop);
            // Mover la bala hacia arriba
            bullet.css('top', currentTop - 10 + 'px');

            // Verificar colisión con los enemigos
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
    moveRight(speed) {
        let sprite = $(`#${this.name}`);
        let currentLeft = sprite.position().left;
        if (currentLeft < 1000)
            sprite.css("left", currentLeft + speed + 'px');
        console.log(`${this.name}`, currentLeft);
    }

    moveLeft(speed) {
        let sprite = $(`#${this.name}`);
        let currentLeft = sprite.position().left;
        if (currentLeft > 20) {
            sprite.css("left", currentLeft - speed + 'px');
            console.log(`${this.name}`, currentLeft);
        }
    }
}