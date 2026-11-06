import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EStudyCategory,
    EStudyType,
    filterStudyMenuItems,
    groupStudyMenuItems,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    IStudy,
    OHLCStudy,
    STUDY_CATEGORY_ORDER,
    STUDY_MENU_ITEMS,
    studyProvider,
    TStudyCategoryFilter,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// The studies the picker offers: the SDK's catalogue, less the price study (always on this chart)
// and the order-book studies, which need an order-book source that CoinbaseExchange doesn't provide
const PICKABLE = STUDY_MENU_ITEMS.filter(
    (item) => item.type !== EStudyType.OHLC && item.category !== EStudyCategory.OrderBook
);
const CATEGORIES = STUDY_CATEGORY_ORDER.filter((category) => category !== EStudyCategory.OrderBook);

export function IndicatorPickerChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    // The studies on the chart, kept in state for the "on chart" counts
    const [studies, setStudies] = React.useState<readonly IStudy[]>([]);
    const [message, setMessage] = React.useState("");
    // The picker's state: the search text, the category shown, and the user's favourites
    const [query, setQuery] = React.useState("");
    const [category, setCategory] = React.useState<TStudyCategoryFilter>("all");
    const [favouritesOnly, setFavouritesOnly] = React.useState(false);
    const [favourites, setFavourites] = React.useState<ReadonlySet<string>>(
        new Set([EStudyType.RSI, EStudyType.MACD, EStudyType.BBANDS])
    );

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // financeApi throws until the chart has initialised, so subscribe from onInit.
    // The chart is deleted when this component unmounts, so there's no need to unsubscribe
    const onInit = (api: ISciFinanceChartPanelApi) => {
        const chart = api.financeApi;
        setStudies(chart.studies);
        chart.studiesChanged.subscribe(() => setStudies(chart.studies));
        // Past maxPanes (6 by default), attachStudy refuses an oscillator and raises paneLimitReached
        chart.paneLimitReached.subscribe(({ max }) => setMessage(`At most ${max} panes: close a pane first`));
    };

    // studyProvider.getStudy creates any registered study by type, with its default settings
    const addStudy = (type: string) => {
        if (!chartRef.current?.isInitialized) return;
        setMessage("");
        chartRef.current.financeApi.attachStudy(studyProvider.getStudy(type));
    };

    const toggleFavourite = (type: string) =>
        setFavourites((previous) => {
            const next = new Set(previous);
            next.has(type) ? next.delete(type) : next.add(type);
            return next;
        });

    // filterStudyMenuItems matches the search against labels, descriptions, categories and types,
    // keeps one category (or "all"), and with isFavorite, only the favourites.
    // groupStudyMenuItems sorts the result into category sections, A–Z within each
    const groups = groupStudyMenuItems(
        filterStudyMenuItems(PICKABLE, {
            query,
            category,
            isFavorite: favouritesOnly ? (type) => favourites.has(type) : undefined,
        })
    );

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} onInit={onInit} />
            </div>
            <div style={panelStyle}>
                <input
                    type="search"
                    placeholder="Search indicators"
                    style={inputStyle}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select
                    style={inputStyle}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TStudyCategoryFilter)}
                >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <label style={mutedStyle}>
                    <input type="checkbox" checked={favouritesOnly} onChange={(e) => setFavouritesOnly(e.target.checked)} />{" "}
                    Favourites only
                </label>
                <div style={mutedStyle}>{message}</div>
                {groups.length === 0 && <div>No indicators match.</div>}
                {groups.map((group) => (
                    <React.Fragment key={group.category}>
                        <div style={headingStyle}>{group.category}</div>
                        {group.items.map((item) => {
                            const onChart = studies.filter((study) => study.type === item.type).length;
                            return (
                                <div key={item.type} style={{ display: "flex", alignItems: "center" }}>
                                    <button style={rowStyle} title={`Add ${item.description}`} onClick={() => addStudy(item.type)}>
                                        <b>{item.label}</b>
                                        {onChart > 0 && <small>{` (${onChart} on chart)`}</small>}
                                        <br />
                                        <span style={{ opacity: 0.6 }}>{item.description}</span>
                                    </button>
                                    <button style={starStyle} title="Favourite" onClick={() => toggleFavourite(item.type)}>
                                        {favourites.has(item.type) ? "★" : "☆"}
                                    </button>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

// The picker uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const panelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: 300,
    padding: 12,
    boxSizing: "border-box",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontSize: 13,
};
const inputStyle: React.CSSProperties = {
    padding: "6px 8px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "inherit",
    font: "inherit",
};
const mutedStyle: React.CSSProperties = { color: "var(--st-ui-text-muted, #9da2bc)" };
const headingStyle: React.CSSProperties = {
    ...mutedStyle,
    marginTop: 8,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};
const rowStyle: React.CSSProperties = {
    flex: 1,
    padding: "6px 8px",
    border: 0,
    borderRadius: 6,
    background: "none",
    color: "inherit",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
};
const starStyle: React.CSSProperties = { border: 0, background: "none", color: "#ffb74d", fontSize: 16, cursor: "pointer" };
