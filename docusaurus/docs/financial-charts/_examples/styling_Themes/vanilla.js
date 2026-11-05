import "scichart-scitrader/scitrader.css";
import { applyThemeCssVariables, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, MACDStudy, OHLCStudy, RSIStudy, SciFinanceChartPanel, SCITRADER_DARK_THEME, SCITRADER_THEME_LIST, SMAStudy, themeDisplayName, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
async function createChart() {
    // 1. Create the chart with a theme. Leave `theme` out for SCITRADER_DARK_THEME
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        theme: SCITRADER_DARK_THEME,
        studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 20 }), new RSIStudy(), new MACDStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // 2. Switch theme. setTheme restyles the live chart in place: backgrounds, axes, candles,
    // studies, legend, crosshair and the pane controls
    function applyTheme(theme) {
        chart.setTheme(theme);
        // HTML outside the chart, like this toolbar, reads the theme from CSS variables
        // (--st-ui-text, --st-ui-accent, …): write them on a parent of it
        applyThemeCssVariables(document.body, theme);
        renderToolbar(theme);
    }
    // The three built-in themes: Dark, Light and Ocean
    function renderToolbar(current) {
        const toolbar = document.getElementById("toolbar");
        Object.assign(toolbar.style, toolbarStyle);
        toolbar.replaceChildren(...SCITRADER_THEME_LIST.map((theme) => {
            const button = document.createElement("button");
            button.textContent = themeDisplayName(theme); // the name without "SciTrader "
            Object.assign(button.style, buttonStyle(theme === current));
            button.onclick = () => applyTheme(theme);
            return button;
        }));
    }
    applyTheme(SCITRADER_DARK_THEME);
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
// The toolbar's colours are the theme's CSS variables, so it follows the theme too
const toolbarStyle = {
    display: "flex",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};
const buttonStyle = (selected) => ({
    padding: "4px 14px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
createChart();
