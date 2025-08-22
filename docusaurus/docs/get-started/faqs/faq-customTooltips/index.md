---
sidebar_position: 2
---

# Custom Rollover SVG Tooltips

While SciChart.js provides built-in tooltip functionality through the [RolloverModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html), developers often need complete control over tooltip appearance, styling, and content for a more polished user experience.

## The Challenge

The default tooltips work well for basic scenarios, but what if you need:
- Custom styling with shadows, borders, or brand colors
- Precise size calculations for dynamic content
- Visual markers or indicators within tooltips

## The Solution: Custom SVG Templates

Here's the result - fully customized tooltips with custom styling, and precise sizing:

<LiveDocSnippet name="./demo" />

## Key Implementation Points

1. **Custom template function**: Create a `TRolloverTooltipSvgTemplate` that returns SVG markup
2. **Dynamic sizing**: Calculate tooltip dimensions based on content length and line count
3. **Visual enhancements**: Add shadows, borders, and color markers for professional appearance
4. **Flexible content**: Support multi-line tooltips with formatted text

<CodeSnippetBlock labels={["ts"]}>
    ```ts {5-9,28,41,49-51,86-92,105-111,119} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

## How It Works

The custom tooltip system involves three main components:

### 1. Size Calculations
- Calculate precise tooltip dimensions based on your content:

### 2. SVG Template Function
- Create custom SVG markup with your desired styling:

### 3. Series Integration
- Apply the template to individual series for complete control:
