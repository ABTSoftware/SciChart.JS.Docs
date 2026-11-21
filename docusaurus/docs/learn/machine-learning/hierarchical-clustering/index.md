---
sidebar_position: 50
sidebar_label: Hierarchical Clustering and Dendrograms
title: "Dendrogram and Hierarchical Clustering: How to Read a Dendrogram (With an Interactive Example)"
description: "What a dendrogram shows, how agglomerative hierarchical clustering builds one, how linkage methods change it, where to cut it, and how DBSCAN compares. With a live example."
keywords:
    [
        "dendrogram",
        "hierarchical clustering",
        "how to read a dendrogram",
        "what is a dendrogram",
        "dendrogram example",
        "agglomerative clustering",
        "agglomerative hierarchical clustering",
        "linkage methods",
        "single linkage vs complete linkage",
        "ward linkage",
        "clustered heatmap",
        "dbscan",
        "dbscan clustering",
        "hierarchical clustering vs k-means"
    ]
image: /img/learn/hierarchical-clustering-og.png
related: [k-means-clustering, dimensionality-reduction, heatmap, correlation-matrix]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a dendrogram used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A dendrogram shows the result of hierarchical clustering: which items were grouped together, in what order, and how far apart the groups were when they joined. It is used to choose a number of clusters by cutting the tree, to order the rows and columns of a heatmap so similar items sit together, and to show relationships such as gene expression patterns, document topics, customer segments or the evolutionary tree of species." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a dendrogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read a dendrogram from the bottom up. Each leaf is one item, and each join merges two clusters at a height equal to the distance between them under the chosen linkage. Two items are as similar as the height of the lowest join that connects them, not as close as their positions along the bottom. To get clusters, draw a horizontal line across the tree: every vertical branch it crosses is one cluster. Long vertical branches with no joins mean well separated clusters." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between hierarchical clustering and k-means?",
                    "acceptedAnswer": { "@type": "Answer", "text": "K-means needs the number of clusters in advance and finds that many groups by moving cluster centres, so it suits large datasets with round clusters of similar size. Hierarchical clustering builds a whole tree of nested clusters from a distance matrix, so you can choose the number of clusters afterwards by cutting the tree and can see how the clusters relate. It needs memory for every pair of points, which limits it to tens of thousands of items, and its merges can't be undone." }
                },
                {
                    "@type": "Question",
                    "name": "What is DBSCAN?",
                    "acceptedAnswer": { "@type": "Answer", "text": "DBSCAN (density-based spatial clustering of applications with noise) groups points that sit in dense regions. A point with at least minPts points within a radius eps is a core point; clusters grow outwards from core points, points within reach of a core point join as border points, and everything else is labelled noise. It finds clusters of any shape without being told how many there are, but one eps value has to suit every cluster's density." }
                },
                {
                    "@type": "Question",
                    "name": "Which linkage method should I use?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Ward's method is a good default for numeric features when you expect compact, roughly equal clusters: it merges the pair that least increases the within-cluster sum of squares. Average linkage is a safer choice with other distance measures, such as correlation. Complete linkage gives tight clusters of similar diameter. Single linkage follows long, thin or curved shapes but chains clusters together through noise points. Try more than one and compare the trees." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw a dendrogram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Run agglomerative clustering to get the list of merges, each with its two children and a height. Walk the tree from the top to give each leaf an x position, place each merge midway between its children, and draw every merge as three line segments: up from the left child, across at the merge height, and down to the right child. SciChart.js has no dendrogram series, so draw the segments with a FastLineSegmentRenderableSeries and an XyxyDataSeries, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Dendrogram and Hierarchical Clustering

## What is a dendrogram?

A **dendrogram** is a tree diagram that shows how hierarchical clustering grouped a set of items. Each item is a leaf along the bottom. Each join, drawn as an upside-down U, merges two groups, and its height is the distance between them. Cutting the tree with a horizontal line splits the items into clusters.

![Two charts in a dark navy theme: on the left, a scatter plot of 180 points in four groups, each coloured by its cluster; on the right, the dendrogram of the same points, with each cluster's branches in the matching colour, grey joins above them and a dashed horizontal cut line labelled 4 clusters](/img/learn/hierarchical-clustering-og.png)

*Four groups of points clustered with Ward's method, and the dendrogram cut into four clusters (sample data). [Try the interactive version](#how-to-make-a-dendrogram-in-javascript-react-or-angular).*

:::tip Key takeaways
- Hierarchical clustering builds a whole tree of nested clusters, so you choose the number of clusters afterwards by cutting the tree.
- The height of a join is the distance at which two clusters merged. Leaf order along the bottom says little about similarity.
- The linkage method decides what "distance between clusters" means, and it can change the result more than anything else.
- Scale the features first: clustering works on distances, and an unscaled feature with a large range takes over.
- DBSCAN groups points by density instead. It finds curved clusters, labels outliers as noise, and needs no cluster count.
:::

## What is hierarchical clustering?

**Hierarchical clustering** is a family of unsupervised learning methods that group items into a hierarchy of nested clusters. "Unsupervised" means there are no labels to learn from: the method only looks at how far apart the items are. The output is not one set of clusters but a tree containing every possible number of clusters, from one cluster holding everything down to one cluster per item.

There are two ways to build the tree:

- **Agglomerative** (bottom-up) clustering starts with each item as its own cluster and repeatedly merges the two closest clusters until one is left. It is by far the more common approach, and the one this page uses.
- **Divisive** (top-down) clustering starts with one cluster and repeatedly splits it. It needs a rule for the best split, which is expensive to search, so it is used less often.

Two choices define an agglomerative clustering: a distance measure between items (most often the Euclidean, straight-line distance, but correlation and others are common) and a **linkage method**, the rule for the distance between two clusters once they contain more than one item.

## How agglomerative clustering works: a worked example

Take five points on a plane: A (0, 0), B (0, 2), C (6, 0), D (6, 3) and E (10, 3). The first step is the distance matrix, the straight-line distance between every pair:

|  | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| A | 0 | 2.00 | 6.00 | 6.71 | 10.44 |
| B | 2.00 | 0 | 6.32 | 6.08 | 10.05 |
| C | 6.00 | 6.32 | 0 | 3.00 | 5.00 |
| D | 6.71 | 6.08 | 3.00 | 0 | 4.00 |
| E | 10.44 | 10.05 | 5.00 | 4.00 | 0 |

Then the algorithm repeats two steps until one cluster is left: merge the closest pair, and work out the distance from the new cluster to every other cluster. With complete linkage, where the distance between clusters is that of their farthest pair of points:

1. The smallest distance is A–B, 2.00. Merge them into AB at height 2. Its distance to C is the larger of A–C and B–C: 6.32.
2. The smallest is now C–D, 3.00. Merge them into CD at height 3.
3. The candidates are AB–CD (the farthest pair is A–D, 6.71), AB–E (A–E, 10.44) and CD–E (C–E, 5.00). Merge E into CDE at height 5.
4. Only AB and CDE are left. Their farthest pair is A–E, so the last merge is at 10.44.

![Left: the five points A to E on a grid, with A and B close together, C and D close together and E on its own to the right, each group circled. Right: their complete-linkage dendrogram, with A and B joining at height 2, C and D at 3, E joining them at 5 and the two groups joining at 10.44, and a dashed cut line at height 4 that crosses three branches, giving three clusters. Callout 1 marks the tallest join and callout 2 the leaves](./dendrogram-worked-example.svg)

Five points take four merges, and n items always take n − 1. The other linkage methods agree on the first two steps here but give different heights after that, and step 3 shows why. Single linkage, which uses the closest pair, measures CD–E as D–E = 4.00 rather than 5.00:

| Merge | Single | Complete | Average | Ward |
| --- | --- | --- | --- | --- |
| A + B | 2.00 | 2.00 | 2.00 | 2.00 |
| C + D | 3.00 | 3.00 | 3.00 | 3.00 |
| CD + E | 4.00 | 5.00 | 4.50 | 4.93 |
| AB + CDE | 6.00 | 10.44 | 7.60 | 11.47 |

A horizontal cut at height 4.5 gives three clusters (AB, CD and E) on the complete-linkage tree, but two (AB and CDE) on the single-linkage tree, so heights can only be compared within one linkage method.

## How to read a dendrogram

1. Leaves. Each leaf at the bottom (or the left, if the tree is drawn sideways) is one item: a data point, a gene, a document, a customer.
2. Joins. Each upside-down U merges two clusters. The two legs lead down to the clusters it merged, and the bar is drawn at the merge height.
3. Height. The vertical axis is the distance between the two clusters at the moment they merged, measured by the linkage method. A low join means similar items; a high join means the groups were far apart.
4. Similarity of two items. Follow both leaves up until their branches meet. The height of that join, called the **cophenetic distance**, is how far apart the tree says they are. In the worked example, B and D meet at 10.44 even though they are 6.08 apart.
5. Leaf order. Any join can be flipped left to right without changing the tree, so a tree with n leaves can be drawn in 2ⁿ⁻¹ orders. Two neighbouring leaves are not necessarily similar: the last leaf of one cluster sits next to the first leaf of another.
6. The cut. A horizontal line at any height splits the tree into clusters: every vertical branch it crosses is one cluster, holding all the leaves below it.
7. Long branches. A cluster whose vertical branch runs a long way up without any joins is well separated from the rest. A tree where all the joins sit at similar heights has no clear clusters.

### How to choose the number of clusters

- Cut in the biggest gap. Look for the longest stretch of height with no joins, and cut through its middle. In the worked example, the jump from 5 to 10.44 suggests two clusters.
- Use what you know. A biologist may want clusters at a set level of similarity, or a marketing team a fixed number of segments.
- Check with a score. Compute a measure such as the silhouette score for several cuts and compare. The [k-means clustering guide](/learn/machine-learning/k-means-clustering/) explains the silhouette score.
- Check the tree itself. The **cophenetic correlation**, the correlation between the original distances and the cophenetic distances (Sokal and Rohlf, 1962), shows how faithfully the tree represents the data. Values near 1 mean the tree distorts little.

## Linkage methods: single, complete, average and Ward

The linkage method is the rule for the distance between two clusters, A and B, with $n_A$ and $n_B$ points. It decides the shape of the clusters you get.

![Four panels of the same two clusters, three points on the left and four on the right. Single linkage joins the closest pair with one line, complete linkage the farthest pair, average linkage draws all twelve lines between the clusters, and Ward's method marks each cluster's centroid with a cross and joins the two with a dashed line](./linkage-methods.svg)

| Linkage | Distance between clusters A and B | Tends to give | Watch out for |
| --- | --- | --- | --- |
| Single (nearest neighbour) | The closest pair of points, one from each | Long, thin or curved clusters | Chaining: one stray point or a thin trail joins two clusters |
| Complete (farthest neighbour) | The farthest pair of points | Compact clusters of similar diameter | Splitting large clusters; sensitive to outliers |
| Average (UPGMA) | The mean of all $n_A \times n_B$ pair distances | A middle way between single and complete | Changes if the distances are transformed, for example squared; single and complete don't |
| Ward's method | The increase in the within-cluster sum of squares if A and B merge | Round clusters of similar size, like k-means | Assumes Euclidean distances; poor on curved shapes |

Ward's method (Ward, 1963) merges the pair of clusters whose merger adds least to the total squared distance of points from their cluster centroids. For two clusters with centroids $\bar{a}$ and $\bar{b}$, the merge height reported by most software is

$$
d(A, B) = \sqrt{\frac{2\, n_A n_B}{n_A + n_B}}\; \lVert \bar{a} - \bar{b} \rVert
$$

which equals the plain distance when both clusters are single points. All four methods can be computed with one update formula, published by Lance and Williams in 1967, so the algorithm stays the same and only the update changes.

Two other linkages, **centroid** and **median**, measure the distance between cluster centres. They can produce inversions, where a later merge sits lower than an earlier one, which makes the tree impossible to cut cleanly. Single, complete, average and Ward never do.

### What each linkage does to four datasets

The live demo on this page runs each linkage on four synthetic datasets and cuts the tree at the true number of groups. The adjusted Rand index (ARI) scores the result against the groups the points were drawn from: 1 is a perfect match and 0 is no better than chance.

| Dataset | Single | Complete | Average | Ward | DBSCAN (eps 0.35, minPts 5) |
| --- | --- | --- | --- | --- | --- |
| Four blobs | 1.00 | 1.00 | 1.00 | 1.00 | 0.98 |
| Blobs with a trail and outliers | 0.21 | 0.85 | 0.84 | 0.84 | 0.86 |
| Two moons | 1.00 | 0.31 | 0.29 | 0.14 | 1.00 |
| Two rings | 1.00 | 0.15 | −0.07 | −0.02 | 1.00 |

No method wins everywhere. Single linkage follows the moons and rings perfectly, but on the second dataset it chains three blobs into one cluster through the trail and the outliers, and spends two of its four clusters on stray points (cluster sizes 162, 35, 2 and 1). Ward's method finds the blobs but cuts the moons and rings straight across. The outliers count as their own group in the ARI, which is why no method reaches 1 on the second dataset.

## Dendrograms beside heatmaps: the clustered heatmap

A **clustered heatmap** shows a table of values as a grid of colours, with its rows and columns reordered by hierarchical clustering and a dendrogram drawn along one or both edges. Eisen and colleagues (1998) made it the standard way to show gene expression: each row is a gene, each column a sample, and genes that rise and fall together end up next to each other, forming visible blocks of colour.

The same reordering helps any matrix:

- In a [heatmap](/learn/chart-types/cartesian/heatmap/), sorting rows by a dendrogram turns a noisy grid into blocks you can read.
- In a [correlation matrix](/learn/chart-types/cartesian/correlation-matrix/), "reorder by similarity" usually means clustering the variables with 1 − correlation as the distance and average linkage, so strongly related variables sit together along the diagonal.

Because leaf order within a tree is not fixed, software usually picks the order that puts similar neighbours next to each other, for example with the optimal leaf ordering algorithm of Bar-Joseph and colleagues (2001). Reordering the leaves this way leaves every merge and height unchanged.

## DBSCAN: density-based clustering

**DBSCAN** (density-based spatial clustering of applications with noise), published by Ester, Kriegel, Sander and Xu in 1996, treats a cluster as a region where points are packed densely, separated from other clusters by sparse space. It takes two settings:

- **eps**: the radius of the neighbourhood around each point;
- **minPts**: how many points, the point itself included, that neighbourhood must hold.

Every point then gets one of three roles:

![A dense group of eight filled points, each with at least four points within radius eps, marked as core points. A circle of radius eps around one of them reaches a ring-shaped point to its right, marked as a border point because its own circle holds only two points. A cross far away is marked as noise](./dbscan-core-border-noise.svg)

- A core point has at least minPts points within eps.
- A border point is within eps of a core point but has too few neighbours to be core itself.
- A noise point is neither. DBSCAN leaves it out of every cluster.

The algorithm picks an unvisited core point, starts a cluster, and adds every point within eps of it. Each new core point adds its own neighbours in turn, until the cluster stops growing; then it moves on to the next unvisited core point. Border points join a cluster but don't extend it. A border point within reach of two clusters joins whichever reaches it first.

To choose eps, Ester and colleagues suggest sorting every point's distance to its k-th nearest neighbour and plotting the result: the curve is flat through the dense regions and rises steeply for the sparse points, and the bend is a good eps. They used minPts = 4 for two-dimensional data; Schubert and colleagues (2017) suggest twice the number of dimensions as a starting point. The live demo shows this k-distance plot in DBSCAN mode, with eps as a line you can drag.

DBSCAN and hierarchical clustering are related. DBSCAN with minPts = 2 gives the same clusters as single linkage cut at height eps, except that the single-linkage tree keeps each isolated point as a one-point cluster where DBSCAN calls it noise. HDBSCAN (Campello, Moulavi and Sander, 2013) builds a hierarchy over every eps and keeps the most stable clusters, so it needs no eps at all.

## Hierarchical clustering vs k-means vs DBSCAN

| | Hierarchical (agglomerative) | K-means | DBSCAN |
| --- | --- | --- | --- |
| Number of clusters | Chosen afterwards, by cutting the tree | Set in advance (k) | Follows from eps and minPts |
| Cluster shapes | Depends on linkage: single follows any shape, Ward prefers round | Round, similar size | Any shape, as long as density is similar |
| Outliers | Kept in a cluster (or as tiny clusters) | Pull centres towards them | Labelled as noise |
| Output | A full tree of nested clusters | One flat partition and the centres | One flat partition plus noise |
| Scales to | Tens of thousands of points (memory for every pair) | Millions | Hundreds of thousands to millions, with a spatial index |
| Deterministic | Yes | No: depends on the starting centres | Yes, apart from border points between clusters |
| Best for | Small to medium data where the structure between clusters matters, ordering heatmaps | Large data, compact clusters, a known k | Spatial or sensor data with noise and odd shapes |

The [k-means clustering guide](/learn/machine-learning/k-means-clustering/) covers the k-means algorithm, the elbow method and the silhouette score.

## Where hierarchical clustering is used

- Biology. Phylogenetic trees of species and genes are dendrograms, and clustered heatmaps of gene expression are standard in genomics. See how SciChart is used for [diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/) software.
- Document and text clustering. Grouping articles, support tickets or search results into topics and subtopics, where the hierarchy itself is useful.
- Customer segmentation. Grouping customers by behaviour, then cutting the tree at the level of detail a team can act on.
- Sensor and instrument data. Grouping similar machines, wafers or test runs, and spotting the odd one out on a tall branch of its own.
- Ecology and archaeology. Grouping sites by the species or artefacts found there, with distance measures made for presence and absence data.

## Common hierarchical clustering mistakes

- **Reading leaf order as similarity.** Neighbouring leaves can be far apart. Judge two items by the height where their branches meet.
- **Clustering unscaled features.** With income in pounds and age in years, income decides every distance. Standardise each feature (subtract the mean, divide by the standard deviation) unless the units are already comparable.
- **Using one linkage without checking.** As the four-dataset table shows, linkage can turn a perfect result into a useless one. Try two or three and compare the trees.
- **Comparing heights across linkages or datasets.** A cut at height 4.5 means different things for single and Ward linkage.
- **Pairing Ward's method with a non-Euclidean distance.** Ward's method is defined for squared Euclidean distances. With correlation or Manhattan distances, use average or complete linkage.
- **Ignoring the size limit.** The distance matrix for n items holds n(n − 1)/2 values: about 40 GB for 100,000 points at 8 bytes each. Sample, cluster in two stages, or use k-means or DBSCAN.
- **Trusting a cut with no gap.** If the joins near the cut sit at similar heights, a slightly different cut gives different clusters. Check whether nearby cuts give the same clusters before reporting them.
- **Setting DBSCAN's eps by guesswork.** Use the k-distance plot, and remember eps is in the units of the scaled data.

## How to make a dendrogram in JavaScript, React or Angular

A dendrogram and its scatter plot need to redraw together every time the cut, the linkage or the data changes. SciChart.js draws with WebGL, so both charts recolour instantly as you drag the cut line, and the same approach stays smooth with thousands of points. The demo clusters 180 to 250 points in the browser, with no machine learning library.

Drag the dashed cut line on the dendrogram, or move the **Clusters** slider, to cut the tree and recolour the points. **Linkage** switches between single, complete, average and Ward, and **Dataset** between four blobs, blobs with a trail and outliers, two moons and two rings; the readout shows the cluster sizes and the adjusted Rand index. Set **Method** to DBSCAN to replace the dendrogram with the k-distance plot: drag the line, or move the **eps** and **minPts** sliders, to see core points (filled), border points (rings) and noise (crosses). Scroll to zoom, drag the scatter plot to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="dendrogram" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/fast-line-segment-renderable-series/" docsLabel="SciChart.js line segment series documentation" />

Here is the code for this chart. The clustering, the tree layout and DBSCAN are plain JavaScript; SciChart.js draws the dendrogram as line segments, the points as a scatter series with a palette provider, and the cut line as a draggable annotation.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineSegmentRenderableSeries,
        XyxyDataSeries,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Agglomerative clustering with average linkage: merge the closest pair of clusters n - 1 times
    const agglomerate = (x: number[], y: number[]) => {
        const n = x.length;
        const d = x.map((_, i) => x.map((_, j) => Math.hypot(x[i] - x[j], y[i] - y[j])));
        const size = new Array(n).fill(1), id = x.map((_, i) => i), active = new Array(n).fill(true);
        const merges: { a: number; b: number; height: number }[] = [];
        for (let step = 0; step < n - 1; step++) {
            let best = Infinity, a = -1, b = -1;
            for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
                if (active[i] && active[j] && d[i][j] < best) [best, a, b] = [d[i][j], i, j];
            for (let k = 0; k < n; k++) if (active[k] && k !== a && k !== b)
                d[k][a] = d[a][k] = (size[a] * d[k][a] + size[b] * d[k][b]) / (size[a] + size[b]);
            merges.push({ a: id[a], b: id[b], height: best });
            active[b] = false; size[a] += size[b]; id[a] = n + step;
        }
        return merges;
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { drawLabels: false }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Merge height" }));

        const { x, y } = getYourPoints(); // one x and one y value per item (scale the features first)
        const n = x.length;
        const merges = agglomerate(x, y);
        // Leaf x positions from a walk down the tree; each merge sits midway between its children
        const xPos: number[] = [], height: number[] = new Array(2 * n - 1).fill(0);
        let next = 0;
        const visit = (node: number) => {
            if (node < n) { xPos[node] = next++; return; }
            const { a, b, height: h } = merges[node - n];
            visit(a); visit(b);
            xPos[node] = (xPos[a] + xPos[b]) / 2; height[node] = h;
        };
        visit(2 * n - 2);
        // Each merge is three segments: up from child a, across at the merge height, down to child b
        const segments = new XyxyDataSeries(wasmContext);
        merges.forEach(({ a, b, height: h }) => {
            segments.appendRange(
                [xPos[a], xPos[a], xPos[b]], [height[a], h, h],
                [xPos[a], xPos[b], xPos[b]], [h, h, height[b]]
            );
        });
        sciChartSurface.renderableSeries.add(
            new FastLineSegmentRenderableSeries(wasmContext, { dataSeries: segments, stroke: "#50C7E0", strokeThickness: 1.5 })
        );
        // A draggable line to cut the tree: every branch it crosses is one cluster
        sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({ y1: merges[n - 2].height * 0.6, stroke: "#FFFFFF", strokeDashArray: [6, 4], isEditable: true })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const DendrogramChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineSegmentRenderableSeries,
        XyxyDataSeries,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Agglomerative clustering with average linkage: merge the closest pair of clusters n - 1 times
    const agglomerate = (x: number[], y: number[]) => {
        const n = x.length;
        const d = x.map((_, i) => x.map((_, j) => Math.hypot(x[i] - x[j], y[i] - y[j])));
        const size = new Array(n).fill(1), id = x.map((_, i) => i), active = new Array(n).fill(true);
        const merges: { a: number; b: number; height: number }[] = [];
        for (let step = 0; step < n - 1; step++) {
            let best = Infinity, a = -1, b = -1;
            for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
                if (active[i] && active[j] && d[i][j] < best) [best, a, b] = [d[i][j], i, j];
            for (let k = 0; k < n; k++) if (active[k] && k !== a && k !== b)
                d[k][a] = d[a][k] = (size[a] * d[k][a] + size[b] * d[k][b]) / (size[a] + size[b]);
            merges.push({ a: id[a], b: id[b], height: best });
            active[b] = false; size[a] += size[b]; id[a] = n + step;
        }
        return merges;
    };

    @Component({
        selector: "app-dendrogram-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class DendrogramChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { drawLabels: false }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Merge height" }));

            const { x, y } = getYourPoints(); // one x and one y value per item (scale the features first)
            const n = x.length;
            const merges = agglomerate(x, y);
            // Leaf x positions from a walk down the tree; each merge sits midway between its children
            const xPos: number[] = [], height: number[] = new Array(2 * n - 1).fill(0);
            let next = 0;
            const visit = (node: number) => {
                if (node < n) { xPos[node] = next++; return; }
                const { a, b, height: h } = merges[node - n];
                visit(a); visit(b);
                xPos[node] = (xPos[a] + xPos[b]) / 2; height[node] = h;
            };
            visit(2 * n - 2);
            // Each merge is three segments: up from child a, across at the merge height, down to child b
            const segments = new XyxyDataSeries(wasmContext);
            merges.forEach(({ a, b, height: h }) => {
                segments.appendRange(
                    [xPos[a], xPos[a], xPos[b]], [height[a], h, h],
                    [xPos[a], xPos[b], xPos[b]], [h, h, height[b]]
                );
            });
            sciChartSurface.renderableSeries.add(
                new FastLineSegmentRenderableSeries(wasmContext, { dataSeries: segments, stroke: "#50C7E0", strokeThickness: 1.5 })
            );
            // A draggable line to cut the tree: every branch it crosses is one cluster
            sciChartSurface.annotations.add(
                new HorizontalLineAnnotation({ y1: merges[n - 2].height * 0.6, stroke: "#FFFFFF", strokeDashArray: [6, 4], isEditable: true })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- SciChart.js has no dendrogram series. Each merge is three segments in a `FastLineSegmentRenderableSeries` over an `XyxyDataSeries`, which holds a start and an end point per segment. The demo uses one series per cluster colour, plus a grey one for the joins above the cut.
- The cut line is a `HorizontalLineAnnotation` with `isEditable: true`. Its `dragDelta` event recounts the clusters as you drag, and `dragEnded` snaps it to the middle of the gap.
- The points are one `XyScatterRenderableSeries` with a palette provider: `overridePointMarkerArgb` returns each point's cluster colour, so one series draws every cluster.
- In DBSCAN mode, the k-distance curve is a `FastLineRenderableSeries` on the same chart, and the same annotation sets eps.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart), and for a clustered grid of values, [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js line segment series documentation](/2d-charts/chart-types/fast-line-segment-renderable-series/), the [scatter series documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), and the [scatter plot guide](/learn/chart-types/cartesian/scatter-plot/). For how laboratory and genomics software uses SciChart, see [SciChart for diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

## Frequently asked questions

### What is a dendrogram used for?

A dendrogram shows the result of hierarchical clustering: which items were grouped together, in what order, and how far apart the groups were when they joined. It is used to choose a number of clusters by cutting the tree, to order the rows and columns of a heatmap so similar items sit together, and to show relationships such as gene expression patterns, document topics, customer segments or the evolutionary tree of species.

### How do you read a dendrogram?

Read a dendrogram from the bottom up. Each leaf is one item, and each join merges two clusters at a height equal to the distance between them under the chosen linkage. Two items are as similar as the height of the lowest join that connects them, not as close as their positions along the bottom. To get clusters, draw a horizontal line across the tree: every vertical branch it crosses is one cluster. Long vertical branches with no joins mean well separated clusters.

### What is the difference between hierarchical clustering and k-means?

K-means needs the number of clusters in advance and finds that many groups by moving cluster centres, so it suits large datasets with round clusters of similar size. Hierarchical clustering builds a whole tree of nested clusters from a distance matrix, so you can choose the number of clusters afterwards by cutting the tree and can see how the clusters relate. It needs memory for every pair of points, which limits it to tens of thousands of items, and its merges can't be undone.

### What is DBSCAN?

DBSCAN (density-based spatial clustering of applications with noise) groups points that sit in dense regions. A point with at least minPts points within a radius eps is a core point; clusters grow outwards from core points, points within reach of a core point join as border points, and everything else is labelled noise. It finds clusters of any shape without being told how many there are, but one eps value has to suit every cluster's density.

### Which linkage method should I use?

Ward's method is a good default for numeric features when you expect compact, roughly equal clusters: it merges the pair that least increases the within-cluster sum of squares. Average linkage is a safer choice with other distance measures, such as correlation. Complete linkage gives tight clusters of similar diameter. Single linkage follows long, thin or curved shapes but chains clusters together through noise points. Try more than one and compare the trees.

### How do I draw a dendrogram in JavaScript?

Run agglomerative clustering to get the list of merges, each with its two children and a height. Walk the tree from the top to give each leaf an x position, place each merge midway between its children, and draw every merge as three line segments: up from the left child, across at the merge height, and down to the right child. SciChart.js has no dendrogram series, so draw the segments with a FastLineSegmentRenderableSeries and an XyxyDataSeries, in plain JavaScript, React or Angular.

## Sources

- Ester, M., Kriegel, H.-P., Sander, J. and Xu, X. (1996), [A density-based algorithm for discovering clusters in large spatial databases with noise](https://cdn.aaai.org/KDD/1996/KDD96-037.pdf). *Proceedings of the Second International Conference on Knowledge Discovery and Data Mining (KDD-96)*, 226–231. DBSCAN, core and border points, and the sorted k-distance plot.
- Schubert, E., Sander, J., Ester, M., Kriegel, H.-P. and Xu, X. (2017), [DBSCAN revisited, revisited: why and how you should (still) use DBSCAN](https://doi.org/10.1145/3068335). *ACM Transactions on Database Systems*, 42(3), 19.
- Ward, J. H. (1963), [Hierarchical grouping to optimize an objective function](https://doi.org/10.1080/01621459.1963.10500845). *Journal of the American Statistical Association*, 58(301), 236–244.
- Lance, G. N. and Williams, W. T. (1967), [A general theory of classificatory sorting strategies: 1. Hierarchical systems](https://doi.org/10.1093/comjnl/9.4.373). *The Computer Journal*, 9(4), 373–380.
- Eisen, M. B., Spellman, P. T., Brown, P. O. and Botstein, D. (1998), [Cluster analysis and display of genome-wide expression patterns](https://doi.org/10.1073/pnas.95.25.14863). *Proceedings of the National Academy of Sciences*, 95(25), 14863–14868.
- Sokal, R. R. and Rohlf, F. J. (1962), [The comparison of dendrograms by objective methods](https://doi.org/10.2307/1217208). *Taxon*, 11(2), 33–40. The cophenetic correlation.
- Hubert, L. and Arabie, P. (1985), [Comparing partitions](https://doi.org/10.1007/BF01908075). *Journal of Classification*, 2, 193–218. The adjusted Rand index.
- Hastie, T., Tibshirani, R. and Friedman, J. (2009), [*The Elements of Statistical Learning*](https://hastie.su.domains/ElemStatLearn/), 2nd edition, Springer, section 14.3.12 (hierarchical clustering).

<LearnCta position="bottom" chart="dendrogram" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/fast-line-segment-renderable-series/" docsLabel="SciChart.js line segment series documentation" />
