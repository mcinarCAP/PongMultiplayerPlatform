var express = require('express');
var app = express();

var serv = require('http').Server(app);

app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile(__dirname + 'index.html');
});
serv.listen(process.env.PORT || 2000);

console.log("Server started.");

var sockets = {};
var paddles = {};

var ball = new Ball();

var isStarted = false;

var io = require('socket.io')(serv, {});

io.sockets.on('connection', function (socket) {
  console.log("connection open");

  socket.on("play", function (data){
    console.log(data.name);
    console.log("player ready");

    sockets[socket.id] = socket;
    if (Object.keys(paddles).length == 0)
    {
        paddles[socket.id] = new Paddle(25, 350, "white", data.name, "left")
    } else if(Object.keys(paddles).length == 1) {
        paddles[socket.id] = new Paddle(750, 350, "blue", data.name, "right");
    }
  })

  socket.on('disconnect', function (data) {
      console.log("disconnected");
      delete sockets[socket.id];
  })

  socket.on('moveUp', function () {
    paddles[socket.id].moveUp();
  })

  socket.on('moveDown', function () {
    paddles[socket.id].moveDown();
  })

  socket.on('stop', function () {
    paddles[socket.id].stop();
  })

  socket.on('start', function(){
    isStarted = true;
  })

  socket.on('restartGame', function(){
    ball = new Ball();
    isStarted = true;
  })
});

setInterval(function () {
  if(isStarted && ball){
    for (i in paddles) {
        CollisionDetector(paddles[i], ball);
        paddles[i].update();
    }
    ball.update();

    var sideWon = checkWinner(paddles, ball);
    if(sideWon != "")
    {
      isStarted = false;
      io.sockets.emit("score", {side: sideWon});
      return;
    }
  }
}, 1000 / 500);

setInterval(function(){
  if(isStarted && ball){
    io.sockets.emit("update", {
        ball: {
          position: ball.position,
          diameter: ball.diameter
        },
        paddles: paddles
    });
  }
}, 1000 / 60);

function checkWinner(paddles, ball){
  for (i in paddles) {
    if(paddles[i].side == "left" && ball.position.x-(ball.diameter/2) < paddles[i].position.x){
      return "right";
    }
    else if (paddles[i].side == "right" && ball.position.x +(ball.diameter/2) > paddles[i].position.x + paddles[i].width) {
      return "left";
    }
  }
  return "";
}

function CollisionDetector(paddle, ball){
  if(paddle.position.y < ball.position.y+(ball.diameter/2) && paddle.position.y + 100 > ball.position.y-(ball.diameter/2))
  {
    if(paddle.side == "left" && paddle.position.x + paddle.width >= ball.position.x - (ball.diameter/2) )
    {
      var angle = valueFromRange(ball.position.y, paddle.position.y, paddle.position.y + paddle.height, -1/4*Math.PI, 1/4*Math.PI);
      ball.bounce(angle);
    }
    if(paddle.side == "right" && paddle.position.x <= ball.position.x + (ball.diameter/2)){
      var angle = valueFromRange(ball.position.y, paddle.position.y, paddle.position.y + paddle.height, 5/4*Math.PI, 3/4*Math.PI);
      ball.bounce(angle);
    }
  }
}

function valueFromRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function Paddle(x, y, color, name, side) {
  this.position = { x: x, y: y }
  this.velocity = { x: 0, y: 0 }
  this.speed = 2;

  this.width = 25;
  this.height = 100;

  this.color = color;

  this.name = name;

  this.side = side;
}

Paddle.prototype.update = function () {
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
}

Paddle.prototype.moveUp = function () {
  this.velocity = {x: 0, y: -1*this.speed}
}

Paddle.prototype.moveDown = function () {
  this.velocity = { x: 0, y: this.speed }
}

Paddle.prototype.stop = function () {
  this.velocity = { x: 0, y: 0 }
}


function Ball() {
  this.position = { x: 400, y: 375 }
  this.angle = Math.random() - 0.5;

  if(Math.random()>0.5){
    this.angle += Math.PI;
  }

  this.direction = { x: Math.cos(this.angle), y: Math.sin(this.angle) }

  this.speed = 0.8;
  this.diameter = 25;
}

Ball.prototype.update = function () {
  this.speed += 0.0009;

  if (this.position.y > 700 || this.position.y < 0) {
      this.angle =  ((Math.PI*2) - this.angle);
  }

  this.direction = { x: Math.cos(this.angle), y: Math.sin(this.angle) }
  this.position.x += this.direction.x*this.speed;
  this.position.y += this.direction.y*this.speed;
}

Ball.prototype.bounce = function(angle){
  this.angle = angle*((Math.random()/10)+1);
}
