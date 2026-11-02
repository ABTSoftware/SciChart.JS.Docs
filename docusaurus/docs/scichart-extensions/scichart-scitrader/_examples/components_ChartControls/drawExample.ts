import {
    CandleInterval,
    CandleTypeSelector,
    carryPeriodToInterval,
    ECandleType,
    IntervalSelector,
    ISciFinanceChartPanelApi,
    LiveTipToggle,
    OHLCStudy,
    PeriodSelector,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { DUMMY_EXCHANGE } from "../../dummyData/DummyDataExchange";
import { registerDummyData } from "../../sampleData";

/**
 * The SDK's toolbar controls in plain TypeScript: interval, period, candle type and live-tip
 * buttons, each created with `create(container, options)` and wired to the chart's API. The data
 * is the Sandbox's randomised live feed, so new candles keep arriving and Follow / Anchored shows
 * its effect.
 */
export async function drawExample(
    container: HTMLElement
): Promise<{ panel: ISciFinanceChartPanelApi; cleanup(): void }> {
    registerDummyData();

    // A toolbar row above the chart.
    container.style.display = "flex";
    container.style.flexDirection = "column";
    const toolbar = document.createElement("div");
    toolbar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px;";
    const chartHost = document.createElement("div");
    chartHost.style.cssText = "position: relative; flex: 1; min-height: 0;";
    container.append(toolbar, chartHost);

    const interval = CandleInterval.FIVE_MINUTES;

    const panel = await SciFinanceChartPanel.create(chartHost, {
        exchangeName: DUMMY_EXCHANGE,
        symbol: "ALPHAUSD",
        interval,
        period: "1D",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = panel.financeApi;

    const intervals = IntervalSelector.create(toolbar, {
        value: interval,
        intervals: [
            CandleInterval.ONE_MINUTE,
            CandleInterval.FIVE_MINUTES,
            CandleInterval.FIFTEEN_MINUTES,
            CandleInterval.ONE_HOUR,
            CandleInterval.FOUR_HOURS,
            CandleInterval.ONE_DAY,
        ],
        onChange: async (next) => {
            // Keep about the same span on screen, adjusted to suit the new interval: one day of
            // 1-day candles would be a single candle, so that steps up to a longer period.
            const period = carryPeriodToInterval(periods.value, next);
            periods.update({ currentInterval: next, value: period });
            await chart.changeInterval(next, period);
        },
    });

    const periods = PeriodSelector.create(toolbar, {
        value: "1D",
        // Disables the periods that don't suit the interval, such as "1H" at a 1-day interval.
        currentInterval: interval,
        // `null` is "Free": leave the visible range where the user put it.
        onChange: (period) => chart.setPeriod(period),
    });

    const candleTypes = CandleTypeSelector.create(toolbar, {
        value: ECandleType.Candlestick,
        onChange: (type) => chart.setCandleType(type),
    });

    const liveTip = LiveTipToggle.create(toolbar, {
        value: chart.liveTipMode,
        // Follow: the view slides right with each new candle. Anchored: it stays put.
        onChange: (mode) => (chart.liveTipMode = mode),
    });

    return {
        panel,
        cleanup: () => {
            // Controls attach listeners (the candle-type menu to the document), so destroy them too.
            [intervals, periods, candleTypes, liveTip].forEach((control) => control.destroy());
            panel.cleanup();
            container.replaceChildren();
        },
    };
}
