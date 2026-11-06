import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    DrawingToolsController,
    EStudyType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciFinanceChartPanelState,
    OHLCStudy,
    registerDrawingTools,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Register a data source, and the drawing tools' types so saved drawings can be restored
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();

// 1. A store: somewhere to load and save a chart. The rest of the app only uses this interface,
// so the storage can change without touching the chart code
interface IChartStateStore {
    readonly name: string;
    load(): Promise<ISciFinanceChartPanelState | null>;
    save(state: ISciFinanceChartPanelState): Promise<void>;
    clear(): Promise<void>;
}

// What is stored: the chart's state, inside an envelope with a version. Bump the version when your
// app can no longer restore older saves, and they are ignored instead of breaking the chart
const SCHEMA_VERSION = 1;
interface ISavedChart {
    version: number;
    savedAt: string;
    state: ISciFinanceChartPanelState;
}
const wrap = (state: ISciFinanceChartPanelState): ISavedChart => ({
    version: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    state,
});
const unwrap = (saved: ISavedChart | null) =>
    saved?.version === SCHEMA_VERSION && saved.state?.finance && saved.state?.layout ? saved.state : null;

// 2a. The browser's localStorage: per browser, about 5 MB, and synchronous
class LocalStorageStore implements IChartStateStore {
    readonly name = "This browser";
    constructor(private readonly key: string) {}
    async load() {
        const raw = localStorage.getItem(this.key);
        return unwrap(raw ? JSON.parse(raw) : null);
    }
    async save(state: ISciFinanceChartPanelState) {
        localStorage.setItem(this.key, JSON.stringify(wrap(state)));
    }
    async clear() {
        localStorage.removeItem(this.key);
    }
}

// 2b. Your server, over HTTP: the user's charts follow them to any device. Send whatever your API
// needs to know the user, e.g. a session cookie (credentials: "include") or an Authorization header
class ServerStore implements IChartStateStore {
    readonly name = "Server";
    constructor(private readonly url: string) {}
    async load() {
        const response = await fetch(this.url, { credentials: "include" });
        if (response.status === 404) return null; // nothing saved yet
        if (!response.ok) throw new Error(`Load failed: ${response.status}`);
        return unwrap(await response.json());
    }
    async save(state: ISciFinanceChartPanelState) {
        const response = await fetch(this.url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wrap(state)),
            keepalive: true, // lets a save sent as the page closes still arrive
        });
        if (!response.ok) throw new Error(`Save failed: ${response.status}`);
    }
    async clear() {
        await fetch(this.url, { method: "DELETE", credentials: "include" });
    }
}

const STORES: IChartStateStore[] = [new LocalStorageStore("my-app:chart"), new ServerStore("/api/charts/main")];

// The log is outside React, so the mock server can write to it too
const logListeners = new Set<(line: string) => void>();
const log = (message: string) => logListeners.forEach((l) => l(`${new Date().toLocaleTimeString()}  ${message}`));
installMockServer(log);

export function StorageChart() {
    const [store, setStore] = React.useState(STORES[0]);
    // undefined while loading; null when nothing is saved
    const [saved, setSaved] = React.useState<ISciFinanceChartPanelState | null | undefined>(undefined);
    const [mount, setMount] = React.useState(0);
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const { controller } = useDrawingTools(api);
    const [lines, setLines] = React.useState<string[]>([]);

    React.useEffect(() => {
        const listener = (line: string) => setLines((l) => [line, ...l]);
        logListeners.add(listener);
        return () => void logListeners.delete(listener);
    }, []);

    // 3. Open the chart: load the saved state, then create the chart from it (or a new one)
    const open = React.useCallback(
        (from: IChartStateStore) => {
            controller?.clearSelection(); // the drawing tools detach after the old chart is gone
            setApi(undefined);
            setSaved(undefined);
            from.load()
                .catch((e) => (log(`Load failed: ${e}`), null))
                .then((state) => {
                    log(state ? `Restored from ${from.name}` : `Nothing saved in ${from.name}: new chart`);
                    setSaved(state);
                    setMount((m) => m + 1);
                });
        },
        [controller]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => open(store), [store]);

    // 4. Auto-save while this chart is open
    React.useEffect(() => {
        if (!api || !controller) return undefined;
        return autoSave(api, controller, (state) => store.save(state), store.name);
    }, [api, controller, store]);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        [mount]
    );

    const chart = () => api?.financeApi;
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                {STORES.map((s) => (
                    <button key={s.name} style={buttonStyle(s === store)} onClick={() => setStore(s)}>
                        Save to: {s.name}
                    </button>
                ))}
                <button style={buttonStyle(false)} onClick={() => chart()?.setSymbol("BTC-USD")}>BTC-USD</button>
                <button style={buttonStyle(false)} onClick={() => chart()?.setSymbol("ETH-USD")}>ETH-USD</button>
                <button
                    style={buttonStyle(false)}
                    onClick={() => chart()?.attachStudy(studyProvider.getStudy(EStudyType.RSI))}
                >
                    Add RSI
                </button>
                {/* Open the chart again from the store, as a page reload would */}
                <button style={buttonStyle(false)} onClick={() => open(store)}>Reload chart</button>
                <button style={buttonStyle(false)} onClick={() => store.clear().then(() => log(`Cleared ${store.name}`))}>
                    Clear saved
                </button>
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <DrawingToolbar controller={controller} orientation="vertical" />
                <div style={{ flex: 1, minWidth: 0 }}>
                    {saved !== undefined && (
                        <SciFinanceChartView
                            key={mount}
                            config={config}
                            restoreState={saved}
                            useSubCharts={saved?.useSubCharts}
                            onInit={setApi}
                        />
                    )}
                </div>
                <pre style={logStyle}>{lines.join("\n")}</pre>
            </div>
        </div>
    );
}

// Auto-save: save after each change the chart reports, at most every half second, and right away
// when the page is hidden or closed. Returns a function that stops it
function autoSave(
    panel: ISciFinanceChartPanelApi,
    drawingTools: DrawingToolsController,
    save: (state: ISciFinanceChartPanelState) => Promise<void>,
    storeName: string
): () => void {
    const chart = panel.financeApi;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const saveNow = () => {
        clearTimeout(timer);
        timer = undefined;
        const state = panel.toJSON();
        save(state).then(
            () => log(`Saved ${JSON.stringify(state).length.toLocaleString()} characters to ${storeName}`),
            (e) => log(`${e}`)
        );
    };
    const saveSoon = () => {
        clearTimeout(timer);
        timer = setTimeout(saveNow, 500);
    };
    const onDataRendered = ({ type }: { type: string }) =>
        (type === "symbol-change" || type === "interval-change") && saveSoon();
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

// A stand-in for your server, so the example runs in the browser: it answers /api/charts/… itself,
// keeping the saves in sessionStorage. In your app, this is your backend, and you leave this out
function installMockServer(onRequest: (message: string) => void) {
    const realFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (!url.startsWith("/api/charts/")) return realFetch(input, init);
        const method = init?.method ?? "GET";
        await new Promise((r) => setTimeout(r, 150)); // network latency
        onRequest(`${method} ${url}${init?.body ? ` (${String(init.body).length.toLocaleString()} characters)` : ""}`);
        const key = `mock-server:${url}`;
        if (method === "PUT") sessionStorage.setItem(key, String(init.body));
        if (method === "DELETE") sessionStorage.removeItem(key);
        const body = sessionStorage.getItem(key);
        return method === "GET" && !body ? new Response(null, { status: 404 }) : new Response(method === "GET" ? body : null);
    };
}

// The toolbar and log use SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle = (selected: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent, #5c5cff)" : "var(--st-ui-button-background, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px sans-serif",
    cursor: "pointer",
});

const logStyle: React.CSSProperties = {
    width: 300,
    margin: 0,
    padding: 8,
    overflow: "auto",
    background: "var(--st-ui-background, #2b2839)",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "11px monospace",
    whiteSpace: "pre-wrap",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
