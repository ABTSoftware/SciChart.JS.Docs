---
sidebar_position: 4
sidebar_label: Stop Loss / Take Profit
title: "Stop Loss and Take Profit: Draw Risk/Reward Zones on a JavaScript or React Chart | SciTrader.js"
description: "What stop-loss and take-profit levels are, how the risk/reward ratio is calculated, how traders use them, and how to draw stop-loss and take-profit zones on a JavaScript or React financial chart with SciTrader.js."
keywords: ["stop loss take profit", "risk reward ratio", "stop loss", "take profit", "risk reward JavaScript chart", "position size calculator", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Stop Loss and Take Profit in a JavaScript or React Financial Chart

A **stop loss** and a **take profit** are the prices where a trade is closed for a loss or a profit. Drawn on the chart, they show a trade's risk and reward at a glance. This page explains stop-loss and take-profit levels, how the risk/reward ratio is calculated and how traders use it, and shows how to draw stop-loss and take-profit zones on a JavaScript or React financial chart with SciTrader.js, with live examples you can edit in CodePen.

:::info
The Stop Loss / Take Profit tool is one of the 34 drawing tools in the SciTrader SDK. For the full list, with each tool's id, annotation class and number of points, see [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue). To add drawing tools with point and click or in code, see [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/).
:::

## What Are Stop Loss and Take Profit?

For a long trade (buying, expecting the price to rise):

- **The entry** is the price the trade is opened at.
- **The take profit** is a price above the entry, where the trade is closed with a profit.
- **The stop loss** is a price below the entry, where the trade is closed to limit the loss.

For a short trade, they are the other way round.

SciTrader's **Stop Loss / Take Profit** tool draws one zone from an entry. The first point is the entry; the second sets the zone's price and its width in time. **A zone above the entry is drawn green** (`takeProfitColor`) **and one below it red** (`stopLossColor`), so for a long trade, draw one zone up to the target and one down to the stop.

:::note
The colour follows the side of the entry, not the trade's direction. For a short trade, the take-profit zone is below the entry, so it is drawn red, and the stop-loss zone green.
:::

The **Measure** tool, in the same group, shows the price change, percentage change and number of candles between two points.

## How Is the Risk/Reward Ratio Calculated?

For a long trade, the reward is the distance from the entry to the target, and the risk the distance from the entry to the stop:

$$
\text{risk/reward} = \frac{\text{target} - \text{entry}}{\text{entry} - \text{stop}}
\qquad
\text{position size} = \frac{\text{amount at risk}}{\text{entry} - \text{stop}}
$$

A trade entered at 80,000 with a target of 84,800 and a stop at 77,600 risks 2,400 to make 4,800: a risk/reward of 2. Risking 1,000 on it, the position size is 1,000 / 2,400 ≈ 0.42 units.

:::tip
The tool draws the zones, but doesn't show the ratio. Use the **Measure** tool over each zone to read its size, in price and percent.
:::

## How to Use Stop Loss and Take Profit Levels

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Plan before entering.** Setting the stop and target first, and checking the ratio, keeps losing trades small.
- **A minimum ratio.** Many traders only take trades with a risk/reward of 2 or more, so a minority of winners can cover the losers.
- **Stops beyond structure.** A stop just past a swing low, a trend line or a multiple of the [ATR](/financial-charts/studies-and-indicators/add-indicators/atr-average-true-range/) sits outside normal noise.
- **Targets at levels.** Targets at earlier highs, [Fibonacci levels](/financial-charts/drawing-tools/add-drawing-tools/fibonacci-retracement/) or a channel's edge are where price often stalls.

## Drawing Stop Loss and Take Profit Zones with Point and Click

Start the tool with `selectTool`, from a button or the [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/). The user clicks the entry, then the target or stop:

```ts
import { ETradingAnnotationType } from "scichart-financial-tools";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
drawing.selectTool(ETradingAnnotationType.StopLossTakeProfitAnnotation);
```

## Adding Stop Loss and Take Profit Zones in Code {#in-code}

Create a `StopLossTakeProfitAnnotation` for each zone, with the entry and the target or stop as (time in seconds, price), and add them to the price pane:

```ts
import { Point } from "scichart";
import { StopLossTakeProfitAnnotation } from "scichart-financial-tools";
import { PaneId, registerDrawingTools } from "scichart-scitrader";

registerDrawingTools(); // once, at startup: so the chart lists and saves them

const entry = new Point(entryTime, 80000);
financeChartPanel.financeApi.chartPanes.get(PaneId.DEFAULT).surface.annotations.add(
    new StopLossTakeProfitAnnotation({ points: [entry, new Point(exitTime, 84800)], isEditable: true }), // take profit: green
    new StopLossTakeProfitAnnotation({ points: [entry, new Point(exitTime, 77600)], isEditable: true }) // stop loss: red
);
```

## How to Draw Stop Loss and Take Profit Zones on a JavaScript Financial Chart

A BTC-USD chart from Coinbase with a long trade added in code: entered at the close 30 candles ago, with a take-profit zone 6% above the entry and a stop-loss zone 3% below it, a risk/reward of 2. The buttons start the Stop Loss / Take Profit and Measure tools.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../../_examples/drawing_StopLossTakeProfit/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/drawing_StopLossTakeProfit/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Draw Stop Loss and Take Profit Zones on a React Financial Chart

The same chart in React. The drawing is added in `onInit`, once the chart has loaded its candles, and `useDrawingTools` gives the buttons their controller.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="StopLossTakeProfitChart" name="../../../_examples/drawing_StopLossTakeProfit/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/drawing_StopLossTakeProfit/react.tsx
    ```
</CodeSnippetBlock>

## StopLossTakeProfitAnnotation Options

| Option | What it does |
| --- | --- |
| `points` | Two points: the entry, then the target or stop. The second also sets the zone's width |
| `takeProfitColor` | The colour of a zone above the entry |
| `stopLossColor` | The colour of a zone below the entry |
| `fillOpacity` | The zone's fill opacity |
| `strokeThickness`, `strokeDashArray` | The zone's outline |
| `isEditable` | Whether the user can select, drag and edit it |

<details>
<summary>The StopLossTakeProfitAnnotation class, with its TSDoc</summary>

````ts
/**
 * @summary The {@link StopLossTakeProfitAnnotation} provides a {@link MultiPointAnnotationBase | multi-point annotation}
 * which draws a stop-loss or take-profit zone over the {@link SciChartSurface}.
 * @description
 * To add a {@link StopLossTakeProfitAnnotation} to a {@link SciChartSurface}, use the following code:
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const stopLossTakeProfitAnnotation = new StopLossTakeProfitAnnotation({
 *     points: [
 *          new Point(0, 5),  // can also be written as "{ x: 0, y: 5 }"
 *          new Point(10, 7)
 *     ],
 *     strokeThickness: 1,
 *     strokeDashArray: [4, 2],
 *     takeProfitColor: "#16A34A",
 *     stopLossColor: "#DC2626",
 *     fillOpacity: 0.18
 * });
 * sciChartSurface.annotations.add(stopLossTakeProfitAnnotation);
 * ```
 * The second point chooses the take-profit or stop-loss color.
 */
class StopLossTakeProfitAnnotation extends MultiPointAnnotationBase {
    readonly type: EAnnotationType;
    readonly surfaceTypes: ESurfaceType[];
    constructor(options?: IStopLossTakeProfitAnnotationOptions);
    get strokeThickness(): number;
    set strokeThickness(value: number);
    get strokeDashArray(): number[];
    set strokeDashArray(value: number[]);
    get takeProfitColor(): string;
    set takeProfitColor(value: string);
    get stopLossColor(): string;
    set stopLossColor(value: string);
    get fillOpacity(): number;
    set fillOpacity(value: number);
    delete(): void;
    onAttach(scs: SciChartSurface): void;
    drawWithContext(renderContext: IRenderContext2D, xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, seriesViewRect: Rect, surfaceViewRect: Rect, chartViewRect: Rect): void;
    onDpiChanged(args: TDpiChangedEventArgs): void;
    svgStringAdornerTemplate(): string;
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
}
````

</details>

<details>
<summary>The IStopLossTakeProfitAnnotationOptions interface, with its TSDoc</summary>

```ts
interface IStopLossTakeProfitAnnotationOptions extends IMultiPointAnnotationBaseOptions {
    strokeThickness?: number;
    strokeDashArray?: number[];
    takeProfitColor?: string;
    stopLossColor?: string;
    fillOpacity?: number;
}
```

</details>

## Where to read next

- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): the other drawing tools, point-and-click drawing and drawings in code.
- [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/): the quick-edit toolbar, the full editor and edit events.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): ready-made tools and list for users.
- [StopLossTakeProfitAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/stop-loss-take-profit/): every property and option, in the `scichart-financial-tools` docs.
