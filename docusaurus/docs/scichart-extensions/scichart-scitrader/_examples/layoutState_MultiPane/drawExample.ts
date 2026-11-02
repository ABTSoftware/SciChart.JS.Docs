import {
    CandleInterval,
    IPaneControlOptions,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelState,
    LayoutDirection,
    MACDStudy,
    OHLCStudy,
    PaneId,
    RSIStudy,
    SciFinanceChartPanel,
    StochasticStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export interface ILayoutOptions {
    /** One SciChart surface with a sub-chart per pane (true), or a surface per pane (false). */
    useSubCharts: boolean;
    direction: LayoutDirection;
}

/**
 * Pane layout. Each pane has a control bar (hover its top edge): lock size, Y-axis autorange, move,
 * maximise, hide and close. Drag the dividers to resize. `paneSizing` sets the starting
 * proportions, here a price pane four times the size of each indicator pane.
 *
 * `paneControls` sets up the control bar and dividers. `touch: true` is the layout for phones and
 * tablets: each control bar sits in a drawer at the pane's right edge (tap or swipe its handle,
 * since there is no hover on a touch screen) and the dividers get a wider hit area with grip dots.
 * The chart doesn't detect touch screens itself: the page decides, typically from its own
 * breakpoint, and switches a live chart with `panel.setPaneControls({ touch })`.
 *
 * Sub-chart mode and direction are fixed when the chart is created, so changing them rebuilds it,
 * carrying the studies and layout over with `toJSON` / `fromJSON`.
 */
export async function drawExample(
    container: HTMLElement,
    layout: ILayoutOptions,
    paneControls: IPaneControlOptions,
    previous?: ISciFinanceChartPanelState
): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    if (previous) {
        return SciFinanceChartPanel.fromJSON(
            container,
            { ...previous, layout: { ...previous.layout, direction: layout.direction } },
            { useSubCharts: layout.useSubCharts, paneControls }
        );
    }

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "6M",
        lockPeriodWidth: false,
        useSubCharts: layout.useSubCharts,
        direction: layout.direction,
        paneSizing: { [PaneId.DEFAULT.value]: { grow: 4 } },
        paneControls,
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy(), new MACDStudy(), new StochasticStudy()],
    });
}
