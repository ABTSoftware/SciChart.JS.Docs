import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    ICSVServicesHandle,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";

// 1. Load the CSV files, once. Each row is "symbol,time,open,high,low,close,volume", so one exchange
// serves all three symbols. CSVExchange serves every interval the data can make: the hourly file
// gives 1h to 12h, the daily file 1d, 1w and 1M. It moves the dates so the data ends now.
// 2. createCSVServices: chart services for this exchange alone, so nothing is registered in
// defaultExchangeProvider
const loading: Promise<ICSVServicesHandle> = CSVExchange.fromUrl(
    [`${SAMPLE_DATA}/crypto-1h.csv`, `${SAMPLE_DATA}/crypto-1d.csv`],
    { name: "Sample" } // the exchangeName charts ask for
).then(createCSVServices);

export function CsvDataChart() {
    // The chart can only be created once the files have loaded
    const [handle, setHandle] = React.useState<ICSVServicesHandle>();
    const [symbols, setSymbols] = React.useState<string[]>([]);
    React.useEffect(() => {
        loading.then(async (h) => {
            setSymbols(await h.exchange.getInstruments()); // ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
            setHandle(h);
        });
    }, []);

    // Fills its parent, so give the parent a height
    return handle ? <CsvChart handle={handle} symbols={symbols} /> : <div style={toolbarStyle}>Loading the CSV files…</div>;
}

function CsvChart({ handle, symbols }: { handle: ICSVServicesHandle; symbols: string[] }) {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [symbol, setSymbol] = React.useState("BTCUSDT");
    const [interval, setInterval] = React.useState(CandleInterval.FOUR_HOURS);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: handle.exchange.name,
            symbol: "BTCUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "1M",
            services: handle.services,
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        [handle]
    );

    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <ButtonGroup values={symbols} selected={symbol} onSelect={(s) => (setSymbol(s), chart()?.setSymbol(s))} />
                {/* 3. The intervals the files can serve, except 1M, which charts can't show yet.
                    changeInterval picks a period that suits the interval */}
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
