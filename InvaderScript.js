class Invader{
    constructor({position}){
        
        this.velocity = {
            x:0,
            y:0
        }
        this.loaded = false
        
        let image=new Image()
        image.src='img/invader1.png'
        image.onload= () => {
            const scale = 0.6
            this.image = image
            this.width = image.width *  scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
            this.loaded = true
        }
    }
    draw(){
        if (this.loaded) {
            c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        }
    }
    update({velocity}){
        if(this.loaded){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderBullet({
            position:{x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            velocity:{x:0, y:5}
        })) 
    }
}

class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        this.width = 1200;

        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 2; j++) {
                this.invaders.push(new Invader({position: {
                    x: i * 80,
                    y: j * 60
                }}))
            }
        }
        console.log(this.invaders)
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
        }
    }
}

let grids = [new Grid()]


class InvaderBullet{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width=3
        this.height=10
    }
    draw(){
        c.fillStyle = 'brown'
        c.fillRect(this.position.x, this.position.y,this.width,this.height)
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
    
}
const invaderProjectiles = []