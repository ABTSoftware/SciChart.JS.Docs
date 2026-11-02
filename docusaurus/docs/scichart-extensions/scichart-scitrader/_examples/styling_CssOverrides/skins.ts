/**
 * CSS overrides for the SDK's toolbars and controls. In an app these rules go in your own
 * stylesheet; the demo injects whichever one is picked so it can switch between them.
 *
 * Each set is scoped under a class on an element around the chart (`.skin-rounded` and so on).
 * That keeps it to this chart, and the extra class also makes every rule more specific than the
 * one it overrides in `scitrader.css`, so it wins whichever stylesheet loads first.
 */
export interface ICssSkin {
    id: string;
    name: string;
    css: string;
}

export const CSS_SKINS: readonly ICssSkin[] = [
    {
        id: "default",
        name: "Default",
        css: `/* No overrides: the look from scitrader.css alone. */`,
    },
    {
        id: "rounded",
        name: "Rounded",
        css: `/* Round drawing tools, with the tool in use filled in */
.skin-rounded .st-drawing-toolbar__button {
    border-radius: 50%;
}
.skin-rounded .st-drawing-toolbar__button[aria-pressed="true"] {
    background: var(--st-ui-selection, #60A5FA);
    color: #ffffff;
}

/* Pill-shaped zoom / pan strip, pane control bar and quick-edit toolbar */
.skin-rounded .st-on-chart-buttons,
.skin-rounded .st-pane-control-bar,
.skin-rounded .st-inline-toolbar {
    border-radius: 999px;
    padding-left: 8px;
    padding-right: 8px;
}
.skin-rounded .st-pane-control-bar__button {
    border-radius: 50%;
}`,
    },
    {
        id: "flat",
        name: "Square & flat",
        css: `/* Square corners everywhere */
.skin-flat .st-drawing-toolbar__button,
.skin-flat .st-drawing-toolbar__flyout,
.skin-flat .st-drawing-toolbar__item,
.skin-flat .st-on-chart-buttons,
.skin-flat .st-on-chart-buttons__button,
.skin-flat .st-inline-toolbar,
.skin-flat .st-inline-toolbar__button,
.skin-flat .st-pane-control-bar,
.skin-flat .st-pane-control-bar__button,
.skin-flat .st-pane-restore-strip,
.skin-flat .st-pane-restore-strip__chip {
    border-radius: 0;
}

/* No borders on idle buttons, and no drop shadows */
.skin-flat .st-drawing-toolbar__button:not([aria-pressed="true"]),
.skin-flat .st-pane-control-bar__button:not([aria-pressed="true"]) {
    border-color: transparent;
}
.skin-flat .st-inline-toolbar,
.skin-flat .st-drawing-toolbar__flyout {
    box-shadow: none;
}`,
    },
    {
        id: "accent",
        name: "Accent colour",
        css: `/* One accent colour for every state: the tool in use, hover,
   pressed toggles, and a divider being dragged */
.skin-accent .st-drawing-toolbar__button[aria-pressed="true"],
.skin-accent .st-pane-control-bar__button[aria-pressed="true"] {
    border-color: #f59e0b;
    background: rgb(245 158 11 / 0.18);
    color: #f59e0b;
}
.skin-accent .st-drawing-toolbar__button:hover:not([aria-pressed="true"]),
.skin-accent .st-on-chart-buttons__button:hover,
.skin-accent .st-inline-toolbar__button:hover {
    color: #f59e0b;
}

/* Repeat the SDK rule's :not() so this one stays more specific */
.skin-accent .st-pane-divider:hover:not([data-dragging="true"]) {
    background: rgb(245 158 11 / 0.6);
}
.skin-accent .st-pane-divider[data-dragging="true"] {
    background: #f59e0b;
}`,
    },
    {
        id: "large",
        name: "Large (touch)",
        css: `/* Bigger targets for touch screens */
.skin-large .st-drawing-toolbar__button {
    width: 44px;
    height: 44px;
}
.skin-large .st-drawing-toolbar__item {
    padding: 12px 10px;
}
.skin-large .st-on-chart-buttons__button {
    width: 40px;
    height: 40px;
}
.skin-large .st-inline-toolbar__button {
    padding: 10px;
}
.skin-large .st-pane-control-bar__button {
    width: 28px;
    height: 28px;
    font-size: 14px;
}`,
    },
];
