var foregroundImage = getImage('images/foreground.png');
foregroundImage.width = 306;
foregroundImage.height = 118;

var scoreAudio = getAudio('audio/score.wav');
var bounceAudio = getAudio('audio/bounce.wav');
var gameOverAudio = getAudio('audio/game-over.wav');

var state = {
    current: 0,
    getReady: 0,
    running: 1,
    gameOver: 2
};

var getReady = {
    image: getImage('images/tap.png'),
    width: 100, 
    height: 100,

    draw: function() {
        if (state.current == state.getReady) {
            context.fillStyle = '#000';
            context.font = '20px Calibri';
            context.lineWidth = 2;
            context.fillText('TAP TO PLAY', 90, 180);
            context.drawImage(this.image, (canvas.width - this.width) / 2, (canvas.height - this.height) / 2);
        }
    }
}

var gameOver = {
    image: getImage('images/restart.png'),
    width: 100, 
    height: 100,

    draw: function() {
        if (state.current == state.gameOver) {
            context.fillStyle = '#000';
            context.font = '20px Calibri';
            context.lineWidth = 2;
            context.fillText('Score: ' + score.value, 105, 450);
            context.fillText('Best: ' + score.best, 110, 480);
            context.drawImage(this.image, (canvas.width - this.width) / 2, (canvas.height - this.height) / 2);
        }
    }   
}

var score = {
    value: 0,
    best: 0,

    draw: function() {
        if (state.current == state.running) {
            context.fillStyle = '#000';
            context.font = '20px Calibri';
            context.fillText('Score: ' + score.value, 20, canvas.height - 20);
        }
    },

    reset: function() {
        this.value = 0;
    }
};

var ball = {
    images: [],
    width: 50,
    height: 49,
    frame: 0,
    bounce: 100,
    gravity: 1,
    speed: 0,

    roll: function() {
        var period = 5;
        this.frame += frames % period == 0 ? 1 : 0;
        this.frame = this.frame % this.images.length;
    },

    draw: function() {
        if (state.current == state.running && this.y == this.initY) {
            this.roll();
        }
        var image = this.images[this.frame];
        context.drawImage(image, this.x, this.y);
    },

    update: function() {
        if (state.current == state.running && this.y < this.initY) {
            this.speed += this.gravity;
            this.y = Math.min(this.y + this.speed, this.initY);
        }
    },

    resetSpeed: function() {
        this.speed = 0;
    },

    moveUp: function(bounce, period) {
        ball.resetSpeed();
        if (ball.y >= 0 && bounce > 0) {
            ball.y -= period;
            setTimeout(ball.moveUp, 0, bounce - period, period);  
        }
    }
};

ball.initX = 20;
ball.initY = canvas.height - foregroundImage.height - ball.height;
ball.x = ball.initX;
ball.y = ball.initY;

for (var i = 1; i <= 8; i++) {
    var image = getImage('images/ball/' + i + '.png');
    ball.images.push(image);
}

var pipes = {
    image: getImage('images/pipe.png'),
    position: [],
    width: 52,
    height: 378,
    incrementScore: true,

    draw: function() {
        for (var i = 0; i < this.position.length; i++) {
            var pos = this.position[i];
            context.drawImage(this.image, pos.x, pos.y);
        }
    },

    update: function() {
        if (state.current != state.running) {
            return;
        }
        var period = 100;
        if (frames % period == 0) {
            this.position.push({
                x: canvas.width,
                y: randInt(this.minY, this.maxY)
            });
        }
        for (var i = 0; i < this.position.length; i++) {
            var pos = this.position[i];
            if ((ball.x + ball.width >= pos.x && ball.x <= pos.x + this.width) && 
            (ball.y + ball.height >= pos.y)) {
                state.current = state.gameOver;
                if (!audio.muted) gameOverAudio.play();
                return; 
            }
            pos.x--;
            if (pos.x + this.width < ball.initX) {
                if (this.incrementScore) {
                    score.value++;
                    this.incrementScore = false;
                }
                if (!audio.muted) scoreAudio.play();
                score.best = Math.max(score.best, score.value);
            }
            if (pos.x + this.width < 0) {
                this.position.shift();
                this.incrementScore = true;
            }
        }
    },
    
    reset: function() {
        this.position = [];
    }
}

pipes.minY = canvas.height - pipes.height; 
pipes.maxY = canvas.height - foregroundImage.height; 

var audio = {
    muted: false,
    onImage: getImage('images/audio-on.png'),
    offImage: getImage('images/audio-off.png'),
    width: 50,
    height: 50,

    draw: function() {
        if (this.muted) {
            context.drawImage(this.offImage, canvas.width - this.width, 0);
        }
        else {
            context.drawImage(this.onImage, canvas.width - this.width, 0);
        }
    }
};