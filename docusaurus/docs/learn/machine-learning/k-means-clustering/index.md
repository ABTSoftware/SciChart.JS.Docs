---
sidebar_position: 60
sidebar_label: K-Means Clustering
title: "K-Means Clustering: How It Works, the Elbow Method and Silhouette Score (With an Interactive Example)"
description: "What k-means clustering is, how the algorithm assigns points and moves centroids, how to choose k with the elbow method and silhouette score, where it fails, and how it differs from k-NN. With a live example."
keywords:
    [
        "k means clustering",
        "k-means clustering",
        "what is k means clustering",
        "k means algorithm",
        "how does k means clustering work",
        "k-means clustering algorithm steps",
        "elbow method",
        "elbow method k means",
        "silhouette score",
        "knn vs k means",
        "k means vs knn",
        "k-means++",
        "clustering",
        "clustering visualization",
        "k-means clustering diagram"
    ]
image: /img/learn/k-means-clustering-og.png
related: [hierarchical-clustering, voronoi-diagram, decision-boundary, dimensionality-reduction]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is k-means clustering used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "K-means is used to split unlabelled data into a chosen number of groups of similar items. Common uses are customer segmentation, reducing the colours in an image (colour quantisation), grouping documents or sensor readings, building codebooks for compression, and as a quick first look at the structure of a dataset before a more careful analysis." }
                },
                {
                    "@type": "Question",
                    "name": "How do you choose the number of clusters k?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Run k-means for a range of k and compare. The elbow method plots the inertia (within-cluster sum of squares) against k and looks for the bend after which adding clusters helps little. The silhouette method picks the k with the highest mean silhouette score. Use both, and check that the clusters at the chosen k make sense for the problem; a domain reason, such as the number of product lines, often decides." }
                },
                {
                    "@type": "Question",
                    "name": "What is a good silhouette score?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The silhouette score runs from -1 to 1. Kaufman and Rousseeuw's rule of thumb reads a mean above 0.70 as strong structure, 0.51 to 0.70 as reasonable, 0.26 to 0.50 as weak and possibly artificial, and 0.25 or less as no real structure. A high score only means the clusters are compact and well separated in the distance k-means uses; it says nothing about whether they are useful." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between k-means and k-NN?",
                    "acceptedAnswer": { "@type": "Answer", "text": "K-means is unsupervised clustering: it takes unlabelled data and splits it into k groups, where k is the number of clusters. K-nearest neighbours (k-NN) is supervised: it predicts the label of a new point from the labels of its k closest training points, where k is the number of neighbours. They share the letter k and a distance measure, but solve different problems." }
                },
                {
                    "@type": "Question",
                    "name": "Does k-means always find the best clusters?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. Each run of k-means always converges, because neither step can increase the within-cluster sum of squares, but it converges to a local minimum that depends on the starting centroids. Finding the true minimum is NP-hard even for points in a plane. In practice you run it several times from different starts, ideally with k-means++ seeding, and keep the run with the lowest inertia." }
                },
                {
                    "@type": "Question",
                    "name": "How do I visualise k-means clustering in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Run k-means in plain JavaScript (assign each point to its nearest centroid, move each centroid to the mean of its points, repeat until nothing changes), then draw the points as a scatter series coloured by cluster label and the centroids as larger markers. Shading each centroid's region with a heatmap shows the decision boundaries. SciChart.js does this with XyScatterRenderableSeries, MetadataPaletteProvider and UniformHeatmapRenderableSeries in JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# K-Means Clustering

## What is k-means clustering?

**K-means clustering** is an unsupervised machine learning method that splits a set of unlabelled points into k groups, where you choose k. Each group is represented by its centre, or **centroid**, and every point belongs to the group whose centroid is nearest. The algorithm moves the centroids until the groups are as compact as it can make them.

![A k-means clustering chart in a dark navy theme: about 300 points in four groups, each coloured by its cluster, with a large marker at each centroid and dashed lines tracing how the centroids moved, over shaded regions showing which centroid is nearest. Beside it, an elbow plot of inertia against the number of clusters, bending sharply at k = 4, and a silhouette plot peaking at k = 4](/img/learn/k-means-clustering-og.png)

*K-means on four simulated groups of points, with the elbow and silhouette plots used to choose k (sample data). [Try the interactive version](#how-to-make-a-k-means-clustering-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- K-means repeats two steps: assign each point to its nearest centroid, then move each centroid to the mean of its points.
- It minimises inertia, the sum of squared distances from points to their centroids, and stops at a local minimum that depends on the start.
- Choose k with the elbow plot and the silhouette score together, and with what the groups mean for your problem.
- It assumes round clusters of similar size on comparable scales. Moons, rings and unscaled features break it.
- K-means clusters unlabelled data. K-nearest neighbours (k-NN) classifies new points from labelled data.
:::

## What is clustering?

**Clustering** is grouping items so that items in the same group are more alike than items in different groups, without being told what the groups are. It is the main kind of **unsupervised learning**: there are no labels to learn from, only the data.

Methods differ in what they mean by a group:

- Centroid-based methods, such as k-means, describe each group by a centre and assign points to the nearest one.
- Hierarchical methods build a tree of merges or splits, drawn as a dendrogram (see [hierarchical clustering](/learn/machine-learning/hierarchical-clustering/)).
- Density-based methods, such as DBSCAN, call a group any dense region separated by sparse space, and leave isolated points unassigned as noise.
- Model-based methods, such as Gaussian mixture models, assume each group is drawn from a probability distribution and give each point a probability of belonging to each group.

K-means is the simplest of these to write, quick to run and easy to picture. Hugo Steinhaus described the idea in 1956. Stuart Lloyd wrote the standard algorithm at Bell Labs in 1957, though it was not published until 1982, and James MacQueen gave it the name "k-means" in 1967.

## How the k-means algorithm works

The standard version is **Lloyd's algorithm**. With the data and a chosen k:

1. Start: place k centroids, for example on k data points picked at random.
2. Assign: give each point to its nearest centroid, by straight-line (Euclidean) distance.
3. Update: move each centroid to the mean of the points assigned to it.
4. Repeat steps 2 and 3 until no point changes cluster.

Step 2 draws the boundaries and step 3 moves the centres they are drawn around. The two steps take turns until the centroids stop moving, usually after a handful of iterations on well-separated data. Each iteration costs about n × k × d distance calculations for n points with d features, which is why k-means scales to millions of points.

### The objective: inertia

K-means minimises the **inertia**, also called the within-cluster sum of squares (WCSS): the sum, over every point, of the squared distance to its cluster's centroid.

$$
\text{inertia} = \sum_{j=1}^{k} \sum_{x_i \in C_j} \lVert x_i - \mu_j \rVert^2
$$

Here $C_j$ is cluster j and $\mu_j$ is its centroid. Neither step can raise this number. Assigning a point to a nearer centroid can only shorten its distance, and the mean is the position that minimises the sum of squared distances to a set of points. Since there are only finitely many ways to split n points into k groups, the algorithm must stop.

### A worked example

Take six points and k = 2: P1 (1, 2), P2 (2, 1), P3 (2, 3), P4 (5, 4), P5 (6, 6) and P6 (7, 5). Start with the centroids on P1 and P3, a deliberately poor start since both sit in the same group.

![Three panels showing k-means on six points. In panel 1, the six points are grey and the two starting centroids sit on P1 and P3. In panel 2, P1 and P2 are coloured blue and P3 to P6 orange, split by a dashed boundary halfway between the centroids, and arrows move the centroids to (1.5, 1.5) and (5, 4.5); the inertia falls from 66 to 20. In panel 3, P3 has switched to blue, and the centroids move to (1.67, 2) and (6, 5), where the inertia is 6.67](./k-means-iterations.svg)

| Step | Centroid A | Centroid B | Cluster A | Cluster B | Inertia |
| --- | --- | --- | --- | --- | --- |
| Start, then assign | (1, 2) | (2, 3) | P1, P2 | P3, P4, P5, P6 | 66.00 |
| Update | (1.5, 1.5) | (5, 4.5) | P1, P2 | P3, P4, P5, P6 | 20.00 |
| Assign: P3 switches | (1.5, 1.5) | (5, 4.5) | P1, P2, P3 | P4, P5, P6 | 11.25 |
| Update | (1.67, 2) | (6, 5) | P1, P2, P3 | P4, P5, P6 | 6.67 |
| Assign: nothing changes | (1.67, 2) | (6, 5) | P1, P2, P3 | P4, P5, P6 | 6.67, converged |

P3 at (2, 3) moves because, after the first update, it is 1.58 from centroid A at (1.5, 1.5) and 3.35 from centroid B at (5, 4.5). The final inertia, 6.67, is the lowest possible for these six points: checking all 31 ways of splitting them into two non-empty groups gives the same answer.

## Initialisation: random starts, k-means++ and local minima

K-means always converges, but not always to the best answer. Where it ends depends on where the centroids start. Two centroids that start in the same natural group can leave another group with none, and the algorithm cannot climb out of that, because every single step makes the inertia smaller or leaves it the same. Finding the best possible clustering is NP-hard even for points in a plane, so every practical method settles for a good local minimum.

Two ways to start:

- Random points (Forgy's method): pick k data points at random as the centroids.
- **K-means++** (Arthur and Vassilvitskii, 2007): pick the first centroid at random, then pick each next one from the data with probability proportional to its squared distance from the nearest centroid already chosen. This spreads the starts out. The authors proved the expected inertia right after seeding is within a factor of O(log k) of the optimum.

On the four-group dataset in the demo, with k = 4, 27 of 200 random-point starts ended more than 1% above the best inertia (the worst at 2,663 against the best 714), against 10 of 200 for k-means++. The standard fix is to run k-means several times from different starts and keep the lowest inertia. Libraries do this by default; the demo's side charts use the best of 10 k-means++ starts at each k.

## How to choose k: the elbow method and silhouette score

K-means needs k up front. Inertia can't choose it on its own: it always falls as k rises, down to zero when every point is its own cluster. The two most used checks look at how fast it falls and how well separated the clusters are.

### The elbow method

The **elbow method** plots the inertia against k. Adding clusters cuts the inertia quickly while each new centroid splits a real group, then slowly once the groups are already found and extra centroids only split them. The bend between the two, the elbow, suggests k.

For the demo's four-group data (best of 10 k-means++ starts):

| k | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inertia | 7,988 | 4,269 | 2,227 | 714 | 644 | 576 | 515 | 462 |
| Mean silhouette | – | 0.470 | 0.564 | 0.689 | 0.596 | 0.504 | 0.408 | 0.339 |

Going from 3 to 4 clusters removes 1,513; going from 4 to 5 removes 70. The elbow is at k = 4. On real data the curve often bends gently with no clear corner, and two people can read different elbows from the same plot.

### The silhouette score

The **silhouette** of a point measures how much closer it is to its own cluster than to the next nearest one (Rousseeuw, 1987). For point i:

- a(i) is the mean distance from i to the other points in its cluster;
- b(i) is the smallest mean distance from i to the points of any other cluster.

$$
s(i) = \frac{b(i) - a(i)}{\max\big(a(i),\, b(i)\big)}
$$

![Three clusters of points. One blue point, labelled point i, has solid lines to the other points in its own blue cluster, with a mean length a = 1.36, and dashed lines to the orange cluster, the nearest other cluster, with a mean length b = 4.68. A green cluster further away has a mean distance of 5.68 and is ignored. The formula gives s = (4.68 - 1.36) / 4.68 = 0.71, marked on a scale from -1 to 1 labelled: below 0, closer to another cluster; near 0, on a boundary; near 1, well inside its own cluster](./silhouette-score.svg)

The **silhouette score** of a clustering is the mean of s(i) over all points, and the k with the highest score is the silhouette method's choice. It needs at least two clusters. A point alone in its cluster scores 0 by convention.

| Mean silhouette | Kaufman and Rousseeuw's reading |
| --- | --- |
| 0.71 to 1.00 | Strong structure |
| 0.51 to 0.70 | Reasonable structure |
| 0.26 to 0.50 | Weak structure, possibly artificial |
| 0.25 or less | No substantial structure |

In the six-point example, the final clusters have a mean silhouette of 0.65; P4 has the lowest, 0.44, because it is the closest of B's points to cluster A. In the four-group data, the score peaks at 0.689 for k = 4, agreeing with the elbow.

### Elbow vs silhouette

| | Elbow method | Silhouette score |
| --- | --- | --- |
| Measures | Compactness: inertia | Compactness against separation |
| Choice of k | The bend, read by eye | The highest score |
| Works at k = 1 | Yes | No, needs k ≥ 2 |
| Cost | Cheap: one pass per k | All pairwise distances: n² per k |
| Weak spot | Gentle curves with no clear bend | Favours round, well-separated clusters, like k-means itself |

Other indices, such as the gap statistic (Tibshirani, Walther and Hastie, 2001), Calinski–Harabasz and Davies–Bouldin, answer the same question in different ways. When they disagree, the data probably doesn't have one natural k, and the choice comes down to which grouping is most useful.

## K-means and Voronoi cells

When the algorithm stops, each centroid owns the region of space closer to it than to any other centroid. These regions are the **Voronoi cells** of the centroids, and their edges are the straight lines halfway between pairs of centroids. The dashed boundaries in the worked example are such edges, and the shaded regions in the demo are the Voronoi diagram of its centroids. See the [Voronoi diagram guide](/learn/chart-types/complex/voronoi-diagram/) for how the cells are built.

Because every boundary is a straight line, k-means can only cut space into convex pieces. A new point is classified by the cell it falls in, so a trained k-means model works as a simple classifier for new data, a property used in vector quantisation.

## Limitations of k-means: when it fails

K-means works best when the clusters are round, about the same size and spread, and measured on comparable scales. Each demo dataset breaks one of those assumptions:

| Dataset in the demo | What goes wrong (best of 10 starts) | Why |
| --- | --- | --- |
| Uneven sizes: one wide group of 220 points, two tight groups of 40 | At k = 3, 38 points from the wide group go to the small clusters | The boundary sits halfway between centroids, regardless of spread |
| Moons: two interleaved half-rings | At k = 2, only 75% of points are grouped with their own moon | The clusters are not convex, and a straight cut can't follow a curve |
| Circles: a ring around a disc | At k = 2, 59% agree with the true groups, little better than chance | Both groups share a centre, so no centroid can describe either |
| Unscaled features: feature 1 in units 20 times larger | At k = 4, 53% correct; after standardising, 100% | Distance is dominated by the feature with the largest numbers |

On the unscaled data, the elbow and the silhouette score both point to k = 2, the two groups that feature 1 separates, so the checks for k are misled by the same scaling problem. After standardising, both point to k = 4.

Outliers cause a fifth problem. A mean is pulled by extreme values, so a few far-off points can drag a centroid away from its group, or claim a centroid of their own. K-medoids, which uses an actual data point as each centre, and trimmed variants are less sensitive.

For curved or nested shapes, DBSCAN, spectral clustering or kernel k-means do better; for elongated or differently sized groups, a Gaussian mixture model can fit an ellipse to each.

## K-means vs k-NN

K-means and k-nearest neighbours are often confused because both have a k and both measure distances. They solve different problems:

| | K-means | K-nearest neighbours (k-NN) |
| --- | --- | --- |
| Type of learning | Unsupervised: no labels | Supervised: needs labelled training data |
| Task | Clustering: find groups | Classification or regression: predict a label or value |
| What k means | The number of clusters | The number of neighbours that vote |
| Training | Iterates until the centroids settle | None: stores the training data |
| Prediction for a new point | The nearest centroid's cluster | The majority label (or mean value) of its k nearest training points |
| Output | Cluster numbers with no meaning until you name them | Class labels from the training data |
| Boundaries | Straight lines between centroids (Voronoi cells) | Can be any shape, following the training points |
| Choosing k | Elbow method, silhouette score | Cross-validation on held-out labels |

They can work together: k-means can shrink a large training set to a few hundred centroids, and k-NN can then classify against those.

## K-means vs DBSCAN vs hierarchical clustering

| Method | You choose | Cluster shapes | Outliers | Scales to large data | Best for |
| --- | --- | --- | --- | --- | --- |
| K-means | k | Round, convex, similar size | Pulled into clusters | Yes: linear in n per iteration | Quick, compact groups; segmentation; quantisation |
| [Hierarchical clustering](/learn/machine-learning/hierarchical-clustering/) | Linkage, then where to cut the tree | Depends on linkage; single linkage follows chains | Show up as late merges | Hard beyond tens of thousands: needs all pairwise distances | Small data where the nested structure matters |
| DBSCAN | Neighbourhood radius and minimum points | Any shape, if density is similar | Labelled as noise | Yes, with a spatial index | Irregular shapes, spatial data, noise |
| Gaussian mixture model | Number of components | Ellipses of any size and tilt | Low-probability points | Moderate | Overlapping groups, soft membership |

## How to visualise clustering results

With two features, a scatter plot coloured by cluster label, with the centroids marked, shows the whole result. Shading each centroid's region adds the boundaries a new point would be classified by. Most data has more than two features, so you need other views:

- Project to two dimensions with PCA or a similar method, then draw the scatter plot. See [dimensionality reduction](/learn/machine-learning/dimensionality-reduction/).
- Draw a [parallel coordinates plot](/learn/chart-types/complex/parallel-coordinates-plot/) with one line per point, coloured by cluster, to compare clusters across every feature.
- Plot the elbow and silhouette curves to show how k was chosen, as in the demo.
- Draw a silhouette plot: each point's s(i) as a horizontal bar, sorted within each cluster. Thin clusters or bars below zero flag poor groups.
- Show a [heatmap](/learn/chart-types/cartesian/heatmap/) of the centroids, one row per cluster and one column per feature, to describe what each cluster stands for.

## Where k-means is used

- Customer and market segmentation: grouping customers by spending, frequency and recency.
- Colour quantisation and image compression: replacing millions of colours with the k centroid colours.
- Vector quantisation in signal processing and speech coding, where Lloyd developed the method for pulse-code modulation.
- Document and search-result grouping, on word or embedding vectors.
- Manufacturing and test data: grouping similar measurements, test results or failure patterns, for example in [semiconductor manufacturing](https://www.scichart.com/semiconductors-big-data-visualization/).
- As a building block: seeding Gaussian mixture models, building visual vocabularies for images, and picking representative samples from large datasets.

## Common k-means clustering mistakes

- **Forgetting to scale the features.** A feature measured in thousands swamps one measured in fractions. Standardise (z-scores) or normalise first, unless the units are already comparable.
- **Trusting a single run.** One unlucky start can merge two real groups. Use k-means++ and keep the best of several runs.
- **Taking the elbow as proof.** Inertia always falls with k, and on real data the bend is often vague. Back it up with the silhouette score and a look at the clusters.
- **Reading cluster numbers as meaningful.** Cluster 1 in one run may be cluster 3 in the next. Name clusters by their centroids, not their numbers.
- **Using k-means on categorical data.** Means and Euclidean distances make no sense for categories such as colour or country. Use k-modes, or a method with a suitable distance.
- **Clustering high-dimensional data directly.** With hundreds of features, distances between points become similar and clusters blur. Reduce the dimensions first.
- **Expecting clusters to exist.** K-means always returns k groups, even from uniform noise. A low silhouette score, below about 0.25, suggests there is no real structure to find.

## How to make a k-means clustering chart in JavaScript, React or Angular

Clustering runs over thousands to millions of points, and watching it work means redrawing every point, every centroid and the region map at each step. SciChart.js draws with WebGL, so the scatter series and the heatmap of regions redraw at once, and the same charts stay smooth with millions of points. The demo runs k-means, the elbow plot and the silhouette score in the browser.

Pick a **Dataset** and the number of clusters with **k**, and choose how the centroids **Start**: k-means++ or random points. **Step** runs one half of an iteration at a time (assign, then update), **Run** plays it to convergence, and **New start** tries different starting centroids; press it a few times on the four blobs and some runs settle at about three times the best inertia, with two centroids sharing one group. **Standardise features** rescales both features before clustering. Click on the chart to add a point; **Reset points** removes them. The side charts show the best of 10 starts at each k, with a ring for the current run. Scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="k-means clustering chart" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />

Here is the code for this chart. K-means, k-means++ and the silhouette score are plain JavaScript; SciChart.js draws the points and centroids as scatter series, the centroid paths as line series and the regions as a heatmap.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MetadataPaletteProvider,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Point = [number, number];
    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#FFE066", "#9B8AFB"];
    const dist2 = (a: Point, b: Point) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

    // Lloyd's algorithm: assign each point to the nearest centroid, move centroids to the means, repeat
    const kMeans = (points: Point[], k: number) => {
        let centroids: Point[] = points.slice(0, k).map((p) => [...p] as Point); // use k-means++ in practice
        const labels = new Array(points.length).fill(-1);
        for (let changed = true; changed; ) {
            changed = false;
            points.forEach((p, i) => {
                const c = centroids.reduce((best, m, j) => (dist2(p, m) < dist2(p, centroids[best]) ? j : best), 0);
                if (c !== labels[i]) {
                    labels[i] = c;
                    changed = true;
                }
            });
            centroids = centroids.map((m, j) => {
                const members = points.filter((_, i) => labels[i] === j);
                if (!members.length) return m; // an empty cluster keeps its centroid
                return [members.reduce((s, p) => s + p[0], 0) / members.length, members.reduce((s, p) => s + p[1], 0) / members.length] as Point;
            });
        }
        return { centroids, labels };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 1" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 2" }));

        const points: Point[] = getYourData(); // e.g. [[1, 2], [2, 1], [6, 5], ...], features on comparable scales
        const { centroids, labels } = kMeans(points, 4);
        // Each point's colour comes from its metadata
        const colourOf = (c: number) => ({ isSelected: false, fill: COLOURS[c % COLOURS.length], stroke: "#0B1A33" });
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: points.map((p) => p[0]),
                    yValues: points.map((p) => p[1]),
                    metadata: labels.map(colourOf)
                }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#FFFFFF" }),
                paletteProvider: new MetadataPaletteProvider()
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: centroids.map((c) => c[0]),
                    yValues: centroids.map((c) => c[1]),
                    metadata: centroids.map((_, c) => ({ ...colourOf(c), stroke: "#FFFFFF" }))
                }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 20, height: 20, strokeThickness: 3, fill: "#FFFFFF" }),
                paletteProvider: new MetadataPaletteProvider()
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const KMeansChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MetadataPaletteProvider,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Point = [number, number];
    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#FFE066", "#9B8AFB"];
    const dist2 = (a: Point, b: Point) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

    // Lloyd's algorithm: assign each point to the nearest centroid, move centroids to the means, repeat
    const kMeans = (points: Point[], k: number) => {
        let centroids: Point[] = points.slice(0, k).map((p) => [...p] as Point); // use k-means++ in practice
        const labels = new Array(points.length).fill(-1);
        for (let changed = true; changed; ) {
            changed = false;
            points.forEach((p, i) => {
                const c = centroids.reduce((best, m, j) => (dist2(p, m) < dist2(p, centroids[best]) ? j : best), 0);
                if (c !== labels[i]) {
                    labels[i] = c;
                    changed = true;
                }
            });
            centroids = centroids.map((m, j) => {
                const members = points.filter((_, i) => labels[i] === j);
                if (!members.length) return m; // an empty cluster keeps its centroid
                return [members.reduce((s, p) => s + p[0], 0) / members.length, members.reduce((s, p) => s + p[1], 0) / members.length] as Point;
            });
        }
        return { centroids, labels };
    };

    @Component({
        selector: "app-k-means-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class KMeansChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 1" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 2" }));

            const points: Point[] = getYourData(); // e.g. [[1, 2], [2, 1], [6, 5], ...], features on comparable scales
            const { centroids, labels } = kMeans(points, 4);
            // Each point's colour comes from its metadata
            const colourOf = (c: number) => ({ isSelected: false, fill: COLOURS[c % COLOURS.length], stroke: "#0B1A33" });
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: points.map((p) => p[0]),
                        yValues: points.map((p) => p[1]),
                        metadata: labels.map(colourOf)
                    }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#FFFFFF" }),
                    paletteProvider: new MetadataPaletteProvider()
                }),
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: centroids.map((c) => c[0]),
                        yValues: centroids.map((c) => c[1]),
                        metadata: centroids.map((_, c) => ({ ...colourOf(c), stroke: "#FFFFFF" }))
                    }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 20, height: 20, strokeThickness: 3, fill: "#FFFFFF" }),
                    paletteProvider: new MetadataPaletteProvider()
                })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- All the points are one `XyScatterRenderableSeries`. Each point's metadata carries its cluster colour, and `MetadataPaletteProvider` applies it, so recolouring after an iteration is one `appendRange` call rather than one series per cluster.
- The regions are a `UniformHeatmapRenderableSeries` whose cells hold the index of the nearest centroid. A `HeatmapColorMap` with one gradient stop per cluster colour, and `opacity: 0.3`, shades the Voronoi cells behind the points.
- Clicking adds a point through a small `CustomChartModifier2D`: it converts the mouse position to data values with each axis's coordinate calculator, and ignores drags so panning still works.
- The elbow and silhouette charts are `FastLineRenderableSeries` with point markers for the best runs, plus an `XyScatterRenderableSeries` ring for the current run.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart), and for colour-mapped grids, [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js scatter chart documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), the [heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) for the region map, and the [scatter plot guide](/learn/chart-types/cartesian/scatter-plot/). For clustering and charting large test datasets, see [SciChart for semiconductors](https://www.scichart.com/semiconductors-big-data-visualization/).

## Frequently asked questions

### What is k-means clustering used for?

K-means is used to split unlabelled data into a chosen number of groups of similar items. Common uses are customer segmentation, reducing the colours in an image (colour quantisation), grouping documents or sensor readings, building codebooks for compression, and as a quick first look at the structure of a dataset before a more careful analysis.

### How do you choose the number of clusters k?

Run k-means for a range of k and compare. The elbow method plots the inertia (within-cluster sum of squares) against k and looks for the bend after which adding clusters helps little. The silhouette method picks the k with the highest mean silhouette score. Use both, and check that the clusters at the chosen k make sense for the problem; a domain reason, such as the number of product lines, often decides.

### What is a good silhouette score?

The silhouette score runs from -1 to 1. Kaufman and Rousseeuw's rule of thumb reads a mean above 0.70 as strong structure, 0.51 to 0.70 as reasonable, 0.26 to 0.50 as weak and possibly artificial, and 0.25 or less as no real structure. A high score only means the clusters are compact and well separated in the distance k-means uses; it says nothing about whether they are useful.

### What is the difference between k-means and k-NN?

K-means is unsupervised clustering: it takes unlabelled data and splits it into k groups, where k is the number of clusters. K-nearest neighbours (k-NN) is supervised: it predicts the label of a new point from the labels of its k closest training points, where k is the number of neighbours. They share the letter k and a distance measure, but solve different problems.

### Does k-means always find the best clusters?

No. Each run of k-means always converges, because neither step can increase the within-cluster sum of squares, but it converges to a local minimum that depends on the starting centroids. Finding the true minimum is NP-hard even for points in a plane. In practice you run it several times from different starts, ideally with k-means++ seeding, and keep the run with the lowest inertia.

### How do I visualise k-means clustering in JavaScript?

Run k-means in plain JavaScript (assign each point to its nearest centroid, move each centroid to the mean of its points, repeat until nothing changes), then draw the points as a scatter series coloured by cluster label and the centroids as larger markers. Shading each centroid's region with a heatmap shows the decision boundaries. SciChart.js does this with XyScatterRenderableSeries, MetadataPaletteProvider and UniformHeatmapRenderableSeries in JavaScript, React or Angular.

## Sources

- Lloyd, S. P. (1982), [Least squares quantization in PCM](https://doi.org/10.1109/TIT.1982.1056489). *IEEE Transactions on Information Theory*, 28(2), 129–137. The assign-and-update algorithm, first written up at Bell Labs in 1957.
- MacQueen, J. (1967), [Some methods for classification and analysis of multivariate observations](https://projecteuclid.org/euclid.bsmsp/1200512992). *Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability*, 1, 281–297. The name "k-means".
- Arthur, D. and Vassilvitskii, S. (2007), [k-means++: the advantages of careful seeding](https://dl.acm.org/doi/10.5555/1283383.1283494). *Proceedings of the 18th Annual ACM-SIAM Symposium on Discrete Algorithms*, 1027–1035.
- Mahajan, M., Nimbhorkar, P. and Varadarajan, K. (2012), [The planar k-means problem is NP-hard](https://doi.org/10.1016/j.tcs.2010.05.034). *Theoretical Computer Science*, 442, 13–21.
- Rousseeuw, P. J. (1987), [Silhouettes: a graphical aid to the interpretation and validation of cluster analysis](https://doi.org/10.1016/0377-0427(87)90125-7). *Journal of Computational and Applied Mathematics*, 20, 53–65.
- Kaufman, L. and Rousseeuw, P. J. (1990), *Finding Groups in Data: An Introduction to Cluster Analysis*, Wiley. Rule of thumb for silhouette scores.
- Tibshirani, R., Walther, G. and Hastie, T. (2001), [Estimating the number of clusters in a data set via the gap statistic](https://doi.org/10.1111/1467-9868.00293). *Journal of the Royal Statistical Society: Series B*, 63(2), 411–423.
- Hastie, T., Tibshirani, R. and Friedman, J. (2009), [*The Elements of Statistical Learning*](https://hastie.su.domains/ElemStatLearn/), 2nd edition, Springer, section 14.3 (cluster analysis and k-means).
- scikit-learn, [Clustering](https://scikit-learn.org/stable/modules/clustering.html): k-means, DBSCAN, hierarchical clustering and silhouette coefficient.

<LearnCta position="bottom" chart="k-means clustering chart" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />
