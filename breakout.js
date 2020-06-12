let map = [];

// here you can add or remove bricks add " " for an empty space and "-" for placing a brick on that location
map.push( [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n",
    "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", " ", "\n"]);

//========================== GAME ==============================

/** This is the part that controls the game
 * canvas = identifying the canvas
 * ctx = the content of the canvas
 * @param lives = lives you get while playing the game
 */

function Game(lives) {

    // message at the beginning of te game
    alert("Press any key to release the ball, if you want to move your paddle first use the mouse.");

    // making the context by using the canvas from the HTML5-part
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.lives = lives;

    // create the paddle and ball or change the start values
    this.paddle = new Paddle(10, 75, (this.canvas.clientWidth - 75) / 2, this.canvas.clientHeight -15, this.canvas.clientWidth, this.canvas.offsetLeft);
    // the start angle is randomly generated
    this.ball = new Ball(this.canvas.clientWidth / 2, this.canvas.clientHeight - 30, 4, (Math.random() * 180), 10, this.canvas.clientWidth, this.canvas.clientHeight, this.paddle, this);

    // values that will register the scores
    this.score = 0;
    this.maxScore = 0;

    // values that controls if the user wants to restart
    this.restarted = false;
    document.addEventListener("keydown", this.restart.bind(this), false);

    document.addEventListener("keydown", this.bonusLife.bind(this), false);

    this.load();
}

/**
 * function to load the game
 */

Game.prototype.load = function () {

    this.maxScore = 0;
    // here you can change the brickmap if you add one yourself
    this.bricks = this.bricks(map[0]);
    this.ball.reset();
    this.drawGame();
};

/**
 * function to restart the game if there are any problems
 */

Game.prototype.restart = function (key) {

    // when the "R" is pressed the game will restart
    if(key.keyCode === 82){

        this.restarted = true;
    }
};

/**
 * function to get extra lives is necessary
 */

Game.prototype.bonusLife = function (key) {

    // if the letter L is pressed you get an extra life
    if(key.keyCode === 76){

        this.lives ++;

    }

};

//============================== DRAWINGFUNCTIONS ============================

/**
 * function to draw the lives on the canvas
 */

Game.prototype.drawLives = function () {

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#1d1d1d";
    this.ctx.fillText("Lives:  " + this.lives, this.canvas.width - 90, 20);

};

/**
 * function to draw the score on the canvas
 */

Game.prototype.drawScore = function () {

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#1d1d1d";
    this.ctx.fillText("Score: " + this.score, this.canvas.width - 90, 43);

};

/**
 * function to draw the bricks on the canvas
 * rect is used te generate rectangles with parameters the location, width and height
 */

Game.prototype.drawBrick = function () {

    for (let br of this.bricks) {

        if (br.state) {

            this.ctx.beginPath();
            this.ctx.rect(br.x, br.y, br.width, br.height);
            this.ctx.fillStyle = br.color;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
};

/**
 * function to draw the paddle on the canvas
 * just like drawBrick it uses the rect
 * move() lets u move the paddle (see function below)
 */

Game.prototype.drawPaddle = function () {

    this.ctx.beginPath();

    this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    // change the color of the paddle here is you want to
    this.ctx.fillStyle = "#000";
    this.ctx.fill();

    this.ctx.closePath();

    this.paddle.move();

};

/**
 * function to draw the ball on the canvas
 * arc is used to create a circle with parameters location, radius , start angle and end angle
 * move() lets us move the ball (see function below)
 */

Game.prototype.drawBall = function () {

    this.ctx.beginPath();

    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);

    this.ctx.fillStyle = "#000000";

    this.ctx.fill();

    this.ctx.closePath();

    this.ball.move();
};

/**
 * function to draw all the elements on the canvas
 */

Game.prototype.drawGame = function () {

    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawLives();
    this.drawScore();
    this.drawBall();
    this.drawPaddle();
    this.drawBrick();

    if(this.ball.started){

        this.brickCollision();
        this.paddleCollision();
        if(this.restarted === true){

            document.location.reload();
        }
        // to prevent the ball from disappearing
        if(game.isNan(this.ball.x) && game.isNan(this.ball.y)){

            this.ball.reset();
            this.ball.started = true;
            this.ball.angle = Math.floor(Math.random() * 180);
            this.ball.move();
        }

    }if(this.maxScore === this.bricks.length){

        // here can you change the "won" message
        alert('CONGRATS, YOU WON');
        document.location.reload();
    }else{

        requestAnimationFrame(this.drawGame.bind(this));
    }
};

//=========================== PREVENTION FUNCTIONS ====================================

/**
 * function for preventing NaN
 * @param value = value you want tested against NaN error
 */

Game.prototype.isNan = function (value) {

    return value !== value;
};

//========================== TRANSFORMFUNCTIONS =====================================

/** function for transforming the string in to bricks
 *
 * @param string = string with the location of the bricks
 */

Game.prototype.bricks = function (string) {

    let bricks = [];
    let row = 0;
    let column = 0;
    for (let brick of string) {

        if (brick === "\n") {

            column = 0;
            row += 1;
        }else if(brick === ' ') {

            column += 1;
        }else{

            column += 1;
            bricks.push(new Brick(75, 20, 2, 30, 0, row, column));
        }
    }
    return bricks;
};

//======================== COLLISIONS ===============================

/**
 * the main function used to detect any collision
 */

Game.prototype.collision = function (brick) {

    if(this.ball.x + this.ball.r >= brick.x
        && this.ball.x - this.ball.r < brick.x + brick.width
        && this.ball.y + this.ball.yI() > brick.y - this.ball.r
        && this.ball.y + this.ball.yI() < brick.y + brick.height + this.ball.r) {

        return {side:"vertical", pos:this.ball.x - this.paddle.x};
    }else if(this.ball.y + this.ball.r >= brick.y
        && this.ball.y - this.ball.r < brick.y + brick.height
        && this.ball.x + this.ball.xI() > brick.x - this.ball.r
        && this.ball.x + this.ball.xI() < brick.x + brick.width + this.ball.r) {

        return {side:"horizontal", pos:this.ball.x - this.paddle.x};
    }else{

        return undefined;
    }
};

/**
 * function that detects collisions between the ball and the paddle
 */

Game.prototype.paddleCollision = function () {

    let collision = this.collision(this.paddle);
    if (collision !== undefined) {

        this.paddleBounce(collision.pos);
    }
};

/**
 * function that detects collisions between the ball and the brick
 */

Game.prototype.brickCollision = function () {

    let collision = false;
    let i = 0;
    while (!collision && i < this.bricks.length) {

        let brick = this.bricks[i];
        if (brick.state) {

            let col = this.collision(brick);
            if (col !== undefined) {

                collision = true;
                this.brickBounce(col.side, brick);
            }
        }
        i += 1;
    }
    if(collision) {

        let color = randomColor();
        for(let brick of this.bricks) {

            brick.color = color;
            document.body.style.backgroundColor = color;
        }
        this.score += 1;
        this.maxScore += 1;
    }
};

//======================= BOUNCE FUNCTIONS ===========================

/**
 * function that lets the ball bounce on the paddleR
 */

Game.prototype.paddleBounce = function (position) {

    // here can you change the speed increase with every collision
    this.ball.speed += 0.10;
    this.ball.angle = Math.acos((position - this.paddle.width / 2) / (this.paddle.width / Math.sqrt(3))) * 180 / Math.PI;
};

/**
 * function that lets the ball bounce on any brick
 */

Game.prototype.brickBounce = function (side, brick) {

    let bnc = {"horizontal":180 - this.ball.angle, "vertical":360 - this.ball.angle};
    this.ball.angle = bnc[side];
    brick.state = false;
};

//============================ BALL ==========================

/** The part that controls the ball
 * @param x = x-coordinate
 * @param y = y-coordinate
 * @param speed = traveling speed of the ball
 * @param angle = the angle the ball is going
 * @param r = radius of the circle
 * @param bX = bound of x
 * @param bY = bound of y
 * @param paddle = specifying which paddle
 * @param game = specifying which game
 * @constructor
 */

function Ball(x, y, speed, angle, r, bX, bY, paddle, game){

    this.x = x;
    this.y = y;

    this.startSpeed = speed;
    this.speed = speed;

    this.startAngle = angle;
    this.angle = angle;

    this.r = r;

    this.bX = bX;
    this.bY = bY;

    this.paddle = paddle;

    this.game = game;

    this.started = false;

    document.addEventListener("keydown", this.start.bind(this), false);
}

/**
 * function to let the ball start moving when the space is pressed
 */

Ball.prototype.start = function (key) {

    //change the code of the starting key here is yu want to, value 32 stand for the space
    if(key.keyCode >= 0){

        this.started = true;
    }
};

/**
 * function to reset the ball when a live is lost
 * bringing the ball to the paddle and set the angle and speed to the start values
 */

Ball.prototype.reset = function () {

    this.x = this.paddle.x + this.paddle.width / 2;
    this.y = this.paddle.y - this.r;

    this.speed = this.startSpeed;
    this.angle = (Math.random() * 180);

    this.started = false;

};

/**
 * function to let the ball move
 * this function is also the function that generates the "game over" message and resets the game when you lost a life
 */

Ball.prototype.move = function () {

    if(this.started){

        if(this.y - this.r * (Math.sin(this.angle * (Math.PI / 180))) <=0){

            this.angle = 360 - this.angle;

        }else if(this.y + this.r >= this.bY + 3) {

            this.game.lives --;
            if (this.game.lives === 0) {

                // customize the "game over" message here, the message is displayed when there are no lives left
                alert('THE END, YOU HAVE NO MORE LIVES LEFT!');
                // clear the gameplay and start over
                document.location.reload();
            }else if(this.game.lives === 1){

                alert('You have one life left, if you want an extra life you can press the letter L.');
                this.reset();
            }else{

                this.reset();
            }
        }
        if(this.x - this.r <= 0 || this.x - this.r >= this.bX){

            this.angle = 180 - this.angle;

        }
        this.x += this.speed * (Math.cos(this.angle * (Math.PI / 180)));
        this.y -= this.speed * (Math.sin(this.angle * (Math.PI / 180)));
    }else{

        this.x = this.paddle.x + this.paddle.width / 2;

    }
};


Ball.prototype.xI = function () {

    return this.speed * Math.cos(this.angle * (Math.PI / 180));
};

Ball.prototype.yI = function () {

    return -this.speed * Math.sin(this.angle * (Math.PI / 180));
};

//=================================== PADDLE ==========================================

/** the part that controls the paddle-element
 * @param height = the height of the paddle
 * @param width = the width of the paddle
 * @param x = x-coordinate from the paddle
 * @param y = y-coordinate from the paddle
 * @param bX = bound from x
 * @param offsetLeft
 * @constructor
 */

function Paddle (height, width, x, y, bX, offsetLeft) {

    this.height = height;
    this.width = width;

    this.x = x;
    this.y = y;

    this.bX = bX;

    this.offsetLeft = offsetLeft;

    this.rPressed = false;
    this.lPressed = false;

    document.addEventListener("keydown", this.keyDown.bind(this), false);
    document.addEventListener("keyup", this.keyUp.bind(this), false);
    document.addEventListener("mousemove", this.mouseMove.bind(this), false);
}

/** the next three function are for controlling the paddle with the keys and mouse
 * @param key = the value of the key that is pressed
 */

Paddle.prototype.keyDown = function (key) {

    if (key.keyCode === 39) {

        this.rPressed = true;
    }
    else if (key.keyCode === 37) {

        this.lPressed = true;
    }
};

/** the second function for controlling the paddle
 * @param key = value of the key that is pressed
 */

Paddle.prototype.keyUp = function (key) {

    if (key.keyCode === 39) {

        this.rPressed = false;
    }
    else if (key.keyCode === 37) {

        this.lPressed = false;
    }
};

/** the third and last function fot controlling the paddle with the key and mouse
 * @param key = the value of the key that is pressed
 */

Paddle.prototype.mouseMove = function (key) {

    let rX = key.clientX - this.offsetLeft;
    if (rX -this.width / 2 > 0 && rX + this.width / 2 < this.bX) {

        this.x = rX - this.width / 2;
    }
};

/**
 * function that lets the paddle move
 */

Paddle.prototype.move = function () {

    if (this.rPressed && this.x + this.width < this.bX) {

        this.x += 7;
    }
    else if (this.lPressed && this.x > 0) {

        this.x -= 7;
    }
};

//================================ BRICK ===============================

/** the part that controls the brick
 * @param width = width of the brick
 * @param height = height of the brick
 * @param padding = the padding of the brick
 * @param offsetTop
 * @param offsetLeft
 * @param row =  which row the brick is in
 * @param column = which column the brick is in
 * @constructor
 */

function Brick(width, height, padding, offsetTop, offsetLeft, row, column) {

    this.width = width;
    this.height = height;

    this.x = (column * (width + padding)) + offsetLeft;
    this.y = (row * (height + padding)) + offsetTop;

    this.state = true;
}

//============================ COLOR =========================

/** the part that controls the picking of random colors
 */

function randomColor() {

    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {

        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//====================== RUN THE GAME =========================

/** this part lets you run the game
 * make a new Game and name it "game" as param you give the amount of lives te player should get
 */

let game = new Game(3);
game.drawGame();