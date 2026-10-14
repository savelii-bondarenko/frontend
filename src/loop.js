export function createLoop({ step = 1 / 60, simulate, render }) {
    const MAX_FRAME_DELTA = 0.25;

    let accumulator = 0;
    let lastTime = null;
    let requestId = null;
    let running = false;

    let stepCount = 0;
    let frameCount = 0;
    let sampleTime = 0;

    const stats = {
        stepsPerSecond: 0,
        framesPerSecond: 0,
        frameTime: 0,
    };

    function frame(now) {
        if (!running) {
            return;
        }

        if (lastTime === null) {
            lastTime = now;
        }

        const realDelta = (now - lastTime) / 1000;
        const frameDelta = Math.min(realDelta, MAX_FRAME_DELTA);

        lastTime = now;
        accumulator += frameDelta;

        stats.frameTime = realDelta * 1000;
        sampleTime += realDelta;

        if (realDelta > 0) {
            frameCount++;
        }

        while (accumulator >= step) {
            simulate(step);
            accumulator -= step;
            stepCount += 1;
        }

        if (sampleTime >= 1) {
            stats.stepsPerSecond = stepCount / sampleTime;
            stats.framesPerSecond = frameCount / sampleTime;

            stepCount = 0;
            frameCount = 0;
            sampleTime = 0;
        }

        render(accumulator / step, stats);

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
        stepCount = 0;
        frameCount = 0;
        sampleTime = 0;

        stats.stepsPerSecond = 0;
        stats.framesPerSecond = 0;
        stats.frameTime = 0;

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

    return { start, stop, stats };
}