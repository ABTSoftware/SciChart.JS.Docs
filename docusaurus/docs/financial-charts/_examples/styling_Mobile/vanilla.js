import "scichart-scitrader/scitrader.css";
import { applyThemeCssVariables, CandleInterval, CandleTypeSelector, CoinbaseExchange, createSciTraderTheme, defaultExchangeProvider, FinChartLegendModifier, idbPriceStore, IntervalSelector, OHLCStudy, RSIStudy, SciFinanceChartPanel, SCITRADER_DARK_THEME, SCITRADER_LIGHT_THEME, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div id="app" style="display: flex; flex-direction: column; height: 100%">
//     <div id="options"></div>
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// 1. Touch-sized controls, in CSS. In an app, put these rules in your stylesheet inside
// `@media (pointer: coarse) { … }`, so they apply on touch screens. Here, the "Phone" button adds a
// class instead, so you can see them with a mouse
document.head.appendChild(document.createElement("style")).textContent = `
.phone .st-toggle-group__button { min-width: 44px; min-height: 40px; font-size: 15px; }
.phone .st-candle-type-selector { min-height: 40px; font-size: 15px; }
`;
// 2. Larger text on the chart: a theme variant with bigger axis labels and legend
const phoneVariant = (theme) => createSciTraderTheme(theme, { chart: { axisLabelFontSize: 15, legendFontSize: 15 } });
// 3. Follow the device's light or dark setting
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
let scheme = "system";
let phone = false;
async function createChart() {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1W",
        theme: currentTheme(),
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    });
    const chart = financeChartPanel.financeApi;
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, barStyle);
    IntervalSelector.create(toolbar, {
        value: CandleInterval.ONE_HOUR,
        intervals: [CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY],
        onChange: (interval) => chart.changeInterval(interval),
    });
    CandleTypeSelector.create(toolbar, { value: chart.getCandleType(), onChange: (type) => chart.setCandleType(type) });
    function update() {
        const theme = currentTheme();
        chart.setTheme(theme);
        // The legend doesn't redraw at a new legendFontSize on setTheme yet, so set it on the legend too
        chart.finChartModifiers
            .asArray()
            .find((m) => m instanceof FinChartLegendModifier)
            ?.setLegendFontSize(theme.chart.legendFontSize);
        applyThemeCssVariables(document.body, theme);
        document.getElementById("app").classList.toggle("phone", phone);
        renderOptions();
    }
    function renderOptions() {
        const bar = document.getElementById("options");
        Object.assign(bar.style, barStyle);
        const option = (label, selected, onClick) => {
            const button = document.createElement("button");
            button.textContent = label;
            Object.assign(button.style, buttonStyle(selected));
            button.onclick = () => {
                onClick();
                update();
            };
            return button;
        };
        bar.replaceChildren(option(`System (${prefersDark.matches ? "dark" : "light"})`, scheme === "system", () => (scheme = "system")), option("Dark", scheme === "dark", () => (scheme = "dark")), option("Light", scheme === "light", () => (scheme = "light")), option("Desktop", !phone, () => (phone = false)), option("Phone", phone, () => (phone = true)));
    }
    // When the device switches between light and dark, follow it
    prefersDark.addEventListener("change", () => scheme === "system" && update());
    update();
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
function currentTheme() {
    const dark = scheme === "dark" || (scheme === "system" && prefersDark.matches);
    const base = dark ? SCITRADER_DARK_THEME : SCITRADER_LIGHT_THEME;
    return phone ? phoneVariant(base) : base;
}
// The bars' colours are the theme's CSS variables, so they follow the theme too
const barStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};
const buttonStyle = (selected) => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
createChart();
