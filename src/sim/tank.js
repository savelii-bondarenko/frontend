export function integrate(tank, input, dt) {
    if (input.isDown('ArrowLeft')) {
        tank.angle -= tank.turnSpeed * dt;
    }

    if (input.isDown('ArrowRight')) {
        tank.angle += tank.turnSpeed * dt;
    }

    tank.angle = Math.atan2(Math.sin(tank.angle), Math.cos(tank.angle));

    tank.thrust = 0;

    if (input.isDown('ArrowUp')) {
        tank.thrust += 1;
    }

    if (input.isDown('ArrowDown')) {
        tank.thrust -= 1;
    }

    const acceleration = tank.acceleration * tank.thrust;

    tank.vx += Math.cos(tank.angle) * acceleration * dt;
    tank.vy += Math.sin(tank.angle) * acceleration * dt;

    const damping = Math.exp(-tank.drag * dt);

    tank.vx *= damping;
    tank.vy *= damping;

    const speed = Math.hypot(tank.vx, tank.vy);

    if (speed > tank.maxSpeed) {
        const scale = tank.maxSpeed / speed;

        tank.vx *= scale;
        tank.vy *= scale;
    }

    tank.x += tank.vx * dt;
    tank.y += tank.vy * dt;
}
