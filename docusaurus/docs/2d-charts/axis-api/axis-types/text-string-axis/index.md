---
sidebar_position: 6
---

# ✅ Text / String Axis

There is no specific Text / String Axis in SciChart.js, however, with a combination of [the LabelProvider API](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) and the [NumericAxis](/docs/2d-charts/axis-api/axis-types/numeric-axis), it's possible to create one.

Use this technique if you want to use strings instead of numbers for the axis labels.

:::info
Learn more about the [commonalities between axis here](/docs/2d-charts/axis-api/axis-types/common-axis-base-type).
:::

Create and Configure a Text Axis
--------------------------------

To create a string axis in SciChart.js, we're going to use a [TextLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) on an ordinary [NumericAxis](/docs/2d-charts/axis-api/axis-types/numeric-axis). This allows you to transform numbers [0, 1, 2, 3, 4] into string labels.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./TextAxis/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./TextAxis/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./TextAxis/demo" />

Controlling the Order of Labels
-------------------------------

If you want to control the order of labels with data, pass the labels as an object, using numbers as fields:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./TextAxis-LabelOrder/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./TextAxis-LabelOrder/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

With the same data as before, the label order is reversed.

<LiveDocSnippet maxWidth={"100%"} name="./TextAxis-LabelOrder/demo" />

Multiline Text Labels
---------------------

[TextLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) has a [maxLength:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html#maxlength) option which if greater than 0 will do basic word-wrap to that number of characters. The text will only be split at spaces. Words will not be split.

You can ensure the lines appear exactly as you want by passing them as an array. Note that this can be used in conjunction with word wrap using maxLength. A label given as text will be split according to the maxLength, but one passed as an array will be displayed exactly as given, as shown in the following example:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./TextAxis-Multiline/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./TextAxis-Multiline/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./TextAxis-Multiline/demo" />

Note the difference between the way the first three labels are wrapped, compared to the second three.

:::note
You can provide an alternative wrapping function by overriding the [TextLabelProvider.wrapText:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html#wraptext) method which takes the label text and returns an array of lines.

When using multiline, the [TextLabelProvider.lineSpacing:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html#linespacing) option controls the line spacing. It is expressed as a fraction of the normal line height and defaults to 1.1, ie 10% spacing between lines.
:::

### Further notes on Label Culling & Spacing

:::note
The TextLabelProvider obeys other rules of axis tick spacing and label culling. Take a look at the section on [Gridline and Label Spacing (Interval)](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval) for some more information how this works.

Finally, the property [axis.axisRenderer.hideOverlappingLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisrenderer.html#hideoverlappinglabels) may be set to false if you wish to disable culling of labels which overlap. This property may also be set via the axis constructor option [hideOverlappingLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iaxisbase2doptions.html#hideoverlappinglabels).
:::
