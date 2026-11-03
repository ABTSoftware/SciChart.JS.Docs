---
sidebar_position: 7
sidebar_label: Icons
title: "SciTrader Icons: Toolbar and Navigation SVG Icons | SciTrader.js"
description: "The SciTrader.js app icons as SVG markup and React components: SCITRADER_ICONS, sciTraderIconSvg and SciTraderIcon."
keywords: ["SciTrader", "SciTrader.js", "SciTraderIcon", "sciTraderIconSvg", "trading app icons"]
---

# Icons

The SciTrader app's toolbar and navigation icons, as SVG markup: `pencil`, `drawingList`, `fx`, `settings`, `target`, `bookmark`, `marketDepth`, `more` and `palette`. They fill with `currentColor`, so they take the text colour of the button they sit in. `bookmark`, `fx`, `settings`, `marketDepth` and `more` also have a "selected" look, filled with the theme's brand gradient (`--st-ui-brand-gradient-start` / `-end`).

```ts
button.innerHTML = sciTraderIconSvg("bookmark", { selected: true });
```

```tsx
<IconButton aria-label="Watchlist">
    <SciTraderIcon name="bookmark" selected={tab === "watchlist"} />
</IconButton>
```

The icons are hidden from assistive technology, so label the button instead. `SCITRADER_ICONS` holds each icon's natural size, `viewBox` and markup, for drawing them your own way. The `palette` icon's path is from Font Awesome Free (CC BY 4.0).
