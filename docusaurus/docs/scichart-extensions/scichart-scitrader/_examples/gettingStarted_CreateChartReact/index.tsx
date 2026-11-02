import * as React from "react";
import {
    CandleInterval,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    RSIStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, useSciTraderTheme } from "scichart-scitrader-react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useSampleData } from "../../framework/useSampleData";
import { SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * The React version of "Create a Financial Chart": `<SciFinanceChartView>` takes the same config as
 * `SciFinanceChartPanel.create` and hands back the same API, through `ref` and `onInit`.
 */
export default function CreateChartReactExample(): JSX.Element {
    const { loaded, error } = useSampleData();
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [ready, setReady] = React.useState(false);
    // The theme from the nearest SciTraderThemeProvider: the chart starts in it, and follows it.
    const theme = useSciTraderTheme();
    React.useEffect(() => {
        if (ready) {
            chartRef.current?.financeApi.setTheme(theme);
        }
    }, [theme, ready]);

    // Create the config once. Studies are live objects bound to one chart, so a config (and the
    // studies in it) must not be shared between two mounted views.
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: SAMPLE_EXCHANGE,
            symbol: "ETHUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; later changes go through setTheme
        []
    );

    return (
        <ExamplePage
            title="Create a Financial Chart (React)"
            description={
                <>
                    <code>&lt;SciFinanceChartView config=&#123;…&#125; /&gt;</code> renders the chart and its panes as
                    React components. <code>onInit</code> fires when the chart is ready; from then on{" "}
                    <code>chartRef.current.financeApi</code> drives it, exactly like the vanilla panel.
                </>
            }
            ready={ready}
            error={error}
        >
            {loaded && (
                <div style={CHART_STYLE}>
                    <SciFinanceChartView
                        ref={chartRef}
                        config={config}
                        useSubCharts={false}
                        onInit={(api) => {
                            (window as unknown as { __example?: unknown }).__example = api;
                            setReady(true);
                        }}
                    />
                </div>
            )}
        </ExamplePage>
    );
}
