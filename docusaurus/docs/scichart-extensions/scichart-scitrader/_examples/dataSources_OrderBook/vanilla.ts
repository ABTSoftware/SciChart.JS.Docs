import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    ColorPicker,
    defaultExchangeProvider,
    MarketDepthPanel,
    nullCandleStore,
    OHLCStudy,
    OrderBookHeatmapStudy,
    OrderBookImbalanceStudy,
    SCITRADER_DARK_THEME,
    SciFinanceChartPanel,
    setOrderBookSources,
    unthemeMarketDepthSettings,
    VolumeStudy,
} from "scichart-scitrader";
import { DummyDataExchange, DummyOrderBookSource } from "./DummyDataExchange";

// Candles come from an exchange; the order book from an IOrderBookSource registered under the same
// exchange name. Both are randomised here (see DummyDataExchange.ts), so the sample runs offline.
const exchange = new DummyDataExchange();
const orderBook = new DummyOrderBookSource();
defaultExchangeProvider.registerExchange(exchange, nullCandleStore);
setOrderBookSources(new Map([[exchange.name, orderBook]]));

const symbol = "ALPHAUSD";

// <div id="toolbar"></div>
// <div style="display: flex; height: 600px">
//     <div id="chart" style="flex: 1"></div>
//     <div id="depth" style="width: 300px; display: flex"></div>
// </div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: exchange.name, // name="Dummy", set in DummyDataExchange
    symbol,
    interval: CandleInterval.ONE_MINUTE,
    period: "1H",
    // The order-book studies need an order-book feed. The chart creates one from the source
    // registered for the exchange.
    studies: [
        new OrderBookHeatmapStudy(), // resting liquidity, painted behind the candles
        new OHLCStudy(),
        new VolumeStudy(),
        new OrderBookImbalanceStudy(), // bid versus ask depth, in its own pane
    ],
});

// The live market-depth ladder. Hover a rung to see what sweeping the book to that price would cost.
const depth = MarketDepthPanel.create(document.getElementById("depth"), { source: orderBook, symbol });

// Recolour the ladder's bid and ask prices, as a settings dialog would. Settings are stored
// theme-neutral: themedSettings shows the colours as drawn under the current theme.
const toolbar = document.getElementById("toolbar");
for (const side of ["bid", "ask"] as const) {
    ColorPicker.create(toolbar, {
        label: side === "bid" ? "Bid" : "Ask",
        value: depth.themedSettings.colours[side],
        onChange: (colour) => {
            const shown = depth.themedSettings;
            const edited = { ...shown, colours: { ...shown.colours, [side]: colour } };
            depth.setSettings(unthemeMarketDepthSettings(edited, SCITRADER_DARK_THEME)); // the panel's default theme
        },
    });
}

// When the page goes away: depth.destroy(); financeChartPanel.cleanup();
