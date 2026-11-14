---
sidebar_position: 12
sidebar_label: Pie Chart
title: "Pie Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a pie chart is, how to read and calculate its slices, when a bar chart works better, and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "pie chart",
        "pie charts",
        "pie chart examples",
        "what is a pie chart",
        "how to read a pie chart",
        "how to make a pie chart",
        "pie chart angles",
        "types of pie chart",
        "when to use a pie chart",
        "pie chart vs bar chart"
    ]
image: /img/learn/pie-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a pie chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A pie chart shows how one total is split into parts, such as a budget by category, survey answers or sales by region. It works best with a handful of parts and a clear message about one share of the whole, for example that housing takes 40% of a budget." }
                },
                {
                    "@type": "Question",
                    "name": "How do you make a pie chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Add up the values to get the total. Divide each value by the total to get its share, then multiply by 360 to get its angle in degrees. Draw a circle, start at 12 o'clock and mark each slice clockwise, largest first, then label each slice with its name and percentage." }
                },
                {
                    "@type": "Question",
                    "name": "How do you calculate the angle of a pie chart slice?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Angle = (value ÷ total) × 360°. For example, £1,200 of housing costs in a £3,000 budget is 1,200 ÷ 3,000 = 0.4, or 40%, and 0.4 × 360° = 144°. All the slices' angles together make 360°." }
                },
                {
                    "@type": "Question",
                    "name": "How many slices should a pie chart have?",
                    "acceptedAnswer": { "@type": "Answer", "text": "As few as possible. UK government guidance for analysts says five or fewer; Microsoft's Office guidance says no more than seven. With more, the slices get thin and hard to compare, so group the smallest categories into an \"Other\" slice or use a bar chart." }
                },
                {
                    "@type": "Question",
                    "name": "Who invented the pie chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Scottish engineer and economist William Playfair is credited with the first pie charts, published in his Statistical Breviary in 1801. The chart has been popular ever since, and debated by statisticians for almost as long." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a pie chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartPieSurface with pieType set to EPieType.Pie, then add one PieSegment per slice with its value, text and colour. SciChart works out each slice's percentage. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Pie Chart

## What is a pie chart?

A **pie chart** (also called a pie graph or circle chart) is a circular chart divided into **slices**, where each slice shows one category's **share of a whole**. The slices always add up to **100%**, and each slice's angle, arc and area grow with its value, so the biggest share gets the biggest slice.

![A pie chart of a £3,000 monthly household budget in five slices: Housing 40%, Food 18%, Transport 13%, Savings 12% and Other 17%, with a legend naming each slice](/img/learn/pie-chart-og.png)

*A pie chart of a monthly household budget (sample data). [Try the interactive version](#how-to-create-a-pie-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A pie chart shows **parts of one whole**: the slices must add up to 100%.
- Each slice's angle is its share of 360°: **angle = value ÷ total × 360°**.
- It works best with **about five slices or fewer** and one clear message, such as "housing is 40% of the budget".
- When parts are **close in size**, or you need to **rank or compare** them, a bar chart is easier to read.
- Avoid **3D**, unsorted slices and pies that don't sum to a meaningful total.
:::

## How to read a pie chart

![Anatomy of a pie chart: four slices of a household budget, with the slice, its percentage label, its angle, the legend and the whole circle labelled](./pie-chart-anatomy.svg)

1. **Find the whole.** The full circle is the total: all of the budget, all of the votes or all of the sales. Check the title to see what that total is.
2. **Match each slice to its category,** using the label on the slice or the legend.
3. **Judge the size of each slice.** A half-circle is 50% and a quarter is 25%. Research on pie charts suggests readers judge a slice mostly by the length of its outer edge (its arc) and its area, rather than the angle at the centre.
4. **Read the labels for exact values.** People estimate angles and areas less accurately than lengths, so without percentage labels most readers can only guess at anything that isn't close to a quarter or a half.
5. **Note the order.** Most well-made pie charts start at 12 o'clock and run clockwise, largest slice first, so the biggest share is the first one you see.

## How to calculate pie chart slices

To draw a pie chart, or to check one, turn each value into a percentage and an angle:

> **Share** = value ÷ total · **Percentage** = share × 100 · **Angle** = share × 360°

**Worked example,** using the £3,000 monthly budget in the chart above:

| Category | Value | Share of total | Angle |
| --- | ---: | ---: | ---: |
| Housing | £1,200 | 40.0% | 144° |
| Food | £550 | 18.3% | 66° |
| Transport | £400 | 13.3% | 48° |
| Savings | £350 | 11.7% | 42° |
| Other | £500 | 16.7% | 60° |
| **Total** | **£3,000** | **100%** | **360°** |

Two things to check before you draw it:

- **The angles add up to 360°** and the percentages to 100%. If they don't, a category is missing or the parts overlap.
- **Rounding can make labels add up to 99% or 101%.** Here, the rounded labels (40, 18, 13, 12 and 17) happen to sum to 100. If yours don't, show one decimal place or add a note that figures are rounded.

A charting library does this arithmetic for you: you pass the raw values (£1,200, £550 and so on) and it sizes the slices.

## How to describe a pie chart

For a report, a caption or a class answer, lead with the biggest share and then put the rest in context:

> The largest share of **[the whole]** is **[category]**, at **[x]%**, followed by **[category]** at **[y]%**. Together they make up **[x + y]%**. The smallest share is **[category]**, at **[z]%**.

**Worked example:** "Housing takes the largest share of the £3,000 monthly budget, at 40%, followed by food at 18%. Together they make up 58% of spending. Savings is the smallest share, at 12%."

## Types of pie chart

| Type | What it looks like | Use it when |
| --- | --- | --- |
| Standard pie chart | A full circle split into slices | You have a few parts of one whole |
| [Donut chart](/learn/donut-chart/) | A pie chart with a hole in the middle | You want a total or label in the centre, or a lighter look on a dashboard |
| Exploded pie chart | One or more slices pulled out from the centre | You want to draw attention to one slice (click a slice in the live chart below to try it) |
| 3D pie chart | A pie tilted and given depth | Rarely: the perspective makes front slices look bigger than equal slices at the back |
| Multi-level pie chart ([sunburst](/2d-charts/chart-types/polar-sunburst-chart/)) | Rings of slices, where each outer ring splits the slice inside it | Your data is a hierarchy, such as region, then country |
| Pie of pie, bar of pie | A main pie with its smallest slices broken out into a second, smaller chart | Several tiny slices need a closer look |

## When to use a pie chart

Use a pie chart when you have **one total split into a few parts**, and the main message is **how big one part is compared with the whole**: "housing is 40% of the budget", "most respondents said yes".

| Chart | Best for |
| --- | --- |
| **Pie chart** | A few parts of one whole, with one or two dominant shares |
| [Donut chart](/learn/donut-chart/) | The same as a pie chart, with room for a total or label in the centre |
| [Bar chart](/learn/bar-chart/) | Comparing values accurately, many categories, or values that don't add up to a whole |
| [100% stacked column chart](/2d-charts/chart-types/stacked-column-renderable-series/) | Comparing how the split of a whole changes across several groups or periods |

### Should this be a pie chart? A quick checklist

Answer each question. If any answer is "no", the right-hand column suggests a better chart.

| Question | If the answer is no |
| --- | --- |
| Do the values add up to **one meaningful whole**, with no overlap? (Multiple-choice survey answers usually don't.) | Use a [bar chart](/learn/bar-chart/) |
| Are all the values **positive**? A pie can't show a negative share, and zero values vanish. | Use a bar chart |
| Are there **about five categories or fewer**, after grouping the smallest into "Other"? | Use a bar chart, sorted largest first |
| Are the shares **clearly different** in size, with one or two that stand out? | Use a bar chart: close values are hard to rank in a pie |
| Is this **one snapshot**, not a comparison of several groups or a change over time? | Use a [100% stacked column chart](/2d-charts/chart-types/stacked-column-renderable-series/) or a [line chart](/learn/line-chart/) |

## Pie chart vs bar chart: the same data both ways

The picture below shows the same four survey results twice. In the pie chart, without labels, it's hard to say whether Summer or Autumn is the largest, or whether Spring or Winter is the smallest. In the sorted bar chart the order is obvious at a glance, because the bars all start from the same baseline and you only compare their lengths.

![The same four values shown twice. Left: an unlabelled pie chart of favourite seasons, where the four slices (Spring 23%, Summer 26%, Autumn 27%, Winter 24%) look almost equal. Right: a sorted bar chart of the same data, where Autumn is clearly longest and Spring shortest](./pie-vs-bar-same-data.svg)

That's the core trade-off. A pie chart makes **"part of a whole"** obvious, because the slices visibly fill one circle. A bar chart makes **"which is bigger, and by how much"** obvious, because people compare lengths along a common baseline more accurately than angles or areas.

## Common pie chart mistakes

Use this as a checklist before you publish a pie chart:

- **Too many slices.** Thin slivers can't be compared or labelled. Group small categories into "Other", placed last, or switch to a bar chart.
- **Slices that don't make a whole.** If people could pick more than one answer, or a category is missing, the slices don't sum to 100% and the chart misleads.
- **3D or tilted pies.** Perspective distorts the slices, so a front slice looks bigger than an equal one at the back.
- **Random order.** Sort the slices largest first, starting at 12 o'clock, unless the categories have a natural order (such as age groups).
- **Colour-only matching.** A legend forces readers to match colours back and forth. Label slices directly where they fit, and don't rely on colour alone for readers with colour-vision deficiency.
- **No percentages.** Without labels, readers can only estimate. Add the percentage, and the value if it matters.
- **Several pies side by side.** Comparing slices across separate pies is hard. A 100% stacked column chart or a grouped bar chart compares groups more clearly.

## How to create a pie chart in JavaScript, React or Angular

SciChart.js draws pie and donut charts with the same `SciChartPieSurface`, with animated updates, a built-in legend and selectable slices. Try the chart below: click a slice, or tick it in the legend, to pull it out from the pie.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="pie chart" demo="pie-chart" docs="/2d-charts/chart-types/pie-chart-type/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import { SciChartPieSurface, EPieType, PieSegment, SciChartJsNavyTheme } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            pieType: EPieType.Pie,
            animate: true
        });
        sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
            `${Math.round((100 * segment.value) / total)}%`;
        sciChartPieSurface.legend.showLegend = true;

        // getYourPieData() returns [{ text: "Housing", value: 1200, color: "#50C7E0" }, ...]
        for (const { text, value, color } of getYourPieData()) {
            sciChartPieSurface.pieSegments.add(new PieSegment({ text, value, color }));
        }
        return { sciChartSurface: sciChartPieSurface };
    };

    export const PieChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import { SciChartPieSurface, EPieType, PieSegment, SciChartJsNavyTheme } from "scichart";

    @Component({
        selector: "app-pie-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class PieChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme(),
                pieType: EPieType.Pie,
                animate: true
            });
            sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
                `${Math.round((100 * segment.value) / total)}%`;
            sciChartPieSurface.legend.showLegend = true;

            // getYourPieData() returns [{ text: "Housing", value: 1200, color: "#50C7E0" }, ...]
            for (const { text, value, color } of getYourPieData()) {
                sciChartPieSurface.pieSegments.add(new PieSegment({ text, value, color }));
            }
            return { sciChartSurface: sciChartPieSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [SciChartPieSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html) is the chart. Pie charts have no axes, so it is a separate surface type from the `SciChartSurface` used for line, bar and other x-y charts. `pieType: EPieType.Pie` draws a full pie.
- Each slice is a [PieSegment](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) with a `value`, `text` and `color`. You pass raw values (here, pounds); SciChart works out the percentages and angles, and the slices always fill the circle.
- `labelProvider.getSegmentText` sets each slice's label, and the built-in legend names the slices. Clicking a slice toggles its `isSelected` state, which pulls it out from the pie.
- Change a segment's `value` at any time and, with `animate: true`, the pie animates to the new split.

**See it in the demo app:** [JavaScript pie chart](https://www.scichart.com/demo/javascript/pie-chart) · [React pie chart](https://www.scichart.com/demo/react/pie-chart) · [Angular pie chart](https://www.scichart.com/demo/angular/pie-chart)

**Go deeper:** [SciChart.js pie chart documentation](/2d-charts/chart-types/pie-chart-type/), including label formatting, gradient fills and animated updates.

## Pie chart examples

Here are three pie chart examples using real-world shares. Each picture opens the live, interactive chart in the SciChart.js demo app, where you can select slices and see the code.

| Example | What it shows |
| --- | --- |
| <a href="https://www.scichart.com/demo/javascript/pie-chart"><img src={require("@site/static/img/learn/examples/javascript-pie-chart.jpg").default} alt="A pie chart of mobile phone makers' market share in 2022, with two large slices of about 29% each, many thin slices and a legend" width="240" /></a> | **Market share: a pie chart with many slices.** The share of mobile phones sold by each maker in 2022. Two makers hold about 29% each, which the pie shows well; the thin slices further round show why many charts group small categories into "Other". [JavaScript pie chart](https://www.scichart.com/demo/javascript/pie-chart) |
| <a href="https://www.scichart.com/demo/javascript/donut-chart"><img src={require("@site/static/img/learn/examples/javascript-donut-chart.jpg").default} alt="A donut chart of web browser market share in 2022, where one browser takes about two thirds of the ring" width="240" /></a> | **Browser use: a donut chart.** The market share of web browsers in 2022. One browser takes about two thirds of the ring, the kind of single dominant share a pie or donut chart makes obvious at a glance. [JavaScript donut chart](https://www.scichart.com/demo/javascript/donut-chart) |
| <a href="https://www.scichart.com/demo/javascript/polar-pie-chart"><img src={require("@site/static/img/learn/examples/javascript-polar-pie-chart.jpg").default} alt="A pie chart of the most popular JavaScript frameworks in 2024, with each slice labelled inside" width="240" /></a> | **Framework popularity: a labelled pie chart.** The most popular JavaScript frameworks in 2024, as shares of one whole. Each slice carries its name, so readers don't have to match colours to a legend. [JavaScript polar pie chart](https://www.scichart.com/demo/javascript/polar-pie-chart) |

## Frequently asked questions

### What is a pie chart used for?

A pie chart shows how one total is split into parts, such as a budget by category, survey answers or sales by region. It works best with a handful of parts and a clear message about one share of the whole, for example that housing takes 40% of a budget.

### How do you make a pie chart?

Add up the values to get the total. Divide each value by the total to get its share, then multiply by 360 to get its angle in degrees. Draw a circle, start at 12 o'clock and mark each slice clockwise, largest first, then label each slice with its name and percentage.

### How do you calculate the angle of a pie chart slice?

Angle = (value ÷ total) × 360°. For example, £1,200 of housing costs in a £3,000 budget is 1,200 ÷ 3,000 = 0.4, or 40%, and 0.4 × 360° = 144°. All the slices' angles together make 360°.

### How many slices should a pie chart have?

As few as possible. UK government guidance for analysts says five or fewer; Microsoft's Office guidance says no more than seven. With more, the slices get thin and hard to compare, so group the smallest categories into an "Other" slice or use a [bar chart](/learn/bar-chart/).

### Who invented the pie chart?

The Scottish engineer and economist William Playfair is credited with the first pie charts, published in his Statistical Breviary in 1801. The chart has been popular ever since, and debated by statisticians for almost as long.

### How do I make a pie chart in JavaScript?

With SciChart.js, create a `SciChartPieSurface` with `pieType` set to `EPieType.Pie`, then add one `PieSegment` per slice with its value, text and colour. SciChart works out each slice's percentage. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Spence, I. (2005), [No Humble Pie: The Origins and Usage of a Statistical Chart](https://doi.org/10.3102/10769986030004353). *Journal of Educational and Behavioral Statistics*, 30(4). William Playfair's first pie charts and how the chart has been used since.
- Cleveland, W. S. and McGill, R. (1984), [Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387). Experiments showing that people judge positions and lengths more accurately than angles and areas.
- Skau, D. and Kosara, R. (2016), [Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts](https://doi.org/10.1111/cgf.12888). *Computer Graphics Forum*, 35(3). Evidence that readers rely on arc length and area more than the centre angle.
- UK Government Analysis Function, [Data visualisation: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/). Guidance for government analysts on when to use pie charts (five categories or fewer, a meaningful whole, a dominant category) and how to format them.
- Microsoft, [Available chart types in Office](https://support.microsoft.com/en-us/office/available-chart-types-in-office-a6187218-807e-4103-9e0a-27cdb19afb90). When to consider a pie chart, and the pie of pie and bar of pie variants.

<LearnCta position="bottom" chart="pie chart" demo="pie-chart" docs="/2d-charts/chart-types/pie-chart-type/" />
