import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    ADXStudy,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    IStudy,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function TradingChart() {
    // The same ISciFinanceChartPanelApi that SciFinanceChartPanel.create returns
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    // The studies on the chart, kept in state so the buttons re-render when they change
    const [studies, setStudies] = React.useState<readonly IStudy[]>([]);
    const [ready, setReady] = React.useState(false);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "ETH-USD", // Coinbase's symbol format
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        }),
        []
    );

    // financeApi throws until the chart has initialised, so only use it from onInit
    const onInit = (api: ISciFinanceChartPanelApi) => {
        const chart = api.financeApi;
        setReady(true);
        setStudies(chart.studies); // studies returns a new array each time, so React sees the change
        // Also fires when the user closes a study's pane from the chart.
        // The chart is deleted when this component unmounts, so there's no need to unsubscribe.
        chart.studiesChanged.subscribe(() => setStudies(chart.studies));
    };

    // Detach the study of this type if the chart has one, otherwise attach a new one
    const toggleStudy = (StudyType: new () => IStudy) => {
        const chart = chartRef.current;
        if (!chart?.isInitialized) return;
        const existing = chart.financeApi.studies.find((study) => study instanceof StudyType);
        if (existing) {
            chart.financeApi.detachStudy(existing);
        } else {
            chart.financeApi.attachStudy(new StudyType());
        }
    };

    const hasMacd = studies.some((study) => study instanceof MACDStudy);
    const hasAdx = studies.some((study) => study instanceof ADXStudy);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <button style={buttonStyle(hasMacd, ready)} disabled={!ready} onClick={() => toggleStudy(MACDStudy)}>
                    {hasMacd ? "Remove MACD" : "Add MACD"}
                </button>
                <button style={buttonStyle(hasAdx, ready)} disabled={!ready} onClick={() => toggleStudy(ADXStudy)}>
                    {hasAdx ? "Remove ADX" : "Add ADX"}
                </button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} onInit={onInit} />
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle = (active: boolean, enabled: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    fontSize: 14,
    fontFamily: "var(--st-font-family, sans-serif)",
    color: "var(--st-ui-text, #ffffff)",
    background: active ? "var(--st-ui-accent, #7464ff)" : "var(--st-ui-surface, #373447)",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 4,
    cursor: enabled ? "pointer" : "default",
    opacity: enabled ? 1 : 0.5,
});
