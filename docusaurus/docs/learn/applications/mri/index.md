---
sidebar_position: 150
sidebar_label: MRI
title: "How to Read an MRI Scan: Planes, T1 vs T2 and Contrast (Interactive)"
description: "How to read an MRI scan: axial, sagittal and coronal planes, T1 vs T2 vs FLAIR, gadolinium contrast, window and level, and artefacts, with an interactive brain MRI viewer."
keywords:
    [
        "how to read an mri",
        "how to read a brain mri",
        "t1 vs t2 mri",
        "t1 weighted vs t2 weighted",
        "flair mri",
        "axial sagittal coronal",
        "mri planes",
        "brain mri",
        "mri contrast",
        "gadolinium contrast",
        "mri window level",
        "mri artifacts",
        "mri vs ct",
        "dicom",
        "nifti"
    ]
image: /img/learn/mri-og.png
related: [ultrasound, ecg, capnography-pulse-oximetry, heatmap]
datePublished: 2026-11-27
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How do you read an MRI scan?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Find the plane and the orientation markers first: in axial and coronal views the patient's right is on the viewer's left. Then work out the sequence from the fluid in the ventricles, which is dark on T1 and bright on T2. Scroll through every slice, compare left with right, and check the same spot in the other planes. Only a radiologist interprets a scan for diagnosis, so read the radiologist's report with your doctor." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between T1 and T2 MRI?",
                    "acceptedAnswer": { "@type": "Answer", "text": "T1-weighted and T2-weighted images are two settings of the same scanner that make different tissues bright. On T1, fat is bright and water is dark, and white matter is brighter than grey matter, so it is good for anatomy and for gadolinium contrast. On T2, water and fluid are bright, so it shows oedema, cysts and most changes that add water to tissue." }
                },
                {
                    "@type": "Question",
                    "name": "How can you tell if an MRI image is T1 or T2?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Look at the cerebrospinal fluid in the ventricles in the middle of the brain. Dark fluid with white matter brighter than grey matter means T1. Bright fluid with grey matter brighter than white matter means T2. Dark fluid with grey matter brighter than white matter usually means FLAIR, a T2-weighted sequence that cancels the fluid signal. The series name in the viewer, such as AX T2 FLAIR, also says." }
                },
                {
                    "@type": "Question",
                    "name": "What do axial, sagittal and coronal mean on an MRI?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They are the three planes a scan is sliced in. Axial slices are horizontal and separate the top of the body from the bottom. Sagittal slices are vertical and separate left from right, giving a side view. Coronal slices are vertical and separate front from back, giving a face-on view." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between MRI and CT?",
                    "acceptedAnswer": { "@type": "Answer", "text": "CT uses X-rays, which are ionising radiation, and takes seconds to a few minutes; it is the usual first test in emergencies because it shows bleeding, fractures and bone quickly. MRI uses a magnetic field and radio waves with no ionising radiation, takes longer and is noisier, and shows soft tissue such as the brain and spinal cord in more detail. Some implants rule out MRI but not CT." }
                },
                {
                    "@type": "Question",
                    "name": "How do I display MRI slices in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Load the volume as an array of voxel intensities, copy one slice into a 2D array of rows, and draw it as a heatmap with a greyscale colour map whose minimum and maximum set the window and level. Keep the millimetres per pixel equal on both axes so the image isn't stretched. SciChart.js does this with UniformHeatmapRenderableSeries and HeatmapColorMap, and can add overlays, annotations and linked views." }
                }
            ]
        })}
    </script>
</head>

# How to Read an MRI Scan

## What is an MRI scan?

An **MRI scan** (magnetic resonance imaging) is a medical image made with a strong magnetic field and radio waves instead of X-rays. The scanner measures signals from hydrogen nuclei in water and fat, and builds a stack of thin slices through the body that can be viewed in three planes: axial, sagittal and coronal.

![Three views of the same brain MRI side by side on a dark navy background: an axial slice, a coronal slice and a sagittal slice in greyscale, with coloured dashed crosshairs showing where the planes meet, orientation letters at the edges and labels for the lateral ventricle, white matter, cortex, thalamus, corpus callosum, pons and cerebellum](/img/learn/mri-og.png)

*Axial, coronal and sagittal slices of a T1-weighted brain MRI template, with linked crosshairs and labels. [Try the interactive version](#how-to-build-an-mri-viewer-in-javascript-react-or-angular).*

This guide explains how MRI images are made and how to find your way around them. It is for learning only and isn't medical advice. Only a radiologist, a doctor trained to interpret medical images, can read a scan for diagnosis; their report, discussed with your own doctor, is what counts.

:::tip Key takeaways
- An MRI is a stack of slices. Each slice is a grid of voxels, small boxes of tissue, and the same volume can be shown in axial, coronal and sagittal planes.
- In axial and coronal views the patient's right is on the viewer's left. Check the orientation letters before deciding which side anything is on.
- T1 makes fat bright and fluid dark; T2 makes fluid bright. Look at the fluid in the ventricles to tell them apart, and use FLAIR to see bright tissue water next to dark fluid.
- MRI brightness has no fixed units, so judge tissues against each other on the same image, and adjust window and level instead of trusting brightness alone.
- Artefacts from movement, metal or a too-small field of view can look like disease. Read the radiologist's report.
:::

## How does MRI make an image?

An MRI scanner works with the hydrogen nuclei, single protons, in the water and fat that make up most of the body. Each proton behaves like a tiny magnet. The scanner's main magnet, usually 1.5 or 3 tesla in hospitals and tens of thousands of times stronger than the Earth's magnetic field, lines a small surplus of them up along its field.

A scan then repeats four steps, hundreds of times:

1. Excitation. A short radio-frequency (RF) pulse tips the protons' combined magnetisation away from the field. The pulse has to match the protons' resonant frequency, about 42.6 MHz for every tesla of field, so about 64 MHz at 1.5 T and 128 MHz at 3 T.
2. Signal. As the tipped magnetisation spins around the field, it induces a small radio signal in receiver coils placed around the head.
3. Relaxation. The signal fades and the protons return to alignment. How fast depends on the tissue around them, and that difference is what makes tissues look different.
4. Spatial encoding. Gradient coils add small, controlled changes to the field across the body, so protons in different places give slightly different frequencies and phases. A Fourier transform turns the recorded signals into an image. Switching the gradients on and off makes the loud knocking during a scan.

Two time constants describe relaxation:

| | What it measures | Long in | Short in |
| --- | --- | --- | --- |
| **T1** (longitudinal relaxation) | How fast magnetisation recovers along the main field: T1 is the time to get back about 63% | Water and cerebrospinal fluid (CSF) | Fat |
| **T2** (transverse relaxation) | How fast the signal from the tipped magnetisation decays: T2 is the time for it to fall to about 37% | Water and CSF | Dense, ordered tissue such as tendon |

Two settings choose which one the image shows. The repetition time (TR) is the gap between excitations; the echo time (TE) is how long after excitation the signal is read. A short TR and short TE give a T1-weighted image. A long TR and long TE give a T2-weighted image. The tissue doesn't change between the two; only the timing does.

## Voxels, slices and the three planes

An MRI scan is a three-dimensional grid of numbers. Each number is the signal from one **voxel**, a small box of tissue, typically 1 mm or less across within a slice and from about 1 mm to several millimetres thick. A slice is one layer of voxels, and a series is the whole stack.

![A box standing for the head, cut by three coloured planes: the axial plane is horizontal, the coronal plane is vertical and faces you, and the sagittal plane is vertical and runs from front to back. Beside it, three small panels show the standard display of each view: axial with the patient's right on the left and the front at the top, coronal with right on the left and the top of the head at the top, and sagittal with the face to the left and the top of the head at the top](./mri-planes-orientation.svg)

| Plane | Cuts the body into | You see | Also called |
| --- | --- | --- | --- |
| Axial | Top and bottom | Horizontal slices, as if looking up from the feet | Transverse, transaxial |
| Coronal | Front and back | Face-on slices, as if facing the patient | Frontal |
| Sagittal | Left and right | Side-on slices; the midline one is the midsagittal slice | |

Each sequence is acquired in one plane, and a clinical exam usually includes sequences in two or three different planes. A 3D sequence with small, equal-sided voxels can be resliced into any plane afterwards with little loss; reslicing a stack of thick 2D slices gives blurred, blocky images in the other planes.

### How to orient yourself: the radiological convention

Medical images follow the **radiological convention**: the patient's right is on the viewer's left in axial and coronal views. An axial slice is shown as if you were standing at the patient's feet looking up, and a coronal slice as if you were facing the patient. Sagittal slices are usually shown with the face to the left.

Viewers print orientation letters at the edges of each view: R and L (right, left), A and P (anterior, posterior), S and I (superior, inferior), and sometimes H and F (head, foot). Read them first. Some research software displays brain images in the **neurological convention** instead, with the patient's left on the viewer's left, so the same image can appear mirrored between programs.

## T1 vs T2 vs FLAIR: what's bright and what's dark

Each MRI sequence makes different tissues bright, so a radiologist reads several sequences of the same area side by side. These are the three you'll meet first in a brain MRI.

| Tissue | T1-weighted | T2-weighted | FLAIR |
| --- | --- | --- | --- |
| Water and CSF (ventricles, the fluid around the brain) | Dark | Bright | Dark (the fluid signal is cancelled) |
| Fat (scalp, bone marrow, the eye socket) | Bright | Bright on most modern (fast spin-echo) T2 | Bright |
| White matter | Brighter than grey matter | Darker than grey matter | Darker than grey matter |
| Grey matter (cortex, deep nuclei) | Darker than white matter | Brighter than white matter | Brighter than white matter |
| Cortical bone and air | Dark | Dark | Dark |
| Tissue holding extra water (oedema, many lesions) | Darker, or no different | Bright | Bright, and easy to see next to dark CSF |

**FLAIR** (fluid-attenuated inversion recovery) is a T2-weighted sequence with an extra inversion pulse timed so that free fluid gives no signal. Tissue water stays bright while CSF goes dark, so changes next to the ventricles or the brain surface stand out.

Other sequences you may see listed:

- Proton density (PD): long TR and short TE, so the image mostly shows how many protons each tissue holds; common in joint imaging.
- Diffusion-weighted imaging (DWI): shows how freely water molecules move; tissue where movement is restricted looks bright.
- Susceptibility-weighted (SWI) and T2\* gradient-echo: sensitive to iron, blood products and calcium, which look dark.
- STIR: an inversion-recovery sequence that cancels fat.

### How to tell if an MRI image is T1 or T2

Look at the fluid first. In a brain MRI, find the lateral ventricles, the two fluid-filled spaces in the middle of the brain.

1. Dark fluid and white matter brighter than grey matter: T1.
2. Bright fluid and grey matter brighter than white matter: T2.
3. Dark fluid but grey matter brighter than white matter: FLAIR.

A memory aid some students use is "World War II": water is white on T2. The series name in the viewer (for example "SAG T1", "AX T2", "AX FLAIR") or the image information also says which sequence it is.

### A worked example with real numbers

The viewer on this page shows the T1 and T2 signal of every voxel under the mouse, so you can check the table above. These are typical readings in its template brain, on a 0 to 255 scale that has no physical units:

| Point in the brain | T1 signal | T2 signal |
| --- | --- | --- |
| CSF in a lateral ventricle | about 65 | about 255 |
| Vitreous fluid in the eye | about 75 | about 250 |
| Cortex (grey matter) | about 175 | about 170 |
| Thalamus (deep grey matter) | about 190 | about 145 |
| White matter | about 240 | about 125 |

On T1, white matter reads about a third brighter than the cortex (240 against 175) and CSF about a quarter of white matter's value. On T2 the order flips: white matter reads about a quarter darker than the cortex, and CSF is the brightest thing in the head. The ratios are what you read, not the numbers. A different scanner, coil or setting gives different numbers for the same tissue.

### Is T1 or T2 better?

Neither: they answer different questions, which is why a routine brain MRI includes both, usually with FLAIR and diffusion. T1 shows anatomy clearly and is the sequence used before and after a contrast injection. T2 and FLAIR show water, and most disease processes, such as inflammation, oedema and many tumours, change the amount of water in tissue.

Radiologists describe what they see by signal, not by colour: **hyperintense** (brighter than the reference tissue), **hypointense** (darker) and **isointense** (the same). "A T2 hyperintense lesion" means a spot that is brighter than its surroundings on T2. That description alone isn't a diagnosis; many different causes look alike on one sequence.

## Contrast agents: gadolinium

Some MRI exams include an injection of a contrast agent, usually a **gadolinium-based contrast agent** given into a vein. Gadolinium changes the magnetic behaviour of the water molecules around it and shortens their T1, so tissue that takes it up looks brighter on a T1-weighted image.

In the brain, the blood–brain barrier normally keeps the agent inside the blood vessels. Where the barrier is damaged, as in some tumours and areas of active inflammation, it leaks into the tissue, which then "enhances": it is brighter on the T1 image taken after the injection than on the one taken before. That is why contrast scans are read as a pair, pre-contrast and post-contrast T1.

Gadolinium agents are widely used and serious reactions are uncommon. Allergic-type reactions are rare. Nephrogenic systemic fibrosis, a thickening of the skin and organs, is a rare complication in people with severe kidney disease, so the agent may be withheld in some of them. Traces of gadolinium can stay in the body, including the brain, after an exam; no harmful effects from these traces have been shown, and radiologists take retention into account when choosing an agent. The decision to use contrast belongs to the radiology team.

## Window and level: contrast and brightness

A scanner records more shades than a screen shows. The **window** (width) and **level** (centre) choose which part of the signal range fills the screen's black-to-white scale:

- Everything below level − window ÷ 2 is shown black.
- Everything above level + window ÷ 2 is shown white.
- Values in between are spread over the grey scale.

A narrow window gives high contrast, which helps separate grey matter from white matter; a wide window shows everything with less contrast. With a window of 120 and a level of 170, signal values from 110 to 230 fill the grey scale and the rest are clipped. In most viewers you drag the mouse with a button held to change them.

MRI and CT differ here. CT values are Hounsfield units, a fixed scale on which water is 0 and air is −1000, so radiologists use standard window presets such as "brain" or "bone". MRI signal has no absolute scale: the same tissue gives different numbers on different scanners, coils and settings, and even across one image. So MRI windows are set by eye for each series, and brightness is only meaningful when compared with other tissue in the same image.

## How to look at a brain MRI step by step

This is how to find your way around a brain MRI from a CD or an online portal. It helps you follow the radiologist's report; it doesn't replace it.

1. Check what you are looking at: the patient name, the date and the series list, such as "AX T2", "SAG T1", "AX FLAIR", "AX T1 +C" (after contrast).
2. Find the plane and the orientation. Use the letters at the edges. In axial and coronal views, the patient's right is on your left.
3. Work out the sequence. Look at the ventricles: dark fluid on T1 and FLAIR, bright on T2.
4. Scroll through the whole series, top to bottom or front to back. A single slice can't show a structure's shape; scrolling shows how it continues from slice to slice.
5. Use the other planes. Find the same spot in a second plane. Most viewers link the views with crosshairs.
6. Compare left with right. The brain is roughly symmetrical, so the ventricles, the deep grey nuclei and the folds on each side should look alike. A small difference is often normal: the head may be slightly tilted in the scanner.
7. Look at the landmarks. The midline should be straight; check the size of the ventricles, the boundary between grey and white matter, the corpus callosum, the brainstem and the cerebellum.
8. Adjust window and level, rather than judging a tissue from its brightness on the default setting.
9. Read the report and ask your doctor. Normal variants, partial-volume effects (one voxel holding two tissues) and artefacts all look like abnormalities to an untrained eye.

## Common MRI artefacts

An artefact is something in the image that isn't in the patient. These are the ones people most often mistake for disease.

| Artefact | What it looks like | Cause |
| --- | --- | --- |
| Motion | Blurring, or faint copies (ghosts) of the head or of pulsing vessels repeated across the image | The patient moving, breathing, swallowing; blood and CSF pulsing. Ghosts repeat along the phase-encoding direction |
| Susceptibility | A black hole with a bright, distorted rim; stretched or squashed anatomy | Metal (dental work, clips, implants) and air–bone boundaries such as the sinuses and ear canals distort the magnetic field. Worse on gradient-echo and diffusion images and at 3 T |
| Wrap-around (aliasing) | Part of the head, or the nose or shoulders, folded over onto the opposite side of the image | Anatomy outside the field of view, in the phase-encoding direction |
| Chemical shift | A thin bright or dark band at the edge between fat and water | Fat protons resonate at a slightly different frequency from water protons, so fat is shifted along one direction |
| Truncation (Gibbs ringing) | Fine parallel lines next to a sharp edge, such as in the spinal cord | Too few samples to describe a sharp change in signal |

Radiographers repeat or adjust a sequence when an artefact hides what needs to be seen, for example with a larger field of view to stop wrap-around.

## MRI vs CT

CT and MRI both make cross-sectional slices, but they measure different things.

| | MRI | CT |
| --- | --- | --- |
| How it works | Magnetic field and radio waves; signal from hydrogen in water and fat | X-rays passed through the body from many angles |
| Ionising radiation | None | Yes, a small dose |
| Scan time | Usually tens of minutes for a full exam | Seconds to a few minutes |
| Best for | Soft tissue: brain, spinal cord, nerves, joints, many tumours | Emergencies and trauma, bleeding, bone, the lungs |
| Image values | Signal in arbitrary units; brightness depends on the sequence | Hounsfield units: a fixed scale, water 0, air −1000 |
| Comfort | Loud, enclosed, sensitive to movement | Quick, open ring, less affected by movement |
| Implants and metal | Must be checked first; some devices rule MRI out or need special settings | An implant doesn't prevent a scan |

In practice, a suspected stroke or head injury usually gets a CT first because it is fast and shows bleeding; MRI follows to show the brain in detail. For how ultrasound compares with both, see the [ultrasound guide](/learn/applications/ultrasound/).

## MRI file formats: DICOM and NIfTI

- **DICOM** is the international standard for medical images and the information that goes with them (ISO 12052). Scanners, hospital archives and patient CDs use it. A series is usually many files, one per slice, each with a header that holds the patient's details, the scanner settings and the slice's position. Remove those details before sharing images.
- **NIfTI** (`.nii` or `.nii.gz`) is the format most neuroimaging research software uses. A `.nii` file holds the whole volume and a transform that maps voxel indices to positions in millimetres, which is how software knows which way is left. Research datasets are often defaced, with the face removed from the image, because a 3D head scan can be rendered as a recognisable face.

## Common mistakes when reading MRI images

- **Mixing up left and right.** In axial and coronal views the patient's right is on your left, and some software mirrors it. Read the orientation letters every time.
- **Judging a tissue by its brightness alone.** MRI numbers vary between scanners and settings. Compare against tissue in the same image, such as the fluid, white matter and grey matter.
- **Reading "bright" as "abnormal".** Fat, fluid and flowing blood are bright on some sequences in every healthy scan. A finding means something only on the right sequence, compared with the sequences around it.
- **Looking at one slice.** A round spot on one slice may be a vessel or a fold that runs on through the next slices. Scroll, and check other planes.
- **Leaving the window too wide or too narrow.** Too wide hides subtle differences in contrast; too narrow clips real tissue to black or white.
- **Mistaking an artefact for a lesion.** Check whether it repeats across the image, follows a metal object or a sinus, or appears on only one sequence.
- **Diagnosing from the images yourself.** Many conditions look alike, and normal anatomy varies. The radiologist's report, read with your doctor, is the answer.

## How to build an MRI viewer in JavaScript, React or Angular

Medical imaging viewers redraw large images instantly as the user scrolls through slices, changes contrast or moves a crosshair. SciChart.js draws each slice as a GPU-accelerated heatmap, so a viewer can stack an image and overlays, link several views and add annotations while staying responsive. This demo loads two real MRI volumes, a T1-weighted and a T2-weighted scan of the same head, and shows them as three linked views. The data is the MNI ICBM 152 2009a template, converted from NIfTI to a compact image format that loads in the browser. The template is an average of brain scans from 152 adults, so it shows no individual person; it is smoother than a single scan and has no artefacts.

**Click or drag** in any view to move the crosshair; the other two views jump to that point. **Scroll** over a view, or use the slider under it, to step through its slices. Switch between **T1-weighted** and **T2-weighted** to compare the same voxels, and drag **Window** and **Level** to change contrast and brightness. **Threshold overlay** colours every voxel whose signal falls between the two sliders, a simple form of segmentation. Drag either end of the **Ruler** on the axial view to measure in millimetres. Hover anywhere to read a voxel's position and its T1 and T2 signal.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="MRI viewer" demo="heatmap-chart" demoLabel="heatmap chart" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />

Here is the code for this viewer. Loading the volume is plain JavaScript; SciChart.js draws the slices, overlays, crosshairs and labels.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    // One axial slice of a volume, drawn as a greyscale heatmap with a window and level
    const initAxialSlice = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Your volume: voxel values, size [nx, ny, nz], voxel size in mm, and the slice to show
        const { voxels, size, voxelMm, slice } = getYourVolume();
        const [nx, ny] = size;
        const rows = Array.from({ length: ny }, (_, j) =>
            Float64Array.from({ length: nx }, (_, i) => voxels[i + j * nx + slice * nx * ny])
        );
        // Radiological convention: flip x so the patient's right is on the viewer's left
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                isVisible: false,
                flippedCoordinates: true,
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(0, nx * voxelMm)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { isVisible: false, autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, ny * voxelMm) })
        );
        const level = 128;
        const window = 255;
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: voxelMm, yStart: 0, yStep: voxelMm, zValues: rows }),
                colorMap: new HeatmapColorMap({
                    minimum: level - window / 2,
                    maximum: level + window / 2,
                    gradientStops: [
                        { offset: 0, color: "#000000" },
                        { offset: 1, color: "#FFFFFF" }
                    ]
                }),
                fillValuesOutOfRange: true,
                useLinearTextureFiltering: true
            })
        );
        return { sciChartSurface };
    };

    // Keep the container's width:height equal to the slice's (nx:ny) so the image isn't stretched
    export const MriSlice = () => <SciChartReact initChart={initAxialSlice} style={{ width: 400, height: 470 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    // One axial slice of a volume, drawn as a greyscale heatmap with a window and level
    const initAxialSlice = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Your volume: voxel values, size [nx, ny, nz], voxel size in mm, and the slice to show
        const { voxels, size, voxelMm, slice } = getYourVolume();
        const [nx, ny] = size;
        const rows = Array.from({ length: ny }, (_, j) =>
            Float64Array.from({ length: nx }, (_, i) => voxels[i + j * nx + slice * nx * ny])
        );
        // Radiological convention: flip x so the patient's right is on the viewer's left
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                isVisible: false,
                flippedCoordinates: true,
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(0, nx * voxelMm)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { isVisible: false, autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, ny * voxelMm) })
        );
        const level = 128;
        const window = 255;
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: voxelMm, yStart: 0, yStep: voxelMm, zValues: rows }),
                colorMap: new HeatmapColorMap({
                    minimum: level - window / 2,
                    maximum: level + window / 2,
                    gradientStops: [
                        { offset: 0, color: "#000000" },
                        { offset: 1, color: "#FFFFFF" }
                    ]
                }),
                fillValuesOutOfRange: true,
                useLinearTextureFiltering: true
            })
        );
        return { sciChartSurface };
    };

    @Component({
        selector: "app-mri-slice",
        standalone: true,
        imports: [ScichartAngularComponent],
        // Keep the container's width:height equal to the slice's (nx:ny) so the image isn't stretched
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 400px; height: 470px"></scichart-angular>`
    })
    export class MriSliceComponent {
        initChart = initAxialSlice;
    }
    ```
</CodeSnippetBlock>

Key points:

- Each view is a `UniformHeatmapRenderableSeries`: one `Float64Array` per row of voxels, with `xStep` and `yStep` set to the voxel size, so the axes are in millimetres. Slices are copied into the same arrays and sent with `setZValues` only when the slice, the sequence or the overlay changes.
- Window and level are the `minimum` and `maximum` of the `HeatmapColorMap` (level ± window ÷ 2) with `fillValuesOutOfRange`, so changing contrast recolours the image without touching the data.
- The overlay is a second heatmap on top, partly transparent, with NaN for voxels outside the threshold band, which aren't drawn.
- A custom chart modifier turns mouse positions into voxel indices for the crosshair, the scroll-through-slices behaviour and the readout. Crosshairs, labels and the editable ruler are `VerticalLineAnnotation`, `HorizontalLineAnnotation`, `TextAnnotation` and `LineAnnotation`. The x-axis is flipped (`flippedCoordinates`) for the radiological convention, and the axis ranges are refitted on layout so a millimetre is the same size across and down.

**See it in the demo app:** [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), [heatmap colour maps](/2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/), [annotations](/2d-charts/annotations-api/annotations-api-overview/) and [custom chart modifiers](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/). For what a heatmap is and how to read one, see the [heatmap guide](/learn/chart-types/cartesian/heatmap/). For how medical device makers and researchers use SciChart, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/).

## Frequently asked questions

### How do you read an MRI scan?

Find the plane and the orientation markers first: in axial and coronal views the patient's right is on the viewer's left. Then work out the sequence from the fluid in the ventricles, which is dark on T1 and bright on T2. Scroll through every slice, compare left with right, and check the same spot in the other planes. Only a radiologist interprets a scan for diagnosis, so read the radiologist's report with your doctor.

### What is the difference between T1 and T2 MRI?

T1-weighted and T2-weighted images are two settings of the same scanner that make different tissues bright. On T1, fat is bright and water is dark, and white matter is brighter than grey matter, so it is good for anatomy and for gadolinium contrast. On T2, water and fluid are bright, so it shows oedema, cysts and most changes that add water to tissue.

### How can you tell if an MRI image is T1 or T2?

Look at the cerebrospinal fluid in the ventricles in the middle of the brain. Dark fluid with white matter brighter than grey matter means T1. Bright fluid with grey matter brighter than white matter means T2. Dark fluid with grey matter brighter than white matter usually means FLAIR, a T2-weighted sequence that cancels the fluid signal. The series name in the viewer, such as AX T2 FLAIR, also says.

### What do axial, sagittal and coronal mean on an MRI?

They are the three planes a scan is sliced in. Axial slices are horizontal and separate the top of the body from the bottom. Sagittal slices are vertical and separate left from right, giving a side view. Coronal slices are vertical and separate front from back, giving a face-on view.

### What is the difference between MRI and CT?

CT uses X-rays, which are ionising radiation, and takes seconds to a few minutes; it is the usual first test in emergencies because it shows bleeding, fractures and bone quickly. MRI uses a magnetic field and radio waves with no ionising radiation, takes longer and is noisier, and shows soft tissue such as the brain and spinal cord in more detail. Some implants rule out MRI but not CT.

### How do I display MRI slices in JavaScript?

Load the volume as an array of voxel intensities, copy one slice into a 2D array of rows, and draw it as a heatmap with a greyscale colour map whose minimum and maximum set the window and level. Keep the millimetres per pixel equal on both axes so the image isn't stretched. SciChart.js does this with UniformHeatmapRenderableSeries and HeatmapColorMap, and can add overlays, annotations and linked views.

## Sources

- RadiologyInfo.org (RSNA and ACR), [Magnetic resonance imaging (MRI) – head](https://www.radiologyinfo.org/en/info/mri-brain) (reviewed 2026). How a brain MRI is made, no ionising radiation, implants, and the radiologist's report.
- RadiologyInfo.org (RSNA and ACR), [Contrast materials](https://www.radiologyinfo.org/en/info/safety-contrast) (reviewed 2024). How gadolinium works, allergic-type reactions, nephrogenic systemic fibrosis and retention.
- RadiologyInfo.org (RSNA and ACR), [Computed tomography (CT) – head](https://www.radiologyinfo.org/en/info/headct) (reviewed 2026). CT's speed, its use for bleeding in emergencies, and implants.
- National Institute of Biomedical Imaging and Bioengineering (NIH), [Magnetic resonance imaging (MRI)](https://www.nibib.nih.gov/science-education/science-topics/magnetic-resonance-imaging-mri). Protons, the RF pulse, relaxation and contrast agents.
- US Food and Drug Administration, [MRI (magnetic resonance imaging)](https://www.fda.gov/radiation-emitting-products/medical-imaging/mri-magnetic-resonance-imaging). Signal mainly from protons in fat and water.
- Plewes, D. B. and Kucharczyk, W. (2012), [Physics of MRI: a primer](https://doi.org/10.1002/jmri.23642). *Journal of Magnetic Resonance Imaging*, 35(5). Resonance, T1 and T2 relaxation, gradients, spatial encoding and image contrast.
- Bitar, R. et al. (2006), [MR pulse sequences: what every radiologist wants to know but is afraid to ask](https://doi.org/10.1148/rg.262055063). *RadioGraphics*, 26(2). TR, TE, T1 and T2 weighting, proton density, inversion recovery (FLAIR, STIR) and gradient-echo sequences.
- Zhuo, J. and Gullapalli, R. P. (2006), [MR artifacts, safety, and quality control](https://doi.org/10.1148/rg.261055134). *RadioGraphics*, 26(1). Motion, susceptibility, wrap-around, chemical shift and truncation artefacts.
- Gulani, V. et al. (2017), [Gadolinium deposition in the brain: summary of evidence and recommendations](https://doi.org/10.1016/S1474-4422(17)30158-8). *The Lancet Neurology*, 16(7).
- Nyúl, L. G. and Udupa, J. K. (1999), [On standardizing the MR image intensity scale](https://doi.org/10.1002/(SICI)1522-2594(199912)42:6%3C1072::AID-MRM11%3E3.0.CO;2-M). *Magnetic Resonance in Medicine*, 42(6). MRI intensities have no standard scale.
- NiBabel documentation, [Radiological vs neurological conventions](https://nipy.org/nibabel/neuro_radio_conventions.html). How the two display conventions differ.
- DICOM Standards Committee, [About DICOM](https://www.dicomstandard.org/about); NIfTI Data Format Working Group, [NIfTI-1 data format](https://nifti.nimh.nih.gov/nifti-1/).
- Fonov, V. et al. (2011), [Unbiased average age-appropriate atlases for pediatric studies](https://doi.org/10.1016/j.neuroimage.2010.07.033). *NeuroImage*, 54(1); and the [ICBM 152 nonlinear 2009 templates](https://www.bic.mni.mcgill.ca/ServicesAtlases/ICBM152NLin2009) (McConnell Brain Imaging Centre, McGill University), the data in the viewer.

<LearnCta position="bottom" chart="MRI viewer" demo="heatmap-chart" demoLabel="heatmap chart" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />
