import { SciChartSurface, CategoryAxis, SciChartJsNavyTheme, NumericAxis, TextAnnotation, ECoordinateMode, EHorizontalAnchorPoint, EVerticalAnchorPoint, FastLineRenderableSeries, XyDataSeries, EllipsePointMarker, NumberRange, ENumericFormat, LegendModifier, ELegendOrientation, ELegendPlacement, IndexAxis } from "scichart";
async function categoryAxisVsValueAxis() {
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
        // Note: we will be improving this shortly in scichart.js v3.1
        sciChartSurface.annotations.add(new TextAnnotation({
            text: titleText,
            x1: 0.5,
            y1: 0,
            yCoordShift: 10,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            opacity: 0.77,
            fontSize: 28,
            fontWeight: "Bold",
            textColor: "White"
        }));
        sciChartSurface.annotations.add(new TextAnnotation({
            text: subTitleText,
            x1: 0.5,
            y1: 0,
            yCoordShift: 50,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            opacity: 0.77,
            fontSize: 14,
            textColor: "White"
        }));
    };
    const addLineSeries = (sciChartSurface, xValues, yValues, stroke, dataSeriesName) => {
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(sciChartSurface.webAssemblyContext2D, {
            dataSeries: new XyDataSeries(sciChartSurface.webAssemblyContext2D, {
                xValues,
                yValues,
                dataSeriesName
            }),
            stroke,
            strokeThickness: 2,
            pointMarker: new EllipsePointMarker(sciChartSurface.webAssemblyContext2D, {
                width: 7,
                height: 7,
                fill: stroke,
                stroke
            })
        }));
    };
    const addLegend = sciChartSurface => {
        sciChartSurface.chartModifiers.add(new LegendModifier({
            orientation: ELegendOrientation.Horizontal,
            placement: ELegendPlacement.BottomLeft,
            showSeriesMarkers: true,
            showLegend: true,
            showCheckboxes: false
        }));
    };
    const createCategoryAxisChart = async (divElementId) => {
        // #region_A_start
        // With the following data
        const xValues = [1, 9, 10, 20];
        const cats = [7, 6, 5, 4];
        const dogs = [7, 5, 4, 3];
        const fish = [8, 7, 3, 2];
        // create a chart
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
            theme: new SciChartJsNavyTheme()
        });
        // Add a Category XAxis with numeric formatting
        sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, {
            axisTitle: "Category Axis",
            labelFormat: ENumericFormat.Decimal
        }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));
        // #region_A_end
        // Add titles + series
        addChartTitle(sciChartSurface, "Category XAxis", "Index is used to measure X-Distance");
        addLineSeries(sciChartSurface, xValues, cats, "#50C7E0", "Cats");
        addLineSeries(sciChartSurface, xValues, dogs, "#F48420", "Dogs");
        addLineSeries(sciChartSurface, xValues, fish, "#C52E60", "Fish");
        addLegend(sciChartSurface);
    };
    const createValueAxisChart = async (divElementId) => {
        // #region_B_start
        // With the following data
        const xValues = [1, 9, 10, 20];
        const cats = [7, 6, 5, 4];
        const dogs = [7, 5, 4, 3];
        const fish = [8, 7, 3, 2];
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Numeric Axis", growBy: new NumberRange(0.1, 0.1) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));
        addChartTitle(sciChartSurface, "Value XAxis", "X Values are used to measure X-Distance");
        addLineSeries(sciChartSurface, xValues, cats, "#50C7E0", "Cats");
        addLineSeries(sciChartSurface, xValues, dogs, "#F48420", "Dogs");
        addLineSeries(sciChartSurface, xValues, fish, "#C52E60", "Fish");
        addLegend(sciChartSurface);
        // #region_B_end
    };
    const createIndexAxisChart = async (divElementId) => {
        // #region_C_start
        // With the following data
        const xValues = [1, 9, 10, 20];
        const cats = [7, 6, 5, 4];
        const dogs = [7, 5, 4, 3];
        const fish = [8, 7, 3, 2];
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new IndexAxis(wasmContext, {
            axisTitle: "Index Axis",
            growBy: new NumberRange(0.1, 0.1)
        });
        xAxis.labelProvider.formatLabel = dataValue => {
            return dataValue.toString(10);
        };
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));
        addChartTitle(sciChartSurface, "Index XAxis", "Index is used to measure X-Distance");
        addLineSeries(sciChartSurface, xValues, cats, "#50C7E0", "Cats");
        addLineSeries(sciChartSurface, xValues, dogs, "#F48420", "Dogs");
        addLineSeries(sciChartSurface, xValues, fish, "#C52E60", "Fish");
        addLegend(sciChartSurface);
        // #region_C_end
    };
    createCategoryAxisChart("scichart0");
    createValueAxisChart("scichart1");
    createIndexAxisChart("scichart2");
}
categoryAxisVsValueAxis();
