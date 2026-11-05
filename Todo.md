# SciTrader Docs TODO

Docs work still to do for the SciTrader.js (Financial Charts) section, `docusaurus/docs/financial-charts/`, branch `v6.x-scitrader`.

## 1. Mobile (touch) and desktop (mouse) modes

- [ ] Document switching between mobile (touch) and desktop (mouse) mode.
  - Follow the SciTraderApp's pattern, which passes `isMobile` to the `SciFinanceChart`.
  - Explain how behaviour differs between touch and mouse mode:
    - **drawing tools:** long press to select; placement with a drag-to-aim cursor; `selectFinishedDrawing`; `resumeGestures`;
    - **zooming and panning:** pinch and drag versus the mouse wheel; cursor mode; no on-chart buttons on touch.
  - Today the touch side is covered only in part, in `drawing-tools/keyboard-and-touch/` (the `touch` option).

## 2. Examples: replace the Coinbase exchange with a simple JSON exchange

- [ ] Change every example to use a simple exchange that loads its data from JSON (a JavaScript object), instead of `CoinbaseExchange`.
  - This avoids network problems: rate limits, geo-blocking, Coinbase being down, and slow first loads.
  - It also makes the examples deterministic, e.g. a fixed price history for the indicator and drawing pages.
  - Covers every `_examples/*` example and its CodePen.

## 3. Move the finance chart into UI Components

- [ ] Move the finance chart (`SciFinanceChartPanel` / `SciFinanceChartView`) into **UI Components**.
  - Keep **Finance Chart API** and the **Chart Config** object pages as its sub-pages.
  - Update every link to `/financial-charts/finance-chart-api/`.

## 4. Expand Data Sources

- [ ] Expand `data-sources/` into a section with sub-pages:
  - `CoinbaseExchange`, `BinanceExchange`, `CSVExchange`;
  - `IRemoteExchange`, and building a custom exchange;
  - how the data manager works, and how it stores data and routes it through studies;
  - `IdbCandleStore` and the caching mechanism, and `NullCandleStore`. Note the IndexedDB fallback work in SCT-917;
  - loading data from JSON or a JavaScript object, which goes with item 2.

## 5. Expand Saving and Restoring

- [ ] Expand `save-and-restore/` on serialisation, `toJSON` / `fromJSON`:
  - examples of the saved JSON, and the entire schema (`ISciFinanceChartPanelState`, `IStudyState`, `ISerializedAnnotation`, layout state);
  - what is saved and loaded between sessions, and what isn't;
  - where it is saved by default;
  - how to control this: redirect where it is saved. Customers may not want to save and restore to local app storage, but to their own servers.

## 6. Layout, Panes and PaneGroup under the finance chart UI component

- [ ] Make Layout, Panes and PaneGroup a sub-item of the finance chart UI component (see item 3). Show how to:
  - customise the layout in code;
  - add custom HTML and UI, and style it;
  - pre-place panes at given heights;
  - toggle settings such as maximised and minimised in code.

## 7. Styling and Themes

- [ ] Expand `styling-and-themes/`:
  - show the three built-in themes;
  - show how to create a custom theme;
  - show ALL the CSS that can be overridden;
  - add a CodePen sandbox for applying custom CSS to the chart.

## Related SDK tickets

Drawing tools: SCT-928, SCT-929, SCT-930, SCT-931. Indicators: SCT-923 to SCT-927. See `seo/financial-charts-indicator-pages.md` for the full list and the pages each affects.
