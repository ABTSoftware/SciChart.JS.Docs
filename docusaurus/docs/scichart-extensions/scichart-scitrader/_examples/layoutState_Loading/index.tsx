import * as React from "react";
import Button from "@mui/material/Button";
import {
    CandleInterval,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    PaneId,
    PaneProgressEmitter,
    RSIStudy,
    VolumeStudy,
} from "scichart-scitrader";
import {
    CandleCounter,
    IntervalSelector,
    ISciFinanceChartViewApi,
    PaneProgressDots,
    SciFinanceChartView,
    useSciTraderTheme,
} from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { DUMMY_EXCHANGE } from "../../dummyData/DummyDataExchange";
import { registerDummyData } from "../../sampleData";

/**
 * What a chart shows while it loads, and the host's own content in a pane's control bar:
 * - `paneLoadingContent`: progress dots in each pane until its chart is ready, in place of the
 *   default skeleton. They follow a `PaneProgressEmitter` passed to the chart as `services.progress`.
 * - The switch overlay: changing the interval covers the panes with a shimmer until the new
 *   candles are drawn. It is on by default (`loading.overlay`).
 * - `paneInfo`: the SDK's `CandleCounter` ("visible / loaded / ~total") at the start of the price
 *   pane's control bar.
 */
export default function LoadingExample(): JSX.Element {
    registerDummyData();
    const theme = useSciTraderTheme();
    const [chart, setChart] = React.useState<ISciFinanceChartViewApi>();
    const [interval, setInterval] = React.useState(CandleInterval.FIVE_MINUTES);
    // Bumped by "Reload" to remount the chart and watch it load again.
    const [mount, setMount] = React.useState(0);

    // One emitter per mounted chart: the chart reports each pane's loading phases to it.
    const progress = React.useMemo(() => new PaneProgressEmitter(), [mount]);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: DUMMY_EXCHANGE,
            symbol: "ALPHAUSD",
            interval: CandleInterval.FIVE_MINUTES,
            period: "1D",
            lockPeriodWidth: false,
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
            services: { progress },
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- created once per mount; the theme then follows through setTheme
        [progress]
    );

    React.useEffect(() => {
        chart?.financeApi.setTheme(theme);
    }, [chart, theme]);

    const toolbar = (
        <>
            <IntervalSelector
                value={interval}
                intervals={[CandleInterval.ONE_MINUTE, CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR]}
                onChange={(next) => {
                    setInterval(next);
                    // The panes show the switch overlay until the new candles are drawn.
                    chart?.financeApi.changeInterval(next);
                }}
            />
            <Button
                size="small"
                variant="outlined"
                onClick={() => {
                    setChart(undefined);
                    setInterval(CandleInterval.FIVE_MINUTES);
                    setMount((n) => n + 1);
                }}
                data-testid="reload"
            >
                Reload
            </Button>
        </>
    );

    return (
        <ExamplePage
            title="Loading States and Pane Info"
            description={
                <>
                    While a pane loads it shows a skeleton, or your own content: here, <code>PaneProgressDots</code>{" "}
                    through <code>paneLoadingContent</code>. Changing the interval covers the panes with a shimmer until
                    the new candles arrive. <code>paneInfo</code> puts your content at the start of a pane's control bar
                    (hover the price pane): here, the SDK&apos;s <code>CandleCounter</code>, candles visible / loaded /
                    estimated total.
                </>
            }
            toolbar={toolbar}
            ready={chart !== undefined}
        >
            <SciFinanceChartView
                key={mount}
                config={config}
                onInit={(api) => {
                    (window as unknown as { __example?: unknown }).__example = api;
                    setChart(api);
                }}
                paneLoadingContent={(paneId) => <PaneProgressDots emitter={progress} paneId={paneId} />}
                paneInfo={(paneId) =>
                    paneId === PaneId.DEFAULT.value && chart ? <CandleCounter chart={chart.financeApi} /> : null
                }
            />
        </ExamplePage>
    );
}
