import './style.css';

import { createLoop } from './loop.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

let x = 100;
let previousX = x;

const y = 100;
const size = 30;
const speed = 120;

function simulate(dt) {
    previousX = x;
    x += speed * dt;

    if (x > canvas.width) {
        x = -size;
        previousX = x;
    }
}

function render(alpha) {
    const renderX = previousX + (x - previousX) * alpha;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(renderX, y, size, size);
}

const loop = createLoop({
    simulate,
    render,
});

loop.start();
