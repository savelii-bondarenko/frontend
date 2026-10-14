import './style.css';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const tank = {
    x: 100,
    y: 100,
    width: 60,
    height: 40,
};

function drawTank() {
    ctx.fillStyle = '#333333';
    ctx.fillRect(tank.x, tank.y - 8, tank.width, 10);
    ctx.fillRect(tank.x, tank.y + tank.height - 2, tank.width, 10);

    ctx.fillStyle = 'green';
    ctx.fillRect(tank.x, tank.y, tank.width, tank.height);

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(tank.x + 20, tank.y + 10, 20, 20);

    ctx.fillStyle = 'black';
    ctx.fillRect(tank.x + 35, tank.y + 17, 40, 6);
}

let lastTime = null;

let frameCount = 0;
let elapsedTime = 0;
let fps = 0;

const ONE_SECOND = 1000;

function frame(now) {
    frameCount++;

    const frameTime = lastTime === null ? 0 : now - lastTime;
    lastTime = now;

    elapsedTime += frameTime;

    if (elapsedTime >= ONE_SECOND) {
        fps = frameCount * ONE_SECOND / elapsedTime;
        
        frameCount = 0;
        elapsedTime = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTank();

    ctx.fillStyle = 'black';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Frame: ${frameTime.toFixed(2)} ms`, 10, 25);
    ctx.fillText(`FPS: ${fps.toFixed(2)}`, 10, 50);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
