import * as SciChart from "scichart";

// Florence Nightingale's data: deaths in the British Army in the East, by month and cause,
// April 1854 to March 1856 (from her 1858 "Notes on Matters Affecting the Health, Efficiency, and
// Hospital Administration of the British Army", as tabulated in the HistData package for R).
function getCrimeanWarDeaths() {
    return {
        months: [
            "Apr 1854", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan 1855", "Feb", "Mar",
            "Apr 1855", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan 1856", "Feb", "Mar"
        ],
        fullMonths: [
            "April 1854", "May 1854", "June 1854", "July 1854", "August 1854", "September 1854",
            "October 1854", "November 1854", "December 1854", "January 1855", "February 1855", "March 1855",
            "April 1855", "May 1855", "June 1855", "July 1855", "August 1855", "September 1855",
            "October 1855", "November 1855", "December 1855", "January 1856", "February 1856", "March 1856"
        ],
        // Drawn from the centre outwards in this order
        causes: [
            {
                name: "Wounds",
                color: "#EF5350",
                deaths: [0, 0, 0, 0, 1, 81, 132, 287, 114, 83, 42, 32, 48, 49, 209, 134, 164, 276, 53, 33, 18, 2, 0, 0]
            },
            {
                name: "Other causes",
                color: "#B0BEC5",
                deaths: [5, 9, 6, 23, 30, 70, 128, 106, 131, 324, 361, 172, 57, 37, 31, 33, 25, 20, 18, 32, 28, 48, 19, 35]
            },
            {
                name: "Preventable disease",
                color: "#50C7E0",
                deaths: [1, 12, 11, 359, 828, 788, 503, 844, 1725, 2761, 2120, 1205, 477, 508, 802, 382, 483, 189, 128, 178, 91, 42, 24, 15]
            }
        ]
    };
}

async function polarAreaChart(divElementId) {
    // #region_A_start
    // Create a JavaScript polar area chart (Nightingale rose / coxcomb chart) with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarColumnRenderableSeries,
        XyxyDataSeries,
        NumberRange,
        NumericTickProvider,
        EPolarAxisMode,
        EColumnMode,
        EPolarLabelMode,
        SciChartJsNavyTheme,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const data = getCrimeanWarDeaths(); // { months, fullMonths, causes: [{ name, color, deaths: [...] }] }
    const monthCount = data.months.length;

    // Angular axis: one equal wedge per month, starting at 12 o'clock and going clockwise.
    // Month i's wedge runs from i to i + 1. Lines go between the wedges (minor ticks at whole numbers)
    // and each label sits in the middle of its wedge (major ticks at i + 0.5).
    class MonthTickProvider extends NumericTickProvider {
        getMajorTicks() {
            return data.months.map((_, i) => i + 0.5);
        }
        getMinorTicks() {
            return data.months.map((_, i) => i);
        }
    }
    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, monthCount),
        startAngle: Math.PI / 2,
        flippedCoordinates: true,
        drawMajorGridLines: false, // no line through the middle of a wedge
        minorGridLineStyle: { color: "#88888866" }, // lines between the wedges
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        polarLabelMode: EPolarLabelMode.Horizontal
    });
    angularAxis.tickProvider = new MonthTickProvider(wasmContext);
    angularAxis.labelProvider.formatLabel = (value) => data.months[Math.floor(value)] ?? "";
    sciChartSurface.xAxes.add(angularAxis);

    // Radial axis: the key to a polar area chart. A wedge's AREA must match its value, and area grows
    // with the square of the radius, so we plot the square root of each value and label the rings
    // with the real numbers: rings at 10, 20, 30 ... from the centre read 100, 400, 900 ... deaths.
    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 58),
        startAngle: Math.PI / 2, // value labels run up the 12 o'clock line
        autoTicks: false,
        majorDelta: 10,
        majorGridLineStyle: { color: "#88888866" },
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false
    });
    radialAxis.labelProvider.formatLabel = (sqrtValue) => (sqrtValue === 0 ? "" : (sqrtValue * sqrtValue).toLocaleString());
    sciChartSurface.yAxes.add(radialAxis);

    // Stack the causes: each band runs from sqrt(total so far) to sqrt(total so far + this cause),
    // so every band's area matches its own count, and the whole wedge's area matches the month's total.
    const runningTotal = new Array(monthCount).fill(0);
    for (const cause of data.causes) {
        const xValues = [], x1Values = [], yValues = [], y1Values = [];
        cause.deaths.forEach((deaths, i) => {
            xValues.push(i);
            x1Values.push(i + 1);
            y1Values.push(Math.sqrt(runningTotal[i])); // inner edge
            runningTotal[i] += deaths;
            yValues.push(Math.sqrt(runningTotal[i])); // outer edge
        });
        sciChartSurface.renderableSeries.add(
            new PolarColumnRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, { xValues, x1Values, yValues, y1Values, dataSeriesName: cause.name }),
                columnXMode: EColumnMode.StartEnd, // each wedge runs from x to x1
                fill: cause.color + "CC",
                stroke: cause.color,
                strokeThickness: 1
            })
        );
    }

    // Hover for the month's real numbers, scroll to zoom, double-click to reset,
    // and a legend naming the causes
    sciChartSurface.chartModifiers.add(
        new PolarCursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            // seriesInfos is empty until the cursor is over a wedge, so check before reading it
            tooltipDataTemplate: (seriesInfos) => {
                if (seriesInfos.length === 0) return [];
                const i = seriesInfos[0].dataSeriesIndex;
                return [
                    data.fullMonths[i],
                    ...data.causes
                        .slice()
                        .reverse()
                        .map((cause) => `${cause.name}: ${cause.deaths[i].toLocaleString()}`),
                    `Total: ${runningTotal[i].toLocaleString()} deaths`
                ];
            }
        }),
        new PolarMouseWheelZoomModifier(),
        new PolarZoomExtentsModifier(),
        new PolarLegendModifier({ showCheckboxes: false, showSeriesMarkers: true })
    );
    // #region_A_end
}

polarAreaChart("scichart-root");
