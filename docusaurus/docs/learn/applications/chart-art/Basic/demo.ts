import {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    NumberRange,
    EAutoRange,
    XyDataSeries,
    XyzDataSeries,
    FastLineRenderableSeries,
    FastLineSegmentRenderableSeries,
    FastTriangleRenderableSeries,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnMode,
    EColumnYMode,
    FastBubbleRenderableSeries,
    FastMountainRenderableSeries,
    ETriangleSeriesDrawMode,
    EStrokePaletteMode,
    EFillPaletteMode,
    EllipsePointMarker,
    ZoomPanModifier,
    MouseWheelZoomModifier
} from "scichart";

// #region_A_start
// Chart art: eight pictures drawn with ordinary chart series. Nothing is an image or an annotation:
// every stroke, blot and seed is a data point, so each picture zooms and pans like any other chart.

// --- Helpers: a seeded random generator, smooth noise and colours ---
// mulberry32: the same seed always gives the same picture
function seededRandom(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Value noise: random values on a grid, blended smoothly in between. Returns 0 to 1
function smoothNoise(rand) {
    const grid = new Float32Array(4096);
    for (let i = 0; i < grid.length; i++) grid[i] = rand();
    const at = (i, j) => grid[(((i * 73 + j * 151) % 4096) + 4096) % 4096];
    return (x, y) => {
        const i = Math.floor(x);
        const j = Math.floor(y);
        const u = (x - i) * (x - i) * (3 - 2 * (x - i));
        const v = (y - j) * (y - j) * (3 - 2 * (y - j));
        const top = at(i, j) + (at(i + 1, j) - at(i, j)) * u;
        const bottom = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * u;
        return top + (bottom - top) * v;
    };
}

// Colours are [red, green, blue] arrays while they are being mixed, and one ARGB number when handed to SciChart
const argb = (c, alpha = 255) => ((alpha << 24) | (c[0] << 16) | (c[1] << 8) | c[2]) >>> 0;
const clamp01 = t => Math.max(0, Math.min(1, t));
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const shade = (c, k) => [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)];
// A colour from a list of colour stops, t from 0 to 1
function ramp(stops, t) {
    const p = clamp01(t) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(p));
    return mix(stops[i], stops[i + 1], p - i);
}

// A palette provider that gives every data point its own colour, read from a list.
// In GRADIENT mode a line segment blends from its start point's colour to its end point's
const vertexStrokePalette = colors => ({
    strokePaletteMode: EStrokePaletteMode.GRADIENT,
    onAttached() {},
    onDetached() {},
    overrideStrokeArgb: (x, y, index) => colors[index]
});

const TWO_PI = 2 * Math.PI;
const unit = (x, y) => {
    const length = Math.hypot(x, y) || 1;
    return [x / length, y / length];
};

// --- Brush strokes: the paintings are each one line segment series ---
// A stroke is a few joined segments that follow direction(x, y) and take their colours from color(x, y).
// Segments are drawn in data order, so whatever is painted later covers what is underneath.
function painter(rand) {
    const xs = [];
    const ys = [];
    const colors = [];
    const stroke = (x, y, steps, stepLength, direction, color) => {
        const brightness = 0.86 + 0.28 * rand();
        let c = argb(shade(color(x, y), brightness));
        for (let k = 0; k < steps; k++) {
            const [dx, dy] = direction(x, y);
            const nx = x + dx * stepLength;
            const ny = y + dy * stepLength;
            const nc = argb(shade(color(nx, ny), brightness));
            xs.push(x, nx);
            ys.push(y, ny);
            colors.push(c, nc);
            x = nx;
            y = ny;
            c = nc;
        }
    };
    let dataSeries;
    const toSeries = wasmContext => {
        dataSeries = new XyDataSeries(wasmContext, { xValues: xs, yValues: ys });
        return new FastLineSegmentRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 3,
            paletteProvider: vertexStrokePalette(colors)
        });
    };
    // After moving strokes, send all the points to the chart again
    const refresh = () => {
        dataSeries.clear();
        dataSeries.appendRange(xs, ys);
    };
    return { xs, ys, colors, stroke, toSeries, refresh };
}
const UP = () => [0, 1];
const LEVEL = () => [1, 0];

// --- The Starry Night: about 68,000 short line segments ---
// The sky is a flow field: at each point the stroke direction is a steady drift to the right,
// bent into a circle near each swirl, star and the moon. The sky goes in first and the hills,
// village and cypress are painted over it. The sky also moves: its strokes drift slowly along the flow.
function starryNight(wasmContext, seed) {
    const rand = seededRandom(seed);
    const noise = smoothNoise(rand);
    const { xs, ys, colors, stroke, toSeries, refresh } = painter(rand);

    const SKY = [
        [18, 30, 84],
        [30, 56, 132],
        [46, 90, 168],
        [96, 146, 200],
        [170, 200, 220]
    ];
    const PALE = [206, 224, 226];
    const YELLOW = [246, 208, 70];
    const swirls = [
        { x: 45, y: 50, r: 14, spin: 1 },
        { x: 63, y: 43, r: 9, spin: -1 }
    ];
    // Eleven stars, then the moon: x, y, radius and the colour of the core
    const light = (x, y, r, core = [255, 244, 176]) => ({ x, y, r, core });
    const lights = [
        light(6, 71, 2.0),
        light(16, 57, 1.7),
        light(25, 75, 1.5),
        light(33, 64, 1.4),
        light(44, 72, 1.7),
        light(57, 75, 1.5),
        light(69, 67, 1.9),
        light(76, 53, 1.5),
        light(57, 60, 1.3),
        light(8, 44, 1.4),
        light(30, 45, 2.4, [255, 255, 240]),
        light(88, 68, 4.6, [250, 176, 50])
    ];
    const hill = x => 21 + 5 * Math.sin(x / 13 + 1) + 2.5 * Math.sin(x / 5.5) + x * 0.07;

    const skyDirection = (x, y) => {
        let vx = 1;
        let vy = 0.35 * Math.sin(x / 8 + y / 6);
        for (const s of swirls) {
            const dx = x - s.x;
            const dy = y - s.y;
            const d = Math.hypot(dx, dy) + 1e-6;
            const w = 4 * Math.exp(-((d / (s.r * 1.3)) ** 2));
            vx += (-dy / d) * s.spin * w;
            vy += (dx / d) * s.spin * w;
        }
        for (const s of lights) {
            const dx = x - s.x;
            const dy = y - s.y;
            const d = Math.hypot(dx, dy) + 1e-6;
            const w = 5 * Math.exp(-((d / (s.r * 3)) ** 2));
            vx += (-dy / d) * w;
            vy += (dx / d) * w;
        }
        return unit(vx, vy);
    };
    const skyColor = (x, y) => {
        let c = ramp(SKY, 0.7 * noise(x / 9, y / 9) + 0.3 * noise(x / 2.5 + 40, y / 2.5));
        for (const s of swirls) {
            const dx = x - s.x;
            const dy = y - s.y;
            const d = Math.hypot(dx, dy);
            const band = 0.5 + 0.5 * Math.sin(d * 1.3 - Math.atan2(dy, dx) * s.spin * 2);
            c = mix(c, PALE, 0.85 * band * Math.exp(-((d / s.r) ** 2)));
        }
        c = mix(c, PALE, 0.55 * Math.exp(-Math.max(0, y - hill(x)) / 6)); // the pale band above the hills
        for (const s of lights) {
            const d = Math.hypot(x - s.x, y - s.y);
            const rings = 0.65 + 0.35 * Math.sin(d * 3.2);
            c = mix(c, YELLOW, clamp01(1.15 * rings * Math.exp(-((d / (s.r * 2.3)) ** 2))));
            if (d < s.r) c = mix(c, s.core, 0.9);
        }
        return c;
    };

    // Sky. Where each stroke starts in the data is remembered, so that it can be moved later
    const SEGMENTS = 4;
    const sky = [];
    for (let i = 0; i < 11000; i++) {
        const x = rand() * 100;
        const y = 14 + rand() * 66;
        if (y > hill(x) - 2) {
            sky.push(xs.length);
            stroke(x, y, SEGMENTS, 0.9, skyDirection, skyColor);
        }
    }
    // Hills: strokes run along the slope
    const HILLS = [
        [16, 26, 58],
        [22, 40, 86],
        [30, 60, 112],
        [44, 86, 140]
    ];
    for (let i = 0; i < 2600; i++) {
        const x = rand() * 100;
        const y = 8 + rand() * (hill(x) - 8);
        const tint = rand();
        stroke(
            x,
            y,
            3,
            0.9,
            (px, py) => unit(1, hill(px + 0.5) - hill(px - 0.5) + 0.3 * Math.sin(py / 2 + px / 3)),
            (px, py) => ramp(HILLS, 0.6 * tint + 0.4 * (py / hill(px)))
        );
    }
    // Village: short level and upright strokes, with a few lit windows
    const VILLAGE = [
        [12, 18, 40],
        [20, 32, 62],
        [30, 56, 92],
        [40, 78, 96]
    ];
    for (let i = 0; i < 2200; i++) {
        const x = 24 + rand() * 76;
        const y = rand() * 14;
        const upright = rand() < 0.4;
        const lit = rand() < 0.035 && y > 3;
        const c = lit ? YELLOW : ramp(VILLAGE, rand());
        stroke(x, y, 1, lit ? 0.7 : 1.6, upright ? UP : LEVEL, () => c);
    }
    // The church: a block and a thin spire
    for (let i = 0; i < 260; i++) {
        const y = 6 + rand() * 24;
        const halfWidth = y < 13 ? 2.2 : (1.3 * (30 - y)) / 17;
        stroke(44 + (rand() * 2 - 1) * halfWidth, y, 1, 1.2, UP, () => [10, 14, 34]);
    }
    // The cypress: two flame shapes of upward, swaying strokes
    const CYPRESS = [
        [8, 12, 14],
        [10, 24, 18],
        [18, 42, 30],
        [38, 60, 36],
        [54, 44, 24]
    ];
    const flame = (centre, height, width, count) => {
        for (let i = 0; i < count; i++) {
            const y = rand() * height;
            const halfWidth = width * (1 - y / height) ** 0.8 * (1 + 0.25 * Math.sin(y / 3.3));
            const x = centre + 1.5 * Math.sin(y / 9) + (rand() * 2 - 1) * halfWidth;
            const tint = rand();
            stroke(
                x,
                y,
                4,
                0.9,
                (px, py) => {
                    const angle = Math.PI / 2 + 0.55 * Math.sin(py / 4 + px);
                    return [Math.cos(angle), Math.sin(angle)];
                },
                () => ramp(CYPRESS, tint)
            );
        }
    };
    flame(11, 46, 4.5, 1300);
    flame(18, 73, 7, 3600);

    // The sky moves. Every sky stroke slides a short way along its own direction, fades out, and fades back in
    // where it started. Each one is at a different point in that cycle, so the sky flows without a visible jump
    const skyEnd = sky.length * SEGMENTS * 2;
    const homeX = xs.slice(0, skyEnd);
    const homeY = ys.slice(0, skyEnd);
    const homeColors = colors.slice(0, skyEnd);
    const PERIOD = 7; // seconds for one cycle
    const TRAVEL = 2.6; // how far a stroke slides in that time
    const animate = seconds => {
        for (let i = 0; i < sky.length; i++) {
            const first = sky[i];
            const last = first + SEGMENTS * 2 - 1;
            // Where this stroke is in its cycle, from 0 to 1. The golden ratio spreads the strokes evenly through it
            const cycle = (seconds / PERIOD + i * 0.618034) % 1;
            const [dx, dy] = unit(homeX[last] - homeX[first], homeY[last] - homeY[first]);
            const slide = (cycle - 0.5) * TRAVEL;
            const alpha = Math.round(255 * clamp01(5 * Math.min(cycle, 1 - cycle)));
            for (let j = first; j <= last; j++) {
                xs[j] = homeX[j] + dx * slide;
                ys[j] = homeY[j] + dy * slide;
                colors[j] = ((alpha << 24) | (homeColors[j] & 0xffffff)) >>> 0;
            }
        }
        refresh();
        return "";
    };

    return {
        series: [toSeries(wasmContext)],
        points: xs.length,
        range: { x: [0, 100], y: [0, 80] },
        background: "#0b1230",
        animate
    };
}

// --- Pointillism: 45,000 dots in one bubble series, and three paintings ---
// Seurat and Signac built pictures from dots of a few pure colours and left the eye to mix them.
// Here the dots never move. Each painting is only a rule that gives a colour for a place on the canvas,
// picked from a short list for whatever is there: sky, sea, rock, tree. Every dot holds its colour in all
// three paintings, and the picture changes by fading each dot from one to the next, a few dots at a time.
// A bubble's size is in pixels, so it is set again whenever the zoom changes.
function pointillism(wasmContext, seed) {
    const rand = seededRandom(seed);
    const DOTS = 45000;
    const pick = list => list[Math.floor(rand() * list.length)];
    const within = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;

    // 1. The Eiffel Tower: a profile that narrows quickly, an arch between the legs and three platforms
    const eiffelTower = (x, y) => {
        const dx = Math.abs(x - 40);
        const half = 0.6 + 17 * Math.exp(-(y - 9) / 17);
        let tower = y > 9 && y < 91 && dx < half;
        if (tower && y < 25 && dx < 9 * Math.sqrt(Math.max(0, 1 - ((y - 9) / 14) ** 2))) tower = false; // the arch
        if (tower && y > 28 && y < 44 && dx < half * 0.3 && rand() < 0.65) tower = false; // open ironwork
        if (tower && y > 72 && rand() > (91 - y) / 19) tower = false; // the top thins out into the sky
        if ((y > 25 && y < 28) || (y > 44 && y < 46.5) || (y > 78 && y < 80)) tower = dx < half + 1.3; // platforms
        if (tower) {
            return rand() < (x < 40 ? 0.75 : 0.25)
                ? pick([
                      [236, 150, 50],
                      [244, 196, 70],
                      [222, 104, 44]
                  ])
                : pick([
                      [196, 60, 40],
                      [214, 96, 44],
                      [110, 70, 120],
                      [70, 84, 150]
                  ]);
        }
        const trees =
            9 + 5 * Math.exp(-(((x - 10) / 8) ** 2)) + 6 * Math.exp(-(((x - 70) / 9) ** 2)) + 1.5 * Math.sin(x / 3);
        if (y < trees) {
            return y > 6
                ? pick([
                      [60, 104, 80],
                      [96, 132, 70],
                      [40, 70, 96],
                      [150, 150, 84]
                  ])
                : pick([
                      [176, 150, 110],
                      [120, 110, 120],
                      [200, 170, 120],
                      [70, 84, 120]
                  ]);
        }
        return rand() < 0.2 + 0.5 * clamp01(1 - y / 70) // the sky is warmer towards the horizon
            ? pick([
                  [238, 224, 190],
                  [232, 196, 176],
                  [244, 214, 150]
              ])
            : pick([
                  [150, 182, 214],
                  [176, 200, 222],
                  [190, 206, 232],
                  [214, 222, 226]
              ]);
    };

    // 2. A Sunday on La Grande Jatte: the couple on the right of the picture, on a sunlit lawn by the river.
    // Each part of the two figures is a simple test: inside an oval, or between two edges at this height
    const grandeJatte = (x, y) => {
        const DRESS = [
            [50, 40, 80],
            [30, 30, 60],
            [90, 50, 90],
            [40, 60, 100],
            [70, 40, 60]
        ];
        const SUIT = [
            [30, 30, 50],
            [50, 50, 70],
            [20, 40, 60],
            [60, 40, 50]
        ];
        const SKIN = [
            [236, 200, 170],
            [224, 176, 150],
            [244, 216, 190]
        ];
        // The woman: parasol, hat, head, bodice, and a skirt with a bustle behind
        if (y >= 84 && within(x, y, 45.5, 84, 11, 7))
            return pick([
                [220, 90, 50],
                [240, 150, 70],
                [200, 60, 60],
                [250, 200, 120]
            ]);
        if (Math.abs(x - 45.5) < 0.5 && y > 58 && y < 84) return pick(SUIT);
        if (within(x, y, 50, 75, 4.4, 1.9)) return rand() < 0.2 ? [210, 50, 50] : pick(SUIT);
        if (within(x, y, 49.6, 70.4, 2.6, 3.3)) return pick(SKIN);
        if (y >= 48 && y < 67 && Math.abs(x - 50.5 + (y - 48) * 0.05) < 3.6 + 1.6 * clamp01((y - 50) / 10))
            return pick(DRESS);
        if (y >= 58 && y < 62 && x > 45 && x < 50) return pick(DRESS); // her arm, out to the parasol
        if (
            y > 6 &&
            y < 48 &&
            x > 44 - (48 - y) * 0.12 &&
            x < 57 + 9 * Math.exp(-(((y - 41) / 7) ** 2)) + (48 - y) * 0.15
        ) {
            return pick(DRESS);
        }
        // The man beside her: top hat, head and a dark suit
        if ((x > 69.5 && x < 74.5 && y > 69.5 && y < 78) || (x > 68 && x < 76 && y > 69 && y < 70.2)) return pick(SUIT);
        if (within(x, y, 72, 66.2, 2.5, 3.2)) return pick(SKIN);
        if (x > 67.5 && x < 77 - clamp01((y - 50) / 12) && y > 6 && y < 63) return pick(SUIT);
        // A small monkey on a lead
        if (
            within(x, y, 36, 9.5, 3.2, 2.2) ||
            within(x, y, 33.4, 12, 1.4, 1.5) ||
            (Math.abs(y - 11 - (x - 39) * 0.8) < 0.5 && x > 39 && x < 43)
        ) {
            return pick([
                [80, 50, 40],
                [50, 40, 50],
                [110, 70, 50]
            ]);
        }
        // Two tree trunks, the shade in the foreground, the river and the far bank
        if ((Math.abs(x - 9 - y * 0.03) < 1.3 || Math.abs(x - 24 + y * 0.02) < 0.9) && y > 20 && y < 88)
            return pick([
                [90, 70, 90],
                [120, 90, 70],
                [60, 60, 90]
            ]);
        if (y < 21 + 3 * Math.sin(x / 10))
            return pick([
                [40, 90, 70],
                [30, 70, 90],
                [70, 110, 60],
                [50, 60, 110]
            ]);
        if (y > 86 + 2 * Math.sin(x / 7))
            return pick([
                [40, 90, 60],
                [60, 110, 70],
                [30, 70, 80],
                [90, 130, 70]
            ]);
        if (y > 58 + x * 0.42 && y < 82) {
            if (within(x, y, 13, 76, 1.6, 3.4) && x < 13.6) return [250, 248, 240]; // a white sail
            return pick([
                [120, 160, 210],
                [160, 190, 220],
                [220, 222, 232],
                [100, 140, 200]
            ]);
        }
        if (y >= 82)
            return pick([
                [150, 180, 120],
                [120, 160, 110],
                [200, 200, 150]
            ]); // the far shore
        return pick([
            [150, 180, 80],
            [190, 200, 90],
            [120, 160, 70],
            [220, 210, 120],
            [240, 200, 110]
        ]); // the lawn
    };

    // 3. The Pine Tree at Saint-Tropez: a round crown on a leaning trunk, over hot ground and its own shadow
    const pineTree = (x, y) => {
        const crown =
            within(x, y, 40, 68, 30, 16) ||
            within(x, y, 22, 62, 14, 9) ||
            within(x, y, 58, 63, 15, 10) ||
            within(x, y, 40, 80, 18, 9);
        if (crown) {
            return rand() < 0.25 * clamp01((y - 62) / 20)
                ? pick([
                      [230, 190, 80],
                      [240, 150, 70]
                  ]) // sunlight on the top
                : pick([
                      [30, 110, 80],
                      [60, 150, 90],
                      [20, 80, 110],
                      [120, 170, 80],
                      [40, 60, 120]
                  ]);
        }
        if (y > 13 && y < 60 && Math.abs(x - 40 - 3 * Math.sin((y - 14) / 14)) < 2.2 + 1.6 * clamp01((24 - y) / 10)) {
            return pick([
                [120, 60, 90],
                [170, 80, 60],
                [80, 50, 110],
                [200, 110, 70]
            ]);
        }
        if (y < 30) {
            return within(x, y, 42, 15, 30, 7)
                ? pick([
                      [70, 80, 160],
                      [100, 70, 150],
                      [60, 110, 150],
                      [130, 90, 160]
                  ]) // the shadow
                : pick([
                      [230, 140, 60],
                      [240, 180, 80],
                      [200, 90, 60],
                      [250, 210, 110]
                  ]);
        }
        if (y < 42 + 3 * Math.sin(x / 9))
            return pick([
                [130, 120, 190],
                [160, 140, 200],
                [110, 130, 200],
                [180, 150, 190]
            ]); // hills
        return pick([
            [250, 220, 120],
            [250, 180, 150],
            [240, 200, 210],
            [200, 210, 240],
            [250, 236, 180]
        ]);
    };
    const PAINTINGS = [
        { title: "after Georges Seurat, The Eiffel Tower, 1889", colour: eiffelTower },
        { title: "after Georges Seurat, A Sunday on La Grande Jatte, 1884 (detail)", colour: grandeJatte },
        { title: "after Paul Signac, The Pine Tree at Saint-Tropez, 1909", colour: pineTree }
    ];

    const xs = new Float64Array(DOTS);
    const ys = new Float64Array(DOTS);
    const radii = new Float64Array(DOTS);
    const sizes = new Float64Array(DOTS);
    const delay = new Float64Array(DOTS); // when in a fade this dot changes, from 0 (first) to 1 (last)
    const colours = PAINTINGS.map(() => []); // for each painting, the colour of every dot
    const fills = [];
    for (let i = 0; i < DOTS; i++) {
        xs[i] = rand() * 80;
        ys[i] = rand() * 96;
        radii[i] = 0.36 + 0.18 * rand();
        delay[i] = rand();
        const brightness = 0.9 + 0.2 * rand();
        PAINTINGS.forEach((painting, p) => colours[p].push(shade(painting.colour(xs[i], ys[i]), brightness)));
        fills.push({ fill: argb(colours[0][i]), stroke: argb(colours[0][i]) });
    }

    const dataSeries = new XyzDataSeries(wasmContext);
    const paletteProvider = {
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overridePointMarkerArgb: (x, y, index) => fills[index]
    };
    const series = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            fill: "#ee9632",
            strokeThickness: 0
        }),
        paletteProvider
    });
    const redraw = () => {
        dataSeries.clear();
        dataSeries.appendRange(xs, ys, sizes);
    };
    const setScale = pixelsPerUnit => {
        for (let i = 0; i < DOTS; i++) sizes[i] = Math.max(1.5, 2 * radii[i] * pixelsPerUnit);
        redraw();
    };
    setScale(6);

    // Hold each painting for a few seconds, then fade to the next
    const HOLD = 5;
    const FADE = 3;
    let settled = 0; // the painting on show when no fade is running, or -1 during a fade
    const animate = seconds => {
        const turn = seconds / (HOLD + FADE);
        const from = Math.floor(turn) % PAINTINGS.length;
        const to = (from + 1) % PAINTINGS.length;
        const fade = clamp01(((turn % 1) * (HOLD + FADE) - HOLD) / FADE);
        if (fade > 0 || settled !== from) {
            for (let i = 0; i < DOTS; i++) {
                const c = argb(mix(colours[from][i], colours[to][i], clamp01((fade - 0.6 * delay[i]) / 0.4)));
                fills[i].fill = c;
                fills[i].stroke = c;
            }
            settled = fade > 0 ? -1 : from;
            redraw();
        }
        return PAINTINGS[fade < 0.5 ? from : to].title;
    };
    return {
        series: [series],
        points: DOTS,
        range: { x: [0, 80], y: [0, 96] },
        background: "#e8dcc0",
        animate,
        setScale
    };
}

// --- Cubist face: bright blocks in a rectangle series, facets and features in a triangle series ---
// An original face in the cubist manner. The background is the canvas cut again and again, across or down,
// into blocks. The head, hair, neck and shoulders are simple outlines, each cut by random straight lines into
// facets and coloured piece by piece. The eyes, nose and mouth are then put roughly, not exactly, where they
// belong, and wander a little. Repaint cuts everything differently.
function cubistFace(wasmContext, seed) {
    const rand = seededRandom(seed);
    const pick = list => list[Math.floor(rand() * list.length)];
    const bright = palette => argb(shade(pick(palette), 0.85 + 0.25 * rand()));
    const SKIN = [
        [255, 214, 64],
        [255, 150, 60],
        [255, 110, 130],
        [160, 220, 90],
        [250, 244, 230],
        [120, 200, 230],
        [200, 150, 240]
    ];
    const HAIR = [
        [30, 40, 120],
        [26, 22, 40],
        [90, 40, 140],
        [20, 110, 100]
    ];
    const CLOTHES = [
        [220, 40, 60],
        [240, 120, 30],
        [40, 90, 200],
        [250, 200, 50]
    ];
    const WALL = [
        [230, 50, 50],
        [40, 110, 210],
        [30, 160, 120],
        [250, 190, 40],
        [240, 110, 40],
        [150, 70, 180],
        [245, 240, 225]
    ];
    const BLACK = argb([16, 14, 20]);

    // Background blocks: always cut the largest block, across if it is wide and down if it is tall
    const blocks = [[0, 0, 80, 100]];
    const size = b => (b[2] - b[0]) * (b[3] - b[1]);
    while (blocks.length < 30) {
        blocks.sort((a, b) => size(b) - size(a));
        const [x0, y0, x1, y1] = blocks.shift();
        const t = 0.3 + 0.4 * rand();
        if (x1 - x0 > y1 - y0) blocks.push([x0, y0, x0 + (x1 - x0) * t, y1], [x0 + (x1 - x0) * t, y0, x1, y1]);
        else blocks.push([x0, y0, x1, y0 + (y1 - y0) * t], [x0, y0 + (y1 - y0) * t, x1, y1]);
    }
    const left = [];
    const bottom = [];
    const right = [];
    const top = [];
    const blockColors = [];
    const rect = (x0, y0, x1, y1, colour) => {
        left.push(x0);
        bottom.push(y0);
        right.push(x1);
        top.push(y1);
        blockColors.push(colour);
    };
    for (const [x0, y0, x1, y1] of blocks) {
        const base = pick(WALL);
        rect(x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, argb(base)); // the gaps between blocks show as dark lines
        if (rand() < 0.3) {
            // some blocks are striped
            const stripes = 3 + Math.floor(rand() * 5);
            const step = (x1 - x0 - 0.6) / (2 * stripes);
            for (let i = 0; i < stripes; i++) {
                rect(
                    x0 + 0.3 + step * 2 * i,
                    y0 + 0.3,
                    x0 + 0.3 + step * (2 * i + 1),
                    y1 - 0.3,
                    argb(shade(base, 0.6))
                );
            }
        }
    }

    // Triangles
    const xs = [];
    const ys = [];
    const colors = [];
    const triangle = (a, b, c, colour) => {
        xs.push(a[0], b[0], c[0]);
        ys.push(a[1], b[1], c[1]);
        colors.push(colour, colour, colour);
    };
    // Any shape with no dents can be filled as a fan of triangles from its first corner
    const fill = (shape, colour) => {
        for (let i = 1; i < shape.length - 1; i++) triangle(shape[0], shape[i], shape[i + 1], colour);
    };
    const line = (a, b, width, colour) => {
        const [dx, dy] = unit(b[0] - a[0], b[1] - a[1]);
        const ox = (-dy * width) / 2;
        const oy = (dx * width) / 2;
        fill(
            [
                [a[0] + ox, a[1] + oy],
                [b[0] + ox, b[1] + oy],
                [b[0] - ox, b[1] - oy],
                [a[0] - ox, a[1] - oy]
            ],
            colour
        );
    };
    const outline = (shape, width) =>
        shape.forEach((corner, i) => line(corner, shape[(i + 1) % shape.length], width, BLACK));

    // Cut a shape in two along a straight line through the point p
    const cut = (shape, p, angle) => {
        const side = q => (q[1] - p[1]) * Math.cos(angle) - (q[0] - p[0]) * Math.sin(angle);
        const parts = [[], []];
        shape.forEach((a, i) => {
            const b = shape[(i + 1) % shape.length];
            const sa = side(a);
            const sb = side(b);
            parts[sa >= 0 ? 0 : 1].push(a);
            if (sa >= 0 !== sb >= 0) {
                const t = sa / (sa - sb);
                const crossing = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
                parts[0].push(crossing);
                parts[1].push(crossing);
            }
        });
        return parts;
    };
    const area = shape => {
        let sum = 0;
        shape.forEach((a, i) => {
            const b = shape[(i + 1) % shape.length];
            sum += a[0] * b[1] - b[0] * a[1];
        });
        return Math.abs(sum) / 2;
    };
    const middle = shape => [
        shape.reduce((sum, p) => sum + p[0], 0) / shape.length,
        shape.reduce((sum, p) => sum + p[1], 0) / shape.length
    ];
    // Cut the largest piece through its middle, at any angle, until there are enough pieces
    const facets = (shape, pieces, palette) => {
        const list = [shape];
        while (list.length < pieces) {
            list.sort((a, b) => area(b) - area(a));
            list.splice(0, 1, ...cut(list[0], middle(list[0]), rand() * Math.PI));
        }
        for (const facet of list) {
            fill(facet, bright(palette));
            outline(facet, 0.4);
        }
        outline(shape, 0.9);
    };
    facets(
        [
            [8, 0],
            [72, 0],
            [66, 12],
            [48, 16],
            [34, 16],
            [14, 12]
        ],
        8,
        CLOTHES
    ); // shoulders
    facets(
        [
            [34, 8],
            [48, 8],
            [47, 26],
            [35, 26]
        ],
        3,
        SKIN
    ); // neck
    // Hair: one of several styles, each made of one or more simple shapes, with every corner nudged at random
    const CAP = [
        [24, 60],
        [58, 62],
        [61, 74],
        [46, 83],
        [30, 80],
        [21, 68]
    ];
    const STYLES = [
        [
            [
                [20, 36],
                [62, 38],
                [67, 52],
                [63, 78],
                [48, 89],
                [28, 85],
                [17, 70],
                [15, 44]
            ]
        ], // a bob
        [
            [
                [18, 50],
                [64, 50],
                [64, 78],
                [48, 89],
                [28, 85],
                [16, 72]
            ], // long, with a curtain each side
            [
                [11, 12],
                [26, 10],
                [27, 52],
                [15, 54]
            ],
            [
                [56, 10],
                [70, 12],
                [67, 54],
                [55, 52]
            ]
        ],
        [CAP], // cropped
        [
            CAP,
            [
                [36, 81],
                [50, 81],
                [55, 91],
                [44, 98],
                [33, 92]
            ]
        ], // a bun
        [
            [
                [10, 28],
                [28, 30],
                [62, 60],
                [64, 76],
                [48, 89],
                [26, 86],
                [13, 68]
            ]
        ], // swept to one side
        [
            CAP,
            [
                [29, 76],
                [36, 78],
                [30, 93]
            ],
            [
                [38, 79],
                [46, 79],
                [43, 98]
            ],
            [
                [48, 78],
                [55, 75],
                [58, 92]
            ]
        ] // spikes
    ];
    for (const shape of pick(STYLES)) {
        const nudged = shape.map(([x, y]) => [x + (rand() - 0.5) * 4, y + (rand() - 0.5) * 4]);
        facets(nudged, Math.max(2, Math.round(area(nudged) / 160)), HAIR);
    }
    facets(
        [
            [41, 20],
            [54, 30],
            [59, 48],
            [56, 66],
            [44, 76],
            [28, 70],
            [22, 52],
            [27, 32]
        ],
        18,
        SKIN
    ); // head
    const fixed = xs.length; // everything after this is redrawn each frame

    // Features are drawn round their own centre, then turned and moved into place
    const place = (x, y, angle) => (u, v) => [
        x + u * Math.cos(angle) - v * Math.sin(angle),
        y + u * Math.sin(angle) + v * Math.cos(angle)
    ];
    const almond = (at, length, height, colour) => {
        const shape = [];
        for (let i = 0; i < 32; i++) {
            const a = (TWO_PI * i) / 32;
            shape.push(at((length / 2) * Math.cos(a), height * Math.sin(a) * Math.abs(Math.sin(a)) ** 0.4));
        }
        fill(shape, colour);
    };
    const disc = (at, u, v, radius, colour) => {
        const shape = [];
        for (let i = 0; i < 20; i++)
            shape.push(at(u + radius * Math.cos((TWO_PI * i) / 20), v + radius * Math.sin((TWO_PI * i) / 20)));
        fill(shape, colour);
    };
    const eye = (at, length, iris) => {
        almond(at, length + 1.4, length * 0.36 + 0.7, BLACK);
        almond(at, length, length * 0.36, argb([252, 250, 244]));
        disc(at, 0, 0, length * 0.24, iris);
        disc(at, 0, 0, length * 0.11, BLACK);
        line(at(-length * 0.62, length * 0.55), at(length * 0.5, length * 0.72), 1, BLACK); // eyebrow
    };
    const mouth = (at, length) => {
        almond(at, length + 1.2, length * 0.3 + 0.6, BLACK);
        almond(at, length, length * 0.3, argb([224, 30, 54]));
        line(at(-length / 2, 0), at(length / 2, 0), 0.45, BLACK);
    };
    const nose = (at, colour) => {
        const shape = [at(0, 10), at(0, -9), at(6.5, -8)];
        fill(shape, colour);
        outline(shape, 0.6);
        disc(at, 3.6, -7, 0.8, BLACK);
    };
    const IRISES = [
        [40, 110, 210],
        [30, 150, 110],
        [130, 76, 30]
    ];
    const spot = (x, y, angle, length) => ({ x, y, angle, length, phase: rand() * TWO_PI });
    const features = {
        nose: { ...spot(39 + 3 * rand(), 47 + 4 * rand(), (rand() - 0.5) * 0.4, 0), colour: bright(SKIN) },
        eyeA: {
            ...spot(30 + 6 * rand(), 54 + 7 * rand(), (rand() - 0.5) * 0.5, 9 + 3 * rand()),
            colour: argb(pick(IRISES))
        },
        eyeB: {
            ...spot(47 + 6 * rand(), 46 + 18 * rand(), 0.9 + 1.2 * rand(), 7 + 6 * rand()),
            colour: argb(pick(IRISES))
        },
        mouth: spot(35 + 12 * rand(), 27 + 5 * rand(), (rand() - 0.5) * 0.9, 9 + 4 * rand())
    };

    const blockPalette = {
        fillPaletteMode: EFillPaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb: (x, y, index) => blockColors[index]
    };
    const rectangles = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, { xValues: left, yValues: bottom, x1Values: right, y1Values: top }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        strokeThickness: 0,
        paletteProvider: blockPalette
    });
    const trianglePalette = {
        fillPaletteMode: EFillPaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb: (x, y, index) => colors[index]
    };
    const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: false, containsNaN: false });
    const triangles = new FastTriangleRenderableSeries(wasmContext, {
        dataSeries,
        drawMode: ETriangleSeriesDrawMode.List,
        paletteProvider: trianglePalette
    });
    const animate = seconds => {
        xs.length = fixed;
        ys.length = fixed;
        colors.length = fixed;
        // where a feature is now: its own spot, plus a slow wander
        const at = f =>
            place(
                f.x + 1.3 * Math.sin(0.5 * seconds + f.phase),
                f.y + 1.1 * Math.cos(0.37 * seconds + 2 * f.phase),
                f.angle + 0.12 * Math.sin(0.3 * seconds + f.phase)
            );
        nose(at(features.nose), features.nose.colour);
        eye(at(features.eyeA), features.eyeA.length, features.eyeA.colour);
        eye(at(features.eyeB), features.eyeB.length, features.eyeB.colour);
        mouth(at(features.mouth), features.mouth.length);
        dataSeries.clear();
        dataSeries.appendRange(xs, ys);
        return "";
    };
    animate(0);
    return {
        series: [rectangles, triangles],
        points: left.length + xs.length,
        range: { x: [0, 80], y: [0, 100] },
        background: "#141218",
        animate
    };
}

// --- Tachisme: blots, brush marks and spatter as one triangle series ---
// In List mode every three points make one triangle. A blot is a fan of triangles round its centre,
// with an edge made wobbly by a few sine waves; a brush mark is a ribbon of triangles along a curve.
function tachisme(wasmContext, seed) {
    const rand = seededRandom(seed);
    const xs = [];
    const ys = [];
    const colors = [];
    const triangle = (x0, y0, x1, y1, x2, y2, c) => {
        xs.push(x0, x1, x2);
        ys.push(y0, y1, y2);
        colors.push(c, c, c);
    };
    // The picture is painted in front of you. paintFor(seconds, mark) makes the triangles of one mark and
    // spreads the moments they appear over that many seconds, so a brush mark is drawn along its length
    const appearsAt = []; // for each triangle, the time it is added to the chart
    let clock = 0;
    const paintFor = (seconds, mark) => {
        const first = appearsAt.length;
        mark();
        const count = xs.length / 3 - first;
        for (let i = 0; i < count; i++) appearsAt.push(clock + (seconds * (i + 1)) / count);
        clock += seconds;
    };
    const BLACK = [22, 20, 20];
    const INKS = [
        BLACK,
        BLACK,
        BLACK,
        [198, 46, 32],
        [198, 46, 32],
        [26, 60, 138],
        [26, 60, 138],
        [212, 158, 48],
        [248, 246, 238]
    ];

    const blot = (cx, cy, radius, c, sides) => {
        const waves = [2, 3, 4, 5, 7, 9].map(k => [k, (0.55 * rand()) / k ** 0.8, rand() * 2 * Math.PI]);
        const stretch = 0.65 + 0.8 * rand();
        const turn = rand() * Math.PI;
        const edge = i => {
            const angle = (2 * Math.PI * i) / sides;
            let r = radius;
            for (const [k, size, phase] of waves) r += radius * size * Math.cos(k * angle + phase);
            const px = r * Math.cos(angle) * stretch;
            const py = r * Math.sin(angle);
            return [cx + px * Math.cos(turn) - py * Math.sin(turn), cy + px * Math.sin(turn) + py * Math.cos(turn)];
        };
        let previous = edge(0);
        for (let i = 1; i <= sides; i++) {
            const next = edge(i);
            triangle(cx, cy, previous[0], previous[1], next[0], next[1], c);
            previous = next;
        }
    };
    const brushMark = (x0, y0, x1, y1, width, c) => {
        // a quadratic curve from (x0, y0) to (x1, y1), bowed sideways, widest in the middle
        const bow = (rand() - 0.5) * 0.9;
        const mx = (x0 + x1) / 2 - (y1 - y0) * bow;
        const my = (y0 + y1) / 2 + (x1 - x0) * bow;
        const STEPS = 60;
        let left = null;
        let right = null;
        for (let i = 0; i <= STEPS; i++) {
            const t = i / STEPS;
            const x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * mx + t * t * x1;
            const y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * my + t * t * y1;
            const tx = 2 * (1 - t) * (mx - x0) + 2 * t * (x1 - mx);
            const ty = 2 * (1 - t) * (my - y0) + 2 * t * (y1 - my);
            const length = Math.hypot(tx, ty) || 1;
            const half = width * Math.sin(Math.PI * t) ** 0.6 * (0.8 + 0.4 * rand());
            const nextLeft = [x - (ty / length) * half, y + (tx / length) * half];
            const nextRight = [x + (ty / length) * half, y - (tx / length) * half];
            if (left) {
                triangle(left[0], left[1], right[0], right[1], nextLeft[0], nextLeft[1], c);
                triangle(right[0], right[1], nextRight[0], nextRight[1], nextLeft[0], nextLeft[1], c);
            }
            left = nextLeft;
            right = nextRight;
        }
    };

    // Thin washes first, then the blots along one diagonal sweep, the brush marks and the spatter
    for (let i = 0; i < 4; i++) {
        const wash = i % 2 ? [120, 140, 152] : [212, 158, 48];
        paintFor(0.5, () => blot(20 + rand() * 60, 18 + rand() * 44, 14 + rand() * 12, argb(wash, 50), 72));
    }
    const sweep = t => [12 + 76 * t, 16 + 48 * t + 10 * Math.sin(t * 5 + seed)];
    const centres = [];
    for (let i = 0; i < 46; i++) {
        const [sx, sy] = sweep(rand());
        const cx = sx + (rand() + rand() - 1) * 14;
        const cy = sy + (rand() + rand() - 1) * 14;
        const radius = 1.2 + 8 * rand() ** 2.2;
        centres.push([cx, cy, radius]);
        const ink = argb(INKS[Math.floor(rand() * INKS.length)], 200 + Math.floor(rand() * 50));
        paintFor(0.05 + radius / 40, () => blot(cx, cy, radius, ink, 56));
    }
    for (let i = 0; i < 6; i++) {
        const [ax, ay] = sweep(rand() * 0.6);
        const angle = 0.6 + (rand() - 0.5) * 2.4;
        const length = 18 + rand() * 30;
        const x1 = ax + length * Math.cos(angle);
        const y1 = ay + length * Math.sin(angle);
        paintFor(length / 60, () => brushMark(ax, ay, x1, y1, 0.8 + rand() * 1.8, argb(BLACK, 235)));
    }
    for (let i = 0; i < 700; i++) {
        const [cx, cy, radius] = centres[Math.floor(rand() * centres.length)];
        const distance = radius * (1 + 3 * -Math.log(1 - rand() * 0.98));
        const angle = rand() * 2 * Math.PI;
        const ink = rand() < 0.7 ? BLACK : INKS[Math.floor(rand() * INKS.length)];
        const x = cx + distance * Math.cos(angle);
        const y = cy + distance * Math.sin(angle);
        paintFor(0.004, () => blot(x, y, 0.08 + 0.5 * rand() ** 3, argb(ink, 230), 7));
    }

    // Each triangle takes the colour, and the transparency, stored for its points
    const paletteProvider = {
        fillPaletteMode: EFillPaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb: (x, y, index) => colors[index]
    };
    const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: false, containsNaN: false });
    const series = new FastTriangleRenderableSeries(wasmContext, {
        dataSeries,
        drawMode: ETriangleSeriesDrawMode.List,
        paletteProvider
    });
    // Each frame, add the triangles whose moment has come
    let painted = 0;
    const animate = seconds => {
        let due = painted;
        while (due < appearsAt.length && appearsAt[due] <= seconds) due++;
        if (due > painted) {
            dataSeries.appendRange(xs.slice(3 * painted, 3 * due), ys.slice(3 * painted, 3 * due));
            painted = due;
        }
        return painted < appearsAt.length ? "painting" : "";
    };
    animate(0);
    return {
        series: [series],
        points: xs.length,
        range: { x: [0, 100], y: [0, 80] },
        background: "#ece5d3",
        animate
    };
}

// --- String art: 3,600 threads in one line segment series, redrawn every frame ---
// Each pattern says where thread i starts and ends for a number k, which grows slowly.
// Because k is rarely a whole number, the picture is always folding from one figure into the next.
const STRING_PATTERNS = [
    {
        // Pins round a circle, pin i joined to pin k × i. A whole number k gives k - 1 lobes; k = 2 is the cardioid
        name: "times table",
        start: 2,
        speed: 0.05,
        thread: (a, k) => [Math.cos(a), Math.sin(a), Math.cos(k * a), Math.sin(k * a)]
    },
    {
        // A rose curve with six petals, walked in steps of k degrees and joined up as it goes
        name: "Maurer rose",
        start: 71,
        speed: 0.004,
        thread: (a, k, i) => {
            const rose = angle => [Math.sin(6 * angle) * Math.cos(angle), Math.sin(6 * angle) * Math.sin(angle)];
            const step = (k * Math.PI) / 180;
            return [...rose(i * step), ...rose((i + 1) * step)];
        }
    },
    {
        // Two points chase each other round a Lissajous figure, k apart, with a thread between them
        name: "Lissajous stitching",
        start: 0.4,
        speed: 0.03,
        thread: (a, k) => [Math.cos(3 * a), Math.sin(2 * a), Math.cos(3 * (a + k)), Math.sin(2 * (a + k))]
    },
    {
        // From a circle to a three-cornered curve inside it, which is traced k times as fast
        name: "epicycles",
        start: 1,
        speed: 0.04,
        thread: (a, k) => [
            Math.cos(a),
            Math.sin(a),
            0.55 * Math.cos(k * a) + 0.45 * Math.cos(2 * k * a),
            0.55 * Math.sin(k * a) - 0.45 * Math.sin(2 * k * a)
        ]
    }
];
function stringArt(wasmContext, seed) {
    const THREADS = 3600;
    const pattern = STRING_PATTERNS[seed % STRING_PATTERNS.length];
    const xs = new Float64Array(THREADS * 2);
    const ys = new Float64Array(THREADS * 2);
    const colors = [];
    // Each thread fades from one colour at its start to another at its end
    const COLOURS = [
        [80, 199, 224],
        [174, 65, 142],
        [247, 206, 70],
        [80, 199, 224]
    ];
    for (let i = 0; i < THREADS; i++) {
        colors.push(argb(ramp(COLOURS, i / THREADS)), argb(ramp(COLOURS, (i / THREADS + 0.3) % 1)));
    }
    const dataSeries = new XyDataSeries(wasmContext);
    const series = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 1,
        opacity: 0.4,
        paletteProvider: vertexStrokePalette(colors)
    });
    const animate = seconds => {
        const k = pattern.start + seconds * pattern.speed;
        for (let i = 0; i < THREADS; i++) {
            const [x0, y0, x1, y1] = pattern.thread((TWO_PI * i) / THREADS, k, i);
            xs[2 * i] = x0;
            ys[2 * i] = y0;
            xs[2 * i + 1] = x1;
            ys[2 * i + 1] = y1;
        }
        dataSeries.clear();
        dataSeries.appendRange(xs, ys);
        return pattern.name + ", k = " + k.toFixed(3);
    };
    animate(0);
    return { series: [series], points: THREADS * 2, range: { x: [-1.08, 1.08], y: [-1.08, 1.08] }, animate };
}

// --- Harmonograph: 60,000 points in one line series ---
// A harmonograph is a drawing machine: a pen moved by pendulums. Each direction here adds two pendulums
// whose swings slowly die away, with frequencies close to a simple ratio such as 2:3. Being slightly off
// the ratio is what makes the figure drift instead of retracing itself. One phase keeps turning, so the drawing moves.
function harmonograph(wasmContext, seed) {
    const rand = seededRandom(seed + 11);
    const POINTS = 60000;
    const TURNS = 60;
    const RATIOS = [
        [2, 3],
        [3, 4],
        [1, 2],
        [3, 5],
        [2, 5],
        [4, 5],
        [1, 3]
    ];
    const [slow, fast] = RATIOS[seed % RATIOS.length];
    const pendulum = frequency => ({
        frequency: frequency + (rand() - 0.5) * 0.01,
        phase: rand() * TWO_PI,
        decay: (1.2 + 1.6 * rand()) / (TURNS * TWO_PI)
    });
    const pendulums = [pendulum(slow), pendulum(fast), pendulum(slow), pendulum(fast)];
    const xs = new Float64Array(POINTS);
    const ys = new Float64Array(POINTS);
    const colors = [];
    const INK = [
        [247, 206, 70],
        [238, 110, 80],
        [174, 65, 142],
        [80, 199, 224],
        [40, 80, 160]
    ];
    for (let i = 0; i < POINTS; i++) colors.push(argb(ramp(INK, i / POINTS)));
    // The points are not in x order, so tell the data series: it then skips the shortcuts that rely on sorted data
    const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: false, containsNaN: false });
    const series = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 1,
        opacity: 0.85,
        paletteProvider: vertexStrokePalette(colors)
    });
    const animate = seconds => {
        const turning = seconds * 0.12;
        const swing = (p, t, extra) => Math.sin(p.frequency * t + p.phase + extra) * Math.exp(-p.decay * t);
        for (let i = 0; i < POINTS; i++) {
            const t = (TURNS * TWO_PI * i) / POINTS;
            xs[i] = 0.5 * (swing(pendulums[0], t, turning) + swing(pendulums[1], t, 0));
            ys[i] = 0.5 * (swing(pendulums[2], t, 0) + swing(pendulums[3], t, 0));
        }
        dataSeries.clear();
        dataSeries.appendRange(xs, ys);
        return "frequencies " + slow + ":" + fast;
    };
    animate(0);
    return { series: [series], points: POINTS, range: { x: [-1.05, 1.05], y: [-1.05, 1.05] }, animate };
}

// --- Sunflowers: 143,000 seeds in one bubble series ---
// In each flower, seed i sits at angle i × 137.5° and distance √i from the centre. 137.5° is the golden angle,
// the one turn that packs the seeds evenly. Each flower swings its angle away by a tiny fraction of a degree
// and back, to show how quickly that breaks. The flowers have from 500 to 60,000 seeds, so the bubbles range
// from specks to large dots. A bubble's size is in pixels, so it is set again whenever the zoom changes.
function sunflowers(wasmContext) {
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const flower = (x, y, seeds, spacing, colours) => ({ x, y, seeds, spacing, colours, first: 0 }); // first: its first seed
    const FLOWERS = [
        flower(0, 0, 60000, 0.22, [
            [60, 34, 16],
            [128, 70, 20],
            [232, 140, 28],
            [255, 206, 56],
            [255, 236, 130]
        ]),
        flower(48, 30, 30000, 0.2, [
            [90, 20, 60],
            [200, 50, 120],
            [255, 130, 170],
            [255, 214, 226]
        ]),
        flower(-50, -28, 24000, 0.2, [
            [16, 30, 90],
            [40, 90, 200],
            [110, 170, 240],
            [214, 234, 255]
        ]),
        flower(40, -36, 14000, 0.25, [
            [200, 150, 40],
            [250, 240, 220],
            [255, 255, 255]
        ]),
        flower(-44, 34, 9000, 0.3, [
            [40, 16, 70],
            [120, 60, 180],
            [200, 150, 240]
        ]),
        flower(-8, -48, 4000, 0.4, [
            [110, 40, 10],
            [240, 110, 30],
            [255, 180, 80]
        ]),
        flower(10, 46, 1500, 0.6, [
            [90, 10, 20],
            [220, 40, 50],
            [255, 120, 110]
        ]),
        flower(62, -4, 500, 0.9, [
            [20, 70, 40],
            [80, 180, 90],
            [190, 240, 150]
        ])
    ];
    const total = FLOWERS.reduce((sum, f) => sum + f.seeds, 0);
    const xs = new Float64Array(total);
    const ys = new Float64Array(total);
    const sizes = new Float64Array(total);
    const distance = new Float64Array(total); // each seed's distance from the centre of its flower
    const fills = [];
    let first = 0;
    for (const f of FLOWERS) {
        f.first = first;
        for (let i = 0; i < f.seeds; i++) {
            distance[first + i] = f.spacing * Math.sqrt(i);
            const fill = argb(ramp(f.colours, Math.sqrt(i / f.seeds)));
            fills.push({ fill, stroke: fill });
        }
        first += f.seeds;
    }
    const dataSeries = new XyzDataSeries(wasmContext);
    const paletteProvider = {
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overridePointMarkerArgb: (x, y, index) => fills[index]
    };
    const series = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            fill: "#ffce38",
            strokeThickness: 0
        }),
        paletteProvider
    });
    const animate = seconds => {
        FLOWERS.forEach((f, k) => {
            // Away from the golden angle: nothing for a moment, then a swing one way, and later the other.
            // The more seeds a flower has, the smaller the swing that upsets it
            const swing = Math.sin(seconds * 0.25 + k * 1.3);
            const degrees = (600 / f.seeds) * Math.sign(swing) * (Math.max(0, Math.abs(swing) - 0.4) / 0.6) ** 2;
            const turn = GOLDEN_ANGLE + (degrees * Math.PI) / 180;
            for (let i = 0; i < f.seeds; i++) {
                xs[f.first + i] = f.x + distance[f.first + i] * Math.cos(i * turn);
                ys[f.first + i] = f.y + distance[f.first + i] * Math.sin(i * turn);
            }
        });
        dataSeries.clear();
        dataSeries.appendRange(xs, ys, sizes);
        return "";
    };
    const setScale = pixelsPerUnit => {
        for (const f of FLOWERS) {
            for (let i = 0; i < f.seeds; i++) {
                sizes[f.first + i] = Math.max(
                    1.2,
                    2 * f.spacing * pixelsPerUnit * (0.4 + 0.8 * Math.sqrt(i / f.seeds))
                );
            }
        }
    };
    setScale(6);
    animate(0);
    return { series: [series], points: total, range: { x: [-88, 88], y: [-78, 78] }, animate, setScale };
}

// --- Pulsar: 80 mountain series, each hiding the ones behind it ---
// A ridgeline plot in the style of the 1970 chart of radio pulses from the pulsar CP 1919, which stacked one
// trace for each turn of the star. Each trace is a mountain series filled with the background colour, added
// from the back row to the front, so a tall pulse in front covers the traces behind it. Here the plot runs:
// a new pulse arrives at the front and the older ones step back, and the line is coloured by its height.
function pulsar(wasmContext, seed) {
    const rand = seededRandom(seed);
    const ROWS = 80;
    const SAMPLES = 300;
    const PEAK = 6;
    const xValues = new Float64Array(SAMPLES);
    for (let i = 0; i < SAMPLES; i++) xValues[i] = (100 * i) / (SAMPLES - 1);

    // Colours by height above the row's baseline, worked out once
    const HEAT = [
        [84, 104, 150],
        [80, 199, 224],
        [174, 65, 142],
        [238, 110, 80],
        [247, 206, 70],
        [255, 255, 255]
    ];
    const heat = [];
    for (let i = 0; i < 64; i++) heat.push(argb(ramp(HEAT, (i / 63) ** 0.7)));

    // The pulses wander a little from one trace to the next, so ridges run through the picture
    const pulses = [];
    for (let i = 0; i < 5; i++) pulses.push({ centre: 40 + rand() * 20, width: 1 + rand() * 2.5, height: rand() * 4 });
    const nextTrace = () => {
        for (const p of pulses) {
            p.centre = Math.max(36, Math.min(64, p.centre + (rand() - 0.5) * 1.6));
            p.height = Math.max(0, Math.min(PEAK, p.height + (rand() - 0.5) * 2.2));
            p.width = Math.max(0.9, Math.min(3.8, p.width + (rand() - 0.5) * 0.4));
        }
        const trace = new Float64Array(SAMPLES);
        let drift = 0;
        for (let i = 0; i < SAMPLES; i++) {
            const x = xValues[i];
            const envelope = Math.exp(-(((x - 50) / 17) ** 4));
            drift = 0.85 * drift + 0.35 * (rand() - 0.5);
            let y = 0.12 * (rand() - 0.5) + envelope * Math.abs(drift);
            for (const p of pulses) y += envelope * p.height * Math.exp(-(((x - p.centre) / p.width) ** 2));
            trace[i] = y;
        }
        return trace;
    };
    const traces = []; // traces[0] is the newest, at the front
    for (let row = 0; row < ROWS; row++) traces.unshift(nextTrace());

    const rows = [];
    const series = [];
    for (let row = ROWS - 1; row >= 0; row--) {
        const dataSeries = new XyDataSeries(wasmContext);
        const paletteProvider = {
            strokePaletteMode: EStrokePaletteMode.GRADIENT,
            onAttached() {},
            onDetached() {},
            overrideStrokeArgb: (x, y) => heat[Math.max(0, Math.min(63, Math.round(((y - row) / PEAK) * 63)))]
        };
        rows[row] = { dataSeries, yValues: new Float64Array(SAMPLES) };
        series.push(
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries,
                stroke: "#ffffff",
                strokeThickness: 1.5,
                fill: "#000000",
                zeroLineY: -10,
                paletteProvider
            })
        );
    }
    const draw = () => {
        for (let row = 0; row < ROWS; row++) {
            const { dataSeries, yValues } = rows[row];
            for (let i = 0; i < SAMPLES; i++) yValues[i] = row + traces[row][i];
            dataSeries.clear();
            dataSeries.appendRange(xValues, yValues);
        }
    };
    draw();
    let arrived = 0;
    const animate = seconds => {
        const due = Math.floor(seconds * 12); // twelve new pulses a second
        if (due === arrived) return "";
        for (let i = Math.max(arrived, due - ROWS); i < due; i++) {
            traces.pop();
            traces.unshift(nextTrace());
        }
        arrived = due;
        draw();
        return "";
    };
    return { series, points: ROWS * SAMPLES, range: { x: [-22, 122], y: [-8, 94] }, background: "#000000", animate };
}

const PIECES = [
    {
        name: "The Starry Night",
        build: starryNight,
        seed: 1889,
        action: "Repaint",
        unit: "line segment series",
        about: "After Vincent van Gogh, 1889. Every stroke is a line segment following a flow field."
    },
    {
        name: "Pointillism",
        build: pointillism,
        seed: 1889,
        action: "Repaint",
        unit: "bubble series",
        about: "Three paintings from one set of dots: only the colours change."
    },
    {
        name: "Cubist face",
        build: cubistFace,
        seed: 1907,
        action: "Repaint",
        unit: "series, one of rectangles and one of triangles",
        about: "A face cut into bright facets, with the eyes and mouth not quite where they belong."
    },
    {
        name: "Tachisme",
        build: tachisme,
        seed: 1891,
        action: "Repaint",
        unit: "triangle series",
        about: "Blots, brush marks and spatter, all triangles, painted in front of you."
    },
    {
        name: "String art",
        build: stringArt,
        action: "Next pattern",
        unit: "line segment series",
        about: "3,600 threads, each joining two moving points."
    },
    {
        name: "Harmonograph",
        build: harmonograph,
        action: "New pendulums",
        unit: "line series",
        about: "The path of a pen swung by four dying pendulums."
    },
    {
        name: "Sunflowers",
        build: sunflowers,
        unit: "bubble series",
        about: "Eight flowers, each seed turned by the golden angle from the last."
    },
    {
        name: "Pulsar",
        build: pulsar,
        seed: 1967,
        unit: "mountain series",
        about: "A ridgeline plot in the style of the 1970 chart of pulsar CP 1919."
    }
];

async function chartArt(divElementId) {
    // --- Layout: a row of buttons, a line of text and the chart ---
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const element = (tag, style, text = "") => {
        const el = document.createElement(tag);
        el.style.cssText = style;
        el.textContent = text;
        return el;
    };
    const BUTTON_STYLE =
        "font:inherit; background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:3px 9px; cursor:pointer;";
    const bar = element("div", "display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:8px 12px 4px;");
    const status = element("div", "padding:2px 12px 6px; color:#c8d3e6; min-height:1.4em;");
    status.setAttribute("aria-live", "off");
    const chartDiv = element("div", "flex:1; min-height:0;");
    chartDiv.id = divElementId + "-chart";
    root.append(bar, status, chartDiv);

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    // The axes are hidden: the pictures use them only as a coordinate system
    const axisOptions = {
        isVisible: false,
        autoRange: EAutoRange.Never,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false
    };
    const xAxis = new NumericAxis(wasmContext, axisOptions);
    const yAxis = new NumericAxis(wasmContext, axisOptions);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());

    let current = null; // the picture on show: { series, points, range, background, animate, setScale }
    let pieceIndex = 0;
    let shownAt = 0;
    const seeds = PIECES.map(piece => piece.seed || 0);

    // Tell a picture that sizes its marks in pixels how many pixels one unit now covers
    const rescale = () => {
        if (current && current.setScale) current.setScale(chartDiv.clientWidth / xAxis.visibleRange.diff);
    };

    // Show the whole picture with one x unit as long as one y unit, whatever shape the chart is
    const fit = () => {
        const width = chartDiv.clientWidth;
        const height = chartDiv.clientHeight;
        if (sciChartSurface.isDeleted || !current || !width || !height) return;
        const { x, y } = current.range;
        let xSpan = x[1] - x[0];
        let ySpan = y[1] - y[0];
        if (xSpan / ySpan < width / height) xSpan = (ySpan * width) / height;
        else ySpan = (xSpan * height) / width;
        xAxis.visibleRange = new NumberRange((x[0] + x[1] - xSpan) / 2, (x[0] + x[1] + xSpan) / 2);
        yAxis.visibleRange = new NumberRange((y[0] + y[1] - ySpan) / 2, (y[0] + y[1] + ySpan) / 2);
        rescale();
    };

    const describe = (extra = "") => {
        const piece = PIECES[pieceIndex];
        const count = current.series.length;
        const text =
            piece.about +
            "  " +
            count +
            " " +
            piece.unit +
            ", " +
            current.points.toLocaleString("en-GB") +
            " data points" +
            (extra ? ", " + extra : "") +
            ".";
        if (status.textContent !== text) status.textContent = text;
    };

    const buttons = PIECES.map((piece, i) => {
        const button = element("button", BUTTON_STYLE, piece.name);
        button.addEventListener("click", () => show(i));
        bar.append(button);
        return button;
    });
    const repaint = element("button", BUTTON_STYLE + "margin-left:auto;", "Repaint");
    repaint.addEventListener("click", () => {
        seeds[pieceIndex]++;
        show(pieceIndex);
    });
    bar.append(repaint);

    function show(index) {
        pieceIndex = index;
        const piece = PIECES[index];
        buttons.forEach((button, i) => {
            button.style.background = i === index ? "#50C7E0" : "#22365B";
            button.style.color = i === index ? "#17243D" : "#ffffff";
            button.setAttribute("aria-pressed", String(i === index));
        });
        repaint.style.visibility = piece.action ? "visible" : "hidden";
        repaint.textContent = piece.action || "";
        // Deleting a series also frees its data in WebAssembly memory
        sciChartSurface.renderableSeries.clear(true);
        current = piece.build(wasmContext, seeds[index]);
        sciChartSurface.background = current.background || "#17243d";
        sciChartSurface.renderableSeries.add(...current.series);
        shownAt = performance.now();
        fit();
        describe();
    }

    // One animation loop for the pictures that move
    const frame = now => {
        if (sciChartSurface.isDeleted) return;
        if (current && current.animate) describe(current.animate(Math.max(0, (now - shownAt) / 1000)));
        requestAnimationFrame(frame);
    };

    xAxis.visibleRangeChanged.subscribe(rescale); // zooming changes the scale too
    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(chartDiv);
    sciChartSurface.addDeletable({ delete: () => resizeObserver.disconnect() });
    chartDiv.addEventListener("dblclick", fit); // double-click to undo zooming and panning
    show(0);
    requestAnimationFrame(frame);
}
// #region_A_end

chartArt("scichart-root");
