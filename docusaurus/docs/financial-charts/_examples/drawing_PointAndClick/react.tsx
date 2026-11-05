import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    DRAWING_TOOL_BY_ID,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function PointAndClickDrawingChart() {
    const [chartApi, setChartApi] = React.useState<ISciFinanceChartPanelApi>();

    // 1. Enable point-and-click drawing: useDrawingTools attaches a DrawingToolsController once the
    // chart is ready, and detaches it on unmount. It also returns the active tool and the drawings
    // as React state, kept up to date from the controller's activeToolChanged and drawingsChanged
    const { controller, activeTool, drawings } = useDrawingTools(chartApi);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    const tool = activeTool ? DRAWING_TOOL_BY_ID.get(activeTool)?.label : "none";

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={statusStyle}>{`Active tool: ${tool}. Drawings on the chart: ${drawings.length}`}</div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                {/* 2. A toolbar: the SDK's drawing-tools rail. Click a tool, then click the chart to
                    place its points. It renders once the controller exists */}
                <DrawingToolbar controller={controller} orientation="vertical" />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SciFinanceChartView config={config} onInit={setChartApi} />
                </div>
            </div>
        </div>
    );
}

// The status line uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const statusStyle: React.CSSProperties = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
