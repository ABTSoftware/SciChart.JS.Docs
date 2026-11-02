import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    filterStudyMenuItems,
    groupStudyMenuItems,
    idbPriceStore,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SMAStudy,
    STUDY_MENU_ITEMS,
    StudyList,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div style="display: flex; height: 600px">
//     <div id="chart" style="flex: 1"></div>
//     <div style="width: 360px; overflow: auto">
//         <input id="search" placeholder="Search indicators" />
//         <div id="picker"></div>
//         <div id="studies"></div>
//     </div>
// </div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new RSIStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

// Manage: the SDK's StudyList. Click a study to edit its settings (they apply as you type),
// or × to remove it. It follows the chart, so studies added below appear in it.
StudyList.create(document.getElementById("studies"), { chart, title: "Studies" });

// Add: a picker over the SDK's study catalogue, searched and grouped by category
const search = document.getElementById("search") as HTMLInputElement;
const picker = document.getElementById("picker");

function renderPicker() {
    picker.replaceChildren();
    const groups = groupStudyMenuItems(filterStudyMenuItems(STUDY_MENU_ITEMS, { query: search.value }));
    for (const group of groups) {
        const heading = document.createElement("h4");
        heading.textContent = group.category;
        picker.appendChild(heading);
        for (const item of group.items) {
            const button = document.createElement("button");
            button.textContent = item.label;
            button.title = item.description;
            button.disabled = item.disabled;
            // studyProvider creates any study from its type, with default settings
            button.onclick = () => chart.attachStudy(studyProvider.getStudy(item.type));
            picker.appendChild(button);
        }
    }
}
search.oninput = renderPicker;
renderPicker();
