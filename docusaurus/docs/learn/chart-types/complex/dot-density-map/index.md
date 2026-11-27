---
sidebar_position: 20
sidebar_label: Dot Density Map
title: "Dot Density Map: What It Is & How to Make One (Interactive Example)"
description: "What a dot density map is, how to read one, and how to make one: choosing the dot value and dot size, placing the dots, and mapping two categories in two colours."
keywords:
    [
        "dot density map",
        "what is a dot density map",
        "dot density map example",
        "dot map",
        "dot distribution map",
        "how to make a dot density map",
        "dot value",
        "dot density map vs choropleth",
        "categorical dot map"
    ]
image: /img/learn/dot-density-map-og.png
related: [population-density-map, choropleth-map, scatter-plot, bubble-chart]
datePublished: 2026-11-26
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a dot density map show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A dot density map shows how a count is spread over a region: where the things counted are crowded together, where they are thin on the ground, and roughly how many there are. Each dot stands for a fixed number, such as 10,000 cattle, so the number of dots in an area gives its total and how closely they are packed gives its density. It does not show exact locations, because each dot is placed somewhere inside its area, usually at random." }
                },
                {
                    "@type": "Question",
                    "name": "What is an example of a dot density map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A map of US livestock with one orange dot for every 10,000 cattle and one blue dot for every 10,000 hogs, placed inside each county, is a dot density map. It shows hogs packed into Iowa, southern Minnesota and eastern North Carolina, and cattle spread across the Great Plains, Texas and California's Central Valley. Other common examples are maps of population, farms, votes and crop acreage, each with one dot per fixed number." }
                },
                {
                    "@type": "Question",
                    "name": "Should I use a dot density map or a proportional symbol map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a dot density map when the things you count are spread across each area, such as people, animals or farms, and you want to show the pattern and how dense it is. Use a proportional symbol map, with one circle sized by the total, when the count belongs at a point, such as a city's population, or when readers need to compare the totals of areas. Nobody counts a crowd of dots, so a sized symbol is the better way to show a total." }
                },
                {
                    "@type": "Question",
                    "name": "Who made the first dot density map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The first dot density map is usually credited to Armand Joseph Frère de Montizon, whose 1830 map of the population of France placed one dot for every 10,000 people* inside each département. His method went almost unnoticed at the time, and other mapmakers took up dot maps independently later in the 19th century. * This dot value comes from later histories of cartography, including Robinson (1982) in the sources below." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a dot density map in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Join each area's count to its outline, choose a dot value, and work out how many dots each area gets: its count divided by the dot value, rounded. Place that many random points inside each area, for example by cutting the outline into triangles and choosing a triangle in proportion to its area. With SciChart.js, draw all the dots in one XyScatterRenderableSeries, with a palette provider for a colour per category, and the borders with a FastLineRenderableSeries. The same code runs in React or Angular through scichart-react or scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Dot Density Map

## What is a dot density map?

A **dot density map**, also known as a dot map or dot distribution map, is a thematic map that marks one dot for every fixed number of something, such as 1 dot = 10,000 cattle, inside the area where those things were counted. Crowded dots mean high density; scattered dots mean low density.

![A dot density map of the contiguous United States with one orange dot per 10,000 cattle and one blue dot per 10,000 hogs, placed at random inside each county. Blue dots pack tightly across Iowa, southern Minnesota and eastern North Carolina; orange dots spread across the Great Plains, Texas, Florida and California's Central Valley](/img/learn/dot-density-map-og.png)

*Cattle (orange) and hogs (blue) on US farms, one dot per 10,000 head, from the 2022 Census of Agriculture. [Try the interactive version](#how-to-create-a-dot-density-map-in-javascript-react-or-angular), and change the dot value.*

:::tip Key takeaways
- Each dot stands for the same number, called the dot value. An area's dot count gives its total, and how closely its dots are packed gives its density.
- Map counts, not rates. Dots suit totals such as animals, people or farms, never percentages or averages.
- The dot value and dot size decide what the map can show: set them so the busiest areas just begin to merge.
- Unless extra data guides them, the dots go at random places within each area, so a dot is never an address.
- Two or more colours turn it into a categorical dot map. Shuffle the drawing order so that no colour hides another.
:::

## How to read a dot density map

The diagram below zooms into eight counties in eastern North Carolina, the area with the highest density of hogs on the national map, at one dot per 10,000 head.

![Eight counties in eastern North Carolina drawn as outlines, with one blue dot per 10,000 hogs and one orange dot per 10,000 cattle scattered inside each county. Duplin and Sampson counties are packed with blue dots, about 188 and 185 of them, while Onslow and Jones have a few dozen. Numbered notes beside the map explain the steps: read the dot value, count the dots and multiply, compare how tightly the dots are packed, and remember that each dot sits at a random place in its county](./dot-density-map-how-to-read.svg)

1. Find the dot value in the legend. Here 1 dot = 10,000 head, and blue means hogs.
2. Count and multiply to estimate a total. Duplin County has 188 blue dots, so about 1.9 million hogs; the census counted 1,884,573. Few people count dots in practice, and readers tend to underestimate totals in crowded areas.
3. Compare how closely the dots are packed to judge density. Duplin has about 2,300 hogs per square mile of land, Onslow under 200.
4. Look at what has no dots. Bladen County has 4,358 cattle: less than half a dot, so it rounds to none. A blank area can mean small, not zero.
5. Remember the dots aren't farms. The census gives one figure per county, so each dot is put at a random place inside its county. Clusters within one county are chance; only patterns across many counties reflect the data.

## A dot density map example: cattle and hogs in the United States

The map at the top of this page uses the 2022 Census of Agriculture from the US Department of Agriculture (USDA), which counted 87,954,742 cattle and calves and 73,817,751 hogs and pigs on US farms on 31 December 2022. The demo maps every county of the 48 contiguous states.

The two animals make very different patterns:

- Hogs are concentrated. Iowa alone had 23.8 million, 32% of the US total. In North Carolina, the eight counties in the diagram held 70% of the state's hogs on 12% of its land. Half of the 2,368 counties with a published hog figure had fewer than 240 hogs.
- Cattle are spread out. 3,005 counties had a published figure above zero. There are clusters in the Texas Panhandle, where Deaf Smith County alone had 700,069, and in California's Central Valley, where Tulare County had 1,080,665, the most of any county.

A dot density map suits both. Hogs show up as tight blue clusters, and the cattle as a broad orange spread. A choropleth of head per square mile would show the same density, but in one colour per animal, so the two patterns would need two maps.

### How to describe a dot density map

Name the dot value, the main concentrations, the empty areas and anything surprising. For example: *"At one dot per 10,000 head, hogs cluster tightly in Iowa, southern Minnesota and eastern North Carolina, while cattle spread across the Great Plains and the West, densest in the Texas Panhandle and California's Central Valley. Nevada and much of Arizona show few dots of either colour."*

## Choosing the dot value and dot size

Each dot's **dot value** is the number of things it stands for, and its **dot size** is how big it is drawn. Together they decide how many dots there are and whether they merge. For the cattle and hogs data, by county:

| Dot value | Cattle dots | Hog dots | Counties with a figure but no dot |
| --- | --- | --- | --- |
| 1 dot = 1,000 head | 87,773 | 73,501 | 107 of 3,005 for cattle; 1,487 of 2,368 for hogs |
| 1 dot = 10,000 head | 8,727 | 7,301 | 705 for cattle; 1,807 for hogs |
| 1 dot = 50,000 head | 1,538 | 1,429 | 1,949 for cattle; 1,961 for hogs |

A common guideline from cartography is to choose the two together so that:

- the areas with the smallest counts still get two or three dots;
- the dots in the busiest areas just begin to touch.

Use a round dot value that readers can multiply in their heads, such as 1,000 or 10,000, and expect to try a few. Very uneven data, like the hogs above, can't meet both conditions: the smallest county with hogs had 3, and Duplin had 1,884,573. In that case, decide which matters more. A low dot value with small, see-through dots keeps the small counties; a high value with larger dots keeps the clusters readable.

Small dots also suggest precision. A map with 160,000 tiny dots looks as if it shows each farm, though every dot is a share of a county total.

## Where to put the dots

### Random placement, and the size of the areas

Most dot density maps place each area's dots at random inside it, spread evenly over its land. That is honest when the things counted really are spread through the area, and misleading when they aren't. The smaller the areas, the less a dot can stray.

Switch the demo from **Counties** to **States** to see the difference. With one figure per state, North Carolina's 819 hog dots (at 10,000 per dot) spread evenly from the Appalachians to the coast, so the eight counties in the diagram get about 12% of them. With county figures they get 70%.

Placing dots on a regular grid inside each area is worse than random: the density changes abruptly at every border, so the borders stand out more than the pattern.

### Dasymetric placement

**Dasymetric** placement uses other data to keep dots off land where the thing can't be, and to weight them towards land where it's likely to be. For people, that means leaving out water, parks and uninhabited land, or placing dots by building footprints. For livestock, it could mean placing cattle on pasture and hogs near known farm sites. It needs a second dataset, and the dots remain estimates.

### Missing and withheld counts

The Census of Agriculture withholds a county's figure, marked (D), when publishing it would reveal one farm's numbers. Across the demo's 3,108 counties and county-equivalents, 513 have a withheld hog figure and 46 a withheld cattle figure. The state total still includes them, so the demo spreads each state's leftover count over its withheld counties. In North Carolina, 263,909 hogs, about 26 dots at 10,000 per dot, are shared among 16 counties. Leaving them out would undercount the state, and putting them in a single county would invent a cluster.

## Two or more colours: categorical dot maps

A **categorical dot map** uses one dot colour per category, such as cattle and hogs, two crops, or groups of people, so the mix of categories shows up in one map. Three things matter:

- Colours that stay distinct on the background and for colour-blind readers. Orange and blue work for most people; avoid red with green. More than four or five colours become hard to tell apart in small dots.
- The drawing order. Dots drawn later cover dots drawn earlier. If all the cattle are drawn after all the hogs, places with both look like cattle country. Use the demo's **On top** buttons to see this in the 482 counties that have both animals at 10,000 per dot. Shuffling the order mixes the colours fairly.
- The same dot value for every colour, so that equal numbers of dots mean equal counts. Different dot values in different colours are easily misread.

The same ideas apply to a single dot map of people, which is covered with US population data in the [population density map guide](/learn/chart-types/complex/population-density-map/#what-is-a-dot-density-map).

## One-to-one and one-to-many dot maps

The name covers two kinds of map:

- In a **one-to-one** dot map, each dot is one real thing at its real location, such as an earthquake or a shop. It is a map of points, and the position of each dot is the data.
- In a **one-to-many** dot map, each dot stands for many things counted in an area, as on this page. The count is the data; the position within the area is a guess.

"Dot density map" usually means the one-to-many kind. If you have exact locations, you don't need random placement. Plot the points themselves, and switch to a [heatmap](/learn/chart-types/cartesian/heatmap/) or a grid when there are too many to see.

## When to use a dot density map

Use a dot density map for counts of things that are spread across the land, when the overall pattern matters more than the exact figure for each area.

| Map | What it shows | Use it when |
| --- | --- | --- |
| Dot density map | A count, as dots of a fixed value placed inside each area | Showing where things are and how dense, and comparing two or three categories on one map |
| [Choropleth map](/learn/chart-types/complex/choropleth-map/) | A rate or average for each area, as a colour | Mapping percentages, rates per person, or densities, and reading each area's value |
| Proportional symbol map | A total for each area or place, as a sized circle | The count belongs at a point, such as a city, or readers must compare totals: like a [bubble chart](/learn/chart-types/cartesian/bubble-chart/) on a map |
| One-to-one point map | Each record at its real location | You have exact coordinates for every record |
| Grid map or [heatmap](/learn/chart-types/cartesian/heatmap/) | Counts or density on equal squares or hexagons | You have point data, or too many records to draw as dots |

Don't use a dot density map for averages, percentages or rates, such as yield per acre or the share of farms with hogs. There is no sensible way to draw "one dot per 2%". Use a choropleth for those.

## Common dot density map mistakes

- **Dots for a rate.** Dot density maps need counts. Map rates and averages on a choropleth.
- **A dot value too high.** Small areas round to zero dots and look empty. At 10,000 head per dot, 705 counties with cattle get no dot.
- **Dots that merge into blobs.** In dense areas, dots that overlap completely hide how dense the area is. Use smaller dots, a higher dot value, or see-through dots.
- **One colour always on top.** Drawing one category after another hides the first wherever they overlap. Shuffle the drawing order.
- **No dot value in the legend.** Readers can't estimate a total without it. Show "1 dot = …" next to the colours.
- **A projection that changes areas.** Readers judge density from how closely dots are packed, so an area-distorting projection changes the density they see. Use an equal-area projection.
- **Big areas with random dots.** A dot placed at random in a large, mostly empty area looks like a real place. Use the smallest areas you have data for, or dasymetric placement.

## How to create a dot density map in JavaScript, React or Angular

SciChart.js renders with WebGL, so a map of 160,000 dots stays smooth while you zoom and pan, and a new dot value appears straight away. The demo below draws all the dots in a single scatter series, coloured by animal, over the state borders.

Choose the dot value (**1 dot =**), the areas the dots are placed in (**Dots in**) and the drawing order (**On top**) with the buttons. Hover over a county to see its name and figures. Scroll to zoom, drag to pan, and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={560} name="./Basic/demo" />

<LearnCta position="top" chart="dot density map" demo="map-example" demoLabel="choropleth map" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />

Here is the code for this dot density map. The demo receives each county as a name, a state, its cattle and hog counts and an encoded outline, then decodes the outline into rings of `[x, y]` points in kilometres:

```json
{
    "name": "Duplin",
    "state": "NC",
    "cattle": 21940,
    "hogs": 1884573,
    "rings": [[[1601, 1499], [1631, 1503], [1637, 1501], …, [1607, 1449]]]
}
```

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    // dotDensityMap from the JavaScript tab, saved as dotDensityMap.ts
    import { dotDensityMap } from "./dotDensityMap";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up.
    // getYourCountyData() returns your areas in the format of getUsLivestockData() in the JavaScript tab
    const initChart = (rootElement: string | HTMLDivElement) => dotDensityMap(rootElement, getYourCountyData());

    export const DotDensityMap = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 560 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    // dotDensityMap from the JavaScript tab, saved as dotDensityMap.ts
    import { dotDensityMap } from "./dotDensityMap";

    @Component({
        selector: "app-dot-density-map",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 560px"></scichart-angular>`
    })
    export class DotDensityMapComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up.
        // getYourCountyData() returns your areas in the format of getUsLivestockData() in the JavaScript tab
        initChart = (rootElement: string | HTMLDivElement) => dotDensityMap(rootElement, getYourCountyData());
    }
    ```
</CodeSnippetBlock>

Key points:

- Every dot of both colours is in one [XyScatterRenderableSeries](/2d-charts/chart-types/xy-scatter-renderable-series/) with a small `SquarePointMarker`. A palette provider (`overridePointMarkerArgb`) colours each dot by its animal, so the two colours can be shuffled together.
- `placeDots` gives each area its count divided by the dot value, rounded. Outlines are first cut into triangles (`triangulateRing`); each dot chooses a triangle with a chance in proportion to its size, then a random spot within it. The random numbers are seeded, so every reload draws the same map.
- `getDotAreas` decides where the dots may go: each county, a state's withheld counties together, or each whole state. Changing a setting refills the same data series.
- The state borders are one [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series/) with NaN gaps between them. Hover is a custom modifier (`CountyTooltipModifier`, based on `CustomChartModifier2D`) that runs a point-in-polygon test. A `preRender` handler gives both axes the same kilometres per pixel, so the map never stretches.

**See it in the demo app:** [JavaScript choropleth map](https://www.scichart.com/demo/javascript/map-example) · [React choropleth map](https://www.scichart.com/demo/react/map-example) · [Angular choropleth map](https://www.scichart.com/demo/angular/map-example), and a [React scatter chart](https://www.scichart.com/demo/react/scatter-chart).

**Go deeper:** [SciChart.js scatter chart documentation](/2d-charts/chart-types/xy-scatter-renderable-series/) and [SciChart.js choropleth map documentation](/2d-charts/chart-types/choropleth-map/).

## Frequently asked questions

### What does a dot density map show?

A dot density map shows how a count is spread over a region: where the things counted are crowded together, where they are thin on the ground, and roughly how many there are. Each dot stands for a fixed number, such as 10,000 cattle, so the number of dots in an area gives its total and how closely they are packed gives its density. It does not show exact locations, because each dot is placed somewhere inside its area, usually at random.

### What is an example of a dot density map?

A map of US livestock with one orange dot for every 10,000 cattle and one blue dot for every 10,000 hogs, placed inside each county, is a dot density map. It shows hogs packed into Iowa, southern Minnesota and eastern North Carolina, and cattle spread across the Great Plains, Texas and California's Central Valley. Other common examples are maps of population, farms, votes and crop acreage, each with one dot per fixed number.

### Should I use a dot density map or a proportional symbol map?

Use a dot density map when the things you count are spread across each area, such as people, animals or farms, and you want to show the pattern and how dense it is. Use a proportional symbol map, with one circle sized by the total, when the count belongs at a point, such as a city's population, or when readers need to compare the totals of areas. Nobody counts a crowd of dots, so a sized symbol is the better way to show a total.

### Who made the first dot density map?

The first dot density map is usually credited to Armand Joseph Frère de Montizon, whose 1830 map of the population of France placed one dot for every 10,000 people\* inside each département. His method went almost unnoticed at the time, and other mapmakers took up dot maps independently later in the 19th century.

<small>\* This dot value comes from later histories of cartography, including Robinson (1982) in the sources below.</small>

### How do I make a dot density map in JavaScript?

Join each area's count to its outline, choose a dot value, and work out how many dots each area gets: its count divided by the dot value, rounded. Place that many random points inside each area, for example by cutting the outline into triangles and choosing a triangle in proportion to its area. With SciChart.js, draw all the dots in one `XyScatterRenderableSeries`, with a palette provider for a colour per category, and the borders with a `FastLineRenderableSeries`. The same code runs in React or Angular through `scichart-react` or `scichart-angular`.

## Sources

- USDA National Agricultural Statistics Service, [2022 Census of Agriculture, Volume 1, Chapter 2: County Level Data](https://www.nass.usda.gov/Publications/AgCensus/2022/Full_Report/Volume_1,_Chapter_2_County_Level/), tables 11 (cattle and calves) and 12 (hogs and pigs). Public domain; the inventory of each county and state on 31 December 2022, and the US totals. (D) marks a figure withheld to avoid disclosing data for individual farms.
- US Census Bureau, [Cartographic Boundary Files](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html), 2020 counties at 1:20,000,000 (`cb_2020_us_county_20m`). Public domain; the county outlines and land areas used in the demo and the diagram, re-projected to an equal-area projection and simplified.
- Roth, R. E. (2010), [Dot density maps](https://geography.wisc.edu/cartography/projects/publications/Roth_2010_EG.pdf). In B. Warf (ed.), *Encyclopedia of Geography*, SAGE. One-to-one and one-to-many dot maps, mapping counts rather than rates, choosing dot size and dot value together (two or three dots in the smallest areas, dots just merging in the densest), placement guided by other data, and readers' underestimation of totals in dense areas.
- Robinson, A. H. (1982), *Early Thematic Mapping in the History of Cartography*. University of Chicago Press. The history of early thematic maps, including Frère de Montizon's dot map and how little notice it received.
- Frère de Montizon, A. J. (1830), [Carte philosophique figurant la population de la France](https://gallica.bnf.fr/ark:/12148/btv1b8492261j). Bibliothèque nationale de France, Gallica. The map itself; the online scan wasn't available when this guide was written (November 2026).

<LearnCta position="bottom" chart="dot density map" demo="map-example" demoLabel="choropleth map" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />
