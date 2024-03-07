const socket = new WebSocket('ws://192.168.0.18:6969');


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
    const now = Date.now();
    const dt = (now - updateTime) / 1000.0;
    updateTime = now;
    return dt;
}

function sendPlayerUpdate() {
    let str = JSON.stringify(myPlayer);
    let msg = JSON.parse(str);
    msg['type'] = 'PlayerUpdate';
    socket.send(JSON.stringify(msg));
}

// Send actions to server such as 
// {type: "action", action: "shot", playerID: 123, x: 0, y: 0, directionX: 69, directionY: 420}
//
export function netSendAction(action) {
    action['type'] = 'Action';
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
        if (player['id'] == myPlayer.id) {
            myPlayer = player;
        }
        else {
            enemies.set(player['id'], player);
        }
    });
    updateTime = Date.now();
}

socket.addEventListener('open', (event) => {
    console.log('Connected to server');
});

socket.addEventListener('message', (event) => {

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