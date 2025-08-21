---
sidebar_position: 2
---

# Custom Side-By-Side Series

While SciChart.js provides the built-in [StackedColumnCollection](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedcolumncollection.html) for stacking Column Series side-by-side or top-to-bottom, many developers need more flexibility to position different types of series alongside each other.

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/stacked-grouped-column-chart-side-by-side"
    title="Built-in Stacked Column Chart Side-by-Side"
/>

## The Challenge

What if you want to display different series types - candlesticks, impulse series, error bars, or any combination - positioned side-by-side at the same X coordinates? The built-in stacking only works for column series of the same type.

## The Solution: Custom Positioning

Here's the result - three different series types (Candlestick, Impulse, and Error Bars) positioned side-by-side:

<LiveDocSnippet name="./demo" />

## Key Implementation Points

1. **Calculate X-offsets**: Use the `calculateShift` function to position each series with new x-values
2. **Consistent spacing**: Maintain uniform gaps between series for visual clarity  
3. **Flexible series count**: The algorithm adapts to any number of side-by-side series
4. **Series type independence**: Works with any combination of renderable series types

## How It Works

The `calculateShift` function takes your original X-value and calculates an offset based on:
- **Series index**: Which position in the group (0, 1, 2, etc.)
- **Total count**: How many series you're positioning side-by-side
- **Spacing**: Optional gap between series (defaults to 2% of a unit)

<CodeSnippetBlock labels={["ts"]}>
    ```ts {14-17,40,57,66} showLineNumbers file=./demo.ts  start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

## Usage Tips

- **Start with index 0**: Always begin your series indexing from 0 for proper centering
- **Adjust dataPointWidth**: For series with width properties (like candlesticks), set `dataPointWidth` to prevent overlap
- **Consistent spacing**: Use the same spacing value across all series for uniform appearance
- **Scale with data**: The algorithm automatically scales positioning based on your total series count
- **Related demos**: Check out other related CodePens, like: 
  - [Different Y-Axis Side-by-Side Columns](https://codepen.io/vasculandrei/pen/zYVLLEe?editors=0010), 
  - [Column/ErrorBar overlay collection](http://codepen.io/vasculandrei/pen/VYwKpeZ)