import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    createSciTraderTheme,
    defaultExchangeProvider,
    EMAStudy,
    EStudyType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciTraderTheme,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SCITRADER_DARK_THEME,
    SCITRADER_OCEAN_THEME,
    SCITRADER_THEME_LIST,
    SMAStudy,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// A custom theme: createSciTraderTheme starts from any theme and overrides only what you list
const OCEAN_GOLD_THEME: ISciTraderTheme = createSciTraderTheme(SCITRADER_OCEAN_THEME, {
    name: "Ocean Gold",
    chart: {
        currentPriceLine: "#FFD54F",
        crosshairLabelBackground: "#FFD54F",
    },
});

const THEMES = [...SCITRADER_THEME_LIST, OCEAN_GOLD_THEME];

export function ThemedChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [themeName, setThemeName] = React.useState(SCITRADER_DARK_THEME.name);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            // The theme the chart starts with. Change it later with financeApi.setTheme
            theme: SCITRADER_DARK_THEME,
            studies: [
                new OHLCStudy(),
                new VolumeStudy(),
                new EMAStudy({ length: 20 }),
                // A colour passed explicitly is your choice, and themes leave it alone
                new SMAStudy({ length: 50, renderOptions: { stroke: "#FFFFFF", strokeThickness: 2 } }),
                new RSIStudy(),
                new MACDStudy(),
            ],
        }),
        []
    );

    // Follow the chart's theme, whatever changes it
    React.useEffect(() => {
        if (!api) return undefined;
        const chart = api.financeApi;
        const onThemeChanged = (theme: ISciTraderTheme) => setThemeName(theme.name);
        chart.themeChanged.subscribe(onThemeChanged);
        return () => chart.themeChanged.unsubscribe(onThemeChanged);
    }, [api]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 700 }}>
            <div style={{ display: "flex", gap: 8 }}>
                {THEMES.map((theme) => (
                    <button
                        key={theme.name}
                        disabled={!api || theme.name === themeName}
                        // Restyles the live chart in place, keeping explicit and user-edited colours
                        onClick={() => api.financeApi.setTheme(theme)}
                    >
                        {theme.name}
                    </button>
                ))}
                {/* Studies added later take the chart's current theme too */}
                <button
                    disabled={!api}
                    onClick={() => api.financeApi.attachStudy(studyProvider.getStudy(EStudyType.EMA))}
                >
                    Add EMA
                </button>
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
        </div>
    );
}
