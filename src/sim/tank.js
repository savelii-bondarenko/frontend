export function integrate(tank, input, step) {
    if (input.isDown('ArrowLeft')) {
        tank.angle -= tank.turnSpeed * step;
    }

    if (input.isDown('ArrowRight')) {
        tank.angle += tank.turnSpeed * step;
    }

    let direction = 0;

    if (input.isDown('ArrowUp')) {
        direction += 1;
    }

    if (input.isDown('ArrowDown')) {
        direction -= 1;
    }

    const distance = tank.speed * direction * step;

    tank.x += Math.cos(tank.angle) * distance;
    tank.y += Math.sin(tank.angle) * distance;
}
