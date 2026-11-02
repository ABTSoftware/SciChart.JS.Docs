import {
    CandleInterval,
    defaultExchangeProvider,
    ISciFinanceChartPanelApi,
    nullCandleStore,
    OHLCStudy,
    SciFinanceChartPanel,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SyntheticExchange } from "./SyntheticExchange";

export async function drawExample(container: HTMLElement): Promise<ISciFinanceChartPanelApi> {
    // Register once. The store decides what is cached between sessions: nullCandleStore caches
    // nothing, which suits generated data. Use idbPriceStore to keep real data in IndexedDB.
    if (!defaultExchangeProvider.getExchange("Synthetic")) {
        defaultExchangeProvider.registerExchange(new SyntheticExchange(), nullCandleStore);
    }

    return SciFinanceChartPanel.create(container, {
        exchangeName: "Synthetic",
        symbol: "ALPHA",
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 20 })],
    });
}
