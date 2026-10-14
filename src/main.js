import { drawTank } from './render/draw.js';
import { integrate } from './sim/tank.js';
import { createInput } from './input.js';
import { wrapTank } from './sim/arena.js';
import { createLoop } from './loop.js';
import './style.css';

const canvas = document.querySelector('#game');
export const ctx = canvas.getContext('2d');

const input = createInput(window);

export const tank = {
    x: 100,
    y: 100,
    width: 60,
    height: 40,
    speed: 120,
    angle: 0,
    turnSpeed: Math.PI,
};

let previousX = tank.x;
let previousY = tank.y;
let previousAngle = tank.angle;

function simulate(step) {
    previousX = tank.x;
    previousY = tank.y;
    previousAngle = tank.angle;

    integrate(tank, input, step);

    const wrapped = wrapTank(tank, canvas.width, canvas.height);

    if (wrapped) {
        previousX = tank.x;
        previousY = tank.y;
    }
}

function render(alpha, stats) {
    const { frameTime, fps, stepsPerSecond } = stats;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderX = previousX + (tank.x - previousX) * alpha;
    const renderY = previousY + (tank.y - previousY) * alpha;
    const renderAngle = previousAngle + (tank.angle - previousAngle) * alpha;

    drawTank(ctx, tank, renderX, renderY, renderAngle);

    ctx.fillStyle = 'black';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Frame: ${frameTime.toFixed(2)} ms`, 10, 25);
    ctx.fillText(`FPS: ${fps.toFixed(0)}`, 10, 50);
    ctx.fillText(`Steps/s: ${stepsPerSecond.toFixed(0)}`, 10, 75);
}

const loop = createLoop({
    simulate,
    render,
});

loop.start();
