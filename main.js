let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height = 700;
document.body.appendChild(canvas);
let background,enemy,bullet,gameOverImage,rocket;
let gameOver = false; // if true the game ends

let rocketx = canvas.width/2-24;
let rockety= canvas.height - 48;

let bulletList = [];

let score =0;

function Bullet(){
    this.x=0; 
    this.y=0;
    this.init = function(){
        this.x = rocketx+12;
        this.y = rockety;
        this.alive = true; 
        bulletList.push(this); // this =x,y,init
    };
    this.update = function(){
        this.y -=7; // bullet velocity
    };
    this.checkit =function(){
        for(let i=0;i < enemyList.length;i++){
            if(this.y <= enemyList[i].y  && this.x >=enemyList[i].x && this.x <= enemyList[i].x + 40){
                score++;
                this.alive = false;
                enemyList.splice(i,1);
            }
        }
    };
}

function generateRandom(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1));
    return randomNum;
}

let enemyList = [];

function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.y =0;
        this.x = generateRandom(0,canvas.width-64);
        enemyList.push(this);
    };
    this.update = function(){
        this.y +=2;

        if(this.y >= canvas.height - 64){
            gameOver=true;
        }
    };
}


function loadImage() {
  background = new Image();
  background.src = "image/background.gif";

  enemy = new Image();
  enemy.src = "image/enemy.png";

  bullet = new Image();
  bullet.src = "image/bullet.png";

  gameOverImage = new Image();
  gameOverImage.src = "image/gameover.gif";

  rocket = new Image();
  rocket.src = "image/rocket.png";

  boom = new Image();
  boom.scr = "image/boom.png";
}

let keysDown = {};
function setKeyboard(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] =true;
    });
     document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet();
        }
     });
}

function createBullet(){
    let b = new Bullet();
    b.init(); 
} 

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },1000);// millisecond
    
}

function update(){
    if(39 in keysDown){
        rocketx += 5; // rocket velocity
    } // right
    if(37 in keysDown) {
        rocketx -=5;
    }
    if(rocketx <=0){
        rocketx = 0;
    }
    if(rocketx >= canvas.width-48){
        rocketx = canvas.width- 48;
    }

    for(let i =0; i < bulletList.length;i++) {
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkit();
        }
    }
    for(let i =0; i < enemyList.length;i++) {
        enemyList[i].update();
    }
}

function render(){
   ctx.drawImage(background,0,0,canvas.width,canvas.height);
   ctx.drawImage(rocket,rocketx,rockety);
   ctx.fillText(`Score: ${score}`,10,20);
   ctx.fillStyle="white";
   ctx.font="20px Arial";

   for(let i=0; i<bulletList.length;i++){
    if(bulletList[i].alive){
        ctx.drawImage(bullet, bulletList[i].x, bulletList[i].y);
    }
   }
   for(let i=0; i<enemyList.length;i++){
    ctx.drawImage(enemy, enemyList[i].x, enemyList[i].y);
   }
}

function main() {
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }
    else{
        ctx.drawImage(gameOverImage,10,100,380,380); // change gamover image and size
    }
}

loadImage();
setKeyboard();
createEnemy();
main();