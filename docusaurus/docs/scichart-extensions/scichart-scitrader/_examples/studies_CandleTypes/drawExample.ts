import {
    CandleInterval,
    ECandleType,
    ISciFinanceChartPanelApi,
    IStudy,
    OHLCStudy,
    PointAndFigureStudy,
    RenkoStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "SOLUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "6M",
        lockPeriodWidth: false,
        // Start as Heikin-Ashi. `candleType` on OHLCStudy sets the initial style.
        studies: [new OHLCStudy({ candleType: ECandleType.HeikinAshi }), new VolumeStudy()],
    });
}

/**
 * Change how price is drawn: candlesticks, OHLC bars, line, mountain or Heikin-Ashi. The data and
 * the zoom stay as they are; only the price series is swapped.
 */
export function setCandleType(panel: ISciFinanceChartPanelApi, type: ECandleType): void {
    panel.financeApi.setCandleType(type);
}

/**
 * Renko and point & figure are not candle types but studies. They ignore time, placing a new
 * brick or column only when price moves far enough, so each draws in its own pane with a
 * category (index) axis rather than a time axis.
 */
export async function addPriceActionChart(panel: ISciFinanceChartPanelApi, kind: "renko" | "pnf"): Promise<IStudy> {
    const study =
        kind === "renko" ? new RenkoStudy({ reversalAmount: 2 }) : new PointAndFigureStudy({ reversalAmount: 3 });
    await panel.financeApi.attachStudy(study);
    return study;
}
