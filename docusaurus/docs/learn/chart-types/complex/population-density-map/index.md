---
sidebar_position: 50
sidebar_label: Population Density Map
title: "Population Density Map: Choropleth, Dot Density & 3D Compared"
description: "What a population density map is and how to read one, with the same Census data mapped three ways: a choropleth, a dot density map and 3D columns."
keywords:
    [
        "population density map",
        "dot density map",
        "what is a population density map",
        "how to read a population density map",
        "what is a dot density map",
        "dot distribution map",
        "3d population density map",
        "choropleth vs dot density map",
        "people per square mile"
    ]
image: /img/learn/population-density-map-og.png
related: [choropleth-map, heatmap, scatter-plot, big-data-visualization]
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
                    "name": "What does a population density map show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A population density map shows where people live closely packed and where they are spread thinly. Each area, square or dot stands for people per unit of land, such as people per square mile, so you can see cities, corridors along coasts and rivers, and empty regions. It does not show how many people live in an area in total: a big, sparse county can hold more people than a small, dense one." }
                },
                {
                    "@type": "Question",
                    "name": "What type of map shows population density?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Population density is most often shown on a choropleth map, which shades each area, such as a county or country, by its people per square mile or square kilometre. A dot density map shows it with one dot for a fixed number of people, so dots crowd together where density is high. Grid maps use equal squares or hexagons instead of areas, and 3D maps raise each area or square to a height set by its density. All of them are thematic maps." }
                },
                {
                    "@type": "Question",
                    "name": "How is population density calculated?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Population density is the number of people divided by the land area they live on. Kershaw County, South Carolina, had 65,403 people on 726.6 square miles of land in 2020, so its density was 90 people per square mile. Official figures usually use land area only, leaving out lakes and the sea. To convert people per square mile to people per square kilometre, divide by 2.59." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a dot density map and a choropleth map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A choropleth map shades each whole area by one value, such as its population density, so you read the colour against a legend. A dot density map draws one dot for a fixed number of people, such as 1 dot = 1,000 people, inside each area, so you see density from how closely the dots are packed. The choropleth gives each area's exact class; the dot density map shows the total number of people too, but where each dot falls within its area is chosen at random." }
                },
                {
                    "@type": "Question",
                    "name": "Are 3D population density maps a good idea?",
                    "acceptedAnswer": { "@type": "Answer", "text": "3D population density maps are good at showing where people are concentrated: a few tall columns over the big cities stand out at once. They are poor at exact comparison, because tall columns hide the ones behind them, perspective makes far columns look shorter, and people judge heights less accurately than positions on a flat scale. Use them with tooltips, a top-down view or a 2D map beside them." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a population density map in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Load the area outlines as GeoJSON or another polygon format, join each area's population and land area to it, and divide one by the other for the density. With SciChart.js, cut the outlines into triangles and draw them with a FastTriangleRenderableSeries, one series per colour class, for a choropleth. For a dot density map, put random points inside each area and draw them all in one XyScatterRenderableSeries, which stays smooth with over a million dots. For 3D, use a ColumnRenderableSeries3D. The same code runs in React or Angular through scichart-react or scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Population Density Map

## What is a population density map?

A **population density map** is a map of how many people live on each unit of land, such as people per square mile or per square kilometre, across a region. It is usually drawn as a choropleth, with areas shaded by density, as a dot density map, with one dot per set number of people, or in 3D, with heights.

![A choropleth map of the 3,108 counties of the contiguous United States, shaded by 2020 population density in five classes from under 10 to over 1,000 people per square mile. The densest counties form a band from Boston to Washington, and cluster around cities such as Chicago, Atlanta, Los Angeles and San Francisco, while many counties in the Great Plains and the West have under 10 people per square mile](/img/learn/population-density-map-og.png)

*Population density of every county in the contiguous United States, 2020 Census. [Try the interactive version](#how-to-create-a-population-density-map-in-javascript-react-or-angular), and switch it to a dot density map.*

:::tip Key takeaways
- Population density is people divided by land area. A density map shows where people are packed closely, not how many live in each area.
- A choropleth is best for reading and comparing each area's density. A dot density map shows where the people are, but the dots are placed at random inside each area.
- A 3D map shows concentration at a glance, but hides columns behind columns and makes heights hard to compare.
- Big, empty areas fill much of a US county map: counties under 10 people per square mile cover 36.5% of the land but hold 1.2% of the people.
:::

## How to read a population density map

A density figure is a count divided by an area. The diagram below follows one county through that sum and then onto the three kinds of map on this page.

![Kershaw County, South Carolina, mapped three ways. First, its 65,403 people divided by 726.6 square miles of land gives 90 people per square mile. Second, a choropleth shades the whole county in the colour of the 50 to 250 class. Third, a dot density map with one dot per 1,000 people puts 65 dots at random places inside the county. Fourth, a 3D map raises the county as a block whose height stands for 90 people per square mile](./population-density-map-three-ways.svg)

To read a population density map:

1. Check the unit and the year. People per square mile and people per square kilometre differ by a factor of 2.59, so 90 per square mile is about 35 per square kilometre.
2. Check what the areas are. A map of states, counties, census tracts or grid squares gives one figure per area. The smaller the areas, the more detail you see.
3. Read the legend. Across the counties of the contiguous US they run from 0.1 to almost 75,000 people per square mile. The class breaks often grow by a multiple, such as 10, 50, 250 and 1,000, rather than in equal steps.
4. Look for patterns: dense clusters (cities), lines of dense areas along coasts, rivers and roads, and large empty regions.
5. Remember that each colour, column or patch of dots is an average for its whole area. A county of 90 people per square mile can hold a town of thousands and miles of empty forest.

## Choropleth, dot density or 3D: three maps of the same data

All three maps on this page use the same data: the 2020 Census population and land area of each of the 3,108 counties and county-equivalents in the 48 contiguous states and the District of Columbia. Together they had 329,260,619 people on 2,955,593 square miles of land, an average of 111.4 people per square mile. Alaska and Hawaii are left out to keep the map at one scale.

| Map | How it shows density | Good for | Watch out for |
| --- | --- | --- | --- |
| [Choropleth map](/learn/chart-types/complex/choropleth-map/) | Each county shaded by its people per square mile | Reading and comparing the density of each area, ranking areas | Large, sparse counties fill most of the picture; small, dense ones are specks |
| Dot density map | One dot per 200, 1,000 or 5,000 people, placed inside each county | Seeing where the people are, and the total in a region | Dots spread evenly over each county, wherever people actually live |
| 3D column map | Each 40 km square raised to a height set by its density | Showing how concentrated people are in a few places | Columns hide each other, and heights are hard to compare |

The choropleth and the dot density map can give opposite impressions of the same country. On the choropleth, counties with under 10 people per square mile are the largest colour on the map: 556 counties covering 36.5% of the land. Yet they hold only 1.2% of the population. The 153 counties with 1,000 or more people per square mile cover 2.1% of the land and hold 40.1% of the people. Half of the population of the contiguous United States lives in the 233 densest counties, on 3.6% of its land.

A dot density map shows those 40% as dense crowds of dots on a small part of the map, and the 3D map shows them as a few tall columns.

## What is a dot density map?

A **dot density map** (also called a dot distribution map or dot map) shows a count with dots of one size, each standing for a fixed number, such as 1 dot = 1,000 people, placed inside the area the count belongs to. Density shows as how tightly the dots are packed.

A dot density map is drawn from counts, so you don't divide by the area first as you would for a choropleth. A big county and a small one with the same population get the same number of dots, and the small one looks denser because its dots are closer together.

### Dot value and dot size

The **dot value** is the number each dot stands for. It decides how the map looks:

| Dot value | Dots for the contiguous US | What happens |
| --- | --- | --- |
| 1 dot = 200 people | 1,646,324 | Detail in sparse areas; dense areas merge into solid colour unless the dots are see-through |
| 1 dot = 1,000 people | 329,283 | A balance at the scale of the whole country; 7 counties get no dot |
| 1 dot = 5,000 people | 65,836 | Clear, separate dots; 137 counties with under 2,500 people get no dot at all |

Each county's dot count is its population divided by the dot value, rounded, so small counties drop off the map as the dot value grows. Pick the dot value and dot size together: in the densest areas, dots should just start to touch. Dots that merge hide the differences between dense places, and too few dots make thinly settled regions look empty.

### Why the dots aren't where people live

The data gives one number per county, not the address of each person, so the dots are placed at random inside each county. That works for small counties and misleads in big ones. San Bernardino County, California, has 2,181,654 people on 20,068 square miles, much of it in the Mojave Desert. A dot density map spreads its dots evenly across the whole county, but the Census Bureau puts the county's centre of population about 45 km from its western edge and 70 km from its southern edge, in a county over 300 km wide.

Two fixes are common:

- Use smaller areas, such as census tracts or blocks, so each dot has less room to stray.
- Use **dasymetric mapping**: place the dots, or the people, only on land that is likely to be lived on, using land cover or building data, and leave out water, parks and desert.

## 3D population density maps: what height shows and hides

A 3D map raises each area to a height set by its density, so a column 10 times as tall stands for 10 times as many people per square mile. Below, the contiguous United States is cut into 40 km squares. The map uses an equal-area projection, so every square covers the same ground and every column has the same footprint: only the height changes. Columns standing on counties would have footprints of very different sizes. Each square's density is the average of the counties covering it, so people are again assumed to be spread evenly within each county.

Drag to rotate the map, scroll to zoom, and double-click to reset the view. Hover over a column to see its density and its rank.

<LiveDocSnippet maxWidth={'100%'} height={560} name="./ThreeD/demo" />

In the 3D view the big cities stand out at once. The square over New York City and the neighbouring part of New Jersey averages 17,162 people per square mile, twice the next-tallest (8,266, over Queens and Nassau County), while the median square has 27. Of the 5,061 squares, 122 have 1,000 or more people per square mile, and 1,595 have fewer than 10.

The 3D view also hides things:

- Tall columns block the ones behind them, so what you see depends on where you look from.
- Perspective makes far columns look shorter than near ones of the same height.
- In experiments on reading charts, people judged positions along a common scale more accurately than lengths. On a map, columns stand at different places and distances, so they never line up against a common baseline.
- With heights in proportion to density, a few cities dwarf everything else, and most of the country stays flat.

Use 3D to show concentration, and keep a way to read exact values: tooltips, a top-down view, or a 2D map beside it.

## When to use a population density map

Use a population density map when the question is where people live closely together and where they don't: planning services, siting shops or transport, studying cities and suburbs, or putting other rates, such as disease or crime, in context. Pick the kind of map by what readers need to do.

| Chart | Best for |
| --- | --- |
| Choropleth population density map | Reading the density of each area, and comparing areas against a legend |
| Dot density map | Showing where the people are and how many, with one dot per fixed number |
| 3D column or prism map | Showing how concentrated people are in a few places, for an overview |
| Proportional symbol map | Total population of cities or areas: a circle sized by the count, like a [bubble chart](/learn/chart-types/cartesian/bubble-chart/) on a map |
| Grid or [heatmap](/learn/chart-types/cartesian/heatmap/) | Density on equal squares or hexagons, so area sizes don't distort the picture |
| [Bar chart](/learn/chart-types/cartesian/bar-chart/) | Ranking areas by density exactly, when location doesn't matter |

For the general rules of shading areas by a value, such as normalising and choosing class breaks, see the [choropleth map guide](/learn/chart-types/complex/choropleth-map/).

## Common population density map mistakes

- **Shading by population instead of density.** A choropleth of total population mostly shows which areas are big or populous. Divide by land area first.
- **Dividing by total area.** Lakes, bays and the sea inflate the area and lower the density. Census figures use land area.
- **Comparing maps drawn on different areas.** The size of the areas changes the figures. In 2020 the District of Columbia, the densest of the 50 states and DC, had 11,280 people per square mile; New York County, the densest county, had 74,781, more than six times as many. Compare maps only when they use the same kind of area.
- **A distorting projection.** Web Mercator, the projection of most web map tiles, enlarges areas far from the equator, so northern regions look bigger and emptier. Density maps belong on an equal-area projection.
- **Reading dots as addresses.** On most dot density maps, each dot's position inside its area is random. Say so in the legend or caption.
- **3D with no way to read values.** Add tooltips or a top-down view, and don't ask readers to compare columns by eye.

## How to create a population density map in JavaScript, React or Angular

SciChart.js draws charts with WebGL, so a map of 3,108 county outlines, or 1.6 million dots, stays smooth to zoom and pan. The demo below draws the counties with triangle series, one per density class, the dots with a single scatter series, and the 3D view with a 3D column series.

Choose **Choropleth**, **Dot density** or **3D** with the buttons; in the dot view, choose how many people each dot stands for. Hover over a county to see its name, density, population and land area. Scroll to zoom into a city, drag to pan, and double-click to reset. The 3D view is the column map from the section above, in the same demo.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="population density map" demo="map-example" demoLabel="choropleth map" docs="/2d-charts/chart-types/choropleth-map/" docsLabel="SciChart.js choropleth map documentation" />

Here is the code for this population density map. Each county arrives with its name, population, land area in square miles and outline, which the demo decodes into rings of `[x, y]` points in kilometres:

```json
{
    "name": "Kershaw",
    "state": "SC",
    "population": 65403,
    "landArea": 726.6,
    "rings": [[[1373, 1376], [1383, 1387], …, [1384, 1368]]]
}
```

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    // populationDensityMap from the JavaScript tab, saved as populationDensityMap.ts
    import { populationDensityMap } from "./populationDensityMap";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up.
    // getYourCountyData() returns your areas in the format of getUsCountyData() in the JavaScript tab
    const initChart = (rootElement: string | HTMLDivElement) => populationDensityMap(rootElement, getYourCountyData());

    export const PopulationDensityMap = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 560 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    // populationDensityMap from the JavaScript tab, saved as populationDensityMap.ts
    import { populationDensityMap } from "./populationDensityMap";

    @Component({
        selector: "app-population-density-map",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 560px"></scichart-angular>`
    })
    export class PopulationDensityMapComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up.
        // getYourCountyData() returns your areas in the format of getUsCountyData() in the JavaScript tab
        initChart = (rootElement: string | HTMLDivElement) => populationDensityMap(rootElement, getYourCountyData());
    }
    ```
</CodeSnippetBlock>

Key points:

- The choropleth is five [FastTriangleRenderableSeries](/2d-charts/chart-types/fast-triangle-renderable-series/), one per density class. `triangulateRing` cuts each county outline into triangles by ear clipping, and `ETriangleSeriesDrawMode.List` draws every three points as one triangle.
- The dots are one [XyScatterRenderableSeries](/2d-charts/chart-types/xy-scatter-renderable-series/) with a one-pixel `SquarePointMarker` and a see-through fill, so overlapping dots add up to brighter areas. `placeDots` picks a triangle in proportion to its area, then a random point inside it, with a seeded random generator so the map is the same every time. Changing the dot value refills the same data series.
- Hover is a custom modifier (`CountyTooltipModifier`, based on `CustomChartModifier2D`) that converts the mouse position to map coordinates and runs a point-in-polygon test. A `preRender` handler keeps one kilometre the same size on both axes, so the map isn't stretched.
- The 3D map above uses a [ColumnRenderableSeries3D](/3d-charts/chart-types/column-3d-chart/) with a colour per column (`useMetadataColors`), and a `PointLineRenderableSeries3D` with `isLineStrip: false` for the state borders on the floor. Open its code with the CodePen link under the 3D demo.

**See it in the demo app:** [JavaScript choropleth map](https://www.scichart.com/demo/javascript/map-example) · [React choropleth map](https://www.scichart.com/demo/react/map-example) · [Angular choropleth map](https://www.scichart.com/demo/angular/map-example). Related demos: a [heatmap over a map](https://www.scichart.com/demo/react/heatmap-over-map) and a [3D column chart](https://www.scichart.com/demo/react/3d-column-chart).

**Go deeper:** [SciChart.js choropleth map documentation](/2d-charts/chart-types/choropleth-map/) and [SciChart.js 3D column chart documentation](/3d-charts/chart-types/column-3d-chart/).

## Frequently asked questions

### What does a population density map show?

A population density map shows where people live closely packed and where they are spread thinly. Each area, square or dot stands for people per unit of land, such as people per square mile, so you can see cities, corridors along coasts and rivers, and empty regions. It does not show how many people live in an area in total: a big, sparse county can hold more people than a small, dense one.

### What type of map shows population density?

Population density is most often shown on a choropleth map, which shades each area, such as a county or country, by its people per square mile or square kilometre. A dot density map shows it with one dot for a fixed number of people, so dots crowd together where density is high. Grid maps use equal squares or hexagons instead of areas, and 3D maps raise each area or square to a height set by its density. All of them are thematic maps.

### How is population density calculated?

Population density is the number of people divided by the land area they live on. Kershaw County, South Carolina, had 65,403 people on 726.6 square miles of land in 2020, so its density was 90 people per square mile. Official figures usually use land area only, leaving out lakes and the sea. To convert people per square mile to people per square kilometre, divide by 2.59.

### What is the difference between a dot density map and a choropleth map?

A choropleth map shades each whole area by one value, such as its population density, so you read the colour against a legend. A dot density map draws one dot for a fixed number of people, such as 1 dot = 1,000 people, inside each area, so you see density from how closely the dots are packed. The choropleth gives each area's exact class; the dot density map shows the total number of people too, but where each dot falls within its area is chosen at random.

### Are 3D population density maps a good idea?

3D population density maps are good at showing where people are concentrated: a few tall columns over the big cities stand out at once. They are poor at exact comparison, because tall columns hide the ones behind them, perspective makes far columns look shorter, and people judge heights less accurately than positions on a flat scale. Use them with tooltips, a top-down view or a 2D map beside them.

### How do I make a population density map in JavaScript?

Load the area outlines as GeoJSON or another polygon format, join each area's population and land area to it, and divide one by the other for the density. With SciChart.js, cut the outlines into triangles and draw them with a `FastTriangleRenderableSeries`, one series per colour class, for a choropleth. For a dot density map, put random points inside each area and draw them all in one `XyScatterRenderableSeries`, which stays smooth with over a million dots. For 3D, use a `ColumnRenderableSeries3D`. The same code runs in React or Angular through `scichart-react` or `scichart-angular`.

## Sources

- US Census Bureau, [Centers of Population](https://www.census.gov/geographies/reference-files/time-series/geo/centers-population.html), 2020, by county (`CenPop2020_Mean_CO.txt`). The 2020 Census population of each county used on this page, and the centre of population of San Bernardino County.
- US Census Bureau, [Cartographic Boundary Files](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html), 2020 counties at 1:20,000,000 (`cb_2020_us_county_20m`). Public domain; the county outlines and land areas on this page, projected and simplified.
- US Census Bureau (2021), [Historical Population Density Data (1910–2020)](https://www.census.gov/data/tables/time-series/dec/density-data-text.html). Population density of the United States and each state, in people per square mile of land.
- Mennis, J. (2003), [Generating surface models of population using dasymetric mapping](https://doi.org/10.1111/0033-0124.10042). *The Professional Geographer*, 55(1), 31–42. Placing population on the land where people live, using urban land cover from satellite data as the guide.
- Cleveland, W. S. and McGill, R. (1984), [Graphical perception: theory, experimentation, and application to the development of graphical methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387), 531–554. A ranking of how accurately people read quantities from charts, tested by experiment: positions along a common scale are read more accurately than lengths and angles.

<LearnCta position="bottom" chart="population density map" demo="map-example" demoLabel="choropleth map" docs="/2d-charts/chart-types/choropleth-map/" docsLabel="SciChart.js choropleth map documentation" />
