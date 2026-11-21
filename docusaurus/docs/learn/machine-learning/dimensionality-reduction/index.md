---
sidebar_position: 40
sidebar_label: Dimensionality Reduction
title: "Dimensionality Reduction: PCA, t-SNE and UMAP Compared (With an Interactive 3D Example)"
description: "What dimensionality reduction is, how PCA, t-SNE and UMAP work, how to read a scree plot and an embedding plot, and which technique to use. With a live 2D and 3D example."
keywords:
    [
        "dimensionality reduction",
        "dimensionality reduction techniques",
        "what is dimensionality reduction",
        "principal component analysis",
        "pca plot",
        "pca visualization",
        "scree plot",
        "explained variance",
        "t-sne",
        "t-sne perplexity",
        "umap",
        "pca vs t-sne vs umap",
        "curse of dimensionality",
        "embedding visualization"
    ]
image: /img/learn/dimensionality-reduction-og.png
related: [k-means-clustering, hierarchical-clustering, point-cloud, correlation-matrix]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is dimensionality reduction in simple terms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Dimensionality reduction turns data with many measurements per item into data with only a few, while keeping as much of the useful structure as possible. A photo with thousands of pixel values, or a patient with hundreds of lab results, becomes two or three numbers that can be plotted on a chart or passed to a model. Each method decides differently what to keep: PCA keeps the largest variation, t-SNE and UMAP keep which items are neighbours." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between PCA, t-SNE and UMAP?",
                    "acceptedAnswer": { "@type": "Answer", "text": "PCA is linear: it rotates the data onto the few directions with the most variance, so it is fast, gives the same answer every time and its axes can be interpreted, but it can't unfold curved structure. t-SNE and UMAP are non-linear: they place points so that close neighbours in the original data stay close on the map. They separate clusters far better than PCA, but the sizes of clusters and the gaps between them are not reliable. UMAP is usually faster than t-SNE on large datasets and can map new points." }
                },
                {
                    "@type": "Question",
                    "name": "How many principal components should I keep?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Plot the explained variance of each component as a scree plot and look for the elbow, where the bars level off; keep the components before it. Alternatively keep enough components to reach a cumulative share of the variance, often 80% to 95%, or keep components whose eigenvalue is above the average. For a 2D or 3D picture you keep two or three regardless, and the cumulative share tells you how much of the data the picture leaves out." }
                },
                {
                    "@type": "Question",
                    "name": "What does perplexity mean in t-SNE?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Perplexity sets roughly how many neighbours each point pays attention to. t-SNE gives every point a Gaussian over the other points and widens or narrows it until its perplexity, 2 to the power of its entropy, matches the target. Low values focus on very close neighbours and can break real clusters into fragments; high values blend in more distant points and show more of the overall layout. Typical values are 5 to 50, and it is worth comparing several." }
                },
                {
                    "@type": "Question",
                    "name": "Can I trust distances between clusters on a t-SNE plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Not much. t-SNE preserves which points are close to each other, not how far apart separate groups are, and it evens out cluster sizes, so a tight cluster and a spread-out one can look the same size. Two clusters that sit next to each other are usually more similar than two at opposite corners, but the size of the gap is not a measurement. Check any claim about global layout with PCA, or with distances computed in the original space." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a PCA or t-SNE embedding in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute the embedding first: for PCA, centre the data, take the eigenvectors of its covariance matrix and project each row onto the first two or three; for t-SNE, run the optimisation for several hundred iterations. Then plot the coordinates as a scatter chart coloured by class, or as a 3D scatter chart for three components. SciChart.js does this with XyScatterRenderableSeries and a palette provider in 2D, and ScatterRenderableSeries3D in 3D, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Dimensionality Reduction

## What is dimensionality reduction?

**Dimensionality reduction** is the process of describing data that has many variables per item with far fewer, while keeping the structure that matters. It turns, say, 64 pixel values per image into two or three coordinates that can be plotted or fed to a model. The best-known techniques are PCA (linear), and t-SNE and UMAP (non-linear).

![A t-SNE map of 800 simulated handwritten digit images in a dark navy theme: ten coloured clusters, one per digit from 0 to 9, spread across a scatter chart, with a PCA scree plot beside it showing the share of variance explained by each of the first 20 principal components and a rising cumulative line, and small images of the first three principal components](/img/learn/dimensionality-reduction-og.png)

*A t-SNE map of 800 simulated 8 × 8 digit images, with the PCA scree plot and the first three components as images (sample data). [Try the interactive version](#how-to-plot-pca-and-t-sne-results-in-javascript-react-or-angular).*

:::tip Key takeaways
- High-dimensional data is hard to see and hard to model: distances lose contrast and the data needed grows quickly with each variable.
- PCA rotates the data onto its directions of greatest variance. It is fast, repeatable and interpretable, but linear.
- t-SNE and UMAP keep neighbours together and show clusters well, but cluster sizes and the gaps between clusters are not to scale.
- A scree plot shows how much of the data a PCA picture leaves out; an embedding plot needs several settings before you trust a pattern.
:::

## Why reduce dimensions? The curse of dimensionality

A **dimension** here is one variable measured for every item: one pixel of an image, one gene's expression level, one sensor channel. A dataset with 64 variables is a cloud of points in a 64-dimensional space. You can't draw it, and many methods that work well in two or three dimensions behave badly in it. Richard Bellman called this the **curse of dimensionality**.

Two effects explain most of it:

- Space empties out. To keep the same density of samples, the number you need grows exponentially with the number of dimensions. Take the share of a unit cube that lies more than 0.05 from every face: it is 81% in 2 dimensions, 35% in 10 and 0.003% in 100. Almost every point ends up near an edge.
- Distances stop discriminating. We scattered 1,000 random points in a unit cube and compared each query point's nearest and farthest neighbour. In 2 dimensions the nearest was on average 2% as far away as the farthest; in 10 dimensions, 27%; in 100, 70%; in 1,000, 89%. When everything is about equally far away, "nearest neighbour" means little. Beyer and colleagues proved this concentration happens for a broad class of data distributions.

Real data is rarely uniform. Pixels next to each other are correlated, and genes act in pathways, so the points usually lie near a much smaller surface inside the big space, often called a **manifold**. Dimensionality reduction tries to find that surface and describe each point by its position on it. That helps in four ways: you can plot the data, models train faster and overfit less, noise in the dropped directions is removed, and storage shrinks.

## Dimensionality reduction techniques

The techniques fall into two families. **Feature selection** keeps a subset of the original variables and drops the rest, for example removing near-constant or highly correlated columns. **Feature extraction** builds new variables from combinations of all the old ones. PCA, t-SNE and UMAP are feature extraction methods.

| Technique | Linear? | Supervised? | What it keeps | Typical use |
| --- | --- | --- | --- | --- |
| PCA (principal component analysis) | Linear | No | Directions of greatest variance | Preprocessing, compression, first look at any numeric dataset |
| LDA (linear discriminant analysis) | Linear | Yes, uses class labels | Directions that best separate known classes | Features for a classifier |
| ICA (independent component analysis) | Linear | No | Statistically independent sources | Separating mixed signals, such as EEG artefacts |
| NMF (non-negative matrix factorisation) | Linear | No | Additive, non-negative parts | Topics in text, spectra, images |
| Kernel PCA | Non-linear | No | Variance after a kernel mapping | Curved structure that PCA misses |
| MDS and Isomap | Non-linear (Isomap) | No | Pairwise or along-the-surface distances | Maps from distance tables |
| t-SNE | Non-linear | No | Local neighbourhoods | 2D or 3D maps of clusters |
| UMAP | Non-linear | No (optional labels) | Local neighbourhoods, with a little more global layout | 2D or 3D maps of large datasets; general reduction |
| Autoencoder | Non-linear | No | Whatever a neural network needs to rebuild the input | Images, audio, very large datasets |

The rest of this page covers the three most used for visualisation: PCA, t-SNE and UMAP.

## How PCA works

**Principal component analysis** (PCA) finds new axes, called **principal components**, that are combinations of the original variables. The first points along the direction in which the data varies most; the second along the direction of greatest remaining variance, at right angles to the first; and so on. Karl Pearson described it in 1901 as fitting the line or plane closest to a set of points, and Harold Hotelling developed it in 1933.

The steps:

1. Centre the data: subtract each variable's mean. If the variables are in different units, also divide by each one's standard deviation (standardise), or the variable with the biggest numbers dominates.
2. Compute the covariance matrix, $C = \frac{1}{n-1} X^{\mathsf T} X$, for the centred data $X$ with $n$ rows.
3. Find the eigenvectors and eigenvalues of $C$. Each eigenvector is a principal component; its eigenvalue is the variance of the data along it.
4. Sort the components by eigenvalue, keep the first $k$, and project each row onto them. The projections are the **scores**: the coordinates you plot.

In practice, libraries usually compute the same result with a singular value decomposition of $X$, which is more accurate numerically.

### A worked PCA example in two dimensions

Take five points: (1, 2), (2, 1), (3, 4), (4, 3) and (5, 5). Both variables have a mean of 3, a variance of 2.5 and a covariance with each other of 2.0:

$$
C = \begin{pmatrix} 2.5 & 2.0 \\ 2.0 & 2.5 \end{pmatrix}
$$

Solving $\det(C - \lambda I) = (2.5 - \lambda)^2 - 4 = 0$ gives eigenvalues 4.5 and 0.5. The first component is the diagonal (0.71, 0.71) and the second is (0.71, −0.71). The total variance is 5, so PC1 explains 4.5 / 5 = 90% and PC2 the other 10%.

![Left: five points on a grid with their mean at (3, 3), a long orange arrow along the diagonal for the first principal component and a short purple arrow across it for the second, with dashed lines projecting each point onto the first component. Right: the five PC1 scores on a number line at minus 2.12 for two points, 0.71 for two points and 2.83 for one, with a box giving the covariance matrix and the 90% and 10% shares of variance](./pca-worked-example.svg)

Projecting onto PC1 gives each point one number: −2.12, −2.12, 0.71, 0.71 and 2.83. The two-dimensional data is now one-dimensional and keeps 90% of its variance. Points (1, 2) and (2, 1) now have the same score, because the difference between them lay along PC2, which was dropped.

## How to read a PCA plot

A PCA analysis usually comes with three charts.

- The **scree plot** is a bar chart of each component's share of the variance, the **explained variance ratio**, in order. Raymond Cattell suggested keeping the components before the "elbow", where the bars level off into rubble, like scree at the foot of a cliff. A cumulative line on the same chart shows how much the first $k$ components keep together.
- The **score plot** is a scatter plot of PC1 against PC2 (or a 3D plot with PC3). Points close together have similar values across the variables PCA kept. Clusters, outliers and gradients show up here.
- The **loadings** are the weights of each original variable in a component. A large positive or negative loading means the variable drives that component. A **biplot** draws the scores as points and the loadings as arrows on the same axes, so you can see which variables push points in which direction.

Read the axis titles first. "PC1 (12%)" means the horizontal axis carries only 12% of the variance, so a picture that looks clean may leave most of the data out. In the live demo, the first two components of the 64-pixel digit images explain 21.7%, the first three 30.2%, and 26 are needed to reach 90%. The demo also shows the first three loadings as 8 × 8 images, so you can see which strokes each component responds to.

## How t-SNE works

**t-SNE** (t-distributed stochastic neighbour embedding) is a non-linear method designed for drawing high-dimensional data in two or three dimensions. Laurens van der Maaten and Geoffrey Hinton published it in 2008. Instead of keeping variance, it keeps neighbourhoods: which points are close to which.

1. For each point, t-SNE turns distances to every other point into probabilities with a Gaussian centred on it: close points get a high probability of being "picked as a neighbour", far ones almost none. The width of each Gaussian is set separately for each point, so that dense and sparse regions get the same effective number of neighbours.
2. It does the same on the map, but with a Student t-distribution (one degree of freedom) in place of the Gaussian. Its tails are much heavier. Moderately distant points can then sit far apart on the map without much penalty, which avoids crushing everything into the middle (the "crowding problem").
3. It moves the map points by gradient descent to make the two sets of probabilities match, minimising the **Kullback-Leibler divergence** between them.

Common implementations exaggerate the input probabilities for the first 250 or so iterations, which pulls clusters together early on, then let the map relax. The demo on this page does the same, and its readout shows the KL divergence falling as the map settles.

### Perplexity: the main t-SNE setting

**Perplexity** sets how many neighbours each point effectively considers. Each point's Gaussian is widened or narrowed until its perplexity, $2^{H}$ where $H$ is the entropy of its neighbour probabilities in bits, equals the target. The original paper suggests values between 5 and 50.

- Low perplexity looks only at the closest few points. Real clusters can break into small islands, and random noise can look clumpy.
- High perplexity blends in more distant points. Clusters merge more easily, but more of the overall arrangement survives.
- Perplexity must be smaller than the number of points. With a few hundred points, values near the top of the range behave like a global method.

In the demo's digits, a perplexity of 2 keeps 50% of each point's 10 nearest neighbours, 5 keeps 57%, 30 keeps 63% and 100 keeps 62%. The best value depends on the data, so try several before reading meaning into a shape.

### What t-SNE distances do and don't mean

![Left: three groups in the original data: a tight small blue group, a widely spread orange group, and a green group far from both. Right: the same groups on a t-SNE map, where they come out about the same size and roughly evenly spaced. Numbered callouts: 1, points that were neighbours stay neighbours; 2, groups come out a similar size; 3, gaps between groups are not to scale; 4, the axes have no units or meaning](./tsne-map-reading.svg)

t-SNE's cost function penalises near neighbours that end up far apart much more than distant points that end up close, and the per-point Gaussian widths even out density. As a result:

- Points that are neighbours on the map were usually neighbours in the data.
- Cluster sizes on the map say little about how spread out the clusters really are.
- Gaps between clusters are not to scale; a big gap doesn't mean "more different".
- The axes have no units and no meaning; the map can be rotated or mirrored freely.
- Each run, and each starting layout, can arrange the clusters differently.

Wattenberg, Viégas and Johnson illustrate each of these with interactive examples in "How to Use t-SNE Effectively" (Distill, 2016).

## How UMAP works

**UMAP** (uniform manifold approximation and projection), introduced by Leland McInnes, John Healy and James Melville in 2018, works in two stages. It first builds a weighted graph linking each point to its nearest neighbours, scaling each point's distances by how far away its own nearest neighbour is. It then lays out a graph in two or three dimensions whose edges match as closely as possible, pulling linked points together and pushing a sample of the others apart.

Two settings matter most:

- `n_neighbors` (15 by default in the reference implementation) plays the role of perplexity. Small values show fine local detail; large values show more of the broad structure.
- `min_dist` (0.1 by default) sets how tightly points may pack on the map. Small values give dense, well-separated clumps; larger values spread points out evenly, which helps when you care about overall shape.

UMAP is usually faster than t-SNE on large datasets, scales to millions of points, can place new points on an existing map and can reduce to more than three dimensions for use as model input. Its maps need the same care in reading as t-SNE's. Kobak and Linderman showed that much of the extra global structure UMAP was credited with comes from its starting layout, and that t-SNE started from a PCA layout keeps global structure about as well.

This page's live demo computes PCA and t-SNE in the browser. UMAP's graph construction and sampling make it a much longer example, so it is described here rather than demonstrated.

## PCA vs t-SNE vs UMAP

| | PCA | t-SNE | UMAP |
| --- | --- | --- | --- |
| Type | Linear | Non-linear | Non-linear |
| Preserves | Global variance and large distances | Local neighbourhoods | Local neighbourhoods, some global layout |
| Same result every run | Yes (up to the sign of each axis) | No, unless the start and random seed are fixed | No, unless the random seed is fixed |
| Speed | Fast: one eigendecomposition or SVD | Slow: exact version grows with the square of the points; Barnes-Hut approximation scales to large datasets | Usually faster than t-SNE, scales to millions of points |
| New points | Project with the same components | No standard way: rerun | Supported |
| Axes mean | Weighted sums of the original variables | Nothing | Nothing |
| Main settings | Number of components; whether to standardise | Perplexity, iterations, learning rate | `n_neighbors`, `min_dist` |
| Best for | Preprocessing, compression, interpretable axes, a first look | Revealing clusters in small to medium datasets | Clusters in large datasets; reduction before clustering |

A common workflow combines them: standardise the data, run PCA to keep around 50 components and drop noise, then run t-SNE or UMAP on those components for the picture.

## How to read an embedding plot

An **embedding plot** is the scatter chart of the reduced coordinates, usually coloured by a known label or by a variable of interest. A checklist for reading one:

1. Check what was reduced and how: which variables, whether they were standardised, which method and settings.
2. Look at the colours before the shapes. If points of the same label sit together, the variables carry that label's signal. Mixed colours inside one cluster can be mislabelled items or a real overlap.
3. For questions of size and distance, switch to the PCA plot, whose axes keep their scale along the components shown.
4. Look for small islands and long thin strands. Islands can be a real subgroup or an artefact of low perplexity; strands often trace a continuous change, such as slant in handwriting or time in a process.
5. Inspect individual points: outliers, and points of one colour inside another colour's group. Look at the original item behind each one; in the demo, hovering a point shows its digit image.

## Where dimensionality reduction is used

- Biology and medicine. Single-cell genomics routinely shows each cell as a point on a t-SNE or UMAP map, coloured by cell type. Flow cytometry and mass spectrometry use the same maps, and PCA is a standard first look at gene expression and population genetics data. See how SciChart is used in [diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/) software.
- Machine learning. Embeddings from language and image models have hundreds of dimensions; teams plot them in 2D or 3D to check that similar items land together, and use PCA to compress features before training.
- Industrial process monitoring. PCA models of normal operation flag a batch or a wafer whose sensor readings fall outside the usual pattern.
- Finance. PCA of interest-rate curves typically finds a few components that work like level, slope and curvature, used to describe and hedge the risk.
- Images and signals. PCA on faces ("eigenfaces"), compression, and denoising by dropping the smallest components.

## Common dimensionality reduction mistakes

- **Running PCA on unscaled variables.** A variable measured in grams beside one in kilograms dominates PC1 only because of its units. Standardise when the variables are in different units.
- **Calling a 2D PCA plot "the data".** In the demo, the first two components keep only 13% of each point's 10 nearest neighbours, against 63% for t-SNE. Put the explained variance in the axis titles.
- **Comparing two maps by position.** Each t-SNE or UMAP run can put a cluster anywhere. To compare two datasets, embed them together in one run and colour by dataset.
- **Trusting one t-SNE run.** Change the perplexity and the start. In the demo, two random starts put the clusters in different places but keep a similar share of neighbours (63% and 61%), while the arrangement from a PCA start is the same every time.
- **Stopping t-SNE too early.** During early exaggeration the map is compressed and misleading. Let it run until the KL divergence stops falling.
- **Clustering the map instead of the data.** Clusters drawn around t-SNE islands inherit its distortions. Cluster in the original space or on PCA components, then colour the map by the result.
- **Fitting the reduction on the test set.** For a model, fit PCA (means, scaling and components) on the training data only, then apply it to the test data, or the evaluation leaks information.
- **Using t-SNE output as model features.** t-SNE has no transform for new points, and its coordinates change from run to run. Use PCA, UMAP or an autoencoder for features.

## How to plot PCA and t-SNE results in JavaScript, React or Angular

Embedding plots often hold tens of thousands to millions of points, and t-SNE and UMAP produce a new layout at every iteration. SciChart.js draws with WebGL, so a scatter chart or 3D point cloud can redraw every frame while the layout settles. The demo below computes PCA and an exact t-SNE for 800 simulated 8 × 8 digit images (64 dimensions each) in the browser, and draws each iteration as it runs.

Choose the **Method** (t-SNE or PCA) and the **View**: a 2D scatter chart or a 3D point cloud, which reduces to three dimensions. For t-SNE, set the **Perplexity** (applied when you release the slider), choose whether to **Start from** a PCA layout or a random one, and use **Pause** and **Restart t-SNE** to watch the map form. Each restart from a random layout uses a new seed. The readout shows the iteration, the KL divergence and the share of each point's 10 nearest neighbours kept by the map. The side panel shows the PCA scree plot, the first three principal components as images, and the digit under the mouse. Scroll to zoom, drag to pan or rotate, and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="embedding plot" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter series documentation" />

Here is the code for this chart. The PCA, t-SNE and neighbourhood maths are plain JavaScript with no machine learning library; SciChart.js draws the map as a scatter series or a 3D point cloud and the scree plot as columns and a line.

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
        EStrokePaletteMode,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#F6E05E", "#EF5350", "#AE418D", "#B6E35B", "#9B8AFB", "#FFFFFF"];

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Dimension 1" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Dimension 2" }));

        // x, y: the 2D embedding from PCA, t-SNE or UMAP; labels: a class index (0 to 9) per point
        const { x, y, labels } = getYourEmbedding();
        const argb = COLOURS.map((c) => parseColorToUIntArgb(c));
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: y, dataIsSortedInX: false }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: "#FFFFFF" }),
                // Colour each point by its class
                paletteProvider: {
                    strokePaletteMode: EStrokePaletteMode.SOLID,
                    onAttached: () => {},
                    onDetached: () => {},
                    overridePointMarkerArgb: (xValue, yValue, index) => ({ fill: argb[labels[index]], stroke: argb[labels[index]] })
                }
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const EmbeddingPlot = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
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
        EStrokePaletteMode,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#F6E05E", "#EF5350", "#AE418D", "#B6E35B", "#9B8AFB", "#FFFFFF"];

    @Component({
        selector: "app-embedding-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class EmbeddingPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Dimension 1" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Dimension 2" }));

            // x, y: the 2D embedding from PCA, t-SNE or UMAP; labels: a class index (0 to 9) per point
            const { x, y, labels } = getYourEmbedding();
            const argb = COLOURS.map((c) => parseColorToUIntArgb(c));
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: y, dataIsSortedInX: false }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: "#FFFFFF" }),
                    // Colour each point by its class
                    paletteProvider: {
                        strokePaletteMode: EStrokePaletteMode.SOLID,
                        onAttached: () => {},
                        onDetached: () => {},
                        overridePointMarkerArgb: (xValue, yValue, index) => ({ fill: argb[labels[index]], stroke: argb[labels[index]] })
                    }
                })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The 2D map is one `XyScatterRenderableSeries` with `dataIsSortedInX: false`. A palette provider's `overridePointMarkerArgb` colours each point by its class, so 800 or 800,000 points stay a single series.
- The 3D map is a `ScatterRenderableSeries3D` with a `SpherePointMarker3D`; each point's colour goes in its metadata as `vertexColor`. All three axes share one range so the map isn't stretched.
- t-SNE runs a few iterations per animation frame, then replaces the points with `clear()` and `appendRange()`; with `autoRange: EAutoRange.Always` the 2D axes follow the map as it grows.
- The scree plot is a `FastColumnRenderableSeries` for each component's share of the variance and a `FastLineRenderableSeries` for the running total.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart), and for a 3D point cloud, [JavaScript 3D LiDAR point cloud](https://www.scichart.com/demo/javascript/3d-lidar-visualization) · [React 3D LiDAR point cloud](https://www.scichart.com/demo/react/3d-lidar-visualization) · [Angular 3D LiDAR point cloud](https://www.scichart.com/demo/angular/3d-lidar-visualization).

**Go deeper:** [SciChart.js scatter series documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), the [3D scatter chart documentation](/3d-charts/chart-types/scatter-3d-chart/), and the guides to the [scatter plot](/learn/chart-types/cartesian/scatter-plot/), [point cloud](/learn/chart-types/3d/point-cloud/) and [correlation matrix](/learn/chart-types/cartesian/correlation-matrix/), which shows the correlations PCA is built from. For how laboratory and research software uses SciChart, see [SciChart for diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

## Frequently asked questions

### What is dimensionality reduction in simple terms?

Dimensionality reduction turns data with many measurements per item into data with only a few, while keeping as much of the useful structure as possible. A photo with thousands of pixel values, or a patient with hundreds of lab results, becomes two or three numbers that can be plotted on a chart or passed to a model. Each method decides differently what to keep: PCA keeps the largest variation, t-SNE and UMAP keep which items are neighbours.

### What is the difference between PCA, t-SNE and UMAP?

PCA is linear: it rotates the data onto the few directions with the most variance, so it is fast, gives the same answer every time and its axes can be interpreted, but it can't unfold curved structure. t-SNE and UMAP are non-linear: they place points so that close neighbours in the original data stay close on the map. They separate clusters far better than PCA, but the sizes of clusters and the gaps between them are not reliable. UMAP is usually faster than t-SNE on large datasets and can map new points.

### How many principal components should I keep?

Plot the explained variance of each component as a scree plot and look for the elbow, where the bars level off; keep the components before it. Alternatively keep enough components to reach a cumulative share of the variance, often 80% to 95%, or keep components whose eigenvalue is above the average. For a 2D or 3D picture you keep two or three regardless, and the cumulative share tells you how much of the data the picture leaves out.

### What does perplexity mean in t-SNE?

Perplexity sets roughly how many neighbours each point pays attention to. t-SNE gives every point a Gaussian over the other points and widens or narrows it until its perplexity, 2 to the power of its entropy, matches the target. Low values focus on very close neighbours and can break real clusters into fragments; high values blend in more distant points and show more of the overall layout. Typical values are 5 to 50, and it is worth comparing several.

### Can I trust distances between clusters on a t-SNE plot?

Not much. t-SNE preserves which points are close to each other, not how far apart separate groups are, and it evens out cluster sizes, so a tight cluster and a spread-out one can look the same size. Two clusters that sit next to each other are usually more similar than two at opposite corners, but the size of the gap is not a measurement. Check any claim about global layout with PCA, or with distances computed in the original space.

### How do I plot a PCA or t-SNE embedding in JavaScript?

Compute the embedding first: for PCA, centre the data, take the eigenvectors of its covariance matrix and project each row onto the first two or three; for t-SNE, run the optimisation for several hundred iterations. Then plot the coordinates as a scatter chart coloured by class, or as a 3D scatter chart for three components. SciChart.js does this with XyScatterRenderableSeries and a palette provider in 2D, and ScatterRenderableSeries3D in 3D, in plain JavaScript, React or Angular.

## Sources

- Jolliffe, I. T. and Cadima, J. (2016), [Principal component analysis: a review and recent developments](https://doi.org/10.1098/rsta.2015.0202). *Philosophical Transactions of the Royal Society A*, 374, 20150202. Covariance and SVD forms of PCA, explained variance, how many components to keep, biplots; Pearson (1901) and Hotelling (1933).
- van der Maaten, L. and Hinton, G. (2008), [Visualizing data using t-SNE](https://www.jmlr.org/papers/v9/vandermaaten08a.html). *Journal of Machine Learning Research*, 9, 2579–2605. Neighbour probabilities, perplexity (typical values 5 to 50), the Student t kernel and the crowding problem.
- van der Maaten, L. (2014), [Accelerating t-SNE using tree-based algorithms](https://jmlr.org/papers/v15/vandermaaten14a.html). *Journal of Machine Learning Research*, 15, 3221–3245. Barnes-Hut t-SNE and early exaggeration.
- McInnes, L., Healy, J. and Melville, J. (2018), [UMAP: uniform manifold approximation and projection for dimension reduction](https://arxiv.org/abs/1802.03426). arXiv:1802.03426. The [umap-learn parameter guide](https://umap-learn.readthedocs.io/en/latest/parameters.html) explains `n_neighbors` and `min_dist`.
- Wattenberg, M., Viégas, F. and Johnson, I. (2016), [How to use t-SNE effectively](https://doi.org/10.23915/distill.00002). *Distill*. Perplexity, cluster sizes, distances between clusters and run-to-run variation.
- Kobak, D. and Linderman, G. C. (2021), [Initialization is critical for preserving global data structure in both t-SNE and UMAP](https://doi.org/10.1038/s41587-020-00809-z). *Nature Biotechnology*, 39, 156–157.
- Bellman, R. (1957), *Dynamic Programming*. Princeton University Press. Origin of the term "curse of dimensionality".
- Beyer, K., Goldstein, J., Ramakrishnan, R. and Shaft, U. (1999), [When is "nearest neighbor" meaningful?](https://doi.org/10.1007/3-540-49257-7_15). *Database Theory – ICDT'99*, 217–235. Distance concentration in high dimensions.
- Cattell, R. B. (1966), [The scree test for the number of factors](https://doi.org/10.1207/s15327906mbr0102_10). *Multivariate Behavioral Research*, 1(2), 245–276.
- Litterman, R. and Scheinkman, J. (1991), [Common factors affecting bond returns](https://doi.org/10.3905/jfi.1991.692347). *The Journal of Fixed Income*, 1(1), 54–61. Level, slope and curvature components of yield curves.
- Becht, E. et al. (2019), [Dimensionality reduction for visualizing single-cell data using UMAP](https://doi.org/10.1038/nbt.4314). *Nature Biotechnology*, 37, 38–44.
- The demo's digit images are simulated, in the style of the UCI "Optical Recognition of Handwritten Digits" dataset (8 × 8 images, pixel values 0 to 16); no real data is used.

<LearnCta position="bottom" chart="embedding plot" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter series documentation" />
