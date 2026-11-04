import "scichart-scitrader/scitrader.css";
import {
    BollingerBandsStudy,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EStudyCategory,
    EStudyType,
    groupStudyMenuItems,
    idbPriceStore,
    IStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SMAStudy,
    STUDY_MENU_ITEMS,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// The studies the picker offers: the SDK's catalogue, less the price study (always on this chart)
// and the order-book studies, which need an order-book source that CoinbaseExchange doesn't provide
const PICKABLE = STUDY_MENU_ITEMS.filter(
    (item) => item.type !== EStudyType.OHLC && item.category !== EStudyCategory.OrderBook
);

// A study's display name, e.g. "Bollinger Bands", from the catalogue
const labelOf = (study: IStudy) => STUDY_MENU_ITEMS.find((item) => item.type === study.type)?.description ?? study.type;

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);

    // 1. Add indicators when the chart is created: pass them in `studies`, in the order they draw.
    // Overlays (SMA, Bollinger Bands) share the price pane; oscillators (RSI) get a pane each.
    // Options left out take their defaults
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
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
    });
    const chart = financeChartPanel.financeApi;

    // 2. Add indicators at runtime: a picker of the catalogue, grouped by category.
    // studyProvider.getStudy(type) creates any registered study with its default settings
    const picker = document.createElement("select");
    Object.assign(picker.style, controlStyle);
    for (const group of groupStudyMenuItems(PICKABLE)) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = group.category;
        for (const item of group.items) {
            optgroup.append(new Option(`${item.label}: ${item.description}`, item.type));
        }
        picker.append(optgroup);
    }
    const addButton = document.createElement("button");
    addButton.textContent = "Add indicator";
    Object.assign(addButton.style, controlStyle);
    addButton.onclick = () => {
        message.textContent = "";
        chart.attachStudy(studyProvider.getStudy(picker.value));
    };

    // An oscillator needs a pane of its own. Past maxPanes, attachStudy refuses it and raises
    // paneLimitReached; overlays are never refused
    const message = document.createElement("span");
    Object.assign(message.style, { color: "var(--st-ui-text-muted, #9da2bc)", fontSize: "13px" });
    chart.paneLimitReached.subscribe(({ max }) => {
        message.textContent = `At most ${max} panes: remove an indicator first`;
    });

    // 3. Remove indicators at runtime: one chip per study, with × calling detachStudy.
    // An oscillator's pane goes with it
    const chips = document.createElement("div");
    Object.assign(chips.style, { display: "flex", flexWrap: "wrap", gap: "6px" });
    const renderChips = () => {
        chips.replaceChildren(
            ...chart.studies
                .filter((study) => study.type !== EStudyType.OHLC)
                .map((study) => {
                    const chip = document.createElement("button");
                    chip.textContent = `${labelOf(study)} ×`;
                    chip.title = "Remove";
                    Object.assign(chip.style, chipStyle);
                    chip.onclick = () => chart.detachStudy(study);
                    return chip;
                })
        );
    };
    // studiesChanged fires on every attach and detach, including a pane closed from the chart
    chart.studiesChanged.subscribe(renderChips);
    renderChips();

    toolbar.append(picker, addButton, message, chips);

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
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
const controlStyle: Partial<CSSStyleDeclaration> = {
    padding: "4px 8px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
};
const chipStyle: Partial<CSSStyleDeclaration> = {
    ...controlStyle,
    borderRadius: "12px",
    padding: "2px 10px",
    cursor: "pointer",
};

createChart();
