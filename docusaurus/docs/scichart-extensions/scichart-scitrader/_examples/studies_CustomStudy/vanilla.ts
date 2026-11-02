import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    StudySettingsForm,
    VolumeStudy,
} from "scichart-scitrader";
import { MOMENTUM, MomentumStudy, registerMomentumStudy } from "./MomentumStudy";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// Register the custom study once, so it can be created by type and restored from a saved chart
registerMomentumStudy();

// <div id="settings"></div>
// <div id="chart" style="height: 600px"></div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "SOLUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    // A custom study goes in `studies` like any built-in one
    studies: [new OHLCStudy(), new VolumeStudy(), new MomentumStudy({ length: 10 })],
});

// The SDK's settings form works for custom studies too: it is generated from the study's descriptor
const momentum = financeChartPanel.financeApi.studies.find((study) => study.type === MOMENTUM);
StudySettingsForm.create(document.getElementById("settings"), { study: momentum });
