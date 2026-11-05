# Financial Charts: Technical Indicator Pages Plan

Which technical indicator pages to add to the SciTrader.js docs (Studies and Indicators > Add Technical Indicators), ranked by search volume. Each page follows the same template: what the indicator is, how it is calculated, how to read it, and how to add it to a JavaScript and a React financial chart, with live TypeScript and React examples.

- **Source:** Ahrefs Keywords Explorer, queried 2026-11-05. **Global volume** is monthly searches across all countries; **KD** is Ahrefs' keyword difficulty (0 to 100, lower is easier to rank for).
- **Totals** add an indicator's keyword variants together. Variants overlap, so treat totals as a rough guide for ranking, not as traffic.
- Left out on purpose: "tradingview alternative" and "candlestick chart", which SciChart already ranks for elsewhere.

## Published: Batch 1

| Status | Indicator | Study | Keywords (global volume, KD) | Total | Page |
| --- | --- | --- | --- | --- | --- |
| Done | MACD | `MACDStudy` | macd 69,000 (KD 55), macd indicator 14,000 (KD 46) | ~83.0k | `/financial-charts/studies-and-indicators/add-indicators/macd/` |
| Done | RSI (Relative Strength Index) | `RSIStudy` | rsi indicator 25,000 (KD 53), relative strength index 13,000 (KD 65) | ~38.0k | `/financial-charts/studies-and-indicators/add-indicators/rsi-relative-strength-index/` |
| Done | Moving Averages (SMA, EMA, WMA) | `SMAStudy`, `EMAStudy`, `WMAStudy` | moving average 21,000 (KD 47), exponential moving average 6,500 (KD 61), simple moving average 3,300 (KD 11), weighted moving average 1,500 (KD 7) | ~32.3k | `/financial-charts/studies-and-indicators/add-indicators/moving-averages-sma-ema-wma/` |
| Done | Bollinger Bands | `BollingerBandsStudy` | bollinger bands 26,000 (KD 63) | ~26.0k | `/financial-charts/studies-and-indicators/add-indicators/bollinger-bands/` |

## Published: Batch 2

| Status | Indicator | Study | Keywords (global volume, KD) | Total | Notes |
| --- | --- | --- | --- | --- | --- |
| Done | VWAP (Volume Weighted Average Price) | `VWAPStudy` | vwap 40,000 (KD 10), vwap indicator 9,200 (KD 12), volume weighted average price 1,600 (KD 1) | ~50.8k | Biggest after MACD, and low difficulty. `VWAPStudy` anchors at the first loaded candle, with no session reset (SCT-926) |
| Done | Ichimoku Cloud | `IchimokuCloudStudy` | ichimoku cloud 6,800 (KD 28), ichimoku 6,300 (KD 33), ichimoku indicator 1,000 (KD 0) | ~14.1k | High volume, moderate difficulty |
| Done | Volume Profile | `VolumeProfileStudy` | volume profile 9,000 (KD 6), volume profile indicator 2,800 (KD 0) | ~11.8k | Almost no competition; sets SciTrader apart |
| Done | ADX (Average Directional Index) | `ADXStudy` | adx indicator 10,000 (KD 36), average directional index 1,400 (KD 0) | ~11.4k |  |
| Done | ATR (Average True Range) | `ATRStudy` | average true range 5,100 (KD 48), atr indicator 4,400 (KD 36) | ~9.5k | Higher difficulty |
| Done | Stochastic Oscillator | `StochasticStudy` | stochastic oscillator 5,700 (KD 34), stochastic indicator 3,100 (KD 29) | ~8.8k | Not "stochastic rsi" (1,800): a different indicator SciTrader doesn't have |

## Known SDK Gaps Found While Writing the Pages

The pages describe what the SDK does today. When these are fixed, update the pages each ticket lists.

| Ticket | Type | What |
| --- | --- | --- |
| SCT-925 | Bug | Indicator studies ignore live ticks: values for candles formed live are calculated from each candle's first tick |
| SCT-926 | Feature | VWAP: session and anchored VWAP, instead of anchoring at the first loaded candle |
| SCT-927 | Feature | ADX and Stochastic level lines, slow stochastic, Volume Profile value area, Ichimoku forward cloud in view |
| SCT-923 | Feature | Indicators on indicators (e.g. an SMA of the RSI) |
| SCT-924 | Task | A simpler, typed API for changing a study's settings from code |

## Later: Low-Difficulty Quick Wins

| Status | Indicator | Study | Keywords (global volume, KD) | Total | Notes |
| --- | --- | --- | --- | --- | --- |
| To do | Donchian Channels | `DonchianChannelsStudy` | donchian channel 4,500 (KD 7) | ~4.5k |  |
| To do | Parabolic SAR | `PSARStudy` | parabolic sar 3,800 (KD 12), psar indicator 250 (KD 15) | ~4.0k |  |
| To do | Keltner Channels | `KeltnerChannelsStudy` | keltner channel 2,200 (KD 8) | ~2.2k |  |

## Low Volume: Probably Not Worth a Page Yet

| Status | Indicator | Study | Keywords (global volume, KD) | Total | Notes |
| --- | --- | --- | --- | --- | --- |
| Hold | OBV (On Balance Volume) | `OBVStudy` | on balance volume 1,700 (KD 32), obv indicator 1,400 (KD 41) | ~3.1k |  |
| Hold | CCI (Commodity Channel Index) | `CCIStudy` | cci indicator 2,000 (KD 14), commodity channel index 1,200 (KD 12) | ~3.2k |  |
| Hold | MFI (Money Flow Index) | `MFIStudy` | money flow index 2,000 (KD 22), mfi indicator 800 (KD 22) | ~2.8k |  |
| Hold | Awesome Oscillator | `AwesomeOscillatorStudy` | awesome oscillator 1,800 (KD 0) | ~1.8k |  |
| Hold | Williams %R | `WilliamsRStudy` | williams %r 600 (KD 7), williams percent range 500 (KD 2) | ~1.1k |  |
| Hold | ROC (Rate of Change) | `ROCStudy` | roc indicator 700 (KD 24), rate of change indicator 400 (KD 21) | ~1.1k |  |
| Hold | TRIX | `TRIXStudy` | trix indicator 300 (KD 2) | ~0.3k |  |
| Hold | Force Index | `ForceIndexStudy` | force index indicator 300 (KD 5) | ~0.3k |  |

## Outside the Indicator Template

Worth a page, but not a study page:

| Status | Topic | Keywords (global volume, KD) | Notes |
| --- | --- | --- | --- |
| To do | Fibonacci retracement | fibonacci retracement 20,000 (KD 38) | A drawing tool, not a study: a page under Drawing Tools |
| To do | Heikin-Ashi | heikin ashi 9,000 (KD 11) | Low difficulty. Covered on Price Chart Types today; could have its own page |
| To do | Liquidity heatmap | liquidity heatmap 18,000 (KD 57) | Ahrefs' parent topic is "btc liquidation heatmap", which differs from SciTrader's order-book heatmap ("order book heatmap" 400). A page would need to explain the difference, or a liquidation heatmap feature |
| Hold | Renko and Point & Figure | renko chart 2,400 (KD 0), point and figure chart 1,500 (KD 1) | Covered on Price Chart Types |

## Developer Keywords

Searches for charting libraries are small, so the indicator pages mainly bring in people searching what an indicator is; developers arrive through each page's "How to add X to a JavaScript / React financial chart" sections. Keep those sections on every page.

| Keyword | Global volume | KD |
| --- | --- | --- |
| lightweight charts | 900 | 30 |
| javascript stock chart | 200 | 25 |
| react stock chart | 150 | – |
| react candlestick chart | 150 | 0 |
| financial charting library | 150 | – |
| javascript candlestick chart | 100 | 0 |
| stock chart library | 90 | – |
| react financial chart | 30 | – |
| javascript financial chart | 20 | – |
| tradingview charting library | 30 | – |
| technical indicators javascript | 0 | – |
| rsi javascript | 0 | – |
| javascript trading chart | 0 | – |
