    class Bullet{
    constructor({position, velocity, owner}){
        this.position = position
        this.velocity = velocity

        this.radius=10
        this.owner = owner
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle='red'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}
const projectiles=[]