import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    ICandleCounts,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    observeCandleCounts,
    OHLCStudy,
    PaneId,
    VolumeStudy,
} from "scichart-scitrader";
import { CandleCounter, SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function CandleCounterChart() {
    // The chart's API, once it has initialised: CandleCounter needs its financeApi
    const [chart, setChart] = React.useState<ISciFinanceChartPanelApi>();
    const [counts, setCounts] = React.useState<ICandleCounts>();

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "1M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // The same numbers in your own element, with observeCandleCounts. It returns a function that
    // stops it, which is the effect's cleanup
    React.useEffect(() => (chart ? observeCandleCounts(chart.financeApi, setCounts) : undefined), [chart]);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                On screen: {counts?.visible ?? "?"} · Loaded: {counts?.loaded ?? "?"} · Since listing: ~
                {counts?.total ?? "?"}
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView
                    config={config}
                    onInit={setChart}
                    // paneInfo is called for every chart pane, with the pane's id. Whatever it returns
                    // is rendered in that pane's control bar; null leaves the area empty.
                    // Here: a CandleCounter in the price pane (PaneId.DEFAULT.value, "default") only
                    paneInfo={(paneId: string) =>
                        paneId === PaneId.DEFAULT.value && chart ? <CandleCounter chart={chart.financeApi} /> : null
                    }
                />
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    padding: "10px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontFamily: "var(--st-font-family, sans-serif)",
    fontSize: 14,
};
