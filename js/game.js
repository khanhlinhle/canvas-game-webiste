let canvas;
let ctx;
let gamerScore;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.getElementById("canvas-content").appendChild(canvas);

let dinoLeftReady, dinoRightReady, backgroundReady, cactusReady;
let dinoLeftImg, dinoRightImg, backgroundImg, cactusImg;

let stepLeft = true;
let delayUpdate = 0;
let keysDown = {};

const DINO_X = 10;
const DINO_WIDTH = 100;
const DINO_HEIGHT = 110;
const MIN_DINO_Y = 100;
const MAX_DINO_Y = 300;
let dinoY = 300;
let isFlying = false;
let isFlyingUp = true;

const CACTUS_Y = 330;
const CACTUS_WIDTH = 50;
const CACTUS_HEIGHT = 90;
const MIN_CACTUS_X = -50;
const MAX_CACTUS_X = 850;
let cactusX = 850;
let startTime = Date.now();

loadImages();
main();
setupKeyboardListeners();

delayUpdate = setInterval(() => {
    // left - right - left - right - ...
    stepLeft = !stepLeft;
}, 100);

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

    backgroundImg = new Image();
    backgroundImg.onload = function() {
        backgroundReady = true;
    };
    backgroundImg.src = "img/background.png";

    cactusImg = new Image();
    cactusImg.onload = function() {
        cactusReady = true;
    };
    cactusImg.src = "img/cactus.png";
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

    elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    if (crashCatus()) {
        endGame();

    } else {

        if (32 in keysDown || 38 in keysDown) {
            setFlyingDino();
        }

        cactusX -= 10;
        if (cactusX === MIN_CACTUS_X) {
            cactusX = MAX_CACTUS_X;
        }
    }
    // Check dieu kien de no nhay len roi rot xuong  
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

    // let cactusCenterTop = (cactusX + DINO_WIDTH) / 2;

    // if (DINO_X < cactusX &&
    //     cactusX < DINO_X + DINO_WIDTH) {

    //     if (CACTUS_Y < dinoY + DINO_HEIGHT &&
    //         dinoY + DINO_HEIGHT < CACTUS_Y + CACTUS_HEIGHT) {

    //         endGame();
    //     }
    // }
    // crashCatus();
    // endGame();
};

function setFlyingDino() {
    if (!isFlying) {
        isFlying = true;
        isFlyingUp = true;
    }
}



function render() {
    if (backgroundReady) {
        ctx.drawImage(backgroundImg, 0, 0, 800, 600);
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

    if (cactusReady) {
        ctx.drawImage(cactusImg, cactusX, CACTUS_Y, CACTUS_WIDTH, CACTUS_HEIGHT);
    }
    ctx.fillText(`Score: ${elapsedTime}`, 20, 100);
};

function main() {
    update();
    render();
    requestAnimationFrame(main);
};

//----- TO DO LIST -----

// Update at 17:00: 

// 1. End game

function startGame() {
    this.interval = setInterval(update, 100);
}

function crashCatus() {
    let crash = false;
    let cactusCenterTop = (cactusX + DINO_WIDTH) / 2;

    if (DINO_X < cactusX &&
        cactusX < DINO_X + DINO_WIDTH) {

        if (CACTUS_Y < dinoY + DINO_HEIGHT &&
            dinoY + DINO_HEIGHT < CACTUS_Y + CACTUS_HEIGHT) {
            crash = true;
        }
        return crash;
    }
    console.log("Test");

}

function endGame() {
    clearInterval(this.interval);
    console.log("die");
    // alert("Game over");

}

// 2. Reset --> Update at 17:00: Not work

function resetAll() {
    const DINO_X = 10;
    const DINO_WIDTH = 100;
    const DINO_HEIGHT = 110;
    const MIN_DINO_Y = 100;
    const MAX_DINO_Y = 300;
    let dinoY = 300;
    let isFlying = false;
    let isFlyingUp = true;

    const CACTUS_Y = 330;
    const CACTUS_WIDTH = 50;
    const CACTUS_HEIGHT = 90;
    const MIN_CACTUS_X = -50;
    const MAX_CACTUS_X = 850;
    let cactusX = 850;
}

// 3. Make background like moving

// 4. Add score 

// function scoreCounting() {
//     elapsedTime = Math.floor((Date.now() - startTime) / 1000);
// }

// function scoreFinishing() {

// }

// 5. Add sound