

const playerStandLeft=new Image();
playerStandLeft.src="spriteStandLeft.png";
const playerStandRight=new Image();
playerStandRight.src="spriteStandRight.png";
const playerRunLeft=new Image();
playerRunLeft.src="spriteRunLeft.png";
const playerRunRight=new Image();
playerRunRight.src="spriteRunRight.png";

const startboard=new Image();
startboard.src="335-3351523_monopoly-board-start (1).png";
const flag=new Image();
flag.src="696628.png";

const backgroundImage=new Image();
backgroundImage.src="background.png";
const hillImage=new Image();
hillImage.src="hills.png";

const raisedPlatform=new Image();
raisedPlatform.src="platformSmallTall.png";

const platformImage=new Image();
platformImage.src="platform.png"


const winnerContainer=document.querySelector(".winner")
// console.log(platformImage)
const canvas=document.querySelector('canvas');
const innerwidth=window.innerWidth;
const innerheight=window.innerHeight;


canvas.width=innerwidth-10;
canvas.height=innerheight-10;
var c=canvas.getContext('2d');



window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
})



function randomIntreger(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}


let keys={
    right:{
        pressed:false
    },
    left:{
        pressed:false
    }

}


const gravity=1;
//Player Class
function  Player(x,y,width,height,velocity){
    this.speed=10;
    this.width=width;
    this.height=height;
    this.velocity=velocity;
    this.x=x;
    this.y=y;
    this.image=playerStandRight;
    this.frame=0;
    this.sprites={
        stand:{
            right:playerStandRight,
            left:playerStandLeft,
            cropWidth:177,
            width:66
        },
        run:{
            right:playerRunRight,
            left:playerRunLeft,
            cropWidth:341,
            width:127.875
        }
    }
    this.currentSpritrSheet=this.sprites.stand.right;
    this.currentCropWidth=177;

    // this.color='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase();
    this.color="blue";
     this.draw=function(){
        // c.beginPath();
        // c.fillStyle=this.color;
        // c.fillRect(this.x,this.y,this.width,this.height)
        // c.fill();
        c.drawImage(this.currentSpritrSheet,
            this.currentCropWidth * this.frame,
            0,
            this.currentCropWidth,
            400,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
    this.update=function(){
        this.frame++;
        if(this.frame>58 && (this.currentSpritrSheet==this.sprites.stand.right ||this.currentSpritrSheet==this.sprites.stand.left )){
            this.frame=0;
        }
        else if(this.frame>30 && (this.currentSpritrSheet==this.sprites.run.right ||this.currentSpritrSheet==this.sprites.run.left)){
            this.frame=0;
        }
        this.draw();
        this.y+=this.velocity.y;
        this.x+=this.velocity.x;
        if(this.y+this.height+this.velocity.y<=canvas.height){
            this.velocity.y+=gravity;
        }
        // else{
        //     this.velocity.y=0;
        // }
    }
}




//platform class
class Platforn{
    constructor(x,y,image){
        this.image=image;
        this.width=700;
        this.height=130;
        this.x=x;
        this.y=y;
    }
    draw(){
        c.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    update(){
        this.draw();
    }
}
//raised Platform
class RaisedPlatform{
    constructor(x,y,image){
        this.image=image;
        this.width=300;
        this.height=200;
        this.x=x;
        this.y=y;
    }
    draw(){
        c.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    update(){
        this.draw();
    }
}

//class for decorative things --hills ang backgroung
class GenericObject{
    constructor(x,y,width,height,image){
        this.image=image;
        this.width=width;
        this.height=height;
        this.x=x;
        this.y=y;
    }
    draw(){
        c.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    update(){
        this.draw();
    }
}


let background=new GenericObject(0,0,canvas.width*2,canvas.height,backgroundImage);
let hills=new GenericObject(-1,100,canvas.width*4,canvas.height+20,hillImage);

let winOffset=0;

let player;
let startBoard;
let Flag;
// const platform=new Platforn(400,600,200,10);
let platforms=[]




function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerwidth,innerheight);
    // platform.update();

    background.update();
    hills.update();
    startBoard.update();
    Flag.update();

    platforms.forEach(platform=>{
        platform.update();
    })
    player.update();



    //condition for left and right movement of the player
    if(keys.right.pressed && player.x<600){
        player.velocity.x=player.speed;
    }
    else if((keys.left.pressed && player.x>200)|| (keys.left.pressed && player.x>0 && winOffset==0)){
        player.velocity.x=-player.speed;
    }
    else{
        player.velocity.x=0
        if(keys.right.pressed && winOffset<4411){
            winOffset+=5;
            platforms.forEach(platform=>{
                // platform.update();
                platform.x-=player.speed;
                Flag.x-=player.speed/15;
                // console.log(Flag.x)
            })
            hills.x-=player.speed* 0.66;
            startBoard.x-=player.speed* 0.66;
            console.log(winOffset)
        }
        else if(keys.left.pressed && winOffset>0){
            winOffset-=5;
            platforms.forEach(platform=>{
                // platform.update();
                platform.x+=player.speed;
                Flag.x+=player.speed/15;
            })
            hills.x+=player.speed* 0.66;
            startBoard.x+=player.speed* 0.66;
        }
    }
    //platform collision detection
    platforms.forEach(platform=>{
        if(player.y+player.height<=platform.y && player.y+player.height+player.velocity.y >=platform.y && player.x+player.width>=platform.x && player.x<platform.x+platform.width){
            player.velocity.y=0;
        }
    })

    //win condition
    if(winOffset>4400){
        // alert("you win")
        winnerContainer.classList.add("active")
    }
    //loose condition
    if(player.y-50>canvas.height){
        // alert("you loose")
        init();
    }
}
async function init(){
    background=new GenericObject(0,0,canvas.width*2,canvas.height,backgroundImage);
    hills=new GenericObject(-1,100,canvas.width*4,canvas.height+20,hillImage);
    startBoard= new GenericObject(50,100,200,100,startboard);

    // Flag=new GenericObject(100,canvas.height-400,200,100,flag)

    player=new Player(200,canvas.height-500,66,140,{x:0,y:1})
    // const platform=new Platforn(400,600,200,10);
    let raisedPlatform;
    let platformImage;
    await new Promise(resolve=>{
        platformImage=new Image()
        platformImage.addEventListener('load', () => resolve(platformImage));
        platformImage.src="platform.png";
    })
    await new Promise(resolve=>{
        raisedPlatform=new Image()
        raisedPlatform.addEventListener('load', () => resolve(raisedPlatform));
        raisedPlatform.src="platformSmallTall.png"
    })
    Flag=new GenericObject(platformImage.width*15.2,canvas.height-295,150,200,flag);
    platforms=[
        // new Platforn(platformImage.width*14+130,canvas.height-100,platformImage),
        // new RaisedPlatform(platformImage.width*7.7-10,canvas.height-295,raisedPlatform),
        new RaisedPlatform(platformImage.width*7.7-10,canvas.height-295,raisedPlatform),
       
        new RaisedPlatform(platformImage.width*3.5,canvas.height-295,raisedPlatform),
        new RaisedPlatform(platformImage.width*12.7+80,canvas.height-295,raisedPlatform),
        new Platforn(-1,canvas.height-100,platformImage),new Platforn(platformImage.width+115,canvas.height-100,platformImage),
        new Platforn(platformImage.width*2+450,canvas.height-100,platformImage),new Platforn(platformImage.width*3.5+275,canvas.height-100,platformImage),
        new Platforn(platformImage.width*5.8,canvas.height-100,platformImage),new Platforn(platformImage.width*7,canvas.height-100,platformImage),
        new Platforn(platformImage.width*9+80,canvas.height-100,platformImage),
        new Platforn(platformImage.width*10.85+80,canvas.height-100,platformImage),new Platforn(platformImage.width*12+110,canvas.height-100,platformImage),
        new Platforn(platformImage.width*14+130,canvas.height-100,platformImage),new Platforn(platformImage.width*15.2+130,canvas.height-100,platformImage),
    ]
    winOffset=0;
}
init();

(async ()=>{
    await init();
    animate();
})()

//aadding keyboard listener
addEventListener("keydown",({keyCode})=>{
    // console.log(keyCode);
    switch(keyCode){
        case 65:
            // console.log("left");
            keys.left.pressed=true;
            player.currentSpritrSheet=player.sprites.run.left;
            player.currentCropWidth=player.sprites.run.cropWidth;
            player.width=player.sprites.run.width;
            break;
        case 83:
            // console.log("down");
            break;
        case 68:
            // console.log("right");
            // player.velocity.x=2;
            keys.right.pressed=true;
            player.currentSpritrSheet=player.sprites.run.right;
            player.currentCropWidth=player.sprites.run.cropWidth;
            player.width=player.sprites.run.width;
            break;
        case 87:
            // console.log("up");
            if(player.velocity.y==0){
                player.velocity.y=-20;
            }
            break;
        }
        // console.log(keys.right.pressed);
})
addEventListener("keyup",({keyCode})=>{
    // console.log(keyCode);
    switch(keyCode){
        case 65:
            // console.log("left");
            keys.left.pressed=false;
            player.currentSpritrSheet=player.sprites.stand.left;
            player.currentCropWidth=player.sprites.stand.cropWidth;
            player.width=player.sprites.stand.width;
            break;
        case 83:
            // console.log("down");
            break;
        case 68:
            // console.log("right");
            // player.velocity.x=0;
            keys.right.pressed=false;
            player.currentSpritrSheet=player.sprites.stand.right;
            player.currentCropWidth=player.sprites.stand.cropWidth;
            player.width=player.sprites.stand.width;

            break;
        case 87:
            // console.log("up");
            // player.velocity.y-=20;
            break;
    }
})