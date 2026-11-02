import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    EStudyCategory,
    EStudyType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    STUDY_MENU_ITEMS,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// The catalogue the SciTrader app's indicator picker uses, without price types and order-book studies
const MENU = STUDY_MENU_ITEMS.filter(
    (item) => !item.disabled && item.category !== EStudyCategory.Price && item.category !== EStudyCategory.OrderBook
);

export function RuntimeIndicatorsChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [attached, setAttached] = React.useState<EStudyType[]>([]);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "ETHUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "1M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // Track the chart's studies, whatever adds or removes them
    React.useEffect(() => {
        if (!api) return undefined;
        const chart = api.financeApi;
        const onChange = () => setAttached(chart.studies.map((study) => study.type));
        onChange();
        chart.studiesChanged.subscribe(onChange);
        return () => chart.studiesChanged.unsubscribe(onChange);
    }, [api]);

    const toggle = (type: EStudyType) => {
        const chart = api.financeApi;
        const existing = chart.studies.find((study) => study.type === type);
        if (existing) {
            chart.detachStudy(existing); // a pane left empty is removed with it
        } else {
            chart.attachStudy(studyProvider.getStudy(type)); // adds a pane if the study needs one
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 800 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {MENU.map((item) => (
                    <button
                        key={item.type}
                        title={item.description}
                        disabled={!api}
                        style={{ fontWeight: attached.includes(item.type) ? "bold" : "normal" }}
                        onClick={() => toggle(item.type)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                {/* onInit: the chart is ready, and financeApi can be used */}
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
        </div>
    );
}
