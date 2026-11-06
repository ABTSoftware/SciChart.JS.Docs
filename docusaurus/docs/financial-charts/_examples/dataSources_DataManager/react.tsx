import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    DEFAULT_FEED_ID,
    defaultExchangeProvider,
    EDataSourceStringId,
    EDataUpdateType,
    idbPriceStore,
    IDataManager,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    RSIStudy,
    SMAStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function DataManagerChart() {
    const [dataManager, setDataManager] = React.useState<IDataManager>();
    const [text, setText] = React.useState("");

    // One-minute candles, so live updates arrive often. Create the config once per mounted chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name,
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_MINUTE,
            period: "1H",
            studies: [new OHLCStudy(), new SMAStudy({ length: 20 }), new RSIStudy()],
        }),
        []
    );

    // Once the chart is ready: count the updates to the close column, and show the columns
    React.useEffect(() => {
        if (!dataManager) return undefined;
        // Every column is named by a DataSourceId. The default feed's columns are found by name
        const close = dataManager.getSourceIdByName(DEFAULT_FEED_ID, EDataSourceStringId.CLOSE);
        // observeChanges: every change to the close column, as an EDataUpdateType: Replace, Append,
        // Update (a live tick), Insert (older candles) or Evict (candles dropped to save memory)
        const counts: Record<string, number> = {};
        const subscription = dataManager.observeChanges<number>([close]).subscribe((update) => {
            const type = EDataUpdateType[update[close.id].updateType];
            counts[type] = (counts[type] ?? 0) + 1;
        });
        const render = () => {
            const columns = dataManager
                .getSources()
                .map((id) => `${(id.legendName || id.name).padEnd(10)} ${dataManager.getValues(id)?.length ?? 0} values`)
                .join("\n");
            const latest = dataManager.getValues<number>(close).at(-1);
            setText(
                `Candles: ${dataManager.xValues.length}, latest close ${latest?.toLocaleString()}\n\n` +
                    `Columns (DataSourceId):\n${columns}\n\n` +
                    `Updates to Close (EDataUpdateType):\n${JSON.stringify(counts, null, 1).replace(/[{}"]/g, "")}`
            );
        };
        const timer = setInterval(render, 1000);
        return () => {
            clearInterval(timer);
            subscription.unsubscribe();
        };
    }, [dataManager]);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                {/* financeApi throws until the chart has initialised, so read it in onInit */}
                <SciFinanceChartView config={config} onInit={(api: ISciFinanceChartPanelApi) => setDataManager(api.financeApi.dataManager)} />
            </div>
            <pre style={logStyle}>{text}</pre>
        </div>
    );
}

const logStyle: React.CSSProperties = {
    width: 340,
    margin: 0,
    padding: "8px 12px",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "12px/1.5 monospace",
    whiteSpace: "pre-wrap",
};
