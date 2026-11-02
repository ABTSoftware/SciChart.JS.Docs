import {
    CandleInterval,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelState,
    MACDStudy,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "1M",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
    });
}

/**
 * Save the chart. `toJSON()` returns plain JSON: the exchange, symbol and interval; every study
 * with its settings; the pane layout; and any drawings. Store it anywhere: localStorage, a file,
 * your server.
 */
export function saveChart(panel: ISciFinanceChartPanelApi): string {
    return JSON.stringify(panel.toJSON());
}

/**
 * Restore a saved chart into a container, in place of whatever chart was there.
 * `SciFinanceChartPanel.fromJSON` rebuilds the studies (through `studyProvider`), the panes and
 * the data feed, then loads fresh data.
 */
export async function restoreChart(
    container: HTMLElement,
    previous: ISciFinanceChartPanelApi,
    saved: string
): Promise<ISciFinanceChartPanelApi> {
    previous.cleanup();
    const state: ISciFinanceChartPanelState = JSON.parse(saved);
    return SciFinanceChartPanel.fromJSON(container, state, { useSubCharts: state.useSubCharts });
}
