---
sidebar_position: 3
sidebar_label: Saving to Your Own Storage or Server
title: "Save Chart Layouts to localStorage, IndexedDB or Your Server | SciTrader.js"
description: "Store saved SciTrader.js trading charts wherever your app needs: localStorage, IndexedDB, a JSON file, or your own server over a REST API. Auto-save on every change, and load saved state safely."
keywords: ["save chart layout server", "user settings REST API", "chart auto save", "localStorage chart state", "IndexedDB chart", "persist user chart settings", "SciTrader.js"]
---

# Saving to Your Own Storage or Server

The SDK doesn't store charts itself: `toJSON()` gives you the state, and you keep it wherever your app keeps user data. Choose by where the user should find their chart again:

| Store | The user's chart is kept | Notes |
| --- | --- | --- |
| [`localStorage`](#local-storage) | In this browser, until cleared | About 5 MB per site. The simplest |
| [IndexedDB](#indexeddb) | In this browser, until cleared | Much larger, asynchronous. For many saved charts |
| [Your server](#server) | In their account, on any device | Needs a signed-in user, and an API on your server |
| [A file](#file) | Wherever they save it | Export and import, e.g. to share a layout |

## TypeScript Example: Auto-Save to the Browser or a Server

The chart saves itself after every change: add RSI, switch symbol, draw, or resize a pane, and the log on the right shows each save. **Reload chart** opens it again from the store, as a page reload would. **Save to: Server** switches to a store that calls a REST API with `fetch`. A small mock in the example answers the API in the browser, so you can see each request; in your app, your server answers it.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/saveRestore_Storage/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="tools"></div><div id="chart" style="flex: 1; min-width: 0"></div><pre id="log"></pre></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/saveRestore_Storage/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Auto-Save to the Browser or a Server

The same in React: the chart is created from the loaded state with `restoreState`, and auto-saving runs in an effect.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="StorageChart" name="../../_examples/saveRestore_Storage/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/saveRestore_Storage/react.tsx
    ```
</CodeSnippetBlock>

## A Store Interface {#store-interface}

Keep the chart code apart from the storage: give the rest of your app one small interface, and switch stores without touching the chart:

```ts
import { ISciFinanceChartPanelState } from "scichart-scitrader";

interface IChartStateStore {
    load(): Promise<ISciFinanceChartPanelState | null>;
    save(state: ISciFinanceChartPanelState): Promise<void>;
    clear(): Promise<void>;
}
```

Store the state inside an **envelope** with your own version, so you can tell old saves from new ones; see [Versions](/financial-charts/save-and-restore/json-format/#versions):

```ts
const SCHEMA_VERSION = 1;

interface ISavedChart {
    version: number;
    savedAt: string;
    state: ISciFinanceChartPanelState;
}

const wrap = (state: ISciFinanceChartPanelState): ISavedChart => ({ version: SCHEMA_VERSION, savedAt: new Date().toISOString(), state });

// A save from another version, or one that isn't a chart, is ignored
const unwrap = (saved: ISavedChart | null) =>
    saved?.version === SCHEMA_VERSION && saved.state?.finance && saved.state?.layout ? saved.state : null;
```

## localStorage {#local-storage}

```ts
class LocalStorageStore implements IChartStateStore {
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
```

`localStorage.setItem` throws when the storage is full or blocked, e.g. in some private browsing modes, so catch it where you save. The SciTrader app keeps its chart in `localStorage` this way.

## Your Server {#server}

To keep each user's chart in their account, so it follows them to any device, save it through your own API. On the client:

```ts
class ServerStore implements IChartStateStore {
    constructor(private readonly url: string) {} // e.g. "/api/charts/main"

    async load() {
        const response = await fetch(this.url, { credentials: "include" }); // send the session cookie
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
            keepalive: true, // a save sent as the page closes still arrives
        });
        if (!response.ok) throw new Error(`Save failed: ${response.status}`);
    }

    async clear() {
        await fetch(this.url, { method: "DELETE", credentials: "include" });
    }
}
```

Identify the user however your API does: a session cookie, as here, or an `Authorization: Bearer …` header. `keepalive` lets a request outlive the page, up to 64 KB, which covers a typical chart.

On the server, keep the JSON as it comes, by user and chart. For example, with Node and Express:

```ts
import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

// requireUser: your sign-in middleware, which sets req.user
app.get("/api/charts/:chartId", requireUser, async (req, res) => {
    const saved = await db.charts.find({ userId: req.user.id, chartId: req.params.chartId });
    saved ? res.json(saved.data) : res.sendStatus(404);
});

app.put("/api/charts/:chartId", requireUser, async (req, res) => {
    await db.charts.upsert({ userId: req.user.id, chartId: req.params.chartId, data: req.body, updatedAt: new Date() });
    res.sendStatus(204);
});

app.delete("/api/charts/:chartId", requireUser, async (req, res) => {
    await db.charts.delete({ userId: req.user.id, chartId: req.params.chartId });
    res.sendStatus(204);
});
```

- **Store it as JSON,** e.g. a `jsonb` column in PostgreSQL, or a document in MongoDB. Your server needn't understand it.
- **Check the size and shape** before storing: a chart is a few KB, so reject anything far bigger.
- **Only the user's own charts:** take the user from the session, never from the request body.

## IndexedDB {#indexeddb}

For larger or many saved charts, IndexedDB holds far more than `localStorage`, asynchronously. The [`idb`](https://www.npmjs.com/package/idb) package makes it short:

```ts
import { openDB } from "idb";

const db = openDB("my-app", 1, { upgrade: (d) => d.createObjectStore("charts") });

class IndexedDbStore implements IChartStateStore {
    constructor(private readonly key: string) {}
    async load() {
        return unwrap((await (await db).get("charts", this.key)) ?? null);
    }
    async save(state: ISciFinanceChartPanelState) {
        await (await db).put("charts", wrap(state), this.key);
    }
    async clear() {
        await (await db).delete("charts", this.key);
    }
}
```

## Export and Import as a File {#file}

Let users download a chart, and open it again, e.g. to move a layout to another browser, or share it:

```ts
function exportChart(financeChartPanel: ISciFinanceChartPanelApi) {
    const blob = new Blob([JSON.stringify(wrap(financeChartPanel.toJSON()), null, 2)], { type: "application/json" });
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "chart.json" });
    link.click();
    URL.revokeObjectURL(link.href);
}

// <input type="file" accept="application/json">
async function importChart(file: File): Promise<ISciFinanceChartPanelState | null> {
    return unwrap(JSON.parse(await file.text()));
}
```

## Saving Automatically {#auto-save}

Rather than a Save button, save after every change. The chart reports its changes as events:

| Change | Event |
| --- | --- |
| A study added or removed | `financeApi.studiesChanged` |
| The symbol or interval | `financeApi.dataRenderComplete`, with `type` `"symbol-change"` or `"interval-change"` |
| The candle type | `financeApi.candleTypeChanged` |
| The live-tip mode | `financeApi.liveTipModeChanged` |
| The theme | `financeApi.themeChanged` |
| Pane sizes, order, hidden, maximised or closed | `paneGroupApi.stateChanged` |
| A drawing added, moved or removed | `DrawingToolsController.drawingsChanged` |

- **Wait for changes to settle.** Dragging a divider fires many events: save half a second after the last one.
- **Save when the page is hidden or closed,** on `visibilitychange` and `pagehide`. Changes with no event, such as a study's edited settings, are saved then, or with the next change.
- **Stop auto-saving** before the chart is removed, so a closing chart doesn't save a half-built state.

The example's `autoSave(financeChartPanel, drawingTools, save)` does all of this, and returns a function that stops it.

## Loading Saved State Safely {#loading-safely}

A saved state can outlive the code that wrote it. If it can't be restored, e.g. it names a study your app no longer registers, `fromJSON` throws. Don't let one bad save leave the user with a blank chart on every visit:

```ts
async function openChart(store: IChartStateStore) {
    const state = await store.load().catch(() => null);
    if (state) {
        try {
            return await SciFinanceChartPanel.fromJSON(element, state, { useSubCharts: state.useSubCharts });
        } catch {
            await store.clear(); // discard it, and start fresh
        }
    }
    return SciFinanceChartPanel.create(element, defaultConfig);
}
```

**If a restore can hang or crash the page,** rather than throw, the SciTrader app also marks each restore before it starts (`localStorage.setItem("restore-pending", "1")`), and clears the mark once the chart is ready. If the mark is still there on the next load, the previous restore never finished, so it discards the saved chart instead of trying it again.

## Several Charts and Layouts {#several-charts}

Save each chart under its own key, e.g. `charts/<user>/<chartId>`. For named layouts the user can pick from, save a list:

```ts
interface ISavedLayout {
    name: string; // "Day trading", "Swing"
    state: ISciFinanceChartPanelState;
}
```

To open a saved layout on another symbol, change `finance.symbol` before restoring; see [Editing a Saved Chart](/financial-charts/save-and-restore/json-format/#editing).

## Settings Beside the Chart {#app-settings}

A chart's state doesn't include the theme or your app's own settings. Save them beside it, in the same request or file:

```ts
interface IUserSettings {
    version: 1;
    chart: ISciFinanceChartPanelState;
    themeId: string; // builtInThemeId(theme): "dark", "light" or "ocean"
    watchlist: string[];
}
```

Restore the chart with `fromJSON(element, settings.chart, { theme: SCITRADER_THEMES[settings.themeId] })`. The SciTrader app exports this kind of bundle, with its watchlists, favourite studies and preferences, as one JSON file.

## Where to read next

- [The Saved JSON Format](/financial-charts/save-and-restore/json-format/): what is in the state you store.
- [Saving and Restoring](/financial-charts/save-and-restore/): `toJSON`, `fromJSON` and React.
- [Styling and Themes](/financial-charts/styling-and-themes/#remembering): remembering the user's theme.
