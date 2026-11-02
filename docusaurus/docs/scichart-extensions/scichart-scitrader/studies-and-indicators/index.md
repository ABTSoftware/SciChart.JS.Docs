---
sidebar_position: 5
sidebar_label: Studies and Indicators
title: "Technical Indicators & Studies | SciTrader.js Trading Charts"
description: "Add RSI, MACD, Bollinger Bands, Ichimoku and 30 more technical indicators to SciTrader.js trading charts, switch candle types (Heikin-Ashi, Renko, Point & Figure) and write custom studies."
keywords: ["SciTrader", "SciTrader.js", "technical indicators JavaScript", "RSI MACD chart", "Heikin-Ashi Renko chart", "custom study"]
---

# Studies and indicators

Everything a chart draws is a **study**:
- `OHLCStudy` draws price;
- `VolumeStudy` draws volume;
- every indicator is a study too.

Studies are passed in `studies` when the chart is created, or added and removed later.

## Add indicators

```ts
const financeChartPanel = await SciFinanceChartPanel.create(container, {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    studies: [
        new OHLCStudy(),
        new VolumeStudy(),
        // Overlays draw on the price pane
        new SMAStudy({ length: 50 }),
        new EMAStudy({ length: 20, renderOptions: { stroke: "#FFB74D", strokeThickness: 2 } }),
        new BollingerBandsStudy({ period: 20, stdDev: 2 }),
        // Oscillators each get a pane of their own
        new RSIStudy({ length: 14, overbought: 70, oversold: 30 }),
        new MACDStudy({ fast: 12, slow: 26, signal: 9 }),
    ],
});
```

- **Overlays** (moving averages, bands, channels, PSAR, VWAP, Ichimoku) share the price pane and its price axis.
- **Oscillators** (RSI, MACD, …) have their own scale, so the chart adds a pane for each one below the price pane. Pane sizes default to price 3 : indicator 1; override them with `paneSizing`.

Constructor options set a study's inputs (lengths, levels) and its styles (colours, thickness). Anything left out takes its default. The user can still change all of it later: see [Settings forms](#settings-forms).

<CenteredImageWrapper src={require("../_examples/studies_AddIndicators/screenshot.png").default} title="Add Indicators" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/studies_AddIndicators/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/studies_AddIndicators/react.tsx
    ```
</CodeSnippetBlock>

## Add and remove at runtime

```ts
import { EStudyType, studyProvider } from "scichart-scitrader";

const rsi = studyProvider.getStudy(EStudyType.RSI); // a new RSI with default settings
await financeChartPanel.financeApi.attachStudy(rsi);

financeChartPanel.financeApi.detachStudy(rsi); // its pane goes with it
```

- **`studyProvider`** creates any registered study from its `EStudyType`. That is what a study picker needs, and it is also how saved charts are restored.
- **`STUDY_MENU_ITEMS`** (in `EStudyType.ts`) is the catalogue for building a picker. Each entry carries `type`, `label`, `description` and `category`. `filterStudyMenuItems(items, { query, category })` searches it, matching labels, descriptions, categories and types, and `groupStudyMenuItems` groups the result by category.
- **`financeApi.studies`** lists the attached studies.
- **`studiesChanged`** fires whenever that list changes.
- **Pane limit.** The chart holds at most `maxPanes` panes (default 6). An oscillator that would exceed the limit is refused, and `paneLimitReached` is raised so you can tell the user. Overlays are never refused.

<CenteredImageWrapper src={require("../_examples/studies_RuntimeIndicators/screenshot.png").default} title="Add / Remove at Runtime" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/studies_RuntimeIndicators/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/studies_RuntimeIndicators/react.tsx
    ```
</CodeSnippetBlock>

## The catalogue

| Category (`EStudyCategory`) | Studies (`EStudyType`) | Pane |
|---|---|---|
| Price & Chart Types | `OHLC`, `Renko`, `PointAndFigure` | price; Renko and P&F: own pane, category axis |
| Trend | `SMA`, `EMA`, `WMA`, `PSAR`, `Ichimoku`, `ADX` | price; ADX: own pane |
| Momentum | `RSI`, `MACD`, `Stochastic`, `CCI`, `WilliamsR`, `ROC`, `TRIX`, `AO` | own pane |
| Volatility | `BBANDS`, `Keltner`, `Donchian`, `ATR` | price; ATR: own pane |
| Volume | `Volume`, `VolumeProfile`, `VWAP`, `OBV`, `MFI`, `ForceIndex` | price; OBV, MFI, Force Index: own pane |
| Order Book | `OrderBookHeatmap`, `OrderBookImbalance` | price; Imbalance: own pane |

`LargeTradeStudy` (large-trade markers on the price pane) is not in the menu or `studyProvider`. It reads a trade feed you create yourself.

The **order-book studies** need an order-book data source (`IOrderBookSource`) registered for the chart's exchange. See [Order-book data](/scichart-extensions/scichart-scitrader/data-sources/#order-book-data).

## Candle types

The price study can draw candlesticks, OHLC bars, a line, a mountain (area), or Heikin-Ashi candles:

```ts
import { ECandleType } from "scichart-scitrader";

new OHLCStudy({ candleType: ECandleType.HeikinAshi }); // initial style
financeChartPanel.financeApi.setCandleType(ECandleType.OhlcBars); // change it later
```

Changing the candle type swaps the price series in place. Data, zoom and studies are untouched, and `candleTypeChanged` is raised. `CANDLE_TYPE_MENU_ITEMS` lists the types with labels, and `CandleTypeSelector` is a ready-made picker ([UI components](/scichart-extensions/scichart-scitrader/ui-components/#toolbar-controls)).

**Renko** and **point & figure** are not candle types. They plot price movement, not time: a new brick or column appears only when price moves far enough. So they are studies, each with its own pane and a category (index) axis:

```ts
await financeChartPanel.financeApi.attachStudy(new RenkoStudy({ reversalAmount: 2 }));
await financeChartPanel.financeApi.attachStudy(new PointAndFigureStudy({ boxSize: 5, reversalAmount: 3 }));
```

Leave `brickSize` / `boxSize` unset to derive them from the price range.

<CenteredImageWrapper src={require("../_examples/studies_CandleTypes/screenshot.png").default} title="Candle Types, Renko, P&F" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/studies_CandleTypes/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/studies_CandleTypes/react.tsx
    ```
</CodeSnippetBlock>

The **Studies UI (React)** example below has an "add indicator" picker built in a few lines on `STUDY_MENU_ITEMS`, `filterStudyMenuItems` and `studyProvider`, and a `StudyList` to edit and remove studies.

## Settings forms

Every study describes its settings as a **descriptor**: a list of typed controls (number, colour, select, stroke style, gradient) in two sections, *Inputs* and *Styles*.

```ts
const descriptor = study.getDescriptor();         // current settings
study.applyDescriptor(editedDescriptor);          // apply edits live
const defaults = study.getDefaultDescriptor();    // for "reset to defaults"
```

**`StudySettingsForm`** renders a descriptor as a form: number and text boxes, dropdowns, line styles, a colour picker with opacity and a gradient editor. Edits apply to the chart as they are made, 150 ms after the last change, through `study.applyDescriptor`; pass `onApply` to do something else. "Reset to defaults" restores `getDefaultDescriptor()`, and when the study's settings change elsewhere, the form shows them. Any study gets a form this way, including your own:

```tsx
import { StudySettingsForm } from "scichart-scitrader-react";

<StudySettingsForm study={study} />
```

`sectionFilter` shows only some sections, e.g. `[EDescriptorSectionName.INPUTS]`, and `hideSectionLabels` leaves out the headings, for a page with its own Inputs and Styles tabs.

See the **Custom Study** example below.

**`StudyList`** lists the chart's studies. Each opens its settings form, one at a time, and × removes it from the chart. It follows studies added or removed elsewhere. A study that can't update in place (`supportsLiveApply` is false) is rebuilt with the new settings and swapped in.

```tsx
import { StudyList } from "scichart-scitrader-react";

<StudyList chart={chart.financeApi} />
```

In plain TypeScript, `StudySettingsForm.create(container, { study })` and `StudyList.create(container, { chart: financeChartPanel.financeApi })` build the same components ([UI components](/scichart-extensions/scichart-scitrader/ui-components/#how-they-work)).

<CenteredImageWrapper src={require("../_examples/studies_StudiesUi/screenshot.png").default} title="Studies UI (React)" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/studies_StudiesUi/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/studies_StudiesUi/react.tsx
    ```
</CodeSnippetBlock>

Descriptors are what `toJSON()` saves for each study, so edited settings survive a save and restore.

## Writing a study

A study extends `StudyBase<T>` and implements five steps:

| Method | Responsibility |
|---|---|
| `createInputOutputIds` | Which data it reads (usually the default feed's close) and which it writes |
| `createDataSeries` | SciChart data series for its output |
| `createAxes` | Axes for its pane. Overlays return none |
| `createRenderableSeries` | How to draw it |
| `onDataChanged` | Recalculate when input data is replaced, appended or updated |

Register it so it can be created by type and restored from JSON:

```ts
studyProvider.registerStudy("MyStudy", {
    type: "MyStudy" as EStudyType, // StudyRegistration.type is typed as the built-in enum; see note

    name: "My Study",
    description: "What it shows",
    createStudy: (descriptor, options) => new MyStudy(options /* merged with descriptor values */),
});
```

`registerStudy` accepts any string as the key, but `StudyRegistration.type` and `IStudy.type` are typed as the built-in `EStudyType`, so a custom type needs a cast for now.

`SMAStudy.ts` is the smallest complete overlay to copy from, and `RSIStudy.ts` the smallest complete oscillator.

<CenteredImageWrapper src={require("../_examples/studies_CustomStudy/screenshot.png").default} title="Custom Study" />

The **Custom Study** example is a complete momentum study written outside the SDK, with a settings form, registered so it can be saved and restored.

<CodeSnippetBlock labels={["TS", "React", "MomentumStudy.ts"]}>
    ```ts showLineNumbers file=../_examples/studies_CustomStudy/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/studies_CustomStudy/react.tsx
    ```
    ```ts showLineNumbers file=../_examples/studies_CustomStudy/MomentumStudy.ts
    ```
</CodeSnippetBlock>
