import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    MACDStudy,
    OHLCStudy,
    PaneId,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// 1. Give each indicator pane an id, so you can size it and find it later. Keep these PaneId
// objects: the chart looks panes up by the object, not by its value
const RSI_PANE = new PaneId("rsi");
const MACD_PANE = new PaneId("macd");
const PANES = [
    { id: PaneId.DEFAULT, label: "Price" }, // the price pane
    { id: RSI_PANE, label: "RSI" },
    { id: MACD_PANE, label: "MACD" },
];

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [
            new OHLCStudy(),
            new VolumeStudy(),
            new RSIStudy({ paneId: RSI_PANE }),
            new MACDStudy({ paneId: MACD_PANE }),
        ],
        // 2. The pane sizes, by pane id: `grow` shares the free space (default 1), `size` is fixed pixels
        paneSizing: {
            [PaneId.DEFAULT.value]: { grow: 3 }, // the price pane takes 3 shares
            [RSI_PANE.value]: { size: 110 }, // the RSI pane is 110 px high
            [MACD_PANE.value]: { grow: 1 }, // the MACD pane takes 1 share
        },
    });

    // 3. Read and set pane state in code. The buttons below call these, and the pane control bars
    // (hover a pane) change the same state, so the toolbar redraws on every change
    const render = () => renderToolbar(toolbar, financeChartPanel);
    financeChartPanel.paneGroupApi.stateChanged.subscribe(render); // order, size, hidden, maximised, closed
    for (const { id } of PANES) {
        financeChartPanel.financeApi.getYAxisAutoRangeController(id)?.yAxisAutoRangeChanged.subscribe(render);
    }
    render();

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

function renderToolbar(toolbar: HTMLElement, financeChartPanel: ISciFinanceChartPanelApi) {
    const group = financeChartPanel.paneGroupApi; // pane layout state, by pane id (a string)
    const chart = financeChartPanel.financeApi;

    const rows = PANES.filter(({ id }) => group.getPane(id.value)).map(({ id, label }) => {
        // Y-axis autorange: on, the pane's Y axis fits the visible candles; off, it stays as the user set it
        const autoRange = chart.getYAxisAutoRangeController(id);
        const isMaximised = group.getExpandedId() === id.value;
        const isVisible = group.isVisible(id.value);

        return row(
            `${label}${isVisible ? "" : " (hidden)"}`,
            button(`Autorange ${autoRange?.isYAxisAutoRangeEnabled ? "on" : "off"}`, () => {
                autoRange.isYAxisAutoRangeEnabled = !autoRange.isYAxisAutoRangeEnabled;
            }),
            // setExpanded(id) maximises a pane; setExpanded(null) restores them all
            button(isMaximised ? "Restore" : "Maximise", () => group.setExpanded(isMaximised ? null : id.value)),
            button(isVisible ? "Hide" : "Show", () => group.setVisible(id.value, !isVisible)),
            // Closing a pane removes it, and detaches its studies. The price pane can't be closed
            id === PaneId.DEFAULT ? null : button("Close", () => group.removePane(id.value))
        );
    });

    // setPaneSizes takes a size for every pane, and scales them to fill the chart: the sizes act as
    // proportions. lockPaneSize fixes one pane at an exact size in pixels, until unlockPaneSize
    const paneIds = group.getAllPanes().map((pane) => pane.id);
    const proportions = (price: number, indicator: number) =>
        group.setPaneSizes(paneIds.map((id) => ({ id, size: id === PaneId.DEFAULT.value ? price : indicator })));
    const rsiLocked = group.getPane(RSI_PANE.value) && group.isSizeLocked(RSI_PANE.value);
    const sizes = row(
        "Sizes",
        button("All equal", () => proportions(1, 1)),
        button("Price 4 : 1", () => proportions(4, 1)),
        group.getPane(RSI_PANE.value)
            ? button(rsiLocked ? "Unlock RSI" : "Lock RSI at 80 px", () =>
                  rsiLocked ? group.unlockPaneSize(RSI_PANE.value) : group.lockPaneSize(RSI_PANE.value, 80)
              )
            : null
    );

    toolbar.replaceChildren(...rows, sizes);
}

// A labelled row of buttons
function row(label: string, ...buttons: Array<HTMLButtonElement | null>) {
    const div = document.createElement("div");
    Object.assign(div.style, { display: "flex", alignItems: "center", gap: "4px" });
    const name = document.createElement("span");
    Object.assign(name.style, { width: "110px", color: "var(--st-ui-text-muted, #9da2bc)" });
    name.textContent = label;
    div.append(name, ...buttons.filter(Boolean));
    return div;
}

function button(text: string, onClick: () => void) {
    const b = document.createElement("button");
    b.textContent = text;
    Object.assign(b.style, buttonStyle);
    b.onclick = onClick;
    return b;
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    fontSize: "13px",
};

const buttonStyle: Partial<CSSStyleDeclaration> = {
    padding: "3px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: "4px",
    background: "var(--st-ui-surface, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "inherit",
    cursor: "pointer",
};

createChart();
