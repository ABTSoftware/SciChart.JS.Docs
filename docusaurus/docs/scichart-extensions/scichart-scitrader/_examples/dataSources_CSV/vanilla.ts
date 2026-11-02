import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    IntervalSelector,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// A CSV file of candles, one row per candle. Several symbols can share a file:
//
//   symbol,time,open,high,low,close,volume
//   BTCUSDT,2026-07-01 12:00,58622.02,58676,58326,58538.01,1716.61
//   SOLUSDT,2026-07-01 12:00,141.20,141.95,140.80,141.55,25310.4
//
// Columns are found by their usual names (time/date/timestamp, open/o, ...), or map them with
// { columns: { time: "Date", close: "Adj Close" } }. Times can be epoch seconds, epoch milliseconds
// or dates, read as UTC. The data is moved forward so its last candle is now; pass alignToNow: false
// to keep the file's own dates.
const exchange = await CSVExchange.fromUrl("data/my-candles-1h.csv", { name: "MyCSV" });

// Give the chart its own services, so this exchange stays private to this chart. To make it
// available to every chart by name instead: registerCSVExchange(defaultExchangeProvider, exchange)
const { services } = createCSVServices(exchange);

// <div id="toolbar"></div>
// <div id="chart" style="height: 600px"></div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: exchange.name, // name="MyCSV", set by fromUrl above
    symbol: "SOLUSDT",
    interval: CandleInterval.TWO_HOURS, // resampled from the file's hourly rows
    studies: [new OHLCStudy(), new VolumeStudy()],
    services,
});
const chart = financeChartPanel.financeApi; // SciFinanceChart
const toolbar = document.getElementById("toolbar");

// One button per symbol in the file
for (const symbol of await exchange.getInstruments()) {
    const button = document.createElement("button");
    button.textContent = symbol;
    button.onclick = () => chart.setSymbol(symbol);
    toolbar.appendChild(button);
}

// The file's own interval, and every coarser one made of whole candles (2h, 4h, 12h, 1d, ...)
IntervalSelector.create(toolbar, {
    value: CandleInterval.TWO_HOURS,
    intervals: exchange.getSupportedIntervals(),
    onChange: (interval) => chart.changeInterval(interval),
});

// CSV text already in memory works the same way:
// new CSVExchange({ csv: "Date,Open,High,Low,Close,Volume\n2024-01-01,100,104,99,103,1200", symbol: "DEMO" }, { name: "InlineCSV" });
