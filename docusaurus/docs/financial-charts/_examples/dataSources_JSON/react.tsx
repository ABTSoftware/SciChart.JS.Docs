import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    ICSVServicesHandle,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";

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

    // Fills its parent, so give the parent a height
    return handle ? <JsonChart handle={handle} /> : <div style={toolbarStyle}>Loading the candles…</div>;
}

function JsonChart({ handle }: { handle: ICSVServicesHandle }) {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [interval, setInterval] = React.useState(CandleInterval.ONE_DAY);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: handle.exchange.name,
            symbol: "BTCUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            services: handle.services,
            studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
        }),
        [handle]
    );

    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                {/* The intervals the candles can make: 1d, 3d and 1w. getSupportedIntervals() also lists 1M,
                    which charts can't show yet. changeInterval picks a period that suits the interval */}
                <ButtonGroup
                    values={handle.exchange.getSupportedIntervals().filter((i) => i !== CandleInterval.ONE_MONTH)}
                    selected={interval}
                    onSelect={(i) => (setInterval(i), chart()?.changeInterval(i))}
                />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} />
            </div>
        </div>
    );
}

// A row of toggle buttons: one per value, the selected one highlighted
function ButtonGroup<T extends string>(props: { values: readonly T[]; selected: T; onSelect: (v: T) => void }) {
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {props.values.map((value) => (
                <button key={value} style={buttonStyle(value === props.selected)} onClick={() => props.onSelect(value)}>
                    {value}
                </button>
            ))}
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 16px",
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
const buttonStyle = (active = false): React.CSSProperties => ({
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: active ? "var(--st-ui-selection, #6c63ff)" : "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
});
