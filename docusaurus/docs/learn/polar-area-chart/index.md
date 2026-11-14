---
sidebar_position: 11.3
sidebar_label: Polar Area Chart
title: "Polar Area Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a polar area chart (Nightingale rose or coxcomb chart) is, how to read it, why its radius must be the square root of the value, and how it differs from pie and radar charts."
keywords:
    [
        "polar area chart",
        "polar area diagram",
        "nightingale rose chart",
        "coxcomb chart",
        "rose chart",
        "what is a polar area chart",
        "how to read a polar area chart",
        "polar area chart vs pie chart"
    ]
image: /img/learn/polar-area-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a polar area chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A polar area chart is used to compare values across categories that have a natural order round a circle, such as the months of the year, the hours of the day or compass directions. It makes seasonal or daily patterns easy to see, because the biggest wedges point to when or where the values peak. With stacked wedges it also shows how each total splits into parts, as in a wind rose." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a polar area chart and a pie chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In a pie chart every slice has the same radius and the angle of each slice shows its value, so the slices add up to a whole. In a polar area chart every wedge has the same angle and the length of each wedge from the centre shows its value. A pie chart shows shares of one total; a polar area chart compares separate values, usually in a cycle such as months." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a polar area chart and a radar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A radar chart plots several different variables on spokes and joins the points into a shape, so you can compare the profiles of a few items. A polar area chart plots one measure for each category as a filled wedge, so you compare the wedges' areas. Use a radar chart for profiles across variables, and a polar area chart for one quantity over a cycle." }
                },
                {
                    "@type": "Question",
                    "name": "Why is a polar area chart called a Nightingale rose or coxcomb?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The best-known early example was drawn by Florence Nightingale, who published polar area diagrams in 1858 and 1859 to show that most British soldiers who died in the Crimean War died of preventable disease rather than wounds. The names rose and coxcomb were given to her diagrams later; there is no evidence in her writing that she used either name." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a polar area chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Draw one equal-angle wedge per category on a polar chart, and set each wedge's radius to the square root of its value so that its area matches the value. With SciChart.js you use a SciChartPolarSurface with an angular axis for the categories, a radial axis whose labels show the squared values, and a PolarColumnRenderableSeries for the wedges. For stacked wedges, give each band an inner and outer radius with an XyxyDataSeries. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Polar Area Chart

## What is a polar area chart?

A **polar area chart** (also called a polar area diagram, Nightingale rose chart, coxcomb chart or rose chart) is a circular chart that divides the circle into **equal-angle wedges**, one for each category. Each wedge reaches out from the centre by an amount set by its value, so that the **area** of the wedge shows how big the value is.

![A polar area chart of deaths in the British Army in the East, by month from April 1854 to March 1856, using Florence Nightingale's figures. Each month is a wedge split into wounds, other causes and preventable disease. The wedges for the winter of 1854 to 1855 are by far the largest, and almost all of their area is preventable disease](/img/learn/polar-area-chart-og.png)

*Deaths in the British Army in the East, April 1854 to March 1856, by month and cause, from Florence Nightingale's figures. [Try the interactive version](#how-to-create-a-polar-area-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A polar area chart gives **every category the same angle** and shows its value by **how far its wedge reaches** from the centre.
- **Area, not length, carries the value.** Because area grows with the square of the radius, the radius must be the **square root** of the value, or big values look far bigger than they are.
- It suits categories that **go round in a cycle**: months, hours of the day, compass directions.
- It is not a pie chart: in a pie chart the **angle** shows the value; here the angle is fixed.
- Florence Nightingale's 1858 diagram of Crimean War deaths made the form famous, which is why it is also called a **Nightingale rose**.
:::

## How to read a polar area chart

![The parts of a polar area chart: support tickets by day of the week on seven equal 51-degree wedges. Rings labelled 4, 16, 36 and 64 are evenly spaced in radius but not in value. Wednesday's wedge, worth 49 tickets, has a radius of 7, so its area is 49 times that of Sunday's 1-ticket wedge](./polar-area-chart-anatomy.svg)

1. **Find the categories round the edge.** Each wedge is one category, often a month, an hour or a direction. Check where the circle starts (here, 12 o'clock) and which way it runs (here, clockwise).
2. **Check the scale on the rings.** On a correctly drawn chart, rings that are evenly spaced on the page are **not** evenly spaced in value: 4, 16, 36, 64 rather than 10, 20, 30, 40. That tells you the radius is the square root of the value.
3. **Compare the wedges by area.** A wedge with twice the area is worth twice as much. Because every wedge has the same angle, a longer wedge is always a bigger value, but not in proportion to its length: a wedge twice as long is worth four times as much.
4. **Look for the pattern round the circle.** The point of the circle is the cycle. Find where the big wedges cluster (a season, a time of day, a wind direction) and where the small ones are.
5. **For stacked wedges, read each band's area.** In a stacked polar area chart each wedge is split into coloured bands, one for each part. The whole wedge's area is the total; each band's area is that part.
6. **Use labels or tooltips for exact values.** People judge areas less precisely than lengths, so read the numbers when they matter.

## Why the radius is the square root of the value

The area of a wedge grows with the **square** of its radius. Double the radius and the area goes up four times; triple it and the area goes up nine times. So if a chart sets each wedge's radius straight to its value, a value twice as big is drawn **four times** as big, and the chart exaggerates every difference.

![Two wedges, A worth 1 and B worth 4, drawn two ways. With radius equal to the value, B is four times as long as A and looks 16 times as big. With radius equal to the square root of the value, B is twice as long as A and looks 4 times as big, which matches the data](./polar-area-square-root.svg)

The fix is to set the radius to the **square root of the value**:

| Value | Radius = value | Area if radius = value | Radius = √value | Area if radius = √value |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 |
| 4 | 4 | 16 | 2 | 4 |
| 9 | 9 | 81 | 3 | 9 |
| 25 | 25 | 625 | 5 | 25 |

(Areas are relative to the value-1 wedge.) Only the right-hand columns keep area in step with the value.

**Not every charting tool does this for you.** SciChart.js's polar column series, for one, maps each value straight to its radius, which is right for a radial bar chart but not for a polar area chart. To draw a true polar area chart, plot the square root of each value and label the rings with the real values (the live chart below does this), or use a square-root radial scale where your tool has one. If you see a "polar area chart" whose rings read 10, 20, 30 at even spacing, its wedge areas overstate the large values.

Florence Nightingale met this problem herself. Her first version plotted death rates straight out from the centre, and the largest wedges swamped the rest; her later published diagrams scaled the wedges so their areas matched the figures (Friendly and Andrews, 2021).

## Florence Nightingale's rose diagram

The polar area chart is best known from **Florence Nightingale's "Diagram of the Causes of Mortality in the Army in the East"**. She drew it with help from the statistician William Farr, and published it in 1858 in *Notes on Matters Affecting the Health, Efficiency, and Hospital Administration of the British Army*, and again in 1859.

- **What it showed:** deaths among British soldiers in the Crimean War by month, split into three causes. **Blue** wedges were deaths from "preventible or mitigable zymotic diseases" (infectious diseases, mainly cholera), **red** wedges deaths from wounds, and **black** wedges all other causes.
- **How it was laid out:** two roses side by side, one for April 1854 to March 1855 and one for April 1855 to March 1856. The split falls around the arrival of the government's Sanitary Commission in the spring of 1855, so readers could compare the year before with the year after.
- **What it argued:** most of the soldiers who died were killed by disease, not by the enemy, and much of that disease was preventable with better sanitation. Nightingale used the diagram, with tables and text, to press for reform of army health care.
- **Its place in history:** it was not the first radial chart. André-Michel Guerry published circular diagrams of monthly data in 1829, and Farr used radial diagrams in an 1852 report on cholera that Nightingale had seen. The names "rose" and "coxcomb" came later; there is no evidence in her writing that she used them (Friendly and Andrews, 2021).

### A worked example: Nightingale's figures

The chart at the top of this page, and the live chart further down, draw her monthly figures as one 24-month rose, with each wedge's bands stacked so that each band's area matches its count. The totals tell the same story she told:

| Period | Preventable disease | Wounds | Other causes | Total | Share from disease |
| --- | --- | --- | --- | --- | --- |
| April 1854 to March 1855 | 11,157 | 772 | 1,365 | 13,294 | 84% |
| April 1855 to March 1856 | 3,319 | 986 | 383 | 4,688 | 71% |
| All 24 months | 14,476 | 1,758 | 1,748 | 17,982 | 81% |

Three things stand out:

- **Disease dwarfs wounds.** In the first year, about 14 soldiers died of disease for every one who died of wounds. In January 1855 alone, 2,761 died of disease and 83 of wounds.
- **The winter of 1854 to 1855 was the worst.** December, January and February together account for 7,661 deaths, more than 40% of the two-year total.
- **Deaths fell sharply in the second year,** even though the army in the East grew. By early 1856 the monthly total was under 100.

These are counts of deaths. The army in the East grew over the two years, from about 8,600 to about 46,000 men by the estimates that come with the data, so the fall in the death **rate** was even steeper than the fall in deaths.

### How to describe a polar area chart

Use this template when you report a polar area chart:

> The largest values occur in **[category or range of categories]**, peaking at **[value]** in **[category]**. The smallest are in **[category or range]**. **[Part]** makes up most of each wedge, at **[share]** overall.

**Worked example:** "The largest monthly death tolls occur from November 1854 to March 1855, peaking at 3,168 in January 1855. The smallest are in the first three months and the last three. Preventable disease makes up most of each wedge, at 81% of deaths overall."

## When to use a polar area chart

Use a polar area chart when your categories **form a cycle** and you want readers to see the **pattern round it**:

- **months of the year:** sales, rainfall, hospital admissions or energy use by month;
- **hours of the day or days of the week:** website traffic, calls to a help desk, deliveries;
- **directions:** wind speed and frequency by compass direction (a wind rose is a close relative: a stacked polar chart of wind by direction);
- **a few totals split into parts,** when the categories still have a circular order.

| Chart | What shows the value | Best for |
| --- | --- | --- |
| **Polar area chart** | Wedge area (equal angles) | One measure over a cycle, such as months or directions, where the seasonal pattern matters |
| [Pie chart](/learn/pie-chart/) | Slice angle (equal radius) | How one total splits into a few shares |
| [Radar chart](/learn/radar-chart/) | Distance along each spoke, joined into a shape | Comparing the profiles of a few items across several different variables |
| [Bar chart](/learn/bar-chart/) | Bar length from a common baseline | Precise comparison between categories, or categories with no circular order |

If exact comparison matters more than the cycle, use a bar chart: lengths on a shared baseline are easier to compare than areas.

## Common polar area chart mistakes

- **Radius set straight to the value.** The most common error. It makes large values look far larger than they are. Plot the square root of each value, or use a square-root radial scale.
- **Evenly spaced value labels on the rings.** If the rings read 10, 20, 30 at even spacing, the radius is linear. On a correct chart, evenly spaced rings carry values like 100, 400, 900.
- **Stacking the raw values.** In a stacked polar area chart, each band's inner and outer edge must be the square roots of the running totals. Stacking the square roots of the parts (adding √a to √b) gives bands whose areas don't match the data.
- **Categories with no natural order.** Product names or countries round a circle suggest a cycle that isn't there. Use a bar chart instead.
- **Too many wedges.** Past about 24 the wedges get thin and the labels crowd. Group the data (weeks into months, for example) or use a line chart.
- **Small values lost at the centre.** Wedges near the centre are tiny. Label them, or give the exact numbers in a tooltip or a table.
- **Colour that means nothing.** For a single series, use one colour. Use different colours only when they carry meaning, such as the causes of death in Nightingale's diagram, and say what each colour means.

## How to create a polar area chart in JavaScript, React or Angular

SciChart.js draws polar charts with WebGL, so even charts with many wedges or live data stay smooth to hover and zoom. A polar area chart uses its **polar column series**, with two changes that make the wedge areas honest: the radius is the square root of each value, and the ring labels show the real values. Try the chart below: hover over a month to see its deaths by cause, scroll to zoom and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="polar area chart" demo="polar-column-chart" docs="/2d-charts/chart-types/polar-column-renderable-series/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarColumnRenderableSeries,
        XyxyDataSeries,
        NumberRange,
        NumericTickProvider,
        EPolarAxisMode,
        EColumnMode,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // { labels: ["Jan", ...], parts: [{ name, color, values: [...] }] }, drawn from the centre outwards
        const { labels, parts } = getYourPolarAreaData();

        // One equal wedge per category: lines between wedges, labels in the middle
        class WedgeTickProvider extends NumericTickProvider {
            getMajorTicks() { return labels.map((_, i) => i + 0.5); }
            getMinorTicks() { return labels.map((_, i) => i); }
        }
        const angularAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(0, labels.length),
            startAngle: Math.PI / 2,
            flippedCoordinates: true,
            drawMajorGridLines: false
        });
        angularAxis.tickProvider = new WedgeTickProvider(wasmContext);
        angularAxis.labelProvider.formatLabel = (value: number) => labels[Math.floor(value)] ?? "";
        sciChartSurface.xAxes.add(angularAxis);

        // Plot square roots; label the rings with the real values
        const radialAxis = new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Radial, startAngle: Math.PI / 2 });
        radialAxis.labelProvider.formatLabel = (v: number) => (v === 0 ? "" : (v * v).toLocaleString());
        sciChartSurface.yAxes.add(radialAxis);

        // Each band runs from sqrt(total so far) to sqrt(total so far + this part)
        const runningTotal = new Array(labels.length).fill(0);
        for (const part of parts) {
            const inner = runningTotal.map(Math.sqrt);
            part.values.forEach((v: number, i: number) => (runningTotal[i] += v));
            sciChartSurface.renderableSeries.add(
                new PolarColumnRenderableSeries(wasmContext, {
                    dataSeries: new XyxyDataSeries(wasmContext, {
                        xValues: labels.map((_, i) => i),
                        x1Values: labels.map((_, i) => i + 1),
                        yValues: runningTotal.map(Math.sqrt),
                        y1Values: inner,
                        dataSeriesName: part.name
                    }),
                    columnXMode: EColumnMode.StartEnd,
                    fill: part.color + "CC",
                    stroke: part.color
                })
            );
        }

        sciChartSurface.chartModifiers.add(
            new PolarCursorModifier({ showTooltip: true }),
            new PolarMouseWheelZoomModifier(),
            new PolarZoomExtentsModifier(),
            new PolarLegendModifier({ showCheckboxes: false })
        );
        return { sciChartSurface };
    };

    export const PolarAreaChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarColumnRenderableSeries,
        XyxyDataSeries,
        NumberRange,
        NumericTickProvider,
        EPolarAxisMode,
        EColumnMode,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-polar-area-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class PolarAreaChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // { labels: ["Jan", ...], parts: [{ name, color, values: [...] }] }, drawn from the centre outwards
            const { labels, parts } = getYourPolarAreaData();

            // One equal wedge per category: lines between wedges, labels in the middle
            class WedgeTickProvider extends NumericTickProvider {
                getMajorTicks() { return labels.map((_, i) => i + 0.5); }
                getMinorTicks() { return labels.map((_, i) => i); }
            }
            const angularAxis = new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(0, labels.length),
                startAngle: Math.PI / 2,
                flippedCoordinates: true,
                drawMajorGridLines: false
            });
            angularAxis.tickProvider = new WedgeTickProvider(wasmContext);
            angularAxis.labelProvider.formatLabel = (value: number) => labels[Math.floor(value)] ?? "";
            sciChartSurface.xAxes.add(angularAxis);

            // Plot square roots; label the rings with the real values
            const radialAxis = new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Radial, startAngle: Math.PI / 2 });
            radialAxis.labelProvider.formatLabel = (v: number) => (v === 0 ? "" : (v * v).toLocaleString());
            sciChartSurface.yAxes.add(radialAxis);

            // Each band runs from sqrt(total so far) to sqrt(total so far + this part)
            const runningTotal = new Array(labels.length).fill(0);
            for (const part of parts) {
                const inner = runningTotal.map(Math.sqrt);
                part.values.forEach((v: number, i: number) => (runningTotal[i] += v));
                sciChartSurface.renderableSeries.add(
                    new PolarColumnRenderableSeries(wasmContext, {
                        dataSeries: new XyxyDataSeries(wasmContext, {
                            xValues: labels.map((_, i) => i),
                            x1Values: labels.map((_, i) => i + 1),
                            yValues: runningTotal.map(Math.sqrt),
                            y1Values: inner,
                            dataSeriesName: part.name
                        }),
                        columnXMode: EColumnMode.StartEnd,
                        fill: part.color + "CC",
                        stroke: part.color
                    })
                );
            }

            sciChartSurface.chartModifiers.add(
                new PolarCursorModifier({ showTooltip: true }),
                new PolarMouseWheelZoomModifier(),
                new PolarZoomExtentsModifier(),
                new PolarLegendModifier({ showCheckboxes: false })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each wedge is a [PolarColumnRenderableSeries](/2d-charts/chart-types/polar-column-renderable-series/) column. With an `XyxyDataSeries` and `columnXMode: EColumnMode.StartEnd`, every column has a start and end angle (`x`, `x1`) and an inner and outer radius (`y1`, `y`), which is all a stacked polar area chart needs.
- **The square root is your job.** The series maps values to the radius in a straight line, so the code plots `Math.sqrt` of each running total and overrides the radial axis's `labelProvider.formatLabel` to print the squared values. The rings are then evenly spaced on screen and read 100, 400, 900 and so on.
- A small `NumericTickProvider` subclass puts the angular gridlines between the wedges and each label in the middle of its wedge. `startAngle: Math.PI / 2` with `flippedCoordinates: true` starts at 12 o'clock and runs clockwise.
- `PolarCursorModifier` with a `tooltipDataTemplate` shows the real counts for the month under the mouse, read from the original data rather than from the square roots.
- For a single series, use one colour. SciChart.js also has a [polar stacked column series](/2d-charts/chart-types/polar-stacked-column-renderable-series/) for wind-rose charts; it stacks the values in a straight line, so use it when the radius, not the area, should carry the value.

**See it in the demo app:** [JavaScript polar column chart](https://www.scichart.com/demo/javascript/polar-column-chart) · [React polar column chart](https://www.scichart.com/demo/react/polar-column-chart) · [Angular polar column chart](https://www.scichart.com/demo/angular/polar-column-chart), and the stacked [React polar windrose chart](https://www.scichart.com/demo/react/polar-windrose-column-chart).

**Go deeper:** [SciChart.js polar area chart documentation](/2d-charts/chart-types/polar-column-renderable-series/) (the polar column series), the [polar stacked column documentation](/2d-charts/chart-types/polar-stacked-column-renderable-series/), and the [tick provider documentation](/2d-charts/axis-api/axis-tick-label-interval/tick-provider-api/).

## Frequently asked questions

### What is a polar area chart used for?

A polar area chart is used to compare values across categories that have a natural order round a circle, such as the months of the year, the hours of the day or compass directions. It makes seasonal or daily patterns easy to see, because the biggest wedges point to when or where the values peak. With stacked wedges it also shows how each total splits into parts, as in a wind rose.

### What is the difference between a polar area chart and a pie chart?

In a pie chart every slice has the same radius and the angle of each slice shows its value, so the slices add up to a whole. In a polar area chart every wedge has the same angle and the length of each wedge from the centre shows its value. A pie chart shows shares of one total; a polar area chart compares separate values, usually in a cycle such as months.

### What is the difference between a polar area chart and a radar chart?

A radar chart plots several different variables on spokes and joins the points into a shape, so you can compare the profiles of a few items. A polar area chart plots one measure for each category as a filled wedge, so you compare the wedges' areas. Use a radar chart for profiles across variables, and a polar area chart for one quantity over a cycle.

### Why is a polar area chart called a Nightingale rose or coxcomb?

The best-known early example was drawn by Florence Nightingale, who published polar area diagrams in 1858 and 1859 to show that most British soldiers who died in the Crimean War died of preventable disease rather than wounds. The names rose and coxcomb were given to her diagrams later; there is no evidence in her writing that she used either name.

### How do I make a polar area chart in JavaScript?

Draw one equal-angle wedge per category on a polar chart, and set each wedge's radius to the square root of its value so that its area matches the value. With SciChart.js you use a `SciChartPolarSurface` with an angular axis for the categories, a radial axis whose labels show the squared values, and a `PolarColumnRenderableSeries` for the wedges. For stacked wedges, give each band an inner and outer radius with an `XyxyDataSeries`. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Nightingale, F. (1858), [Notes on Matters Affecting the Health, Efficiency, and Hospital Administration of the British Army](https://archive.org/details/b20387118). London: Harrison and Sons. Digitised by the Wellcome Library. The report that contains her diagram of the causes of mortality in the army in the East.
- Friendly, M. and Andrews, R. J. (2021), [The radiant diagrams of Florence Nightingale](https://doi.org/10.2436/20.8080.02.77). *SORT: Statistics and Operations Research Transactions*, 45(1), 1–16. How she came to the diagram, her work with William Farr, her switch from a linear to an area-proportional scale, and the earlier radial charts of Guerry and Farr.
- Friendly, M. and others, [HistData: Data Sets from the History of Statistics and Data Visualization](https://cran.r-project.org/package=HistData), R package, data set `Nightingale`. The monthly deaths by cause used in the charts on this page, transcribed from Nightingale's tables.

<LearnCta position="bottom" chart="polar area chart" demo="polar-column-chart" docs="/2d-charts/chart-types/polar-column-renderable-series/" />
