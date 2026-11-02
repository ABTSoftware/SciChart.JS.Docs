import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    EStudyType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciFinanceChartPanelState,
    MACDStudy,
    OHLCStudy,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

const STORAGE_KEY = "my-app:chart";

export function SaveRestoreChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    // The state to restore, and a key to remount the view with it
    const [restore, setRestore] = React.useState<{ key: number; state: ISciFinanceChartPanelState | null }>({
        key: 0,
        state: null,
    });

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "1M",
            studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
        }),
        []
    );

    // Save: toJSON() returns plain JSON. Store it anywhere: localStorage, a file, your server.
    const onSave = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(api.toJSON()));

    // Restore: remount the view with restoreState, which rebuilds the chart from the saved JSON
    const onRestore = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        setApi(undefined);
        setRestore((previous) => ({ key: previous.key + 1, state: JSON.parse(saved) }));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    disabled={!api}
                    onClick={() => api.financeApi.attachStudy(studyProvider.getStudy(EStudyType.RSI))}
                >
                    Add RSI
                </button>
                <button disabled={!api} onClick={onSave}>
                    Save
                </button>
                <button disabled={!api} onClick={onRestore}>
                    Restore
                </button>
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView
                    key={restore.key}
                    config={config}
                    restoreState={restore.state}
                    useSubCharts={restore.state?.useSubCharts}
                    onInit={setApi}
                />
            </div>
        </div>
    );
}
