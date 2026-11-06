import "scichart-scitrader/scitrader.css";
import { SciChartSurface } from "scichart";
import {
    CandleInterval,
    CoinbaseExchange,
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

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="skins"></div>
//     <div id="skinned" style="display: flex; flex: 1; min-height: 0">
//         <div id="tools"></div>
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//     </div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// CSS overrides for the SDK's controls. In an app, these rules go in your own stylesheet, loaded
// after scitrader.css. Each skin is scoped under a class on an element around the chart, which keeps
// it to this chart and makes each rule more specific than the scitrader.css rule it replaces
const SKINS: Array<{ name: string; css: string }> = [
    { name: "Default", css: "/* No overrides: scitrader.css alone */" },
    {
        name: "Rounded",
        css: `
/* Round drawing tools */
.skin .st-drawing-toolbar__button { border-radius: 50%; }

/* Pill-shaped zoom buttons and pane control bars */
.skin .st-on-chart-buttons,
.skin .st-pane-control-bar { border-radius: 999px; padding-left: 8px; padding-right: 8px; }
.skin .st-pane-control-bar__button,
.skin .st-on-chart-buttons__button { border-radius: 50%; }`,
    },
    {
        name: "Square and flat",
        css: `
/* Square corners, and no borders on idle buttons */
.skin .st-drawing-toolbar__button,
.skin .st-on-chart-buttons,
.skin .st-on-chart-buttons__button,
.skin .st-pane-control-bar,
.skin .st-pane-control-bar__button { border-radius: 0; }
.skin .st-drawing-toolbar__button:not([aria-pressed="true"]) { border-color: transparent; }`,
    },
    {
        name: "Theme variables",
        css: `
/* Change the theme's colours for these controls only, through its CSS variables.
   The drawing toolbar is outside the chart, so it reads them from any parent: */
.skin {
    --st-ui-menu-background: #1f1a12;
    --st-ui-selection: #f59e0b;
}

/* The chart writes the theme's variables on its own container, which wins over a parent.
   To reach controls inside the chart, set the variables on them: */
.skin .st-pane-control-bar,
.skin .st-on-chart-buttons {
    --st-ui-toolbar-background: #1f1a12;
    --st-ui-toolbar-active: #f59e0b;
    --st-ui-icon: #f59e0b;
}`,
    },
];

async function createChart() {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    });
    const chart = financeChartPanel.financeApi;

    // Controls to restyle: the drawing tools rail...
    const drawing = DrawingToolsController.attach(chart);
    DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });

    // ...the zoom and pan buttons on every pane, shown all the time so their style is easy to see,
    // and each pane's control bar: hover a pane to see it
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

    // Switch skins: put the picked skin's rules in a <style> element
    document.getElementById("skinned").classList.add("skin");
    const style = document.head.appendChild(document.createElement("style"));
    const bar = document.getElementById("skins");
    Object.assign(bar.style, barStyle);
    const render = (current: string) =>
        bar.replaceChildren(
            ...SKINS.map((skin) => {
                const button = document.createElement("button");
                button.textContent = skin.name;
                Object.assign(button.style, buttonStyle(skin.name === current));
                button.onclick = () => {
                    style.textContent = skin.css;
                    render(skin.name);
                };
                return button;
            })
        );
    render("Default");

    // When the page goes away: drawing.detach(); financeChartPanel.cleanup();
    return financeChartPanel;
}

// The skin buttons use the theme's CSS variables, with the dark theme's values as fallbacks
const barStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle = (selected: boolean): Partial<CSSStyleDeclaration> => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent, #5c5cff)" : "var(--st-ui-button-background, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px sans-serif",
    cursor: "pointer",
});

createChart();
