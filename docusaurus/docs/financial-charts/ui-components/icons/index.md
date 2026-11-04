---
sidebar_position: 7
sidebar_label: Icons
title: "SciTrader Icons: Toolbar and Navigation SVG Icons | SciTrader.js"
description: "The SciTrader.js app icons as SVG markup and React components: a gallery of every icon, sciTraderIconSvg, SciTraderIcon, their options, and how to style them."
keywords: ["SciTrader", "SciTrader.js", "SciTraderIcon", "sciTraderIconSvg", "SCITRADER_ICONS", "trading app icons", "SVG icons"]
---

# Icons

The SDK has the SciTrader app's toolbar and navigation icons, as SVG. There are nine:

| Name | Used in the SciTrader app for | Has a selected look |
| --- | --- | --- |
| `pencil` | The drawing tools | |
| `drawingList` | The list of drawings on the chart | |
| `fx` | The indicators (studies) view | ✓ |
| `settings` | The chart settings view | ✓ |
| `target` | Switching the cursor mode (crosshair) | |
| `bookmark` | The watchlist view, and bookmarking a symbol | ✓ |
| `marketDepth` | The order book (market depth) view | ✓ |
| `more` | The "more" menu | ✓ |
| `palette` | The theme picker | |

**The selected look.** Five of the icons have a second version, their *selected look*, filled with the theme's brand gradient instead of the plain text colour. It marks the button of the view that is open. The SciTrader app uses these five icons on its navigation tabs, each of which opens a view: the watchlist (`bookmark`), the indicators (`fx`), the settings (`settings`), the order book (`marketDepth`) and the "more" menu (`more`). The selected look shows which view is open, as a tab's highlight does. The other four icons are for buttons that perform an action, such as starting a drawing (`pencil`), so they have no selected look. Draw it with `selected: true`; on an icon without one, `selected` has no effect.

The galleries below show every icon, with the selected look beside the five that have one.

## TypeScript Example: Icon Gallery

Every icon, drawn with `sciTraderIconSvg`, in its normal look and, where it has one, its selected look. The buttons are styled with plain CSS, and the icons take the buttons' colour; hover over one to see it change.

<LiveDocSnippet maxWidth={"100%"} height={420} includeSciTrader name="../../_examples/components_Icons/vanilla" html={`<div id="gallery" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_Icons/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Icon Gallery

The same gallery in React, with the `SciTraderIcon` component from `scichart-scitrader-react`. Click an icon to select it.

<LiveDocSnippet maxWidth={"100%"} height={420} includeSciTrader reactComponent="IconGallery" name="../../_examples/components_Icons/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_Icons/react.tsx
    ```
</CodeSnippetBlock>

## sciTraderIconSvg: Icons as SVG Markup {#scitradericonsvg}

`sciTraderIconSvg` returns an icon's complete `<svg>` markup as a string, for plain TypeScript or any framework. Insert it as HTML:

```ts
import { sciTraderIconSvg } from "scichart-scitrader";

// sciTraderIconSvg(name: TSciTraderIconName, options?: ISciTraderIconOptions): string
const button = document.createElement("button");
button.setAttribute("aria-label", "Watchlist"); // label the button: the icon is hidden from screen readers
button.innerHTML = sciTraderIconSvg("bookmark", { width: 20, height: 20, selected: true });
```

| Option | Type | What it does |
| --- | --- | --- |
| `width` | `number` | The icon's width in pixels. Default: its natural width |
| `height` | `number` | The icon's height in pixels. Default: its natural height |
| `selected` | `boolean` | Draw the "selected" look, for icons that have one. Default `false` |
| `className` | `string` | A class for the `<svg>` |

`name` is a `TSciTraderIconName`: one of the nine names above. `SCITRADER_ICONS` holds each icon's natural `width` and `height`, `viewBox` and markup (`body`, and `selectedBody` for the selected look), for drawing them your own way.

## SciTraderIcon: Icons in React {#scitradericon}

`SciTraderIcon` from `scichart-scitrader-react` renders the same `<svg>`, with the same options as props. It is safe to render on the server.

```tsx
import { SciTraderIcon } from "scichart-scitrader-react";

<button aria-label="Watchlist" onClick={() => setTab("watchlist")}>
    <SciTraderIcon name="bookmark" width={20} height={20} selected={tab === "watchlist"} />
</button>
```

<details>
<summary>sciTraderIconSvg, ISciTraderIconOptions, TSciTraderIconName, ISciTraderIcon and SCITRADER_ICONS, with their TSDoc</summary>

```ts
/**
 * The complete `<svg>` markup for an icon, hidden from assistive technology (label the button
 * it sits in instead).
 *
 * ```ts
 * button.innerHTML = sciTraderIconSvg("bookmark", { selected: true });
 * ```
 */
function sciTraderIconSvg(name: TSciTraderIconName, options?: ISciTraderIconOptions): string;

/** Options for {@link sciTraderIconSvg}. */
interface ISciTraderIconOptions {
    /** Default: the icon's natural width. */
    width?: number;
    /** Default: the icon's natural height. */
    height?: number;
    /** Draw the "selected" look, for icons that have one. Default `false`. */
    selected?: boolean;
    /** A class for the `<svg>`. */
    className?: string;
}

/** The name of a {@link SCITRADER_ICONS} icon. */
type TSciTraderIconName = "pencil" | "drawingList" | "fx" | "settings" | "target" | "bookmark" | "marketDepth" | "more" | "palette";

/** One icon: its natural size and its markup, the inside of its `<svg>`. */
interface ISciTraderIcon {
    width: number;
    height: number;
    viewBox: string;
    body: string;
    /** The "selected" look, where the icon has one. */
    selectedBody?: string;
}

/** Every SciTrader UI icon, by name. */
const SCITRADER_ICONS: Record<TSciTraderIconName, ISciTraderIcon>;
```

</details>

<details>
<summary>The React SciTraderIcon and its props, with their TSDoc</summary>

```ts
/** Props for {@link SciTraderIcon}. */
interface ISciTraderIconProps {
    name: TSciTraderIconName;
    /** Default: the icon's natural width. */
    width?: number;
    /** Default: the icon's natural height. */
    height?: number;
    /** Draw the "selected" look (the brand gradient), for icons that have one. Default `false`. */
    selected?: boolean;
    className?: string;
}

/**
 * One of the SDK's UI icons (`SCITRADER_ICONS`) as an inline `<svg>`. It fills with
 * `currentColor`, so it follows the text colour of the button it sits in, and it is hidden from
 * assistive technology: label the button instead. Safe to render on the server.
 *
 * ```tsx
 * <IconButton aria-label="Watchlist">
 *     <SciTraderIcon name="bookmark" selected={tab === "watchlist"} />
 * </IconButton>
 * ```
 */
function SciTraderIcon({ name, width, height, selected, className }: ISciTraderIconProps): JSX.Element;
```

</details>

## Styling the Icons {#styling}

- **Colour:** the icons fill with `currentColor`, so they take the text colour of the element they sit in. Style the button, not the icon: `color: …` on the button, including on `:hover`.
- **Size:** pass `width` and `height`, or style the `<svg>` through `className`.
- **Selected look:** the brand gradient comes from the theme's `--st-ui-brand-gradient-start` and `--st-ui-brand-gradient-end` CSS variables, darkened 20%, so it follows the theme. Set them to change it.
- **Accessibility:** the icons are hidden from assistive technology (`aria-hidden`). Give the button an `aria-label`.

```css
/* Icon buttons that turn the accent colour on hover */
.my-toolbar button {
    color: var(--st-ui-icon, #e5e7eb);
}
.my-toolbar button:hover {
    color: var(--st-ui-accent, #7464ff);
}

/* A different selected gradient */
:root {
    --st-ui-brand-gradient-start: #22c55e;
    --st-ui-brand-gradient-end: #0ea5e9;
}

/* Every icon given className: "toolbar-icon" at 18px */
.toolbar-icon {
    width: 18px;
    height: 18px;
}
```

See [Styling and Themes](/financial-charts/styling-and-themes/#icons).

The `palette` icon's path is from Font Awesome Free 5.15.4 (CC BY 4.0).
