$(function(){
var canvas = document.getElementById("drobe");
var ctx = canvas.getContext("2d");

var dt;
var previousFrameTime = null;
var bullets = [];
var baibokai = [];

var times = {
    previousBaibokas: 0,
}

////////////////////DETECTING INPUT//////////////////////
var keysDown = [];

addEventListener("keydown", function(e){
    keysDown[e.keyCode] = true;
    console.log(e.keyCode);
}, false);

addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
}, false);
////////////////////END OF DETECTING INPUT///////////////

var player = {
    x: 0,
    y: 0,
    size: 30,
    name: "Killer",
    speed: 250,
    energy: 100,
    previousBullet: 0,
    
    moveUp: function(){
        this.y -= this.speed * dt / 1000;
    },
    moveDown : function(){
        this.y += this.speed * dt / 1000;
    },
    moveLeft : function(){
        this.x -= this.speed * dt / 1000;
    },
    moveRight : function(){
        this.x += this.speed * dt / 1000;
    },
    draw : function(){
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    },
    checkBounds: function(){
        if(this.x < 0)
            this.x = 0;
        if(this.y < 0)
            this.y = 0;
        if(this.y > canvas.height-this.size)
            this.y = canvas.height - this.size;
        if(this.x > canvas.width-this.size)
            this.x = canvas.width - this.size;
    },
    shoot: function(){
        var now = new Date().getTime();
        if(now - this.previousBullet > 100){
            this.previousBullet = now;
            bullets.push(new Bullet(this.x, this.y, this.energy * 5, 0));
        }
    },
};

function Baibokas(speed, size, damage){
    this.x = canvas.width;
    this.y = Math.floor(Math.random() * canvas.height - size);
    this.speed = speed;
    this.size = size;
    this.damage = 34;
    this.move = function(){
        this.x  -= this.speed * dt / 1000;
    }
    this.draw = function(){
        ctx.fillStyle = "#e67e22";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    this.collides = function(bullet){
        if(this.x < bullet.x + bullet.size &&
          this.x + this.size > bullet.x &&
          this.y < bullet.y + bullet.size &&
          this.size + this.y > bullet.y){
            console.log("COLIDES");
            return true;
        } else{
            return false;
        }
    }
}

function Bullet(x, y, vx, vy){
    this.x = x;
    this.y = y;
    this.velocityX = vx;
    this.velocityY = vy;
    this.size = 10;
    this.draw = function(){
        ctx.fillStyle = "#000";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    this.move = function(){
        this.x += this.velocityX * dt/1000;
        this.y += this.velocityY * dt/1000;
    }
}

function input(){
    if(keysDown[65] == true){
        player.moveLeft();
        player.checkBounds();
    }
    if(keysDown[87] == true){
        player.moveUp();
        player.checkBounds();
    }
    if (keysDown[83] == true){
        player.moveDown();
        player.checkBounds();
    }
    if (keysDown[68] == true){
        player.moveRight();
        player.checkBounds();
    }
    if(keysDown[32] == true)
        player.shoot();
}

function update(){
    var now = new Date().getTime();
    
    if(now - times.previousBaibokas > 1000){
        times.previousBaibokas = now;
        baibokai.push(new Baibokas(300, 20, 34));
    }
    
    
    for(var i = 0; i < bullets.length; i++){
        bullets[i].move();
        if(bullets[i].x > canvas.width)
            bullets.splice(i, 1);
    }
    
    for(var i = 0; i < baibokai.length; i++){
        baibokai[i].move();
        baibokai[i].collides(player);
        
        
        if(baibokai[i].x < -50){
            baibokai.splice(i, 1);
        }
        
        for(var j = 0; j < bullets.length; j++){
            if(baibokai[i].collides(bullets[j])){
                baibokai.splice(i, 1);
                break;
            }
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(var i = 0; i < bullets.length; i++)
        bullets[i].draw();
    
    player.draw();
    
    for(var i = 0; i < baibokai.length; i++)
        baibokai[i].draw();    
}

function frame(){
    var now = new Date().getTime();
    
    if(previousFrameTime != null)
        dt = now - previousFrameTime;
     else 
        dt = 0;
    
    previousFrameTime = now;
    
    input();
    update();
    draw();
     
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
    
});