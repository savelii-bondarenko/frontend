export function drawTank(ctx, tank, x) { //x isn`t straight tank coordinate, it`s interpolated coord
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, tank.y - 8, tank.width, 10);
    ctx.fillRect(x, tank.y + tank.height - 2, tank.width, 10);

    ctx.fillStyle = 'green';
    ctx.fillRect(x, tank.y, tank.width, tank.height);

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(x + 20, tank.y + 10, 20, 20);

    ctx.fillStyle = 'black';
    ctx.fillRect(x + 35, tank.y + 17, 40, 6);
}
