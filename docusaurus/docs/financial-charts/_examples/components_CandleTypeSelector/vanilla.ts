import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CandleTypeSelector,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

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
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M", // the last three months
        studies: [new OHLCStudy(), new VolumeStudy()], // OHLCStudy draws the price series
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart

    // CandleTypeSelector: a button showing the current candle type, which opens a menu of types.
    // It calls onChange with the picked ECandleType, and you pass it on to the chart with setCandleType
    const candleTypes = CandleTypeSelector.create(toolbar, {
        value: chart.getCandleType(), // ECandleType.Candlestick to start with
        onChange: (type) => chart.setCandleType(type),
    });

    // When the page goes away: candleTypes.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, candleTypes };
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

createChart();
