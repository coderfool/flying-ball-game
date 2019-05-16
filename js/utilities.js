function getImage(source) {
    var image = new Image();
    image.src = source;
    return image;
}

function getAudio(source) {
    var audio = new Audio();
    audio.src = source;
    return audio;
}

function randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}