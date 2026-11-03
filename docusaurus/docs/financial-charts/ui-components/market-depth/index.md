---
sidebar_position: 9
sidebar_label: Market Depth
title: "MarketDepthPanel and MarketDepthView: Order Book Ladder | SciTrader.js"
description: "Show a live order book as a market-depth price ladder next to a SciTrader.js trading chart, with MarketDepthPanel or the React MarketDepthView, fed from Coinbase or your own IOrderBookSource."
keywords: ["SciTrader", "SciTrader.js", "MarketDepthPanel", "MarketDepthView", "order book", "market depth", "depth ladder", "DOM ladder", "React order book"]
---

# Market Depth

`MarketDepthPanel` shows the live book as a price ladder: asks above the spread, bids below, each rung with its amount and the running total, and a depth bar behind it. It is drawn with SciChart, so it keeps up with a fast book. The header has the symbol and a ± stepper for the price grouping, and pointing at a rung shows what sweeping the book to that price would cost (see [Slippage Readout](#slippage-readout)).

The panel reads the book from an **`IOrderBookSource`**: an object that gives it a snapshot of the book and a live stream of updates for a symbol. The examples below implement a small one for Coinbase's public order book, which needs no API key. To feed it from your own server or exchange, implement the same interface; see [Order-book data](/financial-charts/data-sources/#order-book-data).

## TypeScript Example: Market Depth with Coinbase Order Book Data

A one-minute chart of BTC-USD, with the live Coinbase order book in a `MarketDepthPanel` beside it. `CoinbaseOrderBookSource`, in the code, connects to Coinbase's public WebSocket feed, keeps the book in memory, and sends the panel the top of the book four times a second. Use the ± stepper in the panel's header to change the price grouping, and point at a rung to see what sweeping the book to it would cost.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/components_MarketDepth/vanilla" html={`<div style="display: flex; height: 100%"><div id="chart" style="flex: 1; min-width: 0"></div><div id="depth" style="width: 340px"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_MarketDepth/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Market Depth with Coinbase Order Book Data

The same in React, with `MarketDepthView` from `scichart-scitrader-react`. It keeps the panel's settings in React state, so the grouping chosen with the ± stepper can be saved.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="ChartWithMarketDepth" name="../../_examples/components_MarketDepth/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_MarketDepth/react.tsx
    ```
</CodeSnippetBlock>

## MarketDepthPanel and MarketDepthView {#marketdepthpanel}

```ts
import { MarketDepthPanel, SCITRADER_LIGHT_THEME } from "scichart-scitrader";

const panel = MarketDepthPanel.create(document.getElementById("depth"), {
    source: new CoinbaseOrderBookSource(), // any IOrderBookSource
    symbol: "BTC-USD",
    settings: loadSavedSettings(), // optional; DEFAULT_MARKET_DEPTH_SETTINGS otherwise
    onSettingsChange: saveSettings, // the stepper changed the grouping
});

panel.setSymbol("ETH-USD"); // re-points the book; nothing is rebuilt
panel.setTheme(SCITRADER_LIGHT_THEME); // restyles the panel
panel.destroy(); // when the page goes away
```

In React, `MarketDepthView` from `scichart-scitrader-react` mounts it, with the same options as props and the theme from `SciTraderThemeProvider`:

```tsx
<MarketDepthView source={source} symbol={symbol} settings={settings} onSettingsChange={setSettings} />
```

-   **Settings** (`TMarketDepthSettings`) cover the refresh rate, the pulled-wall rule, the grouping, the row height, fonts, flash duration and colours. Model settings apply to the running book; a change to how the ladder is drawn rebuilds its surface. Settings are theme-neutral, so they are safe to persist; see [Styling → Market depth](/financial-charts/styling-and-themes/#market-depth).
-   **No settings dialog ships.** Pass `onSettingsClick` and the header shows a cog that calls it. The SciTrader app opens its own dialog there, reading `panel.themedSettings` and `panel.availableGroupings()`, with a [`ColorPicker`](/financial-charts/ui-components/colour-picker/) for each colour; see [Recolouring the Ladder](#recolouring-the-ladder).
-   **Rows.** By default the row count follows the panel's height and the row height. Pass `rows` for a fixed count.

<details>
<summary>The MarketDepthPanel class and IMarketDepthPanelOptions, with their TSDoc</summary>

```ts
class MarketDepthPanel {
    /** The panel element, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    /** The headless model, for a host that wants the rows themselves. */
    readonly ladder: MarketDepthLadder;
    static create(container: HTMLElement, options: IMarketDepthPanelOptions): MarketDepthPanel;
    /** The settings as the host should persist them: colours at their defaults follow the theme. */
    get settings(): TMarketDepthSettings;
    /** The settings as drawn under the current theme — what a settings dialog should show. */
    get themedSettings(): TMarketDepthSettings;
    /** The symbol the panel shows. */
    get symbol(): string;
    /** Every grouping the current instrument can be read at, finest first, for a settings dialog. */
    availableGroupings(): Array<{
        step: number;
        binSize: number;
    }>;
    /**
     * The grouping step the ladder is actually using. Differs from `settings.groupingStep` when
     * the stored preference is out of range on this instrument.
     */
    get groupingStep(): number;
    /**
     * Applies theme-neutral settings. Model settings apply in place; a change to how the surface
     * is drawn rebuilds it, keeping the book.
     */
    setSettings(settings: TMarketDepthSettings): void;
    /** Restyles the panel: its CSS variables, and every colour the settings leave to the theme. */
    setTheme(theme: ISciTraderTheme): void;
    /** Re-points the panel at another instrument. Nothing is rebuilt. */
    setSymbol(symbol: string): Promise<void>;
    /** Turns the slippage readout on or off. Rebuilds the surface. */
    setSweepReadout(enabled: boolean): void;
    destroy(): void;
}

interface IMarketDepthPanelOptions {
    source: IOrderBookSource;
    symbol: string;
    /** Levels per side to request from the source. */
    depth?: number;
    /**
     * Rows per side. Left unset, the count follows from the panel's height and the row height
     * setting, so a taller panel shows more of the book.
     */
    rows?: number;
    /** Theme-neutral settings, e.g. as the host persisted them. Default {@link DEFAULT_MARKET_DEPTH_SETTINGS}. */
    settings?: TMarketDepthSettings;
    /** Default `SCITRADER_DARK_THEME`. */
    theme?: ISciTraderTheme;
    /**
     * Show what sweeping the book to the hovered rung would cost. Default true. A mouse raises
     * it by hovering; a finger by a long press, and it goes when the finger lifts.
     */
    sweepReadout?: boolean;
    /**
     * Called when the panel changes the settings itself — the ± stepper moves the grouping —
     * with the new theme-neutral settings, for the host to persist.
     */
    onSettingsChange?: (settings: TMarketDepthSettings) => void;
    /** When set, the header shows a settings cog that calls this. */
    onSettingsClick?: () => void;
}
```

</details>

<details>
<summary>The React MarketDepthView and its props, with their TSDoc</summary>

```ts
/** Props for {@link MarketDepthView}. */
interface IMarketDepthViewProps extends Omit<IMarketDepthPanelOptions, "theme"> {
    /** Called once the panel is created, with the vanilla `MarketDepthPanel`. */
    onInit?: (panel: MarketDepthPanel) => void;
    className?: string;
    /** Styles for the host element, which fills its parent by default. */
    style?: React.CSSProperties;
}

/**
 * The SDK's market-depth panel in React: the vanilla `MarketDepthPanel`, mounted into a `<div>`
 * and cleaned up on unmount. It follows the theme from `SciTraderThemeProvider`.
 *
 * `symbol`, `settings` and `sweepReadout` update the panel in place. Changing `source`, `depth`
 * or `rows`, or whether `onSettingsClick` is set, creates a new one.
 *
 * ```tsx
 * const [settings, setSettings] = React.useState(DEFAULT_MARKET_DEPTH_SETTINGS);
 *
 * <MarketDepthView
 *     source={getOrderBookSource("Binance")}
 *     symbol="BTCUSDT"
 *     settings={settings}
 *     onSettingsChange={setSettings}
 * />
 * ```
 */
function MarketDepthView({ source, symbol, depth, rows, settings, sweepReadout, onSettingsChange, onSettingsClick, onInit, className, style, }: IMarketDepthViewProps): JSX.Element;
```

</details>

<details>
<summary>The market-depth settings types, with their TSDoc</summary>

```ts
/** Settings the running ladder model can take without being rebuilt. */
interface IDepthModelSettings {
    /**
     * How often the ladder republishes, in Hz.
     *
     * A ceiling, not a target: the book is published by the server at its own rate and this
     * drops frames above the limit. It cannot raise the rate past what the server sends.
     */
    refreshHz: number;
    /**
     * How large a level must have been, as a quantile of its own side, to count as a wall.
     *
     * Raising it marks fewer, larger events. Lowering it past about 0.9 starts catching ordinary
     * top-of-book churn, which is what made the highlight useless before it was measured.
     */
    wallPercentile: number;
    /** How much of itself a wall must lose to count as pulled. 0.1 means "at least 90% gone". */
    pulledFraction: number;
    /**
     * Price grouping, as notches from the instrument's own tick — the ± stepper's position.
     *
     * Stored as an OFFSET rather than as a price, because a price is meaningless on another
     * instrument: 0.01 is the finest possible grouping on BTC-USD and absurdly coarse on a pair
     * quoted in millionths. A notch offset means the same thing on both, so one stored preference
     * carries across every symbol.
     */
    groupingStep: number;
}

/** Settings that describe how the surface is built. Changing one rebuilds it. */
interface IDepthViewSettings {
    /**
     * Height of one rung in CSS pixels.
     *
     * The row COUNT follows from this and the panel's height rather than being set directly —
     * which is what makes a taller drawer show more of the book instead of the same rungs
     * stretched further apart.
     */
    rowHeightPx: number;
    /** Cell text size in points. */
    cellFontSize: number;
    /** Column-heading text size in points. */
    headerFontSize: number;
    /** How long a pulled rung takes to fade out, in ms. */
    flashMs: number;
    colours: IDepthColours;
}

interface IDepthColours {
    /** Bid and ask price text. */
    bid: string;
    ask: string;
    /** The depth bars behind each side. Alpha is part of the value — they sit under the text. */
    bidBar: string;
    askBar: string;
    /** A rung whose wall was just pulled. */
    flash: string;
    /** Cell text, and the quieter text used for the totals column and headings. */
    text: string;
    muted: string;
    /** Rules between rungs. */
    gridLine: string;
    /** Wash over the rungs the pointer would sweep, and the edge line at its far end. */
    highlight: string;
    highlightEdge: string;
}

type TMarketDepthSettings = IDepthModelSettings & IDepthViewSettings;

const DEFAULT_MARKET_DEPTH_SETTINGS: TMarketDepthSettings;
```

</details>

### Slippage Readout {#slippage-readout}

The slippage readout shows what sweeping the book to the hovered price would cost. It is on by default; turn it off with `sweepReadout: false` or `panel.setSweepReadout(false)`. It follows the input device, so the page doesn't need to detect phones or tablets:
-   **Mouse or pen:** hovering a rung shows it, and it goes when the pointer leaves the ladder.
-   **Touch:** hold a finger on a rung for 450 ms. The device vibrates briefly where the browser supports it (not iOS). Drag to move between rungs, and lift the finger to hide it. A finger that moves more than 10 px before the hold completes is treated as a scroll or swipe, and a second finger cancels it.
-   **Placement:** beside the panel on its left when there is room; otherwise, as on a phone, inside the panel on the half away from the finger, and kept on screen.
-   The ladder sets `touch-action: none` and turns off the iOS long-press text selection and callout, so the hold isn't taken by the browser.

### Recolouring the Ladder {#recolouring-the-ladder}

The settings' colours follow the theme while they are at their defaults. To let the user change them, show `panel.themedSettings` (the colours as drawn) in a `ColorPicker`, and store an edit theme-neutral again with `unthemeMarketDepthSettings`:

```tsx
import { themeMarketDepthSettings, unthemeMarketDepthSettings } from "scichart-scitrader";
import { ColorPicker, MarketDepthView } from "scichart-scitrader-react";

// Saved settings are theme-neutral: a colour left at its default follows the theme. Show the
// colours as drawn under the current theme, and store an edit theme-neutral again
const shown = themeMarketDepthSettings(depthSettings, theme);
const setColour = (key: "bid" | "ask", value: string) =>
    setDepthSettings(unthemeMarketDepthSettings({ ...shown, colours: { ...shown.colours, [key]: value } }, theme));

<ColorPicker label="Bid" value={shown.colours.bid} onChange={(v) => setColour("bid", v)} />
<ColorPicker label="Ask" value={shown.colours.ask} onChange={(v) => setColour("ask", v)} />
<MarketDepthView source={source} symbol={symbol} settings={depthSettings} />
```

See [Styling → Market depth](/financial-charts/styling-and-themes/#market-depth).

### The Headless Ladder: MarketDepthLadder {#marketdepthladder}

`MarketDepthLadder` is the headless model underneath, for a host that wants to render the rows itself: `subscribe` delivers `IDepthLadder` (bids, asks, mid, spread, grouping) on every book update.

## The Order-Book Source: IOrderBookSource {#iorderbooksource}

The panel needs two of the source's methods: `getBookSnapshot` and `getBookStream`. The other three serve the order-book heatmap, and a source without one can answer `{ enabled: false }`, `null` and an empty stream, as `CoinbaseOrderBookSource` does. `getBookStream` should be throttled by the source: the panel redraws a few times a second, and has no use for every change on the exchange.

<details>
<summary>IOrderBookSource, IBookSnapshot, IBookUpdate and IBookLevel, with their TSDoc</summary>

```ts
interface IOrderBookSource {
    readonly exchangeName: string;
    /** Current top-N, or null when no synced book exists for the instrument. */
    getBookSnapshot(symbol: string, depth?: number): Promise<IBookSnapshot | null>;
    /**
     * Live ladder: one snapshot, then merges. Throttled by the source — the depth panel redraws
     * at a few hertz and has no use for raw exchange cadence.
     */
    getBookStream(symbol: string, depth?: number): Observable<IBookUpdate>;
    /**
     * Which heatmap tiers exist for an instrument, and from when. A source with no heatmap
     * answers `{ enabled: false }`, which the study shows as such rather than as an empty chart.
     */
    getHeatmapAvailability(symbol: string): Promise<IHeatmapAvailability>;
    /**
     * One tile of one tier. Null when that tier is not recorded for the instrument, or the
     * heatmap is switched off, which the study draws as nothing rather than as an error.
     */
    getHeatmapTile(symbol: string, bucket: string, tile: number): Promise<IHeatmapTile | null>;
    /** New columns at one tier: each bucket as it closes, and the open one as it fills. */
    getDepthStream(symbol: string, bucket: string): Observable<IDepthColumn>;
}

/** Top-N of both sides at a moment in time. Bids descend, asks ascend. */
interface IBookSnapshot {
    symbol: string;
    timestamp: number;
    bids: IBookLevel[];
    asks: IBookLevel[];
}

/**
 * An incremental ladder change. Levels with `qty === 0` are removals — including levels that
 * merely fell out of the requested depth, which from a ladder's point of view is the same event.
 */
interface IBookUpdate extends IBookSnapshot {
    /** True when this frame replaces the ladder rather than merging into it. */
    isSnapshot: boolean;
}

interface IBookLevel {
    price: number;
    /** Zero means the level is gone. Never a level of size zero. */
    qty: number;
}
```

</details>

[Order-book data](/financial-charts/data-sources/#order-book-data) covers the whole interface, including the heatmap, with a randomised source to adapt.

## Styling the Market Depth Panel {#styling}

The panel's header and readout are HTML, with the classes `st-market-depth`, `__header`, `__title`, `__grouping`, `__step`, `__grouping-value`, `__settings` and `__body`, and the readout's `__sweep` (`--bid` / `--ask`), `__sweep-head`, `__sweep-rows` and `__sweep-foot`. The ladder itself is drawn with SciChart, so its colours, fonts and row height are settings, not CSS. See [Styling and Themes](/financial-charts/styling-and-themes/#market-depth).

#### See also

- [Order-book data](/financial-charts/data-sources/#order-book-data)
- [Colour Picker](/financial-charts/ui-components/colour-picker/)
