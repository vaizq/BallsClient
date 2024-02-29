import { netGetEnemies, netSetMyPlayer, netDeltaTimeFromLastUpdate} from "./net.js";


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const playerSprite = document.getElementById("player-avatar");
const enemySprite = document.getElementById("enemy-avatar");


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
    /*
    const rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left - elementWidth / 2;
    let mouseY = event.clientY - rect.top - elementHeight / 2;
    */
}


document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);


let aIsPressed = false;
let sIsPressed = false;
let dIsPressed = false;
let wIsPressed = false;


let speed = 100;
const radius = 20;
let myPlayer = {
    id: 0,
    x: 500,
    y: 500,
    veloX: 0,
    veloY: 0
}

const imgWidth = 250;
const imgHeight = 250;


function updateGame() {
    const dt = 1.0 / 60; // deltaTime: Time how long each frame takes in secods 

    if (aIsPressed) {
        myPlayer.veloX = -speed;
    }
    else if (dIsPressed) {
        myPlayer.veloX = speed;
    }
    else {
        myPlayer.veloX = 0;
    }

    if (sIsPressed) {
        myPlayer.veloY = speed;
    }
    else if (wIsPressed) {
        myPlayer.veloY = -speed;
    }
    else {
        myPlayer.veloY = 0;
    }

    myPlayer.x += myPlayer.veloX * dt;
    myPlayer.y += myPlayer.veloY * dt;


    //added bounds.
    /*
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
    */

    netSetMyPlayer(myPlayer);
}


function renderEntity(x, y, sprite) {
    ctx.drawImage(sprite, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
}


function renderGame() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render player
    renderEntity(myPlayer.x, myPlayer.y, playerSprite);

    // render enemies
    netGetEnemies().forEach((enemy, key) => {
        const dt = netDeltaTimeFromLastUpdate();
        const x = enemy['x'] + enemy['veloX'] * dt;
        const y = enemy['y'] + enemy['veloY'] * dt;
        renderEntity(x, y, enemySprite);
    });
}


function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}


gameLoop();