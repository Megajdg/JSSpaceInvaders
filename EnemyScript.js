class Enemy{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.status=1;
    }
    move (dx,dy){

    }
    outOfBounds(bullet) {
        return bullet.y < 0 || bullet.y < canvasHeight; // Si la bala está fuera del canvas por arriba o abajo
    }
    
    shoot(){
        if (Math.random() < 0.02){
            if (this.status ===1){
                let bullet = $('<div class="bullet"></div>'); 
                bullet.ccs({
                    position: 'absolute',
                    left: $(`#${this.name}`).position().left + $(`#${this.name}`).width() / 2 - 15,
                    top: $(`#${this.name}`).position().top + 20 // Justo encima de P1
                })
                $('body').append(bullet);
                let interval = setInterval(() => {
                    let currentTop = bullet.position().top;
        
                    // Mover la bala hacia arriba
                    bullet.css('top', currentTop + 10 + 'px');
                    // Verificar colisión con los enemigo
                    // Eliminar la bala si se sale de la pantalla
                    if (this.outOfBounds) { // Si la bala se sale por abajo
                        clearInterval(interval);
                        bullet.remove();
                    }
                }, 10);
            }
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