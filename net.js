
const socket = new WebSocket('ws://localhost:6969');


var myPlayer = {};
var enemies = new Map();
let timerID = 0;

function sendPlayerUpdate() {
    console.log("Send player update");
    socket.send(JSON.stringify(myPlayer));
}

function handleInfoMessage(msg) {
    myPlayer.id = msg['id'];
    myPlayer.x = msg['x'];
    myPlayer.y = msg['y'];

    // Start sending playerUpdates
    timerID = setInterval(sendPlayerUpdate, 100);
}

function handleWorldUpdate(msg) {
    enemies.clear();
    for (i = 0; i < msg['players'].length; i++) {
        const player = msg['players'][i];
        if (player.id == myID) {
            myPlayer = player;    
        }
        else {
            enemies.set(player.id, player);
        }
    } 
}

socket.addEventListener('open', (event) => {
    console.log('Connected to server');
});

socket.addEventListener('message', (event) => {
    try {
        const msg = JSON.parse(event.data);
        if (msg['type'] == "Info") {
            handleInfoMessage(msg);
        }
        else if (msg['type'] == "WorldUpdate") {
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