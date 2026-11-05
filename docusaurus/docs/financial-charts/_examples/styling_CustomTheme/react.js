import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, createSciTraderTheme, defaultExchangeProvider, idbPriceStore, OHLCStudy, RSIStudy, SCITRADER_DARK_THEME, SCITRADER_LIGHT_THEME, SMAStudy, themeDisplayName, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView, SciTraderThemeProvider, useSciTraderTheme, useSciTraderThemeSwitch, } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// 1. A custom theme in code. createSciTraderTheme copies a base theme and changes only what you list,
// so every colour you leave out keeps the base theme's value
const MIDNIGHT_GOLD = createSciTraderTheme(SCITRADER_DARK_THEME, {
    name: "Midnight Gold",
    chart: {
        background: "#0E0E14",
        axisBackground: "#0E0E14",
        gridLine: "#1C1C26",
        currentPriceLine: "#E8B931",
        crosshairLabelBackground: "#E8B931",
        crosshairLabelText: "#0E0E14",
    },
    studies: {
        // Candles: hollow-looking bodies with bright outlines
        OHLC: { brushUp: "#E8B93133", brushDown: "#8A8FA833", strokeUp: "#E8B931", strokeDown: "#8A8FA8" },
        Volume: { volumeUpColor: "#E8B93166", volumeDownColor: "#8A8FA866" },
        SMA: { strokeColor: "#FFFFFF" },
        RSI: { strokeColor: "#E8B931" },
    },
    ui: { accent: "#C99A1E", toolbarBackground: "#15151E", selection: "#E8B931" },
});
// 2. A custom theme from CSS: your brand colours as CSS variables, read into a theme. In an app, they
// would be in your stylesheet; here they are added to the page
document.head.appendChild(document.createElement("style")).textContent = `
:root {
    --brand-background: #F7F5EF;
    --brand-grid: #E6E1D3;
    --brand-up: #2E7D5B;
    --brand-down: #B5452E;
    --brand-accent: #3D5A80;
}`;
function themeFromCss() {
    const css = getComputedStyle(document.documentElement);
    const brand = (name) => css.getPropertyValue(`--brand-${name}`).trim();
    return createSciTraderTheme(SCITRADER_LIGHT_THEME, {
        name: "Brand",
        chart: {
            background: brand("background"),
            axisBackground: brand("background"),
            gridLine: brand("grid"),
            currentPriceLine: brand("accent"),
            crosshairLabelBackground: brand("accent"),
        },
        studies: {
            OHLC: { brushUp: brand("up"), brushDown: brand("down"), strokeUp: brand("up"), strokeDown: brand("down") },
            Volume: { volumeUpColor: brand("up"), volumeDownColor: brand("down") },
            SMA: { strokeColor: brand("accent") },
            RSI: { strokeColor: brand("accent") },
        },
        ui: { accent: brand("accent"), selection: brand("accent"), toolbarBackground: brand("background") },
    });
}
const THEMES = [SCITRADER_DARK_THEME, MIDNIGHT_GOLD, themeFromCss()];
export function CustomThemeChart() {
    // 3. A custom theme works like a built-in one. Pass your themes to the provider's `themes`,
    // so a theme picker offers them
    const [theme, setTheme] = React.useState(MIDNIGHT_GOLD);
    return (React.createElement(SciTraderThemeProvider, { theme: theme, onThemeChange: setTheme, themes: THEMES },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
            React.createElement(ThemePicker, null),
            React.createElement(Chart, null))));
}
function ThemePicker() {
    const themeSwitch = useSciTraderThemeSwitch();
    if (!themeSwitch)
        return null;
    return (React.createElement("div", { style: toolbarStyle }, themeSwitch.themes.map((theme) => (React.createElement("button", { key: theme.name, style: buttonStyle(theme === themeSwitch.theme), onClick: () => themeSwitch.setTheme(theme) }, themeDisplayName(theme))))));
}
function Chart() {
    // The chart takes the theme itself: in `config` when it is created, then through setTheme
    const theme = useSciTraderTheme();
    const [api, setApi] = React.useState();
    React.useEffect(() => api?.financeApi.setTheme(theme), [api, theme]);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        theme,
        studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 20 }), new RSIStudy()],
    }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return (React.createElement("div", { style: { flex: 1, minHeight: 0 } },
        React.createElement(SciFinanceChartView, { config: config, onInit: setApi })));
}
// The toolbar's colours are the theme's CSS variables, so it follows the theme too
const toolbarStyle = {
    display: "flex",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};
const buttonStyle = (selected) => ({
    padding: "4px 14px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
