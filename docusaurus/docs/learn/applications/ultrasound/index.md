---
sidebar_position: 280
sidebar_label: Ultrasound
title: "How Ultrasound Works and How to Read an Ultrasound Image"
description: "How medical ultrasound turns echoes into a picture, what bright, grey and black mean, probe types, colour Doppler, artefacts and ultrasound vs MRI, with a live scan."
keywords:
    [
        "how does ultrasound work",
        "how to read an ultrasound",
        "how to read an ultrasound image",
        "ultrasound image",
        "doppler ultrasound",
        "color doppler",
        "b mode ultrasound",
        "m mode ultrasound",
        "ultrasound vs mri",
        "hyperechoic",
        "hypoechoic",
        "anechoic",
        "acoustic shadowing",
        "ultrasound probe types",
        "ultrasound artifacts"
    ]
image: /img/learn/ultrasound-og.png
related: [sonar, non-destructive-testing, ecg, heatmap]
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
                    "name": "How does ultrasound work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A probe on the skin sends short pulses of high-frequency sound, usually a few megahertz, into the body and listens for the echoes that bounce back from boundaries between tissues. The scanner assumes sound travels at about 1,540 metres per second in soft tissue, so the time each echo takes to return gives its depth: about 13 microseconds for every centimetre. The strength of each echo sets the brightness of a dot, and many scan lines side by side build a live greyscale picture." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read an ultrasound image?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start with orientation: the top of the image is the skin where the probe sits, depth increases downwards, and a marker dot shows which side of the image matches the marked side of the probe. Then read the shades: black means no echoes, usually fluid; grey is soft tissue; bright white is a strong reflector such as bone, a stone or gas. Look below bright and black areas for shadows and brighter bands, and check the colour bar if Doppler colour is shown. A sonographer or doctor interprets the scan." }
                },
                {
                    "@type": "Question",
                    "name": "What do red and blue mean on a Doppler ultrasound?",
                    "acceptedAnswer": { "@type": "Answer", "text": "On colour Doppler, the colour shows the direction of blood flow relative to the probe, not whether the vessel is an artery or a vein. By the usual setting, red is flow towards the probe and blue is flow away from it, with brighter shades for faster flow. The colour bar on the screen shows which way round the scanner is set, and one vessel can show both colours if it curves or runs across the beam." }
                },
                {
                    "@type": "Question",
                    "name": "What does black mean on an ultrasound?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Black, called anechoic, means no echoes came back from that place. Usually that is fluid that sound passes through without reflecting, such as urine in the bladder, blood in a vessel, bile in the gallbladder or amniotic fluid. A black area can also be an acoustic shadow behind bone, a stone or gas, where no sound reached, or a place too deep for the echoes to be detected." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between ultrasound and MRI?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Ultrasound makes pictures from echoes of sound, in real time, with a handheld probe, and is portable, widely available and less expensive. MRI uses a strong magnetic field and radio waves in a scanner, takes longer, and shows soft tissue in more detail through bone and gas, which ultrasound cannot see through. Neither uses ionising radiation. Which one is used depends on the body part and the question the doctor is asking." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw an ultrasound image in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Store echo brightness in a 2D array with one row per depth step and one column per scan line, and draw it as a polar heatmap with the scan-line angle on the angular axis and depth on the radial axis, limited to the fan's angle. A greyscale colour map gives the B-mode image, and a second heatmap with a red-transparent-blue colour map can overlay colour Doppler. With SciChart.js, use PolarUniformHeatmapRenderableSeries on a SciChartPolarSurface." }
                }
            ]
        })}
    </script>
</head>

# How Ultrasound Works and How to Read an Ultrasound Image

## What is ultrasound imaging?

**Ultrasound imaging** (sonography; the picture is called a sonogram) is a way of looking inside the body with sound. A handheld probe sends short pulses of sound, far above the range of human hearing, into the body and listens for the echoes. A computer turns the timing and strength of every echo into a moving greyscale picture.

![A simulated B-mode ultrasound image from a curved probe, drawn as a fan-shaped polar heatmap on a dark navy background: bright skin and fascia lines at the top, a blood vessel crossing the image coloured red on the left and blue on the right by colour Doppler, a black fluid-filled cyst with a brighter band below it, and a bright stone casting a dark shadow down to the bottom of the image, with a depth scale in centimetres down the right edge](/img/learn/ultrasound-og.png)

*A simulated scan of a tissue phantom, not a patient: a vessel in colour Doppler, a black fluid-filled cyst and a bright stone casting a shadow. [Try the interactive version](#how-to-build-an-ultrasound-image-display-in-javascript-react-or-angular).*

This guide explains how ultrasound pictures are made and what their shades and colours mean. It is educational, not medical advice. Scans are interpreted by a sonographer or a doctor, with the patient's history, and only they can say what a particular image shows.

:::tip Key takeaways
- The probe times echoes: at about 1,540 m/s in soft tissue, every centimetre of depth adds about 13 microseconds to the round trip.
- On a B-mode image, black is no echo (usually fluid), grey is soft tissue and bright white is a strong reflector such as bone, a stone or gas.
- Higher frequencies give sharper pictures but can't see as deep, so the probe is chosen for the depth of the organ.
- The top of the image is the skin; the fan shape comes from scan lines spreading out from a curved or small probe.
- Colour Doppler colours flow by direction relative to the probe, usually red towards and blue away, not artery and vein.
:::

## How does ultrasound work?

The probe, or **transducer**, holds a row of small piezoelectric crystal elements: materials that vibrate when a voltage is applied and produce a voltage when they are squeezed. A short electrical pulse makes them ring for a few cycles and send a burst of sound into the body. Then the probe falls silent and listens. Each returning echo presses on the same crystals, which turn it back into a tiny electrical signal.

Echoes come from boundaries between materials that carry sound differently (they have a different acoustic impedance). Between two soft tissues, such as fat and liver, less than 1% of the sound energy reflects, so most of it carries on and deeper boundaries also send echoes back. At a boundary between tissue and air, more than 99.9% reflects. That's why the sonographer spreads gel on the skin: a thin layer of air between probe and skin would stop almost all the sound going in.

### How the scanner works out depth

The scanner can't see where an echo came from, only when it arrived. It assumes sound travels at 1,540 metres per second, an average for soft tissue, and halves the round trip:

$$
\text{depth} = \frac{1540\ \text{m/s} \times \text{echo time}}{2}
$$

| Depth | Echo arrives after |
| --- | --- |
| 1 cm | 13 µs (microseconds) |
| 5 cm | 65 µs |
| 10 cm | 130 µs |
| 20 cm | 260 µs |

Each pulse gives one scan line: a column of echo strengths at every depth. The probe fires its elements in turn to make the next line beside it, and a few hundred lines make one picture, or frame. The deeper the image, the longer the probe waits for the last echo before the next pulse. With one pulse per line, 256 lines to 15 cm take about 50 ms, so about 20 frames a second; at 5 cm the same frame takes about 17 ms. Real scanners change this, for example by forming several lines from one pulse, or by firing extra pulses for each line to sharpen the focus at more than one depth.

The strength of each echo sets the brightness of a dot on the screen. This is **B-mode**, for brightness mode, the standard greyscale ultrasound picture. Sonar and industrial ultrasonic testing use the same pulse-echo timing, in water and in steel: see the [sonar guide](/learn/applications/sonar/) and the [non-destructive testing guide](/learn/applications/non-destructive-testing/).

### Frequency, depth and resolution

Medical imaging usually uses frequencies between about 2 and 15 MHz, millions of vibrations a second. Frequency sets two things that pull in opposite directions:

- **Resolution.** A higher frequency has a shorter wavelength (1,540 m/s divided by the frequency), so the pulse is shorter and the beam can be focused more tightly. Fine detail shows.
- **Penetration.** Tissue absorbs and scatters sound, and it does so faster at higher frequencies. A typical figure for soft tissue is about 0.5 dB per centimetre for every megahertz, and the echo pays it twice, on the way in and on the way out.

| Frequency | Wavelength in soft tissue | Echo loss from 10 cm deep (at 0.5 dB/cm/MHz) | Used for |
| --- | --- | --- | --- |
| 2.5 MHz | 0.62 mm | 25 dB | Deep abdomen and pelvis, larger patients |
| 3.5 MHz | 0.44 mm | 35 dB | General abdominal and pregnancy scans |
| 5 MHz | 0.31 mm | 50 dB | Shallower organs, children |
| 7.5 MHz | 0.21 mm | 75 dB | Blood vessels, muscles, breast |
| 10 to 15 MHz | 0.15 to 0.10 mm | 100 to 150 dB | Tendons, thyroid, structures just under the skin |

Every 10 dB is a factor of ten in power, so an echo that has lost 75 dB comes back with less than a ten-millionth of the power it would have had from close to the probe. At high frequencies, deep echoes sink below the electronic noise of the receiver, and no amount of gain brings them back. In the [interactive scan](#how-to-build-an-ultrasound-image-display-in-javascript-react-or-angular), switch from 3.5 MHz to 7.5 MHz at 20 cm depth and watch the bottom of the image go dark.

## Ultrasound probes and why the image is a fan

The shape of the image comes from the shape of the probe.

![Three ultrasound probes and their image shapes. A linear probe with a flat face makes a rectangular image of parallel scan lines; it uses high frequencies for fine detail near the surface, such as vessels, muscles, tendons and the thyroid. A curved, curvilinear probe with a convex face makes a wide fan whose top follows the curve of the probe; it uses lower frequencies to see deep into the abdomen and pelvis, including pregnancy scans. A phased array probe has a small face and steers its beam electronically, making a fan that starts from a point; it fits between the ribs for heart scans](./ultrasound-probe-types.svg)

| Probe | Face | Image shape | Frequency | Typical scans |
| --- | --- | --- | --- | --- |
| Linear | Flat | Rectangle, as wide as the probe | High (often 5 to 10 MHz or more) | Vessels, muscles and tendons, thyroid, breast, guiding needles |
| Curved (curvilinear) | Convex | Wide fan with a curved top | Low (often 1 to 5 MHz) | Abdomen, pelvis, pregnancy |
| Phased array | Small, flat | Fan from a point | Low | Heart, between the ribs |
| Endocavity (for example transvaginal) | Small, tightly curved | Narrow fan | High | Early pregnancy, the pelvis, from inside the body |

On a curved probe each element points in a slightly different direction, so the scan lines spread out like the spokes of a wheel. A phased array fires all its elements with tiny time delays that steer the beam to one angle after another, so its lines all start from the small face. Either way the image is narrow at the top and wide at depth: close to the probe you see a small patch of tissue, deeper down a much wider one, so a scan through a narrow gap, such as between two ribs, can still show a whole heart.

Endocavity probes can use higher frequencies because they sit close to the organ, so the sound has less tissue to cross.

## B-mode: what bright, grey and black mean

The shade of each part of a B-mode image describes how strongly it sends echoes back, its **echogenicity**. Sonographers describe it with four words, always compared with the tissue around it:

| Term | Looks | What it means | Examples |
| --- | --- | --- | --- |
| Hyperechoic | Bright, white | Strong echoes | Bone surfaces, stones, gas, fibrous sheets such as fascia |
| Isoechoic | The same as its neighbours | Similar echoes | A structure that blends into the tissue around it |
| Hypoechoic | Darker grey | Weaker echoes | Fat under the skin, muscle |
| Anechoic | Black | No echoes | Simple fluid: urine in the bladder, bile, blood in vessels, amniotic fluid, a simple cyst |

The words are relative. Turning the gain up makes everything brighter, so a reader compares one structure with another in the same picture rather than judging a shade on its own.

The fine, grainy texture of solid organs is **speckle**. It comes from echoes off many scatterers far smaller than the pulse, which add up or cancel out depending on their exact spacing. Speckle doesn't show individual cells or fibres; it's an interference pattern, and it changes when the probe moves.

### Acoustic shadowing and posterior enhancement

What lies below a structure says as much about it as the structure itself.

- **Acoustic shadow.** A strong reflector or absorber, such as bone, a gallstone or a kidney stone, stops most of the sound. Its front surface shows as a bright line, and below it is a dark band running straight down the scan lines, because almost no sound reaches the tissue behind. Gas reflects too, but it leaves a greyer, "dirty" shadow with streaks in it.
- **Posterior enhancement.** Fluid absorbs very little sound. The scanner adds gain with depth on the assumption that sound has crossed ordinary tissue (see below), so the tissue behind a fluid-filled structure gets more sound than expected and looks brighter. A bright band below a black area is a clue that the black area really is fluid.

Both are artefacts, in that they show something that isn't really there (a dark or bright band of tissue), but they're among the most useful clues in the picture.

## Gain, TGC and depth: the controls that change the picture

The same tissue can look very different depending on three controls.

- **Gain** amplifies every echo by the same amount, like the brightness on a television. Too much and fluid fills with grey noise and stops looking black; too little and weak echoes from tissue vanish.
- **Time gain compensation (TGC)** adds more gain to later echoes, which come from deeper, to make up for the loss with depth. It's usually a set of sliders, one for each band of depth. Set well, the same tissue looks the same brightness from the top of the image to the bottom.
- **Depth** sets how far down the image reaches. Too shallow and deeper structures are cut off; too deep and the area of interest is small, and the frame rate drops.

Scanners also have a frequency control (often labelled resolution, general and penetration) and a focus control, shown as a small marker beside the depth scale, which sets the depth where the beam is narrowest. All of these change the picture, not the patient, which is one reason a single print can't be compared shade for shade with another taken on a different day or machine.

## How to read an ultrasound image, step by step

![A labelled drawing of a fan-shaped B-mode ultrasound image from a curved probe, with numbered callouts. The probe sits at the top, so the top of the image is the skin, depth increases downwards and a depth scale in centimetres runs down the right edge. An orientation marker dot at the top left matches the marked side of the probe. 1, the bright skin line. 2, darker hypoechoic fat. 3, muscle between bright fascia lines. 4, a vessel shown with colour Doppler, red on the left where the flow comes towards the probe and blue on the right where the same flow goes away, with a black gap in the middle where the flow is at right angles to the beam. 5, mid-grey speckled organ tissue. 6, a black anechoic cyst. 7, the brighter band of posterior enhancement below it. 8, the bright front surface of a stone. 9, the dark acoustic shadow below the stone. 10, a bright curved boundary between tissues](./reading-an-ultrasound-image.svg)

This is a general way to look at any ultrasound picture. It helps you understand what is on the screen or the print; it doesn't replace the report.

1. Read the labels. The screen or print usually shows the date, the probe and preset, the frequency, the depth scale and often a body marker or typed note from the sonographer, such as "RT KIDNEY LONG" (right kidney, lengthways).
2. Find the top. The top of the image is the skin, right under the probe. Everything below is deeper, and the scale at the side gives the depth in centimetres. A fan-shaped image comes from a curved or phased array probe, a rectangle from a linear probe.
3. Find the orientation marker. A dot or logo at the top of the image matches a ridge or light on one side of the probe. In most general scans the probe marker points to the patient's head in a lengthways view, which puts the head on the left of the screen, or to the patient's right in a crossways view, which puts their right on the left of the screen, as on a CT scan viewed from the feet. Heart scans usually put the marker on the right of the screen instead.
4. Work down through the layers. Near the top you'll usually see a bright skin line, then darker fat and muscle separated by bright lines of connective tissue, then the organ being scanned.
5. Read the shades. Black is no echo: usually fluid, sometimes shadow. Grey is tissue. Bright white is a strong reflector.
6. Look below anything very bright or very black. A dark band straight down the scan lines below something bright is a shadow; a brighter band below something black suggests fluid.
7. Check any colour against the colour bar. The bar beside the colour box shows which colour means towards the probe; on most settings red is towards and blue is away.
8. Read the measurements. Small crosses or plus signs are calipers, and the numbers beside them (for example "D1 2.3 cm") are distances the sonographer measured between them.
9. Remember that a still image is one thin slice. The sonographer sweeps the probe through the organ and judges it from many views, and the report is written from all of them.

### Reading a pregnancy scan picture

Pregnancy scans are the ultrasound pictures most people take home, and the same rules apply. Amniotic fluid around the baby is black, because it's fluid. The skull, spine and limb bones are bright, often with shadows below them. Soft tissues are grey. In early pregnancy the pregnancy sac shows as a black, fluid-filled space.

The numbers on a pregnancy print are measurements used to estimate the stage of pregnancy and the baby's growth. Before about 14 weeks the main one is the crown–rump length (CRL), from the top of the head to the bottom. From 14 weeks the usual set is the biparietal diameter (BPD) and head circumference (HC), the abdominal circumference (AC) and the femur length (FL), the thigh bone. The scanner may also print an estimated age (GA) and due date (EDD) worked out from them.

An image of a baby can be hard to read because it's a slice: a cross-section through the head looks like an oval, and a limb cut across looks like a dot. If anything on a scan worries you, ask the person who did it or your midwife or doctor; in many clinics the person doing the scan isn't the one who writes the report, so they may not be able to discuss it on the spot.

## Doppler ultrasound: colour, power and spectral

**Doppler ultrasound** measures movement, almost always of blood. When sound reflects off moving blood cells, its frequency shifts: up if they're moving towards the probe, down if away. The shift is:

$$
f_D = \frac{2\, f_0\, v \cos\theta}{c}
$$

where $f_0$ is the transmitted frequency, $v$ the blood speed, $\theta$ the angle between the beam and the flow, and $c$ the speed of sound. For a 5 MHz beam, blood at 50 cm/s and an angle of 60°, $f_D = 2 \times 5{,}000{,}000 \times 0.5 \times 0.5 / 1540 \approx 1{,}600$ Hz. That's within human hearing, which is why Doppler machines can play the flow as a whooshing sound.

The $\cos\theta$ matters. Flow straight along the beam gives the full shift, and flow at right angles to it gives none at all, however fast it is.

### Colour Doppler

Colour Doppler measures the shift in every cell of a box drawn over the greyscale image and colours it by direction and speed. **The colour is direction relative to the probe, not artery or vein.** By the usual setting, red is towards the probe and blue away, with brighter shades for faster flow; the colour bar on the screen shows which way round it's set, and the sonographer can invert it.

A vessel running across the image can be red at one end and blue at the other, because the flow turns from towards the probe to away from it as the scan lines fan out. Where the flow is exactly at right angles to the beam there's no colour, which can look like a gap in the vessel. The interactive scan below shows this in one straight vessel.

**Power Doppler** shows how much moving blood there is, but not its direction, in a single colour. It's more sensitive to slow flow in small vessels.

### Spectral Doppler

Spectral (pulsed-wave) Doppler measures flow at one spot, a small sample gate placed in a vessel, and draws the speeds there as a graph against time. The waveform's shape shows how the flow changes with each heartbeat. To turn the shift into a speed, the sonographer lines up an angle marker with the vessel, and the reading is most reliable at angles of 60° or less: a 5° error in the angle gives about a 15% speed error at 60°, but about 49% at 80°. Continuous-wave Doppler transmits and listens all the time, so it measures very high speeds, such as jets through a narrowed heart valve, but can't tell at what depth they are.

Pulsed Doppler can't measure speeds above a limit set by how often it pulses (the Nyquist limit, half the pulse repetition frequency). Faster flow wraps round to the other colour or to the other side of the graph. This is **aliasing**, and it can look like flow reversing when it isn't.

## Ultrasound modes: B-mode, M-mode, Doppler and 3D

| Mode | What it shows | Used for |
| --- | --- | --- |
| A-mode | Echo strength along one line, as a trace | Rare in medicine now; eye measurements. Still standard in industrial testing |
| B-mode | A 2D greyscale picture | Almost every scan |
| M-mode | One scan line drawn over time, as a scrolling strip | Heart valves and walls; measuring an early pregnancy's heart rate |
| Colour and power Doppler | Flow on top of the B-mode picture | Finding vessels and checking flow |
| Spectral Doppler | Speed against time at one spot | Measuring flow speed and its pattern |
| 3D and 4D | A volume built from many slices, and a volume shown moving | Some pregnancy, gynaecology and heart scans |

**M-mode** (motion mode) picks one scan line through a moving structure and plots its echoes left to right over time. Things that move, such as a heart valve, draw wavy lines; still tissue draws straight ones. Because it samples one line many times a second, it shows quick movements that a B-mode frame would blur.

## Common ultrasound artefacts

An artefact is something on the image that doesn't match the anatomy. Most come from the scanner's three assumptions: sound travels in a straight line, at 1,540 m/s, and each echo comes from the first thing it met.

| Artefact | What you see | Why it happens |
| --- | --- | --- |
| Reverberation | Evenly spaced bright lines repeating into the depth | Sound bounces back and forth between two strong reflectors, such as the probe face and a needle, and each bounce returns later, so it's drawn deeper |
| Comet tail and ring-down | A short, tapering bright tail below a small reflector or gas | Reverberation within something very small, or ringing in gas bubbles |
| Mirror image | A copy of a structure on the far side of a strong curved reflector, such as the diaphragm | Sound reflects off the surface, then off the structure, then back; the scanner assumes a straight path and draws a ghost |
| Side lobe | Faint grey echoes inside fluid that should be black, such as false "debris" in the bladder | Some energy leaves the probe off to the side; a strong reflector there sends echoes that are drawn as if they came from the main beam |
| Refraction | A structure doubled or shifted sideways, or thin dark shadows at the edges of round fluid-filled structures | Sound bends as it crosses a boundary at an angle, so the scanner draws echoes in the wrong place |
| Speed error | Structures behind fat placed slightly too deep | Sound is slower in fat than 1,540 m/s, so echoes arrive late |
| Shadow and enhancement | Dark or bright bands below a structure | Too much or too little sound lost on the way down (see above) |

Sonographers tell artefacts from anatomy by moving the probe: a real structure stays in place when seen from another angle, while most artefacts move or vanish.

## Ultrasound vs MRI vs CT vs X-ray

| | Ultrasound | MRI | CT | X-ray |
| --- | --- | --- | --- | --- |
| How it works | Echoes of high-frequency sound | Strong magnetic field and radio waves | X-rays from many angles, made into slices | X-rays through the body onto a detector |
| Ionising radiation | No | No | Yes | Yes, a small dose |
| Real time | Yes, moving images | No (some fast sequences) | No | No (except fluoroscopy) |
| Where | Bedside, clinic, handheld | Large scanner | Large scanner | X-ray room or portable |
| Good at | Fluid-filled structures, soft tissue near the surface, moving organs, blood flow, pregnancy | Soft-tissue detail: brain, spine, joints | Fast, whole-body: injuries, bleeding, lungs, bone | Bones, chest |
| Struggles with | Seeing through bone and gas; large patients; depends on the operator's skill | Metal implants, claustrophobia, movement, time | Radiation dose; soft-tissue contrast below MRI | Soft tissue |

Ultrasound is often the first test for a question about soft tissue or fluid, because it's quick, widely available and less expensive than most other imaging. MRI or CT follow when the area is hidden behind bone or gas, or more detail is needed. The [MRI guide](/learn/applications/mri/) explains how MRI images are made and read, including MRI vs CT.

## Is ultrasound safe?

Diagnostic ultrasound doesn't use ionising radiation, and standard diagnostic scans have no known harmful effects in people. Sound does carry energy, though: it can warm tissue slightly, and at high pressures it can make tiny gas bubbles form (cavitation). Scanners show two numbers on screen to track this, the thermal index (TI) and the mechanical index (MI), and sonographers follow the principle of using as little exposure as reasonably achievable (ALARA).

Professional bodies and regulators recommend scans only for a medical reason. In the United States the FDA discourages ultrasound done only to make keepsake pictures or videos of a baby; pictures taken during a medically needed scan are fine to keep. The American Institute of Ultrasound in Medicine advises caution with spectral Doppler in the first trimester, because it delivers more energy, and recommends M-mode or B-mode to record an embryo's heart rate.

## Common mistakes when looking at an ultrasound image

- **Reading the colours as artery and vein.** Red and blue are directions relative to the probe. One vessel can be both, and an artery can be blue.
- **Seeing a black area as empty.** Black means no echoes. It's usually fluid, but it can be a shadow, or a place too deep for the frequency in use.
- **Mistaking a shadow for something missing.** Tissue below a bone or stone hasn't gone; the sound just didn't reach it.
- **Judging brightness on its own.** Gain, TGC and the display settings change every shade. Compare a structure with its neighbours in the same picture.
- **Guessing size by eye.** The fan is narrow at the top and wide at depth, so use the depth scale and the calipers, not the apparent size.
- **Taking a ghost for a second structure.** Mirror images and reverberations look solid in a single frame; the sonographer checks from another angle.
- **Forgetting which way round the image is.** Check the marker dot. Heart scans and general scans put it on opposite sides of the screen.
- **Expecting the print to give the answer.** A print is one slice chosen from a whole sweep. The report, written with the rest of the examination, is the result.

## How to build an ultrasound image display in JavaScript, React or Angular

SciChart.js draws heatmaps with WebGL, including polar heatmaps with an angular range of less than a full circle, so a fan-shaped scan of more than 100,000 cells can be redrawn many times a second. The example below simulates a curved probe scanning a tissue phantom: skin, fat and muscle layers, an organ, a blood vessel in colour Doppler, a fluid-filled cyst with posterior enhancement, a stone with an acoustic shadow and a deeper boundary. The image is formed from a simple model of the physics, with speckle, frequency-dependent attenuation and resolution, and electronic noise. It's simulated data, not a patient scan.

Move **Gain** and **TGC** to brighten the image overall or with depth. Change **Depth** to see more or less, and **Frequency** to trade sharpness against penetration; changing the frequency resets TGC as a scanner preset would. Turn **Colour Doppler** on and off to see the pulsing flow, red on one side of the vessel and blue on the other. Tick **Slow motion** to watch the image built one scan line at a time. Hover over the image for the depth, the echo's return time, its brightness and what it shows. Scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={680} name="./Basic/demo" />

<LearnCta position="top" chart="ultrasound image display" demo="polar-uniform-heatmap-ultrasound" demoLabel="polar ultrasound heatmap" docs="/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/" docsLabel="SciChart.js polar heatmap documentation" />

Here is the code for this example. The phantom and the image model are plain JavaScript; SciChart.js draws the fan-shaped heatmap, the colour Doppler overlay and the scan line. The React and Angular versions draw a B-mode frame from your own data.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EAutoRange,
        NumberRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier
    } from "scichart";

    // A B-mode ultrasound frame from a curved probe: echo brightness by scan line (columns) and depth (rows)
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // zValues[depthIndex][lineIndex], 0 to 60; sectorDeg: the fan's angle; probeRadius, depthStep: cm
        const { zValues, sectorDeg, probeRadius, depthStep } = await getYourUltrasoundFrame();
        const depth = zValues.length * depthStep;
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        sciChartSurface.xAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(-sectorDeg / 2, sectorDeg / 2),
                autoRange: EAutoRange.Never,
                startAngle: toRad(270 - sectorDeg / 2), // the fan points down
                totalAngle: toRad(sectorDeg),
                drawLabels: false,
                drawMajorGridLines: false,
                drawMinorGridLines: false
            })
        );
        const depthAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(probeRadius, probeRadius + depth),
            autoRange: EAutoRange.Never,
            startAngle: toRad(270 + sectorDeg / 2), // depth scale down the right edge
            innerRadius: probeRadius / (probeRadius + depth), // keeps the fan in proportion
            drawMajorGridLines: false,
            drawMinorGridLines: false
        });
        depthAxis.labelProvider.formatLabel = (value) => `${Math.round(value - probeRadius)} cm`;
        sciChartSurface.yAxes.add(depthAxis);

        sciChartSurface.renderableSeries.add(
            new PolarUniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                    xStart: -sectorDeg / 2,
                    xStep: sectorDeg / zValues[0].length,
                    yStart: probeRadius,
                    yStep: depthStep,
                    zValues
                }),
                colorMap: new HeatmapColorMap({
                    minimum: 0,
                    maximum: 60,
                    gradientStops: [
                        { offset: 0, color: "#000000" },
                        { offset: 1, color: "#FFFFFF" }
                    ]
                }),
                fillValuesOutOfRange: true
            })
        );
        sciChartSurface.chartModifiers.add(
            new PolarMouseWheelZoomModifier(),
            new PolarPanModifier(),
            new PolarZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it to its parent and cleans it up
    export const UltrasoundImage = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EAutoRange,
        NumberRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier
    } from "scichart";

    // A B-mode ultrasound frame from a curved probe: echo brightness by scan line (columns) and depth (rows)
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // zValues[depthIndex][lineIndex], 0 to 60; sectorDeg: the fan's angle; probeRadius, depthStep: cm
        const { zValues, sectorDeg, probeRadius, depthStep } = await getYourUltrasoundFrame();
        const depth = zValues.length * depthStep;
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        sciChartSurface.xAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(-sectorDeg / 2, sectorDeg / 2),
                autoRange: EAutoRange.Never,
                startAngle: toRad(270 - sectorDeg / 2), // the fan points down
                totalAngle: toRad(sectorDeg),
                drawLabels: false,
                drawMajorGridLines: false,
                drawMinorGridLines: false
            })
        );
        const depthAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(probeRadius, probeRadius + depth),
            autoRange: EAutoRange.Never,
            startAngle: toRad(270 + sectorDeg / 2), // depth scale down the right edge
            innerRadius: probeRadius / (probeRadius + depth), // keeps the fan in proportion
            drawMajorGridLines: false,
            drawMinorGridLines: false
        });
        depthAxis.labelProvider.formatLabel = (value) => `${Math.round(value - probeRadius)} cm`;
        sciChartSurface.yAxes.add(depthAxis);

        sciChartSurface.renderableSeries.add(
            new PolarUniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                    xStart: -sectorDeg / 2,
                    xStep: sectorDeg / zValues[0].length,
                    yStart: probeRadius,
                    yStep: depthStep,
                    zValues
                }),
                colorMap: new HeatmapColorMap({
                    minimum: 0,
                    maximum: 60,
                    gradientStops: [
                        { offset: 0, color: "#000000" },
                        { offset: 1, color: "#FFFFFF" }
                    ]
                }),
                fillValuesOutOfRange: true
            })
        );
        sciChartSurface.chartModifiers.add(
            new PolarMouseWheelZoomModifier(),
            new PolarPanModifier(),
            new PolarZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    @Component({
        selector: "app-ultrasound-image",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class UltrasoundImageComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The image is a `PolarUniformHeatmapRenderableSeries` on a `SciChartPolarSurface`. The angular axis's `startAngle` and `totalAngle` limit it to a 60° fan pointing down, and the radial axis's `innerRadius` starts the image at the probe face, so the fan keeps its true proportions.
- The radial axis holds distance from the fan's tip; its `labelProvider` subtracts the probe radius so the labels read depth below the skin.
- Colour Doppler is a second polar heatmap on top, with a colour map that runs blue to transparent to red, so cells with no flow let the greyscale show through.
- Gain and TGC only change the values sent to the chart, so the heatmap is updated with `setZValues`, at most 30 times a second while the flow pulses. The scan line in slow motion is a `PolarLineRenderableSeries` with a `PolarColumnRenderableSeries` gradient glow behind it.
- A `CustomChartModifier2D` turns the mouse position into angle and depth with the polar axis's `reverseTransform`, for the readout.

**See it in the demo app:** [JavaScript polar ultrasound heatmap](https://www.scichart.com/demo/javascript/polar-uniform-heatmap-ultrasound) · [React polar ultrasound heatmap](https://www.scichart.com/demo/react/polar-uniform-heatmap-ultrasound) · [Angular polar ultrasound heatmap](https://www.scichart.com/demo/angular/polar-uniform-heatmap-ultrasound). Related techniques: the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) and [React polar heatmap chart](https://www.scichart.com/demo/react/polar-uniform-heatmap-chart).

**Go deeper:** [SciChart.js polar heatmap documentation](/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/), the [uniform heatmap](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), and the learning center guides to [sonar](/learn/applications/sonar/), the same pulse-echo idea underwater, [non-destructive testing](/learn/applications/non-destructive-testing/), with ultrasonic A-, B- and C-scans of metal parts, and the [heatmap](/learn/chart-types/cartesian/heatmap/). For how SciChart is used in medical software, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/).

## Frequently asked questions

### How does ultrasound work?

A probe on the skin sends short pulses of high-frequency sound, usually a few megahertz, into the body and listens for the echoes that bounce back from boundaries between tissues. The scanner assumes sound travels at about 1,540 metres per second in soft tissue, so the time each echo takes to return gives its depth: about 13 microseconds for every centimetre. The strength of each echo sets the brightness of a dot, and many scan lines side by side build a live greyscale picture.

### How do you read an ultrasound image?

Start with orientation: the top of the image is the skin where the probe sits, depth increases downwards, and a marker dot shows which side of the image matches the marked side of the probe. Then read the shades: black means no echoes, usually fluid; grey is soft tissue; bright white is a strong reflector such as bone, a stone or gas. Look below bright and black areas for shadows and brighter bands, and check the colour bar if Doppler colour is shown. A sonographer or doctor interprets the scan.

### What do red and blue mean on a Doppler ultrasound?

On colour Doppler, the colour shows the direction of blood flow relative to the probe, not whether the vessel is an artery or a vein. By the usual setting, red is flow towards the probe and blue is flow away from it, with brighter shades for faster flow. The colour bar on the screen shows which way round the scanner is set, and one vessel can show both colours if it curves or runs across the beam.

### What does black mean on an ultrasound?

Black, called anechoic, means no echoes came back from that place. Usually that is fluid that sound passes through without reflecting, such as urine in the bladder, blood in a vessel, bile in the gallbladder or amniotic fluid. A black area can also be an acoustic shadow behind bone, a stone or gas, where no sound reached, or a place too deep for the echoes to be detected.

### What is the difference between ultrasound and MRI?

Ultrasound makes pictures from echoes of sound, in real time, with a handheld probe, and is portable, widely available and less expensive. MRI uses a strong magnetic field and radio waves in a scanner, takes longer, and shows soft tissue in more detail through bone and gas, which ultrasound cannot see through. Neither uses ionising radiation. Which one is used depends on the body part and the question the doctor is asking.

### How do I draw an ultrasound image in JavaScript?

Store echo brightness in a 2D array with one row per depth step and one column per scan line, and draw it as a polar heatmap with the scan-line angle on the angular axis and depth on the radial axis, limited to the fan's angle. A greyscale colour map gives the B-mode image, and a second heatmap with a red-transparent-blue colour map can overlay colour Doppler. With SciChart.js, use PolarUniformHeatmapRenderableSeries on a SciChartPolarSurface.

## Sources

- RadiologyInfo.org (RSNA and ACR), [General Ultrasound](https://www.radiologyinfo.org/en/info/genus) (reviewed 2024), [Obstetric Ultrasound](https://www.radiologyinfo.org/en/info/obstetricus), [Body MRI](https://www.radiologyinfo.org/en/info/bodymr) and [Body CT](https://www.radiologyinfo.org/en/info/bodyct) (reviewed 2026). How ultrasound is used and who interprets it, its limits with bone, gas and larger patients, its safety, and how it compares with MRI and CT.
- National Institute of Biomedical Imaging and Bioengineering (NIH) (2023), [Ultrasound](https://www.nibib.nih.gov/science-education/science-topics/ultrasound). Piezoelectric transducers, megahertz frequencies, echo timing and Doppler.
- US Food and Drug Administration (2024), [Ultrasound Imaging](https://www.fda.gov/radiation-emitting-products/medical-imaging/ultrasound-imaging). Heating, cavitation, ALARA and keepsake imaging.
- American Institute of Ultrasound in Medicine (2020), [Prudent Use and Safety of Diagnostic Ultrasound in Pregnancy](https://www.aium.org/resources/official-statements/view/prudent-use-and-safety-of-diagnostic-ultrasound-in-pregnancy). Doppler in early pregnancy, the thermal index and entertainment scans.
- Au, A. and Zwank, M. (2020), [Ultrasound Physics and Technical Facts for the Beginner](https://www.acep.org/sonoguide/basic/ultrasound-physics-and-technical-facts-for-the-beginner). ACEP Sonoguide. Probe types, frequency and resolution, B-mode and M-mode, gain and TGC, and the common artefacts.
- Habrat, D. (2025), [How To Do Ultrasound](https://www.msdmanuals.com/professional/critical-care-medicine/how-to-do-other-emergency-medicine-procedures/how-to-do-ultrasound). *MSD Manual Professional Version*. Probe frequencies and the orientation marker conventions.
- Salomon, L. J. et al. (2019), [ISUOG Practice Guidelines: ultrasound assessment of fetal biometry and growth](https://doi.org/10.1002/uog.20272). *Ultrasound in Obstetrics & Gynecology*, 53(6), 715–723. CRL before 14 weeks, then BPD, HC, AC and FL.
- Hoskins, P. R., Martin, K. and Thrush, A. (eds) (2019), *Diagnostic Ultrasound: Physics and Equipment*, 3rd edition. CRC Press. Attenuation, reflection at boundaries, image formation, Doppler and artefacts.

<LearnCta position="bottom" chart="ultrasound image display" demo="polar-uniform-heatmap-ultrasound" demoLabel="polar ultrasound heatmap" docs="/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/" docsLabel="SciChart.js polar heatmap documentation" />
