import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EDescriptorSectionName,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    IStudy,
    MACDStudy,
    OHLCStudy,
    SMAStudy,
} from "scichart-scitrader";
import { ColorPicker, SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Change one colour setting of a live study.
// A study's settings are its descriptor: "inputs" and "styles" sections of named controls, each
// holding its value in `default`. Copy the descriptor with one control's value changed, and apply
// it: SMAStudy and MACDStudy restyle their series in place, without reloading any data
function setStudyColour(study: IStudy, control: string, colour: string) {
    const descriptor = study.getDescriptor();
    const styles = descriptor[EDescriptorSectionName.STYLES].controls;
    study.applyDescriptor({
        ...descriptor,
        [EDescriptorSectionName.STYLES]: {
            controls: { ...styles, [control]: { ...styles[control], default: colour } },
        },
    });
}

export function StudyColoursChart() {
    // The pickers are controlled components: their colours live in React state
    const [smaColour, setSmaColour] = React.useState("#ff9f1c");
    const [macdColour, setMacdColour] = React.useState("#2ec4b6");
    const [signalColour, setSignalColour] = React.useState("#e71d36");

    // Create the studies and config once per mounted chart: studies are live objects bound to one chart.
    // 2px lines, so colour changes are easy to see
    const { sma, macd, config } = React.useMemo(() => {
        const sma = new SMAStudy({ length: 20, renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } });
        const macd = new MACDStudy({ bandOptions: { stroke: "#2ec4b6", strokeY1: "#e71d36", strokeThickness: 2 } });
        const config: ISciFinanceChartPanelConfig = {
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "1M", // the last month: fewer candles, so colour changes are easy to see
            studies: [new OHLCStudy(), sma, macd],
        };
        return { sma, macd, config };
    }, []);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <ColorPicker
                    label="SMA 20"
                    value={smaColour}
                    onChange={(colour) => {
                        setSmaColour(colour);
                        setStudyColour(sma, "strokeColor", colour);
                    }}
                />
                <ColorPicker
                    label="MACD line"
                    value={macdColour}
                    onChange={(colour) => {
                        setMacdColour(colour);
                        setStudyColour(macd, "bandMacdColor", colour);
                    }}
                />
                <ColorPicker
                    label="Signal line"
                    value={signalColour}
                    onChange={(colour) => {
                        setSignalColour(colour);
                        setStudyColour(macd, "bandSignalColor", colour);
                    }}
                />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView config={config} />
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 24,
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
