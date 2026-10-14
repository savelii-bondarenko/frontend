export function createInput(target) {
    const down = new Set();

    target.addEventListener('keydown', (event) => {
        if (
            event.code === 'ArrowLeft' ||
            event.code === 'ArrowRight'
        ) {
            event.preventDefault();
        }

        down.add(event.code);
    });

    target.addEventListener('keyup', (event) => {
        down.delete(event.code);
    });

    target.addEventListener('blur', () => {
        down.clear();
    });

    function isDown(code) {
        return down.has(code);
    }

    return { isDown };
}