window.addEventListener('resize', () => {
    window.location.reload()
}); //update size of game depending on size of screen

let ball;               // Game object for the ball
let paddle;             // Game object for the paddle
let bricks;             // Game object for the bricks
let sprite;

let scoreText;          // Game object for showing score
let livesText;          // Game object for showing lives
let startButton;        // Game object for the start button
let gameOverText;       // Game object for showing "Game Over!"
let wonTheGameText;     // Game object for showing "You won the game!"
let rotation;           // Flag will be used to define which direction the ball should rotate

var cctitleId = 'cc-title';
var cctitle = document.getElementById(cctitleId);

var pointsCount = 5;        //variable for points/ brick
var score = 0;              // Variable holding the number of scores
var lives = 1;              // Variable holding the remaining lives
const restartScore = score;     //variable to reset score when restart the game
const restartLives = lives;     //variable to reset lives when restart the game


//variables for paddle
var paddleWidth = 150;      //variable for paddle width
var paddleHeight = 50;      //variable for paddle height
var paddlePlacement = 70;   //where on the screen should the paddle be placed


//variables for ball
var speedBall = 300;        //variable for speed of the ball 
var speedLeft = -7;         //variable for speed when you hit paddle on left side
var speedRight = 7;         //variable for speed when you hit paddle on right side
var ballPlacement = 120;    //where on the screen should the ball be placed
var ballWidth = 40;         //variable for ball width
var ballHeight = 40;        //variable for ball height


//variables for bricks and grid
var brickQuantity = 36;     //variable for total bricks in the game
var bricksPerRow = 12;       //variable for how many bricks /row


//variables for bricks/explosion animation
var brickDuration = 100;    //variable for the duration after hitting brick
var brickDelay = 0;         //variable for the delay after hitting brick
var brickAngle = 0;         //variable for angle of the effect after hitting brick
var brickScaleY = 0;        //variable for scale effect Y after hitting brick
var brickScaleX = 0;        //variable for scale effect X after hitting brick


//variables for array and db
var brickArr = [];          //save score and gameDone()
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
    parent: 'wrapper',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        minWidth: 300,
        minHeight: 400,
        maxWidth: 800,
        maxHeight: 1000,
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,              //debug: true, if you want bricks to be drawn
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


function preload(dataCards, _done, _game_type, /* _score, */ _st, _paddleWidth, _brickQuantity, _pointsCount, /* _speedBall */) {

    done = _done;
    game_type = _game_type;
    /*  score = _score; */
    st = _st;
    /*      paddleWidth = _paddleWidth;
            brickQuantity = _brickQuantity;
            pointsCount = _pointsCount;
            speedBall = _speedBall*/

    this.load.image('background', 'uploads/arbackground.png');
    this.load.image('paddle', 'uploads/arlogo.png', 'paddle');                //name, path, id
    this.load.image('brick', 'uploads/ar.png', 'brick');                  //name, path, id
    this.load.image('ball', 'uploads/tennisboll.png', 'ball');                      //name, path, id
    //this.load.image('destroyed', 'uploads/explosion.png', 'destroyed');       //name, path, id
}


function create() {
    var scaleManager = this.game.scale;
    var windowWidth = scaleManager.width;

    var columnWidth = windowWidth / bricksPerRow;       //varible for width on columns between bricks
    var rowHeight = columnWidth / 1;         //variable for height between rows
    var gridX = windowWidth - (columnWidth * bricksPerRow / 1);
    var gridY = 80;

    this.add.image(0, 0, 'background')
        .setOrigin(0) // Set origin to top left corner
        .setDisplaySize(this.game.config.width, this.game.config.height); // Set size to match the screen dimensions
    
    paddle = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - paddlePlacement, 'paddle')
        .setImmovable()
        .setDisplaySize(paddleWidth, paddleHeight);

    ball = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - ballPlacement, 'ball')
        .setCollideWorldBounds(true)
        .setBounce(1)
        .setDisplaySize(ballWidth, ballHeight)
        .setDepth(1);

    bricks = this.physics.add.staticGroup({
        key: 'brick',
        frameQuantity: brickQuantity,
        gridAlign: {
            width: bricksPerRow,
            cellWidth: columnWidth,
            cellHeight: rowHeight,
            x: gridX,
            y: gridY,
        },
    });
    console.log(gridX)


    scoreText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '0', textStyle);
    livesText = this.add.text(this.game.config.width - 20, 20, 'Lives: ' + lives, textStyle).setOrigin(1, 0);
    livesText.visible = false; // makes the content of livesText to be visible=false;


    textfield = 'Start game';
    startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, textfield, textStyle)
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ 
            backgroundColor: '#FFB81C',
            fill: '#FFF',
            fontSize: '24px',
            fontWeight: 'bold'
        })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => startGame.call(this))
        .on('touch', () => startGame.call(this))
        .on('pointerover', () => startButton.setStyle({ fill: '#5C7082' }))
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
            startButton.on('touch', (event) => { this.scene.restart(); });       //restart game when lost triggered by touch 
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
    scoreText.setText(`${score}`);

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

            }
        }
    });
}


function startGame() {
    lives = restartLives;
    score = restartScore;

    //livesText.setText(`Lives: ${lives}`);    //update lives
    scoreText.setText(`${score}`);             //update score 

    startButton.setVisible(false);

    ball.setVelocity(speedBall);
    rotation = 'left';

    this.input.on('pointermove', pointer => {
        paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, this.game.config.width - paddle.width / 2);
    });
    
    this.input.on('touch', pointer => {
        paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, this.game.config.width - paddle.width / 2);
    });
}


