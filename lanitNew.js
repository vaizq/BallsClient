//import { netGetEnemies, netSetMyPlayer} from "./net.js";
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");


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


function mouseMoveHandler(event) {
    const rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left - elementWidth / 2;
    let mouseY = event.clientY - rect.top - elementHeight / 2;
}


document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);


let aIsPressed = false;
let sIsPressed = false;
let dIsPressed = false;
let wIsPressed = false;

let speed = 5;
const radius = 45;

let myPlayer = {
    id: 0,
    x: 500,
    y: 500,
}

const imgHeight = 250;
const imgWidth = 250;


function updateGame() {
    if (aIsPressed) {
        myPlayer.x -= speed;
    }

    if (dIsPressed) {
        myPlayer.x += speed;
    }

    if (sIsPressed) {
        myPlayer.y += speed;
    }

    if (wIsPressed) {
        myPlayer.y -= speed;
    }


    //added bounds.
    if (myPlayer.x - radius < 0) {
        myPlayer.x = radius;
    }

    if (myPlayer.x + radius > 1920) {
        myPlayer.x = 1920 - radius;
    }

    if (myPlayer.y - radius < 0) {
        myPlayer.y = radius;
    }

    if (myPlayer.y + radius > 1080) {
        myPlayer.y = 1080 - radius;
    }

    //netSetMyPlayer(myPlayer);
}


function renderPlayer(x, y) {
    const playerImg = document.getElementById("player-avatar");
    ctx.drawImage(playerImg, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
}


function renderEnemy() {
    const enemyImg = document.getElementById("enemy-avatar");

    netGetEnemies().forEach((value, key) => {
        const x = value['x'];
        const y = value['y'];

    ctx.drawImage(enemyImg, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
    });
}


function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderPlayer(myPlayer.x, myPlayer.y);

    renderEnemy();

    // render enemies
    netGetEnemies().forEach((value, key) => {
        const x = value['x'];
        const y = value['y'];
        renderPlayer(x, y, "black");
    });
}


function gameLoop() {

    updateGame();

    renderGame();

    requestAnimationFrame(gameLoop);
}


gameLoop();


