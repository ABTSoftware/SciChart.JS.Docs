import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, createSciTraderTheme, defaultExchangeProvider, ECandleType, FinChartLegendModifier, idbPriceStore, OHLCStudy, RSIStudy, SCITRADER_DARK_THEME, SCITRADER_LIGHT_THEME, VolumeStudy, } from "scichart-scitrader";
import { CandleTypeSelector, IntervalSelector, SciFinanceChartView, SciTraderThemeProvider, } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// 1. Touch-sized controls, in CSS. In an app, put these rules in your stylesheet inside
// `@media (pointer: coarse) { … }`, so they apply on touch screens. Here, the "Phone" button adds a
// class instead, so you can see them with a mouse
const TOUCH_CSS = `
.phone .st-toggle-group__button { min-width: 44px; min-height: 40px; font-size: 15px; }
.phone .st-candle-type-selector { min-height: 40px; font-size: 15px; }
`;
// 2. Larger text on the chart: a theme variant with bigger axis labels and legend
const phoneVariant = (theme) => createSciTraderTheme(theme, { chart: { axisLabelFontSize: 15, legendFontSize: 15 } });
// 3. Follow the device's light or dark setting
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
function usePrefersDark() {
    return React.useSyncExternalStore((onChange) => {
        prefersDark.addEventListener("change", onChange);
        return () => prefersDark.removeEventListener("change", onChange);
    }, () => prefersDark.matches, () => true // server render: assume dark
    );
}
const INTERVALS = [CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY];
export function ResponsiveChart() {
    const systemDark = usePrefersDark();
    const [scheme, setScheme] = React.useState("system");
    const [phone, setPhone] = React.useState(false);
    const dark = scheme === "dark" || (scheme === "system" && systemDark);
    const theme = React.useMemo(() => {
        const base = dark ? SCITRADER_DARK_THEME : SCITRADER_LIGHT_THEME;
        return phone ? phoneVariant(base) : base;
    }, [dark, phone]);
    const [api, setApi] = React.useState();
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const [candleType, setCandleType] = React.useState(ECandleType.Candlestick);
    // The chart takes the theme through setTheme
    React.useEffect(() => {
        if (!api)
            return;
        const chart = api.financeApi;
        chart.setTheme(theme);
        // The legend doesn't redraw at a new legendFontSize on setTheme yet, so set it on the legend too
        chart.finChartModifiers
            .asArray()
            .find((m) => m instanceof FinChartLegendModifier)
            ?.setLegendFontSize(theme.chart.legendFontSize);
    }, [api, theme]);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1W",
        theme,
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const option = (label, selected, onClick) => (React.createElement("button", { key: label, style: buttonStyle(selected), onClick: onClick }, label));
    return (React.createElement(SciTraderThemeProvider, { theme: theme },
        React.createElement("style", null, TOUCH_CSS),
        React.createElement("div", { className: phone ? "phone" : undefined, style: { display: "flex", flexDirection: "column", height: "100%" } },
            React.createElement("div", { style: barStyle },
                option(`System (${systemDark ? "dark" : "light"})`, scheme === "system", () => setScheme("system")),
                option("Dark", scheme === "dark", () => setScheme("dark")),
                option("Light", scheme === "light", () => setScheme("light")),
                option("Desktop", !phone, () => setPhone(false)),
                option("Phone", phone, () => setPhone(true))),
            React.createElement("div", { style: barStyle },
                React.createElement(IntervalSelector, { value: interval, intervals: INTERVALS, onChange: (next) => {
                        setInterval(next);
                        api?.financeApi.changeInterval(next);
                    } }),
                React.createElement(CandleTypeSelector, { value: candleType, onChange: (type) => {
                        setCandleType(type);
                        api?.financeApi.setCandleType(type);
                    } })),
            React.createElement("div", { style: { flex: 1, minHeight: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: setApi })))));
}
// The bars' colours are the theme's CSS variables, so they follow the theme too
const barStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};
const buttonStyle = (selected) => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
