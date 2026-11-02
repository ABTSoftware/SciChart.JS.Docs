import * as React from "react";
import {
    CandleInterval,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { StudySettingsForm } from "scichart-scitrader-react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";
import { MOMENTUM, MomentumStudy, registerMomentumStudy } from "./MomentumStudy";

async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    await loadSampleData();
    registerMomentumStudy();
    return SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "SOLUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "6M",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy(), new MomentumStudy({ length: 10 })],
    });
}

export default function CustomStudyExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);
    const study = api?.financeApi.studies.find((s) => s.type === MOMENTUM);

    return (
        <ExamplePage
            title="Custom Study"
            description={
                <>
                    <code>MomentumStudy</code> is written in the Sandbox, not the SDK: a <code>StudyBase</code> subclass
                    with a settings descriptor, registered with <code>studyProvider</code> so it can be saved and
                    restored. Its settings form below is the SDK's <code>StudySettingsForm</code>, generated from that
                    descriptor.
                </>
            }
            toolbar={
                study && (
                    <div style={{ width: 420 }}>
                        <StudySettingsForm study={study} />
                    </div>
                )
            }
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
