import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingList, DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function DrawingToolsChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();

    // Attaches the drawing tools once the chart is ready, and detaches them on unmount.
    // Also returns the active tool and the drawings, as React state.
    const { controller, drawings } = useDrawingTools(api);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "ETHUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    return (
        <div style={{ display: "flex", height: 600 }}>
            {/* The SDK's drawing rail */}
            <DrawingToolbar controller={controller} />
            <div style={{ position: "relative", flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
            {/* The placed drawings: click one to select it */}
            <div style={{ width: 280 }}>
                <div>{drawings.length} drawings</div>
                <DrawingList controller={controller} />
            </div>
        </div>
    );
}
