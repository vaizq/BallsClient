import { netGetEnemies, netSetMyPlayer, netDeltaTimeFromLastUpdate} from "./net.js";


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


document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);


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

    netSetMyPlayer(myPlayer);
}


function renderPlayer(x, y, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
}


function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderPlayer(myPlayer.x, myPlayer.y, "blue");

    // render enemies
    netGetEnemies().forEach((enemy, key) => {
        const dt = netDeltaTimeFromLastUpdate();
        const x = enemy['x'] + enemy['veloX'] * dt;
        const y = enemy['y'] + enemy['veloY'] * dt;
        renderPlayer(x, y, "black");
    });
}


function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}


gameLoop();