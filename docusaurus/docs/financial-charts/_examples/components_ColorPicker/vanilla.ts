import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    ColorPicker,
    CoinbaseExchange,
    defaultExchangeProvider,
    EDescriptorSectionName,
    idbPriceStore,
    IStudy,
    MACDStudy,
    OHLCStudy,
    SciFinanceChartPanel,
    SMAStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Change one colour setting of a live study.
// A study's settings are its descriptor: "inputs" and "styles" sections of named controls, each
// holding its value in `default`. Copy the descriptor with one control's value changed, and apply
// it: SMAStudy and MACDStudy restyle their series in place, without reloading any data
function setStudyColour(study: IStudy, control: string, colour: string) {
    const descriptor = study.getDescriptor();
    const styles = descriptor[EDescriptorSectionName.STYLES].controls;
    study.applyDescriptor({
        ...descriptor,
        [EDescriptorSectionName.STYLES]: {
            controls: { ...styles, [control]: { ...styles[control], default: colour } },
        },
    });
}

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);

    // Give the studies their starting colours, so the colour pickers can start from them,
    // and 2px lines, so colour changes are easy to see
    const sma = new SMAStudy({ length: 20, renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } });
    const macd = new MACDStudy({ bandOptions: { stroke: "#2ec4b6", strokeY1: "#e71d36", strokeThickness: 2 } });

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "1M", // the last month: fewer candles, so colour changes are easy to see
        studies: [new OHLCStudy(), sma, macd],
    });

    // ColorPicker: a labelled swatch that opens a colour picker with opacity.
    // onChange is called on every change, with "#rrggbb", or "#rrggbbaa" when not opaque
    const pickers = [
        ColorPicker.create(toolbar, {
            label: "SMA 20",
            value: "#ff9f1c",
            onChange: (colour) => setStudyColour(sma, "strokeColor", colour),
        }),
        ColorPicker.create(toolbar, {
            label: "MACD line",
            value: "#2ec4b6",
            onChange: (colour) => setStudyColour(macd, "bandMacdColor", colour),
        }),
        ColorPicker.create(toolbar, {
            label: "Signal line",
            value: "#e71d36",
            onChange: (colour) => setStudyColour(macd, "bandSignalColor", colour),
        }),
    ];

    // When the page goes away: pickers.forEach((p) => p.destroy()); financeChartPanel.cleanup();
    return { financeChartPanel, pickers };
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "24px",
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

createChart();
