import * as SciChart from "scichart";


async function initSciChart(divElementId) {
    // #region_A_start
    const {
        SciChartSurface,
        NumericAxis,
        ArcAnnotation,
        SciChartJsNavyTheme,
        ECoordinateMode
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Filled Arc Segment with positive height
    const filledArc = new ArcAnnotation({
        isEditable: true,
        x1: 3,
        y1: 7,
        x2: 7,
        y2: 7,
        height: 4,
        innerRadius: 0.4, // Creates a segment instead of a full sector
        fill: "rgba(176, 196, 222, 0.3)",
        stroke: "rgba(176, 196, 222, 1)",
        strokeThickness: 5,
    });

    // Arc Line with negative height
    const arcLine = new ArcAnnotation({
        isEditable: true,
        isLineMode: true,
        x1: 3,
        y1: 5,
        x2: 7,
        y2: 5,
        height: -1.5, // Negative height curves the arc downwards
        stroke: "#FF6347",
        strokeThickness: 5,
        selectionBoxStroke: "rgba(255, 255, 255, 0.5)",
    });

    const absoluteArc = new ArcAnnotation({
        isEditable: true,
        isLineMode: true,
        x1: 30,
        y1: 50,
        x2: 70,
        y2: 50,
        height: -1.5, // Negative height curves the arc downwards
        stroke: "#FF6347",
        strokeThickness: 5,
        selectionBoxStroke: "rgba(255, 255, 255, 0.5)",
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    // Add ArcAnnotations to the chart
    sciChartSurface.annotations.add(filledArc, arcLine, absoluteArc);
    // #region_A_end

    const annotation1 = new SciChart.NativeTextAnnotation({
        text: `Filled Arc Segment: \nx1=${filledArc.x1.toFixed(2)}, \ny1=${filledArc.y1.toFixed(2)}, \nx2=${filledArc.x2.toFixed(2)}, \ny2=${filledArc.y2.toFixed(2)}, \nheight=${filledArc.height.toFixed(2)}`,
        x1: 1,
        y1: 9,
        textColor: "white",
        fontSize: 16,
        multiLineAlignment: SciChart.EMultiLineAlignment.Left
    })
    filledArc.dragDelta.subscribe(() => {
        annotation1.text = `Filled Arc Segment: \nx1=${filledArc.x1.toFixed(2)}, \ny1=${filledArc.y1.toFixed(2)}, \nx2=${filledArc.x2.toFixed(2)}, \ny2=${filledArc.y2.toFixed(2)}, \nheight=${filledArc.height.toFixed(2)}`;
    })

    const annotation2 = new SciChart.NativeTextAnnotation({
        text: `Line Arc: \nx1=${arcLine.x1.toFixed(2)}, \ny1=${arcLine.y1.toFixed(2)}, \nx2=${arcLine.x2.toFixed(2)}, \ny2=${arcLine.y2.toFixed(2)}, \nheight=${arcLine.height.toFixed(2)}`,
        x1: 1,
        y1: 4,
        textColor: "white",
        fontSize: 16,
        multiLineAlignment: SciChart.EMultiLineAlignment.Left
    })
    arcLine.dragDelta.subscribe(() => {
        annotation2.text = `Line Arc: \nx1=${arcLine.x1.toFixed(2)}, \ny1=${arcLine.y1.toFixed(2)}, \nx2=${arcLine.x2.toFixed(2)}, \ny2=${arcLine.y2.toFixed(2)}, \nheight=${arcLine.height.toFixed(2)}`;
    })
    sciChartSurface.annotations.add(annotation1, annotation2);
}

initSciChart("scichart-root");
