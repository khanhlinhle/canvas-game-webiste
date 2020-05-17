let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;
document.getElementById("canvas-content").appendChild(canvas);

let dinoLeftReady, dinoRightReady, background1Ready, background2Ready, cactus1Ready,
    cactus2Ready;
let dinoLeftImg, dinoRightImg, backgroundImg1, backgroundImg2, cactus1Img,
    cactus2Img;
let jumpSound, crashSound;

let stepLeft = true;
let delayUpdate = 0;
let keysDown = {};

const MAX_BG_X = 800;
const MIN_BG_X = -800;
const BG_Y = 0;
const BG_HEIGTH = 600;
const BG_WIDTH = 800;
let bg1X = 0;
let bg2X = 800;

const DINO_X = 10;
const DINO_WIDTH = 100;
const DINO_HEIGHT = 110;
const MIN_DINO_Y = 100;
const MAX_DINO_Y = 300;
let dinoY = 300;
let isFlying = false;
let isFlyingUp = true;

const CACTUS_Y = 345;
const CACTUS_WIDTH = 35;
const CACTUS_HEIGHT = 75;
const MIN_CACTUS_X = -50;
const MAX_CACTUS_X = 1450;
let cactus1X = 1600;
let cactus2X = 1600;

let startTime = Date.now();
let score = 0;
let bestScore = 0;
let isPlaying = false;

loadImages();
loadSounds();
main();
setupKeyboardListeners();

delayUpdate = setInterval(() => {
    // left - right - left - right - ...
    if (isPlaying) {
        stepLeft = !stepLeft;
    }
}, 100);

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.getElementById("canvas-content").appendChild(this.sound);

    this.play = function() {
        this.sound.play();
    }

    this.stop = function() {
        this.sound.pause();
    }
}

function loadImages() {
    dinoLeftImg = new Image();
    dinoLeftImg.onload = function() {
        dinoLeftReady = true;
    };
    dinoLeftImg.src = "img/dino-L.png";

    dinoRightImg = new Image();
    dinoRightImg.onload = function() {
        dinoRightReady = true;
    };
    dinoRightImg.src = "img/dino-R.png";

    backgroundImg1 = new Image();
    backgroundImg1.onload = function() {
        background1Ready = true;
    };
    backgroundImg1.src = "img/background.png";

    backgroundImg2 = new Image();
    backgroundImg2.onload = function() {
        background2Ready = true;
    };
    backgroundImg2.src = "img/background.png";

    cactus1Img = new Image();
    cactus1Img.onload = function() {
        cactus1Ready = true;
    };
    cactus1Img.src = "img/cactus.png";

    cactus2Img = new Image();
    cactus2Img.onload = function() {
        cactus2Ready = true;
    };
    cactus2Img.src = "img/cactus.png";
}

function loadSounds() {
    jumpSound = new sound("sound/jump.wav");
    crashSound = new sound("sound/crash.wav");
}

function setupKeyboardListeners() {
    addEventListener("keydown", function(key) {
        keysDown[key.keyCode] = true;
    }, false);

    addEventListener("keyup", function(key) {
        delete keysDown[key.keyCode];
    }, false);
}

function update() {
    if (isPlaying) {
        score = Math.floor((Date.now() - startTime) / 100);

        if (crashCactus()) {
            jumpSound.stop();
            crashSound.play();
            endGame();

        } else {
            // move cactus & background
            bg1X -= 10;
            bg2X -= 10;
            cactus1X -= 10;
            cactus2X -= 10;

            if (cactus1X <= MIN_CACTUS_X) {
                cactus1X = Math.floor(Math.random() * (MAX_CACTUS_X - 1000 + 1) + 1000);
            }

            if (cactus2X <= MIN_CACTUS_X) {
                cactus2X = Math.floor(Math.random() * (MAX_CACTUS_X - 1000 + 1) + 1000);
            }

            if (bg1X === MIN_BG_X) {
                bg1X = MAX_BG_X;
            }

            if (bg2X === MIN_BG_X) {
                bg2X = MAX_BG_X;
            }

            // jump
            if (32 in keysDown) {
                setFlyingDino();
            }

            // check jump up & down
            if (isFlying) {

                if (isFlyingUp) {
                    dinoY -= 15;

                    if (dinoY <= MIN_DINO_Y) {
                        isFlyingUp = false;
                    }
                } else {
                    dinoY += 10;

                    if (dinoY >= MAX_DINO_Y) {
                        isFlying = false;
                    }
                }
            }
        }
    } else {
        if (32 in keysDown || 38 in keysDown) {
            startGame();
        }
    }
};

function crashCactus() {
    let handX = DINO_WIDTH - DINO_X;
    let handY = dinoY + ((DINO_HEIGHT - dinoY) / 2);
    let legX = DINO_X + ((DINO_WIDTH - DINO_X) / 2);
    let legY = dinoY + DINO_HEIGHT;

    if (checkPointInside(handX, handY) || checkPointInside(legX, legY)) {
        return true;
    }

    return false;
}

function checkPointInside(x, y) {
    if (CACTUS_Y < y && y < (CACTUS_Y + CACTUS_HEIGHT)) {
        if (cactus1X < x && x < (cactus1X + CACTUS_WIDTH)) {
            return true;

        } else if (cactus2X < x && x < (cactus2X + CACTUS_WIDTH)) {
            return true;
        }
    }
    return false;
}

function setFlyingDino() {
    if (!isFlying) {
        isFlying = true;
        isFlyingUp = true;
        jumpSound.play();
    }
}

function render() {
    if (background1Ready) {
        ctx.drawImage(backgroundImg1, bg1X, BG_Y, BG_WIDTH, BG_HEIGTH);
    }

    if (background2Ready) {
        ctx.drawImage(backgroundImg2, bg2X, BG_Y, BG_WIDTH, BG_HEIGTH);
    }

    if (stepLeft) {
        if (dinoLeftReady) {
            ctx.drawImage(dinoLeftImg, DINO_X, dinoY, DINO_WIDTH, DINO_HEIGHT);
        }
    } else {
        if (dinoRightReady) {
            ctx.drawImage(dinoRightImg, DINO_X, dinoY, DINO_WIDTH, DINO_HEIGHT);
        }
    }

    if (cactus1Ready) {
        ctx.drawImage(cactus1Img, cactus1X, CACTUS_Y, CACTUS_WIDTH, CACTUS_HEIGHT);
    }

    if (cactus2Ready) {
        ctx.drawImage(cactus2Img, cactus2X, CACTUS_Y, CACTUS_WIDTH, CACTUS_HEIGHT);
    }

    ctx.font = "18px Georgia";
    ctx.fillText(`Best Score: ${bestScore}`, 335, 100);
    ctx.fillText(`Score: ${score}`, 650, 100);
    ctx.fillText(`Press 'Spacebar' to Play`, 300, 500);
};

function main() {
    update();
    render();
    requestAnimationFrame(main);
};

function startGame() {
    startTime = Date.now();
    cactus1X = MAX_CACTUS_X;
    cactus2X = MAX_CACTUS_X;
    score = 0;
    isPlaying = true;
}

function endGame() {
    isPlaying = false;
    if (score > bestScore) {
        bestScore = score;
    }
}