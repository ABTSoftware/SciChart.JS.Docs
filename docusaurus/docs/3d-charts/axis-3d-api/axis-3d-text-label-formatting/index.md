---
sidebar_position: 3
---

# ✅ Axis3D Text (Label) Formatting

Axis 3D Label Formatting obeys the same rules as SciChart 2D.

Each axis has a [labelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#labelprovider) property, which allows you to attach pre-built classes to format numbers, dates, as well as create your own.

Background reading: Read the [Axis LabelProvider API Overview](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md) to learn more about this powerful API

Simple examples of formatting Labels
------------------------------------

Axis can have simple label formatting via constructor options. Things like setting the **number of decimal places**, **prefix** and **postfix**, and **scientific notation** can be achieved by just setting some properties.

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


Date Formatting
---------------

There is no date axis in SciChart.js 3D, however it is possible to achieve date or time formatting using labelProviders. Take a look at this quick example:

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


Custom Label Formatting Rules
-----------------------------

Using the labelProvider API, more complex rules can be created to format axis labels in SciChart.js 3D.

Below we've adapted the example from [2D Charts - Custom LabelProviders: Readable Numbers](/docs/2d-charts/axis-api/axis-labels/custom-label-providers-readable-numbers/index.md) to apply it to a 3D axis.

First, delcare the custom LabelProvider class by inheriting one of the available base types in SciChart.js.

<CodeSnippetBlock labels={["TS"]}>
```ts {3} showLineNumbers file=./LabelProviderNumeric3D/demo.ts start=region_A_start end=region_A_end
```
</CodeSnippetBlock>

Next, we create a chart and attach it to chart axis.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {3} showLineNumbers file=./LabelProviderNumeric3D/demo.ts start=region_B_start end=region_B_end
```
```html showLineNumbers file=./LabelProviderNumeric3D/demo.html
```
```css showLineNumbers file=./LabelProviderNumeric3D/demo.css
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./LabelProviderNumeric3D/demo" htmlPath="./LabelProviderNumeric3D/demo.html" cssPath="./LabelProviderNumeric3D/demo.css" />