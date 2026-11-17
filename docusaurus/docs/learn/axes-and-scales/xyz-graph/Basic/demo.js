import * as SciChart from "scichart";

// Generates a made-up cloud of 250 points with a seeded random generator, so the chart looks the same every time.
// x is spread evenly from 0.5 to 9.5. y rises with z (y ≈ 1.5 + 0.7 × z), plus a little noise, and doesn't depend on x,
// so the cloud is a tilted sheet: it looks like a blob from the front and like a thin line from the side.
function generatePointCloud() {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const yValues = [];
    const zValues = [];
    for (let i = 0; i < 250; i++) {
        const x = 0.5 + random() * 9;
        const z = 0.5 + random() * 9;
        const y = 1.5 + 0.7 * z + (random() - 0.5) * 0.8;
        xValues.push(x);
        yValues.push(y);
        zValues.push(z);
    }
    return { xValues, yValues, zValues };
}

// View and projection buttons in the top-left corner of the chart. In your app these can be any buttons or menus.
function addButtonRow(chartRoot, top, label, options, onChange) {
    const bar = document.createElement("div");
    bar.style.cssText =
        `position:absolute; top:${top}px; left:14px; display:flex; flex-wrap:wrap; align-items:center; gap:4px;` +
        "z-index:10; font:14px Arial, sans-serif; color:#ffffff;";
    const title = document.createElement("span");
    title.textContent = label;
    title.style.marginRight = "4px";
    bar.append(title);
    const buttons = options.map((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.style.cssText =
            "font:bold 13px Arial, sans-serif; padding:4px 10px; border-radius:14px; cursor:pointer;" +
            "border:1px solid #50C7E0;";
        button.onclick = () => {
            onChange(index);
            paint(index);
        };
        bar.append(button);
        return button;
    });
    const paint = (selected) =>
        buttons.forEach((button, index) => {
            button.style.background = index === selected ? "#50C7E0" : "transparent";
            button.style.color = index === selected ? "#14233C" : "#ffffff";
        });
    paint(0);
    chartRoot.append(bar);
}

async function xyzGraph(divElementId) {
    // #region_A_start
    // Create a JavaScript XYZ graph (a 3D scatter plot on X, Y and Z axes) with SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        XyzDataSeries3D,
        ScatterRenderableSeries3D,
        PointLineRenderableSeries3D,
        SpherePointMarker3D,
        ECameraProjectionMode,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } = SciChart;
    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Every axis runs from 0 to 10 in a cube-shaped box, so one unit is the same length on all three axes
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 300, 300)
    });

    // In SciChart.js 3D, Y is the vertical (up) axis. X and Z make the floor of the box.
    const axisOptions = {
        visibleRange: new NumberRange(0, 10),
        autoTicks: false,
        majorDelta: 2,
        minorDelta: 1,
        labelPrecision: 0
    };
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { ...axisOptions, axisTitle: "X axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { ...axisOptions, axisTitle: "Y axis (up)" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { ...axisOptions, axisTitle: "Z axis" });

    // Your data: one x, y and z value for each point
    const { xValues, yValues, zValues } = generatePointCloud();
    sciChart3DSurface.renderableSeries.add(
        new ScatterRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues, dataSeriesName: "Point cloud" }),
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 7, fill: "#50C7E0" }),
            opacity: 0.85
        })
    );

    // One highlighted point, P = (7, 6, 3), with dashed lines to the floor, the side wall and the back wall.
    // Where each line meets a wall is the point's 2D shadow (projection) on that wall.
    const p = { x: 7, y: 6, z: 3 };
    const shadows = [
        { x: p.x, y: 0, z: p.z }, // on the floor: read x and z
        { x: 0, y: p.y, z: p.z }, // on the side wall: read z and y
        { x: p.x, y: p.y, z: 10 } // on the back wall: read x and y
    ];
    const lines = new XyzDataSeries3D(wasmContext);
    for (const s of shadows) {
        lines.append(p.x, p.y, p.z); // each pair of points is one separate line
        lines.append(s.x, s.y, s.z);
    }
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: lines,
            isLineStrip: false,
            stroke: "#F48420",
            strokeThickness: 2,
            strokeDashArray: [6, 4]
        }),
        new ScatterRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: shadows.map((s) => s.x),
                yValues: shadows.map((s) => s.y),
                zValues: shadows.map((s) => s.z),
                dataSeriesName: "Shadow of P"
            }),
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 9, fill: "#F48420" }),
            opacity: 0.6
        }),
        new ScatterRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: [p.x],
                yValues: [p.y],
                zValues: [p.z],
                dataSeriesName: "Point P"
            }),
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 16, fill: "#F48420" })
        })
    );

    // Drag to rotate, scroll to zoom, double-click to reset, and hover a point to read its x, y and z
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(),
        new MouseWheelZoomModifier3D(),
        new ResetCamera3DModifier(),
        new TooltipModifier3D({
            isCrosshairVisible: true, // lines from the hovered point to the walls
            crosshairStroke: "#FFFFFF",
            tooltipDataTemplate: (seriesInfo) => {
                if (!seriesInfo || !seriesInfo.isHit) return [];
                return [
                    seriesInfo.dataSeriesName,
                    `x = ${seriesInfo.xValue.toFixed(1)}`,
                    `y = ${seriesInfo.yValue.toFixed(1)}`,
                    `z = ${seriesInfo.zValue.toFixed(1)}`
                ];
            }
        })
    );

    // Camera views: an angled 3D view, or straight down one axis to see the data's 2D shadow on one wall.
    // The camera looks at the centre of the box (y runs from 0 to 300 in world units; x and z are centred on 0).
    const camera = sciChart3DSurface.camera;
    const target = new Vector3(0, 150, 0);
    const views = [
        new Vector3(330, 420, -480), // 3D: from the front right, above
        new Vector3(0, 150, -600), // Front: along Z, so you see X across and Y up
        new Vector3(0, 750, -1), // Top: down Y, so you see X across and Z up the screen
        new Vector3(600, 150, 0) // Side: along X, so you see Z across and Y up
    ];
    const setView = (index) => {
        camera.target = target;
        camera.position = views[index];
    };
    setView(0);

    // Perspective: far things look smaller, like a photo. Orthographic: no shrinking, so equal lengths stay equal.
    const setProjection = (index) => {
        if (index === 0) {
            camera.projectionMode = ECameraProjectionMode.Perspective;
        } else {
            camera.projectionMode = ECameraProjectionMode.Orthogonal;
            camera.orthoWidth = 620; // the width and height of the view, in world units
            camera.orthoHeight = 440;
        }
    };

    const chartRoot = sciChart3DSurface.domChartRoot;
    addButtonRow(chartRoot, 10, "View", ["3D", "Front (X–Y)", "Top (X–Z)", "Side (Z–Y)"], setView);
    addButtonRow(chartRoot, 44, "Projection", ["Perspective", "Orthographic"], setProjection);
    // #region_A_end
}

xyzGraph("scichart-root");
