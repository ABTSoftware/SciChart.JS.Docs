import * as SciChart from "scichart";

// Sample data: simulated mass spectra. The m/z values and isotope patterns are calculated exactly from each ion's
// formula and the natural isotope abundances. The fragment and charge-state intensities are illustrative, chosen to
// look like typical spectra; they are not library values.
// Each ion: formula (the atoms in the ion), z (its charge), rel (its total intensity before normalising), kind.
const COMPOUNDS = {
    dcm: {
        name: "Dichloromethane, CH2Cl2",
        EI: [
            { formula: "CH2Cl2", z: 1, rel: 70, kind: "molecular", label: "M+•" },
            { formula: "CH2Cl", z: 1, rel: 100, kind: "fragment", label: "M − Cl" },
            { formula: "CHCl", z: 1, rel: 12, kind: "fragment", label: "M − HCl" },
            { formula: "CCl", z: 1, rel: 10, kind: "fragment", label: "CCl+" },
            { formula: "Cl", z: 1, rel: 5, kind: "fragment", label: "Cl+" }
        ]
    },
    bromobenzene: {
        name: "Bromobenzene, C6H5Br",
        EI: [
            { formula: "C6H5Br", z: 1, rel: 85, kind: "molecular", label: "M+•" },
            { formula: "C6H5", z: 1, rel: 100, kind: "fragment", label: "M − Br" },
            { formula: "C4H3", z: 1, rel: 35, kind: "fragment", label: "C4H3+" },
            { formula: "C4H2", z: 1, rel: 12, kind: "fragment", label: "C4H2+•" }
        ]
    },
    toluene: {
        name: "Toluene, C7H8",
        EI: [
            { formula: "C7H8", z: 1, rel: 75, kind: "molecular", label: "M+•" },
            { formula: "C7H7", z: 1, rel: 100, kind: "fragment", label: "M − H" },
            { formula: "C5H5", z: 1, rel: 12, kind: "fragment", label: "C5H5+" },
            { formula: "C4H3", z: 1, rel: 6, kind: "fragment", label: "C4H3+" },
            { formula: "C3H3", z: 1, rel: 8, kind: "fragment", label: "C3H3+" }
        ]
    },
    caffeine: {
        name: "Caffeine, C8H10N4O2",
        EI: [
            { formula: "C8H10N4O2", z: 1, rel: 100, kind: "molecular", label: "M+•" },
            { formula: "C5H5N2O", z: 1, rel: 55, kind: "fragment", label: "C5H5N2O+" },
            { formula: "C4H6N2", z: 1, rel: 20, kind: "fragment", label: "C4H6N2+•" },
            { formula: "C3H3N2", z: 1, rel: 15, kind: "fragment", label: "C3H3N2+" },
            { formula: "C2H3N2", z: 1, rel: 25, kind: "fragment", label: "C2H3N2+" }
        ],
        ESI: [
            { formula: "C8H11N4O2", z: 1, rel: 100, kind: "molecular", label: "[M+H]+" },
            { formula: "C8H10N4O2Na", z: 1, rel: 15, kind: "adduct", label: "[M+Na]+" }
        ]
    },
    angiotensin: {
        name: "Angiotensin I peptide, C62H89N17O14",
        ESI: [
            { formula: "C62H90N17O14", z: 1, rel: 15, kind: "molecular", label: "[M+H]+" },
            { formula: "C62H91N17O14", z: 2, rel: 70, kind: "molecular", label: "[M+2H]2+" },
            { formula: "C62H92N17O14", z: 3, rel: 100, kind: "molecular", label: "[M+3H]3+" }
        ]
    },
    ubiquitin: {
        name: "Ubiquitin protein, C378H629N105O118S",
        // Charge states 6+ to 13+, in a bell-shaped envelope centred on 10+
        ESI: [6, 7, 8, 9, 10, 11, 12, 13].map((z) => ({
            formula: `C378H${629 + z}N105O118S`,
            z,
            rel: 100 * Math.exp(-0.5 * ((z - 10) / 1.8) ** 2),
            kind: "molecular",
            label: `[M+${z}H]${z}+`
        }))
    }
};

// The controls and the chart each need an element. This splits the page's div into a control bar, a readout and
// the chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    const options = Object.entries(COMPOUNDS).map(([id, c]) => `<option value="${id}">${c.name}</option>`).join("");
    const button = "font:inherit; padding:2px 10px; border-radius:4px; border:1px solid #8FA5C8; background:#2E4A78; color:#ffffff; cursor:pointer";
    bar.innerHTML =
        `<label>Compound <select data-id="compound" style="font:inherit">${options}</select></label>` +
        `<label>Ionisation <select data-id="mode" style="font:inherit">` +
        `<option value="EI">EI (hard: fragments)</option><option value="ESI">ESI (soft: charge states)</option></select></label>` +
        `<label>Peaks <select data-id="shape" style="font:inherit">` +
        `<option value="stick">Sticks (centroided)</option><option value="profile">Profile</option></select></label>` +
        `<label>Resolving power <input data-id="resolution" type="range" min="0" max="100" value="45" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="resolution"></output></label>` +
        `<label><input data-id="labels" type="checkbox" checked> Label peaks</label>` +
        `<button type="button" data-id="zoom" style="${button}">Zoom to molecular ion</button>` +
        `<button type="button" data-id="full" style="${button}">Full spectrum</button>`;
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:2px 12px 6px; color:#c8d3e8; font-size:13px;" + font;
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.cssText = "flex:1; min-height:300px;";
    root.append(bar, readout, chartDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        chartDiv,
        readout,
        compoundSelect: get('select[data-id="compound"]'),
        modeSelect: get('select[data-id="mode"]'),
        shapeSelect: get('select[data-id="shape"]'),
        resolutionInput: get('input[data-id="resolution"]'),
        resolutionOutput: get('output[data-id="resolution"]'),
        labelsCheckbox: get('input[data-id="labels"]'),
        zoomButton: get('button[data-id="zoom"]'),
        fullButton: get('button[data-id="full"]')
    };
}

async function massSpectrumChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Calculate a mass spectrum from ion formulas and draw it as a stick or profile spectrum with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastImpulseRenderableSeries,
        FastMountainRenderableSeries,
        XyDataSeries,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection,
        ELegendPlacement
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Isotope maths (plain JavaScript, no library needed) ---

    // Isotope masses (u) and natural abundances (IUPAC / NIST representative values)
    const ISOTOPES = {
        H: [[1.00782503207, 0.999885], [2.0141017778, 0.000115]],
        C: [[12, 0.9893], [13.0033548378, 0.0107]],
        N: [[14.0030740048, 0.99636], [15.0001088982, 0.00364]],
        O: [[15.99491461956, 0.99757], [16.9991317, 0.00038], [17.999161, 0.00205]],
        S: [[31.972071, 0.9499], [32.97145876, 0.0075], [33.9678669, 0.0425], [35.96708076, 0.0001]],
        Cl: [[34.96885268, 0.7576], [36.96590259, 0.2424]],
        Br: [[78.9183371, 0.5069], [80.9162906, 0.4931]],
        Na: [[22.9897692809, 1]]
    };
    const ELECTRON_MASS = 0.00054857990946; // u: each positive charge is one electron fewer

    // "C8H10N4O2" -> { C: 8, H: 10, N: 4, O: 2 }
    function parseFormula(formula) {
        const counts = {};
        for (const [, element, n] of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
            counts[element] = (counts[element] || 0) + (n ? Number(n) : 1);
        }
        return counts;
    }

    // The isotope pattern of a formula: one entry per nominal mass step (M, M+1, M+2, ...), each with its
    // abundance-weighted mass and its probability. Built by adding one atom at a time, so it suits proteins too.
    function isotopePattern(formula) {
        let bins = [{ mass: 0, p: 1 }];
        const counts = parseFormula(formula);
        for (const element of Object.keys(counts)) {
            const count = counts[element];
            const isotopes = ISOTOPES[element];
            const lightest = Math.round(isotopes[0][0]);
            for (let atom = 0; atom < count; atom++) {
                const next = [];
                bins.forEach((bin, i) => {
                    if (!bin || bin.p < 1e-12) return;
                    for (const [mass, p] of isotopes) {
                        const j = i + Math.round(mass) - lightest;
                        const w = bin.p * p;
                        next[j] = next[j] || { sum: 0, p: 0 };
                        next[j].sum += w * (bin.mass + mass);
                        next[j].p += w;
                    }
                });
                bins = next.map((b) => b && { mass: b.sum / b.p, p: b.p });
            }
        }
        return bins.filter(Boolean);
    }

    // Every ion's isotope peaks as sticks: m/z = (mass - z electrons) / z, intensity normalised so the base peak is 100
    function computeSticks(ions) {
        const sticks = [];
        for (const ion of ions) {
            const pattern = isotopePattern(ion.formula);
            const top = Math.max(...pattern.map((b) => b.p));
            pattern.forEach((b, step) => {
                if (b.p < 5e-4 * top) return; // too small to see
                sticks.push({ mz: (b.mass - ion.z * ELECTRON_MASS) / ion.z, intensity: ion.rel * b.p, ion, step });
            });
        }
        const basePeak = Math.max(...sticks.map((s) => s.intensity));
        sticks.forEach((s) => (s.intensity = (100 * s.intensity) / basePeak));
        return sticks.sort((a, b) => a.mz - b.mz);
    }

    // A profile spectrum: each stick becomes a Gaussian whose width at half height is m/z divided by the
    // resolving power R. Sampled only near the peaks, with zeros in between, to keep the point count low.
    function computeProfile(sticks, resolvingPower) {
        const sigmaOf = (mz) => mz / resolvingPower / 2.3548;
        const windows = [];
        for (const s of sticks) {
            const sigma = sigmaOf(s.mz);
            const last = windows[windows.length - 1];
            if (last && s.mz - 5 * sigma <= last.to) {
                last.to = Math.max(last.to, s.mz + 5 * sigma);
                last.sigma = Math.min(last.sigma, sigma);
            } else windows.push({ from: s.mz - 5 * sigma, to: s.mz + 5 * sigma, sigma });
        }
        const x = [];
        const y = [];
        let first = 0;
        for (const w of windows) {
            const step = w.sigma / 4;
            while (first < sticks.length && sticks[first].mz < w.from - 1) first++;
            for (let mz = w.from; mz <= w.to + step / 2; mz += step) {
                let sum = 0;
                for (let i = first; i < sticks.length && sticks[i].mz < w.to + 1; i++) {
                    const z = (mz - sticks[i].mz) / sigmaOf(sticks[i].mz);
                    if (z * z < 50) sum += sticks[i].intensity * Math.exp(-0.5 * z * z);
                }
                x.push(mz);
                y.push(sum);
            }
        }
        const top = Math.max(...y);
        return { x, y: y.map((v) => (100 * v) / top) }; // renormalise: overlapping peaks add up
    }

    // What the isotope ratios suggest about the elements in the molecular ion
    function readIsotopes(cluster) {
        const ratio = (n) => (cluster[n] ? (100 * cluster[n].intensity) / cluster[0].intensity : 0);
        const m1 = ratio(1);
        const m2 = ratio(2);
        let hint = `M+1 suggests up to about ${Math.round(m1 / 1.1)} carbon atoms`;
        if (m2 > 85) hint = "M+2 almost as tall as M: one bromine atom";
        else if (m2 > 50) hint = "M : M+2 : M+4 near 9 : 6 : 1: two chlorine atoms";
        else if (m2 > 24) hint = "M+2 about a third of M: one chlorine atom";
        return { m1, m2, hint };
    }

    // --- The chart: relative abundance against m/z ---
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "m/z" });
    let axisDigits = 0; // more decimals on the m/z axis as you zoom in
    xAxis.labelProvider.formatLabel = (value) => value.toFixed(axisDigits);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Relative abundance (%)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 0.15),
            labelPrecision: 0
        })
    );

    // Two stick series, so the molecular ion stands out from fragments and adducts; one profile series
    const molecularSticks = new XyDataSeries(wasmContext, { dataSeriesName: "Molecular ion", dataIsSortedInX: true });
    const otherSticks = new XyDataSeries(wasmContext, { dataSeriesName: "Fragments and adducts", dataIsSortedInX: true });
    const profile = new XyDataSeries(wasmContext, { dataSeriesName: "Profile spectrum", dataIsSortedInX: true });
    const molecularSeries = new FastImpulseRenderableSeries(wasmContext, { dataSeries: molecularSticks, fill: "#F48420", strokeThickness: 2, size: 0 });
    const otherSeries = new FastImpulseRenderableSeries(wasmContext, { dataSeries: otherSticks, fill: "#50C7E0", strokeThickness: 2, size: 0 });
    const profileSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: profile,
        stroke: "#50C7E0",
        fill: "#50C7E044",
        strokeThickness: 1.5,
        isVisible: false
    });
    sciChartSurface.renderableSeries.add(profileSeries, otherSeries, molecularSeries);
    const legend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier(),
        legend
    );

    let sticks = [];
    let profileData = { x: [], y: [] };
    let molecularRange = new NumberRange(0, 1);
    let fullRange = new NumberRange(0, 1);

    // Label the tallest peaks in view with their m/z (and charge, when it is above 1)
    function updateLabels() {
        const { min, max } = xAxis.visibleRange;
        const width = max - min;
        axisDigits = width < 3 ? 2 : width < 30 ? 1 : 0;
        sciChartSurface.annotations.clear();
        if (!ui.labelsCheckbox.checked) return;
        const digits = width < 25 ? 4 : 1;
        const minGap = width * (digits === 4 ? 0.13 : 0.025); // room for the label text
        // Sticks: label the sticks themselves. Profile: label the tops of the profile peaks, which is all
        // the instrument could report when isotope peaks merge.
        let candidates = sticks;
        if (ui.shapeSelect.value === "profile") {
            const { x, y } = profileData;
            candidates = [];
            for (let i = 1; i < x.length - 1; i++) {
                if (y[i] > y[i - 1] && y[i] >= y[i + 1]) {
                    const nearest = sticks.reduce((a, b) => (Math.abs(b.mz - x[i]) < Math.abs(a.mz - x[i]) ? b : a));
                    candidates.push({ mz: x[i], intensity: y[i], ion: nearest.ion });
                }
            }
        }
        const chosen = [];
        const inView = candidates.filter((s) => s.mz >= min && s.mz <= max).sort((a, b) => b.intensity - a.intensity);
        for (const s of inView) {
            if (chosen.length >= 10 || s.intensity < 2) break;
            if (chosen.some((c) => Math.abs(c.mz - s.mz) < minGap)) continue;
            chosen.push(s);
        }
        for (const s of chosen) {
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: s.mz,
                    y1: s.intensity,
                    text: s.mz.toFixed(digits) + (s.ion.z > 1 ? ` (${s.ion.z}+)` : ""),
                    fontSize: 13,
                    textColor: "#FFFFFF",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                    yCoordShift: -4
                })
            );
        }
    }

    function updateReadout() {
        const base = sticks.reduce((a, b) => (b.intensity > a.intensity ? b : a));
        // The molecular-ion cluster to read: the most intense charge state of the intact molecule
        const molecular = sticks.filter((s) => s.ion.kind === "molecular");
        const mainIon = molecular.reduce((a, b) => (b.intensity > a.intensity ? b : a)).ion;
        const cluster = molecular.filter((s) => s.ion === mainIon).sort((a, b) => a.step - b.step);
        const parts = [
            `Base peak m/z ${base.mz.toFixed(4)} (${base.ion.label})`,
            `molecular ion ${mainIon.label} m/z ${cluster[0].mz.toFixed(4)}`
        ];
        if (mainIon.z === 1) {
            const { m1, m2, hint } = readIsotopes(cluster);
            parts.push(`M+1 ${m1.toFixed(1)}%, M+2 ${m2.toFixed(1)}% of M: ${hint}`);
        } else {
            // Charge-state deconvolution from two neighbouring charge states. Each cluster's centre (its
            // intensity-weighted mean m/z) is used, so the result is the average mass of the molecule.
            const PROTON = 1.007276467;
            const centreOf = (z) => {
                const peaks = molecular.filter((s) => s.ion.z === z);
                const total = peaks.reduce((sum, s) => sum + s.intensity, 0);
                return peaks.length ? peaks.reduce((sum, s) => sum + s.mz * s.intensity, 0) / total : NaN;
            };
            const neighbour = Number.isFinite(centreOf(mainIon.z + 1)) ? mainIon.z + 1 : mainIon.z - 1;
            const [low, high] = [centreOf(mainIon.z), centreOf(neighbour)].sort((a, b) => a - b); // high m/z = lower charge
            const z = Math.round((low - PROTON) / (high - low)); // charge of the higher-m/z cluster
            const mass = z * (high - PROTON);
            parts.push(`cluster centres ${high.toFixed(2)} and ${low.toFixed(2)} give z = ${z} and ${z + 1}, average mass ${mass.toFixed(1)} Da`);
            const mostAbundantStep = cluster.reduce((a, b) => (b.intensity > a.intensity ? b : a)).step;
            if (mostAbundantStep > 0) parts.push(`tallest isotope peak is M+${mostAbundantStep}`);
        }
        ui.readout.textContent = parts.join(" · ");
    }

    function onControlsChanged() {
        const compound = COMPOUNDS[ui.compoundSelect.value];
        // Small non-polar molecules don't ionise well by ESI; peptides and proteins don't survive EI
        for (const option of ui.modeSelect.options) option.disabled = !compound[option.value];
        if (!compound[ui.modeSelect.value]) ui.modeSelect.value = compound.EI ? "EI" : "ESI";
        const resolvingPower = Math.round((300 * Math.pow(1000 / 3, Number(ui.resolutionInput.value) / 100)) / 100) * 100;
        const isProfile = ui.shapeSelect.value === "profile";
        ui.resolutionOutput.textContent = `R = ${resolvingPower.toLocaleString("en-GB")}`;
        ui.resolutionInput.disabled = !isProfile;

        sticks = computeSticks(compound[ui.modeSelect.value]);
        molecularSticks.clear();
        otherSticks.clear();
        for (const s of sticks) (s.ion.kind === "molecular" ? molecularSticks : otherSticks).append(s.mz, s.intensity);
        profileData = computeProfile(sticks, resolvingPower);
        profile.clear();
        profile.appendRange(profileData.x, profileData.y);
        profileSeries.isVisible = isProfile;
        molecularSeries.isVisible = !isProfile;
        otherSeries.isVisible = !isProfile && otherSticks.count() > 0;
        // Show only the series on screen in the legend
        legend.includeSeries(profileSeries, profileSeries.isVisible);
        legend.includeSeries(molecularSeries, molecularSeries.isVisible);
        legend.includeSeries(otherSeries, otherSeries.isVisible);

        const molecular = sticks.filter((s) => s.ion.kind === "molecular");
        const main = molecular.reduce((a, b) => (b.intensity > a.intensity ? b : a));
        const cluster = molecular.filter((s) => s.ion === main.ion);
        const pad = 2 / main.ion.z;
        molecularRange = new NumberRange(cluster[0].mz - pad, cluster[cluster.length - 1].mz + pad);
        const lowest = sticks[0].mz;
        const highest = sticks[sticks.length - 1].mz;
        const margin = Math.max(5, (highest - lowest) * 0.08);
        fullRange = new NumberRange(Math.max(0, lowest - 2.5 * margin), highest + margin); // room for the logo, bottom left
        updateReadout();
    }

    function setRange(range) {
        xAxis.visibleRange = range;
        updateLabels();
    }

    xAxis.visibleRangeChanged.subscribe(() => updateLabels());
    ui.compoundSelect.addEventListener("change", () => {
        onControlsChanged();
        setRange(fullRange);
    });
    ui.modeSelect.addEventListener("change", () => {
        onControlsChanged();
        setRange(fullRange);
    });
    ui.shapeSelect.addEventListener("change", () => {
        onControlsChanged();
        updateLabels();
    });
    ui.resolutionInput.addEventListener("input", () => {
        onControlsChanged();
        updateLabels();
    });
    ui.labelsCheckbox.addEventListener("change", updateLabels);
    ui.zoomButton.addEventListener("click", () => setRange(molecularRange));
    ui.fullButton.addEventListener("click", () => setRange(fullRange));
    onControlsChanged();
    setRange(fullRange);
    // #region_A_end
}

massSpectrumChart("scichart-root");
