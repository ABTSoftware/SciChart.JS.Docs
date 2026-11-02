import * as React from "react";
import {
    CandleInterval,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import {
    DrawingList,
    DrawingToolbar,
    SciFinanceChartView,
    useDrawingTools,
    useSciTraderTheme,
} from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { useSampleData } from "../../framework/useSampleData";
import { SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * Drawing tools in React: the `DrawingToolbar` rail and the `DrawingList` of placed drawings,
 * both driven by the controller from `useDrawingTools`.
 */
export default function DrawingToolsReactExample(): JSX.Element {
    const { loaded, error } = useSampleData();
    const [chart, setChart] = React.useState<ISciFinanceChartPanelApi>();
    const { controller } = useDrawingTools(chart);
    const theme = useSciTraderTheme();
    // For e2e specs and console poking; not part of the demo.
    React.useEffect(() => {
        (window as unknown as { __drawing?: unknown }).__drawing = controller;
    }, [controller]);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: SAMPLE_EXCHANGE,
            symbol: "ETHUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "3M",
            lockPeriodWidth: false,
            studies: [new OHLCStudy(), new VolumeStudy()],
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; the theme then follows through setTheme
        []
    );

    React.useEffect(() => {
        chart?.financeApi.setTheme(theme);
    }, [chart, theme]);

    return (
        <ExamplePage
            title="Drawing Tools (React)"
            description={
                <>
                    <code>useDrawingTools(chart)</code> attaches the drawing tools to a <code>SciFinanceChartView</code>{" "}
                    and returns the active tool and the list of drawings. <code>DrawingToolbar</code> is the SDK's
                    drawing rail in React, and <code>DrawingList</code> lists the drawings: click one to select it.
                </>
            }
            ready={controller !== undefined}
            error={error}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                <DrawingToolbar controller={controller} />
                <div style={{ position: "relative", flex: 1 }}>
                    {loaded && (
                        <SciFinanceChartView
                            config={config}
                            useSubCharts={false}
                            onInit={(api) => {
                                (window as unknown as { __example?: unknown }).__example = api;
                                setChart(api);
                            }}
                        />
                    )}
                </div>
                <div style={{ width: 280, borderLeft: "1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08)" }}>
                    <DrawingList controller={controller} />
                </div>
            </div>
        </ExamplePage>
    );
}
