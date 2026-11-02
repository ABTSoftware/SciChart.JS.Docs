import * as React from "react";
import {
    CandleInterval,
    DEFAULT_MARKET_DEPTH_SETTINGS,
    getOrderBookSource,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    OrderBookHeatmapStudy,
    OrderBookImbalanceStudy,
    themeMarketDepthSettings,
    TMarketDepthSettings,
    unthemeMarketDepthSettings,
    VolumeStudy,
} from "scichart-scitrader";
import { ColorPicker, MarketDepthView, SciFinanceChartView, useSciTraderTheme } from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { DUMMY_EXCHANGE } from "../../dummyData/DummyDataExchange";
import { registerDummyData } from "../../sampleData";

/**
 * Order-book data: the liquidity heatmap behind the price, book imbalance in its own pane, and
 * the live market-depth ladder. Any exchange can offer an order book by registering an
 * `IOrderBookSource` for its name with `setOrderBookSources`; here it is the Sandbox's randomised
 * `DummyOrderBookSource`, so it runs offline.
 *
 * The two `ColorPicker`s recolour the ladder's bid and ask prices, as a settings dialog would.
 */
export default function OrderBookExample(): JSX.Element {
    registerDummyData();
    const symbol = "ALPHAUSD";
    const [chart, setChart] = React.useState<ISciFinanceChartPanelApi>();
    const theme = useSciTraderTheme();
    const source = getOrderBookSource(DUMMY_EXCHANGE);

    // Saved settings are theme-neutral: a colour left at its default follows the theme. Show the
    // colours as drawn under the current theme, and store an edit theme-neutral again.
    const [depthSettings, setDepthSettings] = React.useState<TMarketDepthSettings>(DEFAULT_MARKET_DEPTH_SETTINGS);
    const shown = themeMarketDepthSettings(depthSettings, theme);
    const setColour = (key: "bid" | "ask", value: string) =>
        setDepthSettings(unthemeMarketDepthSettings({ ...shown, colours: { ...shown.colours, [key]: value } }, theme));

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: DUMMY_EXCHANGE,
            symbol,
            interval: CandleInterval.ONE_MINUTE,
            period: "1H",
            lockPeriodWidth: false,
            // The order-book studies declare that they need an order-book feed; the chart creates
            // one from the source registered for the exchange.
            studies: [new OrderBookHeatmapStudy(), new OHLCStudy(), new VolumeStudy(), new OrderBookImbalanceStudy()],
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; the theme then follows through setTheme
        []
    );

    React.useEffect(() => {
        chart?.financeApi.setTheme(theme);
    }, [chart, theme]);

    return (
        <ExamplePage
            title="Order Book: Heatmap, Imbalance and Market Depth"
            description={
                <>
                    <code>OrderBookHeatmapStudy</code> paints resting liquidity behind the candles,{" "}
                    <code>OrderBookImbalanceStudy</code> plots bid versus ask depth, and <code>MarketDepthView</code>{" "}
                    (the SDK's <code>MarketDepthPanel</code>, drawn with SciChart) shows the live book on the right.
                    Hover a rung to see what sweeping the book to that price would cost. They all read an{" "}
                    <code>IOrderBookSource</code>: here, randomised data from the Sandbox's{" "}
                    <code>DummyOrderBookSource</code>. The <code>ColorPicker</code>s above recolour the ladder's bid and
                    ask prices.
                </>
            }
            toolbar={
                <>
                    <ColorPicker label="Bid" value={shown.colours.bid} onChange={(v) => setColour("bid", v)} />
                    <ColorPicker label="Ask" value={shown.colours.ask} onChange={(v) => setColour("ask", v)} />
                </>
            }
            ready={chart !== undefined}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <SciFinanceChartView
                        config={config}
                        useSubCharts={false}
                        onInit={(api) => {
                            (window as unknown as { __example?: unknown }).__example = api;
                            setChart(api);
                        }}
                    />
                </div>
                <div
                    style={{
                        width: 300,
                        display: "flex",
                        borderLeft: "1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08)",
                    }}
                >
                    {source && <MarketDepthView source={source} symbol={symbol} settings={depthSettings} />}
                </div>
            </div>
        </ExamplePage>
    );
}
