---
sidebar_position: 5
sidebar_label: Studies and Indicators
title: "Technical Indicators & Studies: Every Built-in Indicator | SciTrader.js"
description: "Every technical indicator in SciTrader.js trading charts: RSI, MACD, Bollinger Bands, Ichimoku, VWAP, Volume Profile and more, with their options and defaults, plus Heikin-Ashi, Renko and Point & Figure price charts."
keywords: ["SciTrader", "SciTrader.js", "technical indicators JavaScript", "RSI MACD chart", "Bollinger Bands JavaScript", "Ichimoku chart", "Heikin-Ashi Renko chart", "Point and Figure chart", "trading indicators"]
---

# Technical Indicators and Studies

Everything a SciTrader chart draws is a **study**. `OHLCStudy` draws the price series, `VolumeStudy` draws volume, and every technical indicator is a study too. SciTrader ships with 29 studies you can add from code or from a study picker, and you can write your own.

Studies come in two kinds:

- **Overlays**, such as moving averages, Bollinger Bands, Ichimoku and VWAP, draw on the price pane, against the price axis.
- **Oscillators**, such as RSI, MACD and Stochastic, have a scale of their own, so each gets a pane of its own below the price pane.

This section covers:

| Page | What it covers |
| --- | --- |
| [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/) | Candlestick, OHLC bar, line, mountain and Heikin-Ashi price series, and Renko and Point & Figure charts |
| [Add Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/) | Adding indicators when the chart is created, adding and removing them at runtime, and building an indicator picker |
| [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/) | Changing an indicator's settings (lengths, levels, colours) from code or with the ready-made Settings Form and Study List |
| [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/) | Writing an indicator of your own, step by step, with a settings form, live updates and save and restore |

## Every Built-in Indicator and Study {#the-catalogue}

The tables below list every study, grouped by the categories of the SDK's study picker (`EStudyCategory`). For each one:

- **Class** is the class to construct, e.g. `new RSIStudy({ length: 21 })`.
- **`EStudyType`** is the type to create it by, e.g. `studyProvider.getStudy(EStudyType.RSI)`.
- **Options** are its constructor options, with their defaults. Options left out take their defaults.

Every study also takes the [`IStudyOptions`](#istudyoptions) every study shares. Line studies take `renderOptions`, SciChart's `IFastLineRenderableSeriesOptions` (`stroke`, `strokeThickness`, `strokeDashArray`), for their line.

### Price and Chart Type Studies

| Indicator | Class | `EStudyType` | Draws on | Options (default) |
| --- | --- | --- | --- | --- |
| OHLC: Open-High-Low-Close | `OHLCStudy` | `OHLC` | Price pane | `candleType` (`ECandleType.Candlestick`), `renderOptions` |
| Renko | `RenkoStudy` | `Renko` | Own pane, category axis | `brickSize` (sized from the price range), `reversalAmount` (2) |
| Point & Figure | `PointAndFigureStudy` | `PointAndFigure` | Own pane, category axis | `boxSize` (sized from the price range), `reversalAmount` (3) |

See [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/).

### Trend Indicators

| Indicator | Class | `EStudyType` | Draws on | Options (default) |
| --- | --- | --- | --- | --- |
| SMA: Simple Moving Average | `SMAStudy` | `SMA` | Price pane | `length` (14), `renderOptions` |
| EMA: Exponential Moving Average | `EMAStudy` | `EMA` | Price pane | `length` (14), `renderOptions` |
| WMA: Weighted Moving Average | `WMAStudy` | `WMA` | Price pane | `length` (14), `renderOptions` |
| PSAR: Parabolic SAR | `PSARStudy` | `PSAR` | Price pane | `step` (0.02), `max` (0.2), `dotColor`, `pointSize` (5) |
| Ichimoku Cloud | `IchimokuCloudStudy` | `Ichimoku` | Price pane | `conversionPeriod` (9), `basePeriod` (26), `spanPeriod` (52), `displacement` (26), and a line style per line: `tenkanOptions`, `kijunOptions`, `senkouAOptions`, `senkouBOptions`, `chikouOptions`, `cloudFillOptions` |
| ADX: Average Directional Index | `ADXStudy` | `ADX` | Own pane | `length` (14), `adxColor`, `pdiColor`, `mdiColor`, `strokeThickness` |

### Momentum Indicators

| Indicator | Class | `EStudyType` | Draws on | Options (default) |
| --- | --- | --- | --- | --- |
| RSI: Relative Strength Index | `RSIStudy` | `RSI` | Own pane | `length` (14), `overbought` (70), `oversold` (30), `thresholdFills` (`"show"`), `overboughtFill`, `oversoldFill`, `renderOptions` |
| MACD: Moving Average Convergence/Divergence | `MACDStudy` | `MACD` | Own pane | `fast` (12), `slow` (26), `signal` (9), `bandOptions` (MACD and signal lines), `columnOptions`, `histogramAboveZero`, `histogramBelowZero` |
| Stochastic Oscillator | `StochasticStudy` | `Stochastic` | Own pane | `length` (14), `signalPeriod` (3), `strokeK`, `strokeD`, `strokeThickness` |
| CCI: Commodity Channel Index | `CCIStudy` | `CCI` | Own pane | `length` (20), `renderOptions` |
| Williams %R: Williams Percent Range | `WilliamsRStudy` | `WilliamsR` | Own pane | `length` (14), `renderOptions` |
| ROC: Rate of Change | `ROCStudy` | `ROC` | Own pane | `length` (12), `renderOptions` |
| TRIX: Triple EMA Oscillator | `TRIXStudy` | `TRIX` | Own pane | `length` (18), `renderOptions` |
| AO: Awesome Oscillator | `AwesomeOscillatorStudy` | `AO` | Own pane | `upColor`, `downColor` |

### Volatility Indicators

| Indicator | Class | `EStudyType` | Draws on | Options (default) |
| --- | --- | --- | --- | --- |
| BBANDS: Bollinger Bands | `BollingerBandsStudy` | `BBANDS` | Price pane | `period` (20), `stdDev` (2), `upperBandOptions`, `middleBandOptions`, `lowerBandOptions`, `bandFillOptions` |
| Keltner Channels | `KeltnerChannelsStudy` | `Keltner` | Price pane | `maPeriod` (20), `atrPeriod` (10), `multiplier` (2), `upperBandOptions`, `basisOptions`, `lowerBandOptions`, `bandFillOptions` |
| Donchian Channels | `DonchianChannelsStudy` | `Donchian` | Price pane | `period` (20), `upperBandOptions`, `basisOptions`, `lowerBandOptions`, `bandFillOptions` |
| ATR: Average True Range | `ATRStudy` | `ATR` | Own pane | `length` (14), `renderOptions` |

### Volume Indicators

| Indicator | Class | `EStudyType` | Draws on | Options (default) |
| --- | --- | --- | --- | --- |
| Volume | `VolumeStudy` | `Volume` | Price pane, along the bottom | `volumeUpColor`, `volumeDownColor`, `renderOptions` |
| Volume Profile: volume traded by price | `VolumeProfileStudy` | `VolumeProfile` | Price pane, as sideways bars | `binCount` (40), `rangeMode` (`"visible"`, or `"all"`), `side` (`"right"`), `widthFraction` (0.25), `showPointOfControl` (`true`), `pointOfControlColor` |
| VWAP: Volume Weighted Average Price | `VWAPStudy` | `VWAP` | Price pane | `renderOptions` |
| OBV: On Balance Volume | `OBVStudy` | `OBV` | Own pane | `renderOptions` |
| MFI: Money Flow Index | `MFIStudy` | `MFI` | Own pane | `length` (14), `renderOptions` |
| Force Index | `ForceIndexStudy` | `ForceIndex` | Own pane | `length` (13), `renderOptions` |

### Order Book Studies

These read an order-book feed, so they need an order-book data source (`IOrderBookSource`) registered for the chart's exchange. The built-in Coinbase and Binance exchanges don't provide one; see [Order-book data](/financial-charts/data-sources/#order-book-data).

| Indicator | Class | `EStudyType` | Draws on | Options (default) |
| --- | --- | --- | --- | --- |
| Order Book Heatmap: resting liquidity behind price | `OrderBookHeatmapStudy` | `OrderBookHeatmap` | Price pane | `side` (`"both"`, `"bid"` or `"ask"`), `palette` (`"liquidity"`), `opacity` (50), `scaleType` (`"log"`), `colorFromPct` (50), `colorToPct` (99), `stops` |
| Order Book Imbalance: bid versus ask depth, per candle | `OrderBookImbalanceStudy` | `OrderBookImbalance` | Own pane | `method` (`"weighted"`, `"band"` or `"percent"`), `pct` (0.3), `bidColor`, `askColor`, `fillStyle` (`"gradient"`), `gauge` (`"show"`) |

### Studies Outside the Study Picker

Three more studies aren't in the picker's catalogue (`STUDY_MENU_ITEMS`) or registered with `studyProvider`, because each needs an input you choose. Create them with `new`:

| Study | Class | Draws on | What it is for |
| --- | --- | --- | --- |
| Line | `LineStudy` | Price pane | Plots any data source as a line: pass its `DataSourceId` as `inputId` |
| Large trades | `LargeTradeStudy` | Price pane | Marks trades above `threshold` from a trade feed you create; `buyColor`, `sellColor` |
| Sparkline | `SparklineStudy` | Price pane | The small price chart in each row of a watchlist; see [Sparklines](/financial-charts/ui-components/sparklines/) |

### IStudyOptions: Options Every Study Takes {#istudyoptions}

| Option | What it does |
| --- | --- |
| `paneId` | The pane the study draws in. Leave it out for the study's own default: the price pane (`PaneId.DEFAULT`) for an overlay, a new pane for an oscillator |
| `themeColors` | Colours per theme, as the settings form records them when the user edits colours. Pass colours in the study's own options instead to use them in every theme |
| `chartPaneLayoutConfig`, `surfaceOptions` | Layout and SciChart surface options for a pane the study creates |

<details>
<summary>The IStudyOptions interface, with its TSDoc</summary>

```ts
/**
 * A study's colours per theme: theme name → colour-control name → colour. The key `"*"` holds
 * colours that apply in every theme. A theme without an entry draws the theme's own defaults.
 */
type TStudyThemeColors = Record<string, Record<string, string>>;
/** The {@link TStudyThemeColors} key for colours that apply in every theme. */
const ALL_THEMES_KEY = "*";
interface IStudyOptions {
    chartPaneLayoutConfig?: TPaneLayoutConfig;
    surfaceOptions?: I2DSurfaceOptions;
    paneId?: PaneId;
    /**
     * Colours chosen per theme, as saved with the chart. Written by the study itself as colours
     * are edited in its settings form, so a colour picked under the dark theme applies to the
     * dark theme only. Pass colours in the study's own constructor options instead to use them in
     * every theme.
     */
    themeColors?: TStudyThemeColors;
}
```

</details>

## Price Chart Types: Candlestick, Heikin-Ashi, Renko and Point & Figure {#candle-types}

The price series itself can be drawn in several ways:

- **Candlestick**, **OHLC bars**, **line** and **mountain** (area) charts;
- **Heikin-Ashi** candles, which average each candle with the one before to smooth out noise;
- **Renko** and **Point & Figure** charts, which plot price moves rather than time, each in a pane of its own.

The first five are candle types of the price study, switched with `setCandleType`. Renko and Point & Figure are studies. See [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/), with live examples.

## Where to read next

- [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/): candlestick, Heikin-Ashi, Renko and Point & Figure charts.
- [Add Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): add the indicators above, and add or remove them at runtime.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change their settings from code or with the Settings Form.
- [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/): write an indicator of your own.
- [Save and Restore](/financial-charts/save-and-restore/): studies and their settings are saved with the chart.
