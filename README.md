# Lab 01 — The Event Loop Is the Game Loop

A keyboard-controlled tank built with vanilla JavaScript, Canvas 2D, and Vite. The project uses a fixed simulation timestep and interpolated rendering. The tank replaces the ship described in the lab, while keeping the same movement and timing requirements.

## Setup and launch

Requirements: **Node.js 24.21.0** (recorded in `.nvmrc`), npm, and a modern browser. The recorded build used Vite 8.3.4.

From the project's parent directory, run:

```bash
cd frontend
node -v
npm -v
npm ci
npm run dev
```

If the terminal is already in `frontend`, skip the first command. Run npm commands from the directory containing `package.json`.

Open the URL printed by Vite, normally [http://localhost:5173](http://localhost:5173). Keep the terminal open and press **Ctrl+C** to stop the server.

`npm ci` installs dependencies from `package-lock.json`. If the lockfile is missing, use `npm install`. The `.nvmrc` file records the Node version but does not switch it automatically.

## Commands and checks

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run format` | Format project files with Prettier. |
| `npm run format:check` | Check formatting without changing files. |
| `npm run lint` | Check JavaScript in `src` with ESLint. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |

After changing files, run:

```bash
npm run format
npm run lint
npm run format:check
npm run build
```

Prettier uses four spaces, single quotes, and semicolons for JavaScript. `node_modules/` and `dist/` are excluded through `.prettierignore`.

ESLint uses the recommended JavaScript rules and browser globals. The lint command includes `--max-warnings 0`, so warnings also fail the check. No extra output after its command header normally means it passed.

All four commands passed on the working project before this README was added. The production build transformed 11 modules and completed in 1.74 seconds. Run the checks again after adding or changing the README.

To inspect the production version, run `npm run build`, then `npm run preview`. Open the printed URL, normally [http://localhost:4173](http://localhost:4173). Rebuild after source changes before using preview.

## Controls

| Key | Action |
| --- | --- |
| Arrow Up | Forward thrust. |
| Arrow Down | Reverse thrust. |
| Arrow Left / Right | Rotate the tank. |
| R | Reset position, heading, velocity, and thrust. |

The tank starts at `(100, 100)`, facing right. Releasing thrust lets drag slow it down gradually. Turning changes the heading while existing momentum remains, so movement is not locked to the direction of the barrel.

Leaving an arena edge moves the tank to the opposite side. Arrow keys prevent page scrolling, and losing window focus clears the stored keys to avoid stuck movement.

The HUD shows:

- **Frame:** the latest interval between frame timestamps, in milliseconds.
- **FPS:** rendering callback frequency.
- **Steps/s:** simulation updates per second.

On the test system, normal operation was about **165 FPS**, **6.06 ms per frame**, and **60 simulation steps/s**. These counters measure different parts of the game: rendering can happen more often than simulation. FPS counts renderer calls rather than independently measuring images shown by the monitor.

## Source files

| File | Responsibility |
| --- | --- |
| `src/main.js` | Connects the game, handles reset, interpolates state, and draws the HUD. |
| `src/loop.js` | rAF scheduling, fixed timestep, accumulator, statistics, and start/stop. |
| `src/input.js` | Keyboard state through `isDown` and `justPressed`. |
| `src/sim/tank.js` | Rotation, acceleration, drag, speed limiting, and movement. |
| `src/sim/arena.js` | Wrap-around at arena boundaries. |
| `src/render/canvas.js` | Canvas setup, resizing, and device pixel ratio. |
| `src/render/draw.js` | Tank artwork, grid, and angle interpolation. |
| `src/style.css` | Page and canvas styles. |

The project uses ES modules with named exports. Simulation code has no DOM or Canvas dependencies; it updates the tank object, while rendering reads its state.

## Implementation

### M1 — Game loop

`createLoop({ step = 1 / 60, simulate, render })` provides `start`, `stop`, and timing statistics. Each rAF callback adds elapsed time to an accumulator. While enough time remains, the loop calls `simulate(step)` and subtracts one fixed step.

Rendering receives `alpha = accumulator / step`. One rendered frame may contain zero, one, or several simulation updates. This allows the simulation to run at approximately 60 steps/s even when rendering runs at 165 frames/s.

The elapsed time added per frame is capped at **0.25 seconds**. This limits catch-up work after a long delay or a hidden tab. Time beyond the cap is discarded, so the game does not try to simulate the entire period spent in the background.

### M2 — Input and movement

`createInput` keeps held keys and new presses in two private sets. `isDown` is used for continuous movement. `justPressed` consumes a new press, so holding R does not repeatedly reset the tank. Repeated keydown events are ignored when recording new presses.

Movement uses these settings:

| Parameter | Value |
| --- | ---: |
| Acceleration | 500 px/s² |
| Drag coefficient | 2 s⁻¹ |
| Maximum speed | 180 px/s |
| Rotation speed | π radians/s |
| Tank body size | 60 × 40 px |

Acceleration makes the speed build up instead of changing instantly. Drag applies exponential damping and slows the tank after thrust is released. The speed limit keeps movement controllable, and the rotation speed allows a half turn in one second.

The simulation applies rotation, acceleration, drag, the speed limit, and position updates in that order. It changes the supplied tank object in place.

### M3 — Rendering

Position is interpolated between the previous and current simulation states:

```text
rendered = previous + (current - previous) × alpha
```

`lerpAngle` uses the shortest angular difference, avoiding a long rotation across the angle boundary. After wrap-around, the previous position is updated to the new position so that interpolation does not draw a path across the arena.

The tank is drawn with Canvas translation and rotation. A grid makes movement easier to see. Canvas resizing and device pixel ratio handling keep the view aligned with the window and sharp on high-density displays.

## M4 — Experiments

The experiments used temporary changes. Afterwards, rAF, the fixed timestep, interpolation, keyboard input, and wrap-around were restored. Measurement code and automatic thrust were removed, and CPU throttling was disabled.

### 1. Blocking the main thread

A synchronous busy-wait was added to `render` every 60th frame. It occupied the main thread for approximately 100 ms.

| Measurement | Normal game | With blocking |
| --- | ---: | ---: |
| FPS | ≈165 | 134 |
| Simulation steps/s | ≈60 | 60 |
| Frame interval | ≈6 ms | Periodic intervals of ≈97 ms |

Movement paused periodically and input processing was delayed. The accumulator ran extra simulation updates after each delay, which explains why the HUD could still show about 60 steps/s while the picture stuttered.

JavaScript on the main thread runs synchronous work to completion. A timer, promise callback, or another rAF request cannot interrupt the busy-wait. Simulation and drawing run sequentially on that thread, not in parallel. Catch-up updates can recover simulation time, but cannot recover missed images.

The 97 ms value was an observed interval between frame timestamps, not a direct measurement of the busy-wait. These were HUD observations rather than a separate 10-second average.

### 2. rAF versus `setInterval(16)`

Frame intervals were measured for at least 10 seconds with the tab active. rAF was then replaced with `setInterval(() => frame(performance.now()), 16)`, keeping the same fixed-step simulation.

The last active-tab measurements were:

| Measurement | rAF | `setInterval(16)` |
| --- | ---: | ---: |
| Average callback frequency, calls/s | 165.00 | 62.50 |
| Average interval, ms | 6.06 | 16.00 |
| Minimum interval, ms | 5.90 | 14.40 |
| Maximum interval, ms | 6.20 | 17.30 |
| Interval range, ms | 0.30 | 2.90 |

The interval range is `maximum - minimum`; it was used as a simple jitter measure. Earlier runs gave 0.40 ms for rAF and 2.60 ms for the timer.

rAF produced more evenly spaced callbacks in these tests. A 16 ms timer targets `1000 / 16 = 62.5` calls/s, rather than exactly 60, and is not synchronized with browser repaint. Drawing on a timer therefore does not guarantee that every result reaches the monitor.

For the background test, a `visibilitychange` handler recorded the hidden duration, and the renderer counted calls while `document.hidden` was true. The tab was hidden longer than the planned five seconds, so the actual durations are reported.

| Background measurement | rAF | `setInterval(16)` |
| --- | ---: | ---: |
| Hidden duration, s | 26.26 | 22.81 |
| Renderer calls | 0 | 23 |
| Calls per second | 0.00 | 1.01 |

In this browser, rAF paused in the hidden tab, while the timer continued at approximately one call per second. rAF was restored because it follows rendering opportunities and gave more regular intervals on the test system.

### 3. Fixed versus variable timestep

Automatic forward thrust was applied for exactly **5 seconds of simulation time**. Each run started at `x = 100`, `y = 100`, zero velocity, and `angle = 0`. This avoided differences caused by manually pressing a key.

Wrap-around was disabled so that the final coordinate included the full distance traveled. The final update was limited to the remaining test time.

Four runs compared fixed and variable steps with normal CPU operation and **6× slowdown** in DevTools. The variable version called `simulate(dt)` once per frame without the accumulator and used `render(1, stats)` to draw the current state directly.

| Timestep | CPU setting | Updates in 5 s | Final x, px |
| --- | --- | ---: | ---: |
| Fixed | No throttling | 300 | 954.862486 |
| Fixed | 6× slowdown | 300 | 954.862486 |
| Variable | No throttling | 825 | 954.675243 |
| Variable | 6× slowdown | 813 | 954.735273 |

All runs ended at `y = 100.000000`, `vx = 180.000000`, and `vy = 0.000000`. The fixed-step runs both traveled **854.862486 px** and matched to all six recorded decimal places.

The variable-step runs differed by **0.060030 px**. Their update rates were approximately 165.0 and 162.6 per simulation second. The final speed matched because both runs reached the speed limit, but their earlier acceleration produced slightly different distances.

Multiplying movement by `dt` accounts for elapsed time, but does not remove numerical differences caused by changing step sizes. Acceleration, damping, speed limiting, and position updates are applied in sequence. Fixed steps repeat the same calculations for the same initial state and input sequence; variable steps depend on frame timing.

The difference was small because CPU throttling barely reduced the callback rate. The fixed-step screenshot still showed about 165 FPS. This test therefore measured a small endpoint difference, not a large visible trajectory change. A single run per setting also cannot separate throttling effects from normal scheduling variation.

The working game keeps the fixed timestep and interpolated rendering.

## Manual checks

After running the terminal checks, verify the game in the browser:

- Movement, rotation, reverse thrust, and reset work.
- Wrap-around and crossing the angle boundary do not cause interpolation jumps.
- Resizing keeps the canvas sharp and correctly sized.
- Switching away while holding a key does not leave movement stuck.
- The HUD shows about 60 steps/s in normal active-tab operation.
- No automatic thrust, five-second stop, or busy-wait remains.
- The production preview works and the console has no runtime errors.

The supplied renderer still needs the visible thrust effect requested by M3. Smoothness at 60 Hz and 120 Hz also remains to be checked if those display modes are available; the recorded runs used approximately 165 FPS.

## References

- [Vite guide](https://vite.dev/guide/)
- [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [Fix Your Timestep!](https://gafferongames.com/post/fix_your_timestep/)
