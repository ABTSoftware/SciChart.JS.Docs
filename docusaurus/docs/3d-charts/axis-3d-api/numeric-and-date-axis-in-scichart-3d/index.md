---
sidebar_position: 2
---

# Numeric and Date Axis in SciChart3D

SciChart.js 3D features several axis types. All inherit from [AxisBase3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html). The Axis are the logical representation of the XZ, ZY, YX planes in the Axis Cube.

X,Y,Z axis are required to measure the [sciChart3DSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#renderableseries), for instance, an axis is responsible for the transformation between data-values (provided by your code) and world coordinates (X,Y,Z values in 3D Space).

See the article on [Coordinates in 3D Space](/docs/3d-charts/scichart-3d-basics/coordinates-in-3d-space/index.md) to explain the difference between World and Data coordinates and how to define the dimensions of the Axis Cube.

NumericAxis3D
-------------

The [NumericAxis3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis3d.html) is a Value-Axis and is suitable when the data on that axis is numeric (e.g. JavaScript number - 64-bit double precision values).

The API between SciChart.js 2D and 3D is shared, so all properties related to [showing/hiding gridlines](/docs/2d-charts/axis-api/axis-styling/visibility-of-axis-elements/index.md), [formatting labels](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md) or [spacing of labels](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval/index.md) are shared between 2D & 3D charts.

Here's a short example showing how to configure this axis type.

<LiveDocSnippet maxWidth={"100%"} name="./NumericAxis3D/demo" htmlPath="./NumericAxis3D/demo.html" cssPath="./NumericAxis3D/demo.css" />

You will find the code here.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts showLineNumbers file=./NumericAxis3D/demo.ts
```
```html showLineNumbers file=./NumericAxis3D/demo.html
```
```css showLineNumbers file=./NumericAxis3D/demo.css
```
</CodeSnippetBlock>

Date Axis 3D
------------

At the time of writing, there is no date-specific axis in SciChart.js 3D. However, it is still possible to use [NumericAxis3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis3d.html) with date formatting, assuming your data is included as linux timestamps / 1000.

For this to work, the values in the X-direction must be linux timestamps / 1000 (seconds since 01-01-1970). Axis.visibleRange also expects values in this format.

<LiveDocSnippet maxWidth={"100%"} name="./DateAxis3D/demo" htmlPath="./DateAxis3D/demo.html" cssPath="./DateAxis3D/demo.css" />

You will find the code here.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts showLineNumbers file=./DateAxis3D/demo.ts
```
```html showLineNumbers file=./DateAxis3D/demo.html
```
```css showLineNumbers file=./DateAxis3D/demo.css
```
</CodeSnippetBlock>