let scorep1 = document.getElementById('scorep1');
let scorep2 = document.getElementById('scorep2');
let healthp1 = document.getElementById('healthp1');
let healthp2 = document.getElementById('healthp2');
let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d')
let imagen = new Image();
imagen.src= 'img/Background.jpg'
imagen.addEventListener('load', ()  => {
    c.drawImage(imagen,0,0,canvas.width,canvas.height)
})

canvas.width= 1900;
canvas.height = 900;

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    Space:{
        pressed:false
    },
    Insert:{
        pressed:false
    }
}

let score1 = 0;
let score2 = 0;
let health1 = 5;
let health2 = 5;

addEventListener('keydown',({key})=>{
    switch(key){
        case 'a':
            keys.a.pressed = true
            break;
        case 'd':
            keys.d.pressed = true
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            break;
        case ' ':
            if(!keys.Space.pressed) {
                projectiles.push(new Bullet({
                    position:{ x:player.position.x + player.width/2, y:player.position.y},
                    velocity:{x:0,y:-15},
                    owner: 'player1'
                }))
                keys.Space.pressed = true
            }
            break;
        case 'Insert':
            if(!keys.Insert.pressed) {
                projectiles.push(new Bullet({
                    position:{ x:player2.position.x + player2.width/2, y:player2.position.y},
                    velocity:{x:0,y:-15},
                    owner: 'player2'
                }))
                keys.Insert.pressed = true
            }
            break;
    }
})
function createParticles({object,color}){
    for ( let i =0; i<15;i++){
        particles.push( new Particle({
            position:{x:object.position.x + object.width /2,
                y:object.position.y + object.height / 2},
            velocity:{x:(Math.random()-0.5)*2, y:(Math.random()-0.5)*2},
            radius : Math.random()*3,
            color:color || '#f8ff88'
        }))
    }
}
addEventListener('keyup',({key})=>{
    switch(key){
        case 'a':
            keys.a.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case ' ':
            keys.Space.pressed = false
            break;
        case 'Insert':
            keys.Insert.pressed =false
            break;
    }
})
let frames =0;
function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(imagen, 0, 0, canvas.width, canvas.height); //Redibujar fondo ,pero idk exactamente
    requestAnimationFrame(animate)
    player.update()
    player2.update()
    

    if(keys.a.pressed && player.position.x >50){
        player.velocity.x=-5
    }else if(keys.d.pressed&&player.position.x < 1850){
        player.velocity.x=5
    }else{
        player.velocity.x =0
    }

    if(keys.ArrowLeft.pressed && player2.position.x >50){
        player2.velocity.x = -5
    }else if(keys.ArrowRight.pressed && player2.position.x < 1850){
        player2.velocity.x = 5
    }else{
        player2.velocity.x = 0
    }

    particles.forEach(particle =>{
        if(particle.opacity < 0.05){
            setTimeout(() => {
                particles.splice(i,1)
            },0);
        }else{
            particle.update()
        }

    })

   projectiles.forEach((bullet,index) => {
        if(bullet.position.y + bullet.radius <= 0){
            setTimeout(()=>{
                projectiles.splice(index,1)
            }, 0)
            
        }else{
            bullet.update()
        }
        
    })

    invaderProjectiles.forEach((invaderProjectile, index) =>{
        if(invaderProjectile.position.y+invaderProjectile.height>=canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index,1)
            },0)
        }else{
            invaderProjectile.update()
        }
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index,1)
            },0)
            health1 -= 1
            healthp1.innerText = health1
            if (health1===0){
                if(alert('El Player 1 ha ganado porque el player 2 ha sido eliminado.')){}
                else window.location.reload();
            }
            
        }
        else if (invaderProjectile.position.y + invaderProjectile.height >= player2.position.y && invaderProjectile.position.x + invaderProjectile.width >= player2.position.x && invaderProjectile.position.x <= player2.position.x + player2.width
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index,1)
            },0)
            health2 -= 1
            healthp2.innerText = health2
            if (health2===0){
                if(alert('El Player 2 ha ganado porque el player 1 ha sido eliminado.')){}
                else window.location.reload();
            }
        }
    })

    grids.forEach((grid) => {
        grid.update()
        if (frames % 100 ===0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                    invader.position.x && 
                    projectile.position.x - projectile.radius <=
                    invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                    invader.position.y
                ) {
                    
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )

                        if (invaderFound && projectileFound) {
                            createParticles({
                                object: invader,
                            })
                            if (projectile.owner === 'player1') {
                                score1 += 10
                                scorep1.innerText = score1
                                if (score1 >= 1000) {
                                    if(alert('El Player 1 ha ganado porque ha eliminado a 100 enemigos.')){}
                                    else window.location.reload();
                                }
                            } else if (projectile.owner === 'player2') {
                                score2 += 10
                                scorep2.innerText = score2
                                if (score2 >= 1000) {
                                    if(alert('El Player 2 ha ganado porque ha eliminado a 100 enemigos.')){}
                                    else window.location.reload();
                                }
                            }
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                        }

                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length - 1]
                            
                            grid.width = lastInvader.position.x - firstInvader.position.x+ lastInvader.width
                            grid.position.x = firstInvader.position.x
                        } else {
                            setTimeout(() => {
                                const gridIndex = grids.findIndex(g => g === grid)
                                if (gridIndex > -1) {
                                    grids.splice(gridIndex, 1)
                                }
                                grids.push(new Grid())
                            }, 0)
                        }
                    }, 0)
                }
            })
        })
        
    })
    frames++
}
const particles = []
class Particle{
        constructor({position, velocity,radius,color}) {
            this.position = position 
            this.velocity = velocity
            this.radius =  radius
            this.color = color
            this.opacity = 1
        }
        draw(){
            c.save()
            c.globalAlpha = this.opacity
            c.beginPath()
            c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
            c.fillStyle=this.color
            c.fill()
            c.closePath()
            c.restore()
        }
        update(){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.opacity -= 0.01
        }
}

animate()