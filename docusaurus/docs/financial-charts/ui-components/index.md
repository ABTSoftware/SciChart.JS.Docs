---
sidebar_position: 10
sidebar_label: UI Components
title: "UI Components: Toolbars, Watchlist, Market Depth | SciTrader.js"
description: "SciTrader.js UI components for trading apps: interval and period pickers, colour picker, candle counter, icons, market-depth ladder and watchlist sparklines, in plain DOM and React."
keywords: ["SciTrader", "SciTrader.js", "trading UI components", "watchlist sparkline", "market depth ladder React"]
---

# UI components

Besides the chart, the SDK ships the controls a trading app puts around it: toolbar pickers, study settings, a drawings list, a market-depth ladder, loading placeholders, a candle counter, UI icons and the pieces of a watchlist. Each one is plain DOM in `scichart-scitrader`, and `scichart-scitrader-react` wraps it for React. They have the SciTrader app's look, from the stylesheet ([Styling](/financial-charts/styling-and-themes/#the-stylesheet)), and follow the theme.

| Component | Plain TypeScript | React | Documented in |
|---|---|---|---|
| Interval buttons | `IntervalSelector` | `<IntervalSelector>` | [this page](#toolbar-controls) |
| Period buttons | `PeriodSelector` | `<PeriodSelector>` | [this page](#toolbar-controls) |
| Candle-type menu | `CandleTypeSelector` | `<CandleTypeSelector>` | [this page](#toolbar-controls) |
| Follow / Anchored toggle | `LiveTipToggle` | `<LiveTipToggle>` | [this page](#toolbar-controls) |
| Colour field with opacity | `ColorPicker` | `<ColorPicker>` | [this page](#colour-picker) |
| A study's settings form | `StudySettingsForm` | `<StudySettingsForm>` | [Studies](/financial-charts/studies-and-indicators/#settings-forms) |
| The chart's studies, each with its form | `StudyList` | `<StudyList>` | [Studies](/financial-charts/studies-and-indicators/#settings-forms) |
| Drawing tools rail | `DrawingToolbar` | `<DrawingToolbar>` | [Drawing tools](/financial-charts/drawing-tools/) |
| List of drawings | `DrawingList` | `<DrawingList>` | [Drawing tools](/financial-charts/drawing-tools/#list-of-drawings) |
| Market-depth ladder | `MarketDepthPanel` | `<MarketDepthView>` | [Data sources](/financial-charts/data-sources/#market-depth) |
| Loading progress dots | `createPaneProgressDots`, `paneProgressDotsLoading` | `<PaneProgressDots>` | [Layout](/financial-charts/layout/#loading-states) |
| Candle counts (visible / loaded / total) | `CandleCounter`, `countCandles`, `observeCandleCounts` | `<CandleCounter>` | [this page](#candle-counter) |
| UI icons | `SCITRADER_ICONS`, `sciTraderIconSvg` | `<SciTraderIcon>` | [this page](#icons) |
| Watchlist prices and sparklines | `WatchListDataManager`, `SparkLineChart` | none: build the list in React | [this page](#watchlist) |
| Symbols as pairs (`BTC/USDT`) | `formatSymbolPair`, `parseInstrument` | the same functions | [this page](#watchlist) |

## How they work

**Plain TypeScript.** Each component is a class:
- `Component.create(container, options)` builds it inside `container` and returns it.
- `element` is its root element.
- `update(options)` changes any options; the ones not given stay as they are.
- `destroy()` removes it, along with any listeners it added to the document.

Controls that hold a value also have a `value` getter and an `onChange` option.

**React.** Each wrapper mounts the vanilla component in a `<div>` and passes it the latest props after every render, so props apply in place, without a remount. (`SciFinanceChartView` and `MarketDepthView` are the exceptions: some of their props are read once, as their docs say.) The controls are controlled: they show `value` and report the user's choice through `onChange`, as an `<input>` does. All the wrappers take `className` and `style` for their host `<div>`.

## Toolbar controls

`IntervalSelector`, `PeriodSelector`, `CandleTypeSelector` and `LiveTipToggle` change what the chart shows. Each picks a value and calls `onChange`; you pass it on to the chart:

```ts
import {
    CandleInterval,
    CandleTypeSelector,
    carryPeriodToInterval,
    ECandleType,
    IntervalSelector,
    LiveTipToggle,
    PeriodSelector,
} from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

const intervals = IntervalSelector.create(toolbar, {
    value: CandleInterval.FIVE_MINUTES,
    intervals: [
        CandleInterval.ONE_MINUTE,
        CandleInterval.FIVE_MINUTES,
        CandleInterval.FIFTEEN_MINUTES,
        CandleInterval.ONE_HOUR,
        CandleInterval.FOUR_HOURS,
        CandleInterval.ONE_DAY,
    ],
    onChange: async (next) => {
        // Keep about the same span on screen, adjusted to suit the new interval.
        const period = carryPeriodToInterval(periods.value, next);
        periods.update({ currentInterval: next, value: period });
        await chart.changeInterval(next, period);
    },
});

const periods = PeriodSelector.create(toolbar, {
    value: "1D",
    currentInterval: CandleInterval.FIVE_MINUTES, // disables the periods that don't suit it
    onChange: (period) => chart.setPeriod(period), // null is "Free"
});

CandleTypeSelector.create(toolbar, {
    value: ECandleType.Candlestick,
    onChange: (type) => chart.setCandleType(type),
});

LiveTipToggle.create(toolbar, {
    value: chart.liveTipMode,
    onChange: (mode) => (chart.liveTipMode = mode),
});
```

- **`IntervalSelector`** shows `intervals`, or `DEFAULT_INTERVALS` (the common ones, 1s to 1M). `ALL_INTERVALS` lists every interval.
- **`PeriodSelector`** starts with "Free", which calls `onChange(null)`, as does clicking the selected period again. Given `currentInterval`, it disables the periods that `validPeriodsForInterval` rules out, such as one day of daily candles.
- **`CandleTypeSelector`** is a button that opens a menu of candle types, with arrow keys and Escape. The menu is attached to `document.body` so a toolbar's `overflow: hidden` can't clip it; set `menuContainer` to attach it inside a themed element instead.
- **`LiveTipToggle`** switches between Follow, where the view slides right with each new candle, and Anchored, where it stays where the user left it.

<CenteredImageWrapper src={require("../_examples/components_ChartControls/screenshot.png").default} title="Chart Controls (plain TypeScript)" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/components_ChartControls/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/components_ChartControls/react.tsx
    ```
</CodeSnippetBlock>

In React, the same controls are controlled components:

```tsx
import { IntervalSelector, PeriodSelector } from "scichart-scitrader-react";

<IntervalSelector
    value={interval}
    intervals={INTERVALS}
    onChange={(next) => {
        // Keep about the same span, adjusted to suit the new interval.
        const carried = carryPeriodToInterval(period, next);
        setInterval(next);
        setPeriod(carried);
        api && changeInterval(api, next, carried);
    }}
/>
<PeriodSelector
    value={period}
    currentInterval={interval}
    onChange={(next) => {
        setPeriod(next);
        api && changePeriod(api, next);
    }}
/>
```

`<CandleTypeSelector>` and `<LiveTipToggle>` take `value` and `onChange` the same way.

<CenteredImageWrapper src={require("../_examples/gettingStarted_SymbolInterval/screenshot.png").default} title="Symbol, Interval and Period" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/gettingStarted_SymbolInterval/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/gettingStarted_SymbolInterval/react.tsx
    ```
</CodeSnippetBlock>

**Server rendering.** Each control has a static `toHTML(options)` that returns its markup without behaviour, the same markup `create` builds. The React wrappers render it on the server, and the vanilla control takes over before the first paint, so a server-rendered toolbar doesn't change when the page hydrates. A control created with `autoSelect: false` doesn't select what the user picks: it calls `onChange` and waits for `update({ value })`. The React wrappers work this way, so the parent's state decides what is selected.

## Colour picker

`ColorPicker` is a labelled swatch that opens a picker: a saturation and brightness square, hue and opacity strips, a hex box, and R, G, B and A boxes. It works from the keyboard and closes on Escape or a click outside. Its value is any CSS colour; it reports six-digit hex when opaque and `#rrggbbaa` when not. A drag calls `onChange` continuously, so debounce anything expensive.

Study settings forms use it for their colour settings. On its own, it suits any colour setting of your app. Here it recolours the market-depth ladder's bid and ask prices:

```tsx
import { ColorPicker, MarketDepthView } from "scichart-scitrader-react";

// Saved settings are theme-neutral: a colour left at its default follows the theme. Show the
// colours as drawn under the current theme, and store an edit theme-neutral again.
const [depthSettings, setDepthSettings] = React.useState<TMarketDepthSettings>(DEFAULT_MARKET_DEPTH_SETTINGS);
const shown = themeMarketDepthSettings(depthSettings, theme);
const setColour = (key: "bid" | "ask", value: string) =>
    setDepthSettings(unthemeMarketDepthSettings({ ...shown, colours: { ...shown.colours, [key]: value } }, theme));

<ColorPicker label="Bid" value={shown.colours.bid} onChange={(v) => setColour("bid", v)} />
<ColorPicker label="Ask" value={shown.colours.ask} onChange={(v) => setColour("ask", v)} />
<MarketDepthView source={source} symbol={symbol} settings={depthSettings} />
```

`GradientRampEditor` edits a colour ramp, such as the order-book heatmap's, with a draggable handle for each stop. It is the gradient field of the settings form and has no React wrapper.

<CenteredImageWrapper src={require("../_examples/dataSources_OrderBook/screenshot.png").default} title="Order Book (dummy data)" />

<CodeSnippetBlock labels={["TS", "React", "DummyDataExchange.ts"]}>
    ```ts showLineNumbers file=../_examples/dataSources_OrderBook/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/dataSources_OrderBook/react.tsx
    ```
    ```ts showLineNumbers file=../_examples/dataSources_OrderBook/DummyDataExchange.ts
    ```
</CodeSnippetBlock>

## Candle counter

`CandleCounter` shows the price pane's candle counts as "visible / loaded / ~total": the candles on screen, the candles loaded, and an estimate of every candle since the symbol was listed. Unknown counts show as "?". It updates as candles load and the user pans or zooms, at most once a frame, and writes its own text, so in React the page around it doesn't re-render as the chart moves.

It is made for the info area at the start of a pane's control bar ([Layout](/financial-charts/layout/#your-own-content-in-the-control-bar)):

```tsx
<SciFinanceChartView
    config={config}
    onInit={setChart}
    paneInfo={(paneId) =>
        paneId === PaneId.DEFAULT.value && chart ? <CandleCounter chart={chart.financeApi} /> : null
    }
/>
```

In plain TypeScript, `CandleCounter.create(financeChartPanel.getPaneInfoElement(PaneId.DEFAULT.value), { chart: financeChartPanel.financeApi })`. For the numbers alone, `countCandles(chart)` counts once, and `observeCandleCounts(chart, onChange)` reports them as they change and returns a function that stops it. The look is `.st-candle-counter`.

<CenteredImageWrapper src={require("../_examples/layoutState_Loading/screenshot.png").default} title="Loading States and Pane Info" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/layoutState_Loading/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/layoutState_Loading/react.tsx
    ```
</CodeSnippetBlock>

## Icons

The SciTrader app's toolbar and navigation icons, as SVG markup: `pencil`, `drawingList`, `fx`, `settings`, `target`, `bookmark`, `marketDepth`, `more` and `palette`. They fill with `currentColor`, so they take the text colour of the button they sit in. `bookmark`, `fx`, `settings`, `marketDepth` and `more` also have a "selected" look, filled with the theme's brand gradient (`--st-ui-brand-gradient-start` / `-end`).

```ts
button.innerHTML = sciTraderIconSvg("bookmark", { selected: true });
```

```tsx
<IconButton aria-label="Watchlist">
    <SciTraderIcon name="bookmark" selected={tab === "watchlist"} />
</IconButton>
```

The icons are hidden from assistive technology, so label the button instead. `SCITRADER_ICONS` holds each icon's natural size, `viewBox` and markup, for drawing them your own way. The `palette` icon's path is from Font Awesome Free (CC BY 4.0).

## Watchlist

The SDK has no watchlist component, because a watchlist's layout differs from app to app. It has the two parts that are hard to build:
- **`WatchListDataManager`** streams each symbol's last price and 24-hour change from the exchange's tickers, through `onDataUpdate`. It also prefetches the candles for the sparklines over one shared stream.
- **`SparkLineChart.createSpark`** draws a live sparkline into any element, from those prefetched candles and stream.

```tsx
// One manager for the list: prices arrive through onDataUpdate.
React.useEffect(() => {
    const wl = new WatchListDataManager({ exchangeName: BinanceExchange.name, onDataUpdate: setRows });
    wl.createFeeds(SYMBOLS);
    setManager(wl);
    return () => wl.delete();
}, []);

// In each row:
const prefetched = await manager.getSparklineData(symbol);
const { sciChartSurface } = await SparkLineChart.createSpark(hostRef.current, {
    exchangeName: BinanceExchange.name,
    instrument: symbol,
    interval: SPARKLINE_INTERVAL,
    candles: SPARKLINE_WINDOW_CANDLES,
    prefetchedCandles: prefetched?.candles,
    candleStream$: prefetched?.candleStream$,
});
// Delete the surface when the row unmounts: sciChartSurface.delete().
```

SciChart tracks surfaces by their element's `id`. `createSpark` gives an element without one a unique id; if you set ids yourself, keep them unique.

To show a symbol as a pair, `formatSymbolPair(symbol, exchangeName)` gives `BTC/USDT` for `BTCUSDT`, and `parseInstrument` the base and quote apart (for a coin icon, say). With an exchange name, the exchange's own symbol parser decides; without one, a `-` or `/` separator, then a common quote at the end (`USDT`, `USD`, `BTC`, …), which is a guess. A symbol that isn't recognisably a pair is returned unchanged, with a `null` quote.

<CenteredImageWrapper src={require("../_examples/components_Watchlist/screenshot.png").default} title="Watchlist" />

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../_examples/components_Watchlist/react.tsx
    ```
</CodeSnippetBlock>
