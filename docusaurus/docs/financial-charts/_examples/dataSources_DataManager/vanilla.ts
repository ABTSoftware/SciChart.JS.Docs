import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    DEFAULT_FEED_ID,
    defaultExchangeProvider,
    EDataSourceStringId,
    EDataUpdateType,
    idbPriceStore,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SMAStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; height: 100%">
//     <div id="chart" style="flex: 1; min-width: 0"></div>
//     <pre id="store-log" style="width: 340px"></pre>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

async function createChart() {
    const panel = document.getElementById("store-log");
    Object.assign(panel.style, logStyle);

    // One-minute candles, so live updates arrive often
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name,
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        studies: [new OHLCStudy(), new SMAStudy({ length: 20 }), new RSIStudy()],
    });
    const dataManager = financeChartPanel.financeApi.dataManager;

    // Every column is named by a DataSourceId. The default feed's columns are found by name:
    // Open, High, Low, Close and Volume. Studies add their own output columns, e.g. SMA's
    const close = dataManager.getSourceIdByName(DEFAULT_FEED_ID, EDataSourceStringId.CLOSE);

    // observeChanges: every change to the close column, as an EDataUpdateType.
    // Replace: a whole new series. Append: a new candle. Update: a live tick changed the latest candle.
    // Insert: older candles, loaded as you pan back. Evict: candles dropped to save memory
    const counts: Record<string, number> = {};
    const subscription = dataManager.observeChanges<number>([close]).subscribe((update) => {
        const type = EDataUpdateType[update[close.id].updateType];
        counts[type] = (counts[type] ?? 0) + 1;
    });

    // Show the columns and the update counts, once a second
    const render = () => {
        const columns = dataManager
            .getSources()
            .map((id) => `${(id.legendName || id.name).padEnd(10)} ${dataManager.getValues(id)?.length ?? 0} values`)
            .join("\n");
        const latest = dataManager.getValues<number>(close).at(-1);
        panel.textContent =
            `Candles: ${dataManager.xValues.length}, latest close ${latest?.toLocaleString()}\n\n` +
            `Columns (DataSourceId):\n${columns}\n\n` +
            `Updates to Close (EDataUpdateType):\n${JSON.stringify(counts, null, 1).replace(/[{}"]/g, "")}`;
    };
    const timer = setInterval(render, 1000);
    render();

    // When the page goes away: clearInterval(timer); subscription.unsubscribe(); financeChartPanel.cleanup();
    return { financeChartPanel, subscription, timer };
}

const logStyle: Partial<CSSStyleDeclaration> = {
    margin: "0",
    padding: "8px 12px",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "12px/1.5 monospace",
    whiteSpace: "pre-wrap",
};

createChart();
