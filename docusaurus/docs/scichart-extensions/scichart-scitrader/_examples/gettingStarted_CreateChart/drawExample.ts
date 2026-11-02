import {
    CandleInterval,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * Create a financial chart: candlesticks with volume, for one symbol at one interval.
 *
 * `SciFinanceChartPanel.create` builds the whole chart in one call: the pane layout, the price pane,
 * a data feed for the symbol, and one pane per study that needs its own. The data comes from an
 * exchange registered by name; here, the sample CSV data (see "CSV Data"). Swap `exchangeName` and
 * `symbol` for `"Binance"` and `"BTCUSDT"` to chart live data instead.
 */
export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.FOUR_HOURS,
        // Studies are what the chart draws. OHLCStudy is the price series; VolumeStudy overlays
        // volume columns at the bottom of the price pane.
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
}
