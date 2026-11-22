---
sidebar_position: 90
sidebar_label: Support Vector Machine
title: "Support Vector Machine (SVM) and the Kernel Trick in 2D and 3D"
description: "What a support vector machine is: the maximum-margin hyperplane, support vectors, soft margins and C, and the kernel trick with polynomial and RBF kernels, shown in live 2D and 3D."
keywords:
    [
        "support vector machine",
        "svm",
        "what is a support vector machine",
        "support vector machine explained",
        "kernel trick",
        "rbf kernel",
        "svm kernel",
        "svm hyperplane",
        "margin support vector machine",
        "support vectors",
        "soft margin svm",
        "hinge loss",
        "svm c and gamma",
        "logistic regression vs support vector machine"
    ]
image: /img/learn/support-vector-machine-og.png
related: [decision-boundary, roc-curve, regularization, point-cloud]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a support vector machine in simple terms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A support vector machine is a classifier that separates two groups of points with the widest possible gap. It draws a line (in 2D), a plane (in 3D) or a hyperplane (in more dimensions) so that the nearest points of each class are as far from it as they can be. Those nearest points are the support vectors, and they alone fix where the boundary goes. With a kernel, the same method draws curved boundaries." }
                },
                {
                    "@type": "Question",
                    "name": "What are support vectors?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Support vectors are the training points that lie on the edge of the margin, inside it, or on the wrong side of the boundary. They are the only points with a non-zero weight in the trained model, so the boundary depends on them alone: delete every other training point and you get the same classifier. A model with few support vectors is compact and fast to evaluate; when most points are support vectors, C is small or the classes overlap heavily." }
                },
                {
                    "@type": "Question",
                    "name": "What is the kernel trick?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The kernel trick lets a linear method draw curved boundaries. Data that no straight line can split often becomes separable after mapping each point into more dimensions, for example lifting (x1, x2) to (x1, x2, x1² + x2²). An SVM only ever needs dot products between points, so instead of building the new coordinates it calls a kernel function that returns their dot product directly. The RBF kernel corresponds to an infinite number of dimensions, which could never be built explicitly." }
                },
                {
                    "@type": "Question",
                    "name": "What do C and gamma do in an SVM?",
                    "acceptedAnswer": { "@type": "Answer", "text": "C sets how much a soft-margin SVM is penalised for each point inside the margin or on the wrong side. A small C gives a wide margin that ignores some points; a large C bends the boundary to fit almost every training point. Gamma belongs to the RBF and polynomial kernels and sets how far each point's influence reaches. A small gamma gives smooth, nearly linear boundaries; a large gamma gives tight islands around single points, which overfits. Tune the two together with cross-validation." }
                },
                {
                    "@type": "Question",
                    "name": "Is an SVM better than logistic regression?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Neither is better in general. A linear SVM and logistic regression both draw a straight boundary and often score within a point or two of each other; the SVM uses only the points near the boundary, while logistic regression uses every point and gives probabilities. A kernel SVM can draw curved boundaries that logistic regression cannot without hand-made features, but it trains slowly on hundreds of thousands of rows. Try both on held-out data." }
                },
                {
                    "@type": "Question",
                    "name": "How do I visualise an SVM decision boundary in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Train the SVM, then evaluate its decision function f(x) on a regular grid across the feature space. Draw the grid as a heatmap, with one colour for negative values and another for positive, and draw contour lines at f = 0 for the boundary and f = -1 and +1 for the margins. Plot the training points on top as a scatter series and ring the support vectors. SciChart.js provides UniformHeatmapRenderableSeries, UniformContoursRenderableSeries and XyScatterRenderableSeries for these layers, in JavaScript, React and Angular alike." }
                }
            ]
        })}
    </script>
</head>

# Support Vector Machine

## What is a support vector machine?

A **support vector machine** (SVM) is a machine learning classifier that separates two classes with the boundary that leaves the widest possible gap between them. The boundary is a line in 2D and a hyperplane in more dimensions. With a kernel function, the same method draws curved boundaries by working in a higher-dimensional space without ever building it.

![Two charts in a dark navy theme. On the left, a ring of blue points surrounds a disc of orange points over a heatmap of the classifier's decision function, with a white closed curve for the boundary, thin margin curves either side and the support vectors ringed in white. On the right, the same points lifted onto a bowl-shaped paraboloid in 3D, cut by a flat green plane whose intersection with the bowl is a white circle](/img/learn/support-vector-machine-og.png)

*An SVM with an RBF kernel trained on a ring-and-disc dataset (left), and the same points lifted to 3D, where a flat plane separates them (right). Sample data. [Try the interactive version](#how-to-visualise-a-support-vector-machine-in-javascript-react-or-angular).*

:::tip Key takeaways
- An SVM picks the boundary that leaves the widest margin between the classes, and only the points nearest the boundary, the support vectors, decide where it goes.
- The margin is $2 / \lVert \mathbf{w} \rVert$ wide, so maximising it means minimising the length of the weight vector.
- A soft margin, tuned by C, lets some points sit inside the margin or on the wrong side in exchange for a wider gap.
- The kernel trick swaps every dot product for a kernel function, so a linear method draws curved boundaries.
- Scale the features first, and tune C and gamma together on held-out data.
:::

## How a support vector machine works

A linear classifier labels a point $\mathbf{x}$ by the sign of a score:

$$
f(\mathbf{x}) = \mathbf{w}^\top \mathbf{x} + b
$$

Points with $f > 0$ are class +1 and points with $f < 0$ are class −1. The **hyperplane** $f = 0$ is the decision boundary, $\mathbf{w}$ is the **weight vector** at right angles to it, and $b$ shifts it away from the origin.

When the classes can be separated, infinitely many lines do it. A perceptron stops at whichever one it reaches first. An SVM picks one particular line, the one that stays farthest from the nearest point of either class. Vapnik's statistical learning theory links a wider margin to a smaller risk of error on new data, and in practice a point has to land well away from the training data before this **maximum-margin** boundary misclassifies it.

![An annotated diagram of a support vector machine: orange class +1 points upper right and blue class −1 points lower left, separated by a solid diagonal line labelled 1, the hyperplane where f(x) = 0. Dashed lines either side, labelled 2, are the margins at f(x) = +1 and −1. Three circled points on the dashed lines, labelled 3, are support vectors. A green arrow at right angles to the line, labelled 4, is the weight vector w. A double arrow across the band, labelled 5, is the margin width 2 / ‖w‖. A blue point inside the band and another on the wrong side, labelled 6, each have a dotted slack line to their margin](./svm-margin-anatomy.svg)

### The margin and the support vectors

The SVM scales $\mathbf{w}$ and $b$ so that the nearest points on each side have $f = +1$ or $f = -1$. Those two parallel hyperplanes are the **margins**, and the distance between them is

$$
\text{margin width} = \frac{2}{\lVert \mathbf{w} \rVert}
$$

A wide margin means a short weight vector. Training a **hard-margin** SVM therefore solves

$$
\min_{\mathbf{w},\,b}\ \tfrac{1}{2}\lVert \mathbf{w} \rVert^2 \quad \text{subject to} \quad y_i(\mathbf{w}^\top \mathbf{x}_i + b) \ge 1 \ \text{for every training point } i
$$

where $y_i$ is the point's label, +1 or −1. The constraint keeps every point on its own side, at least one margin away.

The points that end up exactly on the margins are the **support vectors**. They hold the boundary in place. Move any other point, or delete it, and the solution doesn't change, as long as it stays outside the margin. In the live demo, the support vectors are ringed in white.

As a check, take two points: (−1, 0) labelled −1 and (1, 0) labelled +1. The widest gap is the vertical line $x_1 = 0$. The SVM gives $\mathbf{w} = (1, 0)$ and $b = 0$, so $f = \pm 1$ at the two points, both are support vectors, and the margin is $2 / 1 = 2$ wide, the distance between them.

### Hard margin vs soft margin and the C parameter

Real classes overlap, so no hyperplane may separate them, and one outlier can drag a hard margin a long way. A **soft-margin** SVM gives each point a slack value $\xi_i \ge 0$, how far it is allowed to break the margin, and charges for it:

$$
\min_{\mathbf{w},\,b,\,\xi}\ \tfrac{1}{2}\lVert \mathbf{w} \rVert^2 + C \sum_i \xi_i \quad \text{subject to} \quad y_i f(\mathbf{x}_i) \ge 1 - \xi_i
$$

A point with $0 < \xi_i < 1$ is inside the margin but still correctly classified; one with $\xi_i > 1$ is on the wrong side. The **C parameter** sets the price of slack:

- A small C (0.01 in the demo) makes slack cheap. The margin widens, more points fall inside it and become support vectors, and single points barely move the boundary.
- A large C (1,000) makes slack expensive. The margin narrows to fit as many training points as possible, which can chase noise.

On the demo's overlapping linear dataset with a linear kernel, moving C from 0.01 to 1 to 1,000 shrinks the margin from 2.26 to 0.67 to 0.40 units, and the support vectors drop from 144 of the 200 points to 32 and then 22.

### Hinge loss

The soft-margin problem can be written without the slack variables. Each point's slack is its **hinge loss**:

$$
\xi_i = \max\bigl(0,\ 1 - y_i f(\mathbf{x}_i)\bigr)
$$

It is zero for points safely outside the margin and grows in a straight line as a point moves into the margin and across the boundary. So a linear SVM minimises hinge loss plus an L2 penalty on the weights, with C setting the balance. Logistic regression minimises log loss plus the same kind of penalty, so the two often give similar lines. The [regularization guide](/learn/machine-learning/regularization/) covers L2 penalties in more detail.

## The kernel trick

Some classes can't be split by any straight line. In the circles dataset, one class is a disc of radius 0.5 and the other a ring of radius 1 around it. The demo's linear kernel scores 58% on the training points and 50% on a held-out test set, no better than a coin.

The fix is to add a coordinate. Lift each point $(x_1, x_2)$ to

$$
(x_1,\ x_2,\ z) \quad \text{with} \quad z = x_1^2 + x_2^2
$$

which puts every point on a bowl-shaped **paraboloid**. Points near the centre stay low and points far out rise high, so a flat plane can now pass between the disc and the ring. Where that plane cuts the bowl, it traces a circle, and that circle is the boundary back in 2D.

### A worked example

Take four class +1 points at radius 0.5, at (±0.5, 0) and (0, ±0.5), and four class −1 points at radius 1, at (±1, 0) and (0, ±1).

![Two panels. On the left, in 2D, four orange points at radius 0.5 sit inside four blue points at radius 1, with a dashed green circle of radius 0.79 between them. An arrow labelled lift, z = x1² + x2², leads to the right panel, a side view of the lifted points on a parabola: the orange points at height 0.25, the blue points at height 1, a green separating plane at z = 0.625 with margins at 0.25 and 1, a width of 0.75, and the plane meeting the parabola at x1 = −0.79 and 0.79](./svm-kernel-trick-lift.svg)

1. Lift them. The inner points all get $z = 0.5^2 = 0.25$ and the outer points $z = 1^2 = 1$.
2. In 3D the classes sit on two horizontal layers, so a linear SVM separates them with the horizontal plane halfway between, $z = 0.625$. Its weight vector is $\mathbf{w} = (0, 0, -2.67)$ with $b = 1.67$, which gives $f = +1$ at $z = 0.25$ and $f = -1$ at $z = 1$.
3. The margin is $2 / 2.67 = 0.75$ wide, the gap from 0.25 to 1.
4. Project back. The plane meets the bowl where $x_1^2 + x_2^2 = 0.625$, a circle of radius $\sqrt{0.625} = 0.79$, between the disc at 0.5 and the ring at 1.

Training an SVM on the eight lifted points gives exactly these numbers. In the demo, the 3D chart does the same on 200 noisy points and finds a circle of radius 0.75.

### Why it is called a trick

Training an SVM never needs the coordinates themselves, only the **dot products** between pairs of points. The dual form of the problem, which solvers such as SMO work on, gives each training point a weight $\alpha_i$, and the trained model is

$$
f(\mathbf{x}) = \sum_i \alpha_i\, y_i\, K(\mathbf{x}_i, \mathbf{x}) + b
$$

where $K(\mathbf{x}_i, \mathbf{x})$ is a **kernel function**: the dot product of the two points after mapping them to the new space. Only support vectors have $\alpha_i > 0$, so only they appear in the sum. For the paraboloid lift, $K(\mathbf{a}, \mathbf{b}) = \mathbf{a}^\top \mathbf{b} + \lVert \mathbf{a} \rVert^2 \lVert \mathbf{b} \rVert^2$, which works on the 2D points and never builds the third coordinate.

The saving grows with the number of dimensions. For the polynomial kernel $K(\mathbf{a}, \mathbf{b}) = (\mathbf{a}^\top \mathbf{b})^2$ with $\mathbf{a} = (1, 2)$ and $\mathbf{b} = (3, 1)$, the kernel is $(3 + 2)^2 = 25$. The explicit map $\phi(\mathbf{x}) = (x_1^2,\ \sqrt{2}\,x_1 x_2,\ x_2^2)$ gives $\phi(\mathbf{a}) = (1,\ 2\sqrt{2},\ 4)$ and $\phi(\mathbf{b}) = (9,\ 3\sqrt{2},\ 1)$, whose dot product is $9 + 12 + 4 = 25$. The kernel got there with one 2D dot product and a square. A degree-5 polynomial on 100 features would need tens of millions of coordinates, and the kernel still needs one dot product and a power. A function can serve as a kernel when it is a dot product in some space, which Mercer's theorem characterises.

## SVM kernels: linear, polynomial and RBF

The kernel sets the shape of the boundary: a straight line for the linear kernel, curves of a chosen degree for the polynomial kernel, and almost any shape for the RBF kernel, the usual first choice.

| Kernel | Formula | Boundary in 2D | Parameters | Use it when |
| --- | --- | --- | --- | --- |
| Linear | $\mathbf{x}^\top \mathbf{x}'$ | Straight line | C | Many features, such as text, or a straight boundary is enough |
| Polynomial | $(\gamma\, \mathbf{x}^\top \mathbf{x}' + r)^d$ | Conic sections at degree 2, more complex curves above | C, degree d, gamma, r | Products of features matter, as in the circles dataset at degree 2 |
| RBF (Gaussian) | $\exp(-\gamma \lVert \mathbf{x} - \mathbf{x}' \rVert^2)$ | Any smooth shape, including islands | C, gamma | A good first choice when you don't know the shape |
| Sigmoid | $\tanh(\gamma\, \mathbf{x}^\top \mathbf{x}' + r)$ | Varies | C, gamma, r | Rarely; it isn't a valid kernel for every setting |

The **RBF kernel** (radial basis function, or Gaussian kernel) measures similarity by distance: 1 for identical points, falling towards 0 as they move apart. Its feature space has infinitely many dimensions, so it can only be used through the kernel trick. The f(x) it learns is a sum of bumps, one centred on each support vector.

### What gamma does

**Gamma** sets how quickly an RBF bump falls off. The kernel drops to about a third (1/e) at a distance of $1/\sqrt{\gamma}$ in the units of the features:

- A small gamma (0.01) gives wide bumps that blur into a smooth, almost linear boundary. On the moons dataset with C = 1, training accuracy is 81.5%, so the model underfits.
- At gamma = 1, the boundary follows the two crescents: 98.5% on the training points and 99% on the test points.
- A large gamma (100) gives a narrow bump around each point. On the overlapping linear dataset with C = 1,000, gamma = 100 scores 100% on the training points, with 185 of the 200 as support vectors, but 92% on the test set, against 95.5% at gamma = 1.

scikit-learn's SVC defaults to C = 1 and sets gamma from the data, as 1 divided by the number of features times the variance of the data. The libsvm guide by Hsu, Chang and Lin recommends a grid search over C and gamma on a log scale with cross-validation, which is why both demo sliders move in powers of ten.

## How to read an SVM decision boundary plot

An SVM decision boundary plot colours each point of the plane by the SVM's score and draws the boundary and margins as contours. The 2D chart in the demo is laid out like this:

1. The background colour is f(x), the SVM's score, at every point. Orange means class +1 and blue means class −1; the deeper the colour, the further from the boundary.
2. The thick white contour is the decision boundary, f = 0. Every point on one side gets the same label.
3. The thin contours are the margins, f = +1 and f = −1. Training points between them pay a hinge-loss penalty.
4. White rings mark the support vectors. If almost every point is ringed, C is small or the classes overlap. If the rings sit only along the boundary, the model is compact.
5. Islands of colour around single points mean gamma is too high.

The score is a signed distance, not a probability. To turn it into one, fit a logistic curve to the scores on held-out data (Platt scaling), and judge the ranking with a [ROC curve](/learn/machine-learning/roc-curve/). With more than two features, plot two at a time, or project the data first. The [decision boundary guide](/learn/machine-learning/decision-boundary/) compares how different classifiers carve up the same plane.

## Multi-class SVM

An SVM separates two classes, so for more it is run several times. **One-vs-rest** trains one SVM per class against all the others and picks the class whose SVM gives the highest score: k classifiers for k classes. **One-vs-one** trains an SVM for every pair of classes, k(k − 1)/2 in all, and takes a vote; each one trains on only two classes' points, so it is often quicker overall. scikit-learn's SVC uses one-vs-one, and its LinearSVC uses one-vs-rest.

## SVM vs logistic regression vs k-nearest neighbours

Choose an SVM for a clear margin on small to medium data, logistic regression when you need probabilities or explainable coefficients, and k-NN for a quick baseline in few dimensions.

| Method | Boundary | Uses which training points | Gives probabilities | Training cost | Best for |
| --- | --- | --- | --- | --- | --- |
| Linear SVM | Straight (hyperplane) | Support vectors only | No, scores (add Platt scaling) | Fast, even with millions of rows | High-dimensional sparse data such as text |
| Kernel SVM (RBF, polynomial) | Curved, any smooth shape | Support vectors only | No, scores | Between quadratic and cubic in the rows, so slow beyond tens of thousands | Small to medium datasets with a non-linear boundary |
| Logistic regression | Straight unless you add features | All points | Yes | Fast | When you need probabilities or coefficients to explain |
| k-nearest neighbours | Any shape, jagged | All points, kept for prediction | Vote shares | None to train; slow to predict on large sets | Low dimensions, plenty of data, a quick baseline |

A kernel SVM and k-NN both draw curved boundaries. The SVM keeps only its support vectors and smooths the boundary through C and gamma; k-NN keeps every point and follows local noise unless k is large.

## Feature scaling for SVMs

SVMs measure distance. An RBF kernel compares $\lVert \mathbf{x} - \mathbf{x}' \rVert$, and the margin is measured in the units of the features. If one feature is in metres and runs from 0 to 1,000 and another is a ratio from 0 to 1, the first decides almost everything and gamma has no sensible value. Standardise each feature to mean 0 and standard deviation 1, or scale it to [−1, 1], using statistics from the training set only, and apply the same transform to new data. The demo's datasets are already on comparable scales, so one gamma suits both features.

## Where support vector machines are used

Support vector machines are used most where there are many features and fairly few labelled examples.

- Text classification: spam filtering and topic labelling, where a linear SVM handles tens of thousands of word features.
- Handwritten digit recognition. Cortes and Vapnik's 1995 paper tested soft-margin SVMs with polynomial kernels on handwritten digits.
- Bioinformatics: classifying samples from gene-expression or protein data, where there are far more features than samples.
- Image and signal classification, from face detection to fault detection in vibration and sensor data.
- Industrial inspection, such as classifying defect patterns in [semiconductor](https://www.scichart.com/semiconductors-big-data-visualization/) test and wafer data.
- Anomaly detection with a one-class SVM, which learns a boundary around normal data only. See the [anomaly detection guide](/learn/machine-learning/anomaly-detection/).
- Regression. Support vector regression fits a tube of width ε around the data and ignores errors inside it.

## Common SVM mistakes

Most SVM mistakes come from unscaled features and from settings of C and gamma that let the model memorise its training points.

- **Not scaling the features.** The largest feature dominates the distances and the margin. Fit the scaler on training data only.
- **Gamma too high.** The model memorises the training points and scores 100% on them. Compare training and test accuracy, as the demo does, and pick C and gamma by cross-validation.
- **Tuning C and gamma one at a time.** The best gamma depends on C and the reverse, so search them together on a log grid.
- **Reading the score as a probability.** f(x) is a signed distance in the kernel's feature space. Calibrate it before you use it as a risk.
- **Using a kernel SVM on a very large dataset.** The kernel matrix grows with the square of the number of rows. Use a linear SVM, a kernel approximation or a sample.
- **Ignoring class imbalance.** With 1% positives, the boundary can cut into the minority class. Weight C per class, and judge the model with a precision-recall curve rather than accuracy.
- **Pairing the polynomial kernel with a large gamma and degree.** The kernel values explode and training fails to converge, which the demo reports as "stopped at the step limit". Start with RBF.

## How to visualise a support vector machine in JavaScript, React or Angular

The demo retrains the SVM in the browser each time you move a slider, with a compact SMO solver in plain JavaScript from the same family of algorithms as libsvm, then redraws the 2D heatmap and contours and the 3D lift that shows the kernel trick at work.

Choose a **Dataset** (linear, circles or moons) and a **Kernel** (linear, polynomial or RBF), with its **Degree** for the polynomial kernel. **C** and **Gamma** move in powers of ten, and the results line shows the support-vector count and the training and test accuracy, so you can watch overfitting happen. On the right, the 3D chart lifts the same points onto the paraboloid and trains a linear SVM there. Drag **Lift** from 0 to 1, or press **Animate lift**, to raise the points off the floor and watch the plane and its white intersection circle rise with them. Drag the 3D chart to rotate it. On the 2D chart, the wheel zooms, a drag pans, a double-click resets and hovering shows values.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="SVM visualisation" demo="realtime-3d-surface-mesh-chart" demoLabel="3D surface mesh chart" docs="/3d-charts/chart-types/surface-mesh-3d/" docsLabel="SciChart.js 3D surface mesh documentation" />

Here is the code for both charts. The SVM, the kernels and the lift are plain JavaScript; SciChart.js draws the decision function as a heatmap with contour lines, and the kernel trick as a 3D surface mesh, a second mesh for the plane, a 3D scatter series and a 3D line.

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
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 1", visibleRange: new NumberRange(-2, 2) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 2", visibleRange: new NumberRange(-2, 2) }));

        // Your trained model's score f(x, y), sampled on a grid from -2 to 2, and the training points
        const { decision, points, supportVectors } = getYourTrainedSvm();
        const n = 100;
        const step = 4 / n;
        const zValues = Array.from({ length: n }, (_, r) =>
            Array.from({ length: n }, (_, c) => decision(-2 + (c + 0.5) * step, -2 + (r + 0.5) * step))
        );
        const grid = new UniformHeatmapDataSeries(wasmContext, { xStart: -2, xStep: step, yStart: -2, yStep: step, zValues });

        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: grid,
                colorMap: new HeatmapColorMap({
                    minimum: -2,
                    maximum: 2,
                    gradientStops: [
                        { offset: 0, color: "#156B87" },
                        { offset: 0.5, color: "#253556" },
                        { offset: 1, color: "#B8601A" }
                    ]
                })
            }),
            // The boundary f = 0 and the margins f = ±1
            new UniformContoursRenderableSeries(wasmContext, { dataSeries: grid, zLevels: [0], majorLineStyle: { color: "#FFFFFF", strokeThickness: 3 } }),
            new UniformContoursRenderableSeries(wasmContext, { dataSeries: grid, zLevels: [-1, 1], majorLineStyle: { color: "#FFFFFFAA", strokeThickness: 1.5 } }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: points.x, yValues: points.y }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 8, height: 8, fill: "#F48420", stroke: "#0B1A33" })
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: supportVectors.x, yValues: supportVectors.y }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 15, height: 15, fill: "#00000000", stroke: "#FFFFFF", strokeThickness: 2 })
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

    export const SvmDecisionBoundaryChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
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
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-svm-decision-boundary-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class SvmDecisionBoundaryChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 1", visibleRange: new NumberRange(-2, 2) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Feature 2", visibleRange: new NumberRange(-2, 2) }));

            // Your trained model's score f(x, y), sampled on a grid from -2 to 2, and the training points
            const { decision, points, supportVectors } = getYourTrainedSvm();
            const n = 100;
            const step = 4 / n;
            const zValues = Array.from({ length: n }, (_, r) =>
                Array.from({ length: n }, (_, c) => decision(-2 + (c + 0.5) * step, -2 + (r + 0.5) * step))
            );
            const grid = new UniformHeatmapDataSeries(wasmContext, { xStart: -2, xStep: step, yStart: -2, yStep: step, zValues });

            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, {
                    dataSeries: grid,
                    colorMap: new HeatmapColorMap({
                        minimum: -2,
                        maximum: 2,
                        gradientStops: [
                            { offset: 0, color: "#156B87" },
                            { offset: 0.5, color: "#253556" },
                            { offset: 1, color: "#B8601A" }
                        ]
                    })
                }),
                // The boundary f = 0 and the margins f = ±1
                new UniformContoursRenderableSeries(wasmContext, { dataSeries: grid, zLevels: [0], majorLineStyle: { color: "#FFFFFF", strokeThickness: 3 } }),
                new UniformContoursRenderableSeries(wasmContext, { dataSeries: grid, zLevels: [-1, 1], majorLineStyle: { color: "#FFFFFFAA", strokeThickness: 1.5 } }),
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: points.x, yValues: points.y }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 8, height: 8, fill: "#F48420", stroke: "#0B1A33" })
                }),
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: supportVectors.x, yValues: supportVectors.y }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 15, height: 15, fill: "#00000000", stroke: "#FFFFFF", strokeThickness: 2 })
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

- The decision function is sampled on a grid into a `UniformHeatmapDataSeries`, drawn by a `UniformHeatmapRenderableSeries` with a three-stop `HeatmapColorMap` centred on 0. The same data feeds two `UniformContoursRenderableSeries`, with `zLevels: [0]` for the boundary and `zLevels: [-1, 1]` for the margins.
- Support vectors are a second `XyScatterRenderableSeries` with a larger, hollow `EllipsePointMarker` (a transparent fill and a white stroke) drawn over the class points.
- The 3D view is a `SciChart3DSurface`. The paraboloid and the plane are two `SurfaceMeshRenderableSeries3D` over `UniformGridDataSeries3D` grids, with `opacity` so the points show through; the points are a `ScatterRenderableSeries3D` with per-point `vertexColor` metadata, and the intersection circle is a `PointLineRenderableSeries3D`. Y is the vertical axis in SciChart.js 3D, so the lift goes on Y.
- Each slider move retrains and redraws, at most once per animation frame. Updating a data series with `setZValues`, `setYValues` or `appendRange` redraws the chart.

**See it in the demo app:** [JavaScript 3D surface mesh chart](https://www.scichart.com/demo/javascript/realtime-3d-surface-mesh-chart) · [React 3D surface mesh chart](https://www.scichart.com/demo/react/realtime-3d-surface-mesh-chart) · [Angular 3D surface mesh chart](https://www.scichart.com/demo/angular/realtime-3d-surface-mesh-chart), and for the 2D view, [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js 3D surface mesh documentation](/3d-charts/chart-types/surface-mesh-3d/), the [3D scatter chart documentation](/3d-charts/chart-types/scatter-3d-chart/), the [uniform heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) and [contours documentation](/2d-charts/chart-types/uniform-contours-renderable-series/), and the guides to the [heatmap](/learn/chart-types/cartesian/heatmap/) and [contour plot](/learn/chart-types/cartesian/contour-plot/). For how inspection and test software uses SciChart, see [SciChart for semiconductors](https://www.scichart.com/semiconductors-big-data-visualization/).

## Frequently asked questions

### What is a support vector machine in simple terms?

A support vector machine is a classifier that separates two groups of points with the widest possible gap. It draws a line (in 2D), a plane (in 3D) or a hyperplane (in more dimensions) so that the nearest points of each class are as far from it as they can be. Those nearest points are the support vectors, and they alone fix where the boundary goes. With a kernel, the same method draws curved boundaries.

### What are support vectors?

Support vectors are the training points that lie on the edge of the margin, inside it, or on the wrong side of the boundary. They are the only points with a non-zero weight in the trained model, so the boundary depends on them alone: delete every other training point and you get the same classifier. A model with few support vectors is compact and fast to evaluate; when most points are support vectors, C is small or the classes overlap heavily.

### What is the kernel trick?

The kernel trick lets a linear method draw curved boundaries. Data that no straight line can split often becomes separable after mapping each point into more dimensions, for example lifting (x1, x2) to (x1, x2, x1² + x2²). An SVM only ever needs dot products between points, so instead of building the new coordinates it calls a kernel function that returns their dot product directly. The RBF kernel corresponds to an infinite number of dimensions, which could never be built explicitly.

### What do C and gamma do in an SVM?

C sets how much a soft-margin SVM is penalised for each point inside the margin or on the wrong side. A small C gives a wide margin that ignores some points; a large C bends the boundary to fit almost every training point. Gamma belongs to the RBF and polynomial kernels and sets how far each point's influence reaches. A small gamma gives smooth, nearly linear boundaries; a large gamma gives tight islands around single points, which overfits. Tune the two together with cross-validation.

### Is an SVM better than logistic regression?

Neither is better in general. A linear SVM and logistic regression both draw a straight boundary and often score within a point or two of each other; the SVM uses only the points near the boundary, while logistic regression uses every point and gives probabilities. A kernel SVM can draw curved boundaries that logistic regression cannot without hand-made features, but it trains slowly on hundreds of thousands of rows. Try both on held-out data.

### How do I visualise an SVM decision boundary in JavaScript?

Train the SVM, then evaluate its decision function f(x) on a regular grid across the feature space. Draw the grid as a heatmap, with one colour for negative values and another for positive, and draw contour lines at f = 0 for the boundary and f = -1 and +1 for the margins. Plot the training points on top as a scatter series and ring the support vectors. SciChart.js provides UniformHeatmapRenderableSeries, UniformContoursRenderableSeries and XyScatterRenderableSeries for these layers, in JavaScript, React and Angular alike.

## Sources

- Cortes, C. and Vapnik, V. (1995), [Support-vector networks](https://doi.org/10.1007/BF00994018). *Machine Learning*, 20(3), 273–297. The soft-margin SVM, tested on handwritten digits.
- Boser, B. E., Guyon, I. M. and Vapnik, V. N. (1992), [A training algorithm for optimal margin classifiers](https://doi.org/10.1145/130385.130401). *Proceedings of the Fifth Annual Workshop on Computational Learning Theory*, 144–152. Maximum-margin classifiers with kernels.
- Schölkopf, B. and Smola, A. J. (2002), [*Learning with Kernels: Support Vector Machines, Regularization, Optimization, and Beyond*](https://doi.org/10.7551/mitpress/4175.001.0001). MIT Press. Kernels, Mercer's theorem, the one-class SVM and support vector regression.
- Fan, R.-E., Chen, P.-H. and Lin, C.-J. (2005), [Working set selection using second order information for training support vector machines](https://www.jmlr.org/papers/v6/fan05a.html). *Journal of Machine Learning Research*, 6, 1889–1918. The SMO variant used in libsvm and in the demo.
- Hsu, C.-W., Chang, C.-C. and Lin, C.-J., [A practical guide to support vector classification](https://www.csie.ntu.edu.tw/~cjlin/papers/guide/guide.pdf). National Taiwan University. Scaling, the RBF kernel, and grid search over C and gamma.
- scikit-learn, [Support vector machines](https://scikit-learn.org/stable/modules/svm.html): kernels, C and gamma, multi-class strategies, complexity and scores.

<LearnCta position="bottom" chart="SVM visualisation" demo="realtime-3d-surface-mesh-chart" demoLabel="3D surface mesh chart" docs="/3d-charts/chart-types/surface-mesh-3d/" docsLabel="SciChart.js 3D surface mesh documentation" />
