import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register the built-in connectors you use, once, at startup
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Each exchange names its markets in its own format
const SYMBOLS: Record<string, string> = {
    [BinanceExchange.name]: "BTCUSDT", // name="Binance" matches the built-in BinanceExchange
    [CoinbaseExchange.name]: "BTC-USD", // name="Coinbase" matches the built-in CoinbaseExchange
};

function LiveChart({ exchangeName }: { exchangeName: string }) {
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName,
            symbol: SYMBOLS[exchangeName],
            interval: CandleInterval.ONE_MINUTE, // one-minute candles, updated live as trades happen
            period: "1H",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        [exchangeName]
    );
    return <SciFinanceChartView config={config} />;
}

export function LiveExchangesChart() {
    const [exchangeName, setExchangeName] = React.useState(BinanceExchange.name);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", gap: 8 }}>
                {Object.keys(SYMBOLS).map((name) => (
                    <button key={name} disabled={name === exchangeName} onClick={() => setExchangeName(name)}>
                        {name} · {SYMBOLS[name]}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                {/* The config is read once, so a new key remounts the chart. Unmounting closes the old websocket. */}
                <LiveChart key={exchangeName} exchangeName={exchangeName} />
            </div>
        </div>
    );
}
