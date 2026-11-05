import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, DrawingToolbar, DrawingToolsController, EStudyType, idbPriceStore, OHLCStudy, registerDrawingTools, SciFinanceChartPanel, studyProvider, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="tools"></div>
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <pre id="log"></pre>
//     </div>
// </div>
// Register a data source, and the drawing tools' types so saved drawings can be restored
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
// What is stored: the chart's state, inside an envelope with a version. Bump the version when your
// app can no longer restore older saves, and they are ignored instead of breaking the chart
const SCHEMA_VERSION = 1;
const wrap = (state) => ({
    version: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    state,
});
const unwrap = (saved) => saved?.version === SCHEMA_VERSION && saved.state?.finance && saved.state?.layout ? saved.state : null;
// 2a. The browser's localStorage: per browser, about 5 MB, and synchronous
class LocalStorageStore {
    constructor(key) {
        this.key = key;
        this.name = "This browser";
    }
    async load() {
        const raw = localStorage.getItem(this.key);
        return unwrap(raw ? JSON.parse(raw) : null);
    }
    async save(state) {
        localStorage.setItem(this.key, JSON.stringify(wrap(state)));
    }
    async clear() {
        localStorage.removeItem(this.key);
    }
}
// 2b. Your server, over HTTP: the user's charts follow them to any device. Send whatever your API
// needs to know the user, e.g. a session cookie (credentials: "include") or an Authorization header
class ServerStore {
    constructor(url) {
        this.url = url;
        this.name = "Server";
    }
    async load() {
        const response = await fetch(this.url, { credentials: "include" });
        if (response.status === 404)
            return null; // nothing saved yet
        if (!response.ok)
            throw new Error(`Load failed: ${response.status}`);
        return unwrap(await response.json());
    }
    async save(state) {
        const response = await fetch(this.url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wrap(state)),
            keepalive: true, // lets a save sent as the page closes still arrive
        });
        if (!response.ok)
            throw new Error(`Save failed: ${response.status}`);
    }
    async clear() {
        await fetch(this.url, { method: "DELETE", credentials: "include" });
    }
}
const STORES = [new LocalStorageStore("my-app:chart"), new ServerStore("/api/charts/main")];
let store = STORES[0];
const container = document.getElementById("chart");
let financeChartPanel;
let drawing;
let tools;
let stopAutoSave = () => { };
// 3. Open the chart: restore the saved one if there is one, otherwise create a new one. If a saved
// chart can't be restored, discard it and start fresh, so a bad save can never leave a blank chart
async function openChart() {
    stopAutoSave();
    tools?.destroy();
    drawing?.detach();
    financeChartPanel?.cleanup();
    let state = null;
    try {
        state = await store.load();
    }
    catch (e) {
        log(`Load failed: ${e}`);
    }
    try {
        financeChartPanel = state
            ? await SciFinanceChartPanel.fromJSON(container, state, { useSubCharts: state.useSubCharts })
            : await createNewChart();
        log(state ? `Restored from ${store.name}` : `Nothing saved in ${store.name}: new chart`);
    }
    catch (e) {
        log(`Restore failed, starting fresh: ${e}`);
        await store.clear();
        financeChartPanel?.cleanup();
        financeChartPanel = await createNewChart();
    }
    drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
    tools = DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });
    stopAutoSave = autoSave(financeChartPanel, drawing, (state) => store.save(state));
}
function createNewChart() {
    return SciFinanceChartPanel.create(container, {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
}
// 4. Auto-save: save after each change the chart reports, at most every half second, and right away
// when the page is hidden or closed. Returns a function that stops it
function autoSave(panel, drawingTools, save) {
    const chart = panel.financeApi;
    let timer;
    const saveNow = () => {
        clearTimeout(timer);
        timer = undefined;
        const state = panel.toJSON();
        save(state).then(() => log(`Saved ${JSON.stringify(state).length.toLocaleString()} characters to ${store.name}`), (e) => log(`${e}`));
    };
    const saveSoon = () => {
        clearTimeout(timer);
        timer = setTimeout(saveNow, 500);
    };
    const onDataRendered = ({ type }) => (type === "symbol-change" || type === "interval-change") && saveSoon();
    const onHidden = () => document.visibilityState === "hidden" && timer !== undefined && saveNow();
    // What can change: studies, the theme, the candle type, the live-tip mode, the symbol and interval,
    // the pane layout (sizes, order, hidden, maximised), and the drawings
    const events = [
        chart.studiesChanged,
        chart.themeChanged,
        chart.candleTypeChanged,
        chart.liveTipModeChanged,
        panel.paneGroupApi.stateChanged,
        drawingTools.drawingsChanged,
    ];
    events.forEach((event) => event.subscribe(saveSoon));
    chart.dataRenderComplete.subscribe(onDataRendered);
    // A study's edited settings fire no event: they are saved with the next change, or when the page hides
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", saveNow);
    return () => {
        clearTimeout(timer);
        events.forEach((event) => event.unsubscribe(saveSoon));
        chart.dataRenderComplete.unsubscribe(onDataRendered);
        document.removeEventListener("visibilitychange", onHidden);
        window.removeEventListener("pagehide", saveNow);
    };
}
function renderToolbar() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const button = (text, selected, onClick) => {
        const b = document.createElement("button");
        b.textContent = text;
        Object.assign(b.style, buttonStyle(selected));
        b.onclick = onClick;
        return b;
    };
    const chart = () => financeChartPanel.financeApi;
    toolbar.replaceChildren(...STORES.map((s) => button(`Save to: ${s.name}`, s === store, () => {
        store = s;
        renderToolbar();
        openChart();
    })), button("BTC-USD", false, () => chart().setSymbol("BTC-USD")), button("ETH-USD", false, () => chart().setSymbol("ETH-USD")), button("Add RSI", false, () => chart().attachStudy(studyProvider.getStudy(EStudyType.RSI))), 
    // Open the chart again from the store, as a page reload would
    button("Reload chart", false, () => openChart()), button("Clear saved", false, () => store.clear().then(() => log(`Cleared ${store.name}`))));
}
function log(message) {
    const pre = document.getElementById("log");
    Object.assign(pre.style, logStyle);
    pre.textContent = `${new Date().toLocaleTimeString()}  ${message}\n` + pre.textContent;
}
// A stand-in for your server, so the example runs in the browser: it answers /api/charts/… itself,
// keeping the saves in sessionStorage. In your app, this is your backend, and you leave this out
function installMockServer() {
    const realFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (!url.startsWith("/api/charts/"))
            return realFetch(input, init);
        const method = init?.method ?? "GET";
        await new Promise((r) => setTimeout(r, 150)); // network latency
        log(`${method} ${url}${init?.body ? ` (${String(init.body).length.toLocaleString()} characters)` : ""}`);
        const key = `mock-server:${url}`;
        if (method === "PUT")
            sessionStorage.setItem(key, String(init.body));
        if (method === "DELETE")
            sessionStorage.removeItem(key);
        const body = sessionStorage.getItem(key);
        return method === "GET" && !body ? new Response(null, { status: 404 }) : new Response(method === "GET" ? body : null);
    };
}
// The toolbar and log use SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = (selected) => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent, #5c5cff)" : "var(--st-ui-button-background, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px sans-serif",
    cursor: "pointer",
});
const logStyle = {
    width: "300px",
    margin: "0",
    padding: "8px",
    overflow: "auto",
    background: "var(--st-ui-background, #2b2839)",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "11px monospace",
    whiteSpace: "pre-wrap",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
installMockServer();
renderToolbar();
openChart();
