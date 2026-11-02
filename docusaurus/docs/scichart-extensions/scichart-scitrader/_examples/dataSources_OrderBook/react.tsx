import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    DEFAULT_MARKET_DEPTH_SETTINGS,
    defaultExchangeProvider,
    ISciFinanceChartPanelConfig,
    nullCandleStore,
    OHLCStudy,
    OrderBookHeatmapStudy,
    OrderBookImbalanceStudy,
    setOrderBookSources,
    themeMarketDepthSettings,
    TMarketDepthSettings,
    unthemeMarketDepthSettings,
    VolumeStudy,
} from "scichart-scitrader";
import { ColorPicker, MarketDepthView, SciFinanceChartView, useSciTraderTheme } from "scichart-scitrader-react";
import { DummyDataExchange, DummyOrderBookSource } from "./DummyDataExchange";

// Candles come from an exchange; the order book from an IOrderBookSource registered under the same
// exchange name. Both are randomised here (see DummyDataExchange.ts), so the sample runs offline.
const exchange = new DummyDataExchange();
const orderBook = new DummyOrderBookSource();
defaultExchangeProvider.registerExchange(exchange, nullCandleStore);
setOrderBookSources(new Map([[exchange.name, orderBook]]));

const SYMBOL = "ALPHAUSD";

export function OrderBookChart() {
    // The theme from the nearest SciTraderThemeProvider, or the default dark theme
    const theme = useSciTraderTheme();

    // Market-depth settings are stored theme-neutral: a colour left at its default follows the theme.
    // Show the colours as drawn under the current theme, and store an edit theme-neutral again.
    const [depthSettings, setDepthSettings] = React.useState<TMarketDepthSettings>(DEFAULT_MARKET_DEPTH_SETTINGS);
    const shown = themeMarketDepthSettings(depthSettings, theme);
    const setColour = (side: "bid" | "ask", colour: string) =>
        setDepthSettings(unthemeMarketDepthSettings({ ...shown, colours: { ...shown.colours, [side]: colour } }, theme));

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: exchange.name, // name="Dummy", set in DummyDataExchange
            symbol: SYMBOL,
            interval: CandleInterval.ONE_MINUTE,
            period: "1H",
            // The order-book studies need an order-book feed. The chart creates one from the source
            // registered for the exchange.
            studies: [new OrderBookHeatmapStudy(), new OHLCStudy(), new VolumeStudy(), new OrderBookImbalanceStudy()],
        }),
        []
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <ColorPicker label="Bid" value={shown.colours.bid} onChange={(v) => setColour("bid", v)} />
                <ColorPicker label="Ask" value={shown.colours.ask} onChange={(v) => setColour("ask", v)} />
            </div>
            <div style={{ flex: 1, display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <SciFinanceChartView config={config} />
                </div>
                {/* The live market-depth ladder. Hover a rung to see what sweeping the book to that price would cost. */}
                <div style={{ width: 300, display: "flex" }}>
                    <MarketDepthView source={orderBook} symbol={SYMBOL} settings={depthSettings} />
                </div>
            </div>
        </div>
    );
}
