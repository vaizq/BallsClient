const socket = new WebSocket('ws://192.168.1.18:6969');


let myPlayer = {};
let enemies = new Map();
let timerID = 0;
let updateTime = Date.now();


export function netSetMyPlayer(player) {
    myPlayer = player;
}

export function netGetEnemies() {
    return enemies;
}

export function netDeltaTimeFromLastUpdate() {
    return (Date.now() - updateTime) / 1000.0;
}

function sendPlayerUpdate() {
    console.log("Send player update");
    socket.send(JSON.stringify(myPlayer));
}

// Send actions to server such as {type: "action", action: "shoot", x: 0, y: 0, veloX: 1, veloY: 1}
function sendAction(action) {
    socket.send(JSON.stringify(action));
}

function handleInfoMessage(msg) {
    myPlayer.id = msg['id'];
    myPlayer.x = msg['x'];
    myPlayer.y = msg['y'];
    myPlayer.veloX = msg['veloX'];
    myPlayer.veloY = msg['veloY'];

    // Start sending playerUpdates
    timerID = setInterval(sendPlayerUpdate, 20);
}

function handleWorldUpdate(msg) {
    enemies.clear();

    msg['players'].forEach(player => {
       if (player['id'] != myPlayer.id) {
            enemies.set(player['id'], player);
        }
    });
    updateTime = Date.now();
}

socket.addEventListener('open', (event) => {
    console.log('Connected to server');
});

socket.addEventListener('message', (event) => {

    console.log(`Got message: ${event.data}`);

    try {
        const msg = JSON.parse(event.data);
        if (msg['type'] === "Info") {
            handleInfoMessage(msg);
        }
        else if (msg['type'] === "WorldUpdate") {
            handleWorldUpdate(msg);
        }
    }
    catch(exception) {
        console.log(`Failed to parse data: ${event.data}`);
    }
});

socket.addEventListener('close', (event) => {
    clearInterval(timerID);
});