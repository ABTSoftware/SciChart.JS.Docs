---
sidebar_position: 2
---

# DataPoint Selection

SciChart now features a native ChartModifier called the [DataPointSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html) which allows individual data-points to be selected via the mouse, or programmatically.

The [DataPointSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html) allows you to do two things:

1.  Be notified via the `onSelectionChanged` event when the user selects one or more points.
2.  Change the rendering of the selected points using a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionpaletteprovider.html) to change the fill/stroke of the point-marker when selected.

Enabling the DataPointSelectionModifier
---------------------------------------

To enable Data-point selection, you must do the following:

1.  Add a **DataPointSelectionModifier** to the **SciChartSurface.chartModifier** collection
2.  (Optional) Create and add **IPointMetadata** for each data-point you wish to programmatically select. If you do not do this, **DataPointSelectionModifier** will do it for you.
3.  (Optional) Add a **DataPointSelectionPaletteProvider** to series if you want visual feedback on selection. If you do not do this, points will be selected but without visual feedback.

**Find an example below**

<CodeSnippetBlock labels={["DataPointSelectionModifier"]}>
    ```ts {34,38} showLineNumbers file=./example1.ts
    ```
</CodeSnippetBlock>

<CenteredImageWrapper
    src="/images/datapointselectionmodifier-1.gif"
    alt="DataPoint Selection Modifier Example"  
/>

Getting Notifications on Datapoint Selection
--------------------------------------------

The [DataPointSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html) has an event, [selectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html#selectionchanged), which allows you to subscribe to a callback when points are selected or deselected. The [onSelectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html#onselectionchanged) function may also be passed into the **constructor options**.

Here are two ways you can be notified when datapoint selection changes in SciChart.

```ts {5,12} showLineNumbers
import { DataPointSelectionModifier } from "scichart";

// Option 1, pass onSelectionChanged callback when creating the DataPointSelectionModifier
sciChartSurface.chartModifiers.add(new DataPointSelectionModifier({
    onSelectionChanged: (args) => {
        console.log(`${args.selectedDataPoints.length} datapoints selected!`);
    }
}));

// Option 2, multiple subscribers can listen to the selectionChanged event as well
const dataPointSelectionModifier = new DataPointSelectionModifier();
dataPointSelectionModifier.selectionChanged.subscribe((args) => {
    console.log(`${args.selectedDataPoints.length} datapoints selected!`);
});
```

:::tip
For more info about the arguments to the selectionChanged event or onSelectionChanged callback, please see the following items in our TypeDoc documentation.

*   [DataPointSelectionModifier.selectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html#selectionchanged) event
*   [DataPointSelectionChangedArgs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionchangedargs.html) type
*   [DataPointInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointinfo.html) type
:::

Multi-select, Invert-selection and Replace-selection
----------------------------------------------------

The **DataPointSelectionModifier** supports multi-selection by holding the **CTRL** key while clicking on datapoints. This option is available when `DataPointSelectionModifier.allowClickSelect = true`.

Holding the **SHIFT** key inverts a selection. Use this to deselect a single point on the chart.

Without CTRL or SHIFT pressed, the default behaviour is to replace a selection, e.g. a new point clicked will replace a previously clicked point.

To customize this behaviour you can pass a [getSelectionMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionmodifier.html#getselectionmode) function into the constructor options of **DataPointSelectionModifier**, or, override the getSelectionMode function. For example:

```ts
import { DataPointSelectionModifier, ESelectionMode, TModifierKeys } from "scichart";

const dataPointSelectionModifier = new DataPointSelectionModifier({
    // Override getSelectionMode behaviour
    getSelectionMode: (modifierKeys, isAreaSelection) => {
        if (modifierKeys.ctrlKey) {
            // Union when area selection and CTRL else Inverse
            return ESelectionMode.Union;
        } else if (modifierKeys.shiftKey) {
            // When shift Inverse
            return ESelectionMode.Inverse;
        }
        // Default mode is Replace
        return ESelectionMode.Replace;
    },
});
```

Rectangle Select DataPoints
---------------------------

Datapoints may be selected by dragging a rectangle on the chart. This option is available when `DataPointSelectionModifier.allowDragSelect = true`.

Drag to Select rectangle can be customised by setting the properties **DataPointSelectionModifier.selectionStroke**, **DatapointSelectionModifier.selectionFill** and **DataPointSelectionModifier.selectionStrokeThickness** properties. This may also be customizable in the themes by setting **IThemeProvider.rubberBandFillBrush** and **IThemeProvider.rubberBandStrokeBrush** properties.

Multi-select behaviour is also configurable via the getSelectionMode function.

<CenteredImageWrapper
    src="/images/datapointselectionmodifier-2.gif"
    alt="DataPoint Selection Modifier Rectangle Select Example"
/>

Customizing the Visual of Datapoint Selection
---------------------------------------------

By default there is no visual feedback that a datapoint is selected or deselected. To add this behaviour, you can add a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionpaletteprovider.html) to each series you want to show visual feedback. We've created one out of the box for you to simplify this process.

```ts {17} showLineNumbers
// Create a chart with line series with a point-marker
sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "SteelBlue",
    strokeThickness: 3,
    pointMarker: new EllipsePointMarker(wasmContext, {
        width: 10,
        height: 10,
        strokeThickness: 2,
        stroke: "SteelBlue",
        fill: "LightSteelBlue"
    }),
    dataSeries: new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
    }),
    // Adding the DataPointSelectionPaletteProvider will change the fill/stroke of the pointmarker on selection
    paletteProvider: new DataPointSelectionPaletteProvider({ fill: "white", stroke: "white" })
}));
```

The [DataPointSelectionPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datapointselectionpaletteprovider.html) checks for **IPointMetadata.isSelected** to return a fill/stroke for point-markers that are selected. Our implementation looks like this. You can either use our default implementation or create your own based on this.

<CodeSnippetBlock labels={["DataPointSelectionPaletteProvider"]}>
    ```ts 
    import { TPalletProviderDefinition } from "../../Builder/buildSeries";
    import { EPaletteProviderType } from "../../types/PaletteProviderType";
    import { parseArgbToHtmlColor, parseColorToUIntArgb } from "../../utils/parseColor";
    import { IRenderableSeries } from "../Visuals/RenderableSeries/IRenderableSeries";
    import {
        EFillPaletteMode,
        EStrokePaletteMode,
        IFillPaletteProvider,
        IPointMarkerPaletteProvider,
        IStrokePaletteProvider,
        TPointMarkerArgb
    } from "./IPaletteProvider";
    import { IPointMetadata } from "./IPointMetadata";

    export interface ISelectedPointOptions {
        /**
        * The fill of the point-marker as an HTML color code
        */
        fill?: string;
        /**
        * The stroke of the point-marker as an HTML color code
        */
        stroke?: string;
    }

    export class DataPointSelectionPaletteProvider implements IPointMarkerPaletteProvider {
        public selectedPointMarker: TPointMarkerArgb;
        public selectedStroke: number;
        public selectedFill: number;
        public strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
        public fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
        constructor(options: ISelectedPointOptions) {
            if (options?.stroke) {
                this.selectedStroke = parseColorToUIntArgb(options?.stroke);
            }
            if (options?.fill) {
                this.selectedFill = parseColorToUIntArgb(options?.fill);
            }
            this.selectedPointMarker = { stroke: this.selectedStroke, fill: this.selectedFill };
        }
        public onAttached(parentSeries: IRenderableSeries): void {}
        public onDetached(): void {}
        public overridePointMarkerArgb(
            xValue: number,
            yValue: number,
            index: number,
            opacity?: number,
            metadata?: IPointMetadata
        ): TPointMarkerArgb {
            if (metadata?.isSelected) {
                return this.selectedPointMarker;
            }
            return undefined;
        }
    }
    ```
</CodeSnippetBlock>

For more information on how to style data-points, see the [PaletteProvider Documentation](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

Programmatically Selecting Points
---------------------------------

If you want to select or deselect datapoints in code, you can do this through the **IPointMetadata.isSelected** property. After setting this property don't forget to call **sciChartSurface.invalidateElement()** to force a redraw of the chart!

```ts showLineNumbers
// Create a DataSeries with x,y values and metadata
const dataSeries = new XyDataSeries(wasmContext, {
    xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
    metadata: [
        { isSelected: false }, { isSelected: false }, { isSelected: false },
        { isSelected: false }, { isSelected: false }, { isSelected: false },
        { isSelected: false }, { isSelected: false }, { isSelected: false },
        { isSelected: false }, { isSelected: false }, { isSelected: false }
    ]
});

// Now set isSelected programmatically on some datapoints
dataSeries.getMetadataAt(3).isSelected = true;
dataSeries.getMetadataAt(4).isSelected = true;
```

This code will programmatically set all points to deselected, except for points at index 3 and 4.

:::tip
For more information on how to manipulate PointMetadata, see the [PointMetadata API Documentation](/docs/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview).
:::

#### See Also

* [Series Selection](/docs/2d-charts/chart-modifier-api/selection/series-selection)