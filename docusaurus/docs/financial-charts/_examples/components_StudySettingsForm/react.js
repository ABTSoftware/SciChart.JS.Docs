import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { BollingerBandsStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, EDescriptorSectionName, idbPriceStore, MACDStudy, OHLCStudy, RSIStudy, SMAStudy, } from "scichart-scitrader";
import { SciFinanceChartView, StudySettingsForm } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function StudySettingsFormChart() {
    // The chart's studies, kept in state so the dropdown follows the chart
    const [studies, setStudies] = React.useState([]);
    const [studyId, setStudyId] = React.useState();
    const [section, setSection] = React.useState(EDescriptorSectionName.INPUTS);
    const [status, setStatus] = React.useState("");
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new SMAStudy({ length: 50 }), new BollingerBandsStudy(), new RSIStudy(), new MACDStudy()],
    }), []);
    // financeApi throws until the chart has initialised, so read it in onInit.
    // The chart is deleted when this component unmounts, so there's no need to unsubscribe
    const onInit = (api) => {
        const chart = api.financeApi;
        setStudies(chart.studies);
        setStudyId(chart.studies[3].id); // the RSI
        chart.studiesChanged.subscribe(() => setStudies(chart.studies));
    };
    const study = studies.find((s) => s.id === studyId);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", height: "100%" } },
        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement(SciFinanceChartView, { config: config, onInit: onInit })),
        React.createElement("div", { style: panelStyle },
            React.createElement("select", { style: controlStyle, value: studyId ?? "", onChange: (e) => setStudyId(e.target.value) }, studies.map((s) => (React.createElement("option", { key: s.id, value: s.id }, s.type)))),
            React.createElement("div", { style: { display: "flex", gap: 4 } }, [
                ["Inputs", EDescriptorSectionName.INPUTS],
                ["Styles", EDescriptorSectionName.STYLES],
            ].map(([label, value]) => (React.createElement("button", { key: value, style: { ...controlStyle, fontWeight: section === value ? 700 : 400 }, onClick: () => setSection(value) }, label)))),
            study && (React.createElement(StudySettingsForm, { study: study, sectionFilter: [section], hideSectionLabels: true, onApply: (s, descriptor) => {
                    s.applyDescriptor(descriptor);
                    setStatus(`Applied to ${s.type} at ${new Date().toLocaleTimeString()}`);
                } })),
            React.createElement("div", { style: { color: "var(--st-ui-text-muted, #9da2bc)", fontSize: 12 } }, status))));
}
// The panel uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const panelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: 320,
    padding: 12,
    boxSizing: "border-box",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const controlStyle = {
    padding: "6px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
