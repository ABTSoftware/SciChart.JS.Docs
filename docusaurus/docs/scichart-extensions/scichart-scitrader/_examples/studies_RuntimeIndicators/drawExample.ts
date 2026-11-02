import {
    CandleInterval,
    EStudyType,
    ISciFinanceChartPanelApi,
    IStudy,
    OHLCStudy,
    SciFinanceChartPanel,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();

    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "ETHUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "1M",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
}

/**
 * Add a study by type. `studyProvider` creates any registered study from its `EStudyType` with
 * default settings, which is what a study picker needs. `attachStudy` adds it to the chart, and
 * creates a pane for it if it needs one.
 */
export async function addStudy(panel: ISciFinanceChartPanelApi, type: EStudyType): Promise<IStudy | undefined> {
    const study = studyProvider.getStudy(type);
    await panel.financeApi.attachStudy(study);
    return study;
}

/** Remove a study. A pane left empty is removed with it. */
export function removeStudy(panel: ISciFinanceChartPanelApi, study: IStudy): void {
    panel.financeApi.detachStudy(study);
}
