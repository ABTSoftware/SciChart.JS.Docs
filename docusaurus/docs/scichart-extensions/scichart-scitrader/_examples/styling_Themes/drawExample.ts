import {
    CandleInterval,
    createSciTraderTheme,
    EMAStudy,
    ISciFinanceChartPanelApi,
    ISciTraderTheme,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SCITRADER_DARK_THEME,
    SCITRADER_OCEAN_THEME,
    SCITRADER_THEME_LIST,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * A custom theme. `createSciTraderTheme` starts from any theme and overrides only what is listed;
 * everything else, including the drawing colours derived from it, comes from the base. Here, the
 * built-in Ocean theme with a gold price line and crosshair tags.
 */
export const OCEAN_GOLD_THEME: ISciTraderTheme = createSciTraderTheme(SCITRADER_OCEAN_THEME, {
    name: "Ocean Gold (custom)",
    chart: {
        currentPriceLine: "#FFD54F",
        crosshairLabelBackground: "#FFD54F",
    },
});

/** The built-in themes, and a custom one. */
export const THEMES = [...SCITRADER_THEME_LIST, OCEAN_GOLD_THEME];

export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "6M",
        lockPeriodWidth: false,
        // The theme a chart starts with. Omit it for the built-in SCITRADER_DARK_THEME.
        theme: SCITRADER_DARK_THEME,
        studies: [
            new OHLCStudy(),
            new VolumeStudy(),
            new EMAStudy({ length: 20 }),
            // A colour passed explicitly is the caller's choice, and themes leave it alone.
            new SMAStudy({ length: 50, renderOptions: { stroke: "#FFFFFF", strokeThickness: 2 } }),
            new RSIStudy(),
            new MACDStudy(),
        ],
    });
}

/**
 * Switch a live chart's theme. Axes, backgrounds, legend, crosshair and every study are restyled
 * in place, keeping explicit colours (the white SMA above) and colours the user has edited.
 */
export function setTheme(panel: ISciFinanceChartPanelApi, theme: ISciTraderTheme): void {
    panel.financeApi.setTheme(theme);
}
