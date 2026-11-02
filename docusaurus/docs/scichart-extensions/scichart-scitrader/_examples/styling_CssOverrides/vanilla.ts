import "scichart-scitrader/scitrader.css";
import { SciChartSurface } from "scichart";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    DrawingToolbar,
    DrawingToolsController,
    idbPriceStore,
    OHLCStudy,
    OnChartButtonsModifier,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { CSS_SKINS } from "./skins";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// The SDK's toolbars and controls take their look from scitrader.css, so plain CSS restyles them.
// Every element has an st-… class; see skins.ts for the rules.
//
// <div id="skins"></div>
// <div id="skinned" style="display: flex; height: 600px">
//     <div id="drawing-toolbar"></div>
//     <div id="chart" style="flex: 1"></div>
// </div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "3M",
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

// Controls to restyle: the drawing toolbar (and, once you draw and select something, its quick-edit toolbar)...
const drawing = DrawingToolsController.attach(chart);
DrawingToolbar.create(document.getElementById("drawing-toolbar"), drawing);

// ...and the zoom / pan buttons on every pane, shown all the time so their style is easy to see.
// Hover a pane for its control bar; hide a pane for the restore strip.
const withButtons = new Set<SciChartSurface>();
const addButtons = () =>
    chart.chartPanes.forEach(({ surface }) => {
        if (surface && !withButtons.has(surface)) {
            withButtons.add(surface);
            surface.chartModifiers.add(new OnChartButtonsModifier({ visible: true }));
        }
    });
addButtons();
chart.paneConfigured.subscribe(addButtons); // panes added later, e.g. by a new study

// Switch between the CSS skins. In an app, the rules would live in your own stylesheet.
const style = document.createElement("style");
document.head.appendChild(style);
const skinned = document.getElementById("skinned");

for (const skin of CSS_SKINS) {
    const button = document.createElement("button");
    button.textContent = skin.name;
    button.onclick = () => {
        style.textContent = skin.css;
        skinned.className = `skin-${skin.id}`; // each skin's rules are scoped under this class
    };
    document.getElementById("skins").appendChild(button);
}
