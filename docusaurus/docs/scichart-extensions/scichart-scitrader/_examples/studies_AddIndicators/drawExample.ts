import {
    BollingerBandsStudy,
    CandleInterval,
    EMAStudy,
    ISciFinanceChartPanelApi,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * Add indicators. Every indicator is a *study*: pass instances in `studies`, in the order they
 * should draw.
 *
 * - **Overlays** (moving averages, Bollinger Bands, …) draw on the price pane.
 * - **Oscillators** (RSI, MACD, …) get a pane of their own, added below the price pane
 *   automatically.
 *
 * Constructor options set each study's inputs and styles. Anything left out takes its default, and
 * everything set here can still be changed later by the user in the study settings form.
 */
export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "6M",
        lockPeriodWidth: false,
        studies: [
            new OHLCStudy(),
            new VolumeStudy(),
            // Overlays on the price pane
            new SMAStudy({ length: 50 }),
            new EMAStudy({ length: 20, renderOptions: { stroke: "#FFB74D", strokeThickness: 2 } }),
            new BollingerBandsStudy({ period: 20, stdDev: 2 }),
            // Each oscillator gets its own pane
            new RSIStudy({ length: 14, overbought: 70, oversold: 30 }),
            new MACDStudy({ fast: 12, slow: 26, signal: 9 }),
        ],
    });
}
