import "scichart-scitrader/scitrader.css";
import { CandleInterval, createCSVServices, CSVExchange, MACDStudy, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";
// CSVExchange reads CSV text, so write the candles as CSV rows: a header, then one row per candle.
// The header names are the ones CSVExchange looks for; use the `columns` option for other names
function candlesToCsv(candles) {
    const rows = candles.map((c) => `${c.time},${c.open},${c.high},${c.low},${c.close},${c.volume}`);
    return ["time,open,high,low,close,volume", ...rows].join("\n");
}
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    // 1. Get the candles: here from a JSON file, but any array of candles works, e.g. from your own API
    const candles = await (await fetch(`${SAMPLE_DATA}/btcusdt-1d.json`)).json();
    // 2. Turn them into an exchange: one symbol, one interval. timeUnit "ms" says how `time` is
    // written ("s" for seconds, "iso" for date strings). From daily candles, CSVExchange also
    // serves 3d and 1w
    const exchange = new CSVExchange({ csv: candlesToCsv(candles), symbol: "BTCUSDT", interval: CandleInterval.ONE_DAY }, { name: "MyData", timeUnit: "ms" });
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
    const chart = financeChartPanel.financeApi;
    // 4. The intervals the candles can make: 1d, 3d and 1w. getSupportedIntervals() also lists 1M,
    // which charts can't show yet, so leave it out. changeInterval picks a period that suits the interval
    const intervals = exchange.getSupportedIntervals().filter((i) => i !== CandleInterval.ONE_MONTH);
    toolbar.append(buttonGroup(intervals, (i) => i, CandleInterval.ONE_DAY, (interval) => chart.changeInterval(interval)));
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
// A row of toggle buttons: one per value, the selected one highlighted
function buttonGroup(values, label, selected, onSelect) {
    const group = document.createElement("div");
    Object.assign(group.style, { display: "flex", gap: "4px" });
    const render = (current) => group.replaceChildren(...values.map((value) => {
        const b = document.createElement("button");
        b.textContent = label(value);
        Object.assign(b.style, buttonStyle(value === current));
        b.onclick = () => {
            render(value);
            onSelect(value);
        };
        return b;
    }));
    render(selected);
    return group;
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 16px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "13px",
};
const buttonStyle = (active = false) => ({
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: active ? "var(--st-ui-selection, #6c63ff)" : "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
});
createChart();
