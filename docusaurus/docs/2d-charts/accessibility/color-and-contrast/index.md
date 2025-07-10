---
sidebar_position: 3
---

# Color and Contrast

Since colors and theming are most likely to be custom for each customer, we don't provide out of the box light and dark theme handling (nor special theme for High Contrast).

But that's easily achievable by using one of the provided themes, or creating a custom one.

Default Themes
--------------

By default SciChart uses **SciChartJSDarkv2Theme**. Also SciChart exposes **SciChartJSDarkTheme** and **SciChartJSLightTheme**.

In this example we will show how to set a desired theme depending on user theme settings.

```ts
// Setting a Theme

import { SciChartJSDarkTheme, SciChartJSLightTheme } from "scichart";
// ...
const isDarkThemeSelected = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const newColorScheme = isDarkThemeSelected
    ? new SciChartJSDarkTheme() 
    : new SciChartJSLightTheme();
sciChartSurface.applyTheme(newColorScheme);
```

The snippet above should set the light or dark theme depending on user preferences.

It's easy to handle the theme change:

<CodeSnippetBlock labels={["JS","TS"]}>
```ts 
const handleSystemThemeChange = (event) => {
    const newColorScheme = event.matches 
        ? new SciChartJSDarkTheme() 
        : new SciChartJSLightTheme();
    sciChartSurface.applyTheme(newColorScheme)
};
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);
```
```ts
const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    const newColorScheme = event.matches
        ? new SciChartJSDarkTheme()
        : new SciChartJSLightTheme();
    sciChartSurface.applyTheme(newColorScheme);
};
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);
```
</CodeSnippetBlock>

 Now the chart will detect user dark/light theme preference updates and will use an appropriate theme.

Custom Themes
-------------

Refer to [Chart Styling - Creating a Custom Theme](/docs/2d-charts/styling-and-theming/creating-custom-theme/index.md).

#### See Also

- [Voice Over](/docs/2d-charts/accessibility/voice-over/index.md)
- [Keyboard Accessibility](/docs/2d-charts/accessibility/keyboard-accessibility/index.md)