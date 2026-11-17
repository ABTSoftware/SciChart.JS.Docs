---
sidebar_position: 10
sidebar_label: Choropleth Map
title: "Choropleth Map: What It Is & How to Read It (With Interactive Examples)"
description: "What a choropleth map is, how to read one, why it should show rates rather than counts, how classes and colours change the picture, and when to use another map."
keywords:
    [
        "choropleth map",
        "choropleth",
        "what is a choropleth map",
        "how to read a choropleth map",
        "choropleth map classification",
        "quantile vs equal interval",
        "choropleth vs heat map",
        "choropleth vs isopleth",
        "filled map"
    ]
image: /img/learn/choropleth-map-og.png
related: [heatmap, treemap, bubble-chart]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a choropleth map used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A choropleth map is used to compare a rate or average across areas such as countries, states, counties or postcode districts, and to see where it is high or low. Common examples are election results, unemployment rates, income per person, disease rates per 100,000 people and population density. Government statistics are usually published for these areas, which is why the choropleth is the most common kind of statistical map." }
                },
                {
                    "@type": "Question",
                    "name": "What is another name for a choropleth map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A choropleth map is also called a filled map, a shaded map or a shaded area map, and spreadsheet and business-intelligence tools often use those names. It is one kind of thematic map: a map made to show one subject, such as income or rainfall, rather than roads and places." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a choropleth map and a heat map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A choropleth map colours whole areas with fixed borders, such as states or counties, by one value per area. A heat map on a map shows how dense points are, as a smooth colour surface that ignores borders, for example where taxi pickups or crimes cluster. In charts, a heatmap is a grid of equal-sized cells coloured by value. Use a choropleth when your data comes per area, and a heat map when you have individual points or a grid." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a choropleth map and an isopleth map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A choropleth map colours areas with fixed borders, and the value changes suddenly at each border. An isopleth map, also called a contour or isarithmic map, draws lines of equal value across a surface that changes smoothly, such as temperature, rainfall or elevation, and ignores political borders. Use an isopleth for things measured at points that vary continuously, and a choropleth for statistics counted per area." }
                },
                {
                    "@type": "Question",
                    "name": "On a choropleth map, what do darker colors mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "On a map with a light background, darker colours usually mean higher values, and lighter colours lower ones. On a dark background the convention is often reversed, so brighter colours mean more. With a diverging scheme, the two darkest ends show the two extremes, such as far above and far below average. Always check the legend: it is the only reliable guide to what each colour means." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a choropleth map in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Load the area outlines as GeoJSON, join your values to them by name or code, and give each area a colour from its class. To draw them with SciChart.js, split each polygon into triangles, for example by ear clipping, and plot them with a FastTriangleRenderableSeries in List mode, one series per colour class. Draw the borders with a line series, keep the axes at the same scale so the map isn't stretched, and add a point-in-polygon test for hover tooltips. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Choropleth Map

## What is a choropleth map?

A **choropleth map** (also called a filled map or shaded map) is a map that colours each area, such as a country, state or county, by a value for that area. A legend shows what each shade means, so you can quickly see where the value is high or low and how it changes from place to place.

![A choropleth map of the 50 US states and the District of Columbia, shaded by 2020 population density in five classes from under 38 to 290 or more people per square mile: the densest states are in the Northeast, and the sparsest across the Great Plains, the Mountain West and Alaska](/img/learn/choropleth-map-og.png)

*A choropleth map of population density in the United States, 2020 Census, in five classes of about 10 states each. [Try the interactive version](#how-to-create-a-choropleth-map-in-javascript-react-or-angular).*

:::tip Key takeaways
- A choropleth map shades **areas with fixed borders** by one value each, and a legend gives the meaning of each colour.
- **Map rates, not raw counts.** Per person, per square mile or a percentage. Raw counts mostly show which areas are big.
- **The class breaks change the story.** The same data can look flat or full of contrast depending on how values are grouped into colours.
- **Big areas dominate.** A large, empty region draws the eye more than a small, crowded one, whatever their values.
- When exact values or small areas matter, add tooltips, or use a bar chart, symbols or a tile map instead.
:::

## How to read a choropleth map

1. **Read the title and the legend first.** Find out what is measured, in what unit and for which year: "people per square mile, 2020" is not the same as "people".
2. **Check the colour scale.** A **sequential** scale (light to dark in one colour) runs from low to high. A **diverging** scale (two colours meeting at a neutral middle) shows values above and below a midpoint, such as the national average or zero change.
3. **Note the classes.** Most choropleth maps group values into four to seven classes, each with one colour. Each colour covers a range, so two areas of the same colour can still differ a lot.
4. **Look for patterns, not single areas.** Clusters of dark or light areas, a gradient from one side to the other, or one area that stands out from its neighbours are what the map shows best.
5. **Allow for size.** Large areas catch the eye even when few people live there, and small areas can be almost invisible. Check the small ones before drawing conclusions.
6. **Hover or look up the exact value.** A shade tells you the class, not the number. On an interactive map, hover over an area for its value.

## Rates, not raw counts: the classic choropleth mistake

The most common mistake on a choropleth map is to colour areas by a **raw count**, such as the number of people, cases or sales. Big areas with many people have bigger counts of almost everything, so a count map mostly repeats a population map.

The fix is to **normalise**: divide the count by something that makes areas comparable. Typical choices:

- **per person:** cases per 100,000 people, income per head, crimes per 1,000 residents;
- **per area:** people per square mile, trees per hectare;
- **as a share:** the percentage of households with broadband, the unemployment rate.

![Two maps of the US states from the 2020 Census. Coloured by total population, the darkest states are the most populous ones, such as California, Texas, Florida and New York. Coloured by people per square mile, the darkest are small northeastern states such as New Jersey, Rhode Island and Massachusetts, and Texas and California move to the middle classes](./choropleth-map-counts-vs-rates.svg)

The two maps above use the same Census data. By **total population**, California and Texas are in the darkest class: they are the first and second most populous of the 51. By **people per square mile**, Texas drops to 25th and sits in the middle class, while Rhode Island, 43rd by population, is third densest. The rate map answers a real question (where are people packed closely together?); the count map mostly shows where the big states are.

If you do need to show counts, use a **proportional symbol map** instead: a circle in each area, sized by the count. Circles can be compared by size without implying that the whole area is filled.

## Classification: how values become colours

Most choropleth maps are **classed**: the values are split into a few ranges, called classes, and each class gets one colour. The method used to set the class breaks changes what the map shows, sometimes completely.

| Method | How the breaks are set | Good for | Watch out for |
| --- | --- | --- | --- |
| **Equal interval** | The range from minimum to maximum split into classes of the same width | Evenly spread data, and familiar units such as percentages | One extreme value pushes almost everything into one class |
| **Quantile** | The same number of areas in each class | Ranking areas, and comparing several maps of different data | Very different values can share a class; close values can be split |
| **Natural breaks (Jenks)** | Breaks placed in the gaps of the data, so each class is as uniform as possible | Data with clear clusters | Breaks are awkward numbers, and change whenever the data changes |
| **Manual** | Breaks you choose, such as round numbers or a target | Policy thresholds, and maps that must match over time | Easy to choose breaks that tell the story you want |
| **Unclassed** | A continuous colour ramp: every value gets its own shade | Showing the exact order of values | Readers can't match a shade to a number precisely |

### Same data, two classifications

Here is US population density in 2020, from 1.3 people per square mile in Alaska to 11,280 in the District of Columbia, mapped two ways. Only the class breaks differ.

![The same population density data mapped with two classification methods. With equal intervals, 50 of the 51 areas fall into the lightest class and only the District of Columbia is dark, so the map is almost one colour. With quantiles of about 10 states each, the map shows dense states in the Northeast and around the Great Lakes, and sparse ones across the Great Plains and the Mountain West](./choropleth-map-classification.svg)

- **Equal interval** splits 1.3 to 11,280 into five classes about 2,256 wide. Every state, even New Jersey at 1,263, falls into the first class. Only the District of Columbia, a city of 61 square miles, is in the top class, and it's too small to see. The map says nothing.
- **Quantile** puts about 10 areas in each class, with breaks at 38, 70, 170 and 290. Now the pattern appears: a dense band from Massachusetts to Maryland, fairly dense states around the Great Lakes, and a sparse middle and west.
- **Natural breaks** (five Jenks classes, not drawn) gives a third picture: 30 areas in the first class, up to 116, then 13, 5, 3 and the District of Columbia on its own.

None of these is the "true" map. Quantiles suit ranking and comparing maps: in a study of series of disease maps, Brewer and Pickle found quantile classes (with minimum boundary error classes) the best suited to general map-reading tasks. Whatever the method, say which one you used, and show the breaks in the legend.

**How many classes?** Five to seven is the usual range. With more, readers can't tell neighbouring shades apart.

### How to describe a choropleth map

Use this template when you report a choropleth map:

> In **[year]**, **[measure]** was highest in **[region or areas]** (**[value range]**) and lowest in **[region or areas]** (**[value range]**). The map uses **[number]** **[classification method]** classes.

**Worked example:** "In 2020, population density was highest in the Northeast, from Massachusetts to Maryland (290 or more people per square mile), and lowest across the Great Plains, the Mountain West and Alaska (under 38). The map uses five quantile classes."

## Choosing colours: sequential, diverging or categorical

| Scheme | Looks like | Use it for | Example |
| --- | --- | --- | --- |
| **Sequential** | One hue, light to dark (or dark to bright on a dark background) | Values from low to high, with no special middle | Population density, income per head |
| **Diverging** | Two hues meeting at a pale neutral colour | Values above and below a meaningful midpoint | Change since the last census, difference from the national average |
| **Categorical** | Distinct hues of similar strength | Categories with no order | Which party won, main language spoken |

A few rules keep the colours honest:

- **Order follows lightness.** On a light background, darker means more. On a dark background, as in the live map below, brighter means more. Readers judge order by lightness, not by hue, so a rainbow scale reads badly.
- **Use a diverging scheme only when the middle means something.** Zero change and the average are good midpoints; the middle of the data range usually isn't.
- **Check for colour blindness.** Avoid relying on red against green. The [ColorBrewer](https://colorbrewer2.org/) schemes from Cynthia Brewer and colleagues are designed for maps, and include colour-blind-safe and print-friendly options.
- **Give missing data its own look,** such as grey or hatching, outside the colour scale, so "no data" isn't read as "low".

## When to use a choropleth map

Use a choropleth map when your data is **a rate, ratio or average for each of a set of areas**, and the question is **where** it is high or low. Typical uses:

- **elections and polls:** vote share or turnout by state or district;
- **economics:** unemployment rate, income per head or house prices by region;
- **public health:** disease or vaccination rates per 100,000 people by county;
- **population:** density, age or growth by country, state or census tract;
- **business:** sales per customer or market share by sales territory.

| Chart | Best for |
| --- | --- |
| **Choropleth map** | Rates or averages per area, where the geographic pattern is the point |
| **Proportional symbol map** | Raw counts per area or per place: a circle sized by the value, like a [bubble chart](/learn/chart-types/cartesian/bubble-chart/) on a map |
| **Cartogram** | Giving each area a size that matches its population or value, so big empty areas don't dominate |
| **Hex or tile map** | Every area the same size (one hexagon or square per state), so small areas count as much as big ones |
| [Bar chart](/learn/chart-types/cartesian/bar-chart/) | Exact comparison and ranking, when location doesn't matter |
| [Heatmap](/learn/chart-types/cartesian/heatmap/) | Values on a grid of two categories, or point density as a smooth surface rather than by area |
| [Contour plot](/learn/chart-types/cartesian/contour-plot/) | Values that change smoothly across space, such as temperature or elevation (an isopleth map) |

A good map often comes with a sorted bar chart or table beside it: the map shows where, and the chart shows exactly how much.

## Common choropleth map mistakes

- **Mapping raw counts.** Normalise to a rate, ratio or share, or switch to a proportional symbol map.
- **Letting big areas dominate.** In 2020, the 10 least densely populated states held 4.8% of Americans but covered 40.5% of the country's land. On a choropleth, those states fill much of the picture. Use a cartogram, a tile map or a chart beside the map when people, not land, are the point.
- **Losing small areas.** The District of Columbia is the densest area on the map, yet it is a speck. Add insets, labels or tooltips for small areas.
- **Choosing breaks without thinking.** Equal intervals with one outlier give a one-colour map; badly placed breaks can hide or invent a pattern. Look at the data's distribution first, and say which method you used.
- **Too many classes or a rainbow scale.** More than about seven shades can't be told apart, and a rainbow has no natural order.
- **A diverging scale with no meaningful middle.** It suggests two opposite groups that don't exist.
- **The wrong projection.** Some projections, such as Web Mercator, enlarge areas far from the equator, so northern countries look bigger and catch more attention. Use an equal-area projection; the map on this page uses an Albers equal-area projection.
- **Treating the colour as true everywhere in the area.** A county's average says nothing about any one place in it, and different borders can give a different picture of the same data.
- **No legend, unit or date.** Without them, nobody can tell what the colours mean.

## How to create a choropleth map in JavaScript, React or Angular

SciChart.js draws maps from GeoJSON outlines with its triangle series, so a whole map renders with WebGL and WebGPU and stays smooth to zoom and pan, even with thousands of areas or a value that updates in real time. Hover over a state to see its density, rank and population; scroll to zoom into the small northeastern states, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="choropleth map" demo="map-example" docs="/2d-charts/chart-types/choropleth-map/" />

Here is the code for this choropleth map. The data is GeoJSON: one feature per state, with its outline and its values:

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": { "name": "Colorado", "population": 5773714, "density": 55.7 },
            "geometry": { "type": "MultiPolygon", "coordinates": [[[[-1085, 448], [-1083, 467], [-1017, 458], …, [-1136, 76], [-1085, 448]]]] }
        }
    ]
}
```

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    // choroplethMap from the JavaScript tab, saved as choroplethMap.ts
    import { choroplethMap } from "./choroplethMap";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up.
    // getYourGeoJson() returns a FeatureCollection with name and density properties, in projected x/y coordinates
    const initChart = (rootElement: string | HTMLDivElement) => choroplethMap(rootElement, getYourGeoJson());

    export const ChoroplethMap = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    // choroplethMap from the JavaScript tab, saved as choroplethMap.ts
    import { choroplethMap } from "./choroplethMap";

    @Component({
        selector: "app-choropleth-map",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class ChoroplethMapComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up.
        // getYourGeoJson() returns a FeatureCollection with name and density properties, in projected x/y coordinates
        initChart = (rootElement: string | HTMLDivElement) => choroplethMap(rootElement, getYourGeoJson());
    }
    ```
</CodeSnippetBlock>

Key points:

- **Polygons become triangles.** The [FastTriangleRenderableSeries](/2d-charts/chart-types/fast-triangle-renderable-series/) draws triangles, so `triangulateRing` cuts each GeoJSON ring into triangles by ear clipping. With `drawMode: ETriangleSeriesDrawMode.List`, every three points in the `XyDataSeries` make one triangle. For big or complex maps (with holes), use a tested triangulation library, or triangulate once offline and load the triangles.
- **One series per class.** Each class's triangles from every state go into one triangle series with that class's `fill`, so five series draw the whole map. For an unclassed map, use one series per area with its own colour.
- **Borders and hover** are `FastLineRenderableSeries` with `NaN` between rings (`containsNaN: true`), so one series draws every outline with gaps. `StateTooltipModifier` extends `CustomChartModifier2D` ([custom chart modifiers](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/)), converts the mouse position to map coordinates and runs a point-in-polygon test.
- **The map keeps its shape.** The coordinates are already projected (Albers equal-area, in kilometres). A `preRender` handler keeps one kilometre the same size on both axes, however the chart is sized or zoomed, and the legend is [annotations](/2d-charts/annotations-api/annotations-api-overview/) in relative coordinates, so it stays put while you zoom.

**See it in the demo app:** [JavaScript choropleth map](https://www.scichart.com/demo/javascript/map-example) · [React choropleth map](https://www.scichart.com/demo/react/map-example) · [Angular choropleth map](https://www.scichart.com/demo/angular/map-example). Related demos: a [heatmap over a map](https://www.scichart.com/demo/react/heatmap-over-map) and a [map on a polar chart](https://www.scichart.com/demo/react/polar-map-example).

**Go deeper:** [SciChart.js choropleth map documentation](/2d-charts/chart-types/choropleth-map/), which walks through the demo app's map of Australia, with city markers and a switch between metrics, and the blog post [How to Build Real-Time JavaScript React Maps with GeoJSON](https://www.scichart.com/blog/create-geojson-maps-in-real-time/).

## Frequently asked questions

### What is a choropleth map used for?

A choropleth map is used to compare a rate or average across areas such as countries, states, counties or postcode districts, and to see where it is high or low. Common examples are election results, unemployment rates, income per person, disease rates per 100,000 people and population density. Government statistics are usually published for these areas, which is why the choropleth is the most common kind of statistical map.

### What is another name for a choropleth map?

A choropleth map is also called a filled map, a shaded map or a shaded area map, and spreadsheet and business-intelligence tools often use those names. It is one kind of thematic map: a map made to show one subject, such as income or rainfall, rather than roads and places.

### What is the difference between a choropleth map and a heat map?

A choropleth map colours whole areas with fixed borders, such as states or counties, by one value per area. A heat map on a map shows how dense points are, as a smooth colour surface that ignores borders, for example where taxi pickups or crimes cluster. In charts, a heatmap is a grid of equal-sized cells coloured by value. Use a choropleth when your data comes per area, and a heat map when you have individual points or a grid.

### What is the difference between a choropleth map and an isopleth map?

A choropleth map colours areas with fixed borders, and the value changes suddenly at each border. An isopleth map, also called a contour or isarithmic map, draws lines of equal value across a surface that changes smoothly, such as temperature, rainfall or elevation, and ignores political borders. Use an isopleth for things measured at points that vary continuously, and a choropleth for statistics counted per area.

### On a choropleth map, what do darker colors mean?

On a map with a light background, darker colours usually mean higher values, and lighter colours lower ones. On a dark background the convention is often reversed, so brighter colours mean more. With a diverging scheme, the two darkest ends show the two extremes, such as far above and far below average. Always check the legend: it is the only reliable guide to what each colour means.

### How do I make a choropleth map in JavaScript?

Load the area outlines as GeoJSON, join your values to them by name or code, and give each area a colour from its class. To draw them with SciChart.js, split each polygon into triangles, for example by ear clipping, and plot them with a `FastTriangleRenderableSeries` in List mode, one series per colour class. Draw the borders with a line series, keep the axes at the same scale so the map isn't stretched, and add a point-in-polygon test for hover tooltips. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- US Census Bureau (2021), [Historical Population Density Data (1910–2020)](https://www.census.gov/data/tables/time-series/dec/density-data-text.html). Resident population and people per square mile of land for each state in 2020, used for the maps on this page.
- US Census Bureau, [Cartographic Boundary Files](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html), 2020 states at 1:20,000,000 (`cb_2020_us_state_20m`). Public domain; the state outlines on this page, projected and simplified. Land areas for the "big areas dominate" figures are from the same file.
- Harrower, M. and Brewer, C. A. (2003), [ColorBrewer.org: an online tool for selecting colour schemes for maps](https://doi.org/10.1179/000870403235002042). *The Cartographic Journal*, 40(1), 27–37. Sequential, diverging and qualitative schemes for maps.
- Brewer, C. A. and Pickle, L. (2002), [Evaluation of methods for classifying epidemiological data on choropleth maps in series](https://doi.org/10.1111/1467-8306.00310). *Annals of the Association of American Geographers*, 92(4), 662–681. A user study comparing classification methods, including quantiles, equal intervals and natural breaks.
- Jenks, G. F. (1967), "The data model concept in statistical mapping". *International Yearbook of Cartography*, 7, 186–190. The natural breaks method.

<LearnCta position="bottom" chart="choropleth map" demo="map-example" docs="/2d-charts/chart-types/choropleth-map/" />
