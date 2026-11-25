---
sidebar_position: 90
sidebar_label: Correlation Matrix
title: "Correlation Matrix: What It Is & How to Read One (Interactive Example)"
description: "What a correlation matrix is, how to read one as a heatmap, a worked example, Pearson vs Spearman vs Kendall, significance, pair plots and the mistakes to avoid. With a live example."
keywords:
    [
        "correlation matrix",
        "correlation plot",
        "correlation heatmap",
        "correlation matrix heatmap",
        "what is a correlation matrix",
        "how to read a correlation matrix",
        "how to interpret a correlation matrix",
        "correlation matrix example",
        "scatter plot matrix",
        "pair plot",
        "correlogram",
        "pearson vs spearman correlation",
        "correlation matrix multicollinearity"
    ]
image: /img/learn/correlation-matrix-og.png
related: [heatmap, scatter-plot, bubble-chart, parallel-coordinates-plot]
datePublished: 2026-11-20
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a correlation matrix tell you?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A correlation matrix tells you, for every pair of variables in a dataset, how strongly and in which direction they move together in a straight line. Values near +1 mean both rise together, values near -1 mean one falls as the other rises, and values near 0 mean no linear link. It does not tell you why they move together, or about curved relationships." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a correlation matrix?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Find the cell where the row of one variable meets the column of the other and read its coefficient. Ignore the diagonal, which is always 1, and read only one triangle, because the other is its mirror image. On a heatmap, the hue shows the direction (positive or negative) and the depth of colour shows the strength. Check the sample size before trusting moderate values." }
                },
                {
                    "@type": "Question",
                    "name": "What is a good correlation value?",
                    "acceptedAnswer": { "@type": "Answer", "text": "There is no universal cut-off; it depends on the field and the sample size. A widely used convention from Cohen treats an r of about 0.1 as small, 0.3 as medium and 0.5 as large. In engineering and physical measurement, values above 0.9 are common, while in social science 0.3 can be important. Always check that the value is statistically significant for your sample size." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a correlation matrix and a covariance matrix?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A covariance matrix holds the covariance of every pair of variables, in the variables' own units, so its values depend on scale. A correlation matrix divides each covariance by the two standard deviations, so every value lies between -1 and 1 and the diagonal is 1. A correlation matrix is the covariance matrix of the standardised variables." }
                },
                {
                    "@type": "Question",
                    "name": "What is a correlation plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A correlation plot is any chart that shows correlations. Most often it means a correlation matrix drawn as a heatmap, sometimes with circles, ellipses or numbers in the cells (also called a corrgram or correlogram). It can also mean a scatter plot matrix (pair plot), or, in time-series analysis, a plot of autocorrelation against lag." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a correlation matrix in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute Pearson's r for every pair of columns in plain JavaScript (or Spearman's rho, which is Pearson's r of the ranks), giving an n by n array. Then draw it with SciChart.js as a UniformHeatmapRenderableSeries with a diverging HeatmapColorMap from -1 to 1, data labels for the values, and a HeatmapLegend. In React or Angular, the scichart-react and scichart-angular packages run the same chart code." }
                }
            ]
        })}
    </script>
</head>

# Correlation Matrix

## What is a correlation matrix?

A **correlation matrix** is a square table that shows the correlation coefficient between every pair of variables in a dataset. Each variable gets a row and a column, and the cell where they meet holds a value from −1 to +1. Drawn as a colour-coded grid, it is also called a **correlation heatmap** or correlation plot.

![A correlation matrix heatmap of eight pump readings, from load and flow to humidity and efficiency, with each coefficient printed in its cell on a blue-to-red scale, beside a scatter plot of load against efficiency that shows an arch-shaped relationship with a correlation near zero, in a dark navy theme](/img/learn/correlation-matrix-og.png)

*A correlation matrix of eight readings from a pump (sample data), red for positive and blue for negative, with the scatter plot behind one cell: load against efficiency, strongly related but with r close to 0. [Try the interactive version](#how-to-create-a-correlation-matrix-in-javascript-react-or-angular).*

:::tip Key takeaways
- A correlation matrix holds one coefficient for every pair of variables. It is symmetric, and its diagonal is always 1.
- Read one triangle only, on a diverging colour scale centred on 0, so the colour shows both direction and strength.
- Pearson's r measures straight-line relationships; Spearman's ρ and Kendall's τ measure any steadily rising or falling one.
- With few observations, moderate values can appear by chance, so check them against the sample size.
- A value near 0 doesn't mean "unrelated", and a high value doesn't mean "causes". Look at the scatter plot behind any cell you act on.
:::

## What the correlation coefficient measures

Every cell of the matrix is a **correlation coefficient**: one number that summarises a [scatter plot](/learn/chart-types/cartesian/scatter-plot/) of two variables. The usual one is Pearson's product-moment correlation, r:

$$
r = \frac{\sum_i (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_i (x_i - \bar{x})^2 \; \sum_i (y_i - \bar{y})^2}}
$$

The top line adds up, for each observation, how far x and y are from their means, multiplied together. It is positive when high x tends to come with high y. The bottom line scales the result so that it can't go beyond ±1, whatever the units.

| r | Meaning | On a scatter plot |
| --- | --- | --- |
| +1 | Perfect positive linear relationship | All points on a rising straight line |
| About +0.7 | Strong positive | A clear rising band |
| About +0.3 | Weak to moderate positive (Cohen calls 0.3 medium) | A loose cloud with a slight upward tilt |
| 0 | No linear relationship | No straight-line trend (there may still be a curve) |
| −0.7 to −1 | Strong to perfect negative | A falling band or line |

The sign gives the direction. The size gives how tightly the points hug a straight line, not how steep the line is: two variables can have r = 0.95 with a shallow slope or a steep one.

## How to read a correlation matrix

Read a correlation matrix one cell at a time: the cell where a row meets a column holds the correlation between those two variables, and its colour shows the sign and strength.

![A four by four correlation matrix of pump readings (load, flow, pressure and ambient temperature) on a blue to red scale. Callout 1 marks the diagonal of ones, callout 2 one cell, Pressure against Flow at minus 0.82, callout 3 the faded upper triangle that mirrors the lower one, and callout 4 the colour bar from minus 1 to plus 1 centred on 0](./correlation-matrix-anatomy.svg)

1. Find the variables. Each row and each column is one variable, in the same order along both edges.
2. Skip the diagonal. Every variable correlates perfectly with itself, so the diagonal is all 1s.
3. Read one triangle. The correlation of A with B equals the correlation of B with A, so the matrix is **symmetric**: the upper triangle mirrors the lower one. Many tools show only the lower triangle for this reason.
4. Read the colour scale. A correlation heatmap should use a diverging scale centred on 0: one hue for positive values, another for negative, fading to a neutral colour at 0. The [heatmap guide](/learn/chart-types/cartesian/heatmap/) covers colour scales in general.
5. Look for blocks. Groups of variables that correlate strongly with each other form squares of strong colour, especially once the variables are [reordered](#ordering-and-clustering-the-variables).
6. Then read the numbers. Colour shows the pattern; the printed value or a tooltip gives the exact coefficient.

For n variables, there are n(n − 1)/2 distinct pairs: 28 for 8 variables, 190 for 20. A matrix is the only practical way to compare that many pairs at once.

## Correlation matrix example

Here are ten readings from a pump, with four variables. This is simulated sample data.

| Reading | Load (%) | Flow (L/min) | Pressure (bar) | Ambient (°C) |
| --- | --- | --- | --- | --- |
| 1 | 20 | 68 | 6.84 | 21.5 |
| 2 | 77 | 177 | 5.04 | 26.0 |
| 3 | 50 | 161 | 5.76 | 25.8 |
| 4 | 61 | 174 | 5.30 | 24.3 |
| 5 | 47 | 168 | 5.80 | 17.8 |
| 6 | 40 | 89 | 7.11 | 19.0 |
| 7 | 71 | 202 | 5.72 | 12.5 |
| 8 | 20 | 55 | 6.02 | 22.6 |
| 9 | 71 | 190 | 5.62 | 24.0 |
| 10 | 77 | 246 | 4.60 | 27.8 |

For load and flow, the means are 53.4% and 153 L/min. The sum of the products of the deviations is 11,281, and the sums of the squared deviations are 4,254.4 and 34,650. So

$$
r = \frac{11{,}281}{\sqrt{4{,}254.4 \times 34{,}650}} = \frac{11{,}281}{12{,}141} \approx 0.93
$$

Doing the same for all six pairs gives the matrix (lower triangle only):

|  | Load | Flow | Pressure | Ambient |
| --- | --- | --- | --- | --- |
| Load | 1 |  |  |  |
| Flow | 0.93 | 1 |  |  |
| Pressure | −0.77 | −0.82 | 1 |  |
| Ambient | 0.19 | 0.17 | −0.48 | 1 |

A description of it might read: "Flow rises closely with load (r = 0.93). Pressure falls as flow rises (r = −0.82), as expected from the pump's curve. Ambient temperature shows no clear link to the others." The −0.48 between pressure and ambient temperature looks moderate, but with 10 readings it is [not statistically significant](#significance-and-sample-size). With 1,000 readings from the same simulated pump, it shrinks to about −0.1.

A template for each finding: "*A* and *B* are [strongly / moderately / weakly] [positively / negatively] correlated (r = …, n = …, p …)."

## Pearson vs Spearman vs Kendall correlation

Pearson's r is one of several coefficients a correlation matrix can hold. The two common alternatives work on **ranks**: each value is replaced by its position from smallest to largest. They measure whether the relationship always goes the same way (whether it is **monotonic**), not whether it is straight.

| Coefficient | Measures | Use it when… | Sensitive to outliers? |
| --- | --- | --- | --- |
| Pearson's r | Straight-line relationship between the values | Both variables are numeric and the scatter plot is roughly linear, without extreme points | Yes, strongly |
| Spearman's ρ (rho) | Monotonic relationship: Pearson's r of the ranks | The relationship is curved but always rising or falling, the data are ordinal (ratings, rankings), or there are outliers | Much less |
| Kendall's τ (tau) | Monotonic relationship, from the share of pairs of observations that are in the same order on both variables | Small samples or many tied values, or when you want to say how much more often pairs agree than disagree | Much less |

For the same data, Kendall's τ is usually smaller than Spearman's ρ. They are different scales, so compare like with like. Computing both Pearson and Spearman is a quick check. When they disagree, the scatter plot is curved or has outliers. In the pump data, vibration rises exponentially with load, so at 1,000 readings Spearman's ρ (0.96) is higher than Pearson's r (0.83).

## Significance and sample size

A correlation computed from a sample is an estimate, and with few observations it is noisy. The table gives the smallest absolute value of Pearson's r that is statistically significant at the 5% level (two-sided), by sample size n:

| n | 10 | 20 | 30 | 50 | 100 | 1,000 |
| --- | --- | --- | --- | --- | --- | --- |
| Smallest significant \|r\| | 0.63 | 0.44 | 0.36 | 0.28 | 0.20 | 0.06 |

Read it both ways:

- With small samples, quite large coefficients can be chance. In the simulated pump data, pairs that are close to 0 over 1,000 readings drift as far as ±0.4 in a sample of 20.
- With large samples, tiny coefficients are "significant" but may not matter. At n = 1,000, r = 0.07 passes the test while explaining less than 1% of the variation ($r^2 \approx 0.005$).

A matrix also runs many tests at once: 28 pairs for 8 variables. At the 5% level, about 1 in 20 unrelated pairs will look significant by chance. When you are hunting for links rather than checking one you expected, a corrected threshold is safer, such as Bonferroni's, which divides 5% by the number of pairs.

## Correlation matrix vs pair plot vs correlogram

A correlation matrix compresses each scatter plot to one number. Other charts keep more of the picture:

| Chart | Shows | Best for | Limit |
| --- | --- | --- | --- |
| Correlation heatmap | One coefficient per pair, as colour and usually a number | Scanning many variables at once, finding blocks | Hides shape: curves, outliers and clusters |
| Pair plot (scatter plot matrix) | The full scatter plot of every pair, in a grid, often with histograms on the diagonal | Up to about 6 to 10 variables; checking shapes and outliers | Unreadable with many variables or millions of points |
| Corrgram (correlogram) | The matrix drawn with shaded squares, circles, pies or ellipses whose size or shape shows r, often reordered | Presentations; seeing strength at a glance | Needs a legend; the same limits as a heatmap |
| [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) | One pair in full | Confirming one relationship | One pair at a time |
| [Parallel coordinates plot](/learn/chart-types/complex/parallel-coordinates-plot/) | Every observation as a line across all variables | Following individual observations across many variables | Depends on axis order; crossing lines show negative links |
| [Bubble chart](/learn/chart-types/cartesian/bubble-chart/) | Three numeric variables (x, y and size) | A relationship plus a third measure | Not for many pairs |

In practice, use the heatmap to find the interesting pairs, then open each one as a scatter plot.

The word correlogram has a second meaning. In time-series analysis, it is a plot of a signal's [autocorrelation](/learn/applications/signal-processing/autocorrelation/) against the time lag, a different chart.

## Ordering and clustering the variables

The order of the rows and columns doesn't change any value, but it changes what you can see. Alphabetical or collection order scatters related variables across the matrix. Reordering them so that strongly correlated variables sit next to each other turns the matrix into visible blocks.

Common orderings:

- Hierarchical clustering. Treat 1 − |r| as a distance, cluster the variables, and use the order of the leaves of the tree. Using |r| puts strong negative correlations next to each other too. The demo uses average-linkage clustering.
- Principal components. Sort the variables by the angle of their loadings on the first two principal components, as in Friendly's corrgrams.
- Domain order. Keep a natural order, such as process steps or sensor positions, when readers expect it.

In the pump data, clustering puts the load group (load, flow, vibration, pressure) and the thermal group (ambient temperature, oil temperature, humidity) into two blocks, with efficiency apart.

## Correlation vs causation

A correlation matrix shows which variables move together. It can't show why. Two variables can be correlated because:

- one causes the other;
- both are driven by a third variable (a **confounder**): in the pump data, flow and vibration correlate strongly, but both are driven by load;
- the sample was selected in a way that links them;
- of chance, especially with small samples and many pairs.

To argue causation, you need a mechanism, the right time order, and ideally an experiment that changes one variable and holds the others still. A **partial correlation**, the correlation of two variables after removing the linear effect of others, can help separate a direct link from a shared driver.

## Using a correlation matrix to check multicollinearity

**Multicollinearity** means that two or more input variables in a regression model are strongly correlated. The model can still predict well, but its individual coefficients become unstable and hard to interpret: small changes in the data swing weight from one variable to its correlated partner.

A correlation matrix of the inputs is the first check, and pairs with |r| above about 0.8 are a warning. It isn't the whole check, because three or more variables can be collinear together without any single pair standing out. The **variance inflation factor** (VIF) catches that: each variable's VIF is the matching diagonal entry of the inverse of the correlation matrix. A VIF above about 4 calls for a closer look, and one above 10 is a sign of serious multicollinearity (conventions differ).

The same matrix is used for feature selection in machine learning: of two inputs that correlate at 0.95, one usually adds little.

## Where correlation matrices are used

Correlation matrices are used wherever many measurements are taken together and you need to know which of them move together.

- Engineering and test data: finding which measurements move together on a production line or test rig. In semiconductor test, correlating parametric measurements across wafers and lots shows which tests are redundant and which process steps drive a yield loss (see [big-data visualisation for semiconductors](https://www.scichart.com/semiconductors-big-data-visualization/)).
- Sensor and condition monitoring: checking that redundant sensors agree, and spotting a sensor whose correlation with its neighbours breaks down.
- Finance: the correlation of asset returns drives portfolio diversification and risk models.
- Data science: exploring a new dataset, and checking inputs before modelling.
- Survey research and psychology: checking that questions meant to measure the same thing correlate, and those meant to differ don't.
- Genomics: gene co-expression matrices with thousands of rows, where clustering reveals groups of genes that act together.

## Common correlation matrix mistakes

Most correlation matrix mistakes come from trusting a single number: Pearson's r can be driven by one outlier, miss a curve, or reflect chance in a small sample.

![Four scatter plots with their Pearson r and Spearman rho. A straight-line trend: r 0.86, rho 0.86. A shapeless cluster with one far-off point: r 0.72 but rho 0.02. An arch that rises then falls: r minus 0.12, rho minus 0.16. A steep curve that always rises: r 0.77, rho 0.98](./correlation-coefficient-pitfalls.svg)

- **Using a sequential colour scale.** A scale from light to dark, or a rainbow, makes −0.8 and +0.8 look unrelated, or makes 0 look like a midpoint of interest. Use a diverging scale with 0 at the neutral colour, fixed from −1 to +1, so colours mean the same thing in every matrix.
- **Reading the redundant triangle twice.** Counting both A–B and B–A doubles every finding. Show or read the lower triangle only.
- **Letting one outlier drive r.** A single extreme point can create a strong Pearson correlation in a shapeless cloud, or hide a real one. In the [live demo](#how-to-create-a-correlation-matrix-in-javascript-react-or-angular), set the sample size to 50 and tick Add an outlier: one faulty reading lifts ambient temperature against vibration from 0.15 to 0.58, while Spearman's ρ only moves from 0.09 to 0.15.
- **Reading r ≈ 0 as "no relationship".** Pearson's r only detects straight lines. In the pump data, efficiency depends strongly on load (it peaks at mid load), yet r is about 0. Spearman's ρ misses it too, because the curve rises then falls.
- **Ignoring sample size.** With 15 observations, any value between about −0.5 and +0.5 could be chance. State n with every matrix.
- **Mixing pairwise and listwise data.** When values are missing, computing each pair from whichever rows it has (pairwise deletion) uses different observations for different cells. The result may not be a valid correlation matrix, which breaks later steps such as regression or principal components.
- **Correlating things that are built from each other.** A total against one of its parts, or a ratio against its own denominator, correlates by construction.
- **Treating correlation as causation.** See [correlation vs causation](#correlation-vs-causation).

## How to create a correlation matrix in JavaScript, React or Angular

The demo below computes an eight-by-eight matrix in plain JavaScript from up to 1,000 simulated pump readings, and SciChart.js redraws the heatmap and the linked scatter plot each time you change a setting.

Click any cell to see the scatter plot behind it, with its least-squares line, and hover a cell for its value. Switch the **Method** between Pearson and Spearman, change the **Sample size**, **Add an outlier** (a faulty sensor reading, in orange), **Reorder by similarity**, or show the **Lower triangle only**. The line above the charts gives both coefficients for the selected pair and the significance threshold for the current sample size.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="correlation plot" demo="correlation-plot" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />

Here is the code for this chart. The statistics are plain JavaScript; SciChart.js draws the matrix as a heatmap with printed values, and a small custom modifier turns a click on a cell into a scatter plot.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // Pearson's r of two equal-length arrays
    const pearson = (x: number[], y: number[]) => {
        const n = x.length;
        const mx = x.reduce((s, v) => s + v, 0) / n;
        const my = y.reduce((s, v) => s + v, 0) / n;
        let sxy = 0, sxx = 0, syy = 0;
        for (let i = 0; i < n; i++) {
            sxy += (x[i] - mx) * (y[i] - my);
            sxx += (x[i] - mx) ** 2;
            syy += (y[i] - my) ** 2;
        }
        return sxy / Math.sqrt(sxx * syy);
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const { names, columns } = getYourColumnData(); // e.g. names: ["Load", "Flow"], columns: [[...], [...]]
        const matrix = columns.map((a) => columns.map((b) => pearson(a, b)));

        // One label per cell, centred on it; the first variable at the top
        const axisOptions = { autoTicks: false, majorDelta: 1, minorDelta: 1, drawMajorGridLines: false, drawMinorGridLines: false };
        const xAxis = new NumericAxis(wasmContext, { ...axisOptions, rotation: 40 });
        const yAxis = new NumericAxis(wasmContext, { ...axisOptions, flippedCoordinates: true, axisAlignment: EAxisAlignment.Left });
        xAxis.labelProvider.formatLabel = (v) => names[Math.round(v)] ?? "";
        yAxis.labelProvider.formatLabel = (v) => names[Math.round(v)] ?? "";
        xAxis.visibleRange = new NumberRange(-0.5, names.length - 0.5);
        yAxis.visibleRange = new NumberRange(-0.5, names.length - 0.5);
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, { zValues: matrix, xStart: -0.5, xStep: 1, yStart: -0.5, yStep: 1 }),
                // Diverging scale centred on 0: blue negative, red positive
                colorMap: new HeatmapColorMap({
                    minimum: -1,
                    maximum: 1,
                    gradientStops: [
                        { offset: 0, color: "#2C7BE5" },
                        { offset: 0.5, color: "#1B2A47" },
                        { offset: 1, color: "#E5484D" }
                    ]
                }),
                dataLabels: { style: { fontSize: 13 }, color: "#FFFFFF", precision: 2 }
            })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
        return { sciChartSurface };
    };

    export const CorrelationMatrixChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // Pearson's r of two equal-length arrays
    const pearson = (x: number[], y: number[]) => {
        const n = x.length;
        const mx = x.reduce((s, v) => s + v, 0) / n;
        const my = y.reduce((s, v) => s + v, 0) / n;
        let sxy = 0, sxx = 0, syy = 0;
        for (let i = 0; i < n; i++) {
            sxy += (x[i] - mx) * (y[i] - my);
            sxx += (x[i] - mx) ** 2;
            syy += (y[i] - my) ** 2;
        }
        return sxy / Math.sqrt(sxx * syy);
    };

    @Component({
        selector: "app-correlation-matrix-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class CorrelationMatrixChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const { names, columns } = getYourColumnData(); // e.g. names: ["Load", "Flow"], columns: [[...], [...]]
            const matrix = columns.map((a) => columns.map((b) => pearson(a, b)));

            // One label per cell, centred on it; the first variable at the top
            const axisOptions = { autoTicks: false, majorDelta: 1, minorDelta: 1, drawMajorGridLines: false, drawMinorGridLines: false };
            const xAxis = new NumericAxis(wasmContext, { ...axisOptions, rotation: 40 });
            const yAxis = new NumericAxis(wasmContext, { ...axisOptions, flippedCoordinates: true, axisAlignment: EAxisAlignment.Left });
            xAxis.labelProvider.formatLabel = (v) => names[Math.round(v)] ?? "";
            yAxis.labelProvider.formatLabel = (v) => names[Math.round(v)] ?? "";
            xAxis.visibleRange = new NumberRange(-0.5, names.length - 0.5);
            yAxis.visibleRange = new NumberRange(-0.5, names.length - 0.5);
            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(yAxis);

            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, {
                    dataSeries: new UniformHeatmapDataSeries(wasmContext, { zValues: matrix, xStart: -0.5, xStep: 1, yStart: -0.5, yStep: 1 }),
                    // Diverging scale centred on 0: blue negative, red positive
                    colorMap: new HeatmapColorMap({
                        minimum: -1,
                        maximum: 1,
                        gradientStops: [
                            { offset: 0, color: "#2C7BE5" },
                            { offset: 0.5, color: "#1B2A47" },
                            { offset: 1, color: "#E5484D" }
                        ]
                    }),
                    dataLabels: { style: { fontSize: 13 }, color: "#FFFFFF", precision: 2 }
                })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The matrix is a `UniformHeatmapRenderableSeries` whose `zValues[row][column]` are the coefficients. With `xStart: -0.5` and `xStep: 1`, cell i is centred on axis value i, so a `labelProvider.formatLabel` that returns the variable's name puts one label under each column.
- A `HeatmapColorMap` fixed from −1 to 1 with a neutral middle stop gives the diverging scale; `dataLabels` with `precision: 2` prints each value in its cell.
- Cells set to `NaN` (with `hasNaNs = true` on the data series) are transparent, which is how the demo hides the upper triangle.
- The click-to-scatter link is a `CustomChartModifier2D` that calls the heatmap's `hitTestProvider.hitTest()` on mouse up and reads `heatmapXIndex` and `heatmapYIndex`.

**See it in the demo app:** [JavaScript correlation plot](https://www.scichart.com/demo/javascript/correlation-plot) · [React correlation plot](https://www.scichart.com/demo/react/correlation-plot) · [Angular correlation plot](https://www.scichart.com/demo/angular/correlation-plot). For heatmaps in general, see the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) and [React heatmap interactions](https://www.scichart.com/demo/react/heatmap-interactions).

**Go deeper:** [SciChart.js heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), [heatmap colour maps and legends](/2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/), and how SciChart is used for [semiconductor test and yield data](https://www.scichart.com/semiconductors-big-data-visualization/). PCA is built from the correlation (or covariance) matrix: see [dimensionality reduction](/learn/applications/machine-learning/dimensionality-reduction/).

## Frequently asked questions

### What does a correlation matrix tell you?

A correlation matrix tells you, for every pair of variables in a dataset, how strongly and in which direction they move together in a straight line. Values near +1 mean both rise together, values near -1 mean one falls as the other rises, and values near 0 mean no linear link. It does not tell you why they move together, or about curved relationships.

### How do you read a correlation matrix?

Find the cell where the row of one variable meets the column of the other and read its coefficient. Ignore the diagonal, which is always 1, and read only one triangle, because the other is its mirror image. On a heatmap, the hue shows the direction (positive or negative) and the depth of colour shows the strength. Check the sample size before trusting moderate values.

### What is a good correlation value?

There is no universal cut-off; it depends on the field and the sample size. A widely used convention from Cohen treats an r of about 0.1 as small, 0.3 as medium and 0.5 as large. In engineering and physical measurement, values above 0.9 are common, while in social science 0.3 can be important. Always check that the value is statistically significant for your sample size.

### What is the difference between a correlation matrix and a covariance matrix?

A covariance matrix holds the covariance of every pair of variables, in the variables' own units, so its values depend on scale. A correlation matrix divides each covariance by the two standard deviations, so every value lies between -1 and 1 and the diagonal is 1. A correlation matrix is the covariance matrix of the standardised variables.

### What is a correlation plot?

A correlation plot is any chart that shows correlations. Most often it means a correlation matrix drawn as a heatmap, sometimes with circles, ellipses or numbers in the cells (also called a corrgram or correlogram). It can also mean a scatter plot matrix (pair plot), or, in time-series analysis, a plot of autocorrelation against lag.

### How do I make a correlation matrix in JavaScript?

Compute Pearson's r for every pair of columns in plain JavaScript (or Spearman's rho, which is Pearson's r of the ranks), giving an n by n array. Then draw it with SciChart.js as a UniformHeatmapRenderableSeries with a diverging HeatmapColorMap from -1 to 1, data labels for the values, and a HeatmapLegend. In React or Angular, the scichart-react and scichart-angular packages run the same chart code.

## Sources

- NIST/SEMATECH, *e-Handbook of Statistical Methods*: [Scatter Plot Matrix](https://www.itl.nist.gov/div898/handbook/eda/section3/scatplma.htm).
- Penn State STAT 462, [Detecting Multicollinearity Using Variance Inflation Factors](https://online.stat.psu.edu/stat462/node/180/).
- Friendly, M. (2002), [Corrgrams: exploratory displays for correlation matrices](https://doi.org/10.1198/000313002533). *The American Statistician*, 56(4), 316–324. Shaded and reordered correlation matrices.
- Anscombe, F. J. (1973), [Graphs in statistical analysis](https://doi.org/10.1080/00031305.1973.10478966). *The American Statistician*, 27(1), 17–21. Why the scatter plot behind a coefficient matters.
- Spearman, C. (1904), [The proof and measurement of association between two things](https://doi.org/10.2307/1412159). *American Journal of Psychology*, 15(1), 72–101; and Kendall, M. G. (1938), [A new measure of rank correlation](https://doi.org/10.1093/biomet/30.1-2.81). *Biometrika*, 30(1–2), 81–93.
- Higham, N. J. (2002), [Computing the nearest correlation matrix](https://doi.org/10.1093/imanum/22.3.329). *IMA Journal of Numerical Analysis*, 22(3), 329–343. Invalid matrices from pairwise deletion.
- Cohen, J. (1988), *Statistical Power Analysis for the Behavioral Sciences*, 2nd edition, Lawrence Erlbaum. Conventions for small, medium and large correlations.

<LearnCta position="bottom" chart="correlation plot" demo="correlation-plot" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />
