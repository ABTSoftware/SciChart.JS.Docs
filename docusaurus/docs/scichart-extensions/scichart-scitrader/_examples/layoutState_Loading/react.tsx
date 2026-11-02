import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
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
} from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function LoadingStatesChart() {
    const [api, setApi] = React.useState<ISciFinanceChartViewApi>();
    const [interval, setInterval] = React.useState(CandleInterval.FIVE_MINUTES);
    // Bumped by "Reload": a new key remounts the chart, so you can watch it load again
    const [mount, setMount] = React.useState(0);

    // One emitter per mounted chart: the chart reports each pane's loading phases to it
    const progress = React.useMemo(() => new PaneProgressEmitter(), [mount]);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.FIVE_MINUTES,
            period: "1D",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
            services: { progress },
        }),
        [progress]
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <IntervalSelector
                    value={interval}
                    intervals={[CandleInterval.ONE_MINUTE, CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR]}
                    onChange={(next) => {
                        setInterval(next);
                        // The panes show the switch overlay until the new candles are drawn
                        api?.financeApi.changeInterval(next);
                    }}
                />
                <button
                    onClick={() => {
                        setApi(undefined);
                        setInterval(CandleInterval.FIVE_MINUTES);
                        setMount((n) => n + 1);
                    }}
                >
                    Reload
                </button>
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView
                    key={mount}
                    config={config}
                    onInit={setApi}
                    // Progress dots in each pane until its chart is ready, in place of the skeleton
                    paneLoadingContent={(paneId) => <PaneProgressDots emitter={progress} paneId={paneId} />}
                    // Your content at the start of a pane's control bar: the candle counter on the price pane
                    paneInfo={(paneId) =>
                        paneId === PaneId.DEFAULT.value && api ? <CandleCounter chart={api.financeApi} /> : null
                    }
                />
            </div>
        </div>
    );
}
