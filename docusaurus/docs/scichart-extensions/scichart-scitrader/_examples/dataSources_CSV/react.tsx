import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { IntervalSelector, SciFinanceChartView } from "scichart-scitrader-react";

// Expected CSV (several symbols can share a file):
//   symbol,time,open,high,low,close,volume
//   BTCUSDT,2026-07-01 12:00,58622.02,58676,58326,58538.01,1716.61

export function CsvChart() {
    const [exchange, setExchange] = React.useState<CSVExchange>();
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [symbols, setSymbols] = React.useState<string[]>([]);
    const [symbol, setSymbol] = React.useState("SOLUSDT");
    const [interval, setInterval] = React.useState(CandleInterval.TWO_HOURS);

    // Load the file once. The chart can only be created after the exchange exists.
    React.useEffect(() => {
        CSVExchange.fromUrl("data/my-candles-1h.csv", { name: "MyCSV" }).then(async (csv) => {
            setSymbols(await csv.getInstruments());
            setExchange(csv);
        });
    }, []);

    const config = React.useMemo<ISciFinanceChartPanelConfig | undefined>(
        () =>
            exchange && {
                exchangeName: exchange.name, // name="MyCSV", set by fromUrl above
                symbol: "SOLUSDT",
                interval: CandleInterval.TWO_HOURS, // resampled from the file's hourly rows
                studies: [new OHLCStudy(), new VolumeStudy()],
                // Services private to this chart. Or registerCSVExchange(defaultExchangeProvider, exchange)
                services: createCSVServices(exchange).services,
            },
        [exchange]
    );

    if (!config) {
        return <div>Loading CSV…</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", gap: 8 }}>
                {symbols.map((s) => (
                    <button
                        key={s}
                        disabled={!api || s === symbol}
                        onClick={() => {
                            setSymbol(s);
                            api.financeApi.setSymbol(s);
                        }}
                    >
                        {s}
                    </button>
                ))}
                <IntervalSelector
                    value={interval}
                    // Exactly the intervals the CSV data can serve
                    intervals={exchange.getSupportedIntervals()}
                    onChange={(next) => {
                        setInterval(next);
                        api?.financeApi.changeInterval(next);
                    }}
                />
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
        </div>
    );
}
