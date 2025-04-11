class Player{
    constructor({startPosX, borderColor}){
        
        this.velocity = {
            x:0,
            y:0
        }

        this.borderColor = borderColor

        const image=new Image()
        image.src='img/Player73x52.png'
        image.onload= () => {
            const scale = 1
            this.image = image
            this.width = image.width *  scale
            this.height = image.height * scale
            this.position ={
                x:startPosX,
                y:canvas.height- this.height-20
            }
        }
    }
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    
        c.beginPath()
    c.moveTo(this.position.x, this.position.y + this.height)
    c.lineTo(this.position.x + this.width, this.position.y + this.height)
    c.strokeStyle = this.borderColor
    c.lineWidth = 4
    c.stroke()
    }
    update(){
        if(this.image){
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}
let player = new Player({startPosX: canvas.width / 4, borderColor: 'teal'})
let player2 = new Player({startPosX: canvas.width * 0.75, borderColor: 'lime'})
