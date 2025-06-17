import * as SciChart from "scichart";

async function centralAxis(divElementId) {
    // #region_A_start
    // Demonstrates how to configure a central axis in SciChart.js
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme, CentralAxesLayoutManager } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Apply the CentralAxesLayoutManager to the SciChartSurface
    sciChartSurface.layoutManager = new CentralAxesLayoutManager();

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            // To allow easier visualisation of axis position
            backgroundColor: "#50C7E022",
            axisBorder: {
                borderTop: 1,
                color: "#50C7E0"
            }
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            // To allow easier visualisation of axis position
            backgroundColor: "#F4842022",
            axisBorder: {
                borderRight: 1,
                color: "#F48420"
            }
        })
    );
    // #region_A_end
}

centralAxis("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure a central axis in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, ELayoutManagerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: { type: EThemeProviderType.Dark },
            layoutManager: { type: ELayoutManagerType.CentralAxes }
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // To allow easier visualisation of axis position
                backgroundColor: "#50C7E022",
                axisBorder: {
                    borderTop: 1,
                    color: "#50C7E0"
                }
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // To allow easier visualisation of axis position
                backgroundColor: "#F4842022",
                axisBorder: {
                    borderRight: 1,
                    color: "#F48420"
                }
            }
        }
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
