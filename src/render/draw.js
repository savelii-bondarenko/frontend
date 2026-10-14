export function drawTank(ctx, tank, x, y, angle) {
    ctx.save();

    ctx.translate(x + tank.width / 2, y + tank.height / 2);
    ctx.rotate(angle);

    const left = -tank.width / 2;
    const top = -tank.height / 2;

    ctx.fillStyle = '#333333';
    ctx.fillRect(left, top - 8, tank.width, 10);
    ctx.fillRect(left, top + tank.height - 2, tank.width, 10);

    ctx.fillStyle = 'green';
    ctx.fillRect(left, top, tank.width, tank.height);

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(-10, -10, 20, 20);

    ctx.fillStyle = 'black';
    ctx.fillRect(5, -3, 40, 6);

    ctx.restore();
}

export function drawGrid(ctx, width, height) {
    const cellSize = 50;

    ctx.save();

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }

    ctx.stroke();
    ctx.restore();
}

export function lerpAngle(previous, current, alpha) {
    const difference = current - previous;

    const shortestDifference = Math.atan2(
        Math.sin(difference),
        Math.cos(difference),
    );

    return previous + shortestDifference * alpha;
}
