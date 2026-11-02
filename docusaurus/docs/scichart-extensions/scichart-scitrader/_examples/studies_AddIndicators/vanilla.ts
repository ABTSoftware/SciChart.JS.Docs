import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    BollingerBandsStudy,
    CandleInterval,
    defaultExchangeProvider,
    EMAStudy,
    idbPriceStore,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// Every indicator is a study. Pass them in `studies`, in the order they should draw.
// Options left out take their defaults, and the user can change them all later in the settings form.
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    studies: [
        new OHLCStudy(),
        new VolumeStudy(),
        // Overlays draw on the price pane
        new SMAStudy({ length: 50 }),
        new EMAStudy({ length: 20, renderOptions: { stroke: "#FFB74D", strokeThickness: 2 } }),
        new BollingerBandsStudy({ period: 20, stdDev: 2 }),
        // Oscillators each get a pane of their own, added below the price pane
        new RSIStudy({ length: 14, overbought: 70, oversold: 30 }),
        new MACDStudy({ fast: 12, slow: 26, signal: 9 }),
    ],
});
