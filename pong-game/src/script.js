// set up the constants for the pong game
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

modeFactor = 0.03;
ballSpeedChange = 5;
ballSpeed = 5;
message = ''

// set up the user paddle
const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#FFFFFF",
  score: 0
};

// set up the computer paddle
const computer = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#FFFFFF",
  score: 0
};

// set up the net in the middle of the court
const net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: "#FFFFFF"
};

// set up the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "#FFFFFF"
};

// display the home page when the page is first displayed
document.getElementById("helppage").style.display = "none";
document.getElementById("playnowpage").style.display = "none";
document.getElementById("aboutpage").style.display = "none";
document.getElementById("homepage").style.display = "";

// show all of the objects in the game
// including the ball, the net and the score
function render() {
  // draw the background
  drawRect(0, 0, 800, 600, "#000000");
  // drw the net
  drawNet();
  // draw the ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  // draw the user's score
  drawText(user.score, canvas.width / 4, canvas.height / 5, "#FFFFFF");
  // draw the computer's score
  drawText(computer.score, 3 * canvas.width / 4,canvas.height / 5, "#FFFFFF");

  // draw message at end of the game
  drawText(message, 10 ,canvas.height / 2, "#0000FF");

  // show the paddles
  // show the user's paddle
  drawRect(user.x, user.y, user.width, user.height, user.color);
  // show the computer's paddle
  drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
}

// set up the event to track the mouse moving so we can move the user's paddle
canvas.addEventListener("mousemove", movePaddle);

// when the mouse moves up and down, the user's paddle moves along with it
function movePaddle(evt){
  // get the position of the mouse
  let rect = canvas.getBoundingClientRect();
  // change the user paddle's y-coordinate to match the mouse
  user.y = evt.clientY - rect.top - user.height/2;
}


// set the ball back to the middle
// whenever a point has been scored
function resetBall() {
  message = ''
  // set the ball's x-coordinates and y-coordinates to the middle of the screen
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // set the ball's speed and velocity to the starting position
  ball.speed = ballSpeed;
  ball.velocityX = -ball.velocityX;
}

// the ball changes color
function changeBallColor(){
  // if white, turn to red
  if (ball.color == "#FFFFFF"){
    ball.color = "#FF0000";
  // if red, turn to blue  
  }else if (ball.color == "#FF0000"){
    ball.color = "#0000FF";
  // if blue, turn to green  
  }else if (ball.color == "#0000FF"){
    ball.color = "#00FF00";
  // if green, turn to white  
  }else if (ball.color == "#00FF00"){
    ball.color = "#FFFFFF";
  }
}

// this is them main function in the program
// this controls what we see and it makes the game real
function update(){
  
  // if the ball goes to the left court without hitting the paddle
  // computer scores a point, but only on the left wall
  // computer scores and resets the ball
  if (ball.x - ball.radius < 0){
    computer.score++;
   // computerScore.play(); 
    resetBall();
    
  // if the ball goes to the right court without hitting the paddle
  // user scores a point, but only on the right wall
  // user scores and resets the ball
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++; 
   // userScore.play();
    resetBall();
  }

  // drawText("CONGRADULATIONS! YOU WIN!", canvas.width / 4, canvas.height / 2, "#FFFFFF");
  //   endGame();
  // return;

  // someone has scored 5 points, they are the winner
  // the game ends
  if (computer.score == 5 || user.score == 5) {
    if (computer.score == 5) {
      message = 'YOU LOSE! BETTER LUCK NEXT TIME';
    }
    else { 
      message = 'CONGRATULATIONS! YOU WIN!';
    }
    
    endGame();
    // TODO show message - "you are the winner"
    return;
  }
  
  // move the ball left or right on each update 
  ball.x += ball.velocityX;
  // move the ball up or down on each update
  ball.y += ball.velocityY;

  // if the ball hits the top or the bottom, it will move in a different direction
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
    
    // reverses the y-axis direction of the ball
    ball.velocityY = -ball.velocityY;
    ball.y += ball.velocityY;
  
    // change the colour of the ball
    changeBallColor();    
  }
  
  // TODO change this to make it harder to win (super hard mode)
  
  // move the computer paddle
  computer.y += ((ball.y - (computer.y + computer.height/2)))*modeFactor;
  
  // // the ball has hit the paddle
  // if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
  //   // reverse the direction on the y-axis
  //   ball.velocityY = -ball.velocityY;
  //   // wall.play();
  //   changeBallColor();
  // }
  
  // we need to work out if the ball is closer to the user or the computer
  let player = user;
  if (ball.x + ball.radius > canvas.width / 2) {
    player=computer;
  }
  
  // did the ball collide with one of the players?
  if (collision(ball, player)) {
    // hit.play();
    
    // what is the y-axis point of the collision?
    let collidePoint = (ball.y - (player.y + player.height/2));    
    collidePoint = collidePoint / (player.height/2);
    
    // what is the angle point of the collision?
    let angleRad = (Math.PI / 4) * collidePoint;

    // what is the direction of the colliion?
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    
    // change the x-velocity and the y-velocity after the collision
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // speed up the ball
    ball.speed += ballSpeedChange;
    
    // change the colour of the ball
    changeBallColor();    
  }
}

// if the ball has collided with the paddle
function collision(b, p) {
  // find the position of the paddle
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  // find the position of the ball
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  // return true or false
  // has the ball hit a paddle
  // based on the x-coordinates and y-coordinates
  return (b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top);
}

// display the game 
game();

// update the game 50 times per second
function game() {
  // update the ball and the paddles
  update();
  // redisplay everything
  render();
}

var refreshIntervalId;

// start game button
function startGame() {
  const framePerSecond = 50;
  refreshIntervalId = setInterval(game, 1000 / framePerSecond);  
}

// end the game by button or when score reaches 5
function endGame() {
  clearInterval(refreshIntervalId);
}

// how to reset the game and start again
function resetGame() {
  // end the game
  endGame();
  
  // reset the score
  computer.score = 0;
  user.score = 0; 
  
  // reset the ball in the middle
  resetBall();
  
  // redisplay everything
  render();
}

// set the game to easy mode
function easyMode() {
  modeFactor = 0.03  
  ballSpeedChange = 0.2;
  ballSpeed = 5;
}

// set the game to hard mode
function hardMode() {
  modeFactor = 0.1    
  ballSpeedChange = 0.3;
  ballSpeed = 7;
}

// set the game to superhard mode
function superHardMode() {
  modeFactor = 0.5 
  ballSpeedChange = 0.5;
  ballSpeed = 10;
}

// draw the net
function drawNet() {
  // draw a dotted line from the top of the page to the bottom 
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

// draw a rectangle - the net or a paddle
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// draw a circle - the ball
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

// draw text - the score
function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "70px fantasy";
  ctx.fillText(text, x, y);
}

// change the div page when the buttons are pressed
// show the help page
function clickHelp() {
  document.getElementById("helppage").style.display = "";
  document.getElementById("playnowpage").style.display = "none";
  document.getElementById("aboutpage").style.display = "none";
  document.getElementById("homepage").style.display = "none";
}

// show the about page
function clickAbout() {
  document.getElementById("helppage").style.display = "none";
  document.getElementById("playnowpage").style.display = "none";
  document.getElementById("aboutpage").style.display = "";
  document.getElementById("homepage").style.display = "none";
}

// show the home page
function clickHome() {
  document.getElementById("helppage").style.display = "none";
  document.getElementById("playnowpage").style.display = "none";
  document.getElementById("aboutpage").style.display = "none";
  document.getElementById("homepage").style.display = "";
}

// show the play now page
function clickPlaynow() {
  document.getElementById("helppage").style.display = "none";
  document.getElementById("playnowpage").style.display = "";
  document.getElementById("aboutpage").style.display = "none";
  document.getElementById("homepage").style.display = "none";
}
