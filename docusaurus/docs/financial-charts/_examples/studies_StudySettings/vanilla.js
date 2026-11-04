import "scichart-scitrader/scitrader.css";
import { BollingerBandsStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, EDescriptorSectionName, idbPriceStore, OHLCStudy, RSIStudy, SciFinanceChartPanel, SMAStudy, StudyList, StudySettingsForm, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div style="display: flex; flex-direction: column; width: 320px">
//             <div id="studies" style="flex: 1; min-height: 0; overflow-y: auto"></div>
//             <div id="rsi-inputs"></div>
//         </div>
//     </div>
// </div>
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
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const rsi = new RSIStudy({ length: 14 });
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [
            new OHLCStudy(), // draws the price series
            new VolumeStudy(),
            new SMAStudy({ length: 50 }),
            new BollingerBandsStudy(),
            rsi,
        ],
    });
    const chart = financeChartPanel.financeApi;
    // StudyList: the chart's studies as cards. A card opens that study's settings form
    // (a StudySettingsForm); edits apply as you make them, and × removes the study.
    // It follows studiesChanged, so studies added or removed elsewhere appear and disappear
    const studyList = StudyList.create(document.getElementById("studies"), { chart, title: "Studies" });
    // StudySettingsForm on its own: here the RSI's inputs only, without the section heading.
    // The same form StudyList opens, for a settings page of your own
    const rsiInputs = document.getElementById("rsi-inputs");
    Object.assign(rsiInputs.style, formPanelStyle);
    const heading = document.createElement("div");
    heading.textContent = "RSI inputs";
    Object.assign(heading.style, headingStyle);
    rsiInputs.append(heading);
    const rsiForm = StudySettingsForm.create(rsiInputs, {
        study: rsi,
        sectionFilter: [EDescriptorSectionName.INPUTS],
        hideSectionLabels: true,
    });
    // Change a setting in code: the RSI's period (an input) and colour (a style).
    // An open settings form shows the new values, because it listens to descriptorApplied
    const fastRsi = button("RSI period 7, amber", () => {
        setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7);
        setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c");
    });
    // Reset every study: getDefaultDescriptor() is the study's settings as first attached
    const reset = button("Reset all to defaults", () => {
        for (const study of chart.studies) {
            study.applyDescriptor(study.getDefaultDescriptor());
        }
    });
    // Open a study's settings from code: expand(study.id), or expand(null) to close
    const openRsi = button("Open RSI settings", () => studyList.expand(rsi.id));
    toolbar.append(fastRsi, reset, openRsi);
    // When the page goes away: studyList.destroy(); rsiForm.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, studyList, rsiForm };
}
function button(text, onClick) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const formPanelStyle = {
    padding: "8px 16px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const headingStyle = {
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};
createChart();
