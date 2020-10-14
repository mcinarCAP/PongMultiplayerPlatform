var socket = io();
var drawData;
var score = "";


socket.on("update", function (data) {
  drawData = data;
});

socket.on("score", function(data){
  score = data["side"];
});

function setup() {
    createCanvas(800, 700);

    background(0);
}

function draw() {
    background(0);
    if(score != "") {
      fill("white");
      textSize(50);
      text(score, 350, 100);
    }

    if (drawData) {
        fill("red");
        ellipse(drawData.ball.position.x, drawData.ball.position.y, drawData.ball.diameter);

        for (index in drawData.paddles)
        {
          drawPaddle(drawData.paddles[index]);
        }
    }
}

function drawPaddle(paddle) {
    fill(paddle.color);
    rect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);

    textSize(20);
    var posX = paddle.position.x;
    if(posX > 200){
      posX = 550;
    }
    text(paddle.name, posX, 25);
}

function startGame(){
  score = "";
  socket.emit("start", {});
}

function restartGame(){
  score = "";
  socket.emit("restartGame", {});
}
