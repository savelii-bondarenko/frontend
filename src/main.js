import './style.css'


const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

let x = 100;
let previousX = x;
const y = 100;
const size = 30;
const speed = 120;

const STEP = 1 / 60;
const MAX_FRAME_DELTA = 0.25;

let accumulator = 0;
let lastTime = null;

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

function frame(now) {
  if (lastTime === null) {
    lastTime = now;
  }

  const frameDelta = Math.min(
    (now - lastTime) / 1000,
    MAX_FRAME_DELTA,
  );

  lastTime = now;
  accumulator += frameDelta;

  while (accumulator >= STEP) {
    simulate(STEP);
    accumulator -= STEP;
  }

  render(accumulator / STEP);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);