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
    RSIStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";
import { CSS_SKINS } from "./skins";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// The SDK's React components wrap its plain-DOM controls, so the same st-… CSS classes restyle them
export function CssOverridesChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [skin, setSkin] = React.useState(CSS_SKINS[0]);
    const { controller } = useDrawingTools(api); // attaches drawing tools once the chart is ready

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        }),
        []
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            {/* In an app, these rules would live in your own stylesheet */}
            <style>{skin.css}</style>
            <div style={{ display: "flex", gap: 8 }}>
                {CSS_SKINS.map((s) => (
                    <button key={s.id} disabled={s.id === skin.id} onClick={() => setSkin(s)}>
                        {s.name}
                    </button>
                ))}
            </div>
            {/* Each skin's rules are scoped under this class */}
            <div className={`skin-${skin.id}`} style={{ display: "flex", flex: 1 }}>
                <DrawingToolbar controller={controller} />
                <div style={{ flex: 1 }}>
                    <SciFinanceChartView config={config} onInit={setApi} />
                </div>
            </div>
        </div>
    );
}
