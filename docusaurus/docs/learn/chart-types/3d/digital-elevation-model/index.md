---
sidebar_position: 20
sidebar_label: Digital Elevation Model
title: "Digital Elevation Model (DEM): What It Is & How to Read Terrain"
description: "What a digital elevation model (DEM) is, DEM vs DSM vs DTM, resolution and free data sources, and how to read terrain in 3D, as a contour map and as bathymetry."
keywords:
    [
        "digital elevation model",
        "dem",
        "what is a digital elevation model",
        "dem vs dsm vs dtm",
        "elevation data",
        "3d terrain map",
        "elevation map",
        "topographic map",
        "how to read a topographic map",
        "contour map",
        "contour interval",
        "index contour",
        "hillshade",
        "bathymetry map",
        "vertical exaggeration"
    ]
image: /img/learn/digital-elevation-model-og.png
related: [3d-surface-plot, contour-plot, point-cloud, heatmap]
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
                    "name": "What is a digital elevation model in GIS?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "In GIS, a digital elevation model (DEM) is a raster layer: a grid of equal square cells in which each cell holds the height of the ground at that spot. It is the base for slope, aspect, hillshade, contour, watershed, flood and line-of-sight analysis, and for 3D views of the landscape. Most DEMs are stored as GeoTIFF files with a map projection and a vertical datum, so each height has a known position and a known zero."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a DEM, a DSM and a DTM?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A digital surface model (DSM) records the top of whatever is there: rooftops, tree canopy and bridges as well as open ground. A digital terrain model (DTM) records the bare earth with those removed. Digital elevation model (DEM) is the general term; agencies such as the US Geological Survey use it for the bare-earth model, so check which one a dataset is before using it."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Where can I get a digital elevation model?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Free DEMs are published by national mapping and space agencies. In the USA, the USGS 3D Elevation Program offers bare-earth DEMs at 1 m, about 10 m and about 30 m through The National Map. For the rest of the world, the SRTM 1 arc-second DEM (about 30 m, between 60° N and 56° S) and the Copernicus GLO-30 surface model (30 m) cover almost all land, and the GEBCO grid covers the land and the sea floor at 15 arc-seconds."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the best digital elevation model?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The best DEM is the finest one that covers your area and measures the surface you need. Lidar-based bare-earth DEMs at 1 to 2 m are best for flooding, drainage and engineering. Where there is no lidar, 30 m global models such as Copernicus GLO-30 or SRTM are the usual choice; Copernicus GLO-30 is a surface model, so it includes buildings and trees. Check the date, the vertical accuracy, the vertical datum and whether water bodies have been flattened."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a topographic map?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Find the contour interval in the map margin, then use the thicker, labelled index contours to read heights. Each brown line joins points of equal height. Lines close together mean steep ground and lines far apart mean gentle ground. Closed rings are hilltops, an hourglass between two hills is a saddle, lines that bend into a V pointing upstream mark a valley, and rings with inward ticks mark a depression."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a 3D terrain map in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Load your DEM as a 2D array of heights, one row per step north, and draw it on a GPU-accelerated 3D chart. With SciChart.js, put the array in a UniformGridDataSeries3D with the cell size as the x and z steps, and draw it with a SurfaceMeshRenderableSeries3D, a GradientColorPalette for the height tints and a contourInterval for contour lines. The 3D surface's worldDimensions sets the vertical exaggeration. React and Angular apps reach the same code through scichart-react and scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# Digital Elevation Model (DEM)

## What is a digital elevation model?

A **digital elevation model** (DEM) is a map of ground height stored as a grid of numbers: the land is divided into equal square cells, and each cell holds the elevation of the ground there, usually in metres above sea level. Software draws it as 3D terrain, a shaded relief map or a contour map.

![A 3D terrain map of Mount St. Helens drawn from a 70 m digital elevation model, seen from the north and tinted from dark green at 600 m to pale cream at 2,600 m: the horseshoe-shaped crater opens towards the viewer onto a broad plain, with ridged valleys on either side and East, North and Elevation axes in kilometres and metres](/img/learn/digital-elevation-model-og.png)

*A digital elevation model of Mount St. Helens, Washington, drawn as 3D terrain with heights doubled. [Try the interactive version](#how-to-create-a-3d-terrain-map-in-javascript-react-or-angular).*

:::tip Key takeaways
- A DEM is a raster: one height per cell. The cell size, such as 1 m, 10 m or 30 m, sets the smallest feature it can show.
- A DSM includes buildings and trees; a DTM, or bare-earth DEM, removes them. Check which one you have.
- Read terrain from its shape: contour spacing shows slope, closed rings show hills, V-shaped bends show valleys.
- Vertical exaggeration and the colour ramp change what a 3D view seems to say. State the exaggeration, and use tints whose lightness rises with height.
- Bathymetry is the same idea below the water: a grid of depths, with sea level as the natural break in the colour scale.
:::

DEMs are used to model floods and drainage, plan roads, pipelines and wind farms, work out where a radio mast or a radar can see, correct satellite images for terrain, fly aircraft and drones safely, and draw the relief on almost every digital map.

## How a DEM stores elevation

A DEM stores elevation as a **raster**, a grid of square cells like the pixels of a photo, in which each cell's value is a height instead of a colour.

![A 9 by 9 patch of a real digital elevation model of the Mount St. Helens crater rim, one square per 70 m cell, each labelled with its height in metres from 2,200 to 2,522 and tinted from dark green for lower cells to pale for higher ones. The highest cell, 2,522 m, is outlined in red, and a blue line traces the 2,300 m contour between the cells. Notes explain the cell size, the value, why the cell is lower than the 2,549 m summit, the contour line and the colours](./dem-elevation-grid.svg)

Four things describe every DEM:

- Cell size, also called resolution or post spacing: the ground distance between neighbouring values. A 30 m DEM has about 1,100 cells per square kilometre; a 1 m DEM has a million.
- Position: a map projection or a latitude-longitude grid that ties each cell to a place on Earth. Grids in latitude and longitude have cells that are narrower east to west than north to south, except at the equator.
- Vertical datum: the surface that counts as zero height. Land DEMs use an approximation of mean sea level, such as NAVD88 in the USA or the EGM96 or EGM2008 geoid worldwide; GPS gives heights above the ellipsoid, which can differ from them by tens of metres.
- No-data value: a code for cells with no measurement, such as -9999 or -32768. Charts must leave them blank, not draw them as deep holes.

Most DEMs come as GeoTIFF files, increasingly as Cloud Optimised GeoTIFFs that a browser or server can read in pieces. Older formats include SRTM's HGT tiles and ASCII grid text files.

Some software stores terrain as a **TIN** (triangulated irregular network) instead: triangles between measured points, small where the ground is complex and large where it is flat. TINs keep sharp ridges and breaklines exactly, but rasters are simpler to analyse, so most published DEMs are grids.

## How is a DEM made?

A DEM is made by measuring heights from the air or from space, then turning those measurements into a regular grid.

| Method | How it measures height | Typical cell size | Notes |
| --- | --- | --- | --- |
| Airborne lidar | Times laser pulses from an aircraft; ground returns are separated from trees and buildings | 0.5 to 2 m | The most accurate; sees ground through gaps in forest. How the points become a DEM is in our [point cloud guide](/learn/chart-types/3d/point-cloud/) |
| Radar interferometry (InSAR, IfSAR) | Compares radar echoes received by two antennas a known distance apart | 5 to 90 m | Works through cloud and at night. Used by SRTM and TanDEM-X |
| Photogrammetry | Matches features in overlapping aerial, drone or satellite photos | 0.1 m (drone) to 30 m (satellite) | Sees the top of the canopy, so it gives a surface model in forest |
| Digitised contours | Interpolates between the contour lines of old paper maps | 10 to 30 m | How the first national DEMs were made; still found in older data |
| Sonar | Times sound pulses from a ship to the sea floor | Metres in shallow water to hundreds of metres in the deep ocean | For bathymetry; see below |

Whatever the method, the scattered measurements are interpolated onto the grid, gaps are filled, and lakes are usually flattened to one level, because water returns little or no signal, so a lake shows as a perfectly flat patch of one height.

## DEM vs DSM vs DTM

A **digital surface model** (DSM) follows the top of everything on the ground, while a **digital terrain model** (DTM) is the bare earth underneath. "DEM" is the umbrella term, and in practice it usually means the bare-earth model.

| | Digital surface model (DSM) | Digital terrain model (DTM) | Digital elevation model (DEM) |
| --- | --- | --- | --- |
| What it shows | Rooftops, tree canopy, bridges and open ground | Bare earth only | Either; most national DEMs are bare earth |
| Typical source | First lidar returns, photogrammetry, radar | Last lidar returns classified as ground | Depends on the dataset |
| Good for | Line of sight, solar and radio planning, city models, forest height | Floods, drainage, slope, roads, geology | General mapping and terrain views |
| Example | Copernicus GLO-30 | USGS 3DEP 1 m | USGS 3DEP, SRTM |

The difference between a DSM and a DTM is the height of whatever stands on the ground, which in a forest is the canopy height. The [point cloud guide](/learn/chart-types/3d/point-cloud/#point-cloud-processing-basics) shows how both are made from the same lidar survey.

## DEM resolution and free data sources

Free DEMs now cover almost all of the world's land, at very different resolutions. The finer the cells, the more detail and the larger the files.

| Dataset | Coverage | Cell size | Surface | Made from |
| --- | --- | --- | --- | --- |
| [USGS 3D Elevation Program](https://www.usgs.gov/3d-elevation-program) (3DEP) | USA | 1 m, 1/3 arc-second (about 10 m), 1 arc-second (about 30 m) | Bare earth | Mostly lidar; radar in Alaska |
| [SRTM](https://doi.org/10.5066/F7PR7TFT) | 60° N to 56° S | 1 arc-second (about 30 m) | Close to a surface model in forest and cities | Radar interferometry from the Space Shuttle, February 2000 |
| [Copernicus DEM GLO-30](https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM) | Global land | 30 m | Surface model | TanDEM-X radar, 2011 to 2015 |
| [GEBCO grid](https://www.gebco.net/data-products/gridded-bathymetry-data) | Global, land and sea floor | 15 arc-seconds (about 460 m) | Terrain and sea floor | Ship sonar, satellite gravity and land DEMs |

An arc-second is 1/3,600 of a degree. North to south it is always about 30.9 m, but east to west it shrinks with latitude: at Mount St. Helens, 46° north, a 1 arc-second cell is about 30.9 m tall and 21.4 m wide.

Resolution limits what a DEM can show. A 30 m DEM can't show a 10 m wide gully or a road embankment, and it lowers every sharp peak, because each cell holds an average of the ground inside it. The DEM in the demo has 70 m cells, and its highest cell is 2,522 m; the real summit of Mount St. Helens is 2,549 m. Aim for cells at least two to three times smaller than the narrowest feature you need to see.

## How to read 3D terrain

To read a 3D terrain view, check the vertical exaggeration and the colour scale first, then rotate it, because a single angle hides whatever is behind the high ground.

1. Find the vertical exaggeration. Most terrain views stretch heights so that hills are visible at all; at true scale, a mountain range across a whole screen looks almost flat. A 2× exaggeration doubles every height difference, so slopes look steeper than they are; treat steep-looking walls with care.
2. Read the colour scale. Hypsometric tints (colours by height band) give the height of every cell at a glance. They only work if you know which colour means which height.
3. Use the shading to see the shape, not the values. Lighting or a hillshade makes slopes facing the light brighter and the rest darker, which shows ridges and gullies clearly but changes the colours.
4. Turn it and look from above. Rotate until valleys behind ridges are visible, then switch to the map view to measure positions and distances.
5. Hover for exact heights. Perspective makes near heights look bigger than far ones; a tooltip or the contour labels give the actual numbers.

A **hillshade** is the 2D version of that lighting: a grey image of how brightly each cell would be lit by a sun at a chosen direction and height. The usual default is a sun in the north-west (azimuth 315°) at 45° above the horizon. Readers see a sun from the top left as natural; light it from the south and many people see valleys as ridges and ridges as valleys.

## How to read a topographic map

A **topographic map** shows the shape of the land with **contour lines**, each joining points of the same height above sea level, usually drawn in brown with water in blue. A contour map made from a DEM works the same way.

![How to read a topographic contour map: brown contour lines every 20 m with thicker labelled index contours every 100 m around two hills. Numbered markers show 1 an index contour, 2 the contour interval, 3 closely spaced lines on the steep east side of the main hill, 4 widely spaced lines on its gentle west side, 5 the summit with a spot height of 704 m, 6 a saddle between the hills, 7 contour lines bending into a V that points upstream along a blue stream, and 8 a closed depression drawn with inward ticks. Below, a side profile along line A to B shows the main hill gentle on the west and steep on the east](./topographic-map-reading.svg)

1. Find the contour interval: the height difference between neighbouring lines, printed in the map margin. Flat country might use 10 feet or less; mountains 100 feet or more.
2. Read the heights from the index contours. Every fifth line is usually thicker and labelled with its height; count the thinner lines between them to find any other height.
3. Read the slope from the spacing. Lines close together mean steep ground; lines far apart, or none at all, mean gentle or flat ground. Since every gap is one contour interval, spacing is a direct measure of steepness.
4. Find the hills, saddles and valleys. Closed rings are hilltops, often with a spot height. An hourglass shape between two sets of rings is a saddle or pass. Where lines cross a stream they bend into a V that points upstream, towards higher ground; on a ridge, the V or U points downhill.
5. Spot the depressions. A closed ring with short ticks (hachures) pointing inwards marks a hollow, such as a sinkhole or a crater, lower than the line around it.

The [contour plot guide](/learn/chart-types/cartesian/contour-plot/) explains how software draws contour lines from any grid of values; the rules above are the map-reading conventions on top.

### Worked example: slope from contours

The slope between two contours is the height difference divided by the horizontal distance between them. On the DEM in the demo, with a 100 m interval:

- Just north of the summit, the 2,500 m and 2,200 m contours are 380 m apart on the ground. That is 300 m of drop in 380 m: a gradient of 79%, or about 38°, the inner wall of the crater.
- Further north, across the crater floor, the 2,000 m and 1,900 m contours are 860 m apart: 100 m in 860 m, a gradient of about 12%, or 6.6°.

Both are measured from 70 m cells, which smooth cliffs and gullies, so the real crater wall is locally steeper than 38°.

### How to describe terrain

When you write about a terrain map or a contour map, cover the same points each time:

> The ground rises from [lowest height] at [where] to [highest height] at [where]. [Main landforms: peaks, ridges, valleys, depressions.] It is steepest at [where], about [gradient or angle], and nearly flat at [where]. [Source, cell size and contour interval.]

Worked example, using the demo: "The ground rises from about 600 m in the river valleys at the eastern edge to 2,522 m on the south rim of the Mount St. Helens crater. A horseshoe-shaped crater opens to the north onto a broad, gently sloping plain, and the flat surface of Spirit Lake lies in the north-east corner at about 1,050 m. The crater's inner wall is the steepest ground, about 38° over its upper 300 m; the crater floor slopes at about 7°. USGS 3DEP bare-earth DEM, averaged to 70 m cells, 100 m contours."

## Bathymetry: elevation below the sea

**Bathymetry** is the measurement of the depth of the sea floor, or of a lake or river bed, and a bathymetric map shows it with depth contours and colours in the same way a topographic map shows land.

- How it is measured: ships map the sea floor with multibeam sonar, which times sound pulses across a wide swath under the hull. Green-light lidar from aircraft covers clear, shallow water. In the open ocean, much of the sea floor is still estimated from satellite measurements of the sea surface, whose height follows the gravity of seamounts and trenches beneath it, at a much coarser resolution.
- How much is mapped: the Seabed 2030 project reported in April 2026 that 28.7% of the world's sea floor had been mapped by direct measurement.
- Depth or elevation: nautical charts give depths as positive numbers below a chart datum, a low-tide level, while elevation models such as GEBCO store the sea floor as negative elevations below mean sea level. Convert one to the other before you join land and sea data, or the coastline will step.
- Colour: use one ramp for land and a separate one for water, with the break exactly at 0 m, so the coastline reads at a glance. Shades of blue that darken with depth are the convention.

A bathymetric grid is drawn exactly like a land DEM: as a 3D surface, a heatmap or a contour map, with heights below zero.

## When to use 3D terrain, a contour map or a hillshade

All three views draw the same DEM; choose by what the reader needs to do.

| View | Best for | Weak at |
| --- | --- | --- |
| 3D terrain ([3D surface plot](/learn/chart-types/3d/3d-surface-plot/)) | Seeing the shape of a landscape at once; presentations; exploring by rotating | Measuring distances and heights; high ground hides what is behind it |
| Contour map ([contour plot](/learn/chart-types/cartesian/contour-plot/)) | Reading exact heights and slopes; planning routes; printing | Takes practice to read; flat areas have few lines |
| Hillshade or tinted relief ([heatmap](/learn/chart-types/cartesian/heatmap/)) | A quick, natural-looking picture of the relief; a base layer under other map data | Shading is not height; a hillshade alone gives no values |
| [Point cloud](/learn/chart-types/3d/point-cloud/) | Checking the raw lidar before it becomes a DEM; overhangs, wires and buildings | Large files; no continuous surface |

Most terrain maps combine them: tints for height, a hillshade for shape and contour lines for exact values. The demo below does the same in its map view.

## Common DEM visualisation mistakes

Most mistakes with elevation data come from scales that exaggerate, colours that suggest something false, or cells that are too coarse for the question.

- **Hiding the vertical exaggeration.** At 3× a gentle hill looks like a cliff. Say how much heights are stretched, and use true scale when slopes are the point.
- **Using a rainbow or hue-jumping colour ramp.** Sudden changes in brightness at yellow or cyan draw false edges across smooth slopes, and readers with colour vision deficiency lose the order. Choose tints whose lightness rises steadily with height.
- **Letting colours carry the wrong meaning.** Blue for low land reads as water, and green lowlands and brown uplands imply vegetation that may not be there, such as green for a low desert. Keep blue for water, and explain the tints in a legend.
- **Putting the colour break in the wrong place.** On a map of land and sea, the change from water colours to land colours must sit exactly at 0 m; elsewhere, a shoreline appears where there is none.
- **Using a DEM that is too coarse.** Each cell averages the ground inside it, so peaks are lowered, gullies filled and cliffs softened. Our 70 m grid reads 27 m lower than the real summit.
- **Mixing a surface model with a terrain model.** Flood or slope analysis on a DSM treats buildings and forests as hills. Check what the dataset measures before using it.
- **Ignoring the vertical datum.** Heights above the ellipsoid, above a geoid and above a chart datum can differ by tens of metres; combining them shifts layers against each other.
- **Lighting from the south.** A hillshade lit from the bottom of the map makes many readers see the relief inside out.
- **Drawing no-data as a height.** A value such as -9999 left in the grid becomes a deep pit and stretches the colour scale. Mask it first.

## How to create a 3D terrain map in JavaScript, React or Angular

SciChart.js draws terrain on the graphics card (GPU) with WebGL and WebGPU, so a DEM of tens of thousands of cells stays smooth to rotate, zoom and hover, and much larger grids remain practical. The demo below draws the Mount St. Helens DEM: 40,401 heights from the USGS 3D Elevation Program, on a 70 m grid covering 14 km by 14 km.

Switch between **3D terrain** and **Contour map**. In 3D, drag to rotate, scroll to zoom, double-click to reset and hover the surface to read its height, then move the **Vertical exaggeration** slider from 1× (true scale) to 5× and watch how steep the crater looks. Change the **Contour interval** to see how many lines each choice gives, and turn **Hillshade** off to see how much of the shape comes from the shading. In the contour map, the thick, labelled lines are the index contours, every fifth line.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="3D terrain map" demo="3d-surface-mesh-chart" demoLabel="3D surface mesh chart" docs="/3d-charts/chart-types/surface-mesh-3d/" docsLabel="SciChart.js 3D surface mesh documentation" />

Here is the code for this terrain map. The data decoding and the HTML controls are plain JavaScript; SciChart.js draws the 3D surface, the heatmap, the hillshade and the contours.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } from "scichart";

    const initChart = async (rootElement: string | HTMLDivElement) => {
        // Your DEM: heights in metres, elevation[row][column], one row per step north
        const { elevation, cellKm, minHeight, maxHeight } = await getYourElevationGrid();
        const widthKm = (elevation[0].length - 1) * cellKm;
        const exaggeration = 2; // heights drawn twice their true scale
        const boxHeight = (300 * (maxHeight - minHeight) * exaggeration) / (widthKm * 1000);

        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, boxHeight, 300),
            cameraOptions: { position: new Vector3(90, 270, 300), target: new Vector3(0, 0, -10) }
        });
        // Y is up in SciChart 3D: elevation. X is east and Z is north.
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "East (km)" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
            axisTitle: "Elevation (m)",
            visibleRange: new NumberRange(minHeight, maxHeight)
        });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "North (km)" });

        const dataSeries = new UniformGridDataSeries3D(wasmContext, {
            yValues: elevation,
            xStart: 0,
            xStep: cellKm,
            zStart: 0,
            zStep: cellKm
        });
        sciChart3DSurface.renderableSeries.add(
            new SurfaceMeshRenderableSeries3D(wasmContext, {
                dataSeries,
                // Hypsometric tints: lightness rises with height
                meshColorPalette: new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 0, color: "#2E4A33" },
                        { offset: 0.25, color: "#5A7040" },
                        { offset: 0.5, color: "#9E9058" },
                        { offset: 0.75, color: "#CBA683" },
                        { offset: 1, color: "#F6F1EC" }
                    ]
                }),
                minimum: minHeight,
                maximum: maxHeight,
                drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
                contourInterval: 100, // a contour every 100 m
                contourStroke: "#3B2A1C",
                lightingFactor: 0.7 // shading, like a hillshade
            })
        );
        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(),
            new MouseWheelZoomModifier3D(),
            new ResetCamera3DModifier(),
            new TooltipModifier3D()
        );
        return { sciChartSurface: sciChart3DSurface };
    };

    // SciChartReact creates the chart, sizes it and cleans it up
    export const TerrainMap = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } from "scichart";

    const initChart = async (rootElement: string | HTMLDivElement) => {
        // Your DEM: heights in metres, elevation[row][column], one row per step north
        const { elevation, cellKm, minHeight, maxHeight } = await getYourElevationGrid();
        const widthKm = (elevation[0].length - 1) * cellKm;
        const exaggeration = 2; // heights drawn twice their true scale
        const boxHeight = (300 * (maxHeight - minHeight) * exaggeration) / (widthKm * 1000);

        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, boxHeight, 300),
            cameraOptions: { position: new Vector3(90, 270, 300), target: new Vector3(0, 0, -10) }
        });
        // Y is up in SciChart 3D: elevation. X is east and Z is north.
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "East (km)" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
            axisTitle: "Elevation (m)",
            visibleRange: new NumberRange(minHeight, maxHeight)
        });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "North (km)" });

        const dataSeries = new UniformGridDataSeries3D(wasmContext, {
            yValues: elevation,
            xStart: 0,
            xStep: cellKm,
            zStart: 0,
            zStep: cellKm
        });
        sciChart3DSurface.renderableSeries.add(
            new SurfaceMeshRenderableSeries3D(wasmContext, {
                dataSeries,
                // Hypsometric tints: lightness rises with height
                meshColorPalette: new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 0, color: "#2E4A33" },
                        { offset: 0.25, color: "#5A7040" },
                        { offset: 0.5, color: "#9E9058" },
                        { offset: 0.75, color: "#CBA683" },
                        { offset: 1, color: "#F6F1EC" }
                    ]
                }),
                minimum: minHeight,
                maximum: maxHeight,
                drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
                contourInterval: 100, // a contour every 100 m
                contourStroke: "#3B2A1C",
                lightingFactor: 0.7 // shading, like a hillshade
            })
        );
        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(),
            new MouseWheelZoomModifier3D(),
            new ResetCamera3DModifier(),
            new TooltipModifier3D()
        );
        return { sciChartSurface: sciChart3DSurface };
    };

    @Component({
        selector: "app-terrain-map",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class TerrainMapComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- `SurfaceMeshRenderableSeries3D` draws the DEM as a continuous surface. Its `meshColorPalette`, `minimum` and `maximum` set the height tints; `drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS` and `contourInterval` drape contour lines over it; `lightingFactor` turns the shading up or down.
- The heights go into a `UniformGridDataSeries3D` as a 2D array, with the cell size as `xStep` and `zStep`. In SciChart.js 3D the Y axis is vertical, so elevation is Y, east is X and north is Z.
- Vertical exaggeration is the box's proportions: `worldDimensions` sets its width, height and depth, so stretching the height while the axis range stays the same stretches every slope.
- The map view is a 2D `UniformHeatmapRenderableSeries` for the tints, a second, semi-transparent one for the hillshade, and a `UniformContoursRenderableSeries` with `minorsPerMajor: 4` for index contours every fifth line, all fed from the same grid.

**See it in the demo app:** [JavaScript 3D surface mesh chart](https://www.scichart.com/demo/javascript/3d-surface-mesh-chart) · [React 3D surface mesh chart](https://www.scichart.com/demo/react/3d-surface-mesh-chart) · [Angular 3D surface mesh chart](https://www.scichart.com/demo/angular/3d-surface-mesh-chart). Related: the [React heatmap chart with contours](https://www.scichart.com/demo/react/heatmap-chart-with-contours) and the [React 3D LiDAR chart](https://www.scichart.com/demo/react/3d-lidar-visualization).

**Go deeper:** [SciChart.js 3D surface mesh documentation](/3d-charts/chart-types/surface-mesh-3d/), the [contours series documentation](/2d-charts/chart-types/uniform-contours-renderable-series/), and the learning center guides to the [3D surface plot](/learn/chart-types/3d/3d-surface-plot/), [contour plot](/learn/chart-types/cartesian/contour-plot/), [heatmap](/learn/chart-types/cartesian/heatmap/) and [point cloud](/learn/chart-types/3d/point-cloud/). For the industry, see SciChart for [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What is a digital elevation model in GIS?

In GIS, a digital elevation model (DEM) is a raster layer: a grid of equal square cells in which each cell holds the height of the ground at that spot. It is the base for slope, aspect, hillshade, contour, watershed, flood and line-of-sight analysis, and for 3D views of the landscape. Most DEMs are stored as GeoTIFF files with a map projection and a vertical datum, so each height has a known position and a known zero.

### What is the difference between a DEM, a DSM and a DTM?

A digital surface model (DSM) records the top of whatever is there: rooftops, tree canopy and bridges as well as open ground. A digital terrain model (DTM) records the bare earth with those removed. Digital elevation model (DEM) is the general term; agencies such as the US Geological Survey use it for the bare-earth model, so check which one a dataset is before using it.

### Where can I get a digital elevation model?

Free DEMs are published by national mapping and space agencies. In the USA, the USGS 3D Elevation Program offers bare-earth DEMs at 1 m, about 10 m and about 30 m through The National Map. For the rest of the world, the SRTM 1 arc-second DEM (about 30 m, between 60° N and 56° S) and the Copernicus GLO-30 surface model (30 m) cover almost all land, and the GEBCO grid covers the land and the sea floor at 15 arc-seconds.

### What is the best digital elevation model?

The best DEM is the finest one that covers your area and measures the surface you need. Lidar-based bare-earth DEMs at 1 to 2 m are best for flooding, drainage and engineering. Where there is no lidar, 30 m global models such as Copernicus GLO-30 or SRTM are the usual choice; Copernicus GLO-30 is a surface model, so it includes buildings and trees. Check the date, the vertical accuracy, the vertical datum and whether water bodies have been flattened.

### How do you read a topographic map?

Find the contour interval in the map margin, then use the thicker, labelled index contours to read heights. Each brown line joins points of equal height. Lines close together mean steep ground and lines far apart mean gentle ground. Closed rings are hilltops, an hourglass between two hills is a saddle, lines that bend into a V pointing upstream mark a valley, and rings with inward ticks mark a depression.

### How do I make a 3D terrain map in JavaScript?

Load your DEM as a 2D array of heights, one row per step north, and draw it on a GPU-accelerated 3D chart. With SciChart.js, put the array in a `UniformGridDataSeries3D` with the cell size as the x and z steps, and draw it with a `SurfaceMeshRenderableSeries3D`, a `GradientColorPalette` for the height tints and a `contourInterval` for contour lines. The 3D surface's `worldDimensions` sets the vertical exaggeration. React and Angular apps reach the same code through `scichart-react` and `scichart-angular`.

## Sources

- U.S. Geological Survey, [What is a digital elevation model (DEM)?](https://www.usgs.gov/faqs/what-a-digital-elevation-model-dem). The USGS definition of a DEM as the bare-earth surface, and its move from map-derived to lidar-derived DEMs.
- U.S. Geological Survey, [About 3DEP products and services](https://www.usgs.gov/3d-elevation-program/about-3dep-products-services). The 3DEP DEM products and their cell sizes. The elevation data in the demo come from the 3DEP elevation service and are free of use restrictions.
- U.S. Geological Survey, [Shuttle Radar Topography Mission (SRTM) 1 Arc-Second Global](https://doi.org/10.5066/F7PR7TFT). Mission dates, coverage from 60° N to 56° S and the 1 arc-second product.
- Copernicus Data Space Ecosystem, [Copernicus DEM: global and European digital elevation model](https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM). GLO-30 as a 30 m surface model from TanDEM-X data.
- GEBCO, [Gridded bathymetry data](https://www.gebco.net/data-products/gridded-bathymetry-data). The global 15 arc-second grid of land and sea floor elevation.
- International Hydrographic Organization, [Global seabed mapping reaches new milestone as five million square kilometres added in a year](https://iho.int/en/global-seabed-mapping-reaches-new-milestone-as-five-million-square-kilometres-added-in-a-year) (28 April 2026). The Seabed 2030 figure of 28.7% of the ocean floor mapped.
- U.S. Geological Survey, [Topographic map symbols](https://pubs.usgs.gov/gip/TopographicMapSymbols/topomapsymbols.pdf). Contour lines, index contours, contour intervals and depression contours on USGS maps.
- Esri, [How Hillshade works](https://doc.esri.com/en/arcgis-pro/latest/tool-reference/3d-analyst/how-hillshade-works.html). The hillshade calculation and its default sun azimuth of 315° and altitude of 45°.
- U.S. Geological Survey, [Mount St. Helens: from the 1980 eruption to 2000](https://pubs.usgs.gov/fs/2000/fs036-00/), Fact Sheet 036-00. The summit height of 8,363 ft (2,549 m) after the 1980 eruption, the north-facing horseshoe-shaped crater and its floor at 6,279 ft (1,914 m).
- Biland, J. and Çöltekin, A. (2017), [An empirical assessment of the impact of the light direction on the relief inversion effect in shaded relief maps](https://doi.org/10.1080/15230406.2016.1185647), Cartography and Geographic Information Science 44(4), 358–372. Why light from the south makes many readers see valleys as ridges.
- Crameri, F., Shephard, G. E. and Heron, P. J. (2020), [The misuse of colour in science communication](https://doi.org/10.1038/s41467-020-19160-7), Nature Communications 11, 5444. Why rainbow colour maps distort data, and perceptually uniform alternatives.

<LearnCta position="bottom" chart="3D terrain map" demo="3d-surface-mesh-chart" demoLabel="3D surface mesh chart" docs="/3d-charts/chart-types/surface-mesh-3d/" docsLabel="SciChart.js 3D surface mesh documentation" />
