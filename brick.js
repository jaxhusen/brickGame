let ball;               // Game object for the ball
let paddle;             // Game object for the paddle
let bricks;             // Game object for the bricks
let scoreText;          // Game object for showing score
let livesText;          // Game object for showing lives
let startButton;        // Game object for the start button
let rotation;           // Game object for showing "Game Over!"
let gameOverText;       // Game object for showing "You won the game!"
let wonTheGameText;     // Flag will be used to define which direction the ball should rotate
var pointsCount = 5;    //variable för points/ brick


var score = 0;          // Variable holding the number of scores
var lives = 1;          // Variable holding the remaining lives
const restartScore = 0;   //variable to reset score when restart the game
const restartLives = 1;   //variable to reset lives when restart the game




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
            //debug: true, //- Set debug: true if you want collision boxes to be drawn
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
var cctitleId = 'cc-title';
var cctitle = document.getElementById(cctitleId);


function preload() {
    this.load.image('paddle', 'uploads/colalogo.png');
    this.load.image('brick', 'uploads/cocacola.png');
    this.load.image('destroyed', 'uploads/explosion.png');
    this.load.image('ball', 'uploads/sphere.png');
}

function create() {
    paddle = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - 50, 'paddle')
        .setImmovable();

    ball = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - 100, 'ball')
        .setCollideWorldBounds(true)
        .setBounce(1);

    bricks = this.physics.add.staticGroup({
        key: 'brick',
        frameQuantity: 1,
        gridAlign: { width: 1, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX - 120, y: 100 }
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
            startButton.on('pointerdown', (event) => { this.scene.restart(); }); //restart game when lost
        }
    }
}


function paddleHit(ball, paddle) {
    var diff = 0;

    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.setVelocityX(-20 * diff);
        rotation = 'left';
    } else if (ball.x > paddle.x) {
        diff = ball.x - paddle.x;
        ball.setVelocityX(20 * diff);
        rotation = 'right';
    } else {
        ball.setVelocityX(2 + Math.random() * 10);
    };
}


function brickHit(ball, brick) {
    brick.setTexture('destroyed');

    score += pointsCount;
    scoreText.setText(`Score: ${score}`);

    this.tweens.add({
        targets: brick,
        scaleX: 0,
        scaleY: 0,
        ease: 'Power1',
        duration: 500,
        delay: 250,
        angle: 180,
        onComplete: () => {
            brick.destroy();

            if (bricks.countActive() === 0) {
                ball.setVisible(false);
                wonTheGameText = cctitle.innerText = 'Congrats! You won the game!';
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

    ball.setVelocity(-300, -200);
    rotation = 'left';

    this.input.on('pointermove', pointer => {
        paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, this.game.config.width - paddle.width / 2);
    });
}