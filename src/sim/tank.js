export function integrate(tank, input, step) {
    if (input.isDown('ArrowRight')) {
        tank.x += tank.speed * step;
    }
}
