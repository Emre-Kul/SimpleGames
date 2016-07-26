////////////LISTENERS
document.addEventListener('keydown',function(event){downKey(event.keyCode);});
document.addEventListener('resize',resizeCanvas);
////////////END

////////VARIABLES
var myVar = setInterval(runAlways,75);
window.onload = init;
var c = document.getElementById("mygamecanvas");
var ctx = c.getContext("2d");
/////////END

/////////CANVAS LISTENERS
c.addEventListener('click',clickCanvas);
/////////END

//////OBJECTS
var snakeCoords = [];
var directionQueue = [];
var keys = {
	down : 40,
	right : 39,
	up : 38,
	left : 37
}
//arrows => 40,39,38,37 down,right,up,left
//s,d,w,a => 83,68,87,65
var gameOpt = {
	score : 0,
	highScore : 0,
	shapeSize : 10,
	grow : 5,
	width : 500,
	height : 500,
	backgroundColor : "#ffccff",
	isFinish : false,
	isBegin : false
}
var baitOpt = {
	x : 0,
	y : 0,
	color : "#009900",
	maxScore : 0,
	currentScore : 0
}
var snakeOpt = {
	size : 1,
	isDead : false,
	color : "#4d0000"
	}
var directionEnum = {
	NONE : 0,
	LEFT : 1,
	RIGHT : 2,
	UP : 3,
	DOWN : 4
}
//////END

//////DRAW FUNCTIONS
function drawBait(){
	ctx.fillStyle = baitOpt.color;
	ctx.fillRect(baitOpt.x,baitOpt.y,gameOpt.shapeSize,gameOpt.shapeSize);
}
function drawSnake(){
	ctx.fillStyle = snakeOpt.color;
		for(i = 0;i < snakeOpt.size*2;i+=2){
			ctx.fillRect(snakeCoords[i],snakeCoords[i+1],gameOpt.shapeSize,gameOpt.shapeSize);
		}
	}
function drawScore(){
	ctx.font = "12px Arial";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "left";
	ctx.fillText("Score : "+gameOpt.score,10,20);	
}
function drawMap(){
	ctx.fillStyle = gameOpt.backgroundColor;
	ctx.fillRect(0,0,gameOpt.width,gameOpt.height);
}
function clearBackground(){
	ctx.clearRect(0,0,c.width,c.height);
}
function drawMessageBox(message,showscore){
	ctx.fillStyle = "rgba(0,0,66,0.7)";
	ctx.fillRect(gameOpt.width/2-100,gameOpt.height/2-75,200,150);
    ctx.font = "16px Arial";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
	if(showscore){
		ctx.fillText(message,gameOpt.width/2,gameOpt.height/2-60);
		ctx.fillText("Score : "+gameOpt.score,gameOpt.width/2,gameOpt.height/2-30);
		ctx.fillText("Highest Score : "+gameOpt.highScore,gameOpt.width/2,gameOpt.height/2);
	}
	else 
		ctx.fillText(message,gameOpt.width/2,gameOpt.height/2);
	ctx.fillText("Click game screen to play!",gameOpt.width/2,gameOpt.height/2+40);
	ctx.fillText("Coded By EmreKul.",gameOpt.width/2,gameOpt.height/2+60);
}
//////END

//////LISTENERS FUNCTIONS
function clickCanvas(){
	if(gameOpt.isFinish || snakeOpt.isDead){
		init();
	}
	if(!gameOpt.isBegin)
		gameOpt.isBegin = true;
	
	
}
function downKey(key){
	switch(key){
		case keys.left:
		if(directionQueue[directionQueue.length-1] != directionEnum.RIGHT && directionQueue[directionQueue.length-1] != directionEnum.LEFT)
				directionQueue.push(directionEnum.LEFT);
		break;
		case keys.up:
		if(directionQueue[directionQueue.length-1] != directionEnum.DOWN && directionQueue[directionQueue.length-1] != directionEnum.UP)
			directionQueue.push(directionEnum.UP);
		break;
		case keys.right:
		if(directionQueue[directionQueue.length-1] != directionEnum.LEFT && directionQueue[directionQueue.length-1] != directionEnum.RIGHT)
			directionQueue.push(directionEnum.RIGHT);
		break;
		case keys.down:
		if(directionQueue[directionQueue.length-1] != directionEnum.UP && directionQueue[directionQueue.length-1] != directionEnum.DOWN)
			directionQueue.push(directionEnum.DOWN);
		break;
	}
}
function resizeCanvas(){
	var canvas = document.getElementById('mygamecanvas');
	var ctx = canvas.getContext('2d');
	canvas.width = gameOpt.width;
	canvas.height = gameOpt.height;
	}
//////END

//////GAME FUNCTIONS
function spawnBait(){
	var colapseSnake = true;
	maxLoop = (gameOpt.width/gameOpt.shapeSize)*(gameOpt.height/gameOpt.shapeSize);
	baitOpt.x = Math.floor(Math.random()*Math.floor((gameOpt.width-1)/gameOpt.shapeSize))*gameOpt.shapeSize;
	baitOpt.y = Math.floor(Math.random()*Math.floor((gameOpt.height-1)/gameOpt.shapeSize))*gameOpt.shapeSize;
	while(colapseSnake && maxLoop > 0){
		colapseSnake = false;
	    i = 0;
		while(!colapseSnake && i < snakeOpt.size*2){
			if(snakeCoords[i] == baitOpt.x && snakeCoords[i+1] == baitOpt.y){
				colapseSnake = true;
				maxLoop--;
				baitOpt.x += gameOpt.shapeSize;
				if(baitOpt.x >= gameOpt.width-gameOpt.shapeSize){
					baitOpt.x = gameOpt.shapeSize;
					baitOpt.y += gameOpt.shapeSize;
					if(baitOpt.y >= gameOpt.height-gameOpt.shapeSize)
						baitOpt.y = gameOpt.shapeSize;
				}
			}
		i+=2;
		}
	}
	if(maxLoop == 0)gameOpt.isFinish = true;
}
function controlSnakeDead(){
	var i = 2;
	while(i < snakeOpt.size*2 && !snakeOpt.isDead){
		if(snakeCoords[0] == snakeCoords[i] && snakeCoords[1] == snakeCoords[i+1])
			snakeOpt.isDead = true;
		i+=2;
	}
	if(snakeCoords[0] < 0 || snakeCoords[0] > gameOpt.width-gameOpt.shapeSize || snakeCoords[1] < 0 || snakeCoords[1] > gameOpt.height-gameOpt.shapeSize)
		snakeOpt.isDead = true;
}
function spawnSnake(){
	snakeCoords[0] = 0;
	snakeCoords[1] = 0;
}
function controlSnakeEatBait(){
	if(snakeCoords[0] == baitOpt.x && snakeCoords[1] == baitOpt.y){
		spawnBait();
		snakeOpt.size += gameOpt.grow;
		gameOpt.score += baitOpt.currentScore;
		baitOpt.currentScore = baitOpt.maxScore;
		baitOpt.maxScore+=10;
		if(gameOpt.score > gameOpt.highScore)gameOpt.highScore = gameOpt.score;
	}
	else if(baitOpt.currentScore > 1)
		baitOpt.currentScore--;
}
function moveSnake(){
	
	if(directionQueue.length > 1)directionQueue.splice(0,1);
	if(directionQueue[0] != directionEnum.NONE)
		for(var i = snakeOpt.size*2-1;i > 2;i-=2){
			snakeCoords[i] = snakeCoords[i-2];
			snakeCoords[i-1] = snakeCoords[i-3];
		}		
	
	switch(directionQueue[0]){
		case directionEnum.LEFT:
			snakeCoords[0]-=gameOpt.shapeSize;
		break;
		case directionEnum.RIGHT:
			snakeCoords[0]+=gameOpt.shapeSize;
		break;
		case directionEnum.UP:
			snakeCoords[1]-=gameOpt.shapeSize;
		break;
		case directionEnum.DOWN:
			snakeCoords[1]+=gameOpt.shapeSize;
		break;
	}
	controlSnakeEatBait();
	controlSnakeDead();
}
//END

/////MAIN FUNCTIONS
function init(){
	gameOpt.isFinish = false;
	
	snakeOpt.isDead = 0;
	snakeOpt.size = 1;
	
	gameOpt.score = 0;
	
	snakeCoords = [];
	directionQueue = [directionEnum.RIGHT];
	baitOpt.maxScore = 100;
	baitOpt.currentScore = 100;
	
	spawnSnake();
	spawnBait();
	resizeCanvas();
	
	}
function runAlways(){
	if(!snakeOpt.isDead && !gameOpt.isFinish && gameOpt.isBegin)moveSnake();
	clearBackground();
	drawMap();
	drawSnake();
	drawBait();
	drawScore();
	if(snakeOpt.isDead)
		drawMessageBox("You are dead!",true);
	else if(gameOpt.isFinish)
		drawMessageBox("Game finished,there are no empty spot...",true);
	else if(!gameOpt.isBegin)
		drawMessageBox("Welcome",false);
}
/////END


