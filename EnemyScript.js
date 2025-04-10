class Enemy{
    constructor(x,y,width,height){

        this.x = x;
        this.y = y;
        this.status=1;
        this.canShoot = true;
    }
    move (dx,dy){

    }
    outOfBounds(bullet) {
        return bullet.y < 0 || bullet.y < canvasHeight; // Si la bala está fuera del canvas por arriba o abajo
    }
    
    shoot(){
        if (Math.random() < 0.02){
            if (!this.canShoot) return; // Si no puede disparar, no hacer nada

        this.canShoot = false; // Deshabilitar disparo hasta que se suelte la tecla

        // Crear el div de la bala
        let Enemybullet = $('<div class="bullet"></div>');
        Enemybullet.css({
            position: 'absolute',
            // Centrar la bala en el jugador
            left: $(`#${this.name}`).position().left + $(`#${this.name}`).width() / 2 - 15,
            top: $(`#${this.name}`).position().top - 20, // Justo encima de P1
        });
        
        // Añadir la bala al body
        $('body').append(Enemybullet);

        // Mover la bala hacia arriba
        let interval = setInterval(() => {
            let currentTop = bullet.position().top;
            console.log(currentTop);
            // Mover la bala hacia arriba
            Enemybullet.css('top', currentTop - 10 + 'px');

            // Verificar colisión con los enemigos
            enemy.forEach((enemy) => {
                if (checkCollision(bullet, npc)) {
                    clearInterval(interval);
                    Enemybullet.remove(); 
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
    }
}

class EnemyGroup{
    constructor(){
        this.rows = rows;
        this.cols = cols;
        this.padding = padding;
        this.enemies = [];
        this.nothing;
    }

}