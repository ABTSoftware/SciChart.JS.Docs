import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, EDescriptorSectionName, idbPriceStore, OHLCStudy, RSIStudy, SMAStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// Change one setting of a live study, in code.
// A study's settings are its descriptor: an "inputs" section (periods, levels) and a "styles"
// section (colours, thickness), each a set of named controls holding their value in `default`.
// Copy the descriptor with one value changed and apply it: built-in studies update in place
function setStudySetting(study, section, control, value) {
    const descriptor = study.getDescriptor();
    const controls = descriptor[section].controls;
    study.applyDescriptor({
        ...descriptor,
        [section]: { controls: { ...controls, [control]: { ...controls[control], default: value } } },
    });
}
export function StudySettingsChart() {
    // Create the studies and config once per mounted chart: studies are live objects bound to one chart
    const { rsi, config } = React.useMemo(() => {
        const rsi = new RSIStudy({ length: 14 });
        const config = {
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), rsi],
        };
        return { rsi, config };
    }, []);
    // The RSI's descriptor, shown as JSON, and shown again whenever settings are applied:
    // descriptorApplied fires after every applyDescriptor, from code or from a settings form.
    // Keep a JSON string in state, not the descriptor: getDescriptor() refills and returns the
    // same object each time, so React would see no change
    const toJson = () => JSON.stringify(rsi.getDescriptor(), null, 2);
    const [descriptorJson, setDescriptorJson] = React.useState(toJson);
    React.useEffect(() => {
        const onApplied = () => setDescriptorJson(toJson());
        rsi.descriptorApplied.subscribe(onApplied);
        return () => rsi.descriptorApplied.unsubscribe(onApplied);
    }, [rsi]);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, onClick: () => setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7) }, "RSI period 7"),
            React.createElement("button", { style: buttonStyle, onClick: () => setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 21) }, "RSI period 21"),
            React.createElement("button", { style: buttonStyle, onClick: () => setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c") }, "RSI line amber"),
            React.createElement("button", { style: buttonStyle, onClick: () => rsi.applyDescriptor(rsi.getDefaultDescriptor()) }, "Reset RSI")),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config })),
            React.createElement("pre", { style: descriptorStyle }, descriptorJson))));
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
const descriptorStyle = {
    width: 320,
    margin: 0,
    padding: "8px 12px",
    overflow: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 11,
};
