import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    filterStudyMenuItems,
    groupStudyMenuItems,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    RSIStudy,
    SMAStudy,
    STUDY_MENU_ITEMS,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, StudyList } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function StudiesUiChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new RSIStudy()],
        }),
        []
    );

    return (
        <div style={{ display: "flex", height: 600 }}>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
            <div style={{ width: 360, overflow: "auto" }}>
                {api && (
                    <>
                        <StudyPicker api={api} />
                        {/* The SDK's StudyList: click a study to edit its settings live, × to remove it */}
                        <StudyList chart={api.financeApi} title="Studies" />
                    </>
                )}
            </div>
        </div>
    );
}

/** A minimal "add indicator" picker over the SDK's study catalogue, searched and grouped by category. */
function StudyPicker({ api }: { api: ISciFinanceChartPanelApi }) {
    const [query, setQuery] = React.useState("");
    const groups = groupStudyMenuItems(filterStudyMenuItems(STUDY_MENU_ITEMS, { query }));

    return (
        <div>
            <input placeholder="Search indicators" value={query} onChange={(e) => setQuery(e.target.value)} />
            {groups.map((group) => (
                <div key={group.category}>
                    <h4>{group.category}</h4>
                    {group.items.map((item) => (
                        <button
                            key={item.type}
                            title={item.description}
                            disabled={item.disabled}
                            // studyProvider creates any study from its type, with default settings
                            onClick={() => api.financeApi.attachStudy(studyProvider.getStudy(item.type))}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
