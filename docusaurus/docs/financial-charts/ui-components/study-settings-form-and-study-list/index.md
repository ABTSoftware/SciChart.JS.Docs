---
sidebar_position: 5.5
sidebar_label: Study Settings Form and Study List
title: "Indicator Settings Form and Study List UI Components | SciTrader.js"
description: "Ready-made UI components to let users edit technical indicator settings in SciTrader.js trading charts: StudySettingsForm, a settings form for any study, and StudyList, the chart's studies with their forms, in TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "StudySettingsForm", "StudyList", "indicator settings form", "study settings UI", "React indicator settings", "technical indicator settings panel"]
---

# Study Settings Form and Study List

Two ready-made UI components let users edit the settings of the chart's studies and technical indicators:

| Component | Plain TypeScript | React |
| --- | --- | --- |
| **[Study settings form](#studysettingsform)**<br />One study's settings as a form, applied as they are edited | `StudySettingsForm` | `<StudySettingsForm>` |
| **[Study list](#studylist)**<br />The chart's studies as cards: each opens its settings form, and × removes the study | `StudyList` | `<StudyList>` |

Both edit the study's **descriptor**, the description of its settings that every study has. See [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/) to change settings from code instead. They work with every study, including [your own](/financial-charts/studies-and-indicators/creating-custom-studies/).

Like the other [UI components](/financial-charts/ui-components/#how-they-work), each is plain DOM in `scichart-scitrader`, and `scichart-scitrader-react` wraps it for React.

## StudySettingsForm: A Study's Settings Form {#studysettingsform}

`StudySettingsForm` draws a study's descriptor as a form, with the field each control type needs:

| Control type (`EDescriptorType`) | Field |
| --- | --- |
| `NUMBER` | A number box |
| `TEXT` | A text box |
| `SELECT` | A dropdown of the control's `options` |
| `COLOR` | A [Colour Picker](/financial-charts/ui-components/colour-picker/), with opacity |
| `STROKE_TYPE` | A solid, dashed or dotted line-style dropdown |
| `GRADIENT` | A gradient editor: a colour ramp with a handle per stop |

- **Edits apply as they are made**, `APPLY_DEBOUNCE_MS` (150 ms) after the last change, through `study.applyDescriptor`. Pass `onApply` to do something else with them, such as logging or saving.
- **Reset to defaults** applies the study's `getDefaultDescriptor()`.
- **When settings change elsewhere**, such as from code, the form shows the new values.

```ts
// Plain TypeScript
import { EDescriptorSectionName, StudySettingsForm } from "scichart-scitrader";

const form = StudySettingsForm.create(container, { study: rsi }); // the RSI's settings, in container
form.update({ sectionFilter: [EDescriptorSectionName.STYLES] }); // show only its styles
form.update({ study: macd }); // edit another study
form.destroy(); // remove it when done
```

```tsx
// React: the props are the same options
import { StudySettingsForm } from "scichart-scitrader-react";

<StudySettingsForm study={rsi} sectionFilter={[EDescriptorSectionName.INPUTS]} hideSectionLabels />
```

To show part of a form, pass `sectionFilter`, e.g. `[EDescriptorSectionName.INPUTS]` for the inputs only. `hideSectionLabels` leaves out the "Inputs" and "Styles" headings, for a page with tabs of its own.

### TypeScript Example: StudySettingsForm with Inputs and Styles Tabs

A BTC-USD chart from Coinbase with SMA, Bollinger Bands, RSI and MACD. The panel on the right is a settings page built around one `StudySettingsForm`:

- **The dropdown** picks the study to edit, with `form.update({ study })`.
- **The Inputs and Styles tabs** show one section at a time, with `sectionFilter` and `hideSectionLabels`.
- **The status line** comes from `onApply`, which applies the edit and reports it.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/components_StudySettingsForm/vanilla" html={`<div style="display: flex; height: 100%"><div id="chart" style="flex: 1; min-width: 0"></div><div id="settings" style="width: 320px; overflow-y: auto"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_StudySettingsForm/vanilla.ts
    ```
</CodeSnippetBlock>

### React Example: StudySettingsForm with Inputs and Styles Tabs

The same settings page in React. The study and the tab are React state, passed to the React `StudySettingsForm` as props.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="StudySettingsFormChart" name="../../_examples/components_StudySettingsForm/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_StudySettingsForm/react.tsx
    ```
</CodeSnippetBlock>

### StudySettingsForm API

| Member | What it does |
| --- | --- |
| `StudySettingsForm.create(container, options)` | Creates a form in `container` |
| `options.study` | The study whose settings it edits |
| `options.onApply` | Called with edited settings. Default: `study.applyDescriptor` |
| `options.sectionFilter` | Only these sections. Default: all |
| `options.hideSectionLabels` | Leaves out the section headings |
| `descriptor` | The settings as edited, which may not be applied yet |
| `update(options)` | Changes options; a different `study` reloads the form |
| `destroy()` | Removes the form. A change still waiting to apply is dropped |

<details>
<summary>The IStudySettingsFormOptions interface and StudySettingsForm class, with their TSDoc</summary>

````ts
/** Options for {@link StudySettingsForm}. */
interface IStudySettingsFormOptions {
    /** The study whose settings the form edits. */
    study: IStudy;
    /**
     * Called with the edited settings, {@link APPLY_DEBOUNCE_MS} after the user's last change.
     * Default: `study.applyDescriptor(descriptor)`, which updates the study in place. Pass your own
     * to do something else, e.g. rebuild a study that doesn't support in-place updates (see
     * {@link StudyList}).
     */
    onApply?: (study: IStudy, descriptor: TStudyDescriptor) => void;
    /** Only these sections (e.g. just the inputs). Default: every section the study has. */
    sectionFilter?: readonly EDescriptorSectionName[];
    /** Leave out the section headings, e.g. when the page already shows "Inputs" / "Styles" tabs. */
    hideSectionLabels?: boolean;
}

/** How long the form waits after the last change before applying it, in ms. */
const APPLY_DEBOUNCE_MS = 150;

/**
 * A study's settings form, in plain DOM, generated from its descriptor (`study.getDescriptor()`).
 * Each setting gets the field for its type: number and text boxes, dropdowns (including line
 * style), a colour picker with opacity, a gradient editor. Unknown types are skipped.
 *
 * Changes apply as you make them: {@link APPLY_DEBOUNCE_MS} after the last one, the form calls
 * `onApply` (by default `study.applyDescriptor`). "Reset to defaults" goes back to the study's
 * `getDefaultDescriptor()`. When the study's settings change from elsewhere (its
 * `descriptorApplied` event), the form shows them.
 *
 * Any study gets a form this way, including your own custom studies. The look is
 * `.st-study-form` in `scitrader.css`.
 *
 * ```ts
 * StudySettingsForm.create(panel, { study: chart.financeApi.studies[2] });
 * ```
 *
 * React apps use the React `StudySettingsForm`.
 */
class StudySettingsForm {
    /** The form, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IStudySettingsFormOptions): StudySettingsForm;
    /** The settings as edited, which may not be applied yet. */
    get descriptor(): TStudyDescriptor;
    /**
     * Change any of the options; the ones not given stay as they are. A different `study` reloads
     * the form from it.
     */
    update(options: Partial<IStudySettingsFormOptions>): void;
    /** Remove the form. A change still waiting to be applied is dropped. */
    destroy(): void;
}
````

</details>

## StudyList: The Chart's Studies with Their Settings {#studylist}

`StudyList` lists a chart's studies as cards. Clicking a card opens that study's `StudySettingsForm`, one at a time, and × removes the study from the chart. The list follows the chart's `studiesChanged`, so studies added or removed elsewhere appear and disappear.

A study whose `supportsLiveApply` is `false` can't apply settings in place. For those, the list rebuilds the study with the new settings, through `studyProvider`, and swaps it in. Every built-in study applies settings in place.

```ts
// Plain TypeScript
import { StudyList } from "scichart-scitrader";

const studyList = StudyList.create(sidePanel, { chart: financeChartPanel.financeApi, title: "Indicators" });
studyList.expand(rsi.id); // open the RSI's settings from code
studyList.expand(null); // close them
studyList.destroy(); // remove it when done
```

```tsx
// React. The chart is api.financeApi, from SciFinanceChartView's onInit
import { StudyList } from "scichart-scitrader-react";

<StudyList chart={chart} title="Indicators" emptyMessage="No indicators on the chart." />
```

### TypeScript Example: StudyList Side Panel

A BTC-USD chart from Coinbase with Volume, SMA and RSI, and a `StudyList` titled "Indicators" on the right. Click a card to edit that study's settings, or × to remove it. **Add MACD** and **Add EMA 20** attach studies from code, and the list follows. **Open RSI settings** and **Close settings** use `expand`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/components_StudyList/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div id="studies" style="width: 320px; overflow-y: auto"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_StudyList/vanilla.ts
    ```
</CodeSnippetBlock>

### React Example: StudyList Side Panel

The same chart in React, with the React `StudyList`. It needs the chart's `financeApi`, so it renders once `onInit` has stored it. The React component has no `expand`: to open one study's settings in React, render its `StudySettingsForm`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="StudyListChart" name="../../_examples/components_StudyList/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_StudyList/react.tsx
    ```
</CodeSnippetBlock>

### StudyList API

| Member | What it does |
| --- | --- |
| `StudyList.create(container, options)` | Creates a list in `container` |
| `options.chart` | The chart whose studies it lists: `financeChartPanel.financeApi` |
| `options.title` | A heading above the list |
| `options.emptyMessage` | Shown when the chart has no studies. Default `"No studies attached."` |
| `expand(studyId)` | Opens a study's settings; `expand(null)` closes them |
| `expandedStudyId` | The id of the study whose settings are open, or `null` |
| `update(options)` | Changes options |
| `destroy()` | Removes the list |

<details>
<summary>The IStudyListOptions interface and StudyList class, with their TSDoc</summary>

````ts
/** Options for {@link StudyList}. */
interface IStudyListOptions {
    /** The chart whose studies to list: `panel.financeApi`. */
    chart: SciFinanceChart;
    /** A heading above the list. Default: none. */
    title?: string;
    /** Shown when the chart has no studies. Default `"No studies attached."`. */
    emptyMessage?: string;
}

/**
 * The chart's studies as a list, in plain DOM. Click a study to open its {@link StudySettingsForm}
 * (one at a time); × removes it from the chart. The list follows the chart's `studiesChanged`, so
 * studies added or removed elsewhere appear and disappear.
 *
 * Settings apply in place when the study supports it (`supportsLiveApply`). Otherwise the study is
 * rebuilt with the new settings through `studyProvider` and swapped in. The look is
 * `.st-study-list` in `scitrader.css`.
 *
 * ```ts
 * StudyList.create(sidePanel, { chart: panel.financeApi, title: "Studies" });
 * ```
 *
 * React apps use the React `StudyList`.
 */
class StudyList {
    /** The list, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IStudyListOptions): StudyList;
    /** The id of the study whose settings are open, or `null`. */
    get expandedStudyId(): string | null;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IStudyListOptions>): void;
    destroy(): void;
    /** Open one study's settings, or close them with `null`. */
    expand(studyId: string | null): void;
}
````

</details>

## StudySettingsForm and StudyList in React

The React components take the same options as props, plus `className` and `style` for their `<div>`.

<details>
<summary>The React StudySettingsForm and StudyList components and their props, from scichart-scitrader-react, with their TSDoc</summary>

````ts
/** Props every React study-settings component takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}

/** Props for {@link StudySettingsForm}. */
interface IStudySettingsFormProps extends IHostProps {
    /** The study whose settings the form edits. */
    study: IStudy;
    /** Called with the edited settings after a short pause. Default: `study.applyDescriptor`. */
    onApply?: (study: IStudy, descriptor: TStudyDescriptor) => void;
    /** Only these sections. Default: all. */
    sectionFilter?: readonly EDescriptorSectionName[];
    /** Leave out the section headings. */
    hideSectionLabels?: boolean;
}
/**
 * The SDK's study settings form in React: the vanilla `StudySettingsForm`, generated from the
 * study's descriptor, in a `<div>`. Edits apply to the chart as they are made.
 *
 * ```tsx
 * <StudySettingsForm study={chart.financeApi.studies[2]} />
 * ```
 */
function StudySettingsForm({ study, onApply, sectionFilter, hideSectionLabels, className, style, }: IStudySettingsFormProps): JSX.Element;

/** Props for {@link StudyList}. */
interface IStudyListProps extends IHostProps {
    /** The chart whose studies to list: `api.financeApi`. */
    chart: SciFinanceChart;
    /** A heading above the list. */
    title?: string;
    /** Shown when the chart has no studies. */
    emptyMessage?: string;
}
/**
 * The SDK's study list in React: the chart's studies, each opening its settings form, with ×
 * to remove. Follows studies added or removed elsewhere.
 *
 * ```tsx
 * <StudyList chart={api.financeApi} title="Studies" />
 * ```
 */
function StudyList({ chart, title, emptyMessage, className, style }: IStudyListProps): JSX.Element;
````

</details>

## Styling the Study Settings Form and Study List

The form and list are styled by `scitrader.css`, with these classes:

| Class | Element |
| --- | --- |
| `.st-study-form` | The form |
| `.st-study-form__section`, `.st-study-form__section-label` | An "Inputs" or "Styles" section, and its heading |
| `.st-study-form__footer`, `.st-study-form__reset` | The footer, and its **Reset to defaults** button |
| `.st-study-form__empty` | Shown for a study with no settings |
| `.st-study-list` | The list |
| `.st-study-list__title`, `.st-study-list__empty` | Its heading, and the message when the chart has no studies |
| `.st-study-list__items`, `.st-study-list__card` | The cards, and one card |
| `.st-study-list__header`, `.st-study-list__name`, `.st-study-list__chevron`, `.st-study-list__remove` | A card's header row: the study name, the open/close chevron and the × button |
| `.st-study-list__body` | An open card's settings form |

The fields inside a form are the SDK's shared fields: `.st-text-field` (number and text boxes), `.st-select-field` (dropdowns) and the [Colour Picker](/financial-charts/ui-components/colour-picker/)'s `.st-color-field`. Colours come from the `--st-ui-*` CSS variables, so a [theme](/financial-charts/styling-and-themes/) restyles them all. To change one thing, override its rule after importing `scitrader.css`:

```css
/* Tighter cards in the study list */
.st-study-list__items { padding: 0 8px 8px; } /* less space around the cards */
.st-study-list__card { border-radius: 0; } /* square corners */

/* Accent-coloured section headings in the settings form */
.st-study-form__section-label { color: #ff9f1c; }
```

<details>
<summary>The default settings form CSS (.st-study-form), from scitrader.css</summary>

```css
.st-study-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;
    font-family: var(--st-font-family, "DM Sans", sans-serif);
}

.st-study-form__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.st-study-form__section-label {
    color: var(--st-ui-text-muted, #9da2bc);
    font-size: 12px;
    line-height: 1.66;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.st-study-form__empty {
    margin: 0;
    padding: 8px;
    color: var(--st-ui-text-muted, #9da2bc);
    font-size: 14px;
}

.st-study-form__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
}

.st-study-form__reset {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 5px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--st-ui-text-muted, #9da2bc);
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.75;
    cursor: pointer;
}

.st-study-form__reset:hover {
    color: var(--st-ui-text, #ffffff);
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.04);
}
```

</details>

<details>
<summary>The default study list CSS (.st-study-list), from scitrader.css</summary>

```css
.st-study-list {
    height: 100%;
    background: var(--st-ui-background, #2b2839);
    font-family: var(--st-font-family, "DM Sans", sans-serif);
}

.st-study-list__title {
    flex-shrink: 0;
    padding: 20px 24px 16px;
    color: var(--st-ui-text, #ffffff);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.st-study-list__empty {
    margin: 0;
    padding: 0 24px;
    color: var(--st-ui-text-muted, #9da2bc);
    font-size: 14px;
    line-height: 1.43;
}

.st-study-list__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px 16px;
    scrollbar-width: thin;
    scrollbar-color: var(--st-ui-scrollbar-thumb, #4a4560) var(--st-ui-scrollbar-track, #1e1b2e);
}

.st-study-list__card {
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.03);
}

.st-study-list__header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    outline: none;
}

.st-study-list__header:hover,
.st-study-list__header:focus-visible {
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.04);
}

.st-study-list__chevron {
    display: inline-flex;
    color: var(--st-ui-text-muted, #9da2bc);
    transition: transform 160ms ease;
}

.st-study-list__header[aria-expanded="true"] .st-study-list__chevron {
    transform: rotate(180deg);
}

.st-study-list__name {
    flex: 1;
    margin-left: 8px;
    color: var(--st-ui-text, #ffffff);
    font-size: 14px;
}

.st-study-list__remove {
    display: inline-flex;
    padding: 5px;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--st-ui-text-muted, #9da2bc);
    cursor: pointer;
}

.st-study-list__remove:hover {
    color: var(--st-ui-text, #ffffff);
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-study-list__body {
    padding: 8px 12px 12px;
}
```

</details>

## Where to read next

- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): the descriptor these components edit, and changing settings from code.
- [Colour Picker](/financial-charts/ui-components/colour-picker/): the colour field the form uses, on its own.
- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): an indicator picker to go with the list.
