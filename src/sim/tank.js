export function integrate(tank, input, dt) {
    if (input.isDown('ArrowLeft')) {
        tank.angle -= tank.turnSpeed * dt;
    }

    if (input.isDown('ArrowRight')) {
        tank.angle += tank.turnSpeed * dt;
    }

    let direction = 0;

    if (input.isDown('ArrowUp')) {
        direction += 1;
    }

    if (input.isDown('ArrowDown')) {
        direction -= 1;
    }

    const distance = tank.speed * direction * dt;

    tank.x += Math.cos(tank.angle) * distance;
    tank.y += Math.sin(tank.angle) * distance;
}
