import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    defaultExchangeProvider,
    ISciFinanceChartPanelConfig,
    nullCandleStore,
    OHLCStudy,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
import { SyntheticExchange } from "./SyntheticExchange";

// Any object implementing IRemoteExchange can back a chart: see SyntheticExchange.ts.
// nullCandleStore caches nothing, which suits generated data.
const synthetic = new SyntheticExchange();
defaultExchangeProvider.registerExchange(synthetic, nullCandleStore);

export function CustomExchangeChart() {
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: synthetic.name, // name="Synthetic", set in SyntheticExchange
            symbol: "ALPHA",
            interval: CandleInterval.ONE_MINUTE,
            period: "1H",
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 20 })],
        }),
        []
    );

    return (
        <div style={{ height: 600 }}>
            <SciFinanceChartView config={config} />
        </div>
    );
}
