import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciTraderTheme,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SCITRADER_DARK_THEME,
    SMAStudy,
    themeDisplayName,
    VolumeStudy,
} from "scichart-scitrader";
import {
    SciFinanceChartView,
    SciTraderThemeProvider,
    useSciTraderTheme,
    useSciTraderThemeSwitch,
} from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function ThemedChart() {
    // 1. Your app holds the theme. SciTraderThemeProvider writes it as CSS variables for the HTML
    // components, and onThemeChange lets a theme picker inside it change it
    const [theme, setTheme] = React.useState<ISciTraderTheme>(SCITRADER_DARK_THEME);

    return (
        <SciTraderThemeProvider theme={theme} onThemeChange={setTheme}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <ThemePicker />
                <Chart />
            </div>
        </SciTraderThemeProvider>
    );
}

// 2. A theme picker: useSciTraderThemeSwitch gives the current theme, the themes on offer (the
// three built-in ones unless you pass `themes`) and setTheme
function ThemePicker() {
    const themeSwitch = useSciTraderThemeSwitch();
    if (!themeSwitch) return null; // no onThemeChange on the provider
    return (
        <div style={toolbarStyle}>
            {themeSwitch.themes.map((theme) => (
                <button
                    key={theme.name}
                    style={buttonStyle(theme === themeSwitch.theme)}
                    onClick={() => themeSwitch.setTheme(theme)}
                >
                    {themeDisplayName(theme)}
                </button>
            ))}
        </div>
    );
}

function Chart() {
    // 3. The chart is drawn by WebGL, which can't read CSS variables, so it takes the theme
    // itself: in `config` when it is created, then through setTheme
    const theme = useSciTraderTheme();
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    React.useEffect(() => api?.financeApi.setTheme(theme), [api, theme]);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            theme,
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 20 }), new RSIStudy(), new MACDStudy()],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div style={{ flex: 1, minHeight: 0 }}>
            <SciFinanceChartView config={config} onInit={setApi} />
        </div>
    );
}

// The toolbar's colours are the theme's CSS variables, so it follows the theme too
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};

const buttonStyle = (selected: boolean): React.CSSProperties => ({
    padding: "4px 14px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
