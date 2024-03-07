import { netGetEnemies, netSetMyPlayer, netGetMyPlayer, netSendAction} from "./net.js";


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const playerSprite = document.getElementById("player-avatar");
const enemySprite = document.getElementById("enemy-avatar");
const playerScope = document.getElementById("scope");
const shotgunBlastAudio = new Audio('shotgun-blast-cut.mp3');
const shotgunReloadAudio = new Audio('shotgun-reload.mp3');
const beBackAudio = new Audio('t1_be_back.wav');
const fuckYouAudio = new Audio('t1_fu.wav');
const hastaLaVistaAudio = new Audio('t2_hasta_la_vista.wav');
const iamTerminatorAudio = new Audio('t2_terminator.wav');
const speakAudioList = [fuckYouAudio, hastaLaVistaAudio, iamTerminatorAudio];


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

canvas.style.cursor = "none";


function mouseMoveHandler(event) {
    crosshair.x = event.offsetX;
    crosshair.y = event.offsetY;
}

function mouseDownHandler(event) {
    console.log("Shoot!");
    shoot();        
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("mousedown", mouseDownHandler);


let aIsPressed = false;
let sIsPressed = false;
let dIsPressed = false;
let wIsPressed = false;


let speed = 200;
const radius = 43;
const maxHealth = 100;
let myPlayer = {
    id: 0,
    x: 500,
    y: 500,
    veloX: 0,
    veloY: 0,
    canShoot: true,
    health: maxHealth,
    radius: radius,
    kills: 0,
    deaths: 0,
    isDying: false
}

let crosshair = {
    x: 950,
    y: 500
}

const imgWidth = 100;
const imgHeight = 100;


function shoot() {
    if (myPlayer.canShoot) {
        myPlayer.canShoot = false;

        playAudio(shotgunBlastAudio)
        .then(() => playAudio(shotgunReloadAudio))
        .then(() => {
            myPlayer.canShoot = true;
            console.log("Audio has been played!");
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

let prevDeaths = myPlayer.deaths;

function playerIsDead() {
    if (myPlayer.deaths > prevDeaths) {
        prevDeaths = myPlayer.deaths;
        return true;
    }
    else {
        return false;
    }
}

function updatePlayer(dt) {
    updateVelocity(dt);

    if (playerIsDead()) {
        // Player died
        playAudio(beBackAudio);
    }
}

function updateEnemies(dt) {
    netGetEnemies().forEach((enemy, key) => {
        enemy['x'] += enemy['veloX'] * dt;
        enemy['y'] += enemy['veloY'] * dt;
    });
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
    updatePlayer(dt);
    updateEnemies(dt);

    handleCollisions(myPlayer);

    netSetMyPlayer(myPlayer);
    myPlayer.id = netGetMyPlayer().id;
    myPlayer.health = netGetMyPlayer().health;
    myPlayer.radius = netGetMyPlayer().radius;
    myPlayer.kills = netGetMyPlayer().kills;
    myPlayer.deaths = netGetMyPlayer().deaths;

}


function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}


function renderEntity(x, y, sprite, reflected = false) {
    if (reflected) {
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
        ctx.scale(1, 1);
    }
    else {
        ctx.drawImage(sprite, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
    }
}


function renderScope(x, y, scope, width, height) {
/*
    x = Math.max(0, Math.min(canvas.width - width, x));
    y = Math.max(0, Math.min(canvas.height - height, y));
*/
    ctx.drawImage(scope, x - width / 2, y - height / 2, width, height);
}


function renderHealthBar(x, y, health) {
    const width = health;
    const height = 10;
    ctx.fillStyle = "#FF0000";  // Fill color (red in this example)
    ctx.fillRect(x, y, width, height);
}

function renderStats() {
    ctx.font = "20px Arial";   // Font size and family
    ctx.fillStyle = "#FF0000";  // Fill color (red in this example)
    const statsText = "Kills: " + myPlayer.kills + " Deaths: " + myPlayer.deaths + " KD: " + (myPlayer.kills / myPlayer.deaths);
    ctx.fillText(statsText, 30, 30);
}


function renderGame() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render enemies
    netGetEnemies().forEach((enemy, key) => {
        let reflect = () => { return false; }
        renderEntity(enemy['x'], enemy['y'], enemySprite, reflect());
        renderHealthBar(enemy['x'] - 50, enemy['y'] - 70, enemy.health);
    });

    
    let reflect = () => { return false; };
    renderEntity(myPlayer.x, myPlayer.y, playerSprite, reflect());
    renderHealthBar(myPlayer.x - 50, myPlayer.y - 70, myPlayer.health);

    renderScope(crosshair.x, crosshair.y, playerScope, 60, 60);

    renderStats();
}

function gameLoop() {
    console.log(JSON.stringify(myPlayer));
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();