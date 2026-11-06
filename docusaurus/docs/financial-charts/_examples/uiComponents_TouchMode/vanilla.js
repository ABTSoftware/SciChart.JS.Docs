import "scichart-scitrader/scitrader.css";
import { XAxisDragModifier, ZoomPanModifier } from "scichart";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, DrawingToolbar, DrawingToolsController, FinChartLegendModifier, FinChartZoomExtentsModifier, idbPriceStore, OHLCStudy, RSIStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="tools"></div>
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//     </div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// 1. Your app decides between touch and mouse: the chart doesn't detect it. Here, a coarse pointer
// (a finger) means touch. The buttons override it, to try touch mode with a mouse
const touchScreen = matchMedia("(pointer: coarse)");
let mode = "auto";
const isTouch = () => mode === "touch" || (mode === "auto" && touchScreen.matches);
let current;
let crosshair = false;
// 2. Create the chart in the mode. Some settings are read only when a chart is created, so to
// change mode, create the chart again (save it with toJSON() first to keep its studies and drawings)
async function createChart(touch) {
    current?.tools.destroy();
    current?.drawing.detach();
    current?.financeChartPanel.cleanup();
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1W",
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        // Touch: each pane's control bar sits in a drawer at its right edge (there is no hover to
        // show it), and the dividers between panes get a wider grip
        paneControls: { touch },
    });
    const chart = financeChartPanel.financeApi;
    // Touch: a long press selects a drawing, and placement uses a cursor you drag to aim and tap to
    // commit. A finished drawing isn't selected, so its editor doesn't cover it. When a tool
    // finishes, resumeGestures turns panning back on, unless the crosshair has it
    const drawing = DrawingToolsController.attach(chart, {
        touch,
        selectFinishedDrawing: !touch,
        resumeGestures: () => setPanAndZoom(chart, !(touch && crosshair)),
    });
    const tools = DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });
    current = { financeChartPanel, drawing, tools };
    // The crosshair and legend follow the mouse, so they start on with a mouse, and off on touch
    setCrosshair(!touch);
}
// 3. The crosshair. With a mouse, hovering moves it and dragging pans. On touch, one finger does
// both, so while the crosshair is on, a drag moves it and panning is off
function setCrosshair(on) {
    crosshair = on;
    const chart = current.financeChartPanel.financeApi;
    // FinChartLegendModifier draws the crosshair and the legend
    chart.finChartModifiers
        .asArray()
        .find((m) => m instanceof FinChartLegendModifier)
        ?.setCursorEnabled(on);
    if (isTouch())
        setPanAndZoom(chart, !on);
    renderToolbar();
}
// Pan, X-axis drag and double-tap zoom-to-fit, on every pane. Pinch-to-zoom works on touch screens
// without any setup
function setPanAndZoom(chart, enabled) {
    chart.chartPanes.forEach(({ surface }) => surface.chartModifiers.asArray().forEach((m) => {
        if (m instanceof ZoomPanModifier || m instanceof XAxisDragModifier || m instanceof FinChartZoomExtentsModifier) {
            m.isEnabled = enabled;
        }
    }));
}
function renderToolbar() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const modes = [
        ["auto", `Auto (${touchScreen.matches ? "touch" : "mouse"})`],
        ["touch", "Touch"],
        ["mouse", "Mouse"],
    ];
    toolbar.replaceChildren(...modes.map(([value, label]) => button(label, value === mode, () => {
        mode = value;
        createChart(isTouch());
    })), button(`Crosshair ${crosshair ? "on" : "off"}`, crosshair, () => setCrosshair(!crosshair)));
}
function button(text, selected, onClick) {
    const b = document.createElement("button");
    b.textContent = text;
    Object.assign(b.style, buttonStyle(selected));
    b.onclick = onClick;
    return b;
}
// In Auto, follow the screen when it changes, e.g. a tablet's keyboard and trackpad attached
touchScreen.addEventListener("change", () => mode === "auto" && createChart(isTouch()));
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = (selected) => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent, #5c5cff)" : "var(--st-ui-surface, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px inherit",
    cursor: "pointer",
});
createChart(isTouch());
