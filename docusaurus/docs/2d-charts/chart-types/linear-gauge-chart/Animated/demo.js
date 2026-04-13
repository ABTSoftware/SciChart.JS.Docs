import * as SciChart from "scichart";
async function animatedGauge(divElementId) {
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme, NumberRange, FastRectangleRenderableSeries, XyyDataSeries,
        EColumnMode, EColumnYMode, EDataPointWidthMode, EFillPaletteMode, DefaultPaletteProvider,
        parseColorToUIntArgb, Thickness } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: new Thickness(5, 5, 5, 20)
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        isVisible: false,
        visibleRange: new NumberRange(-20, 30)
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        isVisible: true,
        growBy: new NumberRange(0.05, 0.05),
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false
    }));

    // region_A_start
    const GRADIENT_COLORS = [
        "#1C5727", "#277B09", "#2C8A26", "#3CAC45", "#58FF80",
        "#59FD03", "#7FFC09", "#98FA96", "#AEFE2E", "#FEFCD2",
        "#FBFF09", "#FBD802", "#F9A700", "#F88B01", "#F54602",
        "#F54702", "#F50E02", "#DA153D", "#B22122", "#B22122"
    ];

    class HeatPaletteProvider extends DefaultPaletteProvider {
        constructor() {
            super();
            this.fillPaletteMode = EFillPaletteMode.SOLID;
            this.colors = GRADIENT_COLORS.map(c => parseColorToUIntArgb(c));
        }
        overrideFillArgb(xValue, yValue, index) {
            return this.colors[index - 1] ?? this.colors[0];
        }
    }

    const buildGaugeData = (value, position) => {
        const steps = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .filter(y => y <= value);
        const xValues = steps.map(() => position);
        const yValues = steps.map((_, i) => (i === 0 ? steps[0] : steps[i - 1]));
        return { xValues, yValues, y1Values: steps };
    };

    sciChartSurface.renderableSeries.add(new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0],
            yValues: [-10.5],
            y1Values: [10.5]
        }),
        columnXMode: EColumnMode.Start,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidth: 14,
        dataPointWidthMode: EDataPointWidthMode.Range,
        fill: "#1B2A4A",
        stroke: "gray",
        strokeThickness: 2
    }));

    const dataSeries = new XyyDataSeries(wasmContext);
    const initial = buildGaugeData(0, 0);
    dataSeries.appendRange(initial.xValues, initial.yValues, initial.y1Values);

    sciChartSurface.renderableSeries.add(new FastRectangleRenderableSeries(wasmContext, {
        dataSeries,
        columnXMode: EColumnMode.Start,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidth: 10,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: "#1B2A4A",
        strokeThickness: 4,
        paletteProvider: new HeatPaletteProvider()
    }));

    const VALUES = [0, 3, 4, 7, -2, -8, 4];
    let i = 0;
    setInterval(() => {
        i = (i + 1) % VALUES.length;
        const { xValues, yValues, y1Values } = buildGaugeData(VALUES[i], 0);
        dataSeries.clear();
        dataSeries.appendRange(xValues, yValues, y1Values);
    }, 1000);
    // region_A_end

    return { sciChartSurface };
}
animatedGauge("scichart-root");
