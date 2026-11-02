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
import { SciFinanceChartView, StudySettingsForm } from "scichart-scitrader-react";
import { MOMENTUM, MomentumStudy, registerMomentumStudy } from "./MomentumStudy";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// Register the custom study once, so it can be created by type and restored from a saved chart
registerMomentumStudy();

export function CustomStudyChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "SOLUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            // A custom study goes in `studies` like any built-in one
            studies: [new OHLCStudy(), new VolumeStudy(), new MomentumStudy({ length: 10 })],
        }),
        []
    );

    const momentum = api?.financeApi.studies.find((study) => study.type === MOMENTUM);

    return (
        <div style={{ display: "flex", height: 600 }}>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
            {/* The SDK's settings form, generated from the custom study's descriptor */}
            <div style={{ width: 320 }}>{momentum && <StudySettingsForm study={momentum} />}</div>
        </div>
    );
}
