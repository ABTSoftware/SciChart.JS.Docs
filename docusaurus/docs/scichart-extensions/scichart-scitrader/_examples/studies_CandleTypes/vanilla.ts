import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    CandleTypeSelector,
    defaultExchangeProvider,
    ECandleType,
    idbPriceStore,
    IStudy,
    OHLCStudy,
    PointAndFigureStudy,
    RenkoStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div id="toolbar"></div>
// <div id="chart" style="height: 600px"></div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "SOLUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    // candleType on OHLCStudy sets the starting style
    studies: [new OHLCStudy({ candleType: ECandleType.HeikinAshi }), new VolumeStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart
const toolbar = document.getElementById("toolbar");

// Candlesticks, OHLC bars, line, mountain or Heikin-Ashi. setCandleType redraws the price series
// without reloading data or moving the zoom.
CandleTypeSelector.create(toolbar, {
    value: ECandleType.HeikinAshi,
    onChange: (type) => chart.setCandleType(type),
});

// Renko and point & figure aren't candle types but studies: they plot price moves rather than
// time, so each opens a pane of its own.
let priceAction: IStudy | undefined;

async function showPriceAction(study: IStudy) {
    if (priceAction) {
        chart.detachStudy(priceAction);
    }
    priceAction = study;
    await chart.attachStudy(study);
}

const renko = document.createElement("button");
renko.textContent = "Renko pane";
renko.onclick = () => showPriceAction(new RenkoStudy({ reversalAmount: 2 }));

const pnf = document.createElement("button");
pnf.textContent = "Point & Figure pane";
pnf.onclick = () => showPriceAction(new PointAndFigureStudy({ reversalAmount: 3 }));

toolbar.append(renko, pnf);
