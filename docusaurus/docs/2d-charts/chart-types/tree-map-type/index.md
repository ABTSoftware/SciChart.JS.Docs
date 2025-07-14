---
sidebar_position: 34
---

# The Treemap Chart Type

Treemap Charts can be within with SciChart.js by using our [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) series type, with the added calculations of the: position / size / coloring of each rectangle to create a treemap-like appearance.

:::tip
The [JavaScript Treemap Chart Example](https://scichart.com/demo/javascript-treemap-chart) can be found in the [SciChart.Js Examples Suite > Treemap Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/release_v4.0/Examples/src/components/Examples/Charts2D/BasicChartTypes/TreemapChart) on Github
::: 

<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demo/iframe/treemap-chart"
    title="Treemap Chart"
/>

This demo creates an interactive treemap chart visualization to display stock market data where companies are represented as rectangles sized by their market value and colored by their performance percentage.

## Data Structure and Types

The code defines several TypeScript interfaces to structure the treemap data:

```ts
type TTreemapDataItem = {
    name: string;           // Company name
    shortName?: string;     // Abbreviated name (e.g., "AAPL")
    parent: string;         // Parent category
    value: number;          // Market value in billions
    progress?: number;      // Percentage gain/loss
};
```

The raw data contains technology companies with their market values and performance metrics, organized hierarchically under a "Technology" parent category.

## Color Management with Palette Provider

The StockTreemapPaletteProvider class implements dynamic coloring based on stock performance:

- Green shades for positive performance (gains)
- Red shades for negative performance (losses)
- Gray for neutral (0% change)

The color intensity corresponds to the magnitude of the percentage change, with interpolation between gray and the target color based on the performance relative to the min/max values in the dataset.

## Dynamic Label Display
The TreemapDataLabelProvider creates adaptive text labels that show different levels of detail based on rectangle size:

- Large rectangles: Full company name + percentage change
- Medium rectangles: Short name + percentage change
- Small rectangles: Just the first letter of the name
- Tiny rectangles: No label at all

This prevents text overcrowding while maximizing information display.

## D3.js Integration for Layout

The code uses D3.js's hierarchical layout algorithms to calculate rectangle positions and sizes:

```ts
...
import { stratify, treemap } from "d3-hierarchy";
...
function prepareDataUsingD3External(data: TTreemapDataItem[]): RectangluarNode[] {
    const root = stratify()
        .id((d) => (d as TTreemapDataItem).name)
        .parentId((d) => (d as TTreemapDataItem).parent)(data);
    
    root.sum((d) => +(d as TTreemapDataItem).value);
    treemap().size([WIDTH, HEIGHT]).padding(0.1)(root);
    
    return root.leaves() as unknown as RectangluarNode[];
}
```
This transforms the flat data structure into a hierarchical tree and calculates optimal rectangle dimensions using D3's treemap algorithm.

## Chart Configuration and Rendering

The main drawExample function sets up the SciChart surface with:

- Hidden axes (since treemaps don't need traditional x/y axes)
- [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) for high-performance rectangle rendering
- Interactive modifiers for zooming and panning

The chart uses [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxydataseries.html) to define rectangles with start/end coordinates for both X and Y dimensions, along with metadata for each company's information.

## Interactive Features
The visualization includes several user interaction capabilities:

- Mouse wheel zoom for detailed examination
- Pan functionality to navigate large datasets
- Zoom to extents to reset the view
- Dynamic label scaling that adapts as users zoom in/out

This creates a comprehensive financial data visualization tool that effectively communicates both company size (through rectangle area) and performance (through color coding) in an intuitive, interactive format.