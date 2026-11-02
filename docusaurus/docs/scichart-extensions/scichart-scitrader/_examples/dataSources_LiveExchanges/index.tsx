import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample, TLiveExchange } from "./drawExample";

function LiveChart({ exchange, onReady }: { exchange: TLiveExchange; onReady: (ready: boolean) => void }) {
    const { containerRef, api, error } = useVanillaExample((el) => drawExample(el, exchange));
    React.useEffect(() => onReady(api !== undefined), [api, onReady]);
    return (
        <>
            {error !== undefined && <div style={{ color: "#f88", padding: 8 }}>{String(error)}</div>}
            <div ref={containerRef} style={CHART_STYLE} />
        </>
    );
}

export default function LiveExchangesExample({ initial = "Binance" }: { initial?: TLiveExchange }): JSX.Element {
    const [exchange, setExchange] = React.useState<TLiveExchange>(initial);
    const [ready, setReady] = React.useState(false);

    const toolbar = (
        <ToggleButtonGroup
            size="small"
            exclusive
            value={exchange}
            onChange={(_e, next: TLiveExchange | null) => next && setExchange(next)}
        >
            <ToggleButton value="Binance">Binance · BTCUSDT</ToggleButton>
            <ToggleButton value="Coinbase">Coinbase · BTC-USD</ToggleButton>
        </ToggleButtonGroup>
    );

    return (
        <ExamplePage
            title="Live Data: Binance and Coinbase"
            description={
                <>
                    The built-in connectors, <code>BinanceExchange</code> and <code>CoinbaseExchange</code>, are
                    registered once with <code>defaultExchangeProvider.registerExchange</code>. A chart then picks one
                    by <code>exchangeName</code>. One-minute candles update live as trades happen.
                </>
            }
            toolbar={toolbar}
            ready={ready}
        >
            {/* A new key remounts the chart, tearing down the old exchange's feeds and sockets. */}
            <LiveChart key={exchange} exchange={exchange} onReady={setReady} />
        </ExamplePage>
    );
}
