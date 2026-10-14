export function createInput(target) {
    const down = new Set();
    const pressed = new Set();

    target.addEventListener('keydown', function (event) {
        if (
            event.code === 'ArrowRight' ||
            event.code === 'ArrowLeft' ||
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown' ||
            event.code === 'KeyR'
        ) {
            event.preventDefault();

            if (!event.repeat && !down.has(event.code)) {
                pressed.add(event.code);
            }

            down.add(event.code);
        }
    });

    target.addEventListener('keyup', function (event) {
        down.delete(event.code);
    });

    target.addEventListener('blur', function () {
        down.clear();
        pressed.clear();
    });

    return {
        isDown(code) {
            return down.has(code);
        },

        justPressed(code) {
            return pressed.delete(code);
        },
    };
}
