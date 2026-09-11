/*

The Game Project

I find it funny to keep this here so i hope thats not an issue

*/
var gameChar_x
var gameChar_y
var floorPos_y

var isLeft
var isRight
var isFalling
var isPlummeting

var collectable
var canyon
var tree
var mountain
var cloud

var gameChar_world_x

var trees_x
var scrollpos = 0

var game_score = 0
var lives = 3
var gameOver = false
var livesAwarded = 0
var flagpole
var gameOverMusic

var platforms
var gameOverVideo
var isSafari = false

var velocity = 0
var jump_strength = -13//-14.5
var gravity = 0.56
var jump_cut = 0.5

var coyote_time = 8
var coyote_counter = 0

var jump_buffer = 8
var jump_buffer_counter = 0

var move_speed = 4
var bhop_speed = 0
var bhop_bonus = 0.5
var bhop_max = 3
var bhop_window = 6
var bhop_counter = 0

var dropThrough = false
var dropThroughPlatform = null

var enemy

function setup()
{
	createCanvas(1024, 576)
	floorPos_y = height * 3/4
	gameOverMusic = loadSound("assets/GameOver.mp3")

	isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)// Detect if user is on safari to avoid bug cause due to intercompany pigheadedness regarding transparency file compatibility on chromium and webkit browsers

	if (isSafari) {
		videoSrc = 'assets/CurtainsClosingChromaKey.mp4'
	} else {
		videoSrc = 'assets/CurtainsClosingChromaKey.webm'
	}
	
	gameOverVideo = createVideo(videoSrc)
	gameOverVideo.elt.onloadeddata = function(){
    console.log("Game Over video loaded");
	}

	gameOverVideo.hide()
	gameOverVideo.volume(0)

    trees = [{
		x_pos: 900,
		y_pos: 220,},
	{
		x_pos: 1300,
		y_pos: 220,},
	{
		x_pos: 2100,
		y_pos: 220,},
	{
		x_pos: 2500,
		y_pos: 220,},
	{
		x_pos: 3200,
		y_pos: 220,},
	{
		x_pos: 4000,
		y_pos: 220,
	}]

	mountain = [{
		x_pos: 590,
		y_pos: 120,},
	{
		x_pos: 1800,
		y_pos: 120,},
	{
		x_pos: 2200,
		y_pos: 120,},
	{
		x_pos: 3100,
		y_pos: 120,},
	{
		x_pos: 4300,
		y_pos: 120,
	}]

	cloud = [{
		x_pos: 200,
		y_pos: 100,},
	{
		x_pos: 1200,
		y_pos: 100,},
	{
		x_pos: 1800,
		y_pos: 100,},
	{
		x_pos: 2600,
		y_pos: 140,},
	{
		x_pos: 3000,
		y_pos: 100,},
	{
		x_pos: 3500,
		y_pos: 140,},
	{
		x_pos: 4000,
		y_pos: 60,},
	{
		x_pos: 4700,
		y_pos: 100,
	}]

	canyons = [
		{
			x_pos: 100,
			width: 150},
		{
			x_pos: 740,
			width: 150},
		{
			x_pos: 1400,
			width: 150},
		{
			x_pos: 2250,
			width: 150}
		]

	flagpole = { 
		isReached: false,
		x_pos: 5000
	}

	startGame()
}

function startGame(){
	gameChar_x = width/2
	gameChar_y = floorPos_y
	velocity = 0 //stops velocity carry over from previous lives
	coyote_counter = 0 //resets coyote time counter variable to avoid jumping after death
	jump_buffer_counter = 0 //resets jump buffer counter variable to avoid jumps carrying over after death
	dropThrough = false
	dropThroughPlatform = null //resets variable related to dropping through platforms
	bhop_speed = 0 //resets bunny hop speed to avoid carry over from previous lives
	bhop_counter = 0 //resets bunny hop counter to avoid carry over from previous lives

	gameChar_world_x = gameChar_x - scrollpos
	scrollpos = 0
	game_score = 0
	livesAwarded = 0
	flagpole.isReached = false

	isLeft = false
	isRight = false
	isFalling = false
	isPlummeting = false

	collectables = [
	{
		x_pos: 360,
		y_pos: 400,
		size: 50,
		isFound: false}, 
	{
		x_pos: 810,
		y_pos: 390,
		size: 50,
		isFound: false},
	{
		x_pos: 1700,
		y_pos: 290,
		size: 50,
		isFound: false},
	{
		x_pos: 1900,
		y_pos: 290,
		size: 50,
		isFound: false},
	{
		x_pos: 2320,
		y_pos: 390,
		size: 50,
		isFound: false}
	]

	platforms = []

	platforms.push(createPlatforms(0, floorPos_y-100, 200))
	platforms.push(createPlatforms(300, floorPos_y-100, 400))
	platforms.push(createPlatforms(1600, floorPos_y-100, 400))
	platforms.push(createPlatforms(2200, floorPos_y-100, 200))
	platforms.push(createPlatforms(2800, floorPos_y-100, 1000))
	platforms.push(createPlatforms(2800, floorPos_y-200, 1000))

	enemy = []
	enemy.push(new Enemy(1100, floorPos_y, 100))
	enemy.push(new Enemy(1750, floorPos_y-100, 200))
	enemy.push(new Enemy(2500, floorPos_y, 500))
	enemy.push(new Enemy(3600, floorPos_y, 500))

	enemy.push(new Enemy(2800, floorPos_y, 500))
	
	enemy.push(new Enemy(2800, floorPos_y-100, 500))
	enemy.push(new Enemy(3300, floorPos_y-100, 500))
	enemy.push(new Enemy(2800, floorPos_y-200, 500))
	enemy.push(new Enemy(3000, floorPos_y-200, 500))
	enemy.push(new Enemy(3300, floorPos_y-200, 500))
}

function drawClouds(t_cloud){
	//shading
	fill(149, 155, 196)
	
	ellipse(t_cloud.x_pos, t_cloud.y_pos + 15, 155, 130)
	ellipse(t_cloud.x_pos - 80, t_cloud.y_pos + 12, 135, 75)
	ellipse(t_cloud.x_pos + 70, t_cloud.y_pos + 2, 155, 65)
	ellipse(t_cloud.x_pos + 70, t_cloud.y_pos + 2, 90, 90)

	//lighter bits
	fill(255,255,255)
    ellipse(t_cloud.x_pos, t_cloud.y_pos, 155, 130)
	ellipse(t_cloud.x_pos - 80, t_cloud.y_pos, 135, 75)
	ellipse(t_cloud.x_pos - 70, t_cloud.y_pos - 40, 90, 90)
	ellipse(t_cloud.x_pos + 70, t_cloud.y_pos - 5, 155, 55)
	ellipse(t_cloud.x_pos + 70, t_cloud.y_pos - 10, 90, 90)
	ellipse(t_cloud.x_pos + 70, t_cloud.y_pos - 30, 155, 75)
	ellipse(t_cloud.x_pos + 70, t_cloud.y_pos - 40, 120, 120)
	ellipse(t_cloud.x_pos + 20, t_cloud.y_pos - 40, 130, 135)
}

function drawMountains(t_mountain){
    //sunny side
	fill(1, 145, 1)
	triangle(t_mountain.x_pos - 175, t_mountain.y_pos + 312, t_mountain.x_pos, t_mountain.y_pos, t_mountain.x_pos + 175, t_mountain.y_pos + 312)
	triangle(t_mountain.x_pos, t_mountain.y_pos + 312, t_mountain.x_pos + 175, t_mountain.y_pos + 50, t_mountain.x_pos + 350, t_mountain.y_pos + 312)

    //shading
	fill(0, 110, 0)
	triangle(t_mountain.x_pos + 97.5, t_mountain.y_pos + 312, t_mountain.x_pos, t_mountain.y_pos, t_mountain.x_pos + 175, t_mountain.y_pos + 312)
	triangle(t_mountain.x_pos + 262.5, t_mountain.y_pos + 312, t_mountain.x_pos + 175, t_mountain.y_pos + 50, t_mountain.x_pos + 350, t_mountain.y_pos + 312)

	//little hideyhole
	rect(t_mountain.x_pos - 43.75, t_mountain.y_pos + 292, 10, 20, 50, 50, 0, 0)
}

function drawTrees(t_tree){
	//shading
	fill(166, 136, 7);
	ellipse(t_tree.x_pos - 65, t_tree.y_pos + 50, 100); // L middle
	ellipse(t_tree.x_pos + 95, t_tree.y_pos + 50, 100); // R middle
	ellipse(t_tree.x_pos - 40, t_tree.y_pos + 100, 100); // L bottom
	ellipse(t_tree.x_pos + 70, t_tree.y_pos + 100, 100); // R bottom

	//leaves
	fill(224, 184, 7)
	ellipse(t_tree.x_pos - 35, t_tree.y_pos - 10, 100) // L top
	ellipse(t_tree.x_pos + 65, t_tree.y_pos - 10, 100) // R top
	ellipse(t_tree.x_pos - 65, t_tree.y_pos + 40, 100) // L middle
	ellipse(t_tree.x_pos + 95, t_tree.y_pos + 40, 100) // R middle
	ellipse(t_tree.x_pos - 35, t_tree.y_pos + 90, 100) // L bot
	ellipse(t_tree.x_pos + 65, t_tree.y_pos + 90, 100) // R bot
	ellipse(t_tree.x_pos + 15, t_tree.y_pos + 40, 100) // Middle

	//trunk
	fill(255);
	rect(t_tree.x_pos, t_tree.y_pos, 30, 300)

	//trunk shadow
	fill(149, 155, 196);
	ellipse(t_tree.x_pos + 15, t_tree.y_pos + 300, 30.5)
	fill(255);
	ellipse(t_tree.x_pos + 15, t_tree.y_pos + 295, 30.5)

	//top leaves
	fill(224, 184, 7);
	ellipse(t_tree.x_pos + 15, t_tree.y_pos - 30, 110)
}

function drawCanyon(t_canyon){
    //hole
    fill(89, 87, 74)
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y)

    //light strip
    fill(112, 110, 94);
    rect(t_canyon.x_pos + 50, floorPos_y, 50, height - floorPos_y)

    fill(143, 140, 121)
    rect(t_canyon.x_pos + 62.5, floorPos_y, 25, height - floorPos_y)

    //top triangles
    fill(112, 110, 94)
    triangle(t_canyon.x_pos + 62.5, floorPos_y,
             t_canyon.x_pos, floorPos_y,
             t_canyon.x_pos + 62.5, floorPos_y + 13)

    triangle(t_canyon.x_pos + 87.5, floorPos_y,
             t_canyon.x_pos + t_canyon.width, floorPos_y,
             t_canyon.x_pos + 87.5, floorPos_y + 11)

    fill(143, 140, 121)
    triangle(t_canyon.x_pos + 62.5, floorPos_y,
             t_canyon.x_pos, floorPos_y,
             t_canyon.x_pos + 62.5, floorPos_y + 5.5)

    triangle(t_canyon.x_pos + 87.5, floorPos_y,
             t_canyon.x_pos + t_canyon.width, floorPos_y,
             t_canyon.x_pos + 87.5, floorPos_y + 5.5)

    //left crags
    fill(12, 117, 12)
    triangle(t_canyon.x_pos, floorPos_y,
             t_canyon.x_pos + 40, floorPos_y + 8,
             t_canyon.x_pos, floorPos_y + 58)

    triangle(t_canyon.x_pos, floorPos_y + 38,
             t_canyon.x_pos + 50, floorPos_y + 68,
             t_canyon.x_pos, floorPos_y + 108)

    triangle(t_canyon.x_pos, floorPos_y + 108,
             t_canyon.x_pos + 40, floorPos_y + 108,
             t_canyon.x_pos, floorPos_y + 178)

    //right crags
    triangle(t_canyon.x_pos + t_canyon.width, floorPos_y,
             t_canyon.x_pos + 104, floorPos_y + 8,
             t_canyon.x_pos + t_canyon.width, floorPos_y + 58)

    triangle(t_canyon.x_pos + t_canyon.width, floorPos_y + 38,
             t_canyon.x_pos + 114, floorPos_y + 88,
             t_canyon.x_pos + t_canyon.width, floorPos_y + 108)

    triangle(t_canyon.x_pos + t_canyon.width, floorPos_y + 118,
             t_canyon.x_pos + 94, floorPos_y + 98,
             t_canyon.x_pos + t_canyon.width, floorPos_y + 198)
}

function drawCollectable(t_collectable){
if(t_collectable.isFound == false)
{
	//shadow
    fill(122, 102, 0)
    ellipse(t_collectable.x_pos + 5, t_collectable.y_pos, t_collectable.size - 5, t_collectable.size + 7.5)

    //background
    fill(145, 121, 1)
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 5, t_collectable.size + 7.5)

    //main
    fill(224, 184, 7)
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 15, t_collectable.size - 2.5)

    //detail
    fill(145, 121, 1)
    rect(t_collectable.x_pos - 5.75, t_collectable.y_pos - 15, 11.5, 30)
}
}

function checkCollectable(t_collectable){
	if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50 && !t_collectable.isFound)
	{
		t_collectable.isFound = true;
		game_score += 100;
	}
}

function checkCanyon(t_canyon){
	if(gameChar_world_x > t_canyon.x_pos + 25 && gameChar_world_x < t_canyon.x_pos + t_canyon.width - 25 && gameChar_y >= floorPos_y)// I had to decrease the difficulty a slight bit by adding and subtracting the 10, was incredibly brutal otherwise hehe
	{
		isPlummeting = true
		
	}
}

function drawGameChar()
{
	push()
    translate(gameChar_x, gameChar_y) // move origin to the character position

	
//Jumping-left code	
	if(isLeft && isFalling){
    //Outlines
	stroke(50,205,50)
	strokeWeight(2.5)
	noFill()
	ellipse(9, -17, 25)
	ellipse(0, -15, 25)
	ellipse(-9, -17, 25)
	ellipse(-2.5, -32, 45)

	//Filled shapes
	noStroke()
	fill(0,255,0)
	ellipse(9, -17, 22)
	ellipse(0, -15, 22)
	ellipse(-9, -17, 22)
	ellipse(-2.5, -32, 40)

	//Eye white
	fill(255)
    ellipse(-2.5, -32, 14, 15)
    
	//Iris
	fill(0,255,0)
	ellipse(-2.5, -31, 7)
	
	//Pupil
	fill(34, 83, 115)
	ellipse(-2.5, -31, 3)

	//Eyelid
	fill(0,255,0)
    arc(-2.5, -32, 14, 15, PI, TWO_PI)

	//hat
	push()
    translate(- 9, - 41) // move origin to the hat position
    rotate(-PI / 3) // rotate 60 degrees counterclockwise
    fill(0)
    arc(0, -4, 30, 27, PI, TWO_PI) // draw the hat at the rotated origin

	//sash
	fill(255,0,0)
	rect(-15.5, -4.5, 31, 3) // draw the brim of the hat at the rotated origin

	//brim
	fill(0)
	rect(-17.5, -2, 35, 3, 40) // draw the brim of the hat at the rotated origin  
	
    pop()
	}

//Jumping-right code	
	else if(isRight && isFalling){
//Outlines
	stroke(50,205,50)
	strokeWeight(2.5)
	noFill()
	ellipse(9, -17, 25)
	ellipse(0, -15, 25)
	ellipse(-9, -17, 25)
	ellipse(2.5, -32, 45)

	//Filled shapes
	noStroke()
	fill(0,255,0)
	ellipse(9, -17, 22)
	ellipse(0, -15, 22)
	ellipse(-9, -17, 22)
	ellipse(2.5, -32, 40)

	//Eye white
	fill(255)
    ellipse(2.5, -32, 14, 15)
    
	//Iris
	fill(0,255,0)
	ellipse(2.5, -31, 7)
	
	//Pupil
	fill(34, 83, 115)
	ellipse(2.5, -31, 3)

	//Eyelid
	fill(0,255,0)
    arc(2.5, -32, 14, 15, PI, TWO_PI)

	//hat
	push()
    translate(- 9, - 41) // move origin to the hat position
    rotate(-PI / 3) // rotate 60 degrees counterclockwise
    fill(0)
    arc(0, -2, 30, 27, PI, TWO_PI) // draw the hat at the rotated origin

	//sash
	fill(255,0,0)
	rect(-15.5, -2.5, 31, 3) // draw the brim of the hat at the rotated origin

	//brim
	fill(0)
	rect(-17.5, 0, 35, 3, 40) // draw the brim of the hat at the rotated origin  
	
    pop()
	}

//Walking left code	
	else if(isLeft){
    //Outlines
	stroke(50,205,50)
	strokeWeight(2.5)
	noFill()
	ellipse(11, -17, 25)
	ellipse(0, -15, 25)
	ellipse(-11, -17, 25)
	ellipse(-2.5, -32, 35)

	//Filled shapes
	noStroke()
	fill(0,255,0)
	ellipse(11, -17, 22)
	ellipse(0, -15, 22)
	ellipse(-11, -17, 22)
	ellipse(-2.5, -32, 30)

	//Eye white
	fill(255)
    ellipse(-2.5, -32, 14, 15)
    
	//Iris
	fill(0,255,0)
	ellipse(-2.5, -31, 7)
	
	//Pupil
	fill(34, 83, 115)
	ellipse(-2.5, -31, 3)

	//Eyelid
	fill(0,255,0)
    arc(-2.5, -32, 14, 15, PI, TWO_PI)

	//hat
	push()
    translate(- 9, - 41) // move origin to the hat position
    rotate(-PI / 4) // rotate 45 degrees counterclockwise
    fill(0)
    arc(0, 0, 30, 27, PI, TWO_PI) // draw the hat at the rotated origin

	//sash
	fill(255,0,0)
	rect(-15.5, -1.5, 31, 3) // draw the brim of the hat at the rotated origin

	//brim
	fill(0)
	rect(-17.5, 1, 35, 3, 40) // draw the brim of the hat at the rotated origin
	
    pop()
	}

//Walking right code	
	else if(isRight){
    //Outlines
	stroke(50,205,50)
	strokeWeight(2.5)
	noFill()
	ellipse(11, -17, 25)
	ellipse(0, -15, 25)
	ellipse(-11, -17, 25)
	ellipse(2.5, -32, 35)

	//Filled shapes
	noStroke()
	fill(0,255,0)
	ellipse(11, -17, 22)
	ellipse(0, -15, 22)
	ellipse(-11, -17, 22)
	ellipse(2.5, -32, 30)

	//Eye white
	fill(255)
    ellipse(2.5, -32, 14, 15)
    
	//Iris
	fill(0,255,0)
	ellipse(2.5, -31, 7)
	
	//Pupil
	fill(34, 83, 115)
	ellipse(2.5, -31, 3)

	//Eyelid
	fill(0,255,0)
    arc(2.5, -32, 14, 15, PI, TWO_PI)

	//hat
	push()
    translate(- 9, - 41) // move origin to the hat position
    rotate(-PI / 4) // rotate 45 degrees counterclockwise
    fill(0)
    arc(0, 0, 30, 27, PI, TWO_PI) // draw the hat at the rotated origin

	//sash
	fill(255,0,0)
	rect(-15.5, -1.5, 31, 3) // draw the brim of the hat at the rotated origin

	//brim
	fill(0)
	rect(-17.5, 1, 35, 3, 40) // draw the brim of the hat at the rotated origin
	
    pop()
	}

//Jumping facing forwards code	
	else if(isFalling || isPlummeting){
    //Outlines
	stroke(50,205,50)
	strokeWeight(2.5)
	noFill()
	ellipse(9, -17, 25)
	ellipse(0, -15, 25)
	ellipse(-9, -17, 25)
	ellipse(0, -32, 45)

	//Filled shapes
	noStroke()
	fill(0,255,0)
	ellipse(9, -17, 22)
	ellipse(0, -15, 22)
	ellipse(-9, -17, 22)
	ellipse(0, -32, 40)

	//Eye white
	fill(255)
    ellipse(0, -32, 14, 15)
    
	//Iris
	fill(0,255,0)
	ellipse(0, -31, 7)
	
	//Pupil
	fill(34, 83, 115)
	ellipse(0, -31, 3)

	//Eyelid
	fill(0,255,0)
    arc(0, -32, 14, 15, PI, TWO_PI)
	//arc(0, -32, 14, 14, PI, TWO_PI) smug

	//hat
	push()
    translate(- 9, - 41) // move origin to the hat position
    rotate(-PI / 3) // rotate 60 degrees counterclockwise
    fill(0)
    arc(0, -2, 30, 27, PI, TWO_PI) // draw the hat at the rotated origin

	//sash
	fill(255,0,0)
	rect(-15.5, -2.5, 31, 3) // draw the brim of the hat at the rotated origin

	//brim
	fill(0)
	rect(-17.5, 0, 35, 3, 40) // draw the brim of the hat at the rotated origin  
	
    pop()
	}

//Standing facing forwards	
	else{
    //Outlines
	stroke(50,205,50)
	strokeWeight(2.5)
	noFill()
	ellipse(11, -17, 25)
	ellipse(0, -15, 25)
	ellipse(-11, -17, 25)
	ellipse(0, -32, 35)

	//Filled shapes
	noStroke()
	fill(0,255,0)
	ellipse(11, -17, 22)
	ellipse(0, -15, 22)
	ellipse(-11, -17, 22)
	ellipse(0, -32, 30)

	//Eye white
	fill(255)
    ellipse(0, -32, 14, 15)
    
	//Iris
	fill(0,255,0)
	ellipse(0, -31, 7)
	
	//Pupil
	fill(34, 83, 115)
	ellipse(0, -31, 3)

	//Eyelid
	fill(0,255,0)
    arc(0, -32, 14, 15, PI, TWO_PI)

	//hat
	push()
    translate(- 9, - 41) //move origin to hat position
    rotate(-PI / 4) //rotate 45 degrees counterclockwise
    fill(0)
    arc(0, 0, 30, 27, PI, TWO_PI) //draw the hat at the rotated origin

	//sash
	fill(255,0,0)
	rect(-15.5, -1.5, 31, 3) //draw the hat sash at the rotated origin

	//brim
	fill(0)
	rect(-17.5, 1, 35, 3, 40) //draw hat brim at the rotated origin
	
    pop()
	}
	pop()
    strokeWeight(1)
}
function renderFlagpole(){
	push()
	translate(flagpole.x_pos, floorPos_y)
	stroke(150)
	strokeWeight(5)
	line(0, 0, 0, -250)

	noStroke()
	fill(255, 0, 0)

	if(flagpole.isReached){
		rect(0, -250, 50, 30)
	}
	else{
		rect(0, -50, 50, 30)
	}

	pop()
}
function checkFlagpole(){
	var d = abs(gameChar_world_x - flagpole.x_pos)
	if(d < 15){
		flagpole.isReached = true
	}
}

function createPlatforms(x, y, length){
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function(){
			fill(100, 50, 0)
			rect(this.x, this.y, this.length, 20)
		},
		checkContact: function(gameChar_x, gameChar_y, platformY){
			if(gameChar_x > this.x && gameChar_x < this.x + this.length){ //unsure if this bit is needed  && gameChar_y > this.y && gameChar_y < this.y + 20
				if(platformY === undefined){
					return abs(this.y - gameChar_y) < 5
				}
				if(platformY <= this.y && gameChar_y >= this.y){
					return true
				}
			}
			return false
		}
	}
	return p
}

function Enemy(x, y, range){
	this.x = x
	this.y = y
	this.range = range
	
	this.currentX = x
	this.inc = 1
	this.isDefeated = false

	this.update = function(){
		this.currentX += this.inc
		if(this.currentX >= this.x + this.range){
			this.inc = -1
		}
		else if(this.currentX <= this.x){
			this.inc = 1
		}
	}

	this.draw = function(){
		if(this.isDefeated) return
		this.update()
		fill(255, 0, 0)
		ellipse(this.currentX, this.y - 25, 50, 50)
		fill(0)
		ellipse(this.currentX - 10, this.y - 30, 10, 10)
		ellipse(this.currentX + 10, this.y - 30, 10, 10)
		fill(255, 0, 0)
		rect(this.currentX - 15, this.y - 15, 30, 20)
	}

}

function draw()
{
	if(gameOver == true){
		background(0)
		image(gameOverVideo, width/2 - 512, height/2 - 288, 1024, 576)
		textSize(50)
		text("Game Over.", width/2, height/2)

		textSize(20)
		text("Press ENTER to try again.", width/2, height/2 + 50)
		return
	}
	background(100, 155, 255); //sky
	noStroke()
	fill(0,155,0)
	rect(0, floorPos_y, width, height - floorPos_y) //floor

	push()
	translate(scrollpos, 0)

	for(var i = 0; i < cloud.length; i++){
		drawClouds(cloud[i])
	}
	
	for(var i = 0; i < mountain.length; i++){
		drawMountains(mountain[i])
	}

	for(var i = 0; i < platforms.length; i++){
		platforms[i].draw()
	}

	for(var i = 0; i < collectables.length; i++){
		drawCollectable(collectables[i])
		checkCollectable(collectables[i])
	}

	for(var i = 0; i < canyons.length; i++){
		drawCanyon(canyons[i])
		checkCanyon(canyons[i])
	}
	
	for(var i = 0; i < trees.length; i++){
		drawTrees(trees[i])
	}

	for(var i = 0; i < platforms.length; i++){
		platforms[i].draw()
	}

	renderFlagpole()
	checkFlagpole()

	for(var i = 0; i < enemy.length; i++){
		enemy[i].draw()
	}

	pop()

	if(floor(game_score / 1000) > livesAwarded){
		lives++
		livesAwarded++
	}
	textSize(20)
	text("Score: " + game_score, 20, 20)
	text("Lives: " + lives, 20, 40)
	text("Bhop Speed: " + bhop_speed, 20, 60)

	
//Game character
	drawGameChar()

//movement code
if(!isPlummeting){
	var current_speed = move_speed + bhop_speed
if(isLeft==true){
	if(gameChar_x > width * 0.4){
		gameChar_x -= current_speed;
	}
	else{
		scrollpos += current_speed
	}
}
if(isRight==true){
	if(gameChar_x < width * 0.6){
		gameChar_x += current_speed;
	}
	else{
		scrollpos -= current_speed
	}
}
}

//gravity
gameChar_world_x = gameChar_x - scrollpos

//jump buffer
if(jump_buffer_counter > 0){
	jump_buffer_counter--
}

if(!isFalling && bhop_counter > 0){
	bhop_counter--

	if(bhop_counter == 0 && bhop_speed > 0){
		bhop_speed = max(0, bhop_speed - bhop_bonus)

		if(bhop_speed > 0){
			bhop_counter = bhop_window
		}
	}
}

var platformY = gameChar_y
velocity += gravity
gameChar_y += velocity

var isContact = false

//platform collision detection
for(var i = 0; i < platforms.length; i++){
	if(platforms[i] != dropThroughPlatform &&
	   platforms[i].checkContact(gameChar_world_x, gameChar_y, platformY) == true &&
	   velocity >= 0){

        isContact = true
        gameChar_y = platforms[i].y
        velocity = 0
        break
    }
}

if(dropThrough && dropThroughPlatform != null){
	if(gameChar_y > dropThroughPlatform != null){
		dropThrough = false
		dropThroughPlatform = null
	}
}

//enemy collision detection
for(var i = 0; i < enemy.length; i++){
	if(enemy[i].isDefeated) continue

	var enemyX = enemy[i].currentX
	var enemyY = enemy[i].y

	var xDist = abs(gameChar_world_x - enemyX)
	var enemyHead = enemyY - 50
	var enemyFeet = enemyY
	var playerLeft = gameChar_world_x - 20
	var playerRight = gameChar_world_x + 20
	var playerTop = gameChar_y - 50
	var enemyLeft = enemyX - 25
	var enemyRight = enemyX + 25
	
	//Above(stomp)
	if(xDist < 35 && platformY <= enemyHead && gameChar_y >= enemyHead && velocity > 0){
		enemy[i].isDefeated = true
		gameChar_y = enemyHead
		velocity = jump_strength * 0.7
		isFalling = true
		//bhop_counter = bhop_window
		game_score += 100
	}

	//Below
	else if(xDist < 35 && platformY >= enemyFeet && gameChar_y <= enemyFeet && velocity < 0){
		lives--
		if(lives > 0){
			startGame()
		}
		else{
			isPlummeting = false
			isFalling = false
			velocity = 0

			gameOver = true
			gameOverMusic.play()
			gameOverVideo.stop()
			gameOverVideo.play()
		}
	}

	//Side collision
	else if(playerRight > enemyLeft &&
			playerLeft < enemyRight &&
			gameChar_y > enemyHead &&
			playerTop < enemyFeet){
		lives--
		if(lives > 0){
			startGame()
		}
		else{
			isPlummeting = false
			isFalling = false
			velocity = 0

			gameOver = true
			gameOverMusic.play()
			gameOverVideo.stop()
			gameOverVideo.play()
		}
	}
	
}

//coyote time
if(isContact || gameChar_y >= floorPos_y){
	coyote_counter = coyote_time
}
else if(coyote_counter > 0){
	coyote_counter--
}

if(gameChar_y >= floorPos_y && isPlummeting == false){
    gameChar_y = floorPos_y
    velocity = 0

	if(isFalling){
	bhop_counter = bhop_window
	}

    isFalling = false

	if(jump_buffer_counter > 0){
		velocity = jump_strength
		jump_buffer_counter = 0
		isFalling = true
	}
}
else if(isContact == false){
    isFalling = true
}
else{
	if(isFalling){
	bhop_counter = bhop_window
	}

    isFalling = false

	if(jump_buffer_counter > 0){
		velocity = jump_strength
		jump_buffer_counter = 0
		isFalling = true
	}
}
if(isPlummeting){
	gameChar_y += 5
}

if(gameChar_y > height){
	lives--
	if(lives > 0){
		startGame()
	}
	else{
		isPlummeting = false
		isFalling = false
		velocity = 0

		gameOver = true
		gameOverMusic.play()
		gameOverVideo.stop()
		gameOverVideo.play()
	}
}

gameChar_world_x = gameChar_x - scrollpos

}
function keyPressed(){
	if(keyCode == 37){
		isLeft = true
	}
	else if(keyCode == 39){
		isRight = true
	}
	else if(keyCode == 32){
		if(isPlummeting){
			jump_buffer_counter = 0
			return
		}
		jump_buffer_counter = jump_buffer

		var canJump = gameChar_y == floorPos_y

		for(var i = 0; i < platforms.length; i++){
			if(platforms[i] != dropThroughPlatform &&
			   platforms[i].checkContact(gameChar_world_x, gameChar_y) == true){
				canJump = true
				break
			}
		}
		if(canJump || coyote_counter > 0){
			velocity = jump_strength
			coyote_counter = 0
			jump_buffer_counter = 0
			isFalling = true

			if(bhop_counter > 0){
				bhop_speed += bhop_bonus
				bhop_counter = 0
			}
			if(bhop_speed >= bhop_max){
				bhop_speed = bhop_max
			}
		}
	}
	if(keyCode == ENTER && gameOver == true){
		isPlummeting = false
		isFalling = false
		velocity = 0

		game_score = 0
		lives = 3
		gameOver = false
		gameOverMusic.stop()
		gameOverVideo.stop()

		startGame()
	}

	else if(keyCode == 40){
		if(!isFalling){
			for(var i = 0; i < platforms.length; i++){
				if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true){
					dropThroughPlatform = platforms[i]
					dropThrough = true
					break
			}
		}
	}
}
}

function keyReleased(){
	if(keyCode == 37){
		isLeft = false
	}
	else if(keyCode == 39){
		isRight = false
	}
	else if(keyCode == 32){
		if(velocity < 0){//allows for variable jump heights based on length of time space/the jump key is held down
			velocity *= jump_cut
		}
	}
}
function mousePressed(){
	gameChar_x = mouseX
	gameChar_y = mouseY
}