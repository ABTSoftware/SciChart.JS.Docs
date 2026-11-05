import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    FinChartLegendModifier,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciTraderTheme,
    OHLCStudy,
    RSIStudy,
    SCITRADER_DARK_THEME,
    SCITRADER_LIGHT_THEME,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, SciTraderThemeProvider } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function ChartStylingChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [theme, setTheme] = React.useState<ISciTraderTheme>(SCITRADER_DARK_THEME);
    const [gridLines, setGridLines] = React.useState(true);
    const [largeText, setLargeText] = React.useState(false);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
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
        }),
        []
    );

    // A theme switch restyles the chart, but keeps axisDefaults, applyAxisStyle and the orange SMA
    React.useEffect(() => api?.financeApi.setTheme(theme), [api, theme]);

    // applyAxisStyle changes axis options on a live chart
    React.useEffect(() => api?.financeApi.applyAxisStyle({ drawMajorGridLines: gridLines }), [api, gridLines]);

    // 3. The legend is drawn by FinChartLegendModifier: its setters style it
    React.useEffect(() => {
        if (!api) return;
        const chart = api.financeApi;
        const legend = chart.finChartModifiers
            .asArray()
            .find((m): m is FinChartLegendModifier => m instanceof FinChartLegendModifier);
        const fontSize = largeText ? 15 : theme.chart.axisLabelFontSize;
        chart.applyAxisStyle({ labelStyle: { fontSize } }); // axis labels
        legend?.setLegendFontSize(largeText ? 15 : theme.chart.legendFontSize); // the legend
        legend?.setAxisLabelFont(fontSize); // the crosshair's labels on the axes
    }, [api, largeText, theme]);

    return (
        // The provider gives the toolbar the theme's CSS variables
        <SciTraderThemeProvider theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={toolbarStyle}>
                    <Toggle text="Dark" on={theme === SCITRADER_DARK_THEME} onClick={() => setTheme(SCITRADER_DARK_THEME)} />
                    <Toggle text="Light" on={theme === SCITRADER_LIGHT_THEME} onClick={() => setTheme(SCITRADER_LIGHT_THEME)} />
                    <Toggle text="Gridlines" on={gridLines} onClick={() => setGridLines(!gridLines)} />
                    <Toggle text="Large text" on={largeText} onClick={() => setLargeText(!largeText)} />
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <SciFinanceChartView config={config} onInit={setApi} />
                </div>
            </div>
        </SciTraderThemeProvider>
    );
}

function Toggle({ text, on, onClick }: { text: string; on: boolean; onClick: () => void }) {
    return (
        <button style={buttonStyle(on)} onClick={onClick}>
            {text}
        </button>
    );
}

// The toolbar's colours are the theme's CSS variables, so it follows the theme too
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};

const buttonStyle = (selected: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
