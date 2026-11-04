import "scichart-scitrader/scitrader.css";
import { BollingerBandsStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, EDescriptorSectionName, idbPriceStore, MACDStudy, OHLCStudy, RSIStudy, SciFinanceChartPanel, SMAStudy, StudySettingsForm, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; height: 100%">
//     <div id="chart" style="flex: 1; min-width: 0"></div>
//     <div id="settings" style="width: 320px; overflow-y: auto"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
async function createChart() {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new SMAStudy({ length: 50 }), new BollingerBandsStudy(), new RSIStudy(), new MACDStudy()],
    });
    const chart = financeChartPanel.financeApi;
    const panel = document.getElementById("settings");
    Object.assign(panel.style, panelStyle);
    // A dropdown of the chart's studies: the form edits the one picked
    const studySelect = document.createElement("select");
    Object.assign(studySelect.style, controlStyle);
    const fillStudies = () => studySelect.replaceChildren(...chart.studies.map((s) => new Option(s.type, s.id)));
    fillStudies();
    studySelect.value = chart.studies[3].id; // the RSI
    chart.studiesChanged.subscribe(fillStudies); // keep the list in step with the chart
    // Inputs / Styles tabs: the form shows one section at a time
    const tabs = document.createElement("div");
    Object.assign(tabs.style, { display: "flex", gap: "4px" });
    const tab = (label, section) => {
        const b = document.createElement("button");
        b.textContent = label;
        Object.assign(b.style, controlStyle);
        b.onclick = () => {
            // sectionFilter shows only that section. hideSectionLabels drops its heading: the tab says it
            form.update({ sectionFilter: [section], hideSectionLabels: true });
            [...tabs.children].forEach((t) => (t.style.fontWeight = t === b ? "700" : "400"));
        };
        return b;
    };
    tabs.append(tab("Inputs", EDescriptorSectionName.INPUTS), tab("Styles", EDescriptorSectionName.STYLES));
    const status = document.createElement("div");
    Object.assign(status.style, { color: "var(--st-ui-text-muted, #9da2bc)", fontSize: "12px" });
    const formHost = document.createElement("div");
    panel.append(studySelect, tabs, formHost, status);
    // StudySettingsForm: a form generated from the study's descriptor. Edits apply 150 ms after the
    // last change, through onApply. Without onApply it calls study.applyDescriptor(descriptor) itself
    const byId = (id) => chart.studies.find((s) => s.id === id);
    const form = StudySettingsForm.create(formHost, {
        study: byId(studySelect.value),
        sectionFilter: [EDescriptorSectionName.INPUTS],
        hideSectionLabels: true,
        onApply: (study, descriptor) => {
            study.applyDescriptor(descriptor);
            status.textContent = `Applied to ${study.type} at ${new Date().toLocaleTimeString()}`;
        },
    });
    tabs.firstElementChild.style.fontWeight = "700";
    // update({ study }) reloads the form for another study
    studySelect.onchange = () => form.update({ study: byId(studySelect.value) });
    // When the page goes away: form.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, form };
}
// The panel uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const panelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    boxSizing: "border-box",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const controlStyle = {
    padding: "6px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};
createChart();
