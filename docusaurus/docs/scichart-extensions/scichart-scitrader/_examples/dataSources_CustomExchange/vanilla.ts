import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    defaultExchangeProvider,
    nullCandleStore,
    OHLCStudy,
    SciFinanceChartPanel,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SyntheticExchange } from "./SyntheticExchange";

// Any object implementing IRemoteExchange can back a chart: see SyntheticExchange.ts.
// Register it once, at startup. The store decides what is cached between sessions: nullCandleStore
// caches nothing, which suits generated data. Use idbPriceStore to keep real data in IndexedDB.
const synthetic = new SyntheticExchange();
defaultExchangeProvider.registerExchange(synthetic, nullCandleStore);

// <div id="chart" style="height: 600px"></div>
// Pan left to page back through history. It stops at the exchange's listing date.
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: synthetic.name, // name="Synthetic", set in SyntheticExchange
    symbol: "ALPHA",
    interval: CandleInterval.ONE_MINUTE,
    period: "1H",
    studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 20 })],
});
