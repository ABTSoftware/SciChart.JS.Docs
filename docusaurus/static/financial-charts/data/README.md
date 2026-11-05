# Sample price history for the Financial Charts examples

Real Binance spot candles, from Binance's public market-data mirror (`data-api.binance.vision`), copied from SciChart.Trader `Web/SciTrader/SciTraderSandbox/src/static/data/` (regenerated there by `Web/SciTrader/scripts/fetch-sample-csv.mjs`).

| File | Contents |
| --- | --- |
| `crypto-1h.csv` | 90 days of hourly candles for BTCUSDT, ETHUSDT and SOLUSDT: `symbol,time,open,high,low,close,volume` |
| `crypto-1d.csv` | 4 years of daily candles for the same symbols |
| `btcusdt-1d.json` | The BTCUSDT daily candles as JSON: `[{ time (ms), open, high, low, close, volume }]` |

The examples load these from jsDelivr (`https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@<branch>/docusaurus/static/financial-charts/data/…`), so the docs' live examples and CodePen fetch the same files. `CSVExchange` moves the dates forward on load, so the data always ends "now".
