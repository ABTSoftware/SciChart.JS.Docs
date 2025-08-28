import { FastLineRenderableSeries, SciChartSurface, XyDataSeries, NumericAxis, NumberRange, LegendModifier, ELegendOrientation, ZoomPanModifier, MouseWheelZoomModifier, XyScatterRenderableSeries, TrianglePointMarker, FastColumnRenderableSeries, SciChartJsNavyTheme } from "scichart";
async function customLegendMarkers(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLine1Values = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];
    const yLine2Values = [1, 1.1, 1.4, 1.3, 1.05, 0.8, 0.6, 0.5, 0.4];
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        id: 'green-line',
        stroke: '#00AA88',
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: 'Green Line',
            xValues: xLineValues,
            yValues: yLine1Values
        })
    }));
    sciChartSurface.renderableSeries.add(new FastColumnRenderableSeries(wasmContext, {
        id: 'red-column',
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: 'Red Columns',
            xValues: xLineValues,
            yValues: yLine1Values
        }),
        stroke: '#FF4433',
        fill: '#FF443344'
    }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        id: 'yellow-line-dashed',
        stroke: '#eedd00',
        strokeThickness: 3,
        strokeDashArray: [5, 5],
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: 'Yellow Dashed Line',
            xValues: xLineValues,
            yValues: Array.from({ length: xLineValues.length }, (_, i) => Math.sin(i) + 1.5)
        })
    }));
    sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
        id: 'blue-triangle',
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: 'Blue Triangle Series',
            xValues: xLineValues,
            yValues: yLine2Values
        }),
        pointMarker: new TrianglePointMarker(wasmContext, {
            fill: '#3388FF',
            stroke: '#FFFFFF',
            width: 13,
            height: 10,
            strokeThickness: 1.5
        }),
        stroke: '#3388FF', // needed for the legend marker
    }));
    const customMarkerLegendModifier = new LegendModifier({
        showCheckboxes: false,
        showSeriesMarkers: true,
        backgroundColor: "#00000022"
    });
    // override "getLegendItemHTML" to add custom SVG shapes
    customMarkerLegendModifier.sciChartLegend.getLegendItemHTML = (orientation, showCheckboxes, showSeriesMarkers, item) => {
        const display = orientation === ELegendOrientation.Vertical ? "flex" : "inline-flex";
        let str = `<span class="scichart__legend-item" style="display: ${display}; align-items: center; margin-right: 4px; padding: 0 4px 0 5px; white-space: nowrap; gap: 5px">`;
        if (showCheckboxes) {
            const checked = item.checked ? "checked" : "";
            str += `<input ${checked} type="checkbox" id="${item.id}">`;
        }
        if (showSeriesMarkers) {
            str += `<svg 
                xmlns="http://www.w3.org/2000/svg"
                for="${item.id}" 
                style="width: 15px; height: 15px;" 
                viewBox="0 0 24 24"
                stroke-width="2"
            >
                ${(() => {
                switch (item.id) {
                    case 'green-line':
                        return `<line x1="2" y1="12" x2="22" y2="12" stroke="${item.color}" stroke-width="3" />`;
                    case 'yellow-line-dashed':
                        return `<line x1="2" y1="12" x2="22" y2="12" stroke="${item.color}" stroke-width="3" stroke-dasharray="5,3" />`;
                    case 'blue-triangle':
                        return `<polygon points="12,4 21,20 3,20" fill="${item.color}" stroke="#FFFFFF" stroke-width="2.5" />`;
                    case 'red-column':
                        return `<rect x="2" y="7" width="20" height="10" fill="${item.color + "44"}" stroke="${item.color}"/>`;
                    default: // Others 
                        return `<rect x="2" y="4" width="20" height="16" fill="${item.color}" stroke="${item.color}"/>`;
                }
            })()}
            </svg>`;
        }
        str += `<label for="${item.id}">${item.name}</label>`;
        str += `</span>`;
        return str;
    };
    sciChartSurface.chartModifiers.add(customMarkerLegendModifier, new ZoomPanModifier(), new MouseWheelZoomModifier());
}
customLegendMarkers("scichart-root");
