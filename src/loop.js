export function createLoop({ step = 1 / 60, simulate, render }) {
    const MAX_FRAME_DELTA = 0.25;

    let accumulator = 0;
    let lastTime = null;
    let requestId = null;
    let running = false;

    function frame(now) {
        if (!running) {
            return;
        }

        if (lastTime === null) {
            lastTime = now;
        }

        const frameDelta = Math.min((now - lastTime) / 1000, MAX_FRAME_DELTA);

        lastTime = now;
        accumulator += frameDelta;

        while (accumulator >= step) {
            simulate(step);
            accumulator -= step;
        }

        render(accumulator / step);

        if (running) {
            requestId = requestAnimationFrame(frame);
        }
    }

    function start() {
        if (running) {
            return;
        }

        accumulator = 0;
        lastTime = null;
        running = true;

        requestId = requestAnimationFrame(frame);
    }

    function stop() {
        running = false;

        if (requestId !== null) {
            cancelAnimationFrame(requestId);
            requestId = null;
        }
    }

    return { start, stop };
}
