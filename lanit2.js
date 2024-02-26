const c = document.getElementById("canvas1");
const ctx = c.getContext("2d");

let x = 50;
let y = c.height / 2;

const radius = 20;
const distance = 5;


//We create the avatar.
function drawAvatar() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}


function moveRight() {
    x += distance;
    drawAvatar();
}


function moveLeft() {
    x -= distance;
    drawAvatar();
}


function moveUp() {
    y -= distance;
    drawAvatar();
}


function moveDown() {
    y += distance;
    drawAvatar();
}


function keyDownHandler(event) {
    if (event.key === "d") {
        moveRight();
    }

    if (event.key === "a") {
        moveLeft();
    }

    if (event.key === "w") {
        moveUp();
    }

    if (event.key === "s") {
        moveDown();
    }
}


document.addEventListener("keydown", keyDownHandler);


drawAvatar();


//We create the scope.
//Change the arc x,y...
function drawScope() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}


function mouseMoveHandler(event) {

}


document.addEventListener("mousemove", mouseMoveHandler)



