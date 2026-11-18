import * as SciChart from "scichart";

// The same scatter data for both panels: a cloud of points, from a seeded random generator
function makePoints(count) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = new Float64Array(count);
    const yValues = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        // Normally distributed around the centre (Box-Muller transform)
        const radius = Math.sqrt(-2 * Math.log(random())) * 14;
        const angle = 2 * Math.PI * random();
        xValues[i] = 50 + radius * Math.cos(angle);
        yValues[i] = 50 + radius * Math.sin(angle);
    }
    return { xValues, yValues };
}

// Resolves after the browser has run its next frame (style, layout and paint)
const afterNextPaint = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

// Resolves once the browser has caught up: waits until it is idle (or up to 2 seconds), then a little longer.
// Used before each timed draw, so one test's leftover work (such as clearing a million SVG elements) isn't timed in the next.
const settle = () =>
    new Promise((resolve) => {
        const pause = () => setTimeout(resolve, 200);
        if (window.requestIdleCallback) window.requestIdleCallback(pause, { timeout: 2000 });
        else setTimeout(pause, 300);
    });

// A minimal SVG scatter chart: one <circle> element per point, the way SVG charts usually draw markers
function drawSvgScatter(svg, xValues, yValues) {
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const svgNamespace = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(svgNamespace, "g");
    for (let i = 0; i < xValues.length; i++) {
        const circle = document.createElementNS(svgNamespace, "circle");
        circle.setAttribute("cx", ((xValues[i] / 100) * width).toFixed(1));
        circle.setAttribute("cy", ((1 - yValues[i] / 100) * height).toFixed(1));
        circle.setAttribute("r", "1.5");
        group.append(circle);
    }
    svg.append(group);
}

// Page layout: buttons on top, the SVG chart on the left and the WebGL / WebGPU chart on the right
function createLayout(root) {
    root.style.cssText =
        "display:flex; flex-direction:column; gap:8px; height:100vh; box-sizing:border-box; padding:10px;" +
        "background:#14233C; color:#ffffff; font:14px Arial, sans-serif;";
    const toolbar = document.createElement("div");
    toolbar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:8px;";
    toolbar.append("Draw:");
    const panels = document.createElement("div");
    panels.style.cssText =
        "flex:1; min-height:0; display:grid; gap:10px; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));";
    const makePanel = (title) => {
        const panel = document.createElement("div");
        panel.style.cssText = "display:flex; flex-direction:column; min-height:0; gap:4px;";
        const heading = document.createElement("div");
        heading.style.cssText = "font-weight:bold;";
        heading.textContent = title;
        const result = document.createElement("div");
        result.style.cssText = "color:#50C7E0; min-height:1.2em;";
        panel.append(heading, result);
        panels.append(panel);
        return { panel, result };
    };
    const svgPanel = makePanel("SVG: one <circle> element per point");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("fill", "#50C7E0");
    svg.setAttribute("fill-opacity", "0.2");
    // contain:strict keeps the circles' layout and paint inside this box, so they don't slow down the rest of the page
    svg.style.cssText = "flex:1; min-height:0; width:100%; background:#1C2E4A; border-radius:4px; contain:strict;";
    svgPanel.panel.append(svg);
    const glPanel = makePanel("WebGL / WebGPU: SciChart.js");
    const chartDiv = document.createElement("div");
    chartDiv.style.cssText = "flex:1; min-height:0; width:100%;";
    glPanel.panel.append(chartDiv);
    root.append(toolbar, panels);
    return { toolbar, svg, svgResult: svgPanel.result, chartDiv, glResult: glPanel.result };
}

async function svgVsWebgl(divElementId) {
    // #region_A_start
    // Draw the same scatter points with SVG and with SciChart.js (WebGL or WebGPU), and time both in this browser
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;

    const layout = createLayout(document.getElementById(divElementId));

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(layout.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: false });
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, strokeThickness: 0, fill: "#50C7E033" })
        })
    );
    // The WebGL / WebGPU chart can be zoomed and panned at any size
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

    // Resolves when SciChart.js has drawn its next frame and the browser has shown it
    const waitForChartDraw = () =>
        new Promise((resolve) => {
            const onRendered = () => {
                sciChartSurface.rendered.unsubscribe(onRendered);
                setTimeout(resolve, 0);
            };
            sciChartSurface.rendered.subscribe(onRendered);
            sciChartSurface.invalidateElement(); // ask for a redraw, in case nothing else did
        });

    const buttons = [];

    async function run(count) {
        buttons.forEach((button) => (button.disabled = true));
        const { xValues, yValues } = makePoints(count);
        const label = count.toLocaleString();

        // Clear both panels first (not timed), and let the browser finish that work before timing anything
        layout.svg.replaceChildren();
        dataSeries.clear();
        layout.glResult.textContent = "Drawing…";
        // Above 100,000 elements the browser may freeze for several seconds, so warn before starting
        layout.svgResult.textContent =
            count > 100000 ? `Waiting: ${label} SVG elements may freeze the page for a while…` : "Waiting…";
        await waitForChartDraw();
        await settle();

        // 1. WebGL / WebGPU first, so the SVG test's heavy work can't slow it down: append the points, wait for the draw
        const glStart = performance.now();
        dataSeries.appendRange(xValues, yValues);
        await waitForChartDraw();
        const glTime = Math.round(performance.now() - glStart);
        layout.glResult.textContent = `${label} points drawn in ${glTime.toLocaleString()} ms`;
        await settle();

        // 2. SVG: create one element per point and wait for the paint
        const svgStart = performance.now();
        drawSvgScatter(layout.svg, xValues, yValues);
        await afterNextPaint();
        const svgTime = Math.round(performance.now() - svgStart);
        layout.svgResult.textContent = `${label} points drawn in ${svgTime.toLocaleString()} ms`;

        buttons.forEach((button) => (button.disabled = false));
    }

    for (const count of [1000, 10000, 100000, 1000000]) {
        const button = document.createElement("button");
        button.textContent = `${count.toLocaleString()} points`;
        button.style.cssText =
            "font:bold 14px Arial, sans-serif; padding:4px 12px; border-radius:14px; cursor:pointer;" +
            "border:1px solid #50C7E0; background:transparent; color:#ffffff;";
        button.onclick = () => run(count);
        buttons.push(button);
        layout.toolbar.append(button);
    }

    await run(10000); // start with 10,000 points
    // #region_A_end
}

svgVsWebgl("scichart-root");
