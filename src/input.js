export function createInput(target) {
    const down = new Set();

    target.addEventListener('keydown', function (event) {
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            down.add(event.code);
        }
    });

    target.addEventListener('keyup', function (event) {
        down.delete(event.code);
    });

    target.addEventListener('blur', function (event) {
        down.clear();
    });

    return {
        isDown(code) {
            return down.has(code);
        },
    };
}
