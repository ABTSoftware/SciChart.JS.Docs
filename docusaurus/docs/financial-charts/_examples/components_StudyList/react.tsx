import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EMAStudy,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChart,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, StudyList } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function StudyListChart() {
    // The chart's finance API, once it has initialised. StudyList needs it
    const [chart, setChart] = React.useState<SciFinanceChart>(null);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new RSIStudy()],
        }),
        []
    );

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <button style={buttonStyle} disabled={!chart} onClick={() => chart.attachStudy(new MACDStudy())}>
                    Add MACD
                </button>
                <button style={buttonStyle} disabled={!chart} onClick={() => chart.attachStudy(new EMAStudy({ length: 20 }))}>
                    Add EMA 20
                </button>
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* financeApi throws until the chart has initialised, so read it in onInit */}
                    <SciFinanceChartView config={config} onInit={(api: ISciFinanceChartPanelApi) => setChart(api.financeApi)} />
                </div>
                {/* StudyList: a card per study on the chart. Click a card to open that study's settings form
                    (one at a time); × removes the study. It follows studiesChanged, so studies added or
                    removed elsewhere, like by the buttons above, appear and disappear */}
                {chart && (
                    <StudyList
                        chart={chart}
                        title="Indicators"
                        emptyMessage="No indicators on the chart." // shown when the chart has no studies
                        style={sidePanelStyle}
                    />
                )}
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle: React.CSSProperties = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
const sidePanelStyle: React.CSSProperties = {
    width: 320,
    overflowY: "auto",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
