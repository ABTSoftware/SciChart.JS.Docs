---
sidebar_position: 2
sidebar_label: The Saved JSON Format
title: "The Saved Chart JSON Format and Schema | SciTrader.js"
description: "The JSON a SciTrader.js trading chart saves: a real example, the schema of every field (data feed, studies and their settings, drawings, pane layout), editing a saved chart, chart templates and versioning."
keywords: ["chart JSON schema", "trading chart JSON format", "serialized chart state", "chart template JSON", "ISciFinanceChartPanelState", "save indicators JSON", "SciTrader.js"]
---

# The Saved JSON Format

`toJSON()` returns an `ISciFinanceChartPanelState`: plain JSON, with no classes or functions, so `JSON.stringify` saves it and `JSON.parse` reads it back. A chart with three studies and one drawing is about 8 KB.

## A Saved Chart {#example}

This is a real saved chart, shortened where marked: BTC-USD daily candles from Coinbase with Volume, a 20-period SMA, RSI in its own pane, and a Fibonacci retracement:

```jsonc
{
    "finance": {
        "exchangeName": "Coinbase",
        "symbol": "BTC-USD",
        "interval": "1d",
        "period": "6M",
        "liveTipMode": "follow",
        "studies": [
            {
                "type": "OHLC",
                "paneId": "default",
                "options": { "candleType": "Candlestick", "themeColors": {} /* … */ },
                "descriptor": { /* the candle colours and candle type, as in the SMA below */ }
            },
            { "type": "Volume", "paneId": "default" /* … */ },
            {
                "type": "SMA",
                "paneId": "default",
                "options": { "themeColors": {} /* … */ },
                "descriptor": {
                    "inputs": {
                        "controls": {
                            // Each setting, with its current value in "default"
                            "period": { "name": "period", "label": "Period", "type": "number", "default": "20" }
                        }
                    },
                    "styles": {
                        "controls": {
                            "strokeColor": { "name": "strokeColor", "label": "Stroke Color", "type": "color", "default": "#00AAFF" },
                            "strokeThickness": { "name": "strokeThickness", "label": "Stroke Thickness", "type": "number", "default": "3" },
                            "strokeStyle": { "name": "strokeStyle", "label": "Stroke Style", "type": "stroke-type", "default": "solid" }
                        }
                    }
                }
            },
            { "type": "RSI", "paneId": "RSI39c020ab-3a0b-493d-bdc7-e48c0d7c30fa" /* … */ }
        ],
        "annotations": {
            // The drawings, by pane
            "default": [
                {
                    "type": "FibonacciRetracementAnnotation",
                    "options": {
                        "id": "d255ba97-265e-4017-867f-114fa111ed89",
                        // Time in seconds, and price
                        "points": [
                            { "x": 1783478802.07, "y": 73104.95 },
                            { "x": 1790470086.77, "y": 80296.61 }
                        ],
                        "xCoordinateMode": "DataValue",
                        "yCoordinateMode": "DataValue"
                        /* … about 40 more style options */
                    }
                }
            ]
        },
        "visibleRanges": {
            "default": { "min": 1778025600, "max": 1793836800 }
            /* … one per pane */
        }
    },
    "layout": {
        "direction": "column",
        "axisSyncEnabled": true,
        "expandedId": null,
        "panes": [
            {
                "id": "default",
                "config": { "type": "chart", "sizeConfig": { "grow": 3 } /* … */ },
                "isVisible": true,
                "axisSynced": true,
                "verticalGroupId": "pane-group-vertical"
            },
            {
                "id": "RSI39c020ab-3a0b-493d-bdc7-e48c0d7c30fa",
                "config": { "type": "chart", "sizeConfig": { "grow": 1 } /* … */ },
                "isVisible": true,
                "axisSynced": true,
                "verticalGroupId": "pane-group-vertical"
            }
        ]
    },
    "useSubCharts": true
}
```

The example on the [Saving and Restoring](/financial-charts/save-and-restore/) page shows the full JSON of the chart you save.

## The Schema {#schema}

### ISciFinanceChartPanelState: the Whole Chart {#chart-state}

| ISciFinanceChartPanelState field | Type | Holds |
| --- | --- | --- |
| `finance` | [`ISciFinanceChartState`](#finance) | The data feed, studies, drawings and live-tip mode |
| `layout` | [`IPaneApiState`](#layout) | The panes: order, sizes, visibility, axis sync |
| `useSubCharts` | `boolean` | Sub-chart mode when saved |

### ISciFinanceChartState: Data, Studies and Drawings {#finance}

| Field | Type | Holds |
| --- | --- | --- |
| `exchangeName` | `string` | The exchange's registered name, e.g. `"Coinbase"`. It must be registered when the chart is restored |
| `symbol` | `string` | The symbol, in the exchange's format |
| `interval` | `CandleInterval` | The candle interval, e.g. `"1d"` |
| `period` | `TPeriod` | The selected period, e.g. `"6M"`, if one was |
| `liveTipMode` | `string` | `"follow"` or `"anchored"`: whether the chart follows new candles |
| `studies` | [`IStudyState[]`](#studies) | The studies, in the order they were attached |
| `annotations` | [`ISerializedAnnotation[]`](#drawings) for each pane | The drawings, keyed by pane id |
| `visibleRanges` | `IVisibleRangeState` for each pane | Each pane's X-axis range when saved, keyed by pane id. Not applied on restore |

### IStudyState: One Study {#studies}

| IStudyState field | Type | Holds |
| --- | --- | --- |
| `type` | `EStudyType` | The study type, e.g. `"RSI"`: `studyProvider` creates the study from it |
| `paneId` | `string` | Its pane: `"default"` for the price pane, or the pane's id |
| `options` | `IStudyOptions` | Its pane placement, and colours picked per theme (`themeColors`) |
| `descriptor` | `TStudyDescriptor` | Its settings: each input and style control, with the current value in `default`. See [Descriptors](/financial-charts/studies-and-indicators/altering-study-settings/#descriptors) |

A study pane's id is generated (`"RSI39c0…"`) unless the study was given a `paneId`; see [Pane Ids](/financial-charts/sci-finance-chart/pane-sizes-and-state/#pane-ids).

### ISerializedAnnotation: One Drawing {#drawings}

| ISerializedAnnotation field | Type | Holds |
| --- | --- | --- |
| `type` | `string` | The annotation type, e.g. `"FibonacciRetracementAnnotation"`. It must be registered when restored |
| `options` | `object` | The drawing's options: its `points`, as time in seconds and price, and its style |

### IPaneApiState: the Pane Layout {#layout}

| IPaneApiState field | Type | Holds |
| --- | --- | --- |
| `direction` | `"column"` or `"row"` | Panes stacked, or side by side |
| `axisSyncEnabled` | `boolean` | Whether the panes' X axes move together |
| `expandedId` | `string` or `null` | The maximised pane, if one is |
| `panes` | `array` | Each pane, in order: its `id`, `isVisible`, its size (`size`, or `config.sizeConfig`), and its axis sync and group membership |

## Editing a Saved Chart {#editing}

Saved state is plain data, so you can change it before restoring:

```ts
// Open the user's layout on another symbol: a chart template
const template = { ...saved, finance: { ...saved.finance, symbol: "ETH-USD" } };

// The same studies and layout, without the drawings, which belong to the old symbol's prices
const clean = { ...template, finance: { ...template.finance, annotations: {} } };

const chart = await SciFinanceChartPanel.fromJSON(element, clean, { useSubCharts: clean.useSubCharts });
```

- **A template** is a saved chart applied to any symbol: save one layout of studies and panes, then open each symbol with it.
- **Drop the drawings** when changing symbol: they are anchored to prices.
- **Keep the pane ids** as they are: each study's `paneId` must match a pane in `layout.panes`.

## Versions {#versions}

The format has no version number of its own. New fields are added as optional, and a state saved without them restores with their defaults. Still, a saved state can outlive your app's code, e.g. a study you no longer register. So:

- **Store it inside an envelope with your own version:** `{ version: 1, savedAt, state }`. When your app can't restore older saves, change the version, and ignore saves with another one.
- **Restore inside `try … catch`,** and on failure discard the save and start a new chart; see [Loading Saved State Safely](/financial-charts/save-and-restore/storage-and-servers/#loading-safely).

## JSON Schema API {#api}

<details>
<summary>The ISciFinanceChartPanelState and ISciFinanceChartState interfaces, with their TSDoc</summary>

```ts
/**
 * A whole chart's saved state: what `toJSON()` returns and `fromJSON()` restores.
 *
 * Saved and restored:
 * - The data feed (exchange, symbol, interval, period) and the live-tip mode.
 * - Every study, with its pane and its settings.
 * - The drawings.
 * - The pane layout: direction, order, sizes, hidden and maximised panes, axis sync and groups.
 * - Sub-chart mode.
 *
 * Saved but not applied on restore: the zoom and pan position, `finance.visibleRanges`.
 * The restored chart opens on its period, or on the latest data.
 */
interface ISciFinanceChartPanelState {
    /** The chart: data feed, studies, drawings and live-tip mode. */
    finance: ISciFinanceChartState;
    /** The pane layout: order, sizes, visibility and coordination. */
    layout: IPaneApiState;
    /**
     * Sub-chart mode when saved. Pass it to `fromJSON` (or `useSubCharts` in React), so the
     * restored chart uses the same mode.
     */
    useSubCharts?: boolean;
}

/** Serialized state of a SciFinanceChart — data feed config + attached studies + chart UI state. */
interface ISciFinanceChartState {
    /** Exchange name (e.g. "Binance"). */
    exchangeName: string;
    /** Trading symbol (e.g. "BTCUSDT"). */
    symbol: string;
    /** Candle interval (e.g. "1d"). */
    interval: CandleInterval;
    /**
     * Currently-selected preset period (e.g. `"3M"`). Optional — when present,
     * `fromJSON` calls `setPeriod(period)` after restoring the rest of the state,
     * so the visible range matches what the user had selected at time.
     * Older serialized state without this field restores as if no period was set.
     */
    period?: TPeriod;
    /** Attached studies in order. */
    studies: IStudyState[];
    /**
     * Each pane's X-axis visible range when saved, keyed by pane id. Saved, but not applied on
     * restore: the restored chart opens on its period, or on the latest data.
     */
    visibleRanges?: Record<string, IVisibleRangeState>;
    /**
     * Per-pane drawing annotations, keyed by `paneId.value`. Each annotation is captured
     * via SciChart's typed-serialization framework (`type` registered in `registerType`,
     * options captured by `annotation.toJSON()`). Restored via `createType`.
     */
    annotations?: Record<string, ISerializedAnnotation[]>;
    /**
     * Live-tip slide policy in effect when the state was serialized. Optional —
     * older exports omit it and `fromJSON` falls back to the chart's default
     * (`"follow"`). Restored before `setPeriod` so any chained pan/zoom math
     * sees the right mode.
     */
    liveTipMode?: "follow" | "anchored";
}

/** A pane's saved X-axis visible range. */
interface IVisibleRangeState {
    min: number;
    max: number;
}
```

</details>

<details>
<summary>The IStudyState and ISerializedAnnotation interfaces, with their TSDoc</summary>

```ts
/** Serialized state of a single study — enough to reconstruct it via StudyProvider. */
interface IStudyState {
    /** Study type (e.g. "RSI", "MACD"). Used to look up the factory in StudyProvider. */
    type: EStudyType;
    /** The pane this study is in: "default" for the price pane, or the pane's id. */
    paneId: string;
    /** Study-specific options passed to the constructor. */
    options?: IStudyOptions;
    /**
     * The study's inputs and styles (period, colours, thickness) as {@link IStudy.getDescriptor}
     * reports them, each control's current value in `default`. This carries the user's edits
     * across a reload. Optional: a study saved without it restores at its defaults.
     */
    descriptor?: TStudyDescriptor;
}

/**
 * One saved drawing: its annotation type and its options, as `annotation.toJSON()` gives them.
 * Its `points` are in data values: time in seconds and price, so it stays on the same candles.
 */
interface ISerializedAnnotation {
    /** Registered type identifier — `EAnnotationType` for SciChart built-ins, or a project-registered string from {@link registerDrawingTools} (e.g. "PolyLineAnnotation"). */
    type: string;
    /** Constructor options captured from the live annotation. Extends SciChart's {@link IAnnotationBaseOptions} with any per-type extras. */
    options: IAnnotationBaseOptions & Record<string, unknown>;
}
```

</details>

<details>
<summary>The IPaneApiState and IPaneCoordinationIntent interfaces, with their TSDoc</summary>

```ts
/** Serialized pane state produced by {@link IPaneApi.toJSON} and consumed by {@link IPaneApi.fromJSON}. */
interface IPaneApiState {
    direction: LayoutDirection;
    axisSyncEnabled: boolean;
    expandedId: LayoutPaneId | null;
    panes: Array<{
        id: LayoutPaneId;
        config: IPaneConfig;
        isVisible: boolean;
        size?: number;
    } & IPaneCoordinationIntent>;
    /** Not included in a finance chart's state: the chart sets up its own panes. */
    chartCoordination?: IChartDashboardConfig;
}

/** Serialized per-pane coordination intent. Stored alongside each pane in {@link IPaneApiState}. */
interface IPaneCoordinationIntent {
    /** Whether this pane's axis should be synchronized when visible. */
    axisSynced?: boolean;
    /** Vertical group ID this pane belongs to (column mode alignment). */
    verticalGroupId?: string;
    /** Horizontal group ID this pane belongs to (row mode alignment). */
    horizontalGroupId?: string;
}
```

</details>

## Where to read next

- [Saving to Your Own Storage or Server](/financial-charts/save-and-restore/storage-and-servers/): where to keep it, and auto-saving.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): the descriptors saved with each study.
