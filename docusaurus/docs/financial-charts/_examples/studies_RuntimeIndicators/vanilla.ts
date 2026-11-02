import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    EStudyCategory,
    EStudyType,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    STUDY_MENU_ITEMS,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div id="toolbar"></div>
// <div id="chart" style="height: 800px"></div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "ETHUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "1M",
    studies: [new OHLCStudy(), new VolumeStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

/** Add the study of this type if it isn't on the chart, otherwise remove it. */
async function toggleStudy(type: EStudyType) {
    const existing = chart.studies.find((study) => study.type === type);
    if (existing) {
        chart.detachStudy(existing); // a pane left empty is removed with it
    } else {
        // studyProvider creates any study from its type, with default settings
        await chart.attachStudy(studyProvider.getStudy(type)); // adds a pane if the study needs one
    }
}

// One button per indicator. STUDY_MENU_ITEMS is the catalogue the SciTrader app's indicator picker uses.
// Price types and order-book studies are left out: they need data of their own.
const menu = STUDY_MENU_ITEMS.filter(
    (item) => !item.disabled && item.category !== EStudyCategory.Price && item.category !== EStudyCategory.OrderBook
);
const toolbar = document.getElementById("toolbar");
const buttons = menu.map((item) => {
    const button = document.createElement("button");
    button.textContent = item.label;
    button.title = item.description;
    button.onclick = () => toggleStudy(item.type);
    toolbar.appendChild(button);
    return button;
});

// Show which studies are on the chart, whatever added or removed them
chart.studiesChanged.subscribe(() => {
    const attached = new Set(chart.studies.map((study) => study.type));
    menu.forEach((item, i) => (buttons[i].style.fontWeight = attached.has(item.type) ? "bold" : "normal"));
});

// The chart stops adding panes at maxPanes (default 6), and raises paneLimitReached
chart.paneLimitReached.subscribe(({ max }) => console.warn(`At most ${max} panes`));
