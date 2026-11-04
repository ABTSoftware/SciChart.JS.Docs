import "scichart-scitrader/scitrader.css";
import {
    CandleCounter,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    observeCandleCounts,
    OHLCStudy,
    PaneId,
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
        period: "1M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart

    // 1. CandleCounter in the price pane's control bar.
    // getPaneInfoElement(paneId) returns the info area at the start of that pane's control bar.
    // The price pane's id is PaneId.DEFAULT.value ("default")
    const infoArea = financeChartPanel.getPaneInfoElement(PaneId.DEFAULT.value);
    const counter = CandleCounter.create(infoArea, { chart });

    // 2. The same numbers in your own element, with observeCandleCounts.
    // It calls back now and whenever the counts change, at most once a frame, and returns a
    // function that stops it. A count is undefined while it is still unknown
    const status = document.createElement("span");
    toolbar.appendChild(status);
    const stopObserving = observeCandleCounts(chart, (counts) => {
        status.textContent =
            `On screen: ${counts?.visible ?? "?"} · Loaded: ${counts?.loaded ?? "?"} · ` +
            `Since listing: ~${counts?.total ?? "?"}`;
    });

    // When the page goes away: stopObserving(); counter.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, counter, stopObserving };
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    padding: "10px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontFamily: "var(--st-font-family, sans-serif)",
    fontSize: "14px",
};

createChart();
