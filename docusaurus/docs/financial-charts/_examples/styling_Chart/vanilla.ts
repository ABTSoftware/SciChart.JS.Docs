import "scichart-scitrader/scitrader.css";
import {
    applyThemeCssVariables,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    FinChartLegendModifier,
    idbPriceStore,
    ISciTraderTheme,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SCITRADER_DARK_THEME,
    SCITRADER_LIGHT_THEME,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

async function createChart() {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        theme: SCITRADER_DARK_THEME,
        // 1. Axis options for every axis, on every pane: any SciChart axis option. These win over the theme
        axisDefaults: {
            drawMajorBands: false, // no alternating bands
            drawMinorGridLines: false,
        },
        studies: [
            new OHLCStudy(),
            new VolumeStudy(),
            // 2. A colour passed to a study is your choice: a theme switch leaves it alone
            new SMAStudy({ length: 20, renderOptions: { stroke: "#F59E0B", strokeThickness: 2 } }),
            new RSIStudy(),
        ],
    });
    const chart = financeChartPanel.financeApi;

    // 3. The legend is drawn by FinChartLegendModifier: its setters style it
    const legend = chart.finChartModifiers
        .asArray()
        .find((m): m is FinChartLegendModifier => m instanceof FinChartLegendModifier);

    let theme = SCITRADER_DARK_THEME;
    let gridLines = true;
    let largeText = false;

    const actions: Array<[string, boolean, () => void]> = [
        // A theme switch restyles the chart, but keeps axisDefaults, applyAxisStyle and the orange SMA
        ["Dark", theme === SCITRADER_DARK_THEME, () => setTheme(SCITRADER_DARK_THEME)],
        ["Light", theme === SCITRADER_LIGHT_THEME, () => setTheme(SCITRADER_LIGHT_THEME)],
        // applyAxisStyle changes axis options on a live chart
        [
            "Gridlines",
            gridLines,
            () => {
                gridLines = !gridLines;
                chart.applyAxisStyle({ drawMajorGridLines: gridLines });
            },
        ],
        [
            "Large text",
            largeText,
            () => {
                largeText = !largeText;
                const fontSize = largeText ? 15 : theme.chart.axisLabelFontSize;
                chart.applyAxisStyle({ labelStyle: { fontSize } }); // axis labels
                legend?.setLegendFontSize(largeText ? 15 : theme.chart.legendFontSize); // the legend
                legend?.setAxisLabelFont(fontSize); // the crosshair's labels on the axes
            },
        ],
    ];

    function setTheme(next: ISciTraderTheme) {
        theme = next;
        chart.setTheme(next);
        // setTheme sets the legend to the theme's size: keep the larger text if it is on
        legend?.setLegendFontSize(largeText ? 15 : next.chart.legendFontSize);
        applyThemeCssVariables(document.body, next); // for the toolbar
    }

    function renderToolbar() {
        const toolbar = document.getElementById("toolbar");
        Object.assign(toolbar.style, toolbarStyle);
        toolbar.replaceChildren(
            ...actions.map(([label, , action]) => {
                const button = document.createElement("button");
                button.textContent = label;
                Object.assign(button.style, buttonStyle(isOn(label)));
                button.onclick = () => {
                    action();
                    renderToolbar();
                };
                return button;
            })
        );
    }
    const isOn = (label: string) =>
        ({
            Dark: theme === SCITRADER_DARK_THEME,
            Light: theme === SCITRADER_LIGHT_THEME,
            Gridlines: gridLines,
            "Large text": largeText,
        })[label];

    applyThemeCssVariables(document.body, theme);
    renderToolbar();

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

// The toolbar's colours are the theme's CSS variables, so it follows the theme too
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};

const buttonStyle = (selected: boolean): Partial<CSSStyleDeclaration> => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});

createChart();
