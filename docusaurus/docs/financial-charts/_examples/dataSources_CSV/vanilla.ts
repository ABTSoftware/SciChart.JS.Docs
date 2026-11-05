import "scichart-scitrader/scitrader.css";
import { CandleInterval, createCSVServices, CSVExchange, OHLCStudy, SciFinanceChartPanel, VolumeStudy } from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);

    // 1. Load the CSV files. Each row is "symbol,time,open,high,low,close,volume", so one exchange
    // serves all three symbols. CSVExchange serves every interval the data can make: the hourly
    // file gives 1h to 12h, the daily file 1d, 1w and 1M. It moves the dates so the data ends now
    const exchange = await CSVExchange.fromUrl([`${SAMPLE_DATA}/crypto-1h.csv`, `${SAMPLE_DATA}/crypto-1d.csv`], {
        name: "Sample", // the exchangeName charts ask for
    });

    // 2. Chart services for this exchange alone, so nothing is registered in defaultExchangeProvider.
    // To make it available to every chart by name, call registerCSVExchange(defaultExchangeProvider, exchange)
    const { services } = createCSVServices(exchange);

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: exchange.name,
        symbol: "BTCUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "1M",
        services,
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;

    // 3. The symbols and intervals the files can serve
    const symbols = await exchange.getInstruments(); // ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
    const intervals = exchange.getSupportedIntervals();
    toolbar.append(
        buttonGroup(symbols, (s) => s, "BTCUSDT", (symbol) => chart.setSymbol(symbol)),
        // changeInterval picks a period that suits the interval
        buttonGroup(intervals, (i) => i, CandleInterval.FOUR_HOURS, (interval) => chart.changeInterval(interval))
    );

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

// A row of toggle buttons: one per value, the selected one highlighted
function buttonGroup<T>(values: readonly T[], label: (v: T) => string, selected: T, onSelect: (v: T) => void) {
    const group = document.createElement("div");
    Object.assign(group.style, { display: "flex", gap: "4px" });
    const render = (current: T) =>
        group.replaceChildren(
            ...values.map((value) => {
                const b = document.createElement("button");
                b.textContent = label(value);
                Object.assign(b.style, buttonStyle(value === current));
                b.onclick = () => {
                    render(value);
                    onSelect(value);
                };
                return b;
            })
        );
    render(selected);
    return group;
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
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
const buttonStyle = (active = false): Partial<CSSStyleDeclaration> => ({
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
