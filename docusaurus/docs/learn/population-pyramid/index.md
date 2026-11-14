---
sidebar_position: 7.5
sidebar_label: Population Pyramid
title: "Population Pyramid: What It Is & How to Read It (With Interactive Examples)"
description: "What a population pyramid (age-sex pyramid) is, how to read it, the expansive, stationary and constrictive types, a worked example and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "population pyramid",
        "age pyramid",
        "age-sex pyramid",
        "population pyramid chart",
        "what is a population pyramid",
        "how to read a population pyramid",
        "types of population pyramid",
        "expansive constrictive stationary population pyramid"
    ]
image: /img/learn/population-pyramid-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a population pyramid show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A population pyramid shows how many people of each age and sex live in a place at one moment. Each horizontal bar is an age group, with males on one side of a centre line and females on the other. Its shape tells you whether births are rising or falling, how quickly people die at each age, and whether the population is young and growing or older and ageing." }
                },
                {
                    "@type": "Question",
                    "name": "What are the three types of population pyramid?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The three main types are expansive, stationary and constrictive. An expansive pyramid has a wide base that narrows quickly, from many births and shorter lives, so the population is young and growing. A stationary pyramid has bars of similar width until old age, from low birth and death rates. A constrictive pyramid is narrower at the base than in the middle, because births have fallen, so the population is ageing." }
                },
                {
                    "@type": "Question",
                    "name": "What is a constrictive population pyramid?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A constrictive population pyramid has a base that is narrower than the bars above it, so the widest part is in the middle ages rather than at the bottom. It means fewer children are being born than in earlier generations, and people live long lives. Without enough migration, a population with this shape gets older and may start to shrink." }
                },
                {
                    "@type": "Question",
                    "name": "What does a healthy population pyramid look like?",
                    "acceptedAnswer": { "@type": "Answer", "text": "There is no single healthy shape. A very wide base means many dependent children, and often many deaths in childhood. A very narrow base means fewer future workers to support a growing number of older people. A shape with similar numbers in each age group until old age, like a stationary pyramid, means each generation is about the same size, so the balance between children, workers and older people changes slowly." }
                },
                {
                    "@type": "Question",
                    "name": "Why is it called a population pyramid?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It is called a pyramid because, for most of history, populations had many young people and far fewer old people, so the bars made a triangle with a wide base and a point at the top. Many countries' charts no longer look like that, but the name has stuck. It is also called an age-sex pyramid or an age structure diagram." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a population pyramid in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Put the age groups on a vertical axis and draw two sets of horizontal bars that start from a shared centre line: one for males going left and one for females going right. With SciChart.js you make the chart vertical by placing the X axis on the left, add two value axes along the bottom, flip the female one so its bars grow to the right and lay them side by side with BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy, then draw each side as a StackedColumnRenderableSeries in a StackedColumnCollection. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Population Pyramid

## What is a population pyramid?

A **population pyramid** (also called an age-sex pyramid or age structure diagram) is a chart that shows how many people of each age and sex live in a place. Age groups are stacked from youngest at the bottom to oldest at the top. Each group has two horizontal bars back to back: males on the left, females on the right.

![A population pyramid of an imaginary country of 9.1 million people: eighteen five-year age groups from 0–4 at the bottom to 85+ at the top, with blue male bars to the left and orange female bars to the right. The bars are narrower at the bottom than in the middle, widest at ages 50 to 59, and the female bars are longer than the male bars at the oldest ages](/img/learn/population-pyramid-og.png)

*A population pyramid of an imaginary country, in thousands of people (sample data). [Try the interactive version](#how-to-create-a-population-pyramid-in-javascript-react-or-angular).*

:::tip Key takeaways
- A population pyramid shows a population's **age and sex structure at one moment**: one pair of bars per age group, males left and females right.
- **The shape tells the story.** A wide base means many births; a base narrower than the middle means births have fallen and the population is ageing.
- The three main types are **expansive** (growing), **stationary** (stable) and **constrictive** (ageing).
- **Bulges and notches** are generations that were unusually large or small, such as a baby boom. They move up the chart over time.
- Both sides must use **the same scale**, starting at zero in the middle. Use **percentages**, not counts, to compare places of different sizes.
:::

## How to read a population pyramid

![The parts of a population pyramid: age groups run up the middle from 0–4 to 85+, male bars extend left in blue and female bars right in orange against a shared scale in thousands. Labels mark the base (the youngest people, set by recent births), a notch at ages 40 to 44 (a smaller generation), a bulge at ages 50 to 59 (a baby boom), the apex (the oldest survivors) and the wider female bars at the top, because women live longer on average](./population-pyramid-anatomy.svg)

1. **Check the units and the date.** The bars show either a **count** of people (often in thousands) or a **percentage** of the whole population. A pyramid is a snapshot of one year, for one place.
2. **Find the centre line.** Each bar starts at zero in the middle. Males are usually on the left and females on the right, and the two sides share one scale, so equal lengths mean equal numbers.
3. **Read up the age axis.** The bottom bar is the youngest group (usually ages 0 to 4) and the top bar is the oldest. Five-year age groups are the most common. The top group is often open-ended, such as "85+".
4. **Look at the overall shape.** Is the base the widest part, or is the middle wider? That one comparison tells you whether the population is growing younger or getting older (see [the three types](#types-of-population-pyramid) below).
5. **Look for bulges and notches.** A bar that sticks out is a generation larger than those around it, such as people born in a baby boom. A dent is a smaller one, for example from a fall in births or deaths in a war. Each one moves up five years every five years.
6. **Compare the two sides.** Slightly more boys than girls are born, about 105 per 100, so the bottom bars usually lean male. Women live longer than men on average, so the top bars lean female. A big difference in the working ages can mean that many men or many women have moved in or out for work.

## Types of population pyramid

Most population pyramids fit one of three shapes. Each one reflects how many babies are born and how long people live.

![Three simplified population pyramids. Expansive: a wide base that narrows quickly to a point, from many births and shorter lives, so the population is young and growing. Stationary: bars of similar width until old age, from low births and deaths, so the population is roughly stable. Constrictive: a base narrower than the middle, from fewer births and longer lives, so the population is ageing and may shrink](./population-pyramid-shapes.svg)

| Type | Shape | What it means | Births and deaths |
| --- | --- | --- | --- |
| **Expansive** | A true pyramid: the widest bar is at the bottom and each bar above is shorter | A young population that is growing. Each new generation is bigger than the last | Many births; many people die before old age |
| **Stationary** (stable) | Straight sides, like a column or a beehive, until it tapers at the oldest ages | A population that is staying about the same size | Few births and few deaths until old age |
| **Constrictive** | Narrower at the base than in the middle | An ageing population, which may shrink unless people move in | Births have fallen below earlier levels; most people live long lives |

**Expansive** pyramids are typical of countries where families are large and many people die young. **Constrictive** pyramids are typical of countries where families have become smaller and people live long lives. A population's pyramid changes shape slowly over decades, so the same country can move from one type to another.

### Population pyramids and the demographic transition

The **demographic transition** is the model demographers use to describe how a country's birth and death rates change as it develops. It is usually told in five stages, and the pyramid's shape changes at each one:

| Stage | Birth and death rates | Typical pyramid shape |
| --- | --- | --- |
| 1 | Both high | Expansive, with a wide base and a sharp point: few people reach old age |
| 2 | Deaths fall, births stay high | Expansive, with a wider base as more children survive; the population grows fast |
| 3 | Births start to fall | The base stops widening and the sides become straighter |
| 4 | Both low | Stationary: similar-sized bars up to old age |
| 5 | Births stay low, and in many places fall below deaths | Often constrictive: the base narrows below the middle |

Stage 5 is the least settled part of the model: births may stay low, fall further or rise again. Real countries don't all follow the stages neatly.

### What does a "healthy" population pyramid look like?

There's no ideal shape, only trade-offs. A very wide base means many children who depend on the adults around them, and often many deaths in childhood. A very narrow base means fewer future workers to support a growing number of older people, which puts pressure on pensions and health care. A stationary shape is the easiest to plan for: each generation is about the same size, so the balance between age groups changes slowly.

## A worked example: reading the pyramid at the top

Here is the chart at the top of this page, grouped into the three age bands demographers use most often:

| Age band | People (thousands) | Share of the population |
| --- | --- | --- |
| Children (0 to 14) | 1,317 | 14.4% |
| Working age (15 to 64) | 6,019 | 66.0% |
| Older people (65 and over) | 1,779 | 19.5% |
| **Total** | **9,115** | **100%** |

What the chart tells you:

- **It is constrictive.** The youngest group, 0 to 4, has 410,000 people. The largest, 55 to 59, has 750,000: almost twice as many. Fewer babies are being born now than 55 years ago.
- **It has a bulge at 50 to 59,** a baby-boom generation. In ten to fifteen years it will move into the 65-and-over band, so the number of older people will rise quickly.
- **It has a notch at 40 to 44,** a generation smaller than those either side of it.
- **Women outnumber men at the oldest ages.** In the 85+ group there are 110,000 women and 50,000 men.
- **The dependency ratio is 51.** The **age dependency ratio** compares the people of an age to depend on others (under 15 and 65 and over) with the people of working age (15 to 64): (1,317 + 1,779) ÷ 6,019 × 100 = 51.4. So there are about 51 children and older people for every 100 people of working age. Older people make up more of that (29.6) than children do (21.9).

### How to describe a population pyramid

Use this template when you write about a population pyramid:

> In **[year]**, **[place]**'s population pyramid is **[expansive / stationary / constrictive]**. The largest age group is **[age group]**, and **[children / people of working age / people aged 65 and over]** make up **[share]** of the population. **[Note any bulge, notch or difference between the sexes, and what it means for the future.]**

**Worked example:** "This country's population pyramid is constrictive. The largest age group is 55 to 59, and people aged 65 and over make up 19.5% of the population, more than children under 15 (14.4%). A large generation now in its fifties will reach retirement age over the next fifteen years, so the share of older people will keep rising."

## When to use a population pyramid

Use a population pyramid when you want to show **how a group of people is spread across ages, split into two groups**, and to compare the two sides. Countries and regions are the classic use, but the same chart works for any population that has ages, such as:

- **planning services:** schools, hospitals and care homes for a town or region;
- **a workforce:** how many employees are near retirement, by sex;
- **a customer base or a clinical trial:** who your users or patients are, by age and sex;
- **change over time:** two pyramids for the same place, years apart, or an outline of one year drawn over another.

| Chart | Best for |
| --- | --- |
| **Population pyramid** | Age structure split into two groups, with ages in order up the middle |
| [Diverging bar chart](/learn/bar-chart/#diverging-bar-chart) | Any two opposite groups, or positive and negative values, back to back across a centre line, for categories that need not be ages |
| [Stacked bar chart](/learn/bar-chart/#stacked-bar-chart) | Each category's total and its parts, when the total matters more than comparing the two sides |
| [Histogram](/learn/histogram/) | How one set of values (such as everyone's age) is spread out, without splitting it into two groups |
| [Line chart](/learn/line-chart/) | How one number, such as the share of people over 65, changes over many years |

## Common population pyramid mistakes

- **Different scales on the two sides.** If the male and female axes have different ranges, the bars can't be compared. Use one scale for both sides, starting at zero in the middle.
- **Comparing counts across places of different sizes.** A country of 100 million will always have longer bars than one of 5 million. To compare shapes, use the **percentage** of the total population in each bar.
- **Negative numbers on the left side.** Some chart tools draw the male bars as negative values, so the axis reads −200, −100, 0. Show the left side's labels as positive numbers: there's no such thing as −200,000 people.
- **Uneven age groups.** Mixing one-year and five-year groups, or ending with a wide open group such as "65+", changes the bar lengths and distorts the shape. Keep every group the same width, and say what the top group covers.
- **Reading it as a trend.** A pyramid is a snapshot of one year. It hints at the future, but to show change, compare pyramids from different years.
- **Colours that don't mean anything, or clash.** Use one colour per side and keep it the same in every chart. Choose two colours that people with colour blindness can tell apart, such as blue and orange, and label the sides as well.

## How to create a population pyramid in JavaScript, React or Angular

SciChart.js has no separate pyramid series: you build one from bar series on a vertical chart, with two value axes laid out back to back. Because SciChart.js draws with WebGL and WebGPU, the chart stays smooth to zoom and pan, even with one-year age groups or many years of data. Try the chart below: hover over a bar to see the numbers for that age group, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="population pyramid" demo="population-pyramid" docs="/2d-charts/chart-types/stacked-column-renderable-series/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        StackedColumnRenderableSeries,
        StackedColumnCollection,
        XyDataSeries,
        TextLabelProvider,
        BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
        EAxisAlignment,
        EAutoRange,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // Age group labels, and one count per age group for each sex, youngest first
        const { ageGroups, male, female } = getYourPopulationData();
        const xValues = ageGroups.map((_, index) => index);

        // Age axis on the left makes the chart vertical, so the bars run sideways
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                flippedCoordinates: true,
                labelProvider: new TextLabelProvider({ labels: ageGroups }),
                autoTicks: false,
                majorDelta: 1
            })
        );

        // Two value axes side by side along the bottom, on one shared scale; the female axis is flipped so its bars grow to the right
        const range = new NumberRange(0, Math.max(...male, ...female) * 1.1);
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                id: "maleAxis",
                axisAlignment: EAxisAlignment.Bottom,
                autoRange: EAutoRange.Never,
                visibleRange: range
            }),
            new NumericAxis(wasmContext, {
                id: "femaleAxis",
                axisAlignment: EAxisAlignment.Bottom,
                flippedCoordinates: true,
                autoRange: EAutoRange.Never,
                visibleRange: range
            })
        );
        sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy =
            new BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy();

        // One stacked column collection per side, each linked to its own value axis
        const maleSide = new StackedColumnCollection(wasmContext, { yAxisId: "maleAxis", dataPointWidth: 0.9 });
        maleSide.add(
            new StackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: male, dataSeriesName: "Male" }),
                fill: "#50C7E0CC",
                stackedGroupId: "male"
            })
        );
        const femaleSide = new StackedColumnCollection(wasmContext, { yAxisId: "femaleAxis", dataPointWidth: 0.9 });
        femaleSide.add(
            new StackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: female, dataSeriesName: "Female" }),
                fill: "#F39C3FCC",
                stackedGroupId: "female"
            })
        );
        sciChartSurface.renderableSeries.add(maleSide, femaleSide);
        sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
        return { sciChartSurface };
    };

    export const PopulationPyramid = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        StackedColumnRenderableSeries,
        StackedColumnCollection,
        XyDataSeries,
        TextLabelProvider,
        BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
        EAxisAlignment,
        EAutoRange,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    @Component({
        selector: "app-population-pyramid",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class PopulationPyramidComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // Age group labels, and one count per age group for each sex, youngest first
            const { ageGroups, male, female } = getYourPopulationData();
            const xValues = ageGroups.map((_, index) => index);

            // Age axis on the left makes the chart vertical, so the bars run sideways
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    flippedCoordinates: true,
                    labelProvider: new TextLabelProvider({ labels: ageGroups }),
                    autoTicks: false,
                    majorDelta: 1
                })
            );

            // Two value axes side by side along the bottom, on one shared scale; the female axis is flipped so its bars grow to the right
            const range = new NumberRange(0, Math.max(...male, ...female) * 1.1);
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    id: "maleAxis",
                    axisAlignment: EAxisAlignment.Bottom,
                    autoRange: EAutoRange.Never,
                    visibleRange: range
                }),
                new NumericAxis(wasmContext, {
                    id: "femaleAxis",
                    axisAlignment: EAxisAlignment.Bottom,
                    flippedCoordinates: true,
                    autoRange: EAutoRange.Never,
                    visibleRange: range
                })
            );
            sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy =
                new BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy();

            // One stacked column collection per side, each linked to its own value axis
            const maleSide = new StackedColumnCollection(wasmContext, { yAxisId: "maleAxis", dataPointWidth: 0.9 });
            maleSide.add(
                new StackedColumnRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: male, dataSeriesName: "Male" }),
                    fill: "#50C7E0CC",
                    stackedGroupId: "male"
                })
            );
            const femaleSide = new StackedColumnCollection(wasmContext, { yAxisId: "femaleAxis", dataPointWidth: 0.9 });
            femaleSide.add(
                new StackedColumnRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: female, dataSeriesName: "Female" }),
                    fill: "#F39C3FCC",
                    stackedGroupId: "female"
                })
            );
            sciChartSurface.renderableSeries.add(maleSide, femaleSide);
            sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- **A vertical chart turns columns into bars.** Setting the X axis to `axisAlignment: EAxisAlignment.Left` puts the age groups up the left side, so every column series draws sideways. `flippedCoordinates: true` puts the youngest group at the bottom. See [vertical charts](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/).
- **Two value axes, back to back.** Both value axes sit along the bottom. On a vertical chart a value axis runs from right to left, so the male bars grow leftwards from the centre. The female axis has `flippedCoordinates: true`, so its bars grow to the right, and `BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy` lays the two axes side by side instead of one under the other. See [horizontally stacked axes](/2d-charts/axis-api/multi-axis-and-layout/horizontally-stacked-axis-layout/). Because the values stay positive, the axis labels and tooltips need no extra formatting.
- **Keep the two sides on one scale.** Give both axes the same `visibleRange`, starting at zero. The live demo also copies any zoom on one axis to the other, so the sides never drift apart.
- **Each side is a [StackedColumnCollection](/2d-charts/chart-types/stacked-column-renderable-series/)** with its own `yAxisId`. Add more `StackedColumnRenderableSeries` to a side to split its bars further, for example by region of birth.

**See it in the demo app:** [JavaScript population pyramid](https://www.scichart.com/demo/javascript/population-pyramid) · [React population pyramid](https://www.scichart.com/demo/react/population-pyramid) · [Angular population pyramid](https://www.scichart.com/demo/angular/population-pyramid)

**Go deeper:** [SciChart.js population pyramid documentation](/2d-charts/chart-types/stacked-column-renderable-series/) for the stacked column series it is built from, and the [SciChart.js vertical charts documentation](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/).

## Frequently asked questions

### What does a population pyramid show?

A population pyramid shows how many people of each age and sex live in a place at one moment. Each horizontal bar is an age group, with males on one side of a centre line and females on the other. Its shape tells you whether births are rising or falling, how quickly people die at each age, and whether the population is young and growing or older and ageing.

### What are the three types of population pyramid?

The three main types are expansive, stationary and constrictive. An expansive pyramid has a wide base that narrows quickly, from many births and shorter lives, so the population is young and growing. A stationary pyramid has bars of similar width until old age, from low birth and death rates. A constrictive pyramid is narrower at the base than in the middle, because births have fallen, so the population is ageing.

### What is a constrictive population pyramid?

A constrictive population pyramid has a base that is narrower than the bars above it, so the widest part is in the middle ages rather than at the bottom. It means fewer children are being born than in earlier generations, and people live long lives. Without enough migration, a population with this shape gets older and may start to shrink.

### What does a healthy population pyramid look like?

There is no single healthy shape. A very wide base means many dependent children, and often many deaths in childhood. A very narrow base means fewer future workers to support a growing number of older people. A shape with similar numbers in each age group until old age, like a stationary pyramid, means each generation is about the same size, so the balance between children, workers and older people changes slowly.

### Why is it called a population pyramid?

It is called a pyramid because, for most of history, populations had many young people and far fewer old people, so the bars made a triangle with a wide base and a point at the top. Many countries' charts no longer look like that, but the name has stuck. It is also called an age-sex pyramid or an age structure diagram.

### How do I make a population pyramid in JavaScript?

Put the age groups on a vertical axis and draw two sets of horizontal bars that start from a shared centre line: one for males going left and one for females going right. With SciChart.js you make the chart vertical by placing the X axis on the left, add two value axes along the bottom, flip the female one so its bars grow to the right and lay them side by side with `BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy`, then draw each side as a `StackedColumnRenderableSeries` in a `StackedColumnCollection`. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- United Nations, Department of Economic and Social Affairs, Population Division (2024), [World Population Prospects 2024](https://population.un.org/wpp/). Population estimates and projections by age and sex for every country, the data behind most published population pyramids.
- U.S. Census Bureau, [International Database (IDB)](https://www.census.gov/data-tools/demo/idb/). Population pyramids and age-sex data for countries and areas of the world.
- Roser, M., [Demographic transition: why is rapid population growth a temporary phenomenon?](https://ourworldindata.org/demographic-transition) Our World in Data. The five stages of the demographic transition and how the population pyramid changes through them.
- Ritchie, H. and Roser, M., [Gender ratio](https://ourworldindata.org/gender-ratio). Our World in Data. The expected sex ratio at birth of about 105 boys per 100 girls, and why women outnumber men at older ages.
- Ritchie, H. and Roser, M., [Age structure](https://ourworldindata.org/age-structure). Our World in Data. Population pyramids, median age and the age dependency ratio.

<LearnCta position="bottom" chart="population pyramid" demo="population-pyramid" docs="/2d-charts/chart-types/stacked-column-renderable-series/" />
