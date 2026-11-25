---
sidebar_position: 70
sidebar_label: Regularization (Ridge and Lasso)
title: "Regularization: Ridge and Lasso Regression Explained"
description: "What regularization is, how ridge (L2) and lasso (L1) regression shrink coefficients, why lasso sets some to zero, and how to choose lambda by cross-validation. With a live polynomial example."
keywords:
    [
        "regularization",
        "ridge regression",
        "lasso regression",
        "l1 vs l2 regularization",
        "ridge vs lasso",
        "elastic net",
        "polynomial regression",
        "overfitting vs underfitting",
        "underfitting",
        "bias variance tradeoff",
        "cross validation",
        "k-fold cross validation",
        "coefficient path",
        "validation curve"
    ]
image: /img/learn/regularization-og.png
related: [residual-plot, decision-boundary, activation-functions, roc-curve]
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
                    "name": "What is the difference between ridge and lasso regression?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both add a penalty on the size of the coefficients to the least squares fit. Ridge regression penalises the sum of the squared coefficients (an L2 penalty), which shrinks every coefficient towards zero but keeps them all in the model. Lasso regression penalises the sum of their absolute values (an L1 penalty), which shrinks them too but sets some exactly to zero, so it also selects features. Ridge copes better with groups of correlated features; lasso gives a smaller model that is easier to explain." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between overfitting and underfitting?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An underfitted model is too simple to capture the pattern, so it makes large errors on the training data and on new data alike: a straight line through curved data is the classic case. An overfitted model is so flexible that it learns the noise in the training data as well as the pattern, so its training error is very low but its error on new data is much higher. Regularization, fewer features and more data all reduce overfitting." }
                },
                {
                    "@type": "Question",
                    "name": "What does lambda do in ridge and lasso regression?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Lambda sets how strongly the penalty counts against the fit. At lambda = 0 the model is ordinary least squares. As lambda grows, the coefficients shrink towards zero, the fitted curve becomes smoother, the training error rises and the variance of the model falls. Very large values shrink everything and the model underfits. The best value is usually chosen by cross-validation, and it depends on how the penalty is scaled, so values are not comparable between libraries." }
                },
                {
                    "@type": "Question",
                    "name": "Why does lasso set coefficients to zero but ridge does not?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The L1 penalty has a kink at zero. For a single coefficient, the lasso solution is the least squares value moved towards zero by a fixed amount, and it stops at exactly zero if the value is smaller than that amount. Ridge divides each value by a factor greater than one, which never reaches zero. Geometrically, the lasso constraint is a diamond with corners on the axes, and the error contours usually first touch it at a corner, where some coefficients are zero; the ridge constraint is a circle with no corners." }
                },
                {
                    "@type": "Question",
                    "name": "How do you choose lambda with cross-validation?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Split the training data into k folds, often 5 or 10. For each value on a grid of lambdas, fit the model k times, each time leaving one fold out and measuring the error on it, and average the k errors. Plot the average against lambda on a log scale: this validation curve is usually U-shaped. Pick the lambda at its minimum, or the largest lambda within one standard error of the minimum for a simpler model, then refit on all the training data and check it once on a held-out test set." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot ridge and lasso coefficient paths in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Standardise the features, then fit the model at each lambda on a grid spaced evenly on a log scale, from a value that shrinks every coefficient to near zero down to a very small one. Store each coefficient as a series of (lambda, value) points and draw one line per coefficient on a logarithmic x-axis. SciChart.js does this with FastLineRenderableSeries, XyDataSeries and LogarithmicAxis, in plain JavaScript, React or Angular, and a VerticalLineAnnotation marks the chosen lambda." }
                }
            ]
        })}
    </script>
</head>

# Regularization: Ridge and Lasso Regression

## What is regularization?

**Regularization** (also called shrinkage or penalised regression) stops a model overfitting by adding a penalty on the size of its coefficients to the error it minimises. **Ridge regression** penalises the squared coefficients (L2) and shrinks them all; **lasso regression** penalises their absolute values (L1) and sets some exactly to zero. A tuning value, λ, sets its strength.

![Three charts in a dark navy theme: noisy training points with a dashed true curve and an orange fitted polynomial that follows it smoothly, a coefficient path chart with fifteen coloured lines shrinking towards zero as lambda increases on a log-scale axis with a dashed marker at the chosen lambda, and training, cross-validation and test error curves against lambda with the cross-validation curve dipping to a minimum](/img/learn/regularization-og.png)

*A degree-15 polynomial fitted to 20 noisy points with ridge regression, its coefficient paths and its error curves (sample data). [Try the interactive version](#how-to-plot-ridge-and-lasso-regression-in-javascript-react-or-angular).*

:::tip Key takeaways
- A model that fits its training data too closely learns the noise as well as the pattern, and predicts new data badly.
- Ridge (L2) shrinks every coefficient smoothly; lasso (L1) shrinks them and drops some to exactly zero; elastic net mixes the two.
- λ moves the model along the bias–variance trade-off: larger values mean a simpler, more stable model that fits the training data less closely.
- Choose λ by cross-validation on the training data, and standardise the features first so the penalty treats them equally.
:::

## Overfitting vs underfitting

**Polynomial regression** fits a curve $y = \beta_0 + \beta_1 x + \beta_2 x^2 + \dots + \beta_d x^d$ by least squares. It is still linear regression, because the model is linear in the coefficients; the powers of x are just extra features. The degree d sets how flexible the curve can be, which makes it the clearest way to see two opposite failures:

- **Underfitting**: the model is too simple for the pattern. Its error is high on the training data and on new data.
- **Overfitting**: the model is flexible enough to bend through the random noise in the training points. Its training error is very low, but it predicts new data badly, because the noise it learned won't repeat.

![Three panels with the same 20 noisy points around a dashed wavy true curve. Left, a straight line (degree 1) misses the wave: underfitting, training RMSE 0.74, test RMSE 0.56. Middle, a degree 6 polynomial follows the wave: a good fit, training RMSE 0.20, test RMSE 0.30. Right, a degree 15 polynomial passes close to every point but swings off the chart at both ends: overfitting, training RMSE 0.08, test RMSE 5.56](./underfitting-overfitting.svg)

The table uses the same 20 points, drawn from a smooth curve with random noise of standard deviation 0.25, and 200 new points from the same curve as a test set. RMSE (root mean squared error) is the typical size of a prediction error, so a perfect model would score about 0.25 on new data: the noise itself.

| Degree | Training RMSE | Test RMSE | Diagnosis |
| --- | --- | --- | --- |
| 1 | 0.74 | 0.56 | Underfitting: a straight line through a wave |
| 3 | 0.41 | 0.38 | Still too stiff |
| 6 | 0.20 | 0.30 | Close to the noise floor |
| 10 | 0.17 | 0.30 | Training error still falling, test error flat |
| 15 | 0.08 | 5.56 | Overfitting: wild swings between and beyond the points |

Training error can only fall as the degree rises, because each higher-degree model contains the lower ones. That makes it useless for choosing the degree. The test error falls and then climbs, and its minimum is the model to keep.

The unpenalised degree-15 coefficients show the cause. On standardised features the largest is about 10,800, and there are large coefficients of both signs, which cancel each other at the training points and swing apart between them. Regularization works by keeping coefficients like these small.

## The bias–variance trade-off

The expected squared error of a model on a new point splits into three parts:

$$
\mathbb{E}\big[(y - \hat f(x))^2\big] = \underbrace{\sigma^2}_{\text{noise}} + \underbrace{\big(\mathbb{E}[\hat f(x)] - f(x)\big)^2}_{\text{bias}^2} + \underbrace{\mathbb{E}\big[(\hat f(x) - \mathbb{E}[\hat f(x)])^2\big]}_{\text{variance}}
$$

- **Bias** is how far the average model, over many possible training sets, is from the truth. A straight line fitted to a wave is biased however much data you give it.
- **Variance** is how much the model changes from one training set to another. A degree-15 polynomial fitted to a fresh sample of 20 points looks completely different each time.
- The noise, $\sigma^2$, is the floor no model can beat.

Flexible models have low bias and high variance; simple ones the reverse. Underfitting is the high-bias end and overfitting the high-variance end. Regularization gives a dial between them that doesn't change the model's form: keep all 15 powers of x, and let λ decide how far the coefficients may grow. Hoerl and Kennard proved that some λ greater than zero always gives ridge coefficients a lower mean squared error than least squares: the variance removed outweighs the bias added.

## How regularization works: the penalty and λ

Least squares picks the coefficients that minimise the residual sum of squares, RSS $= \sum_i (y_i - \hat y_i)^2$. A regularized model minimises the RSS plus a penalty that grows with the coefficients:

$$
\text{minimise} \quad \text{RSS}(\beta) + \lambda \cdot \text{penalty}(\beta)
$$

The penalty strength λ (alpha in some libraries) is a hyperparameter: you set it, the data doesn't. At λ = 0 you get ordinary least squares. As λ grows, large coefficients cost more, so the fit settles for smaller ones and a smoother curve, at the price of a slightly higher training error. The intercept $\beta_0$ is left out of the penalty, so shrinking the slopes never drags the whole curve towards zero.

## What is ridge regression (L2)?

**Ridge regression** penalises the sum of the squared coefficients, the squared L2 norm:

$$
\hat\beta^{\text{ridge}} = \arg\min_\beta \; \sum_{i=1}^{n} \Big(y_i - \beta_0 - \sum_{j=1}^{p} x_{ij}\beta_j\Big)^2 + \lambda \sum_{j=1}^{p} \beta_j^2
$$

It has a closed-form solution. With the features centred, $\hat\beta^{\text{ridge}} = (X^\top X + \lambda I)^{-1} X^\top y$. When features are highly correlated, as $x^{13}$, $x^{14}$ and $x^{15}$ are, $X^\top X$ is close to singular, and least squares produces the huge, unstable coefficients seen above. Adding λ to its diagonal makes the matrix well conditioned, so the solution stays stable.

Hoerl and Kennard introduced ridge regression in 1970 for exactly this problem, correlated predictors. The same idea appears in numerical analysis as Tikhonov regularization and in neural networks as **weight decay**.

Ridge shrinks every coefficient but almost never to exactly zero, so all the features stay in the model. In the example, ridge at λ = 0.25 keeps all 15 powers but cuts the largest coefficient from about 10,800 to 1.6. The training RMSE rises from 0.08 to 0.33 and the test RMSE falls from 5.56 to 0.30.

## What is lasso regression (L1)?

**Lasso regression** (least absolute shrinkage and selection operator) penalises the sum of the absolute values, the L1 norm:

$$
\hat\beta^{\text{lasso}} = \arg\min_\beta \; \sum_{i=1}^{n} \Big(y_i - \beta_0 - \sum_{j=1}^{p} x_{ij}\beta_j\Big)^2 + \lambda \sum_{j=1}^{p} |\beta_j|
$$

Tibshirani introduced it in 1996. Replacing the squares with absolute values means the lasso sets some coefficients exactly to zero, so it fits the model and selects features in one step. At the λ chosen by cross-validation in the example (0.16), the lasso keeps 7 of the 15 powers of x and reaches a test RMSE of 0.29.

There is no closed form, because $|\beta_j|$ has a corner at zero. The usual solver, used by glmnet, is **coordinate descent**: fix all coefficients but one, solve for that one exactly, and cycle until nothing changes. Each one-coefficient step is a soft-threshold: work out the least squares value for that coefficient given the others, move it towards zero by λ/2 divided by that feature's sum of squares, and set it to zero if it would cross. Coordinate descent slows down badly on nearly collinear features such as high powers of x, so the live demo runs it for a while and then finishes with an exact active-set step (feature-sign search) that checks the lasso's optimality conditions.

### Worked example: ridge and lasso on three coefficients

The difference is easiest to see when the features are orthonormal (uncorrelated, each with $\sum_i x_{ij}^2 = 1$). Then each coefficient can be solved on its own from its least squares value $\hat\beta_j$:

- ridge: $\hat\beta_j / (1 + \lambda)$, the same proportional shrink for every coefficient;
- lasso: $\text{sign}(\hat\beta_j)\,\max(|\hat\beta_j| - \lambda/2,\ 0)$, the same fixed step towards zero, stopping at zero.

With λ = 1:

| Coefficient | Least squares | Ridge | Lasso |
| --- | --- | --- | --- |
| $\beta_1$ | 3.0 | 1.5 | 2.5 |
| $\beta_2$ | 1.0 | 0.5 | 0.5 |
| $\beta_3$ | 0.4 | 0.2 | 0 |

Ridge halves everything, so big coefficients lose the most in absolute terms. The lasso takes 0.5 off each, which leaves the big coefficient almost untouched and removes the small one entirely. With the penalty written as RSS + λ times the norm, as here, the lasso step is λ/2. Texts that put ½ in front of the RSS write it as λ.

## Why lasso sets coefficients to zero: the geometry

Each penalised fit can be rewritten as least squares with a budget: minimise the RSS while keeping the penalty below some limit t. Larger λ means a smaller t. The diagram shows the case of two coefficients.

![Two panels in the plane of two coefficients, beta 1 across and beta 2 up. In both, brown ellipses of equal residual sum of squares surround the least squares estimate at about (1.8, 0.7). Left, the lasso budget is a red diamond with corners on the axes; the ellipse that first touches it does so at the corner (1, 0), so beta 2 is exactly zero. Right, the ridge budget is a blue circle; the ellipse first touches it at (0.83, 0.56), where both coefficients are smaller but neither is zero](./lasso-ridge-constraint.svg)

- The ellipses are contours of equal RSS around the least squares estimate. Moving outwards, the error grows.
- The shaded shape holds every pair of coefficients the budget allows: a diamond for the L1 norm, a circle for the L2 norm.
- The penalised solution is the point where the smallest ellipse first touches the shape.
- The diamond has corners on the axes, and an ellipse coming from most directions hits a corner first. At a corner, one coefficient is exactly zero. In more dimensions the L1 shape has many corners and edges, so several coefficients can be zero at once.
- The circle has no corners, so the touching point almost never lies on an axis. Ridge pulls both coefficients in, but keeps both.

## Elastic net: combining L1 and L2

The **elastic net** (Zou and Hastie, 2005) uses both penalties: RSS $+\ \lambda_1 \sum_j |\beta_j| + \lambda_2 \sum_j \beta_j^2$, often written as one λ and a mixing weight α between 0 (ridge) and 1 (lasso). It keeps the lasso's zeros, but where the lasso picks one feature from a group of strongly correlated ones more or less at random, the elastic net tends to keep or drop the group together. It also avoids a lasso limit: with more features than observations, the lasso can select at most n of them.

## How to read a coefficient path plot

A **coefficient path** plot shows every coefficient against λ, usually on a log scale. In the [live demo](#how-to-plot-ridge-and-lasso-regression-in-javascript-react-or-angular) it is the bottom-left chart.

- The x-axis is λ on a logarithmic axis, because the interesting changes happen over several powers of ten. Some tools reverse it, or plot against the L1 norm of the coefficients instead.
- At the right, with a very large λ, every coefficient is at or near zero: the model predicts the mean.
- Moving left, coefficients grow. For ridge they all grow together, smoothly. For the lasso they enter one at a time: in the example, only the $x$ term is non-zero at λ = 10, and $x^3$ and $x^4$ have joined it by λ = 1.
- At the far left, the paths approach the least squares values, which for an overfitted model are large and of both signs.
- A vertical line marks the λ chosen by cross-validation. Read across it to see which features the chosen model uses and how much each one counts.
- Lasso paths can cross zero or leave the model again as λ falls. A feature that enters early and stays is a strong, stable predictor; one that flickers in and out is not.

## How to choose λ with cross-validation

λ can't be chosen on the training error, which is always lowest at λ = 0, or on the test set, which then stops being an honest test. **Cross-validation** estimates the error on new data from the training data alone. In k-fold cross-validation:

1. Split the training data into k folds, often 5 or 10.
2. For each λ on a grid, spaced evenly on a log scale: fit the model k times, each time leaving one fold out, and measure the error on the fold left out.
3. Average the k errors for each λ, and plot the average against λ. This is the **validation curve**.
4. Pick the λ at the minimum of the curve, refit on all the training data, and check the result once on the test set.

The validation curve is U-shaped for the same reason as the test error against degree. On the right of the U, large λ, the model underfits: high bias. On the left, small λ, it overfits: high variance. For the 20-point example fitted with ridge at degree 15, the 5-fold CV error is lowest at λ = 0.25, about 0.40, where the test error is 0.30. At λ = 100 both are around 0.75 to 0.85 (underfitting), and unpenalised, the cross-validation error runs into the thousands.

Hastie, Tibshirani and Friedman suggest a **one-standard-error rule**: rather than the λ at the minimum, take the largest λ whose error is within one standard error of it. The curve is noisy near its minimum, and the rule picks the simplest model that the data can't tell apart from the best one.

A validation curve can also be drawn against the degree, or any other complexity setting. A **learning curve** plots the error against the size of the training set: if the training and validation errors meet at a high level, more data won't help and the model needs more flexibility; if a wide gap remains, more data or more regularization will.

## Standardise the features first

The penalty adds up the coefficients' sizes, but a coefficient's size depends on its feature's units. A feature in millimetres needs a coefficient 1,000 times smaller than the same feature in metres, so it is penalised far less. Without scaling, the penalty depends on arbitrary choices of units.

- Standardise each feature to mean 0 and standard deviation 1 before fitting. In the polynomial example every power of x is standardised, so $x$ and $x^{15}$ compete on equal terms.
- Compute the means and standard deviations on the training data only, and inside each cross-validation fold on that fold's training part. Scaling on the whole dataset leaks information from the held-out points.
- Centre y, or fit an unpenalised intercept, so the penalty never pulls the average prediction towards zero.
- To report coefficients in the original units, divide each standardised coefficient by its feature's standard deviation.

## Ridge vs lasso vs elastic net

Use ridge when many features each matter a little, lasso when you want a small model with only a few features, and elastic net when correlated features should be kept or dropped together.

| Method | Penalty | Sets coefficients to zero? | Correlated features | Solution | Best when |
| --- | --- | --- | --- | --- | --- |
| Least squares | None | No | Unstable, large offsetting coefficients | Closed form | Few features, plenty of data, no collinearity |
| Ridge (L2) | $\lambda \sum_j \beta_j^2$ | No, shrinks all | Shares the weight across the group | Closed form | Many features that each matter a little; collinearity |
| Lasso (L1) | $\lambda \sum_j \lvert\beta_j\rvert$ | Yes | Picks one, more or less at random | Iterative (coordinate descent, LARS) | A few features matter, and you want a small, explainable model |
| Elastic net | Both | Yes | Keeps or drops the group together | Iterative | Many correlated features and you want selection |
| Fewer features or lower degree | Hard limit | Drops them by hand | Up to you | Closed form | You know which features matter |

For neural networks the same ideas appear as weight decay (equivalent to an L2 penalty under plain gradient descent, but not with adaptive optimisers such as Adam), early stopping (halting training when the validation error starts to rise) and dropout.

## Common regularization mistakes

Most regularization mistakes come from how λ is chosen and reported, or from reading too much into the features the lasso keeps.

- **Standardising 0/1 features without thinking.** Scaling a dummy variable for a rare category makes its coefficient cheaper or dearer to use, depending on the choice. Decide on purpose, and use the same rule for every dummy.
- **Quoting the best cross-validation error as the expected error.** λ was chosen because that error was lowest, so it is optimistic. Report the error on a held-out test set, or use nested cross-validation, with λ tuned inside each outer fold.
- **Searching too narrow a grid.** If the minimum of the validation curve sits at the end of the λ grid, the best value may be beyond it. Extend the grid until the curve turns up on both sides.
- **Reading p-values after lasso selection.** Standard errors and p-values from refitting the selected features by least squares ignore the selection step, so they look more certain than they are.
- **Copying λ between tools.** Libraries scale the loss differently. scikit-learn's lasso divides the RSS by 2n, so its alpha is not the λ in a textbook formula; glmnet uses a similar scaling. Tune λ again in each tool.
- **Treating the lasso's choice of features as the truth.** With correlated features, a small change in the data can swap which one is kept. Check stability across folds or bootstrap samples before telling anyone that feature A matters and B doesn't.
- **Reading a smooth fit as a good one far from the data.** Even a regularized polynomial can swing outside the range of the training x values. Don't extrapolate.
- **Skipping the residuals.** A low cross-validation error doesn't show a curve the model missed or noise that grows with x. Check a [residual plot](/learn/chart-types/cartesian/residual-plot/) of the chosen model.

## How to plot ridge and lasso regression in JavaScript, React or Angular

The demo refits 366 models in the browser each time you change the degree or the noise (61 values of λ, each fitted once on all the data and five times for cross-validation), then redraws the fitted curve, the coefficient paths and the error curves together. The ridge, lasso and cross-validation maths is plain JavaScript.

Choose a **Method**: no penalty, ridge or lasso. **Degree** sets the polynomial degree, from 1 to 15. Drag the **λ** slider, or the dashed line on the coefficient path chart, to change the penalty on a log scale from 0.0001 to 100. **Noise** sets the noise in the data. **Best λ (5-fold CV)** jumps to the λ with the lowest cross-validation error, **Error vs** switches the error chart between λ and degree, and **Resample data** draws a fresh set of points. The readout above the charts gives the training, cross-validation and test RMSE and the number of non-zero coefficients. Hover any chart for values; the wheel zooms, a drag pans and a double-click restores the full view.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="regularization plot" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The fitting is plain JavaScript; SciChart.js draws the training points as a scatter series, the fitted curve, coefficient paths and error curves as line series, and λ on a logarithmic axis.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const PATH_COLOURS = ["#EC5151", "#ECC051", "#72EC51", "#51ECD4", "#5194EC", "#B551EC", "#EC51EC"]; // one per feature

    // Ridge coefficients for standardised features X and centred y: solve (XᵀX + λI) b = Xᵀy
    const ridgeCoefficients = (X: number[][], y: number[], lambda: number) => {
        const d = X[0].length;
        const A = Array.from({ length: d }, (_, j) => [
            ...Array.from({ length: d }, (_, k) => X.reduce((s, row) => s + row[j] * row[k], 0) + (j === k ? lambda : 0)),
            X.reduce((s, row, i) => s + row[j] * y[i], 0)
        ]);
        for (let i = 0; i < d; i++) {
            for (let r = 0; r < d; r++) {
                if (r === i) continue;
                const f = A[r][i] / A[i][i];
                for (let c = i; c <= d; c++) A[r][c] -= f * A[i][c];
            }
        }
        return A.map((row, j) => row[d] / row[j]);
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new LogarithmicAxis(wasmContext, { axisTitle: "λ", logBase: 10 }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Standardised coefficient" }));

        const { X, y, featureNames } = getYourStandardisedData(); // features scaled to mean 0, sd 1; y centred
        const lambdas = Array.from({ length: 61 }, (_, i) => 10 ** (-4 + i / 10)); // 0.0001 to 100
        const fits = lambdas.map((lambda) => ridgeCoefficients(X, y, lambda));
        featureNames.forEach((name, j) => {
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: lambdas, yValues: fits.map((b) => b[j]), dataSeriesName: name }),
                    stroke: PATH_COLOURS[j % PATH_COLOURS.length],
                    strokeThickness: 2
                })
            );
        });
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const RidgePathChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const PATH_COLOURS = ["#EC5151", "#ECC051", "#72EC51", "#51ECD4", "#5194EC", "#B551EC", "#EC51EC"]; // one per feature

    // Ridge coefficients for standardised features X and centred y: solve (XᵀX + λI) b = Xᵀy
    const ridgeCoefficients = (X: number[][], y: number[], lambda: number) => {
        const d = X[0].length;
        const A = Array.from({ length: d }, (_, j) => [
            ...Array.from({ length: d }, (_, k) => X.reduce((s, row) => s + row[j] * row[k], 0) + (j === k ? lambda : 0)),
            X.reduce((s, row, i) => s + row[j] * y[i], 0)
        ]);
        for (let i = 0; i < d; i++) {
            for (let r = 0; r < d; r++) {
                if (r === i) continue;
                const f = A[r][i] / A[i][i];
                for (let c = i; c <= d; c++) A[r][c] -= f * A[i][c];
            }
        }
        return A.map((row, j) => row[d] / row[j]);
    };

    @Component({
        selector: "app-ridge-path-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class RidgePathChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new LogarithmicAxis(wasmContext, { axisTitle: "λ", logBase: 10 }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Standardised coefficient" }));

            const { X, y, featureNames } = getYourStandardisedData(); // features scaled to mean 0, sd 1; y centred
            const lambdas = Array.from({ length: 61 }, (_, i) => 10 ** (-4 + i / 10)); // 0.0001 to 100
            const fits = lambdas.map((lambda) => ridgeCoefficients(X, y, lambda));
            featureNames.forEach((name, j) => {
                sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues: lambdas, yValues: fits.map((b) => b[j]), dataSeriesName: name }),
                        stroke: PATH_COLOURS[j % PATH_COLOURS.length],
                        strokeThickness: 2
                    })
                );
            });
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

- λ runs on a `LogarithmicAxis` with `logBase: 10`, so the grid of λ values, spaced evenly in powers of ten, plots evenly. Its `labelProvider.formatLabel` is overridden to print 0.01, 1 or 1e-3 rather than the default format.
- Each coefficient path, the fitted curve and each error curve is a `FastLineRenderableSeries` over an `XyDataSeries`; the training points are an `XyScatterRenderableSeries` with an `EllipsePointMarker`.
- The current λ is a `VerticalLineAnnotation` with `isEditable: true`; its `dragDelta` event sets the slider and refits the model.
- The fitted curve's legend name, set through `dataSeriesName`, shows the method, degree and λ, so a screenshot records the settings.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart), and for the training points, [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [logarithmic axis documentation](/2d-charts/axis-api/axis-types/logarithmic-axis/) for the λ axis, the [residual plot guide](/learn/chart-types/cartesian/residual-plot/) for checking the chosen model, and the [ROC curve guide](/learn/applications/machine-learning/roc-curve/) for evaluating classifiers.

## Frequently asked questions

### What is the difference between ridge and lasso regression?

Both add a penalty on the size of the coefficients to the least squares fit. Ridge regression penalises the sum of the squared coefficients (an L2 penalty), which shrinks every coefficient towards zero but keeps them all in the model. Lasso regression penalises the sum of their absolute values (an L1 penalty), which shrinks them too but sets some exactly to zero, so it also selects features. Ridge copes better with groups of correlated features; lasso gives a smaller model that is easier to explain.

### What is the difference between overfitting and underfitting?

An underfitted model is too simple to capture the pattern, so it makes large errors on the training data and on new data alike: a straight line through curved data is the classic case. An overfitted model is so flexible that it learns the noise in the training data as well as the pattern, so its training error is very low but its error on new data is much higher. Regularization, fewer features and more data all reduce overfitting.

### What does lambda do in ridge and lasso regression?

Lambda sets how strongly the penalty counts against the fit. At lambda = 0 the model is ordinary least squares. As lambda grows, the coefficients shrink towards zero, the fitted curve becomes smoother, the training error rises and the variance of the model falls. Very large values shrink everything and the model underfits. The best value is usually chosen by cross-validation, and it depends on how the penalty is scaled, so values are not comparable between libraries.

### Why does lasso set coefficients to zero but ridge does not?

The L1 penalty has a kink at zero. For a single coefficient, the lasso solution is the least squares value moved towards zero by a fixed amount, and it stops at exactly zero if the value is smaller than that amount. Ridge divides each value by a factor greater than one, which never reaches zero. Geometrically, the lasso constraint is a diamond with corners on the axes, and the error contours usually first touch it at a corner, where some coefficients are zero; the ridge constraint is a circle with no corners.

### How do you choose lambda with cross-validation?

Split the training data into k folds, often 5 or 10. For each value on a grid of lambdas, fit the model k times, each time leaving one fold out and measuring the error on it, and average the k errors. Plot the average against lambda on a log scale: this validation curve is usually U-shaped. Pick the lambda at its minimum, or the largest lambda within one standard error of the minimum for a simpler model, then refit on all the training data and check it once on a held-out test set.

### How do I plot ridge and lasso coefficient paths in JavaScript?

Standardise the features, then fit the model at each lambda on a grid spaced evenly on a log scale, from a value that shrinks every coefficient to near zero down to a very small one. Store each coefficient as a series of (lambda, value) points and draw one line per coefficient on a logarithmic x-axis. SciChart.js does this with FastLineRenderableSeries, XyDataSeries and LogarithmicAxis, in plain JavaScript, React or Angular, and a VerticalLineAnnotation marks the chosen lambda.

## Sources

- Hoerl, A. E. and Kennard, R. W. (1970), [Ridge regression: biased estimation for nonorthogonal problems](https://doi.org/10.1080/00401706.1970.10488634). *Technometrics*, 12(1), 55–67.
- Tibshirani, R. (1996), [Regression shrinkage and selection via the lasso](https://doi.org/10.1111/j.2517-6161.1996.tb02080.x). *Journal of the Royal Statistical Society, Series B*, 58(1), 267–288.
- Zou, H. and Hastie, T. (2005), [Regularization and variable selection via the elastic net](https://doi.org/10.1111/j.1467-9868.2005.00503.x). *Journal of the Royal Statistical Society, Series B*, 67(2), 301–320.
- Hastie, T., Tibshirani, R. and Friedman, J. (2009), [*The Elements of Statistical Learning*](https://hastie.su.domains/ElemStatLearn/), 2nd edition, Springer. Ridge and lasso (section 3.4), the bias–variance decomposition (7.3), cross-validation and the one-standard-error rule (7.10).
- Friedman, J., Hastie, T. and Tibshirani, R. (2010), [Regularization paths for generalized linear models via coordinate descent](https://doi.org/10.18637/jss.v033.i01). *Journal of Statistical Software*, 33(1), 1–22.
- Lee, H., Battle, A., Raina, R. and Ng, A. Y. (2007), [Efficient sparse coding algorithms](https://proceedings.neurips.cc/paper/2006/hash/2d71b2ae158c7c5912cc0bbde2bb9d95-Abstract.html). *Advances in Neural Information Processing Systems 19*. The feature-sign search the demo uses to finish each lasso fit exactly.
- Loshchilov, I. and Hutter, F. (2019), [Decoupled weight decay regularization](https://arxiv.org/abs/1711.05101). *International Conference on Learning Representations (ICLR 2019)*. Why weight decay and an L2 penalty differ under Adam.
- scikit-learn, [Linear models: ridge, lasso and elastic net](https://scikit-learn.org/stable/modules/linear_model.html), for how one widely used library scales the penalty.

<LearnCta position="bottom" chart="regularization plot" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
