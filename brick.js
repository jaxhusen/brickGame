let ball;               // Game object for the ball
let paddle;             // Game object for the paddle
let bricks;             // Game object for the bricks
let scoreText;          // Game object for showing score
let livesText;          // Game object for showing lives
let startButton;        // Game object for the start button
let rotation;           // Game object for showing "Game Over!"
let gameOverText;       // Game object for showing "You won the game!"
let wonTheGameText;     // Flag will be used to define which direction the ball should rotate

var cctitleId = 'cc-title';
var cctitle = document.getElementById(cctitleId);
var pointsCount = 5;        //variable for points/ brick
var score = 0;              // Variable holding the number of scores
var lives = 1;              // Variable holding the remaining lives
const restartScore = 0;     //variable to reset score when restart the game
const restartLives = 1;     //variable to reset lives when restart the game

//variables for paddle
var paddleWidth = 150;      //variable for paddle width
var paddleHeight = 50;      //variable for paddle height
var paddlePlacement = 50;   //where on the screen should the paddle be placed

//variables for ball
var speedX = -200;          //variable for speed of the ball in X
var speedY = 400;           //variable for speed of the ball in Y
var speedLeft = -7;         //variable for speef when you hit paddle on left side
var speedRight = 7;         //variable for speef when you hit paddle on right side
var ballPlacement = 120;    //where on the screen should the ball be placed
var ballWidth = 40;         //variable for ball width
var ballHeight = 40;        //variable for ball height

//variables for bricks and grid
var frameQuantity = 10;     //variable for how many bricks in the game
var gridWidthX = 5;         //variable for how many bricks /row
var columnWidth = 70;       //varible for width on columns between bricks
var rowHeight = 70;         //variable for height between rows
var brickPlacementX = 120;  //where on the screen should the group of bricks be placed in X
var brickPlacementY = 100;  //where on the screen should the group of bricks be placed in Y

//variables for bricks/explosion animation
var brickDuration = 100;    //variable for the duration after hitting brick
var brickDelay = 0;        //variable for the delay after hitting brick
var brickAngle = 0;         //variable for angle of the effect after hitting brick
var brickScaleY = 0;        //variable for scale effect Y after hitting brick
var brickScaleX = 0;        //variable for scale effect X after hitting brick

//variables for score and db
var brickArr = [];          //save score and done
var done;
var game_type;
var st;


// We are going to use these styles for texts
const textStyle = {
    font: '18px Arial',
    fill: '#FFF'
};

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#222',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'wrapper',
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,              //debug: true, if you want bricks to be drawn
            checkCollision: {
                up: true,
                down: false,
                left: true,
                right: true
            }
        }
    },
    scene: {
        preload,
        create,
        update
    }
};


let game = new Phaser.Game(config);


function preload(dataCards, _done, _game_type, _score, _st) {
    game_type = _game_type;
    done = _done;
    st = _st;
    score = _score;

    this.load.image('paddle', 'uploads/colalogo.png', 'paddle');                //name, path, id
    this.load.image('brick', 'uploads/cocacola.png', 'brick');                  //name, path, id
    this.load.image('ball', 'uploads/sphere.png', 'ball');                      //name, path, id
    //this.load.image('destroyed', 'uploads/explosion.png', 'destroyed');       //name, path, id

}

function create() {
    paddle = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - paddlePlacement, 'paddle')
        .setImmovable()
        .setDisplaySize(paddleWidth, paddleHeight);

    ball = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - ballPlacement, 'ball')
        .setCollideWorldBounds(true)
        .setBounce(1)
        .setDisplaySize(ballWidth, ballHeight);


    bricks = this.physics.add.staticGroup({
        key: 'brick',
        frameQuantity: frameQuantity,
        gridAlign: { width: gridWidthX, cellWidth: columnWidth, cellHeight: rowHeight, x: this.cameras.main.centerX - brickPlacementX, y: brickPlacementY }
    });


    scoreText = this.add.text(20, 20, 'Score: 0', textStyle);
    livesText = this.add.text(this.game.config.width - 20, 20, 'Lives: ' + lives, textStyle).setOrigin(1, 0);
    livesText.visible = false; // makes the content of livesText to be visible=false;




    textfield = 'Start game';
    startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, textfield, textStyle)
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: '#111' })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => startGame.call(this))
        .on('touch', () => startGame.call(this))
        .on('pointerover', () => startButton.setStyle({ fill: '#FF0000' }))
        .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }));

    this.physics.add.collider(ball, bricks, brickHit, null, this);
    this.physics.add.collider(ball, paddle, paddleHit, null, this);
}



function update() {
    if (rotation) {
        ball.rotation = rotation === 'left' ? ball.rotation - .05 : ball.rotation + .05;
    }

    if (ball.y > paddle.y) {
        lives--;

        if (lives === 0) {
            livesText.setText(`Lives: ${lives}`);   //update lives
            startButton.setText('Restart game');    //sets text from 'start game' to 'restart game'
            startButton.setVisible(true);           //sets startbutton to visible
            startButton.on('pointerdown', (event) => { this.scene.restart(); }); //restart game when lost triggered by pointer down
            startButton.on('touch', (event) => { this.scene.restart(); });       //restart game when lost triggered by touch on touch screens
        }
    }
}


function paddleHit(ball, paddle) {
    var diff = 0;

    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.setVelocityX(speedLeft * diff);
        rotation = 'left';
    } else if (ball.x > paddle.x) {
        diff = ball.x - paddle.x;
        ball.setVelocityX(speedRight * diff);
        rotation = 'right';
    } else {
        ball.setVelocityX(2 + Math.random() * 10);
    };
}


function brickHit(ball, brick) {
    // brick.setTexture('destroyed');  //switch from brick to destroyed after hit

    score += pointsCount;
    scoreText.setText(`Score: ${score}`);

    this.tweens.add({
        targets: brick,
        scaleX: brickScaleX,
        scaleY: brickScaleY,
        ease: 'Power1',
        duration: brickDuration,
        delay: brickDelay,
        angle: brickAngle,
        onComplete: () => {
            brick.destroy();

            if (bricks.countActive() === 0) {
                ball.setVelocity(0, 0);
                ball.setVisible(false);
                wonTheGameText = cctitle.innerText = 'Congrats! You won the game!';
                brickArr.unshift(gameDone);
                brickArr.unshift(score);
                console.log(brickArr);

                gameDone();
            }
        }
    });
}


function startGame() {
    lives = restartLives;
    score = restartScore;


    livesText.setText(`Lives: ${lives}`);    //update lives
    scoreText.setText(`Score: ${score}`);    //update score 

    startButton.setVisible(false);

    ball.setVelocity(speedX, speedY);
    rotation = 'left';

    this.input.on('pointermove', pointer => {
        paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, this.game.config.width - paddle.width / 2);
    });
    this.input.on('touch', pointer => {
        paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, this.game.config.width - paddle.width / 2);
    });
}


function gameDone() {
    if (game_type == "contestBrick") {
        done(game_type, encodeString((Date.now() - st).toString()));
    } else if (game_type == "couponBrick") {
        done("contestBrick", encodeString((Date.now() - st).toString()));
    }
}


var encodeString = function (val/*:String*/) {
    var res/*:String*/ = "";

    for (var i/*:Number*/ = 0; i < val.length; i++) {
        res += String.fromCharCode((val.charCodeAt(i) + 64));
    }

    return res;
};