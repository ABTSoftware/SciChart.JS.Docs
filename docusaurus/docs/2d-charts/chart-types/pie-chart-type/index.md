---
sidebar_position: 50
---

# The Pie Chart Type

In SciChart.js, the [JavaScript Pie Chart](https://demo.scichart.com/javascript-pie-chart) type is represented by the [SciChartPieSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html) type.

The [](https://demo.scichart.com/javascript-pie-chart)[](https://demo.scichart.com/javascript-pie-chart)[JavaScript Pie Chart Example](https://demo.scichart.com/javascript-pie-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/)

_**Above**: The [JavaScript Pie Chart example](https://demo.scichart.com/javascript-pie-chart) from the SciChart.js Demo._

The Pie Chart represents data in a form of circle divided into triangular wedges called segments. A [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) represents a percentage that corresponds to a particular value. This value appears drawn on every segment and can be set in code. A [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) can be selected by clicking either on it or on the corresponding item in the Legend. This action provides a visual feedback on the chart and the Legend.

Create a Pie Chart
------------------

To create a Pie Chart, you have to create a number of [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) instances and add them to the [SciChartPieSurface.pieSegments:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#piesegments) collection.

Each [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) has properties for **value**, **text** and **color**, or alternatively **colorLinearGradient** if you wish to specify a gradient fill. The property **isSelected** denotes whether the [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) is in the selected state or not.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Demonstrates how to create a pie chart with SciChart.js
const {
    SciChartPieSurface,
    EPieType,
    SciChartJsNavyTheme,
    PieSegment,
    ELegendPlacement,
    ELegendOrientation,
    GradientParams,
    Point
} = SciChart;

// or, for npm, import { SciChartPieSurface, ... } from "scichart"
// Create the pie chart
const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    pieType: EPieType.Pie,
    animate: true
});

// Additional legend options
sciChartPieSurface.legend.showLegend = true;
sciChartPieSurface.legend.showCheckboxes = true;
sciChartPieSurface.legend.animate = true;
sciChartPieSurface.legend.placement = ELegendPlacement.TopRight;
sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;

// Create pie segments with value, colour and text
const pieSegment1 = new PieSegment({
    color: "#228B22",
    value: 40,
    text: "Green",
    colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
        { color: "#1D976C", offset: 0 },
        { color: "#93F9B9", offset: 1 }
    \])
});
const pieSegment2 = new PieSegment({
    value: 10,
    text: "Red",
    colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
        { color: "#DD5E89", offset: 0 },
        { color: "#F7BB97", offset: 1 }
    \])
});
const pieSegment3 = new PieSegment({
    value: 20,
    text: "Blue",
    colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
        { color: "#1FA2FF", offset: 0 },
        { color: "#12D8FA", offset: 0.5 },
        { color: "#A6FFCB", offset: 1 }
    \])
});
const pieSegment4 = new PieSegment({
    value: 15,
    text: "Yellow",
    colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
        { color: "#F09819", offset: 0 },
        { color: "#EDDE5D", offset: 1 }
    \])
});
sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
```

```ts
// Demonstrates how to create a pie chart with SciChart.js using the Builder API
const { chartBuilder, ESciChartSurfaceType, ESeriesType, EThemeProviderType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const sciChartPieChart = await chartBuilder.buildChart(divElementId, {
    type: ESciChartSurfaceType.Pie2D,
    options: {
        surface: { theme: { type: EThemeProviderType.Dark } },
        segments: \[
            { text: "This", value: 10, color: "red" },
            { text: "That", value: 5, color: "blue" },
            { text: "Other", value: 7, color: "green" }
        \]
    }
});

// Alternative API
const pieChart = await chartBuilder.buildPieChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    segments: \[
        { text: "This", value: 10, color: "red" },
        { text: "That", value: 5, color: "blue" },
        { text: "Other", value: 7, color: "green" }
    \]
});
```

This results in the following output: 

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function simplePieChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a pie chart with SciChart.js
    const {
        SciChartPieSurface,
        EPieType,
        SciChartJsNavyTheme,
        PieSegment,
        ELegendPlacement,
        ELegendOrientation,
        GradientParams,
        Point
    } = SciChart;

    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Pie,
        animate: true
    });

    // Additional legend options
    sciChartPieSurface.legend.showLegend = true;
    sciChartPieSurface.legend.showCheckboxes = true;
    sciChartPieSurface.legend.animate = true;
    sciChartPieSurface.legend.placement = ELegendPlacement.TopRight;
    sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;

    // Create pie segments with value, colour and text
    const pieSegment1 = new PieSegment({
        color: "#228B22",
        value: 40,
        text: "Green",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
            { color: "#1D976C", offset: 0 },
            { color: "#93F9B9", offset: 1 }
        \])
    });
    const pieSegment2 = new PieSegment({
        value: 10,
        text: "Red",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
            { color: "#DD5E89", offset: 0 },
            { color: "#F7BB97", offset: 1 }
        \])
    });
    const pieSegment3 = new PieSegment({
        value: 20,
        text: "Blue",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
            { color: "#1FA2FF", offset: 0 },
            { color: "#12D8FA", offset: 0.5 },
            { color: "#A6FFCB", offset: 1 }
        \])
    });
    const pieSegment4 = new PieSegment({
        value: 15,
        text: "Yellow",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
            { color: "#F09819", offset: 0 },
            { color: "#EDDE5D", offset: 1 }
        \])
    });
    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
    // #endregion
}

simplePieChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a pie chart with SciChart.js using the Builder API
    const { chartBuilder, ESciChartSurfaceType, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const sciChartPieChart = await chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Pie2D,
        options: {
            surface: { theme: { type: EThemeProviderType.Dark } },
            segments: \[
                { text: "This", value: 10, color: "red" },
                { text: "That", value: 5, color: "blue" },
                { text: "Other", value: 7, color: "green" }
            \]
        }
    });

    // Alternative API
    const pieChart = await chartBuilder.buildPieChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        segments: \[
            { text: "This", value: 10, color: "red" },
            { text: "That", value: 5, color: "blue" },
            { text: "Other", value: 7, color: "green" }
        \]
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Dynamically Updating a Pie Chart
--------------------------------

Pie Charts can be dynamically updated by setting the PieSegment.value property. When SciChartPieSurface.animate is true, updates to the pie chart will be animated.

Try this code below:

*   [Javascript](#i-tab-content-JS)

```ts
// Create a Pie Chart
const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    pieType: EPieType.Pie,
    animate: true,
    animationFrames: 30
});

// Disable the legend for this example
sciChartPieSurface.legend.showLegend = false;

// Create pie segments and add to the chart
const pieSegment1 = new PieSegment({
    color: "#F48420",
    value: 5
});
const pieSegment2 = new PieSegment({
    color: "#30BC9A",
    value: 10
});
const pieSegment3 = new PieSegment({
    color: "#EC0F6C",
    value: 15
});
const pieSegment4 = new PieSegment({
    color: "#50C7E0",
    value: 20
});
sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);

// Dynamically update the pie segments
const updateFunc = () => {
    pieSegment1.value = Math.random() \* 20 + 10;
    pieSegment2.value = Math.random() \* 20 + 10;
    pieSegment3.value = Math.random() \* 20 + 10;
    pieSegment4.value = Math.random() \* 20 + 10;
    setTimeout(() => updateFunc(), 1500);
};

setTimeout(updateFunc, 1000);
```

This results in the following output:

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function updatingPieChart(divElementId) {
    // Demonstrates how to create a pie chart with SciChart.js
    const { SciChartPieSurface, EPieType, SciChartJsNavyTheme, PieSegment } = SciChart;

    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    // #region ExampleA
    // Create a Pie Chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Pie,
        animate: true,
        animationFrames: 30
    });

    // Disable the legend for this example
    sciChartPieSurface.legend.showLegend = false;

    // Create pie segments and add to the chart
    const pieSegment1 = new PieSegment({
        color: "#F48420",
        value: 5
    });
    const pieSegment2 = new PieSegment({
        color: "#30BC9A",
        value: 10
    });
    const pieSegment3 = new PieSegment({
        color: "#EC0F6C",
        value: 15
    });
    const pieSegment4 = new PieSegment({
        color: "#50C7E0",
        value: 20
    });
    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);

    // Dynamically update the pie segments
    const updateFunc = () => {
        pieSegment1.value = Math.random() \* 20 + 10;
        pieSegment2.value = Math.random() \* 20 + 10;
        pieSegment3.value = Math.random() \* 20 + 10;
        pieSegment4.value = Math.random() \* 20 + 10;
        setTimeout(() => updateFunc(), 1500);
    };

    setTimeout(updateFunc, 1000);
    // #endregion
}

updatingPieChart("scichart-root");
```

Formatting Pie Chart Labels
---------------------------

Several options for formatting Pie Chart labels are possible with SciChart.js.

*   Set **SciChartPieSurface.seriesSpacing** to put a padding in between pie segments.
*   Set **SciChartPieSurface.labelStyle** to set a global label font size, color and family
*   Override **SciChartPieSurface.labelProvider.getSegmentText** to set a general label text override
*   Set **PieSegment.labelOffset** to move labels further away from the pie segment.
*   Set **PieSegment.labelStyle** to set individual pie segment font and color
*   Set **PieSegment.radiusAdjustment** to make the pie segment larger or smaller.
*   LabelProviders are also available on individual **PieSegment.labelProvider** property

Below, an example combines several of these techniques:

*   [Javascript](#i-tab-content-JS)

```ts
// Create a Pie Chart
const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    pieType: EPieType.Pie,
    animate: true,
    seriesSpacing: 5
});
// Set this to adjust the radial position of the labels
// When positioning outside the pie, you may want to make further fine adjustments to label positions using the labelOffset as shown below
sciChartPieSurface.labelRadiusAdjustment = 1.7;

// set default label style
sciChartPieSurface.labelStyle = { fontSize: 14, color: "White" };

// labelProvider on the surface will be used if an override is not set on a segment
sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
    \`<span>${segment.text}<span><br/><span>${segment.value.toFixed(0)} (${((100 \* segment.value) / total).toFixed(
        1
    )}%)</span>\`;
const pieSegment1 = new PieSegment({
    color: "#F48420",
    value: 40,
    text: "Oranges",
    radiusAdjustment: 1.05,
    labelOffset: new Point(10, 0),
    // labelStyles can be overridden per segment.
    // These will be merged onto the surface style so the resulting style here is fontSize: 14, color: "#f8f682"
    labelStyle: { color: "#F48420" }
});

const pieSegment2 = new PieSegment({
    color: "#30BC9A",
    value: 10,
    text: "Apples",
    radiusAdjustment: 1.1,
    labelOffset: new Point(0, -20)
});
// If you set a property on the segment labelProvider, it will override the one on the surface
pieSegment2.labelProvider.getSegmentText = (segment, total) => "Some Apples";

// You can also pass labelProvider options in on the constructor.
const pieSegment3 = new PieSegment({
    color: "#EC0F6C",
    value: 20,
    text: "Strawberries",
    labelProvider: new PieLabelProvider({ labelPrefix: "Strawberries: " }),
    labelOffset: new Point(-25, 0),
    labelStyle: { color: "#EC0F6C" }
});

const pieSegment4 = new PieSegment({
    color: "#50C7E0",
    value: 15,
    text: "Grapes"
});
// Overriding a property on the segment labelProvider implicitly creates a new default PieLabelProvider that overries the one set on the surface
pieSegment4.labelProvider.formatLabel = dataValue => dataValue.toFixed(2) + "%";

sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
```

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function formatPieChart(divElementId) {
    // Demonstrates how to create a pie chart with SciChart.js
    const { SciChartPieSurface, Point, SciChartJsNavyTheme, PieSegment, PieLabelProvider, EPieType } = SciChart;

    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    // #region ExampleA
    // Create a Pie Chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 5
    });
    // Set this to adjust the radial position of the labels
    // When positioning outside the pie, you may want to make further fine adjustments to label positions using the labelOffset as shown below
    sciChartPieSurface.labelRadiusAdjustment = 1.7;

    // set default label style
    sciChartPieSurface.labelStyle = { fontSize: 14, color: "White" };

    // labelProvider on the surface will be used if an override is not set on a segment
    sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
        \`<span>${segment.text}<span><br/><span>${segment.value.toFixed(0)} (${((100 \* segment.value) / total).toFixed(
            1
        )}%)</span>\`;

    const pieSegment1 = new PieSegment({
        color: "#F48420",
        value: 40,
        text: "Oranges",
        radiusAdjustment: 1.05,
        labelOffset: new Point(10, 0),
        // labelStyles can be overridden per segment.
        // These will be merged onto the surface style so the resulting style here is fontSize: 14, color: "#f8f682"
        labelStyle: { color: "#F48420" }
    });

    const pieSegment2 = new PieSegment({
        color: "#30BC9A",
        value: 10,
        text: "Apples",
        radiusAdjustment: 1.1,
        labelOffset: new Point(0, -20)
    });
    // If you set a property on the segment labelProvider, it will override the one on the surface
    pieSegment2.labelProvider.getSegmentText = (segment, total) => "Some Apples";

    // You can also pass labelProvider options in on the constructor.
    const pieSegment3 = new PieSegment({
        color: "#EC0F6C",
        value: 20,
        text: "Strawberries",
        labelProvider: new PieLabelProvider({ labelPrefix: "Strawberries: " }),
        labelOffset: new Point(-25, 0),
        labelStyle: { color: "#EC0F6C" }
    });

    const pieSegment4 = new PieSegment({
        color: "#50C7E0",
        value: 15,
        text: "Grapes"
    });
    // Overriding a property on the segment labelProvider implicitly creates a new default PieLabelProvider that overries the one set on the surface
    pieSegment4.labelProvider.formatLabel = dataValue => dataValue.toFixed(2) + "%";

    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
    // #endregion
}

formatPieChart("scichart-root");
```