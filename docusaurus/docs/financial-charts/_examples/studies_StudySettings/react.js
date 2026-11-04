import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { BollingerBandsStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, EDescriptorSectionName, idbPriceStore, OHLCStudy, RSIStudy, SMAStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView, StudyList, StudySettingsForm } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// Change one setting of a live study, in code.
// A study's settings are its descriptor: an "inputs" section (lengths, levels) and a "styles"
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
    // The chart's finance API, once it has initialised. StudyList needs it
    const [chart, setChart] = React.useState(null);
    // Create the studies and config once per mounted chart: studies are live objects bound to one chart
    const { rsi, config } = React.useMemo(() => {
        const rsi = new RSIStudy({ length: 14 });
        const config = {
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new BollingerBandsStudy(), rsi],
        };
        return { rsi, config };
    }, []);
    // Change a setting in code: the RSI's period (an input) and colour (a style).
    // The forms show the new values, because they listen to the study's descriptorApplied
    const fastRsi = () => {
        setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7);
        setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c");
    };
    // Reset every study: getDefaultDescriptor() is the study's settings as first attached
    const resetAll = () => chart?.studies.forEach((study) => study.applyDescriptor(study.getDefaultDescriptor()));
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, disabled: !chart, onClick: fastRsi }, "RSI period 7, amber"),
            React.createElement("button", { style: buttonStyle, disabled: !chart, onClick: resetAll }, "Reset all to defaults")),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: (api) => setChart(api.financeApi) })),
            chart && (React.createElement("div", { style: sidePanelStyle },
                React.createElement(StudyList, { chart: chart, title: "Studies", style: { flex: 1, minHeight: 0, overflowY: "auto" } }),
                React.createElement("div", { style: formPanelStyle },
                    React.createElement("div", { style: headingStyle }, "RSI inputs"),
                    React.createElement(StudySettingsForm, { study: rsi, sectionFilter: [EDescriptorSectionName.INPUTS], hideSectionLabels: true })))))));
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
const sidePanelStyle = {
    display: "flex",
    flexDirection: "column",
    width: 320,
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const formPanelStyle = {
    padding: "8px 16px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const headingStyle = {
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};
