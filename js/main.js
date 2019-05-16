var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var frames = 0;

canvas.addEventListener('click', function(event) {
    var muteButtonX = canvas.width - audio.width;
    var muteButtonY = 0;
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;
    if ((clickX >= muteButtonX && clickX <= muteButtonX + audio.width) &&
    (clickY >= muteButtonY && clickY <= muteButtonY + audio.height)) {
        audio.muted = !audio.muted;
        return;
    }
    switch (state.current) {
        case state.getReady:
            state.current = state.running;
            if (!audio.muted) scoreAudio.play();
            break;
        case state.running:
            ball.moveUp(ball.bounce, 2);
            if (!audio.muted) bounceAudio.play();
            break;
        case state.gameOver:
            var restartButtonX = (canvas.width - gameOver.width) / 2;
            var restartButtonY = (canvas.height - gameOver.height) / 2;
            if ((clickX >= restartButtonX && clickX <= restartButtonX + gameOver.width) && 
            (clickY >= restartButtonY && clickY <= restartButtonY + gameOver.height)) {
                pipes.reset();
                score.reset();
                if (!audio.muted) scoreAudio.play();
                state.current = state.running;
            }
            break; 
    }
});

function update() {
    ball.update();
    pipes.update();
}

function draw() {
    context.fillStyle = '#19e8f7';
    context.fillRect(0, 0, canvas.width, canvas.height);
    pipes.draw();
    context.drawImage(foregroundImage, 0, canvas.height - foregroundImage.height);
    audio.draw();
    getReady.draw();
    ball.draw();
    score.draw();
    gameOver.draw();
}

function run() {
    update();
    draw();
    frames++;
    requestAnimationFrame(run);
}

run();