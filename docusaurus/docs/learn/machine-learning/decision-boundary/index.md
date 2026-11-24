---
sidebar_position: 30
sidebar_label: Decision Boundary
title: "Decision Boundary: How Classifiers Divide Data (k-NN, SVM, Trees)"
description: "What a decision boundary is, how to read one, and how k-nearest neighbours, logistic regression, SVMs, decision trees, random forests and naive Bayes each shape it. With a live comparison grid."
keywords:
    [
        "decision boundary",
        "what is a decision boundary",
        "decision boundary plot",
        "knn",
        "k nearest neighbors",
        "knn classifier",
        "naive bayes",
        "random forest",
        "decision tree classifier",
        "logistic regression decision boundary",
        "classification vs regression",
        "overfitting vs underfitting",
        "classifier comparison",
        "machine learning visualization"
    ]
image: /img/learn/decision-boundary-og.png
related: [support-vector-machine, k-means-clustering, roc-curve, heatmap]
datePublished: 2026-11-21
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a decision boundary in machine learning?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A decision boundary is the line, curve or surface that separates the regions where a classifier predicts different classes. For a model that outputs probabilities, it is where two classes are equally likely, usually a probability of 0.5. Its shape depends on the model: logistic regression draws a straight line, a decision tree draws axis-aligned steps, and k-nearest neighbours and RBF support vector machines can draw curved or jagged boundaries." }
                },
                {
                    "@type": "Question",
                    "name": "How does the k-nearest neighbours (KNN) algorithm work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "k-nearest neighbours classifies a new point by measuring its distance to every training point, taking the k closest, and predicting the class most of them belong to. The share of neighbours in each class can be used as a probability. It needs no training step, but the features must be on comparable scales. A small k gives a jagged boundary that follows individual points; a larger k gives a smoother one." }
                },
                {
                    "@type": "Question",
                    "name": "What is naive Bayes?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Naive Bayes is a classifier that uses Bayes' rule to turn the probability of the features within each class into the probability of each class given the features. It is called naive because it assumes the features are independent within a class. Gaussian naive Bayes models each feature as a normal distribution per class, which gives a quadratic decision boundary. It is fast, needs little data and is a strong baseline for text classification." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a decision tree and a random forest?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A decision tree splits the data with a sequence of single-feature questions, giving a boundary made of axis-aligned steps that can overfit when the tree is deep. A random forest grows many trees, each on a bootstrap sample of the data with a random choice of features at each split, and averages their predictions. The averaged boundary is smoother and usually more accurate on new data than any single tree." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between classification and regression?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Classification predicts a category, such as spam or not spam, often with a probability for each class, and is evaluated with measures such as accuracy, precision and recall. Regression predicts a continuous number, such as a price or a temperature, and is evaluated with errors such as the mean squared error. Decision boundaries belong to classification; the regression equivalent is a fitted curve checked with a residual plot." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a decision boundary in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Train the classifier, then evaluate its probability for one class on a grid of points covering the data, for example 100 by 100. Draw the grid as a heatmap with a diverging colour map, draw its 0.5 contour as the boundary line, and overlay the training and test points as scatter series coloured by class. With SciChart.js, use UniformHeatmapRenderableSeries for the grid, UniformContoursRenderableSeries for the boundary and XyScatterRenderableSeries for the points; the code is the same in React and Angular." }
                }
            ]
        })}
    </script>
</head>

# Decision Boundary

## What is a decision boundary?

A **decision boundary** is the line or surface that separates the regions where a classifier predicts different classes. On one side the model says "class A", on the other "class B". For a model that outputs probabilities, it is the contour where the two classes are equally likely, usually a probability of 0.5.

![A grid of eighteen small charts in a dark navy theme: three rows of datasets (two interleaved moons, a ring around a smaller ring, and two overlapping clusters) and six columns of classifiers (nearest neighbours, logistic regression, decision tree, random forest, naive Bayes and an RBF support vector machine). Each panel is a red-to-blue probability heatmap with a white boundary line, red and blue training points and paler test points, and the test accuracy in the bottom-right corner](/img/learn/decision-boundary-og.png)

*Decision boundaries of six classifiers on three synthetic datasets, each trained in the browser, with test accuracy in the corner (sample data). [Try the interactive version](#how-to-plot-a-decision-boundary-in-javascript-react-or-angular).*

:::tip Key takeaways
- A decision boundary is where a classifier's predicted class changes; with probabilities, it is the 0.5 contour.
- Every family of model draws its own kind of boundary: straight lines, smooth curves, axis-aligned steps or jagged edges.
- A boundary that bends around single training points is overfitting; one too simple to follow the classes is underfitting.
- Judge a boundary by its accuracy on held-out test points, not on the points it was trained on.
- To draw one, evaluate the model on a fine grid, colour the grid by probability and overlay the data.
:::

## How a decision boundary works

A **classifier** is a model that assigns each input to one of a fixed set of classes: spam or not spam, defective or good, one species of iris or another. The inputs are its **features**, the measured values for each case. With two features, every case is a point on a flat plane, and the classifier's job is to colour the whole plane by the class it would predict there.

Most classifiers don't jump straight to a class. They compute a score or probability for each class, and then pick the largest. For two classes that means predicting class B wherever P(B) is above 0.5. The decision boundary is the set of points where P(B) is exactly 0.5, so it is a contour line of the probability surface, in the same way a contour on a map joins points of equal height.

A few properties follow from that:

- Linear and non-linear boundaries. A boundary is linear when it is a straight line in two dimensions, a flat plane in three, or a hyperplane in more. Logistic regression and linear discriminant analysis always draw linear boundaries in the features they are given. Anything else is a non-linear boundary.
- Confidence. The probability changes gradually near the boundary for most models. Points deep inside a region are predicted with confidence; points near the boundary are close calls. A plot of the probability shows both; a plot of the predicted class alone hides the difference.
- More than two classes. Each pair of neighbouring regions has its own stretch of boundary. The plane is split into one region per class, and a region can be in several pieces.
- The Bayes decision boundary. If you knew the true probability of each class at every point, the best possible boundary would be where those true probabilities are equal. Its error rate, the Bayes error, is the floor no classifier can beat. Synthetic datasets are useful for teaching because that boundary is known.

The boundary is a property of the trained model, not of the data alone. The same points give a different boundary with a different model, a different setting or a different training sample, which is what makes boundary plots such a good way to compare models.

## How to read a decision boundary plot

![An annotated decision boundary plot of two features. A dark curved line splits a red region on the left from a blue region on the right. Dashed curves either side mark probabilities of 0.25 and 0.75, with a paler band between them. Solid dots are training points and pale outlined dots are test points. One pale blue test point on the red side is circled. A box in the corner reads Test: 92%. Numbered badges 1 to 6 match a list beside the plot](./decision-boundary-anatomy.svg)

1. The boundary. The line where the colour changes is where the predicted class flips. Check whether its shape is plausible for the problem: smooth, stepped, straight or ragged.
2. The colour depth. Deep red or deep blue means the model is confident. A good model is confident where the training data is dense and one-sided, and less sure elsewhere.
3. The pale band. The strip where the probability is between about 0.25 and 0.75 is the uncertain zone. A wide band means the model hedges near the boundary; a razor-thin band means it is certain everywhere, which is often a sign of overfitting.
4. The points. Solid dots are the training data the model learnt from; paler dots are held-out test points it has never seen. A model can draw around every training point and still misplace test points.
5. Points on the wrong side. Each test point inside the other class's colour is a misclassification. A few are expected where the classes overlap.
6. The accuracy figure. The share of test points that land on the correct side, which is the number that predicts how the model will do on new data.

Also look at the edges of the plot, far from any data. Models extrapolate very differently there: logistic regression keeps its straight line going for ever, a tree keeps its last step, and an RBF support vector machine falls back to a constant offset, so the colour there says more about the model than about the data.

## How each classifier shapes the decision boundary

The shape of the boundary comes from the model's assumptions. This is the main reason the same dataset looks so different across the panels of a classifier comparison grid, such as the [scikit-learn classifier comparison](https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html), the best-known version of the picture, and the live demo on this page.

![Six schematic panels, each split into a red region and a blue region. Logistic regression and LDA: a straight line. RBF SVM: a smooth closed curve. Decision tree: a staircase of horizontal and vertical steps. Random forest: a finer staircase that follows a curve, with faint copies for the averaged trees. k-nearest neighbours with k = 1: a jagged line with small islands of the other class. Naive Bayes and QDA: an ellipse](./classifier-boundary-shapes.svg)

| Classifier | Boundary shape | What controls it | Probability output |
| --- | --- | --- | --- |
| k-nearest neighbours (k-NN) | Local and jagged at small k; smoother as k grows | k, the number of neighbours that vote; the distance measure | Share of the k neighbours in each class, so it moves in steps of 1/k |
| Logistic regression | A straight line (hyperplane) | Regularization strength C; the features you feed it | Smooth S-shaped rise across the line |
| Linear SVM | A straight line, placed to maximise the margin | C | A signed distance from the line, not a probability |
| RBF SVM | Smooth curves of almost any shape, including closed loops | gamma (how local each point's influence is) and C | A signed distance; needs calibrating to become a probability |
| Decision tree | Axis-aligned steps (rectangles) | Maximum depth, minimum points per leaf | Share of each class in the leaf, so flat within each rectangle |
| Random forest | Many fine steps, averaged into a rougher curve | Number of trees, depth, features tried per split | Average of the trees, so it changes in small steps |
| Gaussian naive Bayes | A quadratic curve (line, ellipse, parabola or hyperbola) | Fitted mean and variance of each feature in each class | Bayes' rule on two bell-shaped densities |
| LDA | A straight line | Shared covariance of the classes | Smooth, as for logistic regression |
| QDA | A quadratic curve | A separate covariance for each class | Smooth |

### k-nearest neighbours (KNN)

**k-nearest neighbours** classifies a new point by finding the k training points closest to it and taking a vote. It learns nothing in advance: the "model" is the training set itself. The boundary runs halfway between nearby points of different classes, so with k = 1 it follows every training point and can wrap islands around single outliers. Raising k averages over more neighbours and smooths the boundary, until at very large k it ignores the local shape altogether.

Distances depend on the scale of each feature, so standardise the features first, or a feature measured in thousands will dominate one measured in fractions. And with two classes, an odd k avoids tied votes. Cover and Hart showed in 1967 that, with enough data, the error of the 1-nearest-neighbour rule is at most twice the Bayes error.

### Logistic regression and linear SVMs

**Logistic regression** fits a weighted sum of the features, w₀ + w₁x₁ + w₂x₂, and passes it through the logistic (sigmoid) function to get a probability. The boundary is where the weighted sum is zero, which is a straight line. However much data you give it, the boundary stays straight; to get a curve you must add curved features yourself, such as x₁², x₂² or x₁x₂. Regularization, set by C, shrinks the weights: a small C gives a wide, gentle transition and a large C a sharp one.

A **linear support vector machine** also draws a straight line, but it places it as far as possible from the nearest points of each class, the **margin**. On cleanly separated data the two lines are often close; they differ in how much attention they pay to points far from the boundary.

### RBF support vector machines

A support vector machine with a **radial basis function (RBF) kernel** builds its decision function from bumps centred on a few training points, the support vectors. The result is a smooth boundary that can curve, bend back and enclose regions, which is why it handles the circles dataset that defeats every straight line. Its setting gamma controls how wide each bump is: a small gamma gives broad, gentle curves; a large gamma gives tight bumps around individual points. C trades a wide margin against classifying every training point correctly. The [support vector machine guide](/learn/machine-learning/support-vector-machine/) explains the kernel trick behind it.

### Decision trees

A **decision tree** asks a sequence of yes-or-no questions, each about one feature: "is feature 1 below 0.3?", then "is feature 2 above 1.2?", and so on until it reaches a leaf that predicts a class. Every question cuts the plane with a vertical or horizontal line, so the boundary is a staircase of axis-aligned steps. A diagonal boundary needs many small steps to approximate. Depth is the main control: a depth-1 tree (a "stump") makes one cut, while a deep tree can carve a rectangle around every training point.

### Random forests

A **random forest** grows many decision trees, each on a bootstrap sample of the training data (drawn with replacement) and with a random choice of features at each split, then averages their predictions. Each tree's staircase sits in a slightly different place, so the average has many small steps and follows a curved boundary much better than one tree. More trees make the average steadier, but they don't make each tree simpler, so a forest of deep trees can still hug the training points.

### Naive Bayes

**Gaussian naive Bayes** models each class as a bell-shaped (normal) distribution along each feature, and assumes the features are independent within a class. Bayes' rule then turns the two densities and the share of each class into a probability. Because each class has its own variances, the boundary is a quadratic curve. When one class is tightly clustered and the other spread around it, as in the circles dataset, the boundary closes into an ellipse, which is why naive Bayes does surprisingly well there. When the classes form curved shapes such as the moons, it can't follow them.

### LDA and QDA

**Linear discriminant analysis (LDA)** also fits a normal distribution to each class, but with one covariance shared by both classes, which makes the boundary a straight line. **Quadratic discriminant analysis (QDA)** gives each class its own covariance and draws a quadratic boundary, like naive Bayes without the independence assumption, so its ellipses can tilt to follow correlated features.

## Overfitting and underfitting in decision boundaries

A decision boundary plot shows the trade-off between overfitting and underfitting directly.

- **Overfitting** (high variance) is a boundary that bends to fit noise: islands around single points, a thin band of uncertainty, and near-perfect training accuracy that doesn't carry over to test points.
- **Underfitting** (high bias) is a boundary too simple for the data: a straight line across rings, or a tree stopped at one split. Training and test accuracy are both low.

Some examples from the live demo, at its default noise and sample, show the pattern (with 40 test points, one point is 2.5 percentage points, so small differences are noise):

| Setting | Dataset | Training accuracy | Test accuracy | What the boundary looks like |
| --- | --- | --- | --- | --- |
| RBF SVM, gamma = 100 | Moons | 98% | 43% | Tight blobs around each training point; most of the plane falls back to one class |
| RBF SVM, gamma = 2 | Moons | 93% | 85% | A smooth S-curve between the moons |
| Decision tree, depth 12 | Linear | 100% | 78% | Small rectangles around stray points |
| Decision tree, depth 1 | Linear | 88% | 93% | One straight cut |
| k-NN, k = 30 | Circles | 50% | 50% | Half the training set votes every time, so the whole plane is one colour |
| k-NN, k = 5 | Circles | 87% | 88% | A rough ring |
| Logistic regression | Circles | 52% | 53% | A straight line through two rings |

The gap between training and test accuracy is the clearest single sign of overfitting. The settings that control it are the ones in the table above: k for k-NN, depth for trees, gamma and C for RBF SVMs, and C for logistic regression. Choose them by cross-validation on the training data, not by looking at the test score.

## Training points, test points and accuracy

A boundary always looks good on the points it was fitted to: a 1-nearest-neighbour model scores 100% on its own training data by construction. To measure how a model will do on new cases, hold some data back. The usual split keeps 20 to 40% as a **test set**, which the model never sees during training.

**Accuracy** is the share of test points on the correct side of the boundary. It is easy to read off a plot, but it hides which kind of mistake is made and assumes a 0.5 threshold. When classes are unbalanced or one error costs more than the other, use the probability output and look at a [ROC curve and precision-recall curve](/learn/machine-learning/roc-curve/) as well.

With small test sets, accuracy is noisy. In the demo, 40 test points per dataset means each misclassified point costs 2.5 percentage points, and the New sample button shows how much the figures move between samples of the same distribution.

## Classification vs regression

Decision boundaries belong to **classification**, which predicts a category. **Regression** predicts a number, and has no boundary to draw: its equivalent picture is the fitted curve or surface, checked with a [residual plot](/learn/chart-types/cartesian/residual-plot/).

| | Classification | Regression |
| --- | --- | --- |
| Predicts | A class label (spam / not spam) and often its probability | A continuous value (price, temperature) |
| Typical models | k-NN, logistic regression, trees, forests, SVMs, naive Bayes | Linear regression, trees, forests, k-NN, SVR |
| Measured by | Accuracy, precision and recall, ROC AUC, log loss | Mean squared error, mean absolute error, R² |
| Picture | Decision boundary over a probability heatmap | Fitted line or surface, residual plot |

Many algorithms come in both forms. A k-NN regressor averages its neighbours' values instead of voting, and a regression tree predicts the mean value in each leaf. Logistic regression, despite its name, is mostly used for classification: it models the probability of each class, and a threshold turns that into a label.

## How to draw a decision boundary

To draw a decision boundary, ask the model for a class probability at every point of a fine grid, colour the grid by it and trace where it crosses 0.5. This works for any model that can make a prediction, in any language:

1. Pick two features to plot, and train the model (on those two features, or on all of them).
2. Build a fine grid covering the range of the data plus a margin, for example 100 × 100 points.
3. Ask the model for the probability of one class at every grid point.
4. Draw the grid as a heatmap with a diverging colour map, so the two classes have two colours and the boundary is pale.
5. Draw the 0.5 contour of the same grid as a line: that line is the decision boundary.
6. Overlay the training points and, in a lighter style, the test points, coloured by their true class.

A 100 × 100 grid is 10,000 predictions per model, so a grid of 18 panels is 180,000. That's quick for k-NN, trees and small SVMs, but for a slow model use a coarser grid and let the heatmap's interpolation smooth it.

With more than two features, the plot is a slice: fix the other features at typical values (such as their medians) and vary the two you plot. Or project the data to two dimensions first with a method such as PCA, and keep in mind that the boundary you see is then the boundary of a model trained on the projection, not of the original model.

## Which classifier to use

No classifier is best on every dataset, as the grid shows. Some starting points:

| If your data… | Try first | Why |
| --- | --- | --- |
| Is roughly linearly separable, or you need an explainable model | Logistic regression | Straight boundary, readable weights, calibrated probabilities |
| Has curved class shapes and a few thousand points | RBF SVM or k-NN | Flexible, smooth boundaries; both need scaled features |
| Mixes units and categories, or needs rules people can read | Decision tree (shallow) | Axis-aligned rules that can be written down |
| Is tabular with many features and you want strong accuracy | Random forest or gradient-boosted trees | Robust defaults, little feature scaling needed |
| Has very many features and little data, such as text | Naive Bayes | Fast, needs few examples, often a strong baseline |
| Has classes that are roughly normal with different spreads | QDA or naive Bayes | Quadratic boundaries match that shape |

## Common decision boundary mistakes

Most misleading boundary plots come from unscaled features, scores measured on the training points, or colour read as more certain than the model is.

- **Not scaling the features.** k-NN and RBF SVMs measure distance, so a feature with a larger range dominates and the boundary turns into vertical or horizontal bands. Standardise first, using the training set's mean and standard deviation.
- **Judging a model by its training accuracy.** Every flexible model can draw around its own training points. Plot and score held-out points.
- **Choosing settings from the test score.** Tuning k, depth or gamma until the test accuracy peaks leaks the test set into training. Tune with cross-validation and keep the test set for the final check.
- **Reading an SVM's shading as a probability.** An SVM outputs a signed distance from the boundary. Its colour scale is a choice of the plot, and probabilities need a calibration step such as Platt scaling.
- **Trusting the colour far from the data.** Every model extrapolates its own way, and confident colour in an empty corner reflects the model's form, not evidence.
- **Plotting a 2D slice of a many-feature model as if it were the whole model.** The boundary moves when the hidden features change. Say which values they were fixed at.
- **Drawing only the predicted class.** A two-colour plot hides how confident the model is. Show the probability as a heatmap and the boundary as a contour.
- **Comparing models on one small sample.** With 40 test points, a 5-point difference in accuracy is two points. Repeat over several samples or use cross-validation.

## How to plot a decision boundary in JavaScript, React or Angular

Each change of noise, sample or setting in the demo retrains the models and redraws all 18 panels, each a 100 × 100 heatmap with its contour and points. Every model is trained in the browser in plain JavaScript; nothing is precomputed.

Choose a **Dataset** to show all three rows or one larger set of panels, and drag **Noise** to blur the classes. **New sample** draws fresh points from the same distributions. **Tune** picks a setting (k, C, tree depth, number of trees or the RBF SVM's gamma and C), and the slider beside it changes that setting; the panels it affects are outlined. **Click adds** chooses the class of the point added when you click a panel. Hover a panel to read the model's probability; the mouse wheel zooms a panel, dragging pans it and a double-click resets it.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="decision boundary plot" demo="heatmap-chart" demoLabel="heatmap chart" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />

Here is the code for this chart. The six classifiers are short, commented functions; each returns a function that gives the probability of the blue class at any point. SciChart.js draws each panel as a uniform heatmap of that probability, a contour at 0.5 and scatter series for the points. The models are simplified teaching versions: the random forest uses depth-5 trees, naive Bayes is the Gaussian form, and the RBF SVM is trained with a basic SMO solver and shades its decision function through a logistic curve rather than a calibrated probability.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Point = { x: number; y: number; label: number }; // label 0 or 1

    // k-nearest neighbours: the share of the k closest training points in class 1
    const trainKnn = (train: Point[], k: number) => (x: number, y: number) =>
        train
            .map((p) => ({ d: (p.x - x) ** 2 + (p.y - y) ** 2, label: p.label }))
            .sort((a, b) => a.d - b.d)
            .slice(0, k)
            .reduce((sum, p) => sum + p.label, 0) / k;

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const [xMin, xMax, yMin, yMax, GRID] = [-3, 3, -3, 3, 100];
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 1", visibleRange: new NumberRange(xMin, xMax) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 2", visibleRange: new NumberRange(yMin, yMax) }));

        const train: Point[] = getYourTrainingData(); // standardised features with labels 0 and 1
        const predict = trainKnn(train, 5);

        // Evaluate the model on a grid: zValues[row][column] is P(class 1)
        const xStep = (xMax - xMin) / GRID;
        const yStep = (yMax - yMin) / GRID;
        const zValues = Array.from({ length: GRID }, (_, j) =>
            Array.from({ length: GRID }, (_, i) => predict(xMin + (i + 0.5) * xStep, yMin + (j + 0.5) * yStep))
        );
        const heatmapData = new UniformHeatmapDataSeries(wasmContext, { xStart: xMin, xStep, yStart: yMin, yStep, zValues });
        const colorMap = new HeatmapColorMap({
            minimum: 0,
            maximum: 1,
            gradientStops: [
                { offset: 0, color: "#7A1424" },
                { offset: 0.5, color: "#E6E6EA" },
                { offset: 1, color: "#123A7A" }
            ]
        });
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, { dataSeries: heatmapData, colorMap, opacity: 0.9, fillValuesOutOfRange: true }),
            // The decision boundary: the contour at P = 0.5
            new UniformContoursRenderableSeries(wasmContext, {
                dataSeries: heatmapData,
                zLevels: [0.5], // a single contour at P = 0.5
                majorLineStyle: { color: "#FFFFFF", strokeThickness: 1.5 }
            })
        );
        // The training points, one scatter series per class
        for (const [label, colour] of [[0, "#FF5A5F"], [1, "#4FA3FF"]] as const) {
            const points = train.filter((p) => p.label === label);
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: points.map((p) => p.x), yValues: points.map((p) => p.y) }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 9, height: 9, fill: colour, stroke: "#FFFFFF", strokeThickness: 1 })
                })
            );
        }
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const DecisionBoundaryChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Point = { x: number; y: number; label: number }; // label 0 or 1

    // k-nearest neighbours: the share of the k closest training points in class 1
    const trainKnn = (train: Point[], k: number) => (x: number, y: number) =>
        train
            .map((p) => ({ d: (p.x - x) ** 2 + (p.y - y) ** 2, label: p.label }))
            .sort((a, b) => a.d - b.d)
            .slice(0, k)
            .reduce((sum, p) => sum + p.label, 0) / k;

    @Component({
        selector: "app-decision-boundary-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class DecisionBoundaryChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const [xMin, xMax, yMin, yMax, GRID] = [-3, 3, -3, 3, 100];
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 1", visibleRange: new NumberRange(xMin, xMax) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 2", visibleRange: new NumberRange(yMin, yMax) }));

            const train: Point[] = getYourTrainingData(); // standardised features with labels 0 and 1
            const predict = trainKnn(train, 5);

            // Evaluate the model on a grid: zValues[row][column] is P(class 1)
            const xStep = (xMax - xMin) / GRID;
            const yStep = (yMax - yMin) / GRID;
            const zValues = Array.from({ length: GRID }, (_, j) =>
                Array.from({ length: GRID }, (_, i) => predict(xMin + (i + 0.5) * xStep, yMin + (j + 0.5) * yStep))
            );
            const heatmapData = new UniformHeatmapDataSeries(wasmContext, { xStart: xMin, xStep, yStart: yMin, yStep, zValues });
            const colorMap = new HeatmapColorMap({
                minimum: 0,
                maximum: 1,
                gradientStops: [
                    { offset: 0, color: "#7A1424" },
                    { offset: 0.5, color: "#E6E6EA" },
                    { offset: 1, color: "#123A7A" }
                ]
            });
            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, { dataSeries: heatmapData, colorMap, opacity: 0.9, fillValuesOutOfRange: true }),
                // The decision boundary: the contour at P = 0.5
                new UniformContoursRenderableSeries(wasmContext, {
                    dataSeries: heatmapData,
                    zLevels: [0.5], // a single contour at P = 0.5
                    majorLineStyle: { color: "#FFFFFF", strokeThickness: 1.5 }
                })
            );
            // The training points, one scatter series per class
            for (const [label, colour] of [[0, "#FF5A5F"], [1, "#4FA3FF"]] as const) {
                const points = train.filter((p) => p.label === label);
                sciChartSurface.renderableSeries.add(
                    new XyScatterRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues: points.map((p) => p.x), yValues: points.map((p) => p.y) }),
                        pointMarker: new EllipsePointMarker(wasmContext, { width: 9, height: 9, fill: colour, stroke: "#FFFFFF", strokeThickness: 1 })
                    })
                );
            }
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The probability grid is a `UniformHeatmapDataSeries`: `zValues[row][column]` with `xStart`, `xStep`, `yStart` and `yStep` placing the cells. `setZValues` replaces the grid when the model is retrained, without rebuilding the chart.
- The boundary is a `UniformContoursRenderableSeries` on the same data series, with `zLevels: [0.5]`, so SciChart.js traces the 0.5 contour for you.
- A `HeatmapColorMap` from 0 to 1 with a pale middle stop makes the uncertain zone pale and the confident regions saturated.
- Clicks and hover use a `CustomChartModifier2D`: `translateFromCanvasToSeriesViewRect` and each axis's coordinate calculator turn the mouse position into feature values.

**See it in the demo app:** [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), the [heatmap guide](/learn/chart-types/cartesian/heatmap/) for colour maps, and the [scatter plot guide](/learn/chart-types/cartesian/scatter-plot/) for drawing the points. The [ROC curve guide](/learn/machine-learning/roc-curve/) covers evaluating a classifier beyond accuracy.

## Frequently asked questions

### What is a decision boundary in machine learning?

A decision boundary is the line, curve or surface that separates the regions where a classifier predicts different classes. For a model that outputs probabilities, it is where two classes are equally likely, usually a probability of 0.5. Its shape depends on the model: logistic regression draws a straight line, a decision tree draws axis-aligned steps, and k-nearest neighbours and RBF support vector machines can draw curved or jagged boundaries.

### How does the k-nearest neighbours (KNN) algorithm work?

k-nearest neighbours classifies a new point by measuring its distance to every training point, taking the k closest, and predicting the class most of them belong to. The share of neighbours in each class can be used as a probability. It needs no training step, but the features must be on comparable scales. A small k gives a jagged boundary that follows individual points; a larger k gives a smoother one.

### What is naive Bayes?

Naive Bayes is a classifier that uses Bayes' rule to turn the probability of the features within each class into the probability of each class given the features. It is called naive because it assumes the features are independent within a class. Gaussian naive Bayes models each feature as a normal distribution per class, which gives a quadratic decision boundary. It is fast, needs little data and is a strong baseline for text classification.

### What is the difference between a decision tree and a random forest?

A decision tree splits the data with a sequence of single-feature questions, giving a boundary made of axis-aligned steps that can overfit when the tree is deep. A random forest grows many trees, each on a bootstrap sample of the data with a random choice of features at each split, and averages their predictions. The averaged boundary is smoother and usually more accurate on new data than any single tree.

### What is the difference between classification and regression?

Classification predicts a category, such as spam or not spam, often with a probability for each class, and is evaluated with measures such as accuracy, precision and recall. Regression predicts a continuous number, such as a price or a temperature, and is evaluated with errors such as the mean squared error. Decision boundaries belong to classification; the regression equivalent is a fitted curve checked with a residual plot.

### How do I plot a decision boundary in JavaScript?

Train the classifier, then evaluate its probability for one class on a grid of points covering the data, for example 100 by 100. Draw the grid as a heatmap with a diverging colour map, draw its 0.5 contour as the boundary line, and overlay the training and test points as scatter series coloured by class. With SciChart.js, use UniformHeatmapRenderableSeries for the grid, UniformContoursRenderableSeries for the boundary and XyScatterRenderableSeries for the points; the code is the same in React and Angular.

## Sources

- Hastie, T., Tibshirani, R. and Friedman, J. (2009), [The Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/), 2nd edition, Springer. Linear methods and decision boundaries (chapters 2 and 4: least squares, k-NN, LDA, QDA, logistic regression), trees (9.2), support vector machines (12), nearest neighbours (13) and random forests (15).
- Cover, T. and Hart, P. (1967), [Nearest neighbor pattern classification](https://doi.org/10.1109/TIT.1967.1053964). *IEEE Transactions on Information Theory*, 13(1), 21–27. The bound of twice the Bayes error.
- Breiman, L., Friedman, J., Olshen, R. and Stone, C. (1984), *Classification and Regression Trees*, Wadsworth. The CART algorithm and the Gini impurity used in the demo's trees.
- Breiman, L. (2001), [Random forests](https://doi.org/10.1023/A:1010933404324). *Machine Learning*, 45, 5–32.
- Cortes, C. and Vapnik, V. (1995), [Support-vector networks](https://doi.org/10.1007/BF00994018). *Machine Learning*, 20, 273–297.
- Fan, R.-E., Chen, P.-H. and Lin, C.-J. (2005), [Working set selection using second order information for training support vector machines](https://www.jmlr.org/papers/v6/fan05a.html). *Journal of Machine Learning Research*, 6, 1889–1918. Describes, as background, the first-order SMO pair selection the demo's SVM uses.
- Keerthi, S. S., Shevade, S. K., Bhattacharyya, C. and Murthy, K. R. K. (2001), [Improvements to Platt's SMO algorithm for SVM classifier design](https://doi.org/10.1162/089976601300014493). *Neural Computation*, 13(3), 637–649. The first-order (maximal violating pair) selection the demo's SVM uses.
- Domingos, P. and Pazzani, M. (1997), [On the optimality of the simple Bayesian classifier under zero-one loss](https://doi.org/10.1023/A:1007413511361). *Machine Learning*, 29, 103–130. Why naive Bayes classifies well even when its independence assumption is wrong.
- scikit-learn, [Classifier comparison](https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html), the widely used reference picture of decision boundaries across classifiers and datasets.

<LearnCta position="bottom" chart="decision boundary plot" demo="heatmap-chart" demoLabel="heatmap chart" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />
