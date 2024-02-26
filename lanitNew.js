const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");


function keyDownHandler(event) {
    if (event.key === "d") {
        dPressed = true;
    }

    if (event.key === "a") {
        aPressed = true;
    }

    if (event.key === "w") {
        wPressed = true;
    }

    if (event.key === "s") {
        sPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "d") {
        dPressed = false;
    }

    if (event.key === "a") {
        aPressed = false;
    }

    if (event.key === "w") {
        wPressed = false;
    }

    if (event.key === "s") {
        sPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);


let aPressed = false;
let sPressed = false;
let dPressed = false;
let wPressed = false;


function gameLoop() {


}


gameLoop();