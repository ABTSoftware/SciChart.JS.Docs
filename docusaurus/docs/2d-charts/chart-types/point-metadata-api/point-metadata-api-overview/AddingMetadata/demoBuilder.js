async function builderExample(divElementId) {
    // #region_A_start
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                // Metadata is set in xyData property
                xyData: {
                    xValues: [1, 2, 3, 4, 5],
                    yValues: [4.3, 5.3, 6, 6.3, 6.4],
                    metadata: [
                        { stringValue: "Here's", customValue: 7 },
                        undefined, // nothing at this index
                        { stringValue: "Some" },
                        {}, // empty object at this index
                        { stringValue: "Metadata", customValue: 99 }
                    ]
                },
                options: {
                    stroke: "#C52E60",
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 11,
                            height: 11,
                            fill: "White"
                        }
                    }
                }
            }
        ],
        // Configure a Rollovermodifier to display metadata
        modifiers: [
            {
                type: EChart2DModifierType.Rollover,
                options: {
                    snapToDataPoint: true,
                    tooltipDataTemplate: seriesInfo => [
                        `X: ${seriesInfo.formattedXValue}`,
                        `Y: ${seriesInfo.formattedYValue}`,
                        `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? "null"}`,
                        `Metadata.customValue: ${seriesInfo.pointMetadata?.customValue ?? "null"}`
                    ]
                }
            }
        ]
    });
    // #region_A_end
}