---
sidebar_position: 3
---

# Axis3D Text (Label) Formatting

Axis 3D Label Formatting obeys the same rules as SciChart 2D.

Each axis has a [labelProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/axisbase3d.html#labelprovider) property, which allows you to attach pre-built classes to format numbers, dates, as well as create your own.

Background reading: Read the [Axis LabelProvider API Overview](/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md) to learn more about this powerful API

## Simple examples of formatting Labels

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

## Date Formatting

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

## Custom Label Formatting Rules

Using the labelProvider API, more complex rules can be created to format axis labels in SciChart.js 3D.

Below we've adapted the example from [2D Charts - Custom LabelProviders: Readable Numbers](/2d-charts/axis-api/axis-labels/custom-label-providers-readable-numbers/index.md) to apply it to a 3D axis.

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

## Custom Fonts in Labels and Titles in 3D Charts

To assign custom font to labels and titles in SciChart.js 3D charts, you can use the labelStyle and axisTitleStyle properties on your 3D axes.

Only Arial is included in the webassembly data as standard. Other fonts must either be hosted on your server, or registered if coming from a remote location. In either case, fonts are only downloaded once, and are then cached in the browser (in indexdb).

Use `sciChartSurface.registerFont` to provide a remote url to load a font file from.  Note that this requires a sciChartSurface instance - it is not a static method.  The method returns a promise which resolves once the file is downloaded.  If you do not await this method, the text will render using Arial until the font is available.  There is a timeout (set by SciChartDefaults.nativeFontTimeout, default 2000ms) after which SciChart will fall back to Arial and stop trying to load the custom font.  You might need to increase this if you need to load fonts over a slow connection, but in general it is better to await the registerFont method.

:::warning
There is currently a limitation in that the font fetching from webassembly will not follow a http 302 redirection, so you need to pass the url to the actual file.  For instance, when downloading from github, [https://github.com/google/fonts/blob/main/ofl/braahone/BraahOne-Regular.ttf](https://github.com/google/fonts/blob/main/ofl/braahone/BraahOne-Regular.ttf) redirects to [https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf](https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf) so you need to use the githubusercontent.com link.
:::

<LiveDocSnippet maxWidth={"100%"} name="./CustomFont/demo" />

```ts {3} showLineNumbers file=./CustomFont/demo.ts start=region_A_start end=region_A_end

```

### Registering multiple fonts

    Here is how to register multiple fonts:

```ts
// Registering multiple fonts

const fonts = [
    { name: "arial", url: "" },
    {
        name: "braahone",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf"
    },
    {
        name: "iceland",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/iceland/Iceland-Regular.ttf"
    },
    { name: "antic", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/antic/Antic-Regular.ttf" },
    { name: "coda", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/coda/Coda-Regular.ttf" },
    { name: "forum", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/forum/Forum-Regular.ttf" },
    { name: "freeman", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/freeman/Freeman-Regular.ttf" },
    { name: "geo", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/geo/Geo-Regular.ttf" }
];

// Register all fonts from "fonts" array in parallel
await Promise.all(fonts.map(font => sciChart3DSurface.registerFont(font.name, font.url)));
```
