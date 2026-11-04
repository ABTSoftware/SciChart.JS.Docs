import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, EStudyCategory, EStudyType, filterStudyMenuItems, groupStudyMenuItems, idbPriceStore, OHLCStudy, SciFinanceChartPanel, STUDY_CATEGORY_ORDER, STUDY_MENU_ITEMS, studyProvider, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; height: 100%">
//     <div id="chart" style="flex: 1; min-width: 0"></div>
//     <div id="picker" style="width: 300px; overflow-y: auto"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// The studies the picker offers: the SDK's catalogue, less the price study (always on this chart)
// and the order-book studies, which need an order-book source that CoinbaseExchange doesn't provide
const PICKABLE = STUDY_MENU_ITEMS.filter((item) => item.type !== EStudyType.OHLC && item.category !== EStudyCategory.OrderBook);
const CATEGORIES = STUDY_CATEGORY_ORDER.filter((category) => category !== EStudyCategory.OrderBook);
async function createChart() {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // The picker's state: the search text, the category shown, and the user's favourites
    let query = "";
    let category = "all";
    let favouritesOnly = false;
    const favourites = new Set([EStudyType.RSI, EStudyType.MACD, EStudyType.BBANDS]);
    const picker = document.getElementById("picker");
    Object.assign(picker.style, panelStyle);
    // Search box: filterStudyMenuItems matches labels, descriptions, categories and types,
    // so "average", "bollinger", "volatility" and "rsi" all find what you'd expect
    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Search indicators";
    Object.assign(search.style, inputStyle);
    search.oninput = () => {
        query = search.value;
        render();
    };
    // Category filter: one EStudyCategory, or "all"
    const categorySelect = document.createElement("select");
    Object.assign(categorySelect.style, inputStyle);
    categorySelect.append(new Option("All categories", "all"), ...CATEGORIES.map((c) => new Option(c, c)));
    categorySelect.onchange = () => {
        category = categorySelect.value;
        render();
    };
    // Favourites only: isFavorite keeps just the studies it returns true for
    const favouritesLabel = document.createElement("label");
    const favouritesBox = document.createElement("input");
    favouritesBox.type = "checkbox";
    favouritesBox.onchange = () => {
        favouritesOnly = favouritesBox.checked;
        render();
    };
    favouritesLabel.append(favouritesBox, " Favourites only");
    Object.assign(favouritesLabel.style, mutedStyle);
    const message = document.createElement("div");
    Object.assign(message.style, mutedStyle);
    // Past maxPanes (6 by default), attachStudy refuses an oscillator and raises paneLimitReached
    chart.paneLimitReached.subscribe(({ max }) => (message.textContent = `At most ${max} panes: close a pane first`));
    const list = document.createElement("div");
    picker.append(search, categorySelect, favouritesLabel, message, list);
    // One row per study: click to add it to the chart, ☆ to favourite it
    const row = (item) => {
        const onChart = chart.studies.filter((study) => study.type === item.type).length;
        const add = document.createElement("button");
        Object.assign(add.style, rowStyle);
        add.title = `Add ${item.description}`;
        add.innerHTML = `<b>${item.label}</b>${onChart ? ` <small>(${onChart} on chart)</small>` : ""}<br><span style="opacity: 0.6">${item.description}</span>`;
        add.onclick = () => {
            message.textContent = "";
            // studyProvider.getStudy creates any registered study by type, with its default settings
            chart.attachStudy(studyProvider.getStudy(item.type));
        };
        const star = document.createElement("button");
        star.textContent = favourites.has(item.type) ? "★" : "☆";
        star.title = "Favourite";
        Object.assign(star.style, starStyle);
        star.onclick = () => {
            favourites.has(item.type) ? favourites.delete(item.type) : favourites.add(item.type);
            render();
        };
        const div = document.createElement("div");
        Object.assign(div.style, { display: "flex", alignItems: "center" });
        div.append(add, star);
        return div;
    };
    function render() {
        const items = filterStudyMenuItems(PICKABLE, {
            query,
            category,
            isFavorite: favouritesOnly ? (type) => favourites.has(type) : undefined,
        });
        // groupStudyMenuItems: sections in STUDY_CATEGORY_ORDER, A–Z within each, empty ones left out
        const groups = groupStudyMenuItems(items);
        list.replaceChildren(...groups.flatMap((group) => {
            const heading = document.createElement("div");
            heading.textContent = group.category;
            Object.assign(heading.style, headingStyle);
            return [heading, ...group.items.map(row)];
        }));
        if (!groups.length)
            list.textContent = "No indicators match.";
    }
    // Re-render when studies are added or removed, to update the "on chart" counts
    chart.studiesChanged.subscribe(render);
    render();
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
// The picker uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const panelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    boxSizing: "border-box",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontSize: "13px",
};
const inputStyle = {
    padding: "6px 8px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "inherit",
    font: "inherit",
};
const mutedStyle = { color: "var(--st-ui-text-muted, #9da2bc)" };
const headingStyle = {
    ...mutedStyle,
    marginTop: "8px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};
const rowStyle = {
    flex: "1",
    padding: "6px 8px",
    border: "0",
    borderRadius: "6px",
    background: "none",
    color: "inherit",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
};
const starStyle = {
    border: "0",
    background: "none",
    color: "#ffb74d",
    fontSize: "16px",
    cursor: "pointer",
};
createChart();
