import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    ISciFinanceChartPanelState,
    LayoutDirection,
    MACDStudy,
    OHLCStudy,
    PaneId,
    RSIStudy,
    StochasticStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { ISciFinanceChartViewApi, SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

interface ILayout {
    useSubCharts: boolean;
    direction: LayoutDirection;
    /** The chart to carry over when the layout changes */
    saved: ISciFinanceChartPanelState | null;
}

export function MultiPaneChart() {
    const [api, setApi] = React.useState<ISciFinanceChartViewApi>();
    const [layout, setLayout] = React.useState<ILayout>({ useSubCharts: true, direction: "column", saved: null });
    const [synced, setSynced] = React.useState(true);
    const [touch, setTouch] = React.useState(false);
    const [controlBarVisible, setControlBarVisible] = React.useState(true);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            direction: "column",
            // A price pane four times the size of each indicator pane
            paneSizing: { [PaneId.DEFAULT.value]: { grow: 4 } },
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy(), new MACDStudy(), new StochasticStudy()],
        }),
        []
    );

    // Sub-chart mode and direction are read once, when the chart is created. To change them, save the
    // chart with toJSON and remount the view (a new key) restoring it with the new layout.
    const changeLayout = (useSubCharts: boolean, direction: LayoutDirection) => {
        const state = api?.toJSON();
        setApi(undefined);
        setLayout({
            useSubCharts,
            direction,
            saved: state ? { ...state, layout: { ...state.layout, direction } } : null,
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 800 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button disabled={!api} onClick={() => changeLayout(!layout.useSubCharts, layout.direction)}>
                    {layout.useSubCharts ? "Sub-charts" : "Multi-chart"}
                </button>
                <button
                    disabled={!api}
                    onClick={() => changeLayout(layout.useSubCharts, layout.direction === "column" ? "row" : "column")}
                >
                    {layout.direction === "column" ? "Stacked" : "Side by side"}
                </button>
                <button
                    disabled={!api}
                    onClick={() => {
                        // paneGroupApi drives the same layout from code
                        api.paneGroupApi.toggleAxisSync(!synced);
                        setSynced(!synced);
                    }}
                >
                    Axis sync: {synced ? "on" : "off"}
                </button>
                <button disabled={!api} onClick={() => api.addCustomPane(<div>Your content</div>)}>
                    Add custom pane
                </button>
                <button onClick={() => setTouch(!touch)}>Touch layout: {touch ? "on" : "off"}</button>
                <button onClick={() => setControlBarVisible(!controlBarVisible)}>
                    Control bar: {controlBarVisible ? "shown" : "hidden"}
                </button>
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView
                    key={`${layout.useSubCharts}-${layout.direction}`}
                    config={config}
                    useSubCharts={layout.useSubCharts}
                    restoreState={layout.saved}
                    // Unlike config, paneControls applies to the live chart
                    paneControls={{ touch, visible: controlBarVisible }}
                    onInit={setApi}
                />
            </div>
        </div>
    );
}
