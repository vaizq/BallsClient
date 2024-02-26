const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");


let aIsPressed = false;
let sIsPressed = false;
let dIsPressed = false;
let wIsPressed = false;


let speed = 5;
const radius = 20;
let x = 500;
let y = 500;


document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);


function keyDownHandler(event) {
    if (event.key === "d") {
        dIsPressed = true;
    }

    if (event.key === "a") {
        aIsPressed = true;
    }

    if (event.key === "w") {
        wIsPressed = true;
    }

    if (event.key === "s") {
        sIsPressed = true;
    }
}


function keyUpHandler(event) {
    if (event.key === "d") {
        dIsPressed = false;
    }

    if (event.key === "a") {
        aIsPressed = false;
    }

    if (event.key === "w") {
        wIsPressed = false;
    }

    if (event.key === "s") {
        sIsPressed = false;
    }
}


function updateGame() {
    if (aIsPressed) {
        x -= speed;
    }

    if (dIsPressed) {
        x += speed;
    }

    if (sIsPressed) {
        y += speed;
    }

    if (wIsPressed) {
        y -= speed;
    }
}


function renderPlayer(x, y) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
}


function renderGame() {
    renderPlayer(x, y);
}



function gameLoop() {

    updateGame();

    renderGame();

    requestAnimationFrame(gameLoop);
}


gameLoop();


