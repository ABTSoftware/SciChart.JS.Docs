---
sidebar_position: 3
sidebar_label: Altering Study Settings
title: "Altering Study Settings: Change Indicator Settings in Code | SciTrader.js"
description: "Alter study and indicator settings in SciTrader.js trading charts, such as an RSI's period or a moving average's colour, from code with the study descriptor, reset them to defaults, and let users edit them with the Settings Form, in TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "indicator settings", "study settings", "applyDescriptor", "getDescriptor", "change RSI period", "study descriptor", "React indicator settings"]
---

# Altering Study Settings

Every study's settings, such as an RSI's period and levels or a moving average's colour, can be changed while it is on the chart. This page covers altering study and indicator settings from code, through the study's **descriptor**. Built-in studies apply new settings in place: no data reloads, and the chart doesn't flash.

To let users edit settings themselves, use the ready-made [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/) UI components, which edit the same descriptor.

## Study Settings Are a Descriptor {#descriptors}

A study describes its settings as a **descriptor** (`TStudyDescriptor`), in two sections:

- **`inputs`**: what it calculates from, such as periods and levels;
- **`styles`**: how it looks, such as colours, line thickness and line style.

Each section is a set of named **controls**. A control has a `type` (number, colour, select…), a `label` for the settings form, and its current value in `default`:

```ts
const rsi = new RSIStudy({ length: 14 });
// ... once the RSI is on a chart:
const descriptor = rsi.getDescriptor(); // the RSI's current settings

descriptor.inputs.controls.period;
// { name: "period", type: "number", label: "Period", default: 14 }

descriptor.styles.controls.strokeColor;
// { name: "strokeColor", type: "color", label: "Stroke Color", default: "#…" }
```

Every study has these settings members. They are part of the [IStudy interface](/financial-charts/studies-and-indicators/#istudy), where their TSDoc is:

| Member | What it does |
| --- | --- |
| `study.getDescriptor()` | The study's current settings, read fresh from the live study |
| `study.applyDescriptor(descriptor)` | Applies settings to the live study |
| `study.getDefaultDescriptor()` | The settings the study had when first attached, for "reset to defaults" |
| `study.supportsLiveApply` | Whether `applyDescriptor` updates the study in place. `true` for every built-in study |
| `study.descriptorApplied` | Fires after `applyDescriptor`, with the settings applied |

`getDescriptor()` refills and returns the same object on every call. Copy it before you keep it, e.g. as React state, or a later read changes your copy too.

:::warning
Change settings with `applyDescriptor`, not `setDescriptor`. `setDescriptor` only stores a descriptor, without applying it to the chart, and the next `getDescriptor()` replaces it with the study's live settings. `setDescriptor` and `addDescriptor` are for [writing a study](/financial-charts/studies-and-indicators/creating-custom-studies/).
:::

The descriptor is also what [Save and Restore](/financial-charts/save-and-restore/) saves for each study, so edited settings are kept.

<details>
<summary>The TStudyDescriptor type, IuiDescriptor interface, and EDescriptorSectionName and EDescriptorType enums, with their TSDoc</summary>

```ts
interface IuiDescriptor {
    id?: string;
    name: string;
    type: string;
    label: string;
    default: string | number;
    options?: {
        value: string;
        label: string;
    }[];
}
interface IDescriptorControls {
    [key: string]: IuiDescriptor;
}
type TStudyDescriptor = {
    [Key in EDescriptorSectionName]: {
        controls: IDescriptorControls;
    };

enum EDescriptorSectionName {
    STYLES = "styles",
    INPUTS = "inputs"
}

enum EDescriptorType {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select",
    COLOR = "color",
    STROKE_TYPE = "stroke-type",
    /** A colour ramp: stops of colour and position, edited on a gradient bar. See {@link GradientDescriptor}. */
    GRADIENT = "gradient"
}
```

</details>

## Changing a Setting from Code with applyDescriptor

To change one setting, copy the study's descriptor with that one control's value changed, and apply the copy. A small helper does it for any study and setting:

```ts
import { EDescriptorSectionName, IStudy } from "scichart-scitrader";

// Set one control of a live study's settings, e.g. the RSI's "period"
function setStudySetting(study: IStudy, section: EDescriptorSectionName, control: string, value: string | number) {
    const descriptor = study.getDescriptor(); // the current settings
    const controls = descriptor[section].controls;
    study.applyDescriptor({
        ...descriptor, // keep the other section as it is
        [section]: {
            // keep the section's other controls, and replace this control's value
            controls: { ...controls, [control]: { ...controls[control], default: value } },
        },
    });
}

setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7); // an input: the RSI is recalculated
setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c"); // a style: its line is recoloured
```

There is no one-call setter yet: changing one setting means copying the whole descriptor, and control names are strings. A simpler, typed API is logged as SCT-924.

A colour edit applies to the chart's current theme only, and the study keeps the colours it was given under other themes; see [Styling and Themes](/financial-charts/styling-and-themes/).

### Resetting a Study to Its Defaults with getDefaultDescriptor

`getDefaultDescriptor()` returns the settings the study had when it was first attached. Apply it to reset the study:

```ts
// Reset one study
rsi.applyDescriptor(rsi.getDefaultDescriptor());

// Reset every study on the chart
for (const study of financeChartPanel.financeApi.studies) {
    study.applyDescriptor(study.getDefaultDescriptor());
}
```

### Following Settings Changes with descriptorApplied

`descriptorApplied` fires after every `applyDescriptor`, whether from your code, a settings form or a reset. Use it to keep your own UI in step:

```ts
// Called with the settings just applied
rsi.descriptorApplied.subscribe((descriptor) => {
    console.log("RSI period is now", descriptor.inputs.controls.period.default);
});
```

### Settings Names of the Built-in Studies

Each study names its own controls. To see a study's, log `study.getDescriptor()`. For the built-in studies:

| Study | Inputs | Styles |
| --- | --- | --- |
| `ADXStudy` | `period` | `adxColor`, `pdiColor`, `mdiColor`, `strokeThickness` |
| `ATRStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `AwesomeOscillatorStudy` | (none) | `upColor`, `downColor` |
| `BollingerBandsStudy` | `period`, `stdDev` | `upperBandColor`, `lowerBandColor`, `middleBandColor`, `bandFillColor`, `strokeThickness` |
| `CCIStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `DonchianChannelsStudy` | `period` | `upperBandColor`, `lowerBandColor`, `channelFillColor`, `basisColor`, `strokeThickness` |
| `EMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `ForceIndexStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `IchimokuCloudStudy` | `conversionPeriod`, `basePeriod`, `spanPeriod`, `displacement` | `tenkanColor`, `kijunColor`, `senkouAColor`, `senkouBColor`, `chikouColor`, `cloudBullishColor`, `cloudBearishColor`, `strokeThickness` |
| `KeltnerChannelsStudy` | `maPeriod`, `atrPeriod`, `multiplier` | `upperBandColor`, `lowerBandColor`, `channelFillColor`, `basisColor`, `strokeThickness` |
| `LargeTradeStudy` | `threshold` | `buyColor`, `sellColor`, `strokeThickness` |
| `LineStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `MACDStudy` | `fast`, `slow`, `signal` | `histogramAboveZero`, `histogramBelowZero`, `bandMacdColor`, `bandSignalColor`, `fillMacdAboveSignal`, `fillMacdBelowSignal`, `strokeThickness` |
| `MFIStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `OBVStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `OHLCStudy` | `candleType` | `brushUp`, `brushDown`, `strokeUp`, `strokeDown`, `dataPointWidth` |
| `OrderBookHeatmapStudy` | `side` | `palette`, `scaleType`, `colorFromPct`, `colorToPct`, `opacity`, `minRowPx`, `ramp` |
| `OrderBookImbalanceStudy` | `method`, `pct` | `bidColor`, `askColor`, `fillStyle`, `fillOpacity`, `strokeThickness`, `gauge` |
| `PointAndFigureStudy` | `boxSize`, `reversalAmount` | (none) |
| `PSARStudy` | `step`, `max` | `dotColor`, `dotSize` |
| `RenkoStudy` | `brickSize`, `reversalAmount` | (none) |
| `ROCStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `RSIStudy` | `period`, `overbought`, `oversold` | `strokeColor`, `strokeThickness`, `strokeStyle`, `thresholdFills`, `overboughtFill`, `oversoldFill` |
| `SMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `StochasticStudy` | `period`, `signalPeriod` | `strokeK`, `strokeD`, `strokeThickness` |
| `TRIXStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `VolumeStudy` | (none) | `volumeUpColor`, `volumeDownColor`, `dataPointWidth` |
| `VolumeProfileStudy` | `binCount`, `rangeMode` | `fill`, `widthPercent`, `dataPointWidth`, `side`, `showPointOfControl`, `pointOfControlColor` |
| `VWAPStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `WilliamsRStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `WMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |

`strokeStyle` is `"solid"`, `"dashed"` or `"dotted"`.

## TypeScript Example: Changing Study Settings from Code

A BTC-USD chart from Coinbase with Volume, SMA and RSI. The buttons change the RSI's settings in code: its period (an input, so the RSI is recalculated) and its line colour (a style). **Reset RSI** applies `getDefaultDescriptor()`. The panel on the right shows the RSI's descriptor, refreshed on `descriptorApplied`, so you can watch the values change.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/studies_StudySettings/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><pre id="descriptor" style="width: 320px; margin: 0; overflow: auto"></pre></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/studies_StudySettings/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Changing Study Settings from Code

The same chart in React. The descriptor panel is React state, updated from `descriptorApplied` in an effect.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="StudySettingsChart" name="../../_examples/studies_StudySettings/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/studies_StudySettings/react.tsx
    ```
</CodeSnippetBlock>

## Letting Users Edit Settings: StudySettingsForm and StudyList {#settings-forms}

Two ready-made UI components edit a study's descriptor for you:

- **`StudySettingsForm`** draws one study's settings as a form, with a field for each control: number boxes, dropdowns, colour pickers and line styles. Edits apply as they are made.
- **`StudyList`** lists the chart's studies; each opens its settings form, and × removes the study.

```tsx
// React
import { StudyList, StudySettingsForm } from "scichart-scitrader-react";

<StudySettingsForm study={rsi} /> // one study's settings
<StudyList chart={financeChartPanel.financeApi} title="Studies" /> // every study on the chart
```

They work with any study, including [your own](/financial-charts/studies-and-indicators/creating-custom-studies/). A settings form shows values applied from code, too. See [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/) for their options, styling and live examples.

## Where to read next

- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit study settings.
- [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/): give your own study settings.
- [Save and Restore](/financial-charts/save-and-restore/): settings are saved with the chart.
