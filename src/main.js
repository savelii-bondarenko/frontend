import { drawTank } from './render/draw';
import './style.css';

const canvas = document.querySelector('#game');
export const ctx = canvas.getContext('2d');

export const tank = {
    x: 100,
    y: 100,
    width: 60,
    height: 40,
    speed: 120,
};

let previousX = tank.x;

let lastTime = null;

let frameCount = 0;
let elapsedTime = 0;
let fps = 0;

const ONE_SECOND = 1000;

const STEP = 1 / 60;

let accumulator = 0;
let stepCount = 0;
let stepsPerSecond = 0;

function simulate() {
    previousX = tank.x;
    tank.x += tank.speed * STEP;

    if (tank.x > canvas.width) {
        tank.x = -tank.width;
        previousX = tank.x;
    }
}

function frame(now) {
    frameCount++;

    const frameTime = lastTime === null ? 0 : now - lastTime;
    lastTime = now;

    accumulator += Math.min(frameTime / ONE_SECOND, 0.25);

    while (accumulator >= STEP) {
        simulate();

        stepCount++;
        accumulator -= STEP;
    }

    elapsedTime += frameTime;

    if (elapsedTime >= ONE_SECOND) {
        fps = (frameCount * ONE_SECOND) / elapsedTime;
        stepsPerSecond = (stepCount * ONE_SECOND) / elapsedTime;

        frameCount = 0;
        elapsedTime = 0;
        stepCount = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const alpha = accumulator / STEP;
    const renderX = previousX + (tank.x - previousX) * alpha;

    drawTank(ctx, tank, renderX);

    ctx.fillStyle = 'black';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Frame: ${frameTime.toFixed(2)} ms`, 10, 25);
    ctx.fillText(`FPS: ${fps.toFixed(2)}`, 10, 50);
    ctx.fillText(`Steps/s: ${stepsPerSecond.toFixed(0)}`, 10, 75);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
