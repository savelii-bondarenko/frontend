export function integrate(tank, input, step) {
    if (input.isDown('ArrowLeft')) {
        tank.angle -= tank.turnSpeed * step;
    }

    if (input.isDown('ArrowRight')) {
        tank.angle += tank.turnSpeed * step;
    }
}
