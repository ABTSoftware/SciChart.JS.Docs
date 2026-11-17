import * as SciChart from "scichart";

// Makes up one new spectrum: the signal level at each of 500 frequencies from 0 to 10 kHz.
// A seeded random generator adds the noise, so the chart is the same every time and needs no data feed.
// The signal has a steady tone at 2 kHz, a tone that sweeps up and down between 4 and 8 kHz,
// and a tone at 9 kHz that switches on and off.
function createSpectrumGenerator(frequencyCount, frequencyStep) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const peak = (f, centre, width) => Math.exp(-((f - centre) * (f - centre)) / (2 * width * width));
    let time = 0;
    return () => {
        time += 0.05;
        const sweep = 6 + 2 * Math.sin(time * 0.8); // the sweeping tone, in kHz
        const pulseOn = Math.floor(time / 1.5) % 2 === 0; // 1.5 seconds on, 1.5 seconds off
        const spectrum = [];
        for (let i = 0; i < frequencyCount; i++) {
            const f = i * frequencyStep;
            let level = 0.04 + 0.04 * random(); // the noise floor
            level += 0.55 * peak(f, 2, 0.2);
            level += 0.8 * peak(f, sweep, 0.25);
            if (pulseOn) level += 0.45 * peak(f, 9, 0.15);
            spectrum.push(level);
        }
        return spectrum;
    };
}

async function realtimeSurfacePlot(divElementId) {
    const {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier
    } = SciChart;

    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(400, 160, 300),
        cameraOptions: { position: new Vector3(-280, 300, -380), target: new Vector3(0, 20, 0) }
    });
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Frequency (kHz)", labelPrecision: 0 });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Level",
        labelPrecision: 1,
        visibleRange: new NumberRange(0, 1)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Seconds ago", labelPrecision: 0 });

    // 500 frequencies × 200 time steps: 100,000 heights, all replaced 20 times a second
    const frequencyCount = 500;
    const frequencyStep = 0.02; // kHz
    const timeCount = 200;
    const timeStep = 0.05; // seconds
    const nextSpectrum = createSpectrumGenerator(frequencyCount, frequencyStep);
    const rows = [];
    for (let i = 0; i < timeCount; i++) rows.unshift(nextSpectrum());

    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: rows,
        xStart: 0,
        xStep: frequencyStep,
        zStart: 0, // row 0 is the newest spectrum
        zStep: timeStep
    });
    sciChart3DSurface.renderableSeries.add(
        new SurfaceMeshRenderableSeries3D(wasmContext, {
            dataSeries,
            meshColorPalette: new GradientColorPalette(wasmContext, {
                gradientStops: [
                    { offset: 0, color: "#000004" },
                    { offset: 0.25, color: "#51127C" },
                    { offset: 0.5, color: "#B63679" },
                    { offset: 0.75, color: "#FB8861" },
                    { offset: 1, color: "#FCFDBF" }
                ]
            }),
            minimum: 0,
            maximum: 0.9,
            drawMeshAs: EDrawMeshAs.SOLID_MESH,
            lightingFactor: 0
        })
    );
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(),
        new MouseWheelZoomModifier3D(),
        new ResetCamera3DModifier()
    );

    // Every 50 ms: add the newest spectrum at the front, drop the oldest, and redraw
    const timer = setInterval(() => {
        if (sciChart3DSurface.isDeleted) {
            clearInterval(timer);
            return;
        }
        rows.pop();
        rows.unshift(nextSpectrum());
        dataSeries.setYValues(rows);
    }, 50);
}

realtimeSurfacePlot("scichart-root");
