---
sidebar_position: 300
sidebar_label: Weather Radar
title: "How to Read Weather Radar: What the Colours Mean (Interactive)"
description: "How to read weather radar: what each colour means in dBZ, from green rain to pink hail, how radar works, velocity couplets, false echoes, and radar vs satellite."
keywords:
    [
        "how to read weather radar",
        "weather radar colors",
        "what do the colors mean on weather radar",
        "what does pink mean on weather radar",
        "what does yellow mean on weather radar",
        "what does purple mean on weather radar",
        "what does red mean on weather radar",
        "what does blue mean on weather radar",
        "what does white mean on weather radar",
        "what is a weather radar",
        "how does weather radar work",
        "dbz",
        "radar reflectivity",
        "doppler radar velocity",
        "radar vs satellite"
    ]
image: /img/learn/weather-radar-og.png
related: [radar-display, sonar, heatmap, antenna-radiation-pattern]
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
                    "name": "What does pink mean on weather radar?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "On a reflectivity scale, pink (magenta) means about 65 to 74 dBZ, near the top of the scale, and almost always means hail in a strong thunderstorm. On a winter precipitation-type display, pink means mixed precipitation: sleet, freezing rain, or rain and snow together. The key on the image shows which one it is."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What does yellow mean on weather radar?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yellow means moderate to heavy rain, about 35 to 44 dBZ on the classic scale. If it's all rain, that's roughly 6 to 24 mm (0.2 to 0.9 in) an hour. Yellow inside a band of green usually marks the stronger cells in a line of showers or thunderstorms."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What do the colors mean on weather radar?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The colours show reflectivity in dBZ, which rises with the size and number of drops. On the classic scale, blue marks very light precipitation or non-weather echoes and green marks light rain. Yellow, then orange and red, show rain getting heavier up to thunderstorm downpours, and pink, purple and white at the top usually mean hail. Colour tables differ between apps, so read the key."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you read weather radar?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Find where the radar is, check the time of the image, and read the key to see whether it shows reflectivity, rain rate, precipitation type or velocity. Then look at where the echoes are, how strong they are and what shape they make, and play the loop to see which way they move. Check official warnings before acting on what you see."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How does weather radar work?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A weather radar sends short pulses of microwaves from a turning dish and listens for echoes from raindrops, snowflakes and hail. The echo's delay gives the distance, and its strength, the reflectivity, shows how heavy the precipitation is. The dish scans at several tilts every few minutes, and a Doppler radar also measures how fast targets move towards or away from it."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a weather radar display in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Store each radar sweep as a grid with one column per beam and one row per range gate, and draw it as a heatmap in polar coordinates, with the angle running clockwise from north. With SciChart.js, use a PolarUniformHeatmapRenderableSeries on a SciChartPolarSurface with a stepped HeatmapColorMap for the dBZ colours, and update the grid with setZValues() as new beams arrive. The chart code is the same in React, with scichart-react, and in Angular, with scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# How to Read Weather Radar

## What is a weather radar?

A **weather radar** is a radar that sends pulses of microwaves into the sky and listens for the echoes that raindrops, snowflakes and hail send back. From the time each echo takes and how strong it is, it maps where precipitation is falling and how heavy it is. A Doppler weather radar also measures how fast the precipitation moves towards or away from it.

![A simulated weather radar image in a dark navy theme: a circular plot with compass bearings round the edge and distance rings every 25 km. A long north-south band of thunderstorms to the west shades from green through yellow to red; an isolated storm to the south-west has a red core with a small pink centre; scattered green and blue showers dot the rest of the circle, and a colour key from cyan (5 dBZ) to white (75 dBZ) sits on the right](/img/learn/weather-radar-og.png)

*A simulated base reflectivity image from the radar's lowest tilt: a squall line of thunderstorms to the west, an isolated storm with a hail core (pink) to the south-west, scattered showers, and ground clutter close to the radar. Synthetic data. [Try the interactive version](#how-to-build-a-weather-radar-display-in-javascript-react-or-angular).*

:::tip Key takeaways
- Radar colours show reflectivity in dBZ, a logarithmic measure of how much energy comes back. Higher values usually mean heavier precipitation.
- On the classic scale, the colours run from green for light rain, through yellow, to orange and red for downpours and thunderstorms. Pink, purple and white at the top usually mean hail.
- In winter, many apps colour precipitation by type instead, and pink there means a mix of rain, snow, sleet or freezing rain.
- On a velocity image, green is motion towards the radar and red is motion away. A tight green and red pair marks rotation.
- Not every echo is weather. Clutter, birds, insects and a melting layer can all show up in rain colours.
:::

National weather services run networks of these radars. In the United States, the NEXRAD network has 160 S-band Doppler radars, the WSR-88D. The images in weather apps and on TV are mostly made from their data, often merged into one map.

## How does weather radar work?

A weather radar works like an echo sounder for the sky. Its dish sends out a short pulse, listens for the echo, then sends the next one.

The same idea finds aircraft and ships: for how a radar screen shows range, bearing, targets and tracks, see [how to read a radar display](/learn/applications/radar-display/).

- Pulses. Each pulse of a WSR-88D lasts about 1.57 microseconds and is repeated around 1,300 times a second. In a whole hour it transmits for only about 7 seconds, and listens the rest of the time.
- Range. The pulse travels at the speed of light, so the time an echo takes to come back gives the distance to the precipitation. The radar splits each beam into short steps of distance called **range gates**, and records one value per gate.
- Reflectivity. The strength of the echo depends mostly on the size of the drops: a drop twice as wide reflects 64 times as much, because reflectivity goes with the sixth power of the diameter. So a few big drops outweigh many small ones. The radar reports reflectivity, Z, on a logarithmic scale in **dBZ** (decibels of Z): dBZ = 10 × log₁₀ Z, with Z in mm⁶/m³. Every 10 dBZ is ten times more reflected power. The scale runs from about −35 dBZ, in clear air, to about +85 dBZ.
- Volume scan. The dish turns a full circle at its lowest tilt, 0.5° above the horizon, then tilts up and turns again, up to 19.5°. In storms, a full set of 14 or 15 tilts, a **volume scan**, takes about 4½ to 6 minutes. In clear air the radar uses fewer tilts, and some clear-air patterns turn more slowly, taking up to about 10 minutes.
- Doppler. Echoes from moving targets come back slightly shifted in phase, and the shift gives the speed along the beam. That gives the velocity images described below.
- Dual polarisation. Since 2012, the US radars have sent pulses polarised both horizontally and vertically. Comparing the two tells the radar about the shape and variety of the targets, which helps separate rain, snow, hail and non-weather echoes.

### Why the beam gets higher with distance

The beam goes out in a nearly straight line while the Earth curves away beneath it, so the farther away the precipitation, the higher the part of it the beam sees. The table uses the standard model for this (an Earth radius of 4/3 its real value, to allow for the normal bending of the beam in the atmosphere), for the lowest 0.5° tilt.

| Distance from the radar | Height of the beam centre above the radar |
|---|---|
| 50 km (31 mi) | 0.6 km (1,900 ft) |
| 100 km (62 mi) | 1.5 km (4,800 ft) |
| 150 km (93 mi) | 2.6 km (8,600 ft) |
| 200 km (124 mi) | 4.1 km (13,400 ft) |

Far from the radar, the beam can pass over low rain and shallow snow altogether. The beam also widens with distance, so distant storms look weaker and coarser. A US radar sees most precipitation within about 150 km (80 nautical miles), and only intense storms out towards the edge of its 460 km (248 nautical mile) long-range image.

## What do the colours on weather radar mean?

Radar colours show reflectivity, one colour for each 5 dBZ step. The table uses the classic US National Weather Service scale, which many apps follow loosely. The rain rates come from the Marshall–Palmer relationship (Z = 200R^1.6, for widespread rain) and hold only if the echo is all rain.

| Colour | Reflectivity | Rain rate, if it's all rain | What it usually means |
|---|---|---|---|
| Light blue, blue | 5 to 19 dBZ | Under 0.6 mm (0.02 in) an hour | Very light precipitation that may not reach the ground, light snow, or non-weather echoes such as insects, birds and ground clutter |
| Green | 20 to 34 dBZ | 0.6 to 5.6 mm (0.02 to 0.2 in) an hour | Light to moderate rain. Light rain typically begins at about 20 dBZ |
| Yellow | 35 to 44 dBZ | 5.6 to 24 mm (0.2 to 0.9 in) an hour | Moderate to heavy rain |
| Orange, red | 45 to 54 dBZ | 24 to 100 mm (0.9 to 3.9 in) an hour | Heavy rain, usually from thunderstorms. Small hail is possible at the top of this range |
| Dark red | 55 to 64 dBZ | The formula gives 100 to 420 mm an hour, more than real rain usually reaches | Very heavy rain, often with hail mixed in |
| Pink (magenta), purple | 65 to 74 dBZ | Not meaningful | Hail is very likely, with extremely heavy rain |
| White | 75 dBZ and above | Not meaningful | Almost certainly hail. Very high values make large hail more likely, but reflectivity alone can't tell its size |

Hail stands out because a hailstone, often coated in melt water, is much bigger than a raindrop and so returns far more energy. Rain-rate estimates stop being reliable at these values, so the US radars ignore reflectivity above a threshold, 53 dBZ by default, when they estimate rainfall.

Colour tables differ between apps, TV stations and countries. Some start at 15 or 20 dBZ, some use smooth gradients instead of steps, and some show rain rate in millimetres or inches an hour instead of dBZ. Always read the key on the image you're looking at.

### What does green mean on weather radar?

Green means light to moderate rain, about 20 to 34 dBZ. Dark green, near 30 to 34 dBZ, is steady rain of a few millimetres an hour. On a winter precipitation-type display, green still means rain.

### What does yellow mean on weather radar?

Yellow means moderate to heavy rain, about 35 to 44 dBZ, roughly 6 to 24 mm (0.2 to 0.9 in) an hour. Yellow inside a band of green often marks the stronger cells in a line of showers or the edge of a thunderstorm core.

### What does red mean on weather radar?

Red means very heavy rain, about 50 to 64 dBZ from bright red to dark red, usually in a thunderstorm. Rain this heavy can cause flash flooding, and the darker reds often have hail mixed in.

### What does pink or purple mean on weather radar?

Pink or purple means one of two things, depending on the display. On a reflectivity scale, pink (magenta) and purple sit at the top, about 65 to 74 dBZ, and almost always mean hail in a strong thunderstorm. On a winter precipitation-type display, pink means mixed precipitation, as the next section explains. The key on the image tells you which one you're looking at.

### What does white mean on weather radar?

On a reflectivity scale, white is the top step, 75 dBZ and above: almost certainly hail in a severe thunderstorm. On some winter displays, white or light blue shows snow instead, so check the key.

### What does blue mean on weather radar?

On a reflectivity scale, blue is the weakest echo, below about 20 dBZ: drizzle, very light snow, rain that evaporates before it lands, or non-weather echoes. On a winter precipitation-type display, blue means snow.

## Pink and purple in winter: the precipitation-type display

In winter, many weather apps and TV stations switch to a display that colours precipitation by type as well as strength: typically greens and yellows for rain, blues for snow, and pinks or purples for a mix. The mix covers sleet, freezing rain, and rain and snow falling together.

The radar doesn't measure this colouring directly. It comes from an algorithm that combines the radar's reflectivity with temperature data, forecasts or the radar's dual-polarisation products. Dual polarisation helps because a mix of melting and frozen particles looks less uniform to the radar than all rain or all snow. Each provider uses its own method and colours, so the boundaries between rain, mix and snow are estimates.

The two pinks are easy to tell apart. Winter mixed precipitation is usually light to moderate and falls in broad bands, often between an area of rain and an area of snow. Hail pink appears as small, intense spots in the red cores of thunderstorms, mostly in spring and summer.

## How to read a weather radar image, step by step

1. Find the radar, or check whether the image is a mosaic of many radars. Distances, beam heights and velocity colours all depend on where the radar is.
2. Read the time. A radar image shows the recent past: a new image comes every few minutes, and apps add a delay for processing.
3. Read the key. Check whether it shows reflectivity (dBZ), rain rate, precipitation type or velocity.
4. Check the product. **Base reflectivity** is the lowest tilt and shows what's nearest the ground. **Composite reflectivity** shows the strongest echo at any tilt above each point, so it can show hail that hasn't fallen yet, and it makes rain look more widespread than it is at the ground.
5. Play the loop. A few frames show which way the storms move, how fast, and whether they're growing or weakening.
6. Look at the shapes as well as the colours. A long, narrow line of red cells is a squall line; a single cell with a pink core is a strong thunderstorm; a smooth ring around the radar may be a bright band rather than heavier rain.
7. Check the official warnings. A radar image tells you where precipitation is; your national weather service tells you what it means for you.

To describe a radar image, give the product, the time, where the echoes are and how strong they are: "Base reflectivity at 14:05 shows a north-south line of thunderstorms 60 to 100 km west of the radar, moving east at about 45 km/h, with cores up to 60 dBZ, and an isolated storm 50 km to the south-west with a 70 dBZ hail core."

## Velocity: reading wind on Doppler radar

A velocity image shows how fast precipitation moves towards or away from the radar, along the beam. By convention, green is towards the radar (negative values) and red is away from it (positive values). Brighter shades are faster.

- The radar measures only motion along the beam, so the measured speed is never more than the true speed.
- Where the wind blows straight across the beam, the velocity is zero. That boundary between green and red is called the **zero isodop**.
- A wide area of green on one side of the radar and red on the other shows the general wind, which blows from the green side towards the red side.
- A **rotation couplet** is a small area of strong green right next to strong red, side by side across the beam. It means air spinning round a point between them, such as the mesocyclone of a supercell thunderstorm. A very tight, very strong couplet is called a **tornado vortex signature**. It shows the rotation, not the tornado itself.

On dual-polarisation radars, a tornado that lifts debris can also show as a patch of low correlation coefficient (the debris is a jumble of shapes and sizes) in the same place as a strong couplet. That confirms a tornado but doesn't forecast one.

## What isn't weather: common radar artefacts

Anything that reflects microwaves can appear on radar. These are the echoes most often mistaken for precipitation.

| Artefact | What it looks like | Why it happens |
|---|---|---|
| Ground clutter | Speckled, fixed echoes close to the radar, usually within about 37 km (20 nautical miles) | The edges of the beam hit buildings, trees and hills. Clutter doesn't move, which is how processing removes most of it |
| Anomalous propagation | Patchy echoes that appear in clear weather, typically on calm, clear nights | Very stable air, such as a temperature inversion, bends the beam down into the ground. It shows mostly on the lowest tilt |
| Beam blockage | A wedge behind mountains or buildings where echoes are weaker or missing | Something near the radar blocks part of the beam |
| Cone of silence | A gap in the data right above the radar | The radar can't tilt higher than 19.5°, so it can't see straight up |
| Bright band | A ring of stronger echoes around the radar in steady rain | Snowflakes melting into rain are coated in water, so they reflect like large raindrops |
| Birds and insects | A circle of light echo around the radar at night, or expanding rings at sunrise | Migrating birds and insects reflect the beam. The rings at sunrise are flocks leaving their roosts |

## Weather radar vs satellite

Radar and satellite images answer different questions, and forecasters use both.

| | Weather radar | Weather satellite |
|---|---|---|
| What it sees | Precipitation: rain, snow, hail, and the wind that moves it | Clouds and water vapour, from above |
| Viewpoint | From the ground, out to a few hundred kilometres | From orbit, over whole continents and oceans |
| Best for | Where it's raining now, how heavily, and the structure of storms | Cloud cover, large weather systems, storms over the sea |
| Blind spots | Oceans, the far side of mountains, and low down far from the radar | Whether a cloud is producing rain at the ground |

## Common mistakes when reading weather radar

- **Reading every colour as rain.** Clutter, birds, insects, a bright band or anomalous propagation can all appear in rain colours. Fixed, speckled or ring-shaped echoes near the radar usually aren't weather.
- **Mixing up the two pinks.** Pink on a reflectivity scale means hail; pink on a winter display means mixed precipitation.
- **Assuming no echo means no rain.** Far from the radar, the beam passes over low rain and shallow snow, and mountains can block it.
- **Assuming rain on the radar is reaching the ground.** Light echoes, especially blue ones, can be virga: rain that evaporates before it lands.
- **Treating the image as live.** Each image is a few minutes old by the time you see it, and a fast storm moves several kilometres in that time.
- **Reading velocity as the full wind.** A zero can mean wind blowing across the beam, not calm air.
- **Using radar instead of warnings.** A radar app shows where precipitation is; it doesn't issue warnings. For tornadoes, flooding and severe storms, follow your national weather service.

## How to build a weather radar display in JavaScript, React or Angular

A radar image is a heatmap drawn in polar coordinates: azimuth (the compass bearing) round the circle, range outwards, and one coloured cell for each range gate. SciChart.js draws it with a polar uniform heatmap on the GPU, so a full image redraws smoothly while the sweep updates it.

The demo simulates a Doppler radar's lowest scan, 360 beams of 300 range gates out to 150 km, over synthetic weather: a squall line, an isolated hail-producing storm with a rotating updraft, scattered showers and ground clutter. A seeded random generator makes it the same on every load, and it loads no real radar data. Hover over the image to read the value at that point, what it usually means, and how high the beam is there. Switch between **Reflectivity** and **Velocity** to see the same storms as wind, and untick **Sweep** to stop the antenna. Zoom into the isolated storm with the mouse wheel to see its hail core and, in velocity, its green and red rotation couplet. Drag to pan, and double-click to zoom back out.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="weather radar display" demo="polar-uniform-heatmap-chart" demoLabel="polar heatmap chart" docs="/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/" docsLabel="SciChart.js polar heatmap documentation" />

Here is the code for this radar display. The synthetic weather, the readout, the colour key and the controls are plain JavaScript; SciChart.js draws the polar axes, the reflectivity and velocity images and the sweep line.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarLabelMode,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier
    } from "scichart";

    // The classic reflectivity colour scale: one colour per 5 dBZ step, from 5 dBZ (cyan) to 75 dBZ and above (white)
    const DBZ_COLORS = [
        "#04E9E7", "#019FF4", "#0300F4", "#02FD02", "#01C501", "#008E00", "#FDF802", "#E5BC00",
        "#FD9500", "#FD0000", "#D40000", "#BC0000", "#F800FD", "#9854C6", "#FDFDFD"
    ];
    const DBZ_MIN = 5;
    const DBZ_MAX = 80;

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // One sweep: dbz[gate][beam], NaN where there is no echo; azimuthStep in degrees, gateKm in km
        const sweep: { azimuthStep: number; gateKm: number; dbz: number[][] } = await getYourRadarSweep();
        const maxRangeKm = sweep.dbz.length * sweep.gateKm;

        // Azimuth: north at the top, clockwise like a compass
        sciChartSurface.xAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(0, 360),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                flippedCoordinates: true,
                autoTicks: false,
                majorDelta: 30,
                labelPrecision: 0,
                labelPostfix: "°",
                polarLabelMode: EPolarLabelMode.Horizontal
            })
        );
        // Range: distance from the radar
        sciChartSurface.yAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, maxRangeKm),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                labelPrecision: 0,
                labelPostfix: " km"
            })
        );

        // Two stops of the same colour per band, so each 5 dBZ band is one solid colour
        const span = DBZ_MAX - DBZ_MIN;
        const colorMap = new HeatmapColorMap({
            minimum: DBZ_MIN,
            maximum: DBZ_MAX,
            gradientStops: DBZ_COLORS.flatMap((color, i) => [
                { offset: (i * 5) / span, color },
                { offset: i < DBZ_COLORS.length - 1 ? ((i + 1) * 5) / span - 0.0005 : 1, color }
            ])
        });
        const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
            xStart: 0,
            xStep: sweep.azimuthStep,
            yStart: 0,
            yStep: sweep.gateKm,
            zValues: sweep.dbz
        });
        dataSeries.hasNaNs = true; // NaN cells (no echo) are not drawn
        sciChartSurface.renderableSeries.add(
            new PolarUniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap, fillValuesOutOfRange: true })
        );
        sciChartSurface.chartModifiers.add(
            new PolarMouseWheelZoomModifier(),
            new PolarPanModifier(),
            new PolarZoomExtentsModifier()
        );

        // Redraw with each new sweep from your radar feed
        const unsubscribe = subscribeToYourRadarSweeps((dbz: number[][]) => dataSeries.setZValues(dbz));
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it and cleans it up
    export const WeatherRadar = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarLabelMode,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier
    } from "scichart";

    // The classic reflectivity colour scale: one colour per 5 dBZ step, from 5 dBZ (cyan) to 75 dBZ and above (white)
    const DBZ_COLORS = [
        "#04E9E7", "#019FF4", "#0300F4", "#02FD02", "#01C501", "#008E00", "#FDF802", "#E5BC00",
        "#FD9500", "#FD0000", "#D40000", "#BC0000", "#F800FD", "#9854C6", "#FDFDFD"
    ];
    const DBZ_MIN = 5;
    const DBZ_MAX = 80;

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // One sweep: dbz[gate][beam], NaN where there is no echo; azimuthStep in degrees, gateKm in km
        const sweep: { azimuthStep: number; gateKm: number; dbz: number[][] } = await getYourRadarSweep();
        const maxRangeKm = sweep.dbz.length * sweep.gateKm;

        // Azimuth: north at the top, clockwise like a compass
        sciChartSurface.xAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(0, 360),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                flippedCoordinates: true,
                autoTicks: false,
                majorDelta: 30,
                labelPrecision: 0,
                labelPostfix: "°",
                polarLabelMode: EPolarLabelMode.Horizontal
            })
        );
        // Range: distance from the radar
        sciChartSurface.yAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, maxRangeKm),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                labelPrecision: 0,
                labelPostfix: " km"
            })
        );

        // Two stops of the same colour per band, so each 5 dBZ band is one solid colour
        const span = DBZ_MAX - DBZ_MIN;
        const colorMap = new HeatmapColorMap({
            minimum: DBZ_MIN,
            maximum: DBZ_MAX,
            gradientStops: DBZ_COLORS.flatMap((color, i) => [
                { offset: (i * 5) / span, color },
                { offset: i < DBZ_COLORS.length - 1 ? ((i + 1) * 5) / span - 0.0005 : 1, color }
            ])
        });
        const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
            xStart: 0,
            xStep: sweep.azimuthStep,
            yStart: 0,
            yStep: sweep.gateKm,
            zValues: sweep.dbz
        });
        dataSeries.hasNaNs = true; // NaN cells (no echo) are not drawn
        sciChartSurface.renderableSeries.add(
            new PolarUniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap, fillValuesOutOfRange: true })
        );
        sciChartSurface.chartModifiers.add(
            new PolarMouseWheelZoomModifier(),
            new PolarPanModifier(),
            new PolarZoomExtentsModifier()
        );

        // Redraw with each new sweep from your radar feed
        const unsubscribe = subscribeToYourRadarSweeps((dbz: number[][]) => dataSeries.setZValues(dbz));
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-weather-radar",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class WeatherRadarComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The image is a `PolarUniformHeatmapRenderableSeries` on a `SciChartPolarSurface`. Its `UniformHeatmapDataSeries` has one column per beam (`xStep` in degrees) and one row per range gate (`yStep` in km). With `hasNaNs` set, NaN cells draw nothing, so empty sky stays clear.
- The angular axis starts at the top (`startAngle: Math.PI / 2`) and runs clockwise (`flippedCoordinates: true`), so 0° is north and 90° is east, as on a radar.
- The stepped colour scale is a `HeatmapColorMap` with two gradient stops of the same colour for each 5 dBZ band, so each band is one solid colour. Velocity is a second heatmap series with a green-grey-red colour map, and the toggle switches `isVisible`.
- As the beam passes, the code rewrites those columns and calls `setZValues()`. The readout is a custom chart modifier that turns the mouse position into azimuth and range with the polar axes' own transforms.

**See it in the demo app:** [JavaScript polar heatmap chart](https://www.scichart.com/demo/javascript/polar-uniform-heatmap-chart) · [React polar heatmap chart](https://www.scichart.com/demo/react/polar-uniform-heatmap-chart) · [Angular polar heatmap chart](https://www.scichart.com/demo/angular/polar-uniform-heatmap-chart). Related technique: the [React polar ultrasound heatmap](https://www.scichart.com/demo/react/polar-ultrasound-heatmap).

**Go deeper:** [SciChart.js polar heatmap documentation](/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/), and the learning center guides to the [heatmap](/learn/chart-types/cartesian/heatmap/), the [spectrogram](/learn/chart-types/cartesian/spectrogram/), the [antenna radiation pattern](/learn/applications/antenna-radiation-pattern/) and [non-destructive testing](/learn/applications/non-destructive-testing/), whose ultrasonic sector scans are drawn the same way.

## Frequently asked questions

### What does pink mean on weather radar?

On a reflectivity scale, pink (magenta) means about 65 to 74 dBZ, near the top of the scale, and almost always means hail in a strong thunderstorm. On a winter precipitation-type display, pink means mixed precipitation: sleet, freezing rain, or rain and snow together. The key on the image shows which one it is.

### What does yellow mean on weather radar?

Yellow means moderate to heavy rain, about 35 to 44 dBZ on the classic scale. If it's all rain, that's roughly 6 to 24 mm (0.2 to 0.9 in) an hour. Yellow inside a band of green usually marks the stronger cells in a line of showers or thunderstorms.

### What do the colors mean on weather radar?

The colours show reflectivity in dBZ, which rises with the size and number of drops. On the classic scale, blue marks very light precipitation or non-weather echoes and green marks light rain. Yellow, then orange and red, show rain getting heavier up to thunderstorm downpours, and pink, purple and white at the top usually mean hail. Colour tables differ between apps, so read the key.

### How do you read weather radar?

Find where the radar is, check the time of the image, and read the key to see whether it shows reflectivity, rain rate, precipitation type or velocity. Then look at where the echoes are, how strong they are and what shape they make, and play the loop to see which way they move. Check official warnings before acting on what you see.

### How does weather radar work?

A weather radar sends short pulses of microwaves from a turning dish and listens for echoes from raindrops, snowflakes and hail. The echo's delay gives the distance, and its strength, the reflectivity, shows how heavy the precipitation is. The dish scans at several tilts every few minutes, and a Doppler radar also measures how fast targets move towards or away from it.

### How do I make a weather radar display in JavaScript?

Store each radar sweep as a grid with one column per beam and one row per range gate, and draw it as a heatmap in polar coordinates, with the angle running clockwise from north. With SciChart.js, use a `PolarUniformHeatmapRenderableSeries` on a `SciChartPolarSurface` with a stepped `HeatmapColorMap` for the dBZ colours, and update the grid with `setZValues()` as new beams arrive. The chart code is the same in React, with `scichart-react`, and in Angular, with `scichart-angular`.

## Sources

- NOAA JetStream, [Radar Images: Reflectivity](https://www.noaa.gov/jetstream/reflectivity) and [Radar Images: Velocity](https://www.noaa.gov/jetstream/velocity). dBZ and its range, the reflectivity guidelines (above 65 dBZ, extremely heavy precipitation including water-coated hail), approximate rain rates, base and composite reflectivity, the green-towards and red-away convention, the zero isodop and the tornado vortex signature.
- NOAA JetStream, [How Radar Works](https://www.noaa.gov/jetstream/doppler/how-radar-works) and [Dual Polarization](https://www.noaa.gov/jetstream/dual-polarization); NOAA National Centers for Environmental Information, [Next Generation Weather Radar (NEXRAD)](https://www.ncei.noaa.gov/products/radar/next-generation-weather-radar). Pulses and listening time, tilts and volume scan times, the 160-radar network, the 2012 dual-polarisation upgrade, and the tornado debris signature.
- National Weather Service Northern Indiana, [About our WSR-88D Radar](https://www.weather.gov/iwx/wsr_88d); National Weather Service Milwaukee/Sullivan, [Using and Understanding Doppler Radar](https://www.weather.gov/mkx/using-radar); National Weather Service Jackson, MS, [Dual-Pol Applications](https://www.weather.gov/jan/dualpolupgrade-applications). Range limits, the cone of silence, ground clutter, anomalous propagation, birds and insects, roost rings and bright banding.
- National Weather Service Morristown, [Radar Rainfall Estimates](https://www.weather.gov/mrx/radarrainfallestimates), and National Weather Service Training Center, [Z-R relationships](https://training.weather.gov/nwstc/NEXRAD/RADAR/3-1a.htm). The 53 dBZ hail threshold for rainfall estimates, Z = 300R^1.4 as the WSR-88D default, and Z = 200R^1.6 for widespread (stratiform) rain.
- Marshall, J. S. and Palmer, W. McK. (1948), [The distribution of raindrops with size](https://doi.org/10.1175/1520-0469(1948)005%3C0165:TDORWS%3E2.0.CO;2), *Journal of Meteorology* 5(4), 165–166. The raindrop size distribution behind the Marshall–Palmer relationship.

<LearnCta position="bottom" chart="weather radar display" demo="polar-uniform-heatmap-chart" demoLabel="polar heatmap chart" docs="/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/" docsLabel="SciChart.js polar heatmap documentation" />
