import './style.css';

import { createLoop } from './loop.js';
import { createInput } from './input.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const input = createInput(window);

let x = 100;
let previousX = x;

const y = 100;
const size = 30;
const speed = 120;

function simulate(dt) {
    previousX = x;

    let direction = 0;

    if (input.isDown('ArrowRight')) {
        direction += 1;
    }

    if (input.isDown('ArrowLeft')) {
        direction -= 1;
    }

    x += direction * speed * dt;

    if (x > canvas.width) {
        x = -size;
        previousX = x;
    }

    if (x < -size) {
        x = canvas.width;
        previousX = x;
    }
}

function render(alpha, stats) {
    const renderX = previousX + (x - previousX) * alpha;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(renderX, y, size, size);

    ctx.fillStyle = '#111827';
    ctx.fillRect(10, 10, 260, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textBaseline = 'top';

    ctx.fillText(
        `Steps/s: ${stats.stepsPerSecond.toFixed(1)}`,
        20,
        20,
    );

    ctx.fillText(
        `Frames/s: ${stats.framesPerSecond.toFixed(1)}`,
        20,
        45,
    );

    ctx.fillText(
        `Frame time: ${stats.frameTime.toFixed(2)} ms`,
        20,
        70,
    );
}

const loop = createLoop({
    simulate,
    render,
});

loop.start();
