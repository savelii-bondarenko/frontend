export function drawTank(ctx, tank, x, y, angle) {
    ctx.save();

    ctx.translate(x + tank.width / 2, y + tank.height / 2);
    ctx.rotate(angle);

    const left = -tank.width / 2;
    const top = -tank.height / 2;

    // Гусеницы
    ctx.fillStyle = '#333333';
    ctx.fillRect(left, top - 8, tank.width, 10);
    ctx.fillRect(left, top + tank.height - 2, tank.width, 10);

    // Корпус
    ctx.fillStyle = 'green';
    ctx.fillRect(left, top, tank.width, tank.height);

    // Башня
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(-10, -10, 20, 20);

    // Ствол
    ctx.fillStyle = 'black';
    ctx.fillRect(5, -3, 40, 6);

    ctx.restore();
}
