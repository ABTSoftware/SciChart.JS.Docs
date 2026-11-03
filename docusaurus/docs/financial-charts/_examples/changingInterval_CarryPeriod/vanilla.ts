import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    carryPeriodToInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    TPeriod,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Coinbase offers 1m, 5m, 15m, 1h, 6h and 1d candles
const INTERVALS = [CandleInterval.FIFTEEN_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY];

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);

    let currentInterval = CandleInterval.ONE_HOUR;
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: currentInterval,
        period: "1M", // start on the last month
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart

    // A checkbox to compare the two behaviours
    const keepSpanLabel = document.createElement("label");
    const keepSpan = document.createElement("input");
    keepSpan.type = "checkbox";
    keepSpan.checked = true;
    keepSpanLabel.append(keepSpan, " Keep the span (carryPeriodToInterval)");
    Object.assign(keepSpanLabel.style, labelStyle);

    const buttons = INTERVALS.map((interval) => {
        const button = document.createElement("button");
        button.textContent = interval; // "15m", "1h", "6h", "1d"
        button.onclick = () => {
            currentInterval = interval;
            // Checked: keep about the span the user is looking at, adjusted to suit the new interval.
            // Unchecked: pass no period, so the chart jumps to the interval's default period
            const period: TPeriod | null | undefined = keepSpan.checked
                ? carryPeriodToInterval(chart.currentPeriod, interval)
                : undefined;
            chart.changeInterval(interval, period);
        };
        toolbar.appendChild(button);
        return button;
    });
    toolbar.appendChild(keepSpanLabel);

    // Shows the interval and period on screen
    const status = document.createElement("span");
    Object.assign(status.style, labelStyle);
    toolbar.appendChild(status);

    const updateToolbar = (loading: boolean) => {
        buttons.forEach((button, i) => {
            Object.assign(button.style, buttonStyle(INTERVALS[i] === currentInterval));
            button.disabled = loading;
        });
        status.textContent = loading ? "Loading…" : `Interval ${currentInterval}, period ${chart.currentPeriod}`;
    };
    updateToolbar(false);

    // Disable the buttons while an interval change loads, and show the result once it's drawn
    chart.dataLoadStarted.subscribe(() => updateToolbar(true));
    chart.dataRenderComplete.subscribe((args) => {
        if (args.type === "interval-change") {
            updateToolbar(false);
        }
    });

    return financeChartPanel; // call financeChartPanel.cleanup() when the page goes away
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

const labelStyle: Partial<CSSStyleDeclaration> = {
    marginLeft: "8px",
    fontSize: "14px",
    fontFamily: "var(--st-font-family, sans-serif)",
    color: "var(--st-ui-text, #ffffff)",
};

createChart();
