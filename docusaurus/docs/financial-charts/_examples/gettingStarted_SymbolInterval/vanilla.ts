import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    carryPeriodToInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    IntervalSelector,
    OHLCStudy,
    PeriodSelector,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD"]; // Coinbase's symbol format
// Coinbase offers 1m, 5m, 15m, 1h, 6h and 1d candles
const INTERVALS = [CandleInterval.FIFTEEN_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY];

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: SYMBOLS[0],
        interval: CandleInterval.SIX_HOURS,
        period: "1M", // show the last month
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart

    // Symbol: plain buttons. setSymbol keeps the exchange, interval, period and studies
    const symbolButtons = SYMBOLS.map((symbol) => {
        const button = document.createElement("button");
        button.textContent = symbol;
        button.onclick = () => {
            symbolButtons.forEach((b) => Object.assign(b.style, buttonStyle(b === button)));
            chart.setSymbol(symbol);
        };
        Object.assign(button.style, buttonStyle(symbol === SYMBOLS[0]));
        toolbar.appendChild(button);
        return button;
    });

    // Interval: the SDK's IntervalSelector
    const intervals = IntervalSelector.create(toolbar, {
        value: CandleInterval.SIX_HOURS,
        intervals: INTERVALS,
        onChange: (interval) => {
            // Keep about the same span on screen, adjusted to suit the new interval
            const period = carryPeriodToInterval(periods.value, interval);
            periods.update({ value: period, currentInterval: interval });
            chart.changeInterval(interval, period);
        },
    });

    // Period: the SDK's PeriodSelector. "Free", or clicking the selected period again, gives null
    const periods = PeriodSelector.create(toolbar, {
        value: "1M",
        currentInterval: CandleInterval.SIX_HOURS, // greys out periods that don't suit the interval
        onChange: (period) => chart.setPeriod(period),
    });

    // When the page goes away: intervals.destroy(); periods.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, intervals, periods };
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle = (active: boolean): Partial<CSSStyleDeclaration> => ({
    padding: "6px 14px",
    fontSize: "14px",
    fontFamily: "var(--st-font-family, sans-serif)",
    color: "var(--st-ui-text, #ffffff)",
    background: active ? "var(--st-ui-accent, #7464ff)" : "var(--st-ui-surface, #373447)",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "4px",
    cursor: "pointer",
});

createChart();
