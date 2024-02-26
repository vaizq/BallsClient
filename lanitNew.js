import { netGetEnemies, netSetMyPlayer} from "./net.js";

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


<<<<<<< HEAD
=======
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);


let aIsPressed = false;
let sIsPressed = false;
let dIsPressed = false;
let wIsPressed = false;


let speed = 5;
const radius = 20;
let myPlayer = {
    id: 0,
    x: 500,
    y: 500,
}


>>>>>>> 4f2a212defb898ac542e739e8d863285e8d45cef
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


