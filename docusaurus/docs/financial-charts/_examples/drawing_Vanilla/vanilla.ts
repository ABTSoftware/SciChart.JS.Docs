import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    DrawingToolbar,
    DrawingToolsController,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div style="display: flex; height: 600px">
//     <div id="drawing-toolbar" style="display: flex"></div>
//     <div id="chart" style="position: relative; flex: 1"></div>
// </div>
// <span id="drawing-count"></span> <button id="clear">Clear drawings</button>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "3M",
    studies: [new OHLCStudy(), new VolumeStudy()],
});

// The drawing machinery: placement, freehand and eraser on every pane, a floating edit toolbar on
// the selected drawing, and pan suspended while a tool is in use
const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);

// The SDK's drawing rail, in plain DOM. Any control can drive the tools too: drawing.selectTool(id)
const toolbar = DrawingToolbar.create(document.getElementById("drawing-toolbar"), drawing);

// Follow the drawings on the chart, and remove them all
const count = document.getElementById("drawing-count");
drawing.drawingsChanged.subscribe((drawings) => (count.textContent = `${drawings.length} drawings`));
document.getElementById("clear").onclick = () => drawing.remove(); // no argument: remove every drawing

// When the page goes away:
// toolbar.destroy(); drawing.detach(); financeChartPanel.cleanup();
