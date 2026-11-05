import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    ICSVServicesHandle,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@v6.x-scitrader/docusaurus/static/financial-charts/data";

// One candle as your JSON has it. Here: time in milliseconds, prices and volume as numbers
type TJsonCandle = { time: number; open: number; high: number; low: number; close: number; volume: number };

// CSVExchange reads CSV text, so write the candles as CSV rows: a header, then one row per candle.
// The header names are the ones CSVExchange looks for; use the `columns` option for other names
function candlesToCsv(candles: TJsonCandle[]): string {
    const rows = candles.map((c) => `${c.time},${c.open},${c.high},${c.low},${c.close},${c.volume}`);
    return ["time,open,high,low,close,volume", ...rows].join("\n");
}

// Turn candles into chart services: an exchange with one symbol at one interval. timeUnit "ms" says
// how `time` is written ("s" for seconds, "iso" for date strings)
function servicesFor(candles: TJsonCandle[]): ICSVServicesHandle {
    const exchange = new CSVExchange(
        { csv: candlesToCsv(candles), symbol: "BTCUSDT", interval: CandleInterval.ONE_DAY },
        { name: "MyData", timeUnit: "ms" }
    );
    return createCSVServices(exchange);
}

export function JsonDataChart() {
    // Get the candles: here from a JSON file, but any array of candles works, e.g. from your own API
    const [handle, setHandle] = React.useState<ICSVServicesHandle>();
    React.useEffect(() => {
        fetch(`${SAMPLE_DATA}/btcusdt-1d.json`)
            .then((response) => response.json())
            .then((candles: TJsonCandle[]) => setHandle(servicesFor(candles)));
    }, []);

    // Create the config once the data is in: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig | undefined>(
        () =>
            handle && {
                exchangeName: handle.exchange.name,
                symbol: "BTCUSDT",
                interval: CandleInterval.ONE_DAY,
                period: "1Y",
                services: handle.services,
                studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
            },
        [handle]
    );

    // SciFinanceChartView fills its parent, so give the parent a height
    return config ? <SciFinanceChartView config={config} /> : <div>Loading…</div>;
}
