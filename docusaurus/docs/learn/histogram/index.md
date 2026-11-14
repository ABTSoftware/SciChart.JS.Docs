---
sidebar_position: 7
sidebar_label: Histogram
title: "Histogram: What It Is & How to Read It (With Interactive Examples)"
description: "What a histogram is, how to read and describe one, how to make one step by step, how to choose bins, and how it differs from a bar chart. With a live, interactive example."
keywords:
    [
        "histogram",
        "histogram chart",
        "what is a histogram",
        "how to read a histogram",
        "how to make a histogram",
        "how to describe a histogram",
        "histogram vs bar chart",
        "histogram vs bar graph",
        "difference between histogram and bar graph",
        "frequency histogram"
    ]
image: /img/learn/histogram-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a histogram used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A histogram is used to see how the values of one numeric variable are spread out: where most of them lie, how much they vary, whether the shape is symmetric or lopsided, and whether there are unusual values. Typical uses are measurements in quality control, exam scores, waiting times, prices and sensor readings." }
                },
                {
                    "@type": "Question",
                    "name": "Why would someone make a histogram instead of a bar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "To see the distribution of one numeric variable, such as heights, prices or response times. A histogram groups the numbers into ranges and shows where they cluster, how spread out they are and what shape they make. A bar chart compares values across separate categories, so it cannot show a distribution." }
                },
                {
                    "@type": "Question",
                    "name": "How many bins should a histogram have?",
                    "acceptedAnswer": { "@type": "Answer", "text": "There is no single right number. Too few bins hide the shape and too many make it look noisy. Two common starting points are the square root of the number of values, and Sturges' rule, 1 + log2(n). For 1,000 values they suggest about 32 and 11 bins. Try a few widths and keep the clearest." }
                },
                {
                    "@type": "Question",
                    "name": "What does a skewed histogram mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A skewed histogram has a long tail on one side. Right-skewed (positively skewed) data has most values at the low end and a few much larger ones, as with incomes or waiting times, and the mean is usually above the median. Left-skewed (negatively skewed) data is the mirror image." }
                },
                {
                    "@type": "Question",
                    "name": "Who invented the histogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The statistician Karl Pearson gave the histogram its name. He introduced the word in an 1891 lecture and used it in print in 1895, in a paper on skewed distributions. Charts of grouped counts had been drawn before, but Pearson's term is the one that stuck." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a histogram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, count your values into bins, then add a FastRectangleRenderableSeries with an XyxyDataSeries holding each bin's start, end and count. Set columnXMode to EColumnMode.StartEnd so each bar fills exactly its bin. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Histogram

## What is a histogram?

A **histogram** (also called a frequency histogram) is a chart that shows how the values of one numeric variable are distributed. It splits the range of the values into intervals called **bins** and draws a bar for each one. A bar's height is the number of values in its bin, and the bars touch because the bins are continuous.

![A histogram of 1,000 adult heights in 5 cm bins from 130 to 210 cm: a bell-shaped set of touching bars peaking at 243 people between 170 and 175 cm](/img/learn/histogram-og.png)

*A histogram of the heights of 1,000 simulated adults, counted into 5 cm bins. [Try the interactive version](#how-to-create-a-histogram-in-javascript-react-or-angular).*

:::tip Key takeaways
- A histogram shows the **distribution of one numeric variable**: values are counted into ranges called **bins**.
- Read it for **shape**, **centre**, **spread** and **outliers**: "symmetric, centred near 170 cm, mostly 155 to 185 cm".
- Its bars **touch** and stay in **numeric order**; a bar chart's bars are separate categories.
- The **bin width** changes the picture. Start with √n or Sturges' rule, then try a few widths.
- You can **estimate the median** from a histogram alone, using the counts in each bin.
:::

## How to read a histogram

![Anatomy of a histogram: equal-width bins on the horizontal axis, frequency on the vertical axis and touching bars, with four common shapes below: normal, right-skewed, left-skewed and bimodal](./histogram-anatomy.svg)

1. **Read the horizontal axis.** It shows the measured value, such as height, price or response time, split into **bins**. Each bin is a range, such as 170 to 175 cm, and the bins are usually all the same width.
2. **Read the vertical axis.** It shows the **frequency**: how many values fall into each bin. Some histograms show a percentage of the total instead (relative frequency).
3. **Find the peak.** The tallest bar is the most common range of values, called the **modal class**.
4. **Judge the spread.** How far the bars stretch either side of the peak shows how much the values vary.
5. **Check the shape and the edges.** Is it symmetric, or does it trail off to one side? Bars standing apart from the rest may be **outliers**, values worth checking. A gap means no values fell in that range.

### Common histogram shapes

| Shape | What it looks like | What it usually means |
| --- | --- | --- |
| Normal (bell-shaped) | One peak in the middle, falling away evenly on both sides | Values vary randomly around an average, as many measurements do; the mean and median are close |
| Right-skewed (positive skew) | Peak on the left, long tail to the right | Most values are small and a few are much larger, as with incomes or waiting times; the mean is usually above the median |
| Left-skewed (negative skew) | Peak on the right, long tail to the left | Most values are large and a few are much smaller, as with scores on an easy test; the mean is usually below the median |
| Bimodal | Two separate peaks | Often two groups mixed together, such as two machines, shifts or populations; try splitting the data |
| Uniform | Bars all roughly the same height | Every range is about equally likely |

## How to describe a histogram

Statistics courses teach the same four points for describing a distribution: **shape, centre, spread and unusual values**. Use this template:

> The distribution of **[variable]** is **[symmetric / right-skewed / left-skewed / bimodal]**, centred around **[value]**. Most values lie between **[low]** and **[high]**, and **[there are no outliers / a few values stand apart at …]**.

**Worked example,** using the heights chart at the top of the page: "The distribution of height is roughly symmetric and bell-shaped, centred around 170 cm, with the tallest bar from 170 to 175 cm (243 people). Most people, 900 of the 1,000, are between 155 and 185 cm. A handful of values stand apart at the edges: four people under 145 cm and one between 205 and 210 cm."

## How to make a histogram, step by step

Here are 20 delivery times, in minutes (example data):

> 12, 15, 17, 18, 21, 22, 22, 24, 25, 26, 27, 27, 28, 29, 31, 33, 34, 38, 41, 52

1. **Find the range.** The smallest value is 12 and the largest is 52, a range of 40 minutes.
2. **Choose the number of bins.** The square root of 20 is about 4.5, so aim for about five bins.
3. **Choose a bin width.** 40 ÷ 5 = 8 minutes. Round to a friendly number: **10 minutes**, with bins starting at 10.
4. **Decide the edges.** Each bin includes its lower edge and excludes its upper edge, so 20 goes in the 20 to 30 bin, not the 10 to 20 bin. That way every value is counted exactly once.
5. **Count the values in each bin** to make a frequency table:

| Bin (minutes) | Values | Frequency |
| --- | --- | --- |
| 10 to under 20 | 12, 15, 17, 18 | 4 |
| 20 to under 30 | 21, 22, 22, 24, 25, 26, 27, 27, 28, 29 | 10 |
| 30 to under 40 | 31, 33, 34, 38 | 4 |
| 40 to under 50 | 41 | 1 |
| 50 to under 60 | 52 | 1 |
| **Total** | | **20** |

6. **Draw the bars.** Put the bins along the horizontal axis and the frequency up the side, starting at zero. Draw one bar per bin, touching its neighbours, with a height equal to its count.

The result has a peak at 20 to 30 minutes and a tail to the right: a **right-skewed** distribution, with 52 minutes as a possible outlier worth checking.

### Choosing the number of bins

The bin width changes the picture. **Too few bins** lump everything together and hide the shape; **too many** leave most bins with only a few values, so the chart looks noisy. Two common starting points:

- the **square-root rule:** about √n bins for n values;
- **Sturges' rule:** 1 + log₂(n) bins, which suits data that is roughly bell-shaped.

For the 1,000 heights above, these suggest about 32 and 11 bins. The chart uses 16 bins of 5 cm: a round width that sits between the two. Try a few widths and keep the one that shows the shape most clearly.

| Variant | The bar height shows | Use it when |
| --- | --- | --- |
| Frequency histogram | The count of values in each bin | You want actual numbers |
| Relative frequency histogram | Each bin's share of the total, as a percentage | You compare datasets of different sizes |
| Density histogram | Count ÷ (total × bin width), so the bar areas add up to 1 | Bins have different widths, or you overlay a probability curve |
| Cumulative histogram | The count of values up to the end of each bin | You want to read off "how many are below x" |

## How to find the median from a histogram

A histogram doesn't show the individual values, but you can **estimate the median** (the middle value) from the counts. Add up the bars from the left until you pass half the total, then work out how far into that bin the halfway point falls:

> median ≈ L + ((n ÷ 2 − F) ÷ f) × w

where **L** is the lower edge of the bin holding the middle value, **n** is the total count, **F** is the count of all bins before it, **f** is that bin's count and **w** is the bin width.

**Worked example,** using the 1,000 heights in the chart above. Half of 1,000 is 500. Adding the bars from the left, the bins up to 170 cm hold 491 people, and the 170 to 175 cm bin holds 243, so the 500th person is in that bin:

> median ≈ 170 + ((500 − 491) ÷ 243) × 5 ≈ 170 + 0.19 = **170.2 cm**

The median of the raw data behind the chart is 170.1 cm, so the estimate is within a tenth of a centimetre. The method assumes values are spread evenly inside each bin, so it works best with narrow bins.

## When to use a histogram

Use a histogram when you have **many values of one numeric variable** and want to see its **distribution**: where the values cluster, how spread out they are and whether the shape is symmetric, skewed or has more than one peak. It's a standard first step in quality control and in exploring any new dataset.

| Chart | Best for |
| --- | --- |
| **Histogram** | The shape of one numeric variable's distribution, counted into ranges |
| [Bar chart](/learn/bar-chart/) | Comparing values across separate categories, such as sales by region |
| [Box plot](/learn/box-plot/) | A compact summary of a distribution (median, quartiles, range and outliers), and comparing many distributions side by side |
| [Scatter plot](/learn/scatter-plot/) | The relationship between two numeric variables |

## Histogram vs bar graph

A histogram and a bar graph (bar chart) look alike, but they answer different questions. The difference between a histogram and a bar graph is the kind of data on the horizontal axis: a histogram counts **numbers** into ranges, while a bar graph compares separate **categories**.

The picture below draws the same 20 deliveries both ways (example data). The histogram uses the delivery times from the [step-by-step example](#how-to-make-a-histogram-step-by-step) above; the bar graph counts the same deliveries by the area they went to.

![The same 20 deliveries drawn two ways. Left: a histogram of delivery time in 10-minute bins from 10 to 60 minutes, with touching bars of 4, 10, 4, 1 and 1 deliveries. Right: a bar graph of the same deliveries by area, with separate bars sorted largest first: North 7, Centre 6, East 4 and West 3](./histogram-vs-bar-graph.svg)

Three things give a histogram away:

- **The bars touch.** Each bin carries on where the last one stopped, so there's no gap unless a bin is empty. A bar graph leaves gaps, because "North" and "Centre" aren't neighbours on any scale.
- **The order is fixed.** Moving the 50 to 60 minute bar to the front would break the shape. The bar graph's areas can go in any order; here they're sorted largest first.
- **The axis has numbers, not names.** You can read a histogram's horizontal axis like a ruler. A bar graph's axis is a list of labels.

| | Histogram | Bar graph |
| --- | --- | --- |
| **Data** | One numeric (continuous) variable | Separate categories |
| **Each bar is** | A range of values (a bin) | One category |
| **Bar height** | How many values fall in the range | The category's value |
| **Gaps between bars** | No: the bins are continuous | Yes: the categories are separate |
| **Order of bars** | Fixed, in numeric order | Any order, often sorted by size |
| **Answers** | "How are the values distributed?" | "Which category is bigger?" |

**A quick test:** if you could rename the bars or shuffle them without losing meaning, it's a bar graph. If each bar is a slice of one number line, it's a histogram. For more on bar graphs and their types, see the [bar chart guide](/learn/bar-chart/).

## Common histogram mistakes

Check a histogram against this list before you publish it:

- **The bars touch.** Gaps between the bars make it look like a bar chart of categories. A gap should only mean an empty bin.
- **The bins are equal width,** or the chart is a density histogram. With unequal bins and plain counts, the wide bins look bigger than they are.
- **The bin edges are clear.** Say whether a value on an edge (exactly 20 minutes) goes in the lower or the upper bin, and apply it every time.
- **More than one bin width was tried.** One width can hide a second peak or invent one; check that the shape holds up.
- **The frequency axis starts at zero.** Bar heights carry the counts, as in a bar chart.
- **Histograms being compared use the same bins and scale.** Otherwise differences in shape may come from the bins, not the data. For many groups, consider [box plots](/learn/box-plot/).
- **There's enough data.** With a few dozen values, the shape changes a lot with the bin width. Say how many values the chart shows.

## How to create a histogram in JavaScript, React or Angular

SciChart.js draws histograms with WebGL and WebGPU, so they stay smooth with large datasets and live updates. It has no separate histogram series: you count your values into bins, then draw each bin as a rectangle from its start to its end. Try the chart below, which shows the 1,000 heights in 5 cm bins: scroll to zoom, drag to pan, double-click to reset, and hover over a bar to see its values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="histogram" demo="histogram-chart" docs="/2d-charts/chart-types/histogram-chart/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

        // One start, end and count per bin
        const { binStarts, binEnds, counts } = getYourBinnedData();
        sciChartSurface.renderableSeries.add(
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: binStarts,
                    x1Values: binEnds,
                    yValues: counts,
                    y1Values: counts.map(() => 0)
                }),
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                fill: "#29aade",
                stroke: "#14233c",
                strokeThickness: 1
            })
        );
        return { sciChartSurface };
    };

    export const Histogram = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-histogram",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class HistogramComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

            // One start, end and count per bin
            const { binStarts, binEnds, counts } = getYourBinnedData();
            sciChartSurface.renderableSeries.add(
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: new XyxyDataSeries(wasmContext, {
                        xValues: binStarts,
                        x1Values: binEnds,
                        yValues: counts,
                        y1Values: counts.map(() => 0)
                    }),
                    columnXMode: EColumnMode.StartEnd,
                    columnYMode: EColumnYMode.TopBottom,
                    fill: "#29aade",
                    stroke: "#14233c",
                    strokeThickness: 1
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) draws one rectangle per bin. Its [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) holds each bin's start (`xValues`), end (`x1Values`), count (`yValues`) and baseline of zero (`y1Values`).
- `columnXMode: EColumnMode.StartEnd` makes each bar fill exactly its bin, so the bars touch; bins of different widths work too. `columnYMode: EColumnYMode.TopBottom` draws each bar from the baseline up to its count.
- Binning happens before drawing. In the demo, a short `binValues` helper (plain JavaScript, not part of SciChart.js) counts the raw values into equal-width bins, each including its start and excluding its end; the [histogram documentation](/2d-charts/chart-types/histogram-chart/) shows the same idea with custom breakpoints.
- `dataLabels` writes each bin's count on its bar.

**See it in the demo app:** [JavaScript histogram chart](https://www.scichart.com/demo/javascript/histogram-chart) · [React histogram chart](https://www.scichart.com/demo/react/histogram-chart) · [Angular histogram chart](https://www.scichart.com/demo/angular/histogram-chart)

**Go deeper:** [SciChart.js histogram documentation](/2d-charts/chart-types/histogram-chart/), including binning raw data, axis formatting, data labels and texture fills.

## Frequently asked questions

### What is a histogram used for?

A histogram is used to see how the values of one numeric variable are spread out: where most of them lie, how much they vary, whether the shape is symmetric or lopsided, and whether there are unusual values. Typical uses are measurements in quality control, exam scores, waiting times, prices and sensor readings.

### Why would someone make a histogram instead of a bar chart?

To see the distribution of one numeric variable, such as heights, prices or response times. A histogram groups the numbers into ranges and shows where they cluster, how spread out they are and what shape they make. A bar chart compares values across separate categories, so it cannot show a distribution.

### How many bins should a histogram have?

There is no single right number. Too few bins hide the shape and too many make it look noisy. Two common starting points are the square root of the number of values, and Sturges' rule, 1 + log2(n). For 1,000 values they suggest about 32 and 11 bins. Try a few widths and keep the clearest.

### What does a skewed histogram mean?

A skewed histogram has a long tail on one side. Right-skewed (positively skewed) data has most values at the low end and a few much larger ones, as with incomes or waiting times, and the mean is usually above the median. Left-skewed (negatively skewed) data is the mirror image.

### Who invented the histogram?

The statistician Karl Pearson gave the histogram its name. He introduced the word in an 1891 lecture and used it in print in 1895, in a paper on skewed distributions. Charts of grouped counts had been drawn before, but Pearson's term is the one that stuck.

### How do I make a histogram in JavaScript?

With SciChart.js, count your values into bins, then add a `FastRectangleRenderableSeries` with an `XyxyDataSeries` holding each bin's start, end and count. Set `columnXMode` to `EColumnMode.StartEnd` so each bar fills exactly its bin. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- NIST/SEMATECH, [e-Handbook of Statistical Methods: Histogram](https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm). What a histogram shows, with variants such as normalised and cumulative counts.
- NIST/SEMATECH, [e-Handbook of Statistical Methods: Histogram interpretation, skewed right](https://www.itl.nist.gov/div898/handbook/eda/section3/histogr6.htm). How to read a right-skewed histogram, one of a series of pages on common shapes.
- Pearson, K. (1895), [Contributions to the mathematical theory of evolution. II. Skew variation in homogeneous material](https://doi.org/10.1098/rsta.1895.0010). *Philosophical Transactions of the Royal Society of London A*, 186. Pearson's 1895 paper on skewed distributions, which uses the term "histogram".
- Sturges, H. A. (1926), [The choice of a class interval](https://doi.org/10.1080/01621459.1926.10502161). *Journal of the American Statistical Association*, 21(153). The origin of Sturges' rule for the number of bins.

<LearnCta position="bottom" chart="histogram" demo="histogram-chart" docs="/2d-charts/chart-types/histogram-chart/" />
