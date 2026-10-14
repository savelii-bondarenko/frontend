export function wrapTank(tank, width, height) {
    let wrapped = false;

    if (tank.x > width) {
        tank.x = -tank.width;
        wrapped = true;
    } else if (tank.x + tank.width < 0) {
        tank.x = width;
        wrapped = true;
    }

    if (tank.y > height) {
        tank.y = -tank.height;
        wrapped = true;
    } else if (tank.y + tank.height < 0) {
        tank.y = height;
        wrapped = true;
    }

    return wrapped;
}
