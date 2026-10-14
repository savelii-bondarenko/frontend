import './style.css'


const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let x = 100;
const y = 100;
const size = 30;

function frame() {
    x += 2;

    if (x > canvas.width) {
        x = -size;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x, y, size, size);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);