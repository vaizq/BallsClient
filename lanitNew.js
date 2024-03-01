import { netGetEnemies, netSetMyPlayer, netDeltaTimeFromLastUpdate, netSendAction} from "./net.js";


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const playerSprite = document.getElementById("player-avatar");
const enemySprite = document.getElementById("enemy-avatar");
<<<<<<< HEAD
const playerScope = document.getElementById("scope");
=======
const shotgunBlastAudio = new Audio('shotgun-blast-cut.mp3');
const shotgunReloadAudio = new Audio('shotgun-reload.mp3');


function playAudio(audio) {
    return new Promise((resolve, reject) => {
        audio.addEventListener('ended', () => {
          resolve();
        });

        audio.addEventListener('error', (error) => {
          reject(error);
        });

        audio.play();
      });
}
>>>>>>> d6d30ee2f6efcc8622336e970570309beca5e273


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
canvas.style.cursor = "none";

let mouseX = 0;
let mouseY = 0;


function mouseMoveHandler(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
=======
function mouseMoveHandler(event) {
    /*
    const rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left - elementWidth / 2;
    let mouseY = event.clientY - rect.top - elementHeight / 2;
    */
}

function mouseDownHandler(event) {
    console.log("Shoot!");
    shoot();        
>>>>>>> d6d30ee2f6efcc8622336e970570309beca5e273
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);


let aIsPressed = false;
let sIsPressed = false;
let dIsPressed = false;
let wIsPressed = false;


let speed = 100;
<<<<<<< HEAD
const radius = 200;
=======
const radius = 50;
const maxHealth = 100;
>>>>>>> d6d30ee2f6efcc8622336e970570309beca5e273
let myPlayer = {
    id: 0,
    x: 500,
    y: 500,
    veloX: 0,
    veloY: 0,
    canShoot: true,
    health: maxHealth,
    radius: radius
}

let crosshair = {
    x: 0,
    y: 0
}

const imgWidth = 250;
const imgHeight = 250;


function shoot() {
    if (myPlayer.canShoot) {
        myPlayer.canShoot = false;

        playAudio(shotgunBlastAudio)
        .then(() => playAudio(shotgunReloadAudio))
        .then(() => {
            myPlayer.canShoot = true;
        });

        const shotAction = {
            action: 'shot',
            playerID: myPlayer.id,
            x: myPlayer.x,
            y: myPlayer.y,
            directionX: crosshair.x - myPlayer.x,
            directionY: crosshair.y - myPlayer.y
        };

        netSendAction(shotAction);
    }
}

function updateVelocity(dt) {
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
}

function handleCollisions(entity) {
    //added bounds.
    if (entity.x - radius < 0) {
        entity.x = radius;
    }

    if (entity.x + radius > canvas.width) {
        entity.x = canvas.width - radius;
    }

    if (entity.y - radius < 0) {
        entity.y = radius;
    }

    if (entity.y + radius > canvas.height) {
        entity.y = canvas.height - radius;
    }
}

function updateGame() {
    const dt = 1.0 / 60; // deltaTime: Time how long each frame takes in secods 

    updateVelocity(dt);

    handleCollisions(myPlayer);

    netSetMyPlayer(myPlayer);
}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}


function renderEntity(x, y, sprite) {
    drawCircle(x, y, radius);
    ctx.drawImage(sprite, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
}

<<<<<<< HEAD

function renderScope(mouseX, mouseY, scope) {
    ctx.drawImage(scope, mouseX, mouseY);
}


=======
>>>>>>> d6d30ee2f6efcc8622336e970570309beca5e273
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

    renderScope(mouseX, mouseY, playerScope);
}

function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();