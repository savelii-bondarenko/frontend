import './style.css';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const tank = {
    x: 100,
    y: 100,
    width: 60,
    height: 40,
}

ctx.fillStyle = '#333333';
ctx.fillRect(tank.x, tank.y - 8, tank.width, 10);
ctx.fillRect(tank.x, tank.y + tank.height - 2, tank.width, 10);

ctx.fillStyle = 'green';
ctx.fillRect(tank.x, tank.y, tank.width, tank.height);

ctx.fillStyle = 'darkgreen';
ctx.fillRect(tank.x + 20, tank.y + 10, 20, 20);

ctx.fillStyle = 'black';
ctx.fillRect(tank.x + 35, tank.y + 17, 40, 6);

