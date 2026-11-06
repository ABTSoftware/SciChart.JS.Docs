import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EDescriptorSectionName,
    idbPriceStore,
    IStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <pre id="descriptor" style="width: 320px; margin: 0; overflow: auto"></pre>
//     </div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Change one setting of a live study, in code.
// A study's settings are its descriptor: an "inputs" section (periods, levels) and a "styles"
// section (colours, thickness), each a set of named controls holding their value in `default`.
// Copy the descriptor with one value changed and apply it: built-in studies update in place
function setStudySetting(study: IStudy, section: EDescriptorSectionName, control: string, value: string | number) {
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
    const descriptorView = document.getElementById("descriptor");
    Object.assign(descriptorView.style, descriptorStyle);

    const rsi = new RSIStudy({ length: 14 });
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), rsi],
    });

    // Show the RSI's descriptor, and show it again whenever settings are applied:
    // descriptorApplied fires after every applyDescriptor, from code or from a settings form
    const showDescriptor = () => (descriptorView.textContent = JSON.stringify(rsi.getDescriptor(), null, 2));
    rsi.descriptorApplied.subscribe(showDescriptor);
    showDescriptor();

    toolbar.append(
        // An input: the RSI is recalculated
        button("RSI period 7", () => setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7)),
        button("RSI period 21", () => setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 21)),
        // A style: the RSI line is recoloured, with no recalculation
        button("RSI line amber", () => setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c")),
        // getDefaultDescriptor() is the study's settings as first attached
        button("Reset RSI", () => rsi.applyDescriptor(rsi.getDefaultDescriptor()))
    );

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

function button(text: string, onClick: () => void) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle: Partial<CSSStyleDeclaration> = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};
const descriptorStyle: Partial<CSSStyleDeclaration> = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "11px",
};

createChart();
