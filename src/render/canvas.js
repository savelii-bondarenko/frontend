export function createCanvas(canvas) {
    const ctx = canvas.getContext('2d');

    const view = {
        ctx,
        width: 0,
        height: 0,
        dpr: 0,
        resize,
    };

    function resize() {
        const width = Math.max(1, window.innerWidth);
        const height = Math.max(1, window.innerHeight);
        const dpr = window.devicePixelRatio || 1;

        if (
            width === view.width &&
            height === view.height &&
            dpr === view.dpr
        ) {
            return;
        }

        view.width = width;
        view.height = height;
        view.dpr = dpr;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(
            canvas.width / width,
            0,
            0,
            canvas.height / height,
            0,
            0,
        );
    }

    resize();

    return view;
}
