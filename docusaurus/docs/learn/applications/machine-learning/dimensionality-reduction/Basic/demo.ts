import * as SciChart from "scichart";

const PER_CLASS = 80; // samples of each digit, 0 to 9: 800 points in all
const SIDE = 8; // each sample is an 8 × 8 greyscale image, so it has 64 dimensions (one per pixel)

// Sample data: simulated handwritten digits. Each digit 0 to 9 is drawn as pen strokes, then every sample gets its own
// slant, size, position and stroke width, and is rasterised to an 8 × 8 grid of pixel values from 0 (blank) to 16 (ink).
// Strokes are polylines in a unit box: x from 0 (left) to 1 (right), y from 0 (top) to 1 (bottom).
function makeDigits() {
    let seed = 2008;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const loop = (cx, cy, rx, ry, from = 0, to = 2 * Math.PI) => {
        const points = [];
        for (let k = 0; k <= 16; k++) {
            const a = from + ((to - from) * k) / 16;
            points.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
        }
        return points;
    };
    const GLYPHS = [
        () => [loop(0.5, 0.5, 0.28, 0.4)],
        () => [[[0.36, 0.22], [0.52, 0.08], [0.52, 0.92]], ...(random() < 0.3 ? [[[0.34, 0.92], [0.7, 0.92]]] : [])],
        () => [[[0.22, 0.28], [0.32, 0.12], [0.5, 0.08], [0.68, 0.12], [0.77, 0.28], [0.7, 0.46], [0.22, 0.92], [0.8, 0.92]]],
        () => [[[0.22, 0.14], [0.5, 0.08], [0.74, 0.18], [0.72, 0.38], [0.45, 0.5], [0.75, 0.6], [0.78, 0.8], [0.5, 0.92], [0.22, 0.86]]],
        () => [[[0.66, 0.92], [0.66, 0.08], [0.2, 0.64], [0.84, 0.64]]],
        () => [[[0.78, 0.08], [0.3, 0.08], [0.26, 0.45], [0.55, 0.4], [0.76, 0.55], [0.76, 0.78], [0.55, 0.92], [0.24, 0.88]]],
        () => [[[0.72, 0.1], [0.46, 0.14], [0.29, 0.38], [0.25, 0.7], [0.4, 0.91], [0.63, 0.9], [0.76, 0.72], [0.66, 0.52], [0.43, 0.5], [0.27, 0.62]]],
        () => [[[0.2, 0.08], [0.8, 0.08], [0.44, 0.92]], ...(random() < 0.3 ? [[[0.4, 0.5], [0.76, 0.5]]] : [])],
        () => [loop(0.5, 0.29, 0.22, 0.2), loop(0.5, 0.7, 0.27, 0.22)],
        () => [loop(0.5, 0.32, 0.25, 0.23), [[0.75, 0.32], [0.72, 0.6], [0.58, 0.92]]]
    ];
    // Shortest distance from point (px, py) to the segment from a to b
    const segmentDistance = (px, py, a, b) => {
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy || 1)));
        return Math.hypot(px - a[0] - t * dx, py - a[1] - t * dy);
    };
    const n = 10 * PER_CLASS;
    const pixels = new Float64Array(n * SIDE * SIDE);
    const labels = new Array(n);
    for (let i = 0; i < n; i++) {
        const digit = i % 10;
        labels[i] = digit;
        const slant = 0.22 * gaussian();
        const scaleX = 0.82 + 0.2 * random();
        const scaleY = 0.86 + 0.16 * random();
        const shiftX = 0.06 * gaussian();
        const shiftY = 0.05 * gaussian();
        const halfWidth = (0.1 + 0.08 * random()) / 2;
        // Pen strokes after this sample's slant, size and position
        const strokes = GLYPHS[digit]().map((line) =>
            line.map(([x, y]) => {
                const yy = 0.5 + (y - 0.5) * scaleY + shiftY;
                return [0.5 + (x - 0.5) * scaleX + shiftX - slant * (yy - 0.5), yy];
            })
        );
        // Each pixel's value is the share of a 4 × 4 grid of sub-points that fall under the pen, scaled to 0..16
        for (let row = 0; row < SIDE; row++) {
            for (let col = 0; col < SIDE; col++) {
                let inked = 0;
                for (let sy = 0; sy < 4; sy++) {
                    for (let sx = 0; sx < 4; sx++) {
                        const px = (col + (sx + 0.5) / 4) / SIDE;
                        const py = (row + (sy + 0.5) / 4) / SIDE;
                        let near = false;
                        for (const line of strokes) {
                            for (let k = 1; k < line.length && !near; k++) near = segmentDistance(px, py, line[k - 1], line[k]) < halfWidth;
                        }
                        if (near) inked++;
                    }
                }
                const value = inked + 0.8 * gaussian(); // 0 to 16 sub-points inked, plus a little scanner noise
                pixels[i * SIDE * SIDE + row * SIDE + col] = Math.max(0, Math.min(16, Math.round(value)));
            }
        }
    }
    return { pixels, labels, n, dims: SIDE * SIDE };
}

// The controls, the colour key, the charts and the side panel each need an element. This splits the page's div into
// them; in your app they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    const font = "14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B; color:#ffffff; font:" + font;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        `<label>Method <select data-id="method" style="font:inherit">` +
        `<option value="tsne" selected>t-SNE (non-linear)</option><option value="pca">PCA (linear)</option></select></label>` +
        `<label>View <select data-id="dims" style="font:inherit">` +
        `<option value="2">2D scatter</option><option value="3">3D point cloud</option></select></label>` +
        `<label>Perplexity <input data-id="perplexity" type="range" min="2" max="100" step="1" value="30" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="perplexity"></output></label>` +
        `<label>Start from <select data-id="init" style="font:inherit">` +
        `<option value="pca">PCA layout</option><option value="random">Random layout</option></select></label>` +
        `<button data-id="run" type="button" style="font:inherit">Pause</button>` +
        `<button data-id="restart" type="button" style="font:inherit">Restart t-SNE</button>` +
        `<label><input data-id="scree" type="checkbox" checked> Scree plot and components</label>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; font-size:13px; color:#c8d3e8"></span>`;
    const info = document.createElement("div");
    info.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:4px 16px; padding:0 12px 6px; font-size:13px;";
    info.innerHTML = `<span data-id="key" style="display:flex; flex-wrap:wrap; gap:4px 10px; align-items:center"></span>`;
    const main = document.createElement("div");
    main.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const chartArea = document.createElement("div");
    chartArea.style.cssText = "flex:1 1 440px; min-height:340px; display:flex;";
    const chart2d = document.createElement("div");
    chart2d.id = divElementId + "-2d"; // each chart's div needs its own id
    chart2d.style.cssText = "flex:1; min-width:0;";
    const chart3d = document.createElement("div");
    chart3d.id = divElementId + "-3d";
    chart3d.style.cssText = "flex:1; min-width:0; display:none;";
    chartArea.append(chart2d, chart3d);
    const side = document.createElement("div");
    side.style.cssText = "flex:0 1 300px; min-width:240px; display:flex; flex-direction:column; font-size:13px;";
    const scree = document.createElement("div");
    scree.id = divElementId + "-scree";
    scree.style.cssText = "height:230px;";
    const images = document.createElement("div");
    images.style.cssText = "display:flex; flex-wrap:wrap; gap:8px 12px; padding:8px 12px;";
    const canvasBlock = (id, title) =>
        `<figure style="margin:0; text-align:center"><canvas data-id="${id}" width="56" height="56" ` +
        `style="width:56px; height:56px; image-rendering:pixelated; border:1px solid #3a5480"></canvas>` +
        `<figcaption style="color:#c8d3e8">${title}</figcaption></figure>`;
    images.innerHTML = canvasBlock("pc1", "PC1") + canvasBlock("pc2", "PC2") + canvasBlock("pc3", "PC3") + canvasBlock("hover", "Hovered");
    const note = document.createElement("p");
    note.style.cssText = "margin:0; padding:0 12px 8px; color:#c8d3e8;";
    note.textContent = "PC1 to PC3 show each pixel's weight in a component (orange positive, blue negative). Hovered shows the digit under the mouse.";
    side.append(scree, images, note);
    main.append(chartArea, side);
    root.append(bar, info, main);
    const get = (selector) => root.querySelector(selector);
    return {
        chart2d,
        chart3d,
        scree,
        side,
        methodSelect: get('select[data-id="method"]'),
        dimsSelect: get('select[data-id="dims"]'),
        perplexityInput: get('input[data-id="perplexity"]'),
        perplexityOutput: get('output[data-id="perplexity"]'),
        initSelect: get('select[data-id="init"]'),
        runButton: get('button[data-id="run"]'),
        restartButton: get('button[data-id="restart"]'),
        screeCheckbox: get('input[data-id="scree"]'),
        key: get('[data-id="key"]'),
        readout: get('[data-id="readout"]'),
        loadingCanvases: [get('canvas[data-id="pc1"]'), get('canvas[data-id="pc2"]'), get('canvas[data-id="pc3"]')],
        hoverCanvas: get('canvas[data-id="hover"]')
    };
}

async function dimensionalityReduction(divElementId) {
    const ui = createLayout(divElementId);
    const data = makeDigits();

    // #region_A_start
    // PCA and t-SNE of 800 simulated 8 × 8 digit images (64 dimensions each), computed in the browser and drawn with
    // SciChart.js as a 2D scatter chart or a 3D point cloud, with a PCA scree plot alongside.
    const {
        SciChartSurface,
        SciChart3DSurface,
        NumericAxis,
        NumericAxis3D,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        Vector3,
        XyDataSeries,
        XyzDataSeries3D,
        XyScatterRenderableSeries,
        ScatterRenderableSeries3D,
        FastColumnRenderableSeries,
        FastLineRenderableSeries,
        EllipsePointMarker,
        SpherePointMarker3D,
        EStrokePaletteMode,
        parseColorToUIntArgb,
        WaveAnimation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D,
        XyzSeriesInfo3D
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- PCA (plain JavaScript) ---

    // Eigenvalues and eigenvectors of a symmetric d × d matrix (row-major array) by cyclic Jacobi rotations.
    // Returns them sorted from the largest eigenvalue down; vectors[k] is the unit eigenvector for values[k].
    function symmetricEigen(matrix, d) {
        const a = Float64Array.from(matrix);
        const v = new Float64Array(d * d);
        for (let i = 0; i < d; i++) v[i * d + i] = 1;
        for (let sweep = 0; sweep < 100; sweep++) {
            let off = 0;
            for (let p = 0; p < d; p++) for (let q = p + 1; q < d; q++) off += a[p * d + q] * a[p * d + q];
            if (off < 1e-22) break;
            for (let p = 0; p < d; p++) {
                for (let q = p + 1; q < d; q++) {
                    const apq = a[p * d + q];
                    if (Math.abs(apq) < 1e-300) continue;
                    // Rotate rows and columns p and q by the angle that zeroes a[p][q]
                    const theta = (a[q * d + q] - a[p * d + p]) / (2 * apq);
                    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
                    const c = 1 / Math.sqrt(t * t + 1);
                    const s = t * c;
                    for (let k = 0; k < d; k++) {
                        const akp = a[k * d + p], akq = a[k * d + q];
                        a[k * d + p] = c * akp - s * akq;
                        a[k * d + q] = s * akp + c * akq;
                    }
                    for (let k = 0; k < d; k++) {
                        const apk = a[p * d + k], aqk = a[q * d + k];
                        a[p * d + k] = c * apk - s * aqk;
                        a[q * d + k] = s * apk + c * aqk;
                    }
                    for (let k = 0; k < d; k++) {
                        const vkp = v[k * d + p], vkq = v[k * d + q];
                        v[k * d + p] = c * vkp - s * vkq;
                        v[k * d + q] = s * vkp + c * vkq;
                    }
                }
            }
        }
        const order = Array.from({ length: d }, (_, i) => i).sort((i, j) => a[j * d + j] - a[i * d + i]);
        const values = order.map((i) => Math.max(0, a[i * d + i]));
        const vectors = order.map((i) => {
            const vector = Array.from({ length: d }, (_, k) => v[k * d + i]);
            // An eigenvector's sign is arbitrary: make its largest entry positive so the plot doesn't flip between runs
            const big = vector.reduce((best, x) => (Math.abs(x) > Math.abs(best) ? x : best), 0);
            return big < 0 ? vector.map((x) => -x) : vector;
        });
        return { values, vectors };
    }

    // PCA of n rows × d columns: centre each column, take the covariance matrix's eigenvectors (the principal
    // components, or loadings) and project every row onto them (the scores)
    function pca(X, n, d) {
        const mean = new Float64Array(d);
        for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) mean[j] += X[i * d + j] / n;
        const centred = X.map((x, k) => x - mean[k % d]);
        const covariance = new Float64Array(d * d);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < d; j++) {
                const xj = centred[i * d + j];
                if (xj === 0) continue;
                for (let k = j; k < d; k++) covariance[j * d + k] += (xj * centred[i * d + k]) / (n - 1);
            }
        }
        for (let j = 0; j < d; j++) for (let k = 0; k < j; k++) covariance[j * d + k] = covariance[k * d + j];
        const { values, vectors } = symmetricEigen(covariance, d);
        const total = values.reduce((sum, x) => sum + x, 0);
        const score = (i, component) => {
            let s = 0;
            for (let j = 0; j < d; j++) s += centred[i * d + j] * vectors[component][j];
            return s;
        };
        return { values, vectors, explained: values.map((x) => x / total), score };
    }

    // --- t-SNE (plain JavaScript, exact gradient: fine for up to a few thousand points) ---

    // Squared Euclidean distances between all pairs of rows
    function squaredDistances(X, n, d) {
        const D = new Float64Array(n * n);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                let s = 0;
                for (let k = 0; k < d; k++) {
                    const diff = X[i * d + k] - X[j * d + k];
                    s += diff * diff;
                }
                D[i * n + j] = D[j * n + i] = s;
            }
        }
        return D;
    }

    // Input similarities P. For each point i, a binary search finds the Gaussian width whose neighbour
    // probabilities p(j|i) have perplexity 2^H = the target (H = entropy in bits); then P is symmetrised.
    function affinities(D, n, perplexity) {
        const P = new Float64Array(n * n);
        const targetEntropy = Math.log(perplexity); // natural log: perplexity = e^H here, the same as 2^H in bits
        const row = new Float64Array(n);
        for (let i = 0; i < n; i++) {
            let beta = 1; // beta = 1 / (2 sigma²)
            let lo = 0;
            let hi = Infinity;
            let minD = Infinity;
            for (let j = 0; j < n; j++) if (j !== i && D[i * n + j] < minD) minD = D[i * n + j];
            for (let attempt = 0; attempt < 64; attempt++) {
                let sum = 0;
                let weighted = 0;
                for (let j = 0; j < n; j++) {
                    // subtract the nearest distance before exp() so small widths don't underflow to zero
                    row[j] = j === i ? 0 : Math.exp(-beta * (D[i * n + j] - minD));
                    sum += row[j];
                    weighted += row[j] * (D[i * n + j] - minD);
                }
                const entropy = Math.log(sum) + (beta * weighted) / sum;
                if (Math.abs(entropy - targetEntropy) < 1e-6) break;
                if (entropy > targetEntropy) {
                    lo = beta;
                    beta = hi === Infinity ? beta * 2 : (beta + hi) / 2;
                } else {
                    hi = beta;
                    beta = (beta + lo) / 2;
                }
            }
            let sum = 0;
            for (let j = 0; j < n; j++) sum += row[j];
            for (let j = 0; j < n; j++) P[i * n + j] = row[j] / sum;
        }
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const p = Math.max((P[i * n + j] + P[j * n + i]) / (2 * n), 1e-12);
                P[i * n + j] = P[j * n + i] = p;
            }
            P[i * n + i] = 0;
        }
        return P;
    }

    // Gradient descent on the Kullback-Leibler divergence between P and the Student-t similarities Q of the map,
    // with momentum, per-coordinate gains and early exaggeration, as in van der Maaten and Hinton (2008)
    function createTsne(P, n, dims, initial) {
        const Y = Float64Array.from(initial);
        const velocity = new Float64Array(n * dims);
        const gains = new Float64Array(n * dims).fill(1);
        const grad = new Float64Array(n * dims);
        const num = new Float64Array(n * n);
        const learningRate = 200;
        let iteration = 0;
        let kl = NaN;
        function step() {
            const exaggeration = iteration < 250 ? 12 : 1;
            const momentum = iteration < 250 ? 0.5 : 0.8;
            let Z = 0;
            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    let s = 0;
                    for (let k = 0; k < dims; k++) {
                        const diff = Y[i * dims + k] - Y[j * dims + k];
                        s += diff * diff;
                    }
                    const q = 1 / (1 + s); // Student-t kernel with one degree of freedom
                    num[i * n + j] = num[j * n + i] = q;
                    Z += 2 * q;
                }
            }
            grad.fill(0);
            const measure = iteration % 10 === 0; // the KL divergence is only for the readout: work it out every 10 steps
            let divergence = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i === j) continue;
                    const p = P[i * n + j];
                    const q = num[i * n + j];
                    const force = 4 * (exaggeration * p - q / Z) * q;
                    for (let k = 0; k < dims; k++) grad[i * dims + k] += force * (Y[i * dims + k] - Y[j * dims + k]);
                    if (measure) divergence += p * Math.log(p / Math.max(q / Z, 1e-12));
                }
            }
            for (let k = 0; k < n * dims; k++) {
                gains[k] = Math.sign(grad[k]) !== Math.sign(velocity[k]) ? gains[k] + 0.2 : Math.max(0.01, gains[k] * 0.8);
                velocity[k] = momentum * velocity[k] - learningRate * gains[k] * grad[k];
                Y[k] += velocity[k];
            }
            for (let k = 0; k < dims; k++) {
                let mean = 0;
                for (let i = 0; i < n; i++) mean += Y[i * dims + k] / n;
                for (let i = 0; i < n; i++) Y[i * dims + k] -= mean;
            }
            if (measure) kl = divergence;
            iteration++;
        }
        return { Y, step, get iteration() { return iteration; }, get kl() { return kl; } };
    }

    // Share of each point's k nearest neighbours in the original space that are also among its k nearest in the map:
    // 1 means every local neighbourhood survived the reduction
    function nearestNeighbours(D, n, k) {
        const result = [];
        for (let i = 0; i < n; i++) {
            const order = Array.from({ length: n }, (_, j) => j).filter((j) => j !== i);
            order.sort((a, b) => D[i * n + a] - D[i * n + b]);
            result.push(order.slice(0, k));
        }
        return result;
    }
    function neighbourhoodKept(highNeighbours, Y, n, dims, k) {
        const mapNeighbours = nearestNeighbours(squaredDistances(Y, n, dims), n, k);
        let kept = 0;
        for (let i = 0; i < n; i++) {
            const set = new Set(mapNeighbours[i]);
            for (const j of highNeighbours[i]) if (set.has(j)) kept++;
        }
        return kept / (n * k);
    }

    // --- Run the maths once for the data ---
    const { pixels, labels, n, dims: d } = data;
    const pcaResult = pca(pixels, n, d);
    const highD = squaredDistances(pixels, n, d);
    const K = 10;
    const highNeighbours = nearestNeighbours(highD, n, K);
    const pcaCoords = (dims) => {
        const Y = new Float64Array(n * dims);
        for (let i = 0; i < n; i++) for (let k = 0; k < dims; k++) Y[i * dims + k] = pcaResult.score(i, k);
        return Y;
    };

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#F6E05E", "#EF5350", "#AE418D", "#B6E35B", "#9B8AFB", "#FFFFFF"];
    const argb = COLOURS.map((c) => parseColorToUIntArgb(c));
    ui.key.innerHTML = COLOURS.map(
        (c, digit) =>
            `<span style="display:inline-flex; align-items:center; gap:4px"><span style="width:11px; height:11px; ` +
            `border-radius:50%; background:${c}"></span>${digit}</span>`
    ).join("");

    // 2D: one scatter series; a palette provider colours each point by its digit
    const chart2d = await SciChartSurface.create(ui.chart2d, { theme });
    const xAxis = new NumericAxis(chart2d.wasmContext, { axisTitle: "Dimension 1", autoRange: EAutoRange.Always, growBy: new NumberRange(0.05, 0.05), labelPrecision: 0 });
    const yAxis = new NumericAxis(chart2d.wasmContext, { axisTitle: "Dimension 2", axisAlignment: EAxisAlignment.Left, autoRange: EAutoRange.Always, growBy: new NumberRange(0.05, 0.05), labelPrecision: 0 });
    chart2d.sciChartSurface.xAxes.add(xAxis);
    chart2d.sciChartSurface.yAxes.add(yAxis);
    const scatterData = new XyDataSeries(chart2d.wasmContext, { dataSeriesName: "Digits", dataIsSortedInX: false });
    const byDigit = {
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached: () => {},
        onDetached: () => {},
        overridePointMarkerArgb: (x, y, index) => ({ fill: argb[labels[index]], stroke: argb[labels[index]] })
    };
    chart2d.sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(chart2d.wasmContext, {
            dataSeries: scatterData,
            pointMarker: new EllipsePointMarker(chart2d.wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: "#FFFFFF", opacity: 0.85 }),
            paletteProvider: byDigit
        })
    );
    chart2d.sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (infos) => {
                const info = infos.find((s) => s.isHit);
                if (!info) return [];
                drawDigit(ui.hoverCanvas, info.dataSeriesIndex);
                return [`Digit ${labels[info.dataSeriesIndex]} (sample ${info.dataSeriesIndex})`];
            }
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // 3D: one point cloud, coloured per point through its metadata. Created the first time the 3D view is chosen.
    async function create3d() {
        const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(ui.chart3d, {
            theme,
            worldDimensions: new Vector3(200, 200, 200),
            cameraOptions: { position: new Vector3(-260, 200, -260), target: new Vector3(0, 0, 0) }
        });
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Dimension 1", labelPrecision: 0 });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Dimension 2", labelPrecision: 0 });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Dimension 3", labelPrecision: 0 });
        const dataSeries = new XyzDataSeries3D(wasmContext, { dataSeriesName: "Digits" });
        sciChart3DSurface.renderableSeries.add(
            new ScatterRenderableSeries3D(wasmContext, {
                dataSeries,
                pointMarker: new SpherePointMarker3D(wasmContext, { size: 6, fill: "#FFFFFF" })
            })
        );
        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(), // drag to rotate
            new MouseWheelZoomModifier3D(), // scroll to zoom
            new ResetCamera3DModifier(), // double-click to reset the view
            new TooltipModifier3D({
                tooltipDataTemplate: (info) => {
                    if (!(info instanceof XyzSeriesInfo3D) || !info.isHit) return [];
                    drawDigit(ui.hoverCanvas, info.dataSeriesIndex);
                    return [`Digit ${labels[info.dataSeriesIndex]} (sample ${info.dataSeriesIndex})`];
                }
            })
        );
        return { sciChart3DSurface, dataSeries };
    }

    // Scree plot: the share of variance explained by each of the first 20 principal components, and the running total
    const scree = await SciChartSurface.create(ui.scree, { theme, title: "PCA scree plot", titleStyle: { fontSize: 14 } });
    const small = { axisTitleStyle: { fontSize: 13 }, labelStyle: { fontSize: 11 }, labelPrecision: 0 };
    scree.sciChartSurface.xAxes.add(new NumericAxis(scree.wasmContext, { ...small, axisTitle: "Component", growBy: new NumberRange(0.04, 0.04) }));
    // Left axis: each component's share; right axis: the running total, 0 to 100%
    scree.sciChartSurface.yAxes.add(
        new NumericAxis(scree.wasmContext, { ...small, axisTitle: "Each (%)", axisAlignment: EAxisAlignment.Left, autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.1) }),
        new NumericAxis(scree.wasmContext, { ...small, id: "cumulative", axisTitle: "Cumulative (%)", axisAlignment: EAxisAlignment.Right, visibleRange: new NumberRange(0, 100) })
    );
    const components = Array.from({ length: 20 }, (_, k) => k + 1);
    const individual = components.map((k) => 100 * pcaResult.explained[k - 1]);
    let running = 0;
    const cumulative = individual.map((x) => (running += x));
    scree.sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(scree.wasmContext, {
            dataSeries: new XyDataSeries(scree.wasmContext, { xValues: components, yValues: individual, dataSeriesName: "Each component" }),
            fill: "#50C7E0CC",
            stroke: "#50C7E0",
            cornerRadius: 8,
            dataPointWidth: 0.7,
            animation: new WaveAnimation({ duration: 1000 })
        }),
        new FastLineRenderableSeries(scree.wasmContext, {
            dataSeries: new XyDataSeries(scree.wasmContext, { xValues: components, yValues: cumulative, dataSeriesName: "Cumulative" }),
            stroke: "#F48420",
            strokeThickness: 2,
            yAxisId: "cumulative"
        })
    );
    scree.sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true, showAxisLabels: false }));

    // Small images: the first three principal components as 8 × 8 pictures (blue negative, orange positive),
    // and the digit under the mouse
    function drawImage(canvas, values, colourOf) {
        const context = canvas.getContext("2d");
        const cell = canvas.width / SIDE;
        values.forEach((value, k) => {
            context.fillStyle = colourOf(value);
            context.fillRect((k % SIDE) * cell, Math.floor(k / SIDE) * cell, cell, cell);
        });
    }
    function drawDigit(canvas, index) {
        const values = Array.from(pixels.subarray(index * d, (index + 1) * d));
        drawImage(canvas, values, (v) => `rgb(${Math.round(16 * v)},${Math.round(16 * v)},${Math.round(16 * v)})`);
    }
    pcaResult.vectors.slice(0, 3).forEach((vector, k) => {
        const max = Math.max(...vector.map(Math.abs));
        drawImage(ui.loadingCanvases[k], vector, (w) => {
            const t = Math.abs(w) / max;
            return w < 0 ? `rgba(80,199,224,${t})` : `rgba(244,132,32,${t})`;
        });
    });
    drawDigit(ui.hoverCanvas, 0);

    // --- Drawing the current embedding ---
    let view = 2;
    let tsne = null;
    let chart3dPromise = null;
    let kept = NaN;
    let restartCount = 0;
    let paused = false;

    async function show(Y, dims) {
        if (dims === 2) {
            const xs = new Float64Array(n), ys = new Float64Array(n);
            for (let i = 0; i < n; i++) {
                xs[i] = Y[2 * i];
                ys[i] = Y[2 * i + 1];
            }
            scatterData.clear();
            scatterData.appendRange(xs, ys);
        } else {
            chart3dPromise = chart3dPromise || create3d();
            const running3d = await chart3dPromise;
            const xs = new Float64Array(n), ys = new Float64Array(n), zs = new Float64Array(n);
            const metadata = new Array(n);
            let extent = 1e-9;
            for (let i = 0; i < n; i++) {
                xs[i] = Y[3 * i];
                ys[i] = Y[3 * i + 1];
                zs[i] = Y[3 * i + 2];
                extent = Math.max(extent, Math.abs(xs[i]), Math.abs(ys[i]), Math.abs(zs[i]));
                metadata[i] = { vertexColor: argb[labels[i]] };
            }
            running3d.dataSeries.clear();
            running3d.dataSeries.appendRange(xs, ys, zs, metadata);
            const range = new NumberRange(-extent * 1.05, extent * 1.05); // equal ranges keep the map's shape
            const surface = running3d.sciChart3DSurface;
            surface.xAxis.visibleRange = range;
            surface.yAxis.visibleRange = range;
            surface.zAxis.visibleRange = range;
        }
    }

    function updateReadout() {
        const method = ui.methodSelect.value;
        const keptText = Number.isFinite(kept) ? ` · ${(100 * kept).toFixed(0)}% of 10 nearest neighbours kept` : "";
        if (method === "pca") {
            const shown = pcaResult.explained.slice(0, view).reduce((s, x) => s + x, 0);
            ui.readout.textContent = `PCA: the first ${view} components explain ${(100 * shown).toFixed(1)}% of the variance${keptText}`;
        } else if (tsne) {
            const phase = tsne.iteration < 250 ? "early exaggeration" : tsne.iteration < 1000 ? "refining" : "done";
            ui.readout.textContent = `t-SNE iteration ${tsne.iteration} of 1,000 (${phase}) · KL divergence ${Number.isFinite(tsne.kl) ? tsne.kl.toFixed(3) : "–"}${keptText}`;
        }
    }

    // Start t-SNE again with the current perplexity, view and starting layout
    let P = null;
    let pPerplexity = 0;
    function restartTsne() {
        const perplexity = Number(ui.perplexityInput.value);
        if (!P || pPerplexity !== perplexity) {
            P = affinities(highD, n, perplexity);
            pPerplexity = perplexity;
        }
        let initial;
        if (ui.initSelect.value === "pca") {
            // PCA start, scaled so the first coordinate has a standard deviation of 0.0001 (Kobak and Linderman, 2021)
            initial = pcaCoords(view);
            const sd = Math.sqrt(pcaResult.values[0]);
            for (let k = 0; k < initial.length; k++) initial[k] *= 1e-4 / sd;
        } else {
            // Random start: a new seed on every restart, so the global layout changes from run to run
            let seed = 1 + 7919 * ++restartCount;
            const random = () => {
                seed = (seed * 16807) % 2147483647;
                return (seed - 1) / 2147483646;
            };
            initial = Float64Array.from({ length: n * view }, () => 1e-4 * Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random()));
        }
        tsne = createTsne(P, n, view, initial);
        kept = NaN;
        paused = false;
        ui.runButton.textContent = "Pause";
    }

    // Run a few t-SNE iterations per animation frame and redraw, until 1,000 iterations
    let busy = false;
    async function animate() {
        if (!busy && ui.methodSelect.value === "tsne" && tsne && !paused && tsne.iteration < 1000) {
            busy = true;
            for (let s = 0; s < 4 && tsne.iteration < 1000; s++) tsne.step();
            if (tsne.iteration % 100 === 0) kept = neighbourhoodKept(highNeighbours, tsne.Y, n, view, K);
            await show(tsne.Y, view);
            updateReadout();
            busy = false;
        }
        if (!chart2d.sciChartSurface.isDeleted) requestAnimationFrame(animate);
    }

    async function onSettingsChanged() {
        view = Number(ui.dimsSelect.value);
        const method = ui.methodSelect.value;
        ui.chart2d.style.display = view === 2 ? "" : "none";
        ui.chart3d.style.display = view === 3 ? "" : "none";
        ui.perplexityOutput.textContent = ui.perplexityInput.value;
        for (const control of [ui.perplexityInput, ui.initSelect, ui.runButton, ui.restartButton]) control.disabled = method !== "tsne";
        if (method === "pca") {
            const Y = pcaCoords(view);
            kept = neighbourhoodKept(highNeighbours, Y, n, view, K);
            await show(Y, view);
        } else {
            restartTsne();
            await show(tsne.Y, view);
        }
        if (view === 2) chart2d.sciChartSurface.zoomExtents();
        updateReadout();
    }

    ui.methodSelect.addEventListener("change", onSettingsChanged);
    ui.dimsSelect.addEventListener("change", onSettingsChanged);
    ui.perplexityInput.addEventListener("input", () => (ui.perplexityOutput.textContent = ui.perplexityInput.value));
    ui.perplexityInput.addEventListener("change", onSettingsChanged); // recompute P when the slider is released
    ui.initSelect.addEventListener("change", onSettingsChanged);
    ui.restartButton.addEventListener("click", onSettingsChanged);
    ui.runButton.addEventListener("click", () => {
        paused = !paused;
        ui.runButton.textContent = paused ? "Run" : "Pause";
    });
    ui.screeCheckbox.addEventListener("change", () => (ui.side.style.display = ui.screeCheckbox.checked ? "flex" : "none"));
    await onSettingsChanged();
    requestAnimationFrame(animate);
    // #region_A_end
}

dimensionalityReduction("scichart-root");
