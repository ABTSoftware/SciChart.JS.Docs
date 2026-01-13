import { ENumericFormat, FastOhlcRenderableSeries, MouseWheelZoomModifier, NumericAxis, NumberRange, OhlcDataSeries, SciChartSurface, SweepAnimation, ZoomExtentsModifier, ZoomPanModifier, SciChartJsNavyTheme, IndexAxis } from "scichart";
export const xValues = [
    915408000, 915494400, 915580800, 915667200, 915753600, 916012800, 916099200, 916185600, 916272000, 916358400,
    916617600, 916704000, 916790400, 916876800, 916963200, 917222400, 917308800, 917395200, 917481600, 917568000,
    917827200, 917913600, 918000000, 918086400, 918172800, 918432000, 918518400, 918604800, 918691200, 918777600
];
export const openValues = [
    1.1801, 1.1815, 1.1761, 1.1623, 1.1713, 1.1575, 1.1504, 1.1561, 1.1673, 1.1683, 1.1565, 1.1605, 1.1598, 1.1567,
    1.1605, 1.1579, 1.1555, 1.1562, 1.1445, 1.1407, 1.1382, 1.1323, 1.1353, 1.1309, 1.1343, 1.1262, 1.1312, 1.1314,
    1.1323, 1.1219
];
export const highValues = [
    1.1862, 1.1835, 1.1773, 1.1735, 1.172, 1.161, 1.158, 1.179, 1.1728, 1.1749, 1.162, 1.1642, 1.1611, 1.1619, 1.1626,
    1.1608, 1.1591, 1.1565, 1.147, 1.1433, 1.1397, 1.1365, 1.1363, 1.1346, 1.1373, 1.133, 1.1345, 1.136, 1.1336, 1.1308
];
export const lowValues = [
    1.1769, 1.175, 1.1553, 1.1612, 1.1533, 1.1487, 1.1447, 1.1553, 1.1614, 1.1552, 1.1564, 1.1563, 1.1539, 1.1545,
    1.1559, 1.1547, 1.155, 1.1408, 1.1378, 1.1342, 1.129, 1.1284, 1.13, 1.1247, 1.1253, 1.122, 1.1281, 1.127, 1.1214,
    1.1216
];
export const closeValues = [
    1.1815, 1.1758, 1.1623, 1.1712, 1.1585, 1.1503, 1.1555, 1.1681, 1.1681, 1.1563, 1.1605, 1.1603, 1.1566, 1.1601,
    1.1587, 1.1552, 1.1562, 1.144, 1.1407, 1.1367, 1.1323, 1.1352, 1.1306, 1.1344, 1.126, 1.1315, 1.1315, 1.1326,
    1.1218, 1.1306
];
// export const drawExample = async (rootElement: string | HTMLDivElement) => {
async function ohlcChart(divElementId) {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // #region_A_start
    // Add IndexAxis - which collapses gaps in stock market data
    sciChartSurface.xAxes.add(new IndexAxis(wasmContext, {
        // labelProvider: new SmartDateLabelProvider(),
        growBy: new NumberRange(0.05, 0.05),
    }));
    // Create a NumericAxis on the YAxis with 4 Decimal Places
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(1.1, 1.2),
        growBy: new NumberRange(0.1, 0.1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2
    }));
    // Create the Ohlc series and add to the chart
    sciChartSurface.renderableSeries.add(new FastOhlcRenderableSeries(wasmContext, {
        dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
        strokeThickness: 1,
        dataPointWidth: 0.7,
        strokeUp: "#50ff50",
        strokeDown: "#ff5050",
        animation: new SweepAnimation({ duration: 800, fadeEffect: true })
    }));
    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier({ enableZoom: true }), new MouseWheelZoomModifier());
    // #region_A_end
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
}
ohlcChart("scichart-root");
