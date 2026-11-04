---
sidebar_position: 2
sidebar_label: Add Technical Indicators
title: "Add Technical Indicators to a Financial Chart | SciTrader.js"
description: "Add technical indicators such as RSI, MACD, moving averages and Bollinger Bands to a JavaScript or React financial chart with SciTrader.js, when the chart is created, at runtime, and from a searchable technical indicator picker."
keywords: ["SciTrader", "SciTrader.js", "technical indicators", "add technical indicators to chart", "add indicator to chart", "JavaScript trading chart indicators", "React stock chart indicators", "attachStudy", "detachStudy", "studyProvider", "indicator picker"]
---

# Add Technical Indicators to a Financial Chart

Technical indicators are studies (see [Technical Indicators and Studies](/financial-charts/studies-and-indicators/) for the full list). This page shows how to:

1. [add technical indicators when the chart is created](#add-indicators);
2. [add and remove them at runtime](#add-and-remove-at-runtime);
3. [build a technical indicator picker](#indicator-picker) from the SDK's catalogue, with search, categories and favourites.

Each has TypeScript and React examples with live CodePens.

## Adding Technical Indicators When the Chart Is Created {#add-indicators}

Pass the studies in the `studies` option, in the order they should draw. The first is usually `OHLCStudy`, which draws the price series:

```ts
import {
    BollingerBandsStudy, CandleInterval, CoinbaseExchange, OHLCStudy, RSIStudy,
    SciFinanceChartPanel, SMAStudy, VolumeStudy,
} from "scichart-scitrader";

const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: CoinbaseExchange.name,
    symbol: "BTC-USD",
    interval: CandleInterval.SIX_HOURS,
    period: "3M",
    studies: [
        new OHLCStudy(), // draws the price series
        new VolumeStudy(),
        // Overlays draw on the price pane
        new SMAStudy({ length: 50, renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } }),
        new BollingerBandsStudy({ period: 20, stdDev: 2 }),
        // Oscillators each get a pane of their own
        new RSIStudy({ length: 14, overbought: 70, oversold: 30 }),
    ],
});
```

- **Overlays** (moving averages, bands, channels, PSAR, VWAP, Ichimoku) share the price pane and its price axis.
- **Oscillators** (RSI, MACD and the rest) have their own scale, so the chart adds a pane for each one below the price pane. The price pane is three times the height of an indicator pane; to change that, use [`paneSizing`](/financial-charts/finance-chart-api/chart-config/#panesizing).
- **Constructor options** set a study's inputs (lengths, levels) and styles (colours, thickness). Options left out take their defaults; the [overview](/financial-charts/studies-and-indicators/#the-catalogue) lists each study's options. The user can change all of them later in the [Settings Form](/financial-charts/studies-and-indicators/altering-study-settings/).

In React, pass the same `studies` in the `config` of `SciFinanceChartView`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

## Adding and Removing Technical Indicators at Runtime {#add-and-remove-at-runtime}

`financeApi` is the chart's `SciFinanceChart`. Its `attachStudy` adds a study, and `detachStudy` removes one; an oscillator's pane goes with it.

```ts
import { EStudyType, MACDStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Create a study yourself...
const macd = new MACDStudy({ fast: 8, slow: 21 });
await chart.attachStudy(macd);

// ...or by type, with its default settings: what a study picker needs
const rsi = studyProvider.getStudy(EStudyType.RSI);
await chart.attachStudy(rsi);

chart.detachStudy(macd); // its pane goes with it
```

- **`chart.studies`** lists the attached studies. It returns a new array each time, so in React, putting it in state re-renders.
- **`chart.studiesChanged`** fires on every attach and detach, including when the user closes a study's pane from the chart.
- **`studyProvider.getStudy(type)`** creates any registered study, built-in or [your own](/financial-charts/studies-and-indicators/creating-custom-studies/), with its default settings. It is also how [Save and Restore](/financial-charts/save-and-restore/) recreates studies.
- **The pane limit.** The chart holds at most [`maxPanes`](/financial-charts/finance-chart-api/chart-config/#maxpanes) panes, 6 by default, counting the price pane. Past that, `attachStudy` refuses an oscillator and raises `paneLimitReached`, so you can tell the user. Overlays are never refused.

```ts
chart.studiesChanged.subscribe(() => console.log(chart.studies.map((study) => study.type)));
chart.paneLimitReached.subscribe(({ max, studyType }) => console.log(`${studyType} refused: at most ${max} panes`));
```

### SciFinanceChart Study Methods and Events

| Member | What it does |
| --- | --- |
| `attachStudy(study)` | Adds a study, and its pane if it needs one. Resolves when it has drawn |
| `detachStudy(study)` | Removes a study, and its pane if nothing else is in it |
| `studies` | The attached studies, in order |
| `studiesChanged` | Fires after any attach or detach. No payload: read `studies` |
| `maxPanes` | The most panes the chart holds, the price pane included. Default 6 |
| `paneLimitReached` | Fires when `attachStudy` refuses a study because of `maxPanes`, with `{ max, studyType }` |

<details>
<summary>SciFinanceChart.attachStudy, detachStudy, studies, studiesChanged, maxPanes and paneLimitReached, with their TSDoc</summary>

```ts
attachStudy(study: IStudy): Promise<void>;

detachStudy(study: IStudy): void;

get studies(): readonly IStudy[];

/**
 * Fires whenever a study is attached or detached. Consumers (e.g. the studies-management
 * drawer panel) subscribe to refresh their derived list. Carries no payload — subscribers
 * read {@link studies} directly.
 */
studiesChanged: EventHandler<void>;

/**
 * Maximum total number of chart panes (price pane + indicator panes).
 * {@link attachStudy} refuses a study that would create a NEW pane once
 * `chartPanes.size` has reached this value, raising {@link paneLimitReached}.
 * Overlay studies that share an existing pane are never affected.
 * Configurable via `ISciFinanceChartPredefinedStudiesOptions.maxPanes`.
 */
maxPanes: number;

/**
 * Fires when {@link attachStudy} refuses a study because adding it would
 * exceed {@link maxPanes}. Hosts subscribe to surface a "max panes reached"
 * notification. Carries the cap and the refused study's type.
 */
paneLimitReached: EventHandler<{
    max: number;
    studyType: EStudyType;
}>;
```

</details>

### The studyProvider Registry

`studyProvider` holds a factory for every registered study type. `getStudy(type, descriptor?, options?)` creates one, with the settings in `descriptor` if given (see [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/)), and returns `undefined` for an unknown type. `getStudies()` lists the registrations, including your own.

<details>
<summary>The StudyProvider class and the StudyRegistration type, with their TSDoc</summary>

```ts
declare class StudyProvider {
    studies: Map<string, StudyRegistration>;
    registerStudy(type: EStudyType | string, info: StudyRegistration): void;
    getStudies(): StudyRegistration[];
    getStudy(type: string, descriptor?: TStudyDescriptor, options?: IStudyOptions): IStudy | undefined;
}

const studyProvider: StudyProvider;

type StudyRegistration = {
    type: EStudyType;
    name: string;
    description: string;
    createStudy: (tempDescriptor?: TStudyDescriptor, options?: IStudyOptions) => IStudy;
};
```

</details>

### TypeScript Example: Adding and Removing Technical Indicators at Runtime

A BTC-USD chart from Coinbase, created with Volume, a 50-candle SMA, Bollinger Bands and RSI. Pick an indicator from the dropdown, built with `groupStudyMenuItems`, and click **Add indicator** to add it; click a chip to remove that indicator. `maxPanes` is 5 here, so adding a fifth oscillator shows the pane-limit message.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/studies_AddRemoveIndicators/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/studies_AddRemoveIndicators/vanilla.ts
    ```
</CodeSnippetBlock>

### React Example: Adding and Removing Technical Indicators at Runtime

The same chart in React. The chips come from React state, which `studiesChanged` keeps up to date.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="IndicatorsChart" name="../../_examples/studies_AddRemoveIndicators/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/studies_AddRemoveIndicators/react.tsx
    ```
</CodeSnippetBlock>

## Building a Technical Indicator Picker with STUDY_MENU_ITEMS {#indicator-picker}

`STUDY_MENU_ITEMS` is the SDK's catalogue of the studies a picker can offer, in display order. Each item has a `type` to pass to `studyProvider.getStudy`, a short `label` such as `"RSI"`, a `description` such as `"Relative Strength Index"`, and a `category`. Two helpers do a picker's work without its UI:

- **`filterStudyMenuItems(items, { query, category, isFavorite })`** narrows the list. The search matches labels, descriptions, categories and types, so `"average"`, `"bollinger"`, `"volatility"` and `"rsi"` all find what you'd expect. `isFavorite` keeps only the studies it returns `true` for, e.g. a user's favourites.
- **`groupStudyMenuItems(items)`** sorts the list into categories, in `STUDY_CATEGORY_ORDER`, A–Z within each.

```ts
import { filterStudyMenuItems, groupStudyMenuItems, STUDY_MENU_ITEMS } from "scichart-scitrader";

const matches = filterStudyMenuItems(STUDY_MENU_ITEMS, { query: "moving", category: "all" });
for (const { category, items } of groupStudyMenuItems(matches)) {
    console.log(category, items.map((item) => item.label)); // "Trend" ["EMA", "SMA", "WMA"]
}
```

To list [your own studies](/financial-charts/studies-and-indicators/creating-custom-studies/) too, add an `IStudyMenuItem` for each to the list you filter. The examples below leave out the order-book studies, because the built-in Coinbase exchange has no order-book source.

### The Study Catalogue API: STUDY_MENU_ITEMS, filterStudyMenuItems and groupStudyMenuItems

<details>
<summary>The IStudyMenuItem interface, EStudyCategory enum and STUDY_MENU_ITEMS, with their TSDoc</summary>

```ts
/**
 * Grouping shown in the Add Indicator pickers. Values double as the
 * display labels.
 */
enum EStudyCategory {
    Price = "Price & Chart Types",
    Trend = "Trend",
    Momentum = "Momentum",
    Volatility = "Volatility",
    Volume = "Volume",
    OrderBook = "Order Book"
}
/** Category display order in the pickers. */
const STUDY_CATEGORY_ORDER: readonly EStudyCategory[];
/** One entry in {@link STUDY_MENU_ITEMS}. */
interface IStudyMenuItem {
    type: EStudyType;
    label: string;
    description: string;
    category: EStudyCategory;
    disabled?: boolean;
}
/** Study types available in the Studies picker UI, in display order. */
const STUDY_MENU_ITEMS: IStudyMenuItem[];
```

</details>

<details>
<summary>filterStudyMenuItems, groupStudyMenuItems and the IStudyMenuFilter interface, with their TSDoc</summary>

```ts
/** A category to show, or every category. */
type TStudyCategoryFilter = EStudyCategory | "all";
/** Filter inputs for {@link filterStudyMenuItems}. */
interface IStudyMenuFilter {
    /** Free-text search. Whitespace-separated terms must all match. */
    query?: string;
    category?: TStudyCategoryFilter;
    /** When set, only items for which this returns true are kept (e.g. a favourites list). */
    isFavorite?: (type: string) => boolean;
}
/** One category's studies, as {@link groupStudyMenuItems} returns them. */
interface IStudyMenuGroup {
    category: EStudyCategory;
    items: IStudyMenuItem[];
}
/**
 * Narrow a study catalogue (`STUDY_MENU_ITEMS`) by category, search text and, optionally, a
 * favourites test: the logic of an "add indicator" picker, without the UI.
 *
 * Search is case-insensitive and matches the label, description, category and study type, so
 * "average", "bollinger", "volatility" and "rsi" all find what you'd expect. Every
 * whitespace-separated term must match somewhere, so "moving exp" picks out EMA.
 */
function filterStudyMenuItems(items: readonly IStudyMenuItem[], { query, category, isFavorite }: IStudyMenuFilter): IStudyMenuItem[];
/**
 * Sort studies into `STUDY_CATEGORY_ORDER` sections, A–Z by label within each. Empty sections are
 * left out.
 */
function groupStudyMenuItems(items: readonly IStudyMenuItem[]): IStudyMenuGroup[];
```

</details>

### TypeScript Example: A Technical Indicator Picker with Search, Categories and Favourites

A BTC-USD chart from Coinbase, with a technical indicator picker on the right:

- **Search** filters as you type: try "average", "volatility" or "oscillator".
- **The category dropdown** shows one category, or all of them.
- **Favourites only** shows the starred indicators. Click ☆ to star one.
- **Click an indicator** to add it to the chart. The picker shows how many of each are on the chart; close a pane to remove its indicator.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/studies_IndicatorPicker/vanilla" html={`<div style="display: flex; height: 100%"><div id="chart" style="flex: 1; min-width: 0"></div><div id="picker" style="width: 300px; overflow-y: auto"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/studies_IndicatorPicker/vanilla.ts
    ```
</CodeSnippetBlock>

### React Example: A Technical Indicator Picker with Search, Categories and Favourites

The same picker in React. The search text, category, favourites and the chart's studies are React state, and the list is filtered and grouped on each render.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="IndicatorPickerChart" name="../../_examples/studies_IndicatorPicker/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/studies_IndicatorPicker/react.tsx
    ```
</CodeSnippetBlock>

## Where to read next

- [Technical Indicators and Studies](/financial-charts/studies-and-indicators/): every indicator, with its options.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): let users change an indicator's settings.
- [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/): candlestick, Heikin-Ashi, Renko and Point & Figure charts.
- [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/): add an indicator of your own to the picker.
