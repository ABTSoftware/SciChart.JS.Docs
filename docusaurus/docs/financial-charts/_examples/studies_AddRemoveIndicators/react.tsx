import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BollingerBandsStudy,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EStudyCategory,
    EStudyType,
    groupStudyMenuItems,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    IStudy,
    OHLCStudy,
    RSIStudy,
    SMAStudy,
    STUDY_MENU_ITEMS,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// The studies the picker offers: the SDK's catalogue, less the price study (always on this chart)
// and the order-book studies, which need an order-book source that CoinbaseExchange doesn't provide
const PICKABLE = STUDY_MENU_ITEMS.filter(
    (item) => item.type !== EStudyType.OHLC && item.category !== EStudyCategory.OrderBook
);

// A study's display name, e.g. "Bollinger Bands", from the catalogue
const labelOf = (study: IStudy) => STUDY_MENU_ITEMS.find((item) => item.type === study.type)?.description ?? study.type;

export function IndicatorsChart() {
    // The same ISciFinanceChartPanelApi that SciFinanceChartPanel.create returns
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    // The studies on the chart, kept in state so the chips re-render when they change
    const [studies, setStudies] = React.useState<readonly IStudy[]>([]);
    const [selected, setSelected] = React.useState<string>(EStudyType.MACD);
    const [message, setMessage] = React.useState("");

    // 1. Add indicators when the chart is created: pass them in `studies`, in the order they draw.
    // Overlays (SMA, Bollinger Bands) share the price pane; oscillators (RSI) get a pane each.
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [
                new OHLCStudy(), // draws the price series
                new VolumeStudy(),
                new SMAStudy({ length: 50, renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } }),
                new BollingerBandsStudy({ period: 20, stdDev: 2 }),
                new RSIStudy({ length: 14, overbought: 70, oversold: 30 }),
            ],
            maxPanes: 5, // the price pane and up to four indicator panes
        }),
        []
    );

    // financeApi throws until the chart has initialised, so subscribe from onInit.
    // The chart is deleted when this component unmounts, so there's no need to unsubscribe
    const onInit = (api: ISciFinanceChartPanelApi) => {
        const chart = api.financeApi;
        setStudies(chart.studies); // studies returns a new array each time, so React sees the change
        // studiesChanged fires on every attach and detach, including a pane closed from the chart
        chart.studiesChanged.subscribe(() => setStudies(chart.studies));
        // Past maxPanes, attachStudy refuses an oscillator and raises paneLimitReached
        chart.paneLimitReached.subscribe(({ max }) => setMessage(`At most ${max} panes: remove an indicator first`));
    };

    // 2. Add indicators at runtime: studyProvider.getStudy(type) creates any registered study
    // with its default settings
    const addStudy = () => {
        const chart = chartRef.current;
        if (!chart?.isInitialized) return;
        setMessage("");
        chart.financeApi.attachStudy(studyProvider.getStudy(selected));
    };

    // 3. Remove indicators at runtime: an oscillator's pane goes with it
    const removeStudy = (study: IStudy) => chartRef.current?.financeApi.detachStudy(study);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <select style={controlStyle} value={selected} onChange={(e) => setSelected(e.target.value)}>
                    {groupStudyMenuItems(PICKABLE).map((group) => (
                        <optgroup key={group.category} label={group.category}>
                            {group.items.map((item) => (
                                <option key={item.type} value={item.type}>
                                    {`${item.label}: ${item.description}`}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <button style={controlStyle} onClick={addStudy}>
                    Add indicator
                </button>
                <span style={{ color: "var(--st-ui-text-muted, #9da2bc)", fontSize: 13 }}>{message}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {studies
                        .filter((study) => study.type !== EStudyType.OHLC)
                        .map((study) => (
                            <button key={study.id} style={chipStyle} title="Remove" onClick={() => removeStudy(study)}>
                                {`${labelOf(study)} ×`}
                            </button>
                        ))}
                </div>
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
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const controlStyle: React.CSSProperties = {
    padding: "4px 8px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
};
const chipStyle: React.CSSProperties = { ...controlStyle, borderRadius: 12, padding: "2px 10px", cursor: "pointer" };
