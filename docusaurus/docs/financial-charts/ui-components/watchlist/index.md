---
sidebar_position: 8
sidebar_label: Watchlist
title: "Watchlist Prices and Sparklines | SciTrader.js"
description: "Build a crypto watchlist with live prices, 24-hour change and sparklines from SciTrader.js: WatchListDataManager, SparkLineChart and formatSymbolPair."
keywords: ["SciTrader", "SciTrader.js", "watchlist", "sparkline", "WatchListDataManager", "SparkLineChart"]
---

# Watchlist

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

<CenteredImageWrapper src={require("../../_examples/components_Watchlist/screenshot.png").default} title="Watchlist" />

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_Watchlist/react.tsx
    ```
</CodeSnippetBlock>
