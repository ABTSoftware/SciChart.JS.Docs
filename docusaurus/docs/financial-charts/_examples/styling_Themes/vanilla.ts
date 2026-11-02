import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    createSciTraderTheme,
    defaultExchangeProvider,
    EMAStudy,
    EStudyType,
    idbPriceStore,
    ISciTraderTheme,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChartPanel,
    SCITRADER_DARK_THEME,
    SCITRADER_OCEAN_THEME,
    SCITRADER_THEME_LIST,
    SMAStudy,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// A custom theme: createSciTraderTheme starts from any theme and overrides only what you list.
// Here, the built-in Ocean theme with a gold price line and crosshair labels.
const OCEAN_GOLD_THEME: ISciTraderTheme = createSciTraderTheme(SCITRADER_OCEAN_THEME, {
    name: "Ocean Gold",
    chart: {
        currentPriceLine: "#FFD54F",
        crosshairLabelBackground: "#FFD54F",
    },
});

// The built-in themes, and the custom one
const THEMES = [...SCITRADER_THEME_LIST, OCEAN_GOLD_THEME];

// <div id="toolbar"></div>
// <div id="chart" style="height: 700px"></div>
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    // The theme the chart starts with. Leave it out for SCITRADER_DARK_THEME
    theme: SCITRADER_DARK_THEME,
    studies: [
        new OHLCStudy(),
        new VolumeStudy(),
        new EMAStudy({ length: 20 }),
        // A colour passed explicitly is your choice, and themes leave it alone
        new SMAStudy({ length: 50, renderOptions: { stroke: "#FFFFFF", strokeThickness: 2 } }),
        new RSIStudy(),
        new MACDStudy(),
    ],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart
const toolbar = document.getElementById("toolbar");

// setTheme restyles a live chart in place: axes, backgrounds, legend, crosshair and every study,
// keeping explicit colours (the white SMA) and colours the user has edited
for (const theme of THEMES) {
    const button = document.createElement("button");
    button.textContent = theme.name;
    button.onclick = () => chart.setTheme(theme);
    toolbar.appendChild(button);
}

// Studies added later take the chart's current theme too
const addEma = document.createElement("button");
addEma.textContent = "Add EMA";
addEma.onclick = () => chart.attachStudy(studyProvider.getStudy(EStudyType.EMA));
toolbar.appendChild(addEma);

// themeChanged reports every switch, whatever made it
chart.themeChanged.subscribe((theme) => console.log("Theme:", theme.name));
