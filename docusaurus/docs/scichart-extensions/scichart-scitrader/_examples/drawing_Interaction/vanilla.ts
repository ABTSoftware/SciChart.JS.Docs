import "scichart-scitrader/scitrader.css";
import { SciChartSurface } from "scichart";
import { ETradingAnnotationType } from "scichart-financial-tools";
import {
    AnnotationKeyboardSelectionModifier,
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    DrawingToolsController,
    idbPriceStore,
    OHLCStudy,
    OnChartButtonsModifier,
    OnChartKeyboardZoomPanModifier,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div id="chart" style="height: 600px"></div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "ETHUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "1M",
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

// Touch: a long press selects a drawing. `touch` also switches placement to a drag-to-aim cursor,
// for a mouse too, so turn it on only on a touch screen.
const drawing = DrawingToolsController.attach(chart, { touch: matchMedia("(pointer: coarse)").matches });

function addModifiers(surface: SciChartSurface) {
    surface.chartModifiers.add(
        // Click a pane, then: arrow keys pan, + / - zoom, 0 resets (Shift for bigger steps)
        new OnChartKeyboardZoomPanModifier(),
        // N / P step through drawings, Delete removes the selected one, Esc deselects,
        // A draws again with the last tool used (freehand until one has been)
        new AnnotationKeyboardSelectionModifier({
            onAddAnnotation: () =>
                drawing.selectTool(drawing.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation),
            onCancelPlacement: () => drawing.stop(),
        }),
        // Zoom, pan and reset buttons on the pane under the mouse
        new OnChartButtonsModifier({ visible: true })
    );
}

// Add the modifiers to every pane now, and to any pane a study adds later
const done = new Set<SciChartSurface>();
const addToAllPanes = () =>
    chart.chartPanes.forEach(({ surface }) => {
        if (surface && !done.has(surface)) {
            done.add(surface);
            addModifiers(surface);
        }
    });
addToAllPanes();
chart.paneConfigured.subscribe(addToAllPanes);

// When the page goes away:
// chart.paneConfigured.unsubscribe(addToAllPanes); drawing.detach(); financeChartPanel.cleanup();
