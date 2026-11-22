---
sidebar_position: 20
sidebar_label: Point Cloud
title: "Point Cloud: What It Is, How LiDAR Makes One & How to View It"
description: "What a point cloud is, how LiDAR, photogrammetry and depth cameras make one, what each point stores, the file formats, and how to colour, filter, thin and view large sets of 3D points."
keywords:
    [
        "point cloud",
        "what is a point cloud",
        "point cloud data",
        "3d point cloud",
        "lidar point cloud",
        "lidar data",
        "what is lidar data",
        "lidar data processing",
        "point cloud visualization",
        "point cloud viewer",
        "point cloud classification",
        "point cloud vs mesh",
        "las file",
        "voxel downsampling"
    ]
image: /img/learn/point-cloud-og.png
related: [3d-surface-plot, scatter-plot, heatmap, big-data-visualization]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a point cloud in simple terms?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A point cloud is a very large set of dots in 3D space, each dot marking one spot where a scanner or camera detected a surface. Seen together, millions of dots trace the shape of the ground, buildings, trees, a room or a machine part. Each dot has x, y and z coordinates and often extra values such as colour, brightness of the echo or a class like ground or building."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is LiDAR point cloud data?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "LiDAR point cloud data is the set of 3D points a laser scanner records by timing how long its light pulses take to bounce back. Combined with the scanner's position and orientation, each echo becomes a point with x, y and z coordinates, plus its intensity, its return number, the number of returns from that pulse, a GPS time stamp and, after processing, a class such as ground, vegetation or building. It is usually stored in LAS or compressed LAZ files."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a point cloud and a mesh?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A point cloud is only the measured points, with no connections between them, so it has gaps and you can see through it. A mesh joins points into triangles that form a continuous surface, which can be shaded, measured for area and volume, 3D printed or used in a game engine or CAD tool. Meshes are made from point clouds by surface reconstruction, which smooths away fine detail and noise."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What file formats are used for point clouds?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "LAS is the standard binary format for LiDAR, defined by ASPRS, and LAZ is its losslessly compressed form. COPC is a LAZ file arranged as an octree so a viewer can stream just the area it needs. E57 (ASTM E2807) is common for terrestrial laser scanners and can hold images too. PLY is popular in 3D graphics and research, and XYZ, TXT or CSV text files hold one point per line."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How many points are in a LiDAR point cloud?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "It depends on the point density and the area. The US Geological Survey's quality level 2 needs at least 2 pulses per square metre, which is 2 million per square kilometre, and quality levels 1 and 0 need at least 8, which is 8 million per square kilometre. Multiple returns from vegetation add more. A city survey easily reaches billions of points, and a single terrestrial scan of a room can hold tens of millions."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I visualise a point cloud in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Use a 3D chart that draws on the GPU, with WebGL and WebGPU, so it can handle hundreds of thousands of points; the demo on this page draws about 265,000. With SciChart.js, put the coordinates into an XyzDataSeries3D as Float64Arrays, give each point a colour in its metadata (by height, intensity or class), and draw it with a ScatterRenderableSeries3D and a PixelPointMarker3D. Add OrbitModifier3D and MouseWheelZoomModifier3D to rotate and zoom. React and Angular apps reach the same code through scichart-react and scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# Point Cloud

## What is a point cloud?

A **point cloud** is a set of points in 3D space, each one a measured spot on the surface of an object or a landscape, with x, y and z coordinates and often extra values such as colour, echo strength or a class. Laser scanners (LiDAR), photogrammetry and depth cameras produce them, often millions of points at a time.

![A simulated airborne LiDAR point cloud of a 150 by 100 metre site in 3D, coloured by height from blue at the lowest ground through green and yellow to red at the tallest trees: rolling ground, a road, two gabled houses and two flat-roofed buildings, round tree crowns, a pond with almost no returns, and a power line with two towers](/img/learn/point-cloud-og.png)

*About 265,000 points from a simulated airborne LiDAR survey, coloured by height (sample data). The dark gaps beside each building are ground the scanner could not see, and the pond is almost empty because water absorbs the laser. [Try the interactive version](#how-to-visualise-a-point-cloud-in-javascript-react-or-angular).*

:::tip Key takeaways
- A point cloud is raw measurement: separate points with no surface joining them, so it has gaps, noise and see-through areas.
- Every point has a position; LiDAR points also carry intensity, return number, classification and a GPS time.
- LiDAR finds distance by timing a light pulse there and back: 1 nanosecond of round trip is about 15 cm of range.
- To read one, colour it by height, intensity or class, filter out noise and ground, and look from above as well as in 3D.
- Surveys run to millions or billions of points, so display relies on the GPU, level of detail and sensible thinning.
:::

Point clouds are the raw material for terrain maps, flood models, forest inventories, building surveys, self-driving car perception and digital twins. Most are turned into something else in the end, such as a surface, a mesh or a CAD model, but people look at the points first to check what was captured.

## What does each point in a point cloud store?

The position is the only thing every point cloud has. Everything else depends on the sensor and the processing.

| Attribute | What it means | Where it comes from |
| --- | --- | --- |
| X, Y, Z | The point's position, usually easting, northing and elevation in a map projection, or metres from the scanner | Every sensor |
| Intensity | How strong the echo was. Bright for paint, concrete and grass in near-infrared light; dark for asphalt and water | LiDAR |
| Return number and number of returns | Which echo of its pulse this point was ("2 of 3") | LiDAR |
| Classification | What the point hit: ground, vegetation, building, water, wire and so on | Processing, by software or by hand |
| RGB colour | The colour of the surface, from a camera | Photogrammetry, or a camera beside the scanner |
| GPS time | When the pulse was fired, to link the point to the flight path | Airborne and mobile LiDAR |
| Scan angle, flight line | Which way the scanner was pointing, and which pass the point came from | LiDAR |
| Normal vector | The direction the surface faces at the point | Calculated from neighbouring points |

The ASPRS LAS specification, the standard LiDAR file format, defines numbered classes so every tool agrees on what "6" means. The ones you will meet most:

| Class code | Meaning | Class code | Meaning |
| --- | --- | --- | --- |
| 1 | Unclassified | 7 | Low point (noise) |
| 2 | Ground | 9 | Water |
| 3 | Low vegetation | 11 | Road surface |
| 4 | Medium vegetation | 14 | Wire (conductor) |
| 5 | High vegetation | 15 | Transmission tower |
| 6 | Building | 18 | High noise |

## How is a point cloud made?

A point cloud is made by a sensor that measures the distance to many spots on a surface: a laser scanner, overlapping photos or a depth camera.

### LiDAR: timing laser pulses

**LiDAR** (light detection and ranging) fires short laser pulses and times each echo. Light travels about 30 cm in a nanosecond, and the pulse goes out and comes back, so the range is the speed of light times the round-trip time, divided by two. A target 1,000 m below an aircraft answers in about 6.7 microseconds, and timing it to the nearest nanosecond pins the range to about 15 cm.

![How an airborne LiDAR pulse becomes points: an aircraft with a laser scanner, GNSS and IMU fires a pulse that returns three echoes from a tree (canopy top, a branch and the ground) and another that returns once from a flat roof. A formula box gives range = c times round-trip time divided by two, so 1 ns is about 15 cm. A panel lists one point record: X, Y and Z, intensity, return 1 of 3, classification 5 high vegetation, scan angle and GPS time](./lidar-pulse-returns.svg)

The range alone is not a point. The scanner also records the angle of its mirror, a GNSS receiver records where the aircraft or vehicle was, and an inertial measurement unit (IMU) records which way it was pointing. Software combines the three to place each echo in map coordinates.

One pulse can give several points. The laser spot is tens of centimetres wide by the time it reaches the ground, so part of it can reflect off leaves while the rest carries on to branches and the ground. Each echo is a **return**, numbered from the first. This is how LiDAR maps the ground under a forest, where a camera only sees the treetops. A pond, by contrast, returns almost nothing: water absorbs near-infrared light, so bathymetric LiDAR uses green light, which reaches the bottom.

| Platform | How it scans | Typical use |
| --- | --- | --- |
| Airborne (plane or helicopter) | A mirror sweeps the beam across the flight path while the aircraft flies forwards | Terrain and city mapping over hundreds of square kilometres |
| Drone (UAV) | The same, lower and slower, so denser | Sites, mines, solar farms, corridors |
| Terrestrial (tripod) | The scanner spins on the spot, scanning from several stations that are joined later | Buildings, plant rooms, heritage, crime scenes |
| Mobile (vehicle or backpack) | Spinning scanners on a moving platform, located by GNSS, IMU or SLAM | Roads, railways, tunnels, autonomous vehicles |
| Spaceborne | A laser altimeter in orbit, such as the one on NASA's ICESat-2 | Ice sheets, sea ice, forest height |

### Photogrammetry: matching photos

Photogrammetry finds the same features in many overlapping photos and works out, from the change in viewpoint, where each feature sits in 3D. Software based on structure from motion and dense matching turns a few hundred drone photos into a coloured point cloud. It is cheap and gives true colour, but it rarely sees the ground through vegetation, and it struggles on plain, shiny or moving surfaces.

### Depth cameras and structured light

Depth cameras give a point cloud of a room or an object at video rate. Time-of-flight cameras time light like LiDAR but across a whole image at once; structured-light scanners project a pattern and measure how it bends over the surface; stereo cameras compare two views. They work at short range and suit robotics, gesture tracking and scanning small parts.

## Point cloud file formats

Most LiDAR point clouds come as LAS files or their compressed form, LAZ; scanners and 3D software add a few formats of their own.

| Format | What it is | Used for |
| --- | --- | --- |
| LAS | The ASPRS binary standard for LiDAR. Stores coordinates as scaled integers plus the attributes above | Almost all airborne and mobile LiDAR delivery |
| LAZ | LAS compressed without losing anything, often to a fraction of the size | Downloads and archives |
| COPC | A LAZ file laid out as an octree, so a viewer can fetch just the area and detail it needs | Streaming large surveys to the browser |
| E57 | The ASTM E2807 standard, which can hold several scans, their positions and their images | Terrestrial scanners, scan-to-BIM |
| PLY | A simple format from 3D graphics that holds points or meshes, in text or binary | Research, photogrammetry and 3D printing tools |
| XYZ, TXT, CSV | One point per line of text | Quick exchange of small clouds |

Public LiDAR is free to download in many countries. In the USA, the [USGS 3D Elevation Program](https://www.usgs.gov/3d-elevation-program) publishes LAZ tiles for most of the country, and [NOAA](https://coast.noaa.gov/dataviewer/) publishes coastal surveys.

## How to read and visualise a point cloud

A point cloud on screen is a swarm of dots, and with no surface to shade, the eye struggles to see depth. Viewers use a handful of techniques to make it readable.

- Colour by height. A colour ramp from low to high makes terrain, buildings and trees separate at a glance. On sloping ground, colour by height above ground instead, or the slope swamps everything else.
- Colour by intensity. A greyscale of echo strength looks like a black-and-white photo: road markings, kerbs and different roofs show up even where the height is flat.
- Colour by class. One colour per class checks the automatic classification: green crowns, red roofs, brown ground. Errors stand out, such as a car marked as building.
- Colour by return number. First returns of many trace canopy tops; last returns of many show where pulses reached the ground under vegetation.
- Colour by RGB. Photo colours, if the survey has them, are the easiest for non-specialists to read.
- Point size. One pixel per point keeps detail; bigger points fill gaps when zoomed in or thinned, but blur fine structure.
- Cross-sections. A thin slice along a road or through a building, seen from the side, shows heights and clearances better than any 3D view.
- Top-down rasters. Gridding the points into cells (highest point, mean intensity, class of the top point) turns the cloud into a 2D image, a [heatmap](/learn/chart-types/cartesian/heatmap/), which is easy to read, measure and compare.
- Depth cues. Eye-dome lighting darkens the edges of anything in front of something further away, which gives a shaded look without a mesh. Rotating the view does the same job.

To describe a point cloud, give the area, the sensor, the density and what it shows: "A 150 × 100 m airborne survey at about 16 pulses per m², showing four buildings, about 40 trees, a road and a power line; the pond has almost no returns."

## Point cloud density, accuracy and size

Density is the number of points, or pulses, per square metre. Accuracy is how close each point is to the truth. A dense cloud can still be inaccurate if the scanner's position was wrong.

The USGS sets quality levels for the US 3D Elevation Program:

| USGS quality level | Pulse density (at least) | Pulse spacing (at most) | Vertical accuracy (RMSEz) | Pulses per km² |
| --- | --- | --- | --- | --- |
| QL0 | 8 per m² | 0.35 m | 5 cm | 8 million |
| QL1 | 8 per m² | 0.35 m | 10 cm | 8 million |
| QL2 | 2 per m² | 0.71 m | 10 cm | 2 million |
| QL3 | 0.5 per m² | 1.41 m | 20 cm | 0.5 million |

Storing x, y and z as 64-bit numbers takes 24 bytes per point, so 8 million points need 192 MB before any attributes, and a county-wide survey runs to billions of points. Viewers cope in three ways: they send the points to the GPU once and let it draw them, they keep the data in typed arrays rather than JavaScript objects, and for the largest surveys they load a level of detail that matches the zoom, from an octree such as COPC.

## Point cloud processing basics

Most point clouds go through the same steps between capture and use.

1. Registration. Scans from different positions, or flight lines from different passes, are aligned so the same wall lines up. Algorithms such as iterative closest point (ICP) match overlapping areas.
2. Noise removal. Points far from their neighbours, such as birds, dust and multipath echoes below the ground, are flagged as noise. A single stray point 50 m up is enough to stretch a height colour scale.
3. Ground classification. Software separates the ground from everything on it, for example by growing a surface up from the lowest points or by draping a virtual cloth under the upturned cloud.
4. Further classification. Vegetation, buildings, wires and water are labelled by rules on height above ground, shape and returns, and more and more by machine learning.
5. Thinning (downsampling). Random sampling keeps 1 in N points but leaves dense areas dense. A **voxel grid** divides space into cubes and keeps one point per cube, which evens out the density, for example where flight lines overlap.
6. Products. The ground points become a digital terrain model (DTM); the highest points become a digital surface model (DSM); the difference is height above ground, or the canopy height model (CHM) over forest. Points can also be meshed into a surface or fitted with CAD shapes.

![A cross-section through a point cloud: brown ground points along a sloping line, green tree points and red roof points above. A dashed blue line, the DSM, runs over the roof and treetops; a solid brown line, the DTM, runs along the bare ground under them; arrows show height above ground, about 12 m at a tree (the canopy height model) and 7 m at a roof ridge](./dsm-dtm-chm-profile.svg)

Gridded models like the DTM are what a [3D surface plot](/learn/chart-types/3d/3d-surface-plot/) or a contour map shows: one height per cell, which is easier to analyse than raw points but loses overhangs, wires and anything under a canopy.

## Where are point clouds used?

Point clouds are used wherever the exact shape of the ground, a building or an object has to be measured.

| Field | What the point cloud is for |
| --- | --- |
| Surveying and mapping | Terrain models, flood and drainage modelling, volumes of stockpiles and earthworks |
| Autonomous vehicles and robots | Spinning LiDAR finds cars, people and kerbs around the vehicle many times a second |
| Forestry and ecology | Tree height, canopy cover and biomass, from the returns that pass through the canopy |
| Construction and BIM | As-built surveys, scan-to-BIM models, checking work against the design |
| Utilities | Power line sag and vegetation clearance, from wire and vegetation classes |
| Heritage | Detailed records of buildings and sites before restoration or loss |
| Aerospace and defence | Terrain and obstacle mapping, target recognition, helicopter landing aids |
| Space | Laser altimetry of ice sheets from orbit, and maps of the Moon and Mars |

### Other 3D point data: trajectories and positions

The same chart that draws a LiDAR survey draws any set of x, y, z points: the positions of a satellite or a launch vehicle from its telemetry, a flight path, GPS tracks, particle tracks in a detector, or sensor readings taken around a 3D space. For trajectories, colour each point by time or speed rather than height, and draw a line through them in order if the order matters. For live data, append new positions as they arrive.

## Point cloud vs mesh vs 3D surface plot vs heatmap

A point cloud keeps every measured point, while a mesh, a surface plot or a heatmap turns the points into something smoother and easier to analyse.

| | Point cloud | Mesh | [3D surface plot](/learn/chart-types/3d/3d-surface-plot/) | [Heatmap](/learn/chart-types/cartesian/heatmap/) or raster |
| --- | --- | --- | --- | --- |
| What it is | Separate measured points | Triangles joining points into a surface | One height per cell of a regular grid | One value per cell, seen from above |
| Handles overhangs, wires, layers under canopy | Yes | Partly | No | No |
| Gaps and noise | Visible as they are | Filled in or smoothed | Interpolated | Interpolated or left blank |
| Good for | Checking raw data, classification, measuring clearances | Rendering, volumes, 3D printing, CAD | Showing a measured field or terrain shape | Maps, measuring, comparing two dates |
| Size | Largest | Smaller | Small | Smallest |

Use the point cloud when you need to see what was really captured; turn it into a surface or raster once you know what you need from it.

## Common point cloud visualisation mistakes

Most point cloud mistakes come from treating gaps, noise or stretched scales as if they were part of the scene.

- **Leaving noise in.** A few stray points high in the sky or below ground stretch the axis and the colour scale, so the real scene is squashed into a narrow band of colour. Filter classes 7 and 18, or clip the colour scale to percentiles.
- **Losing precision in 32-bit floats.** A 32-bit float has about 7 significant digits. A northing of 4,500,000.12 m stored as one becomes 4,500,000, a 12 cm error, and neighbouring points snap together. Keep coordinates in 64-bit, or subtract a local origin first, as LAS does with its scale and offset.
- **Reading no data as nothing there.** Empty strips beside buildings are occlusion, empty water is absorption, and gaps between flight lines are coverage. Show them as no data, not as zero height.
- **Thinning by taking every Nth point in file order.** Points are stored in scan order, so every Nth point can follow the scan pattern and leave stripes. Use a random sample or a voxel grid.
- **Mixing up surface and terrain.** A DSM includes roofs and trees; a DTM is the bare earth. Flood or slope analysis on a DSM treats buildings as hills.
- **Colouring by absolute height on a slope.** On a hillside, the colour shows the hill, not the objects on it. Use height above ground.
- **Hiding vertical exaggeration.** Stretching the height axis makes small features visible, but say so, or slopes and heights look steeper than they are.
- **Ignoring units and datums.** Mixing feet and metres, or two vertical datums, shifts layers against each other by metres. Check the coordinate reference system in the file header.

## How to visualise a point cloud in JavaScript, React or Angular

The demo below draws a simulated airborne LiDAR survey of about 265,000 points with SciChart.js, and recolours, filters or thins all of them each time you change a control. A seeded random generator builds the scene: ground, a road with painted lines, buildings, trees with multiple returns, a pond, a power line and a few noise points.

Change **Colour by** to see the same points by height, intensity, class and return number; intensity picks out the road paint, and return number shows the ground under the trees. Use **Show** to strip out the ground, keep only the bare earth, or put the noise back and watch the scene flatten. Under **Points**, compare a random 1 in 16 with a 1 m voxel grid. Slide **Point size** up to fill the gaps. Switch **View** to the top-down grid for a 2D raster of the same points, where height mode gives a surface model and "Ground only" gives a terrain model. Drag to rotate, scroll to zoom, double-click to reset, and hover a point to read its class and values.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="LiDAR point cloud" demo="3d-lidar-visualization" demoLabel="3D LiDAR chart" docs="/3d-charts/chart-types/scatter-3d-chart/" docsLabel="SciChart.js 3D scatter chart documentation" />

Here is the code for this point cloud. The scene simulation and the HTML controls are plain JavaScript; SciChart.js draws the 3D points and the top-down heatmap.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        XyzDataSeries3D,
        ScatterRenderableSeries3D,
        PixelPointMarker3D,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier
    } from "scichart";

    // A colour ramp from blue (low) to red (high), as ARGB integers
    const heightColor = (t: number) => {
        const r = Math.round(255 * Math.min(1, Math.max(0, 2 * t - 0.5)));
        const g = Math.round(255 * (1 - Math.abs(2 * t - 1)));
        const b = Math.round(255 * Math.min(1, Math.max(0, 1.5 - 2 * t)));
        return (0xff000000 | (r << 16) | (g << 8) | b) >>> 0;
    };

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, 60, 200),
            cameraOptions: { position: new Vector3(-190, 180, -215), target: new Vector3(0, 0, 0) }
        });
        // Y is up in SciChart 3D: elevation. X is east and Z is north.
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "East (m)" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Elevation (m)" });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "North (m)" });

        // Your points as Float64Arrays: x (east), y (elevation), z (north)
        const { x, y, z } = await getYourPointCloud();
        let minY = Infinity, maxY = -Infinity;
        for (const value of y) {
            minY = Math.min(minY, value);
            maxY = Math.max(maxY, value);
        }
        const metadata = Array.from(y, (value) => ({ vertexColor: heightColor((value - minY) / (maxY - minY)) }));
        const dataSeries = new XyzDataSeries3D(wasmContext, { xValues: x, yValues: y, zValues: z, metadata });

        sciChart3DSurface.renderableSeries.add(
            new ScatterRenderableSeries3D(wasmContext, {
                dataSeries,
                pointMarker: new PixelPointMarker3D(wasmContext, { fill: "#FFFFFF" }) // one pixel per point
            })
        );
        sciChart3DSurface.chartModifiers.add(new OrbitModifier3D(), new MouseWheelZoomModifier3D(), new ResetCamera3DModifier());
        return { sciChartSurface: sciChart3DSurface };
    };

    // SciChartReact creates the chart, sizes it and cleans it up
    export const PointCloud = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        XyzDataSeries3D,
        ScatterRenderableSeries3D,
        PixelPointMarker3D,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier
    } from "scichart";

    // A colour ramp from blue (low) to red (high), as ARGB integers
    const heightColor = (t: number) => {
        const r = Math.round(255 * Math.min(1, Math.max(0, 2 * t - 0.5)));
        const g = Math.round(255 * (1 - Math.abs(2 * t - 1)));
        const b = Math.round(255 * Math.min(1, Math.max(0, 1.5 - 2 * t)));
        return (0xff000000 | (r << 16) | (g << 8) | b) >>> 0;
    };

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, 60, 200),
            cameraOptions: { position: new Vector3(-190, 180, -215), target: new Vector3(0, 0, 0) }
        });
        // Y is up in SciChart 3D: elevation. X is east and Z is north.
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "East (m)" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Elevation (m)" });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "North (m)" });

        // Your points as Float64Arrays: x (east), y (elevation), z (north)
        const { x, y, z } = await getYourPointCloud();
        let minY = Infinity, maxY = -Infinity;
        for (const value of y) {
            minY = Math.min(minY, value);
            maxY = Math.max(maxY, value);
        }
        const metadata = Array.from(y, (value) => ({ vertexColor: heightColor((value - minY) / (maxY - minY)) }));
        const dataSeries = new XyzDataSeries3D(wasmContext, { xValues: x, yValues: y, zValues: z, metadata });

        sciChart3DSurface.renderableSeries.add(
            new ScatterRenderableSeries3D(wasmContext, {
                dataSeries,
                pointMarker: new PixelPointMarker3D(wasmContext, { fill: "#FFFFFF" }) // one pixel per point
            })
        );
        sciChart3DSurface.chartModifiers.add(new OrbitModifier3D(), new MouseWheelZoomModifier3D(), new ResetCamera3DModifier());
        return { sciChartSurface: sciChart3DSurface };
    };

    @Component({
        selector: "app-point-cloud",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class PointCloudComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- `ScatterRenderableSeries3D` with a `PixelPointMarker3D` draws one pixel per point, the usual marker for large clouds. Swap in a `QuadPointMarker` with a `size` in world units for bigger, camera-facing squares.
- Coordinates go into an `XyzDataSeries3D` as `Float64Array`s, which keeps full precision. Each point's colour is the `vertexColor` in its metadata, an ARGB integer, so any colouring (height, intensity, class) is a loop over the points.
- In SciChart.js 3D the Y axis is vertical, so map elevation to Y and the two ground directions to X and Z. `worldDimensions` sets the box size and so the vertical exaggeration.
- The top-down view is a 2D `UniformHeatmapRenderableSeries` with one cell per square metre; `containsNaN` draws empty cells as transparent, so no-data stays visible.

**See it in the demo app:** [JavaScript 3D LiDAR chart](https://www.scichart.com/demo/javascript/3d-lidar-visualization) · [React 3D LiDAR chart](https://www.scichart.com/demo/react/3d-lidar-visualization) · [Angular 3D LiDAR chart](https://www.scichart.com/demo/angular/3d-lidar-visualization). Related: the [React real-time 3D surface mesh](https://www.scichart.com/demo/react/realtime-3d-surface-mesh-chart) and the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart).

**Go deeper:** [SciChart.js 3D scatter chart documentation](/3d-charts/chart-types/scatter-3d-chart/), the [3D bubble chart](/3d-charts/chart-types/bubble-3d-chart/) for per-point sizes, and the learning center guides to the [3D surface plot](/learn/chart-types/3d/3d-surface-plot/), [heatmap](/learn/chart-types/cartesian/heatmap/) and [big data visualization](/learn/big-data/big-data-visualization/). For the industry, see SciChart for [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What is a point cloud in simple terms?

A point cloud is a very large set of dots in 3D space, each dot marking one spot where a scanner or camera detected a surface. Seen together, millions of dots trace the shape of the ground, buildings, trees, a room or a machine part. Each dot has x, y and z coordinates and often extra values such as colour, brightness of the echo or a class like ground or building.

### What is LiDAR point cloud data?

LiDAR point cloud data is the set of 3D points a laser scanner records by timing how long its light pulses take to bounce back. Combined with the scanner's position and orientation, each echo becomes a point with x, y and z coordinates, plus its intensity, its return number, the number of returns from that pulse, a GPS time stamp and, after processing, a class such as ground, vegetation or building. It is usually stored in LAS or compressed LAZ files.

### What is the difference between a point cloud and a mesh?

A point cloud is only the measured points, with no connections between them, so it has gaps and you can see through it. A mesh joins points into triangles that form a continuous surface, which can be shaded, measured for area and volume, 3D printed or used in a game engine or CAD tool. Meshes are made from point clouds by surface reconstruction, which smooths away fine detail and noise.

### What file formats are used for point clouds?

LAS is the standard binary format for LiDAR, defined by ASPRS, and LAZ is its losslessly compressed form. COPC is a LAZ file arranged as an octree so a viewer can stream just the area it needs. E57 (ASTM E2807) is common for terrestrial laser scanners and can hold images too. PLY is popular in 3D graphics and research, and XYZ, TXT or CSV text files hold one point per line.

### How many points are in a LiDAR point cloud?

It depends on the point density and the area. The US Geological Survey's quality level 2 needs at least 2 pulses per square metre, which is 2 million per square kilometre, and quality levels 1 and 0 need at least 8, which is 8 million per square kilometre. Multiple returns from vegetation add more. A city survey easily reaches billions of points, and a single terrestrial scan of a room can hold tens of millions.

### How do I visualise a point cloud in JavaScript?

Use a 3D chart that draws on the GPU, with WebGL and WebGPU, so it can handle hundreds of thousands of points; the demo on this page draws about 265,000. With SciChart.js, put the coordinates into an `XyzDataSeries3D` as `Float64Array`s, give each point a colour in its metadata (by height, intensity or class), and draw it with a `ScatterRenderableSeries3D` and a `PixelPointMarker3D`. Add `OrbitModifier3D` and `MouseWheelZoomModifier3D` to rotate and zoom. React and Angular apps reach the same code through `scichart-react` and `scichart-angular`.

## Sources

- ASPRS, [LAS Specification 1.5: format definition](https://lasformat.org/latest/02.00_definition.html). Point data record formats 6 to 10, the attributes of each point, the standard point classes, and scaled-integer coordinates.
- U.S. Geological Survey, [Topographic data quality levels](https://www.usgs.gov/3d-elevation-program/topographic-data-quality-levels-qls). Pulse density, pulse spacing and vertical accuracy for QL0 to QL3 in the 3D Elevation Program.
- NOAA National Ocean Service, [What is LIDAR?](https://oceanservice.noaa.gov/facts/lidar.html). How LiDAR works, its parts, and near-infrared topographic versus green bathymetric LiDAR.
- COPC, [Cloud Optimized Point Cloud specification](https://copc.io/). LAZ 1.4 data arranged as a clustered octree for streaming.
- ASTM, [E2807 Standard Specification for 3D Imaging Data Exchange](https://www.astm.org/e2807-11r19e01.html). The E57 file format.
- NASA, [ICESat-2: how it works](https://icesat-2.gsfc.nasa.gov/how-it-works). The ATLAS laser altimeter measuring surface height from orbit.

<LearnCta position="bottom" chart="LiDAR point cloud" demo="3d-lidar-visualization" demoLabel="3D LiDAR chart" docs="/3d-charts/chart-types/scatter-3d-chart/" docsLabel="SciChart.js 3D scatter chart documentation" />
