---
sidebar_position: 4
---

# Metadata and HitTest

The Hi-Test API is a low level API used to extract information about chart series under the mouse. Our own in-house RolloverModifier and CursorModifier are based on this API. You can use it too to create Drill-downs and custom data-inspections.

This article purpose is to keep it brief and show you how to store and retrieve Metadata from datapoints during a Hit-Test operation. Further reading about these APIs can be found below.

Background reading: 

*   If you haven't already, read the article [DataSeries PointMetadata API](/docs/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview) which will show you how to setup a DataSeries with point metadata (javascript objects).
*   Also take a look at the [Hit-Test API](/docs/2d-charts/chart-types/hit-test-api/hit-test-api-overview) docs to describe how to perform chart hit-testing (inspection on click, hover)

Example: Metadata + HitTest
---------------------------

Here's a code sample showing how to extract metadata from a HitTest result. This is as simple as getting HitTestInfo.metadata

<CodeSnippetBlock labels={["JS"]}>
    ```ts showLineNumbers file=./demo.js start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

Click on the data-points in the example below to see the Hit-Test result.

<LiveDocSnippet maxWidth={"100%"} name="./demo" htmlPath="demo.html" cssPath="demo.css" />

