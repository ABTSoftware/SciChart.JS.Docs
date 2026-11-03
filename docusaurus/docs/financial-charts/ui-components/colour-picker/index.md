---
sidebar_position: 5
sidebar_label: Colour Picker
title: "ColorPicker: Colour Field with Opacity | SciTrader.js"
description: "The SciTrader.js ColorPicker: a colour swatch with a picker, opacity and hex entry, in plain DOM and React."
keywords: ["SciTrader", "SciTrader.js", "ColorPicker", "colour picker", "GradientRampEditor"]
---

# Colour Picker

`ColorPicker` is a labelled swatch that opens a picker: a saturation and brightness square, hue and opacity strips, a hex box, and R, G, B and A boxes. It works from the keyboard and closes on Escape or a click outside. Its value is any CSS colour; it reports six-digit hex when opaque and `#rrggbbaa` when not. A drag calls `onChange` continuously, so debounce anything expensive.

Study settings forms use it for their colour settings. On its own, it suits any colour setting of your app. Here it recolours the market-depth ladder's bid and ask prices:

```tsx
import { ColorPicker, MarketDepthView } from "scichart-scitrader-react";

// Saved settings are theme-neutral: a colour left at its default follows the theme. Show the
// colours as drawn under the current theme, and store an edit theme-neutral again.
const [depthSettings, setDepthSettings] = React.useState<TMarketDepthSettings>(DEFAULT_MARKET_DEPTH_SETTINGS);
const shown = themeMarketDepthSettings(depthSettings, theme);
const setColour = (key: "bid" | "ask", value: string) =>
    setDepthSettings(unthemeMarketDepthSettings({ ...shown, colours: { ...shown.colours, [key]: value } }, theme));

<ColorPicker label="Bid" value={shown.colours.bid} onChange={(v) => setColour("bid", v)} />
<ColorPicker label="Ask" value={shown.colours.ask} onChange={(v) => setColour("ask", v)} />
<MarketDepthView source={source} symbol={symbol} settings={depthSettings} />
```

`GradientRampEditor` edits a colour ramp, such as the order-book heatmap's, with a draggable handle for each stop. It is the gradient field of the settings form and has no React wrapper.

<CenteredImageWrapper src={require("../../_examples/dataSources_OrderBook/screenshot.png").default} title="Order Book (dummy data)" />

<CodeSnippetBlock labels={["TS", "React", "DummyDataExchange.ts"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_OrderBook/vanilla.ts
    ```
    ```tsx showLineNumbers file=../../_examples/dataSources_OrderBook/react.tsx
    ```
    ```ts showLineNumbers file=../../_examples/dataSources_OrderBook/DummyDataExchange.ts
    ```
</CodeSnippetBlock>
