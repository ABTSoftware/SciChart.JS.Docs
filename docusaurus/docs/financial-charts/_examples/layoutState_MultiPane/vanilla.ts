import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    LayoutDirection,
    MACDStudy,
    OHLCStudy,
    PaneId,
    RSIStudy,
    SciFinanceChartPanel,
    StochasticStudy,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div id="toolbar"></div>
// <div id="chart" style="height: 800px"></div>
const container = document.getElementById("chart");
const toolbar = document.getElementById("toolbar");

// Hover the top of a pane for its control bar: lock size, Y-axis autorange, move, maximise, hide
// and close. Drag a divider to resize.
let paneControls = { touch: false, visible: true };

let financeChartPanel: ISciFinanceChartPanelApi = await SciFinanceChartPanel.create(container, {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    // true: every pane is a sub-chart of one SciChart surface (fastest). false: a surface per pane
    useSubCharts: true,
    // "column": panes stacked; "row": side by side
    direction: "column",
    // A price pane four times the size of each indicator pane
    paneSizing: { [PaneId.DEFAULT.value]: { grow: 4 } },
    paneControls,
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy(), new MACDStudy(), new StochasticStudy()],
});

// Sub-chart mode and direction are fixed when a chart is created. To change them, rebuild it,
// carrying the studies and layout over with toJSON / fromJSON.
async function rebuild(useSubCharts: boolean, direction: LayoutDirection) {
    const state = financeChartPanel.toJSON();
    financeChartPanel.cleanup();
    financeChartPanel = await SciFinanceChartPanel.fromJSON(
        container,
        { ...state, layout: { ...state.layout, direction } },
        { useSubCharts, paneControls }
    );
}

function addButton(label: string, onClick: () => void) {
    const button = document.createElement("button");
    button.textContent = label;
    button.onclick = onClick;
    toolbar.appendChild(button);
}

addButton("Sub-charts, stacked", () => rebuild(true, "column"));
addButton("Multi-chart, side by side", () => rebuild(false, "row"));

// paneGroupApi drives the same layout from code
let synced = true;
addButton("Toggle axis sync", () => {
    synced = !synced;
    financeChartPanel.paneGroupApi.toggleAxisSync(synced);
});

// A pane that isn't a chart, laid out with the others
addButton("Add custom pane", () => {
    const content = document.createElement("div");
    content.textContent = "Your content";
    financeChartPanel.addCustomPane(content);
});

// The touch layout, for phones and tablets: each control bar moves into a drawer at the pane's
// right edge (tap or swipe its handle), and the dividers get a wider grip. The chart doesn't
// detect touch screens itself: your page decides, and setPaneControls switches a live chart.
addButton("Toggle touch layout", () => {
    paneControls = { ...paneControls, touch: !paneControls.touch };
    financeChartPanel.setPaneControls(paneControls);
});

addButton("Show / hide control bars", () => {
    paneControls = { ...paneControls, visible: !paneControls.visible };
    financeChartPanel.setPaneControls(paneControls);
});
