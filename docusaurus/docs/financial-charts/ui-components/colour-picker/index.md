---
sidebar_position: 5
sidebar_label: Colour Picker
title: "ColorPicker: Change Indicator and Study Colours | SciTrader.js"
description: "Let users recolour SciTrader.js indicators such as an SMA line or MACD with the ready-made ColorPicker, in plain TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "ColorPicker", "colour picker", "indicator colour", "study settings", "SMA colour", "MACD colour"]
---

# Colour Picker

`ColorPicker` is a labelled swatch that opens a colour picker: a saturation and brightness square, hue and opacity strips, a hex box, and R, G, B and A boxes. It works from the keyboard, and closes on Escape or a click outside.

Its value is any CSS colour. It reports six-digit hex (`#rrggbb`) when the colour is opaque, and `#rrggbbaa` when it isn't. A drag calls `onChange` continuously, so debounce anything expensive.

The study settings forms use it for every colour setting, and it suits any colour setting of your own app. The examples below use it to recolour indicators on a live chart: an SMA line, and MACD's two lines.

## TypeScript Example: Changing Indicator Colours with ColorPicker

A chart of BTC-USD from Coinbase, with a 20-candle SMA and a MACD pane. The three colour pickers in the toolbar recolour the SMA line, the MACD line and the signal line as you drag.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/components_ColorPicker/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_ColorPicker/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Changing Indicator Colours with ColorPicker

The same chart in React, with the React `ColorPicker` from `scichart-scitrader-react`. Each picker is a controlled component: its colour lives in React state.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="StudyColoursChart" name="../../_examples/components_ColorPicker/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_ColorPicker/react.tsx
    ```
</CodeSnippetBlock>

## Applying a Colour to a Study {#applying-a-colour-to-a-study}

A study's settings are its **descriptor**: an `inputs` section and a `styles` section, each a set of named controls holding their value in `default`. A colour setting is a control of type `"color"`, such as SMA's `strokeColor`. To change one setting:

1. Read the study's current settings with `study.getDescriptor()`.
2. Make a copy with that one control's value changed.
3. Apply the copy with `study.applyDescriptor(descriptor)`.

```ts
import { EDescriptorSectionName, IStudy } from "scichart-scitrader";

// Change one colour setting of a live study, e.g. setStudyColour(sma, "strokeColor", "#ff9f1c")
function setStudyColour(study: IStudy, control: string, colour: string) {
    const descriptor = study.getDescriptor();
    const styles = descriptor[EDescriptorSectionName.STYLES].controls;
    study.applyDescriptor({
        ...descriptor,
        [EDescriptorSectionName.STYLES]: {
            controls: { ...styles, [control]: { ...styles[control], default: colour } },
        },
    });
}
```

Studies whose `supportsLiveApply` is `true`, such as `SMAStudy` and `MACDStudy`, restyle their series in place, without reloading any data. Each study has its own control names. To see them, log `study.getDescriptor().styles.controls`; for example:

| Study | Colour controls |
| --- | --- |
| `SMAStudy` | `strokeColor` |
| `MACDStudy` | `bandMacdColor` (MACD line), `bandSignalColor` (signal line), `fillMacdAboveSignal`, `fillMacdBelowSignal`, `histogramAboveZero`, `histogramBelowZero` |

The settings you apply are saved with the chart, so they survive `toJSON` and `fromJSON`. For a complete form of a study's settings, with a `ColorPicker` for each colour, use `StudySettingsForm` instead; see [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/).

The descriptor's types, `TStudyDescriptor`, `IuiDescriptor` and `EDescriptorSectionName`, are documented under [Study Settings Are a Descriptor](/financial-charts/studies-and-indicators/altering-study-settings/#descriptors), and `getDescriptor`, `applyDescriptor` and the other settings members of a study under [The IStudy Interface](/financial-charts/studies-and-indicators/#istudy).

## ColorPicker Options {#options}

| Option | Type | What it does |
| --- | --- | --- |
| `label` | `string` | The label shown before the swatch |
| `value` | `string` | The colour: any CSS colour; `#rrggbbaa` for one with opacity |
| `onChange` | `(value: string) => void` | Called on every change, with `#rrggbb`, or `#rrggbbaa` when not opaque |
| `trailing` | `HTMLElement` (React: `ReactNode`) | Shown after the swatch, on the same row |
| `popoverContainer` | `HTMLElement` | Where the open picker is attached. Default `document.body`. Not in the React props |

<details>
<summary>The ColorPicker class and IColorPickerOptions, with their TSDoc</summary>

```ts
/**
 * A colour field with an opacity channel, in plain DOM: a label and a swatch (over a
 * checkerboard, so transparency shows) that opens a picker with a saturation/brightness square,
 * hue and opacity strips, a hex box and R/G/B/A byte boxes.
 *
 * Every part works from the keyboard: the square and strips are sliders (arrow keys, Shift for
 * bigger steps). The picker closes on Escape or a click outside. The look is `.st-color-field` and
 * `.st-color-popover` in `scitrader.css`.
 *
 * While the picker is open it holds the colour as HSVA, so the hue strip still works on white or
 * black, which have no hue of their own.
 */
class ColorPicker {
    /** The field row, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IColorPickerOptions): ColorPicker;
    /** The current colour, as `onChange` would report it. */
    get value(): string;
    /** Whether the picker is open. */
    get isOpen(): boolean;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IColorPickerOptions>): void;
    destroy(): void;
}

/** Options for {@link ColorPicker}. */
interface IColorPickerOptions {
    label: string;
    /** The colour: any CSS colour; 8-digit hex is `#rrggbbaa`. */
    value: string;
    /**
     * Called on every change, with 6-digit hex when opaque and `#rrggbbaa` when not. A drag calls
     * it continuously, so debounce expensive work.
     */
    onChange?: (value: string) => void;
    /**
     * Shown after the swatch on the same row, taking the remaining width (the gradient editor puts
     * a stop's position here). The label then shrinks to its text.
     */
    trailing?: HTMLElement;
    /** Where the open picker is attached. Default `document.body`. */
    popoverContainer?: HTMLElement;
}
```

</details>

<details>
<summary>The React ColorPicker and its props, with their TSDoc</summary>

```ts
/** Props for {@link ColorPicker}. */
interface IColorPickerProps extends IHostProps {
    label: string;
    /** Any CSS colour; 8-digit hex is `#rrggbbaa`. */
    value: string;
    /** Called on every change: 6-digit hex when opaque, `#rrggbbaa` when not. */
    onChange: (value: string) => void;
    /** Shown after the swatch on the same row. */
    trailing?: React.ReactNode;
}

/**
 * The SDK's colour field in React: a label and swatch that open a picker with opacity. Controlled
 * by `value` and `onChange`.
 */
function ColorPicker({ label, value, onChange, trailing, className, style }: IColorPickerProps): JSX.Element;

/** Props every React study-settings component takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}
```

</details>

`GradientRampEditor` edits a colour ramp, such as the order-book heatmap's, with a draggable handle for each stop. It is the gradient field of the settings form, and has no React wrapper.

## Styling the Colour Picker {#styling}

| Element | Class |
| --- | --- |
| The field: label and swatch | `st-color-field` (`--with-trailing` with a trailing element), `__label`, `__swatch`, `__swatch-color`, `__trailing` |
| The open picker | `st-color-popover`, `__picker`, `__saturation`, `__hue`, `__alpha`, `__hex`, `__channels`, `__channel` |

```css
/* A round swatch */
.st-color-field__swatch,
.st-color-field__swatch-color {
    border-radius: 50%;
}
```

The picker is attached to `document.body`, outside your toolbar, so scope its rules by its own class, or attach it inside your container with `popoverContainer`. See [Styling and Themes](/financial-charts/styling-and-themes/css-stylesheet/).

#### See also

- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/)
- [Market Depth](/financial-charts/ui-components/market-depth/): its colours can be edited with a `ColorPicker` too
