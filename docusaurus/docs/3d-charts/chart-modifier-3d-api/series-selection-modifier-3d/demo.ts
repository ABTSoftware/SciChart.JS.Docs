import {
    EAutoRange,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    PointLineRenderableSeries3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SciChartJsNavyTheme,
    SeriesSelectionModifier3D,
    Vector3,
    XyzDataSeries3D,
    XyzSeriesInfo3D
} from "scichart";

const seriesCount = 8;
const pointsPerSeries = 256;
const defaultSelectedIndex = 3;

const createWaterfallRow = (rowIndex: number) => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    const zValues: number[] = [];

    for (let i = 0; i < pointsPerSeries; i++) {
        // Dense rows give SeriesSelectionModifier3D more hit-test candidates
        // along thin 3D lines, which makes hover and selection feel smoother.
        const x = i;
        const primary = Math.sin((x + rowIndex * 4) * 0.16) * 8;
        const peak = 18 * Math.exp(-Math.pow((x - 18 - rowIndex * 2) / 9, 2));
        const smallerPeak = 10 * Math.exp(-Math.pow((x - 45 + rowIndex) / 7, 2));

        xValues.push(x);
        yValues.push(primary + peak + smallerPeak);
        zValues.push(rowIndex);
    }

    return { xValues, yValues, zValues };
};

const parseSeriesIndex = (series: { id?: string } | undefined) => {
    const match = series?.id?.match(/^row-(\d+)$/);
    return match ? Number(match[1]) : undefined;
};

async function drawExample(divElementId: string) {
    // #region_A_start
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 120, 180),
        cameraOptions: {
            position: new Vector3(-260, 190, 230),
            target: new Vector3(0, 45, 0)
        }
    });

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Frequency",
        visibleRange: new NumberRange(0, pointsPerSeries - 1),
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Power",
        visibleRange: new NumberRange(-12, 36),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Time",
        visibleRange: new NumberRange(0, seriesCount - 1),
    });

    const waterfallSeries: PointLineRenderableSeries3D[] = [];
    let selectedIndex: number | undefined = defaultSelectedIndex;
    let hoveredIndex: number | undefined;

    const updateStatus = (hitInfo?: XyzSeriesInfo3D) => {
        const info = document.getElementById("selection-info");
        if (!info) return;

        const selected = selectedIndex === undefined ? "none" : `Row ${selectedIndex}`;
        const hovered = hoveredIndex === undefined ? "none" : `Row ${hoveredIndex}`;
        const point = hitInfo?.isHit ? `, point ${hitInfo.dataSeriesIndex}` : "";
        info.textContent = `Selected: ${selected} | Hovered: ${hovered}${point}`;
    };

    const updateSeriesStyles = () => {
        waterfallSeries.forEach((series, index) => {
            const isSelected = index === selectedIndex;
            const isHovered = index === hoveredIndex;

            series.stroke = isSelected ? "#FFFFFF" : isHovered ? "#FFB36B" : "#50C7E0";
            series.strokeThickness = isSelected ? 5 : isHovered ? 4 : 2;
            series.opacity = isSelected ? 1 : isHovered ? 0.85 : 0.35;
        });
    };

    for (let i = 0; i < seriesCount; i++) {
        const rowData = createWaterfallRow(i);
        const series = new PointLineRenderableSeries3D(wasmContext, {
            id: `row-${i}`,
            dataSeries: new XyzDataSeries3D(wasmContext, {
                ...rowData,
                dataSeriesName: `Row ${i}`
            }),
            stroke: "#50C7E0",
            strokeThickness: 2,
            opacity: 0.35,
            isLineStrip: true,
            isAntiAliased: true
        });

        series.isSelected = i === defaultSelectedIndex;
        waterfallSeries.push(series);
        sciChart3DSurface.renderableSeries.add(series);
    }

    updateSeriesStyles();
    updateStatus();

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier(),
        new SeriesSelectionModifier3D({
            enableHover: true,
            enableSelection: true,
            // Thin 3D lines benefit from a larger hit-test radius.
            hitTestRadius: 15,
            // In a stacked waterfall, several rows can be near the pointer.
            // Prefer the hit point closest to the camera.
            prioritizeClosestToCamera: true,
            onSelectionChanged: (args) => {
                selectedIndex = parseSeriesIndex(args.selectedSeries[0]);
                updateSeriesStyles();
                updateStatus(args.hitTestInfo as XyzSeriesInfo3D);
            },
            onHoverChanged: (args) => {
                hoveredIndex = parseSeriesIndex(args.hoveredSeries[0]);
                updateSeriesStyles();
                updateStatus(args.hitTestInfo as XyzSeriesInfo3D);
            }
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
