import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        EXyDirection,
        NumberRange,
        NumericAxis,
        SciChartSurface
    } = SciChart; // or import from "scichart"
    const { 
        FreehandDrawingAnnotation,
        SciTraderLightTheme 
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(8, 15) }));

    sciChartSurface.annotations.add(
        new FreehandDrawingAnnotation({
            // Freehand drawings are stored as many polyline points. This static example is created using a
            // FreehandDrawingModifier and serialisation.
            points: [
                { x:5.4681, y: 12.795 },{ x:5.4681, y: 12.8282 },{ x:5.4681, y: 12.8687 },{ x:5.459, y: 12.8959 },{ x:5.4350, y: 12.9280 },
                { x:5.3947, y: 12.9630 },{ x:5.3474, y: 12.9955 },{ x:5.2979, y: 13.0233 },{ x:5.2448, y: 13.0502 },{ x:5.2007, y: 13.0710 },
                { x:5.1617, y: 13.0855 },{ x:5.1265, y: 13.0965 },{ x:5.0995, y: 13.1005 },{ x:5.0752, y: 13.1005 },{ x:5.052, y: 13.1005 },
                { x:5.0257, y: 13.1005 },{ x:4.9839, y: 13.1005 },{ x:4.9363, y: 13.0984 },{ x:4.8907, y: 13.0911 },{ x:4.8413, y: 13.073 },
                { x:4.7982, y: 13.0532 },{ x:4.7618, y: 13.033 },{ x:4.7278, y: 13.0095 },{ x:4.6902, y: 12.977 },{ x:4.646, y: 12.9321 },
                { x:4.5975, y: 12.8772 },{ x:4.5493, y: 12.8179 },{ x:4.5082, y: 12.7592 },{ x:4.4767, y: 12.7065 },{ x:4.4550, y: 12.6620 },
                { x:4.4408, y: 12.620 },{ x:4.43587, y: 12.598 },{ x:4.43587, y: 12.5284 },{ x:4.4365, y: 12.4712 },{ x:4.4462, y: 12.4127 },
                { x:4.4743, y: 12.350 },{ x:4.5179, y: 12.2820 },{ x:4.5721, y: 12.219 },{ x:4.63426, y: 12.1632 },{ x:4.7057, y: 12.1125 },
                { x:4.7829, y: 12.0679 },{ x:4.8512, y: 12.0319 },{ x:4.9145, y: 12.003 },{ x:4.9867, y: 11.9764 },{ x:5.0582, y: 11.955 },
                { x:5.1296, y: 11.9412 },{ x:5.1967, y: 11.9298 },{ x:5.2676, y: 11.9194 },{ x:5.3447, y: 11.9097 },{ x:5.4197, y: 11.8960 },
                { x:5.5037, y: 11.8751 },{ x:5.5890, y: 11.8486 },{ x:5.6810, y: 11.81 },{ x:5.7738, y: 11.7624 },{ x:5.8614, y: 11.7063 },
                { x:5.9462, y: 11.6434 },{ x:6.0181, y: 11.5789 },{ x:6.0786, y: 11.5085 },{ x:6.1327, y: 11.4231 },{ x:6.1796, y: 11.321 },
                { x:6.2224, y: 11.2018 },{ x:6.2608, y: 11.0762 },{ x:6.2908, y: 10.9559 },{ x:6.3112, y: 10.837 },{ x:6.3219, y: 10.7163 },
                { x:6.3251, y: 10.5919 },{ x:6.3108, y: 10.4716 },{ x:6.2729, y: 10.360 },{ x:6.2188, y: 10.267 },{ x:6.1513, y: 10.18 },
                { x:6.0565, y: 10.1209 },{ x:5.9192, y: 10.0618 },{ x:5.7471, y: 10.0063 },{ x:5.5620, y: 9.963 },{ x:5.3880, y: 9.9375 },
                { x:5.2450, y: 9.9218 },{ x:5.1280, y: 9.9140 },{ x:5.02649, y: 9.9140 },{ x:4.92722, y: 9.9157 },{ x:4.8131, y: 9.9334 },
                { x:4.6908, y: 9.9780 },{ x:4.5779, y: 10.0281 },{ x:4.4790, y: 10.0837 },{ x:4.3901, y: 10.1519 },{ x:4.3120, y: 10.2360 },
                { x:4.2393, y: 10.345 },{ x:4.1684, y: 10.4700 },{ x:4.1155, y: 10.5727 },{ x:4.0796, y: 10.6572 },{ x:4.0516, y: 10.7341 },
                { x:4.0342, y: 10.8011 },{ x:4.0255, y: 10.8553 },{ x:4.0233, y: 10.8940 },{ x:4.0233, y: 10.9200 },{ x:4.0233, y: 10.942 }
            ],
            stroke: "#FF8833",
            strokeThickness: 4,
            isEditable: true,
            // Body dragging lets users move the whole captured stroke.
            allowMove: true,
            // XyDirection enables both horizontal and vertical resize handles.
            resizeDirections: EXyDirection.XyDirection,
            keepAspectRatioOnResize: false,
            // The outline gives freehand strokes resize handles without exposing every point as a grip.
            showBoxOutline: true,
            showBoxOutlineOnlyWhenSelected: true
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new SciChart.AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: SciChart.ECursorStyle.Crosshair,
        })
    );
}

drawExample("scichart-root");
