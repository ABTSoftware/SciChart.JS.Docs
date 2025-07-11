---
sidebar_position: 5
---

# The Category Axis

The [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html) treats values a little differently. This is a special axis type which uses the X-Index not the X-Value to measure chart series.

:::info
Learn more about the [commonalities between axis here](/2d-charts/axis-api/axis-types/common-axis-base-type).
:::

Difference between CategoryAxis and NumericAxis
-----------------------------------------------

Imagine you want to plot the data:

| **Age (XAxis)** | **Cats** | **Dogs** | **Fish** |
|--|--|--|--|
| 1 | 7 | 7 | 8 | 
| 9 | 6 | 5 | 7 | 
| 10 | 5 | 4 | 3 | 
| 20 | 4 | 3 | 2 | 

A standard [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) (which is a value-axis) and the [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) would display the data differently.

<LiveDocSnippet maxWidth={"100%"} name="./CategoryAxisValueAxis/demo"  htmlPath="./CategoryAxisValueAxis/demo.html" cssPath="./CategoryAxisValueAxis/demo.css" />

Here's the code to setup the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./CategoryAxisValueAxis/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./CategoryAxisValueAxis/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

Why is this important? **In the case where you are plotting stock market data, you want to use a** [**CategoryAxis**:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html)**.**  
  
_This is because stock market data has gaps in it (consider the stock market has data on Monday, Tuesday, Wednesday, Thursday, Friday but not weekends). The_ [_CategoryAxis_:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html) _collapses the gaps and treats each datapoint as equidistant, ignoring the X-Value._

Using and Configuring a CategoryAxis
------------------------------------

The Category Axis won't draw without either:

1.  **At least one series with some data** on the chart,
2.  or, [CategoryAxis.defaultXStart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html#defaultxstart) and [defaultXStep:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html#defaultxstep) (allows a chart without any series)
3.  or [CategoryAxis.defaultXValues:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html#defaultxvalues) (allows a chart without any series)

Because the CategoryAxis measures xValues using index, you need to have data on the chart to calculate x-coordinate from data index. However, we can still create a chart by specifying some defaults with the properties above.

Creating a CategoryAxis (without Data) using Defaults
-----------------------------------------------------

The first example we're going to show uses the default properties on the CategoryAxis to display a chart without data.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./CategoryAxisWithDefaults/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./CategoryAxisWithDefaults/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet maxWidth={"100%"} name="./CategoryAxisWithDefaults/demo" />

In the above code sample we set the CategoryAxis.defaultXStart = unix timestamp for March 1st 2023, and defaultXStep = number of seconds in one day. This tells SciChart.js to default the index calculation to 1-datapoint = 1 day and to start the xAxis from 1st March.

Once you apply data to the CategoryAxis these properties will be ignored. They are only required to create and show a chart using CategoryAxis without data.

Creating a CategoryAxis with Financial Data
-------------------------------------------

Let's create a chart with CategoryAxis by supplying some data below:

<CodeSnippetBlock labels={["TS"]}>

    ```ts showLineNumbers file=./CategoryAxisFinancialData/demo.ts start=region_A_start end=region_A_end
 
    ```
 
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./CategoryAxisFinancialData/demo" />

:::note
The above example makes a web call to Binance to fetch Bitcoin/USD prices. If you see a blank chart, check the Js console as this web call may be blocked. You can always edit the Codepen to substitute your own data!
:::