import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    MACDStudy,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div id="chart" style="height: 100%"></div>

// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";

// One candle as your JSON has it. Here: time in milliseconds, prices and volume as numbers
type TJsonCandle = { time: number; open: number; high: number; low: number; close: number; volume: number };

// CSVExchange reads CSV text, so write the candles as CSV rows: a header, then one row per candle.
// The header names are the ones CSVExchange looks for; use the `columns` option for other names
function candlesToCsv(candles: TJsonCandle[]): string {
    const rows = candles.map((c) => `${c.time},${c.open},${c.high},${c.low},${c.close},${c.volume}`);
    return ["time,open,high,low,close,volume", ...rows].join("\n");
}

async function createChart() {
    // 1. Get the candles: here from a JSON file, but any array of candles works, e.g. from your own API
    const candles: TJsonCandle[] = await (await fetch(`${SAMPLE_DATA}/btcusdt-1d.json`)).json();

    // 2. Turn them into an exchange: one symbol, one interval. timeUnit "ms" says how `time` is
    // written ("s" for seconds, "iso" for date strings). CSVExchange also serves 1w and 1M from them
    const exchange = new CSVExchange(
        { csv: candlesToCsv(candles), symbol: "BTCUSDT", interval: CandleInterval.ONE_DAY },
        { name: "MyData", timeUnit: "ms" }
    );

    // 3. Chart it, with chart services for this exchange alone
    const { services } = createCSVServices(exchange);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: exchange.name,
        symbol: "BTCUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        services,
        studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
    });

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

createChart();
