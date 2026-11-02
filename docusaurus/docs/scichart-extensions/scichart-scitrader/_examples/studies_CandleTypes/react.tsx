import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    ECandleType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    IStudy,
    OHLCStudy,
    PointAndFigureStudy,
    RenkoStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { CandleTypeSelector, SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function CandleTypesChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [candleType, setCandleType] = React.useState(ECandleType.HeikinAshi);
    const priceAction = React.useRef<IStudy>();

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "SOLUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            // candleType on OHLCStudy sets the starting style
            studies: [new OHLCStudy({ candleType: ECandleType.HeikinAshi }), new VolumeStudy()],
        }),
        []
    );

    // Renko and point & figure are studies, each in a pane of its own. Show one at a time.
    const showPriceAction = async (study: IStudy) => {
        if (priceAction.current) {
            api.financeApi.detachStudy(priceAction.current);
        }
        priceAction.current = study;
        await api.financeApi.attachStudy(study);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 700 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <CandleTypeSelector
                    value={candleType}
                    onChange={(next) => {
                        setCandleType(next);
                        api?.financeApi.setCandleType(next); // redraws without reloading data
                    }}
                />
                <button disabled={!api} onClick={() => showPriceAction(new RenkoStudy({ reversalAmount: 2 }))}>
                    Renko pane
                </button>
                <button
                    disabled={!api}
                    onClick={() => showPriceAction(new PointAndFigureStudy({ reversalAmount: 3 }))}
                >
                    Point &amp; Figure pane
                </button>
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
        </div>
    );
}
