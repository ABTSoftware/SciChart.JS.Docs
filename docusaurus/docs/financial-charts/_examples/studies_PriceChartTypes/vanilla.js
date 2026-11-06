import "scichart-scitrader/scitrader.css";
import { CandleInterval, CandleTypeSelector, CoinbaseExchange, defaultExchangeProvider, ECandleType, idbPriceStore, OHLCStudy, PointAndFigureStudy, RenkoStudy, SciFinanceChartPanel, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "ETH-USD",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        // candleType on OHLCStudy sets the price series' starting style
        studies: [new OHLCStudy({ candleType: ECandleType.HeikinAshi }), new RenkoStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // Candlesticks, OHLC bars, line, mountain or Heikin-Ashi: setCandleType redraws the price series
    // in place, without reloading data or moving the zoom
    const selector = CandleTypeSelector.create(toolbar, {
        value: ECandleType.HeikinAshi,
        onChange: (type) => chart.setCandleType(type),
    });
    // Renko and Point & Figure aren't candle types but studies: they plot price moves, not time,
    // so each draws in a pane of its own, on a category (index) axis.
    // Leave brickSize / boxSize unset to size them from the price range
    const showPane = (create) => {
        chart.studies.filter((s) => s instanceof RenkoStudy || s instanceof PointAndFigureStudy).forEach((s) => chart.detachStudy(s));
        if (create)
            chart.attachStudy(create());
    };
    toolbar.append(button("Renko", () => showPane(() => new RenkoStudy({ reversalAmount: 2 }))), button("Point & Figure", () => showPane(() => new PointAndFigureStudy({ reversalAmount: 3 }))), button("Neither", () => showPane()));
    // When the page goes away: selector.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, selector };
}
function button(text, onClick) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};
createChart();
