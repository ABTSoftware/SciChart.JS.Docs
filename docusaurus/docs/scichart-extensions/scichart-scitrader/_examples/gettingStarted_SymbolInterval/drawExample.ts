import {
    CandleInterval,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    SciFinanceChartPanel,
    TPeriod,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export const INITIAL = { symbol: "BTCUSDT", interval: CandleInterval.FOUR_HOURS, period: "1M" as TPeriod };

export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: INITIAL.symbol,
        interval: INITIAL.interval,
        // A period is the time span the chart shows ("1M" = the last month). The chart loads
        // enough candles to fill it, and pans and zooms from there.
        period: INITIAL.period,
        // Let the user zoom out past the period. Leave this at its default (true) to cap zoom-out
        // at the period's width.
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
}

/**
 * Change symbol. `setSymbol` replaces the chart's default data feed, the one its price pane and
 * studies read from, keeping the current exchange, interval and period. Every study recalculates
 * on the new symbol.
 */
export function changeSymbol(panel: ISciFinanceChartPanelApi, symbol: string) {
    return panel.financeApi.setSymbol(symbol);
}

/**
 * Change interval, landing on `period`. Without a period, `changeInterval` moves an active period
 * to the new interval's default.
 */
export function changeInterval(panel: ISciFinanceChartPanelApi, interval: CandleInterval, period: TPeriod | null) {
    return panel.financeApi.changeInterval(interval, period);
}

/** Change period, or pass `null` to drop it and leave the visible range where it is. */
export function changePeriod(panel: ISciFinanceChartPanelApi, period: TPeriod | null) {
    return panel.financeApi.setPeriod(period);
}
