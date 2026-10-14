export function createLoop({ step = 1 / 60, simulate, render }) {
    let running = false;
    let requestId = null;
    let lastTime = null;
    let accumulator = 0;

    let frameCount = 0;
    let stepCount = 0;
    let elapsedTime = 0;

    const stats = {
        fps: 0,
        stepsPerSecond: 0,
        frameTime: 0,
    };

    function frame(now) {
        if (!running) return;

        const frameTime = lastTime === null ? 0 : now - lastTime;

        if (lastTime !== null) {
            frameCount += 1;
        }

        lastTime = now;
        stats.frameTime = frameTime;
        elapsedTime += frameTime;

        accumulator += Math.min(frameTime / 1000, 0.25);

        while (accumulator >= step) {
            simulate(step);
            stepCount += 1;
            accumulator -= step;
        }

        if (elapsedTime >= 1000) {
            stats.fps = (frameCount * 1000) / elapsedTime;
            stats.stepsPerSecond = (stepCount * 1000) / elapsedTime;

            frameCount = 0;
            stepCount = 0;
            elapsedTime = 0;
        }

        render(accumulator / step, stats);

        if (running) {
            requestId = requestAnimationFrame(frame);
        }
    }

    function start() {
        if (running) return;

        running = true;
        lastTime = null;
        accumulator = 0;
        frameCount = 0;
        stepCount = 0;
        elapsedTime = 0;

        stats.fps = 0;
        stats.stepsPerSecond = 0;
        stats.frameTime = 0;

        requestId = requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
        cancelAnimationFrame(requestId);
        requestId = null;
    }

    return { start, stop, stats };
}
