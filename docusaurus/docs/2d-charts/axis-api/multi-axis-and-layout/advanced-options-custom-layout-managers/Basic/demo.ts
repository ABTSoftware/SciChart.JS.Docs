import {
    BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
    BottomAlignedOuterAxisLayoutStrategy,
    getHorizontalAxisRequiredSize,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    ZoomPanModifier,
    PinchZoomModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    FastLineRenderableSeries,
    XyDataSeries,
    TextAnnotation
} from "scichart";

// #region_A_start

// Example of creating a custom layout manager. First requested here https://www.scichart.com/questions/js/is-it-possible-to-create-two-xaxis-where-one-is-normal-and-the-other-one-is-horizontally-stacked-axis-layout
//
// Axis rendering  happens in 2 phases: measure & layout.
// Axis size and positioning is calculated by an axis layout strategy accordingly to the axisAlignment and isInner properties
// This custom Layout Strategy applies normal layout strategy to the first axis and the stacked strategy to the rest of bottom-aligned outer axes
class CustomAxisLayoutStrategy extends BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy {
    private defaultBottomOuterAxisLayoutStrategy: BottomAlignedOuterAxisLayoutStrategy;
    constructor() {
        super();

        /** The strategy used for normal (non-stacked) layout */
        this.defaultBottomOuterAxisLayoutStrategy = new BottomAlignedOuterAxisLayoutStrategy();
    }

    // override measureAxes from the base class
    public measureAxes(sciChartSurface, chartLayoutState, axes) {
        const [firstAxis, ...stackedAxes] = axes;
        // measure stacked axes and max height (stackedAreaSize) required by them
        super.measureAxes(sciChartSurface, chartLayoutState, stackedAxes);

        // measure first axis with the regular logic
        const stackedAreaSize = this.defaultBottomOuterAxisLayoutStrategy.measureAxes(
            sciChartSurface,
            chartLayoutState,
            [firstAxis]
        );

        // calculate height required by the first axis and then the total height
        const firstAxisSize = getHorizontalAxisRequiredSize(firstAxis.axisLayoutState);
        return firstAxisSize + stackedAreaSize;
    }

    // Override layoutAxes from the base class
    public layoutAxes(left, top, right, bottom, axes) {
        const [firstAxis, ...stackedAxes] = axes;
        // layout first axis with the regular logic
        this.defaultBottomOuterAxisLayoutStrategy.layoutAxes(left, top, right, bottom, [firstAxis]);

        // after the layout phase we get axis.viewRect which specifies size and position of an axis
        // and then we can layout rest of the axes with stacked strategy beneath it.
        super.layoutAxes(left, firstAxis.viewRect.bottom, right, bottom, stackedAxes);
    }
}
// #region_A_end

async function customLayoutManager(divElementId) {
    // Demonstrates how to apply a custom layout manager in SciChart.js

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region_B_start
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Apply your layout manager
    sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy = new CustomAxisLayoutStrategy();

    // Create some X Axis
    const options = { drawMajorBands: false, drawMajorGridLines: false, drawMinorGridLines: false };
    const xAxis0 = new NumericAxis(wasmContext, {
        axisTitle: "xAxis0",
        drawMajorBands: true,
        drawMajorGridLines: true,
        drawMinorGridLines: true
    });
    const xAxis1 = new NumericAxis(wasmContext, {
        axisTitle: "xAxis1",
        ...options
    });
    const xAxis2 = new NumericAxis(wasmContext, {
        axisTitle: "xAxis2",
        ...options
    });
    const xAxis3 = new NumericAxis(wasmContext, {
        axisTitle: "xAxis3",
        ...options
    });
    const yAxis1 = new NumericAxis(wasmContext, {
        axisTitle: "yAxis",
        backgroundColor: "#50C7E022",
        axisBorder: { color: "#50C7E0", borderLeft: 1 },
        axisTitleStyle: { fontSize: 13 }
    });

    // Add the axis to the chart
    sciChartSurface.xAxes.add(xAxis0, xAxis1, xAxis2, xAxis3);
    sciChartSurface.yAxes.add(yAxis1);

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420"];
    sciChartSurface.xAxes.asArray().forEach((xAxis, index) => {
        xAxis.backgroundColor = axisColors[index] + "22";
        xAxis.axisBorder = { color: axisColors[index], borderTop: 1 };
        xAxis.axisTitleStyle.fontSize = 13;
    });

    // #region_B_end

    // Let's add some series to the chart to show how they also behave with axis
    const getOptions = (index, offset = 0) => {
        const xValues = Array.from(Array(50).keys());
        const yValues = xValues.map(x => Math.sin(x * 0.4 + index) + offset);

        return {
            xAxisId: sciChartSurface.xAxes.asArray()[index].id,
            stroke: axisColors[index],
            strokeThickness: 3,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
        };
    };

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(0, 1) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(1) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(2) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(3) }));

    // We will also add some annotations to explain to the user
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Blue series uses xAxis0 and is stretched horizontally",
            x1: 0,
            y1: 2,
            textColor: axisColors[0]
        })
    );

    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Using xAxis1",
            x1: 0,
            y1: 1.1,
            xAxisId: xAxis1.id,
            textColor: axisColors[1]
        })
    );

    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Using xAxis2",
            x1: 0,
            y1: 1.1,
            xAxisId: xAxis2.id,
            textColor: axisColors[2]
        })
    );

    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Using xAxis3",
            x1: 0,
            y1: 1.1,
            xAxisId: xAxis3.id,
            textColor: axisColors[3]
        })
    );

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier({ applyToSeriesViewRect: false })
    );
}

customLayoutManager("scichart-root");
