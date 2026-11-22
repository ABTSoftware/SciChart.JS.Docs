---
sidebar_position: 80
sidebar_label: ROC Curve
title: "ROC and Precision-Recall Curves: How to Read Them and What AUC Means"
description: "What a ROC curve is, how it is built from a confusion matrix by sweeping the threshold, what AUC means, when to use a precision-recall curve instead, and how to choose a threshold. With a live example."
keywords:
    [
        "roc curve",
        "f1 score",
        "precision and recall",
        "roc auc",
        "auc roc curve",
        "what is a roc curve",
        "how to read a roc curve",
        "roc curve explained",
        "area under the roc curve",
        "precision recall curve",
        "average precision",
        "precision vs recall",
        "confusion matrix",
        "sensitivity and specificity",
        "true positive rate vs false positive rate",
        "roc curve vs precision recall curve",
        "youden index"
    ]
image: /img/learn/roc-curve-og.png
related: [decision-boundary, anomaly-detection, residual-plot, correlation-matrix]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a ROC curve show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A ROC curve shows how well a classifier separates two classes at every possible decision threshold. Each point is one threshold: its height is the share of real positives the model catches (the true positive rate) and its distance from the left is the share of negatives it wrongly flags (the false positive rate). A curve that rises steeply towards the top-left corner belongs to a model that ranks positives above negatives." }
                },
                {
                    "@type": "Question",
                    "name": "What is a good AUC score?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An AUC of 0.5 means the model ranks cases no better than chance, and 1.0 means it ranks every positive above every negative. A widely quoted rule of thumb from Hosmer and Lemeshow calls 0.7 to 0.8 acceptable, 0.8 to 0.9 excellent and 0.9 or more outstanding. What counts as good depends on the task and on the baseline you are trying to beat, and a high AUC can still hide poor precision when positives are rare." }
                },
                {
                    "@type": "Question",
                    "name": "When should I use a precision-recall curve instead of a ROC curve?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a precision-recall curve when the positive class is rare and you care mainly about the cases the model flags, as in fraud detection, screening or information retrieval. The false positive rate on a ROC curve divides by the large number of negatives, so thousands of false alarms barely move it, while precision drops sharply. When the classes are roughly balanced and both kinds of error matter, the ROC curve is the standard choice." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between sensitivity and specificity?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sensitivity is the share of real positives that a test or model correctly flags as positive: TP / (TP + FN). It is the same as recall and the true positive rate. Specificity is the share of real negatives correctly cleared as negative: TN / (TN + FP). The false positive rate on a ROC curve is 1 minus the specificity. Lowering the threshold raises sensitivity and lowers specificity." }
                },
                { "@type": "Question", "name": "What is the F1 score?", "acceptedAnswer": { "@type": "Answer", "text": "The F1 score is the harmonic mean of precision and recall, 2PR / (P + R). It is high only when both are high, ignores true negatives, and depends on the threshold you choose. Use it to compare models at one operating point when positives are rare; use the precision-recall curve to see every threshold at once." } },
                {
                    "@type": "Question",
                    "name": "Can AUC be below 0.5?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. An AUC below 0.5 means the model ranks negatives above positives more often than the reverse. On a test set it is usually a bug, such as swapped labels or a score that rises for the wrong class, or chance when the model has no skill and the test set is small. Reversing the scores of a model with an AUC of 0.3 gives an AUC of 0.7." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a ROC curve in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sort the test cases by score from highest to lowest, then walk down the list counting true and false positives. After each distinct score, add a point at (false positive rate, true positive rate), and sum the trapezoids under the points for the AUC. Draw the points as a line series from (0, 0) to (1, 1) with a dashed diagonal for chance. SciChart.js draws it with a FastLineRenderableSeries over an XyDataSeries, and its React and Angular wrappers take the same code." }
                }
            ]
        })}
    </script>
</head>

# ROC Curve

## What is a ROC curve?

A **ROC curve** (receiver operating characteristic curve) is a chart of how well a binary classifier separates two classes. It plots the true positive rate against the false positive rate at every decision threshold. The area under it, the **AUC**, sums the curve up as one number from 0 to 1, where 0.5 is chance and 1 is perfect.

![Three charts of a simulated classifier in a dark navy theme: overlapping score histograms of negative and positive cases with a dashed threshold line, a ROC curve bowing towards the top-left corner above a dashed diagonal, with its area under the curve in the legend, a precision-recall curve that falls from the top-left towards a low dashed baseline, and the confusion matrix at the threshold](/img/learn/roc-curve-og.png)

*Score histograms, confusion matrix, ROC curve and precision-recall curve for a simulated classifier with 5% positives (sample data). [Try the interactive version](#how-to-plot-a-roc-curve-in-javascript-react-or-angular).*

:::tip Key takeaways
- Each point on a ROC curve is one threshold, turned into a confusion matrix and then into two rates: true positives caught and false alarms raised.
- AUC is the probability that a randomly chosen positive gets a higher score than a randomly chosen negative.
- The diagonal is a model with no skill. A curve below it has its scores the wrong way round.
- With rare positives, the precision-recall curve and average precision show problems the ROC curve hides.
- AUC judges the ranking. A deployed model also needs a threshold, chosen from the costs of each kind of error.
:::

## Classifiers, scores and the decision threshold

A **binary classifier** sorts cases into two classes: spam or not spam, fraud or genuine, disease present or absent. By convention the class you are looking for is the **positive** class, whatever it means in real life.

Most classifiers don't output a yes or a no. They output a **score**, often a probability between 0 and 1, and a **threshold** turns it into a decision: a score at or above the threshold means "positive". Raise the threshold and the model flags fewer cases, missing more real positives but raising fewer false alarms. Lower it and the reverse happens.

A single accuracy figure describes the model at one threshold only. A ROC curve shows all of them at once, so you can judge the model's ranking separately from where you set the cut-off.

## The confusion matrix

At any threshold, every case falls into one of four boxes. The table that counts them is the **confusion matrix**:

|  | Predicted positive | Predicted negative |
| --- | --- | --- |
| Actually positive | True positive (TP) | False negative (FN), a miss |
| Actually negative | False positive (FP), a false alarm | True negative (TN) |

Take ten test cases, four positive and six negative, with these model scores (the same cases are used throughout this page):

| Case | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Score | 0.95 | 0.80 | 0.70 | 0.60 | 0.50 | 0.40 | 0.35 | 0.25 | 0.15 | 0.10 |
| Actual class | + | + | − | + | − | − | + | − | − | − |

At a threshold of 0.5, cases 1 to 5 are predicted positive. Three of them are real positives and two are not, and one positive (case 7) is missed:

|  | Predicted + | Predicted − |
| --- | --- | --- |
| Actual + | TP = 3 | FN = 1 |
| Actual − | FP = 2 | TN = 4 |

### Sensitivity, specificity, precision and recall

The ROC and precision-recall curves are built from four ratios of those counts:

| Rate | Also called | Formula | At threshold 0.5 |
| --- | --- | --- | --- |
| True positive rate (TPR) | Recall, sensitivity, hit rate | $\dfrac{TP}{TP + FN}$ | 3 / 4 = 0.75 |
| False positive rate (FPR) | Fall-out, 1 − specificity | $\dfrac{FP}{FP + TN}$ | 2 / 6 = 0.33 |
| Specificity | True negative rate | $\dfrac{TN}{TN + FP}$ | 4 / 6 = 0.67 |
| Precision | Positive predictive value | $\dfrac{TP}{TP + FP}$ | 3 / 5 = 0.60 |

The ROC curve plots TPR against FPR. The precision-recall curve plots precision against recall (which is TPR again). Accuracy, (TP + TN) / total, is 0.70 here.

### Precision vs recall

Recall answers "of all the real positives, how many did we catch?". Precision answers "of everything we flagged, how much was real?". Recall divides by the actual positives; precision divides by the predicted positives. A spam filter that lets some spam through has low recall; one that sends real mail to the spam folder has low precision.

Lowering the threshold usually raises recall and lowers precision. The F1 score combines the two into one number.

### F1 score

The **F1 score** is the harmonic mean of precision $P$ and recall $R$:

$$
F_1 = \frac{2PR}{P + R} = \frac{2\,TP}{2\,TP + FP + FN}
$$

At a threshold of 0.5 the example has $P = 0.60$ and $R = 0.75$, so $F_1 = 2 \times 0.60 \times 0.75 / 1.35 = 0.67$. The harmonic mean punishes imbalance between the two: a model with precision 1.0 and recall 0.01 has an arithmetic mean of 0.505 but an F1 of only 0.02.

F1 depends on the threshold. For the ten cases:

| Threshold | Predicted positive | TP | FP | FN | Precision | Recall | F1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.70 | cases 1–3 | 2 | 1 | 2 | 0.67 | 0.50 | 0.57 |
| 0.60 | cases 1–4 | 3 | 1 | 1 | 0.75 | 0.75 | 0.75 |
| 0.50 | cases 1–5 | 3 | 2 | 1 | 0.60 | 0.75 | 0.67 |
| 0.35 | cases 1–7 | 4 | 3 | 0 | 0.57 | 1.00 | 0.73 |

The best F1 here is at 0.60. Two things to know when you use it:

- F1 ignores true negatives, so it says nothing about how well the model rejects negatives. That suits rare-positive problems, and it is why the precision-recall curve, not the ROC curve, is its natural companion.
- When recall matters more than precision (or the other way round), use the $F_\beta$ score, $(1 + \beta^2) PR / (\beta^2 P + R)$: $\beta = 2$ weights recall twice as heavily, $\beta = 0.5$ favours precision.

## How a ROC curve is built: a worked example

To draw the curve, sweep the threshold down through every score and compute TPR and FPR at each step. Each case you pass moves the curve up by 1/P if it is positive (here 1/4) or right by 1/N if it is negative (1/6):

![Two score distributions, negatives on the left and positives on the right, overlapping in the middle, with a vertical threshold line. Right of the line, positives are shaded as true positives and negatives as false positives; left of the line, positives are false negatives and negatives true negatives. An arrow shows that moving the threshold left raises both the true and false positive rates](./roc-threshold-sweep.svg)

| Threshold (score ≥) | TP | FP | TPR | FPR | Precision | Youden's J |
| --- | --- | --- | --- | --- | --- | --- |
| Above 0.95 | 0 | 0 | 0 | 0 | – | 0 |
| 0.95 | 1 | 0 | 0.25 | 0 | 1.00 | 0.25 |
| 0.80 | 2 | 0 | 0.50 | 0 | 1.00 | 0.50 |
| 0.70 | 2 | 1 | 0.50 | 0.17 | 0.67 | 0.33 |
| 0.60 | 3 | 1 | 0.75 | 0.17 | 0.75 | 0.58 |
| 0.50 | 3 | 2 | 0.75 | 0.33 | 0.60 | 0.42 |
| 0.40 | 3 | 3 | 0.75 | 0.50 | 0.50 | 0.25 |
| 0.35 | 4 | 3 | 1.00 | 0.50 | 0.57 | 0.50 |
| 0.25 | 4 | 4 | 1.00 | 0.67 | 0.50 | 0.33 |
| 0.15 | 4 | 5 | 1.00 | 0.83 | 0.44 | 0.17 |
| 0.10 | 4 | 6 | 1.00 | 1.00 | 0.40 | 0 |

Plot the (FPR, TPR) pairs and join them: the curve starts at (0, 0), where nothing is flagged, and ends at (1, 1), where everything is. With few cases it is a staircase. With thousands it looks smooth, as in the demo. Two cases with the same score are passed together, which gives a diagonal step.

The area under this staircase is 0.833. You can get it two ways: by adding up the trapezoids under the points, or by counting pairs, as the next sections show.

## How to read a ROC curve

![An annotated ROC curve: the false positive rate from 0 to 1 along the bottom and the true positive rate from 0 to 1 up the side. Callout 1 marks the dashed diagonal of a model with no skill, callout 2 the top-left corner of a perfect model, callout 3 a curve bowing towards that corner with the area under it shaded and labelled AUC 0.90, callout 4 one point on the curve marked as the operating point for a chosen threshold, with its vertical distance to the diagonal labelled Youden's J, and callout 5 a lower curve labelled as a weaker model](./roc-curve-anatomy.svg)

1. The axes. The false positive rate runs left to right and the true positive rate bottom to top, both from 0 to 1. The threshold itself is not on an axis: it falls as you move along the curve from bottom left to top right.
2. The diagonal. A model that guesses at random flags positives and negatives at the same rate, so TPR equals FPR at every threshold. It is the baseline to beat.
3. The top-left corner. TPR 1 and FPR 0 is a perfect classifier: every positive caught, no false alarms. The closer the curve bows towards it, the better the model ranks.
4. The steepness at the start. A curve that climbs straight up from the origin means the highest scores are almost all real positives. That matters when you can only act on a few cases, such as the top 1% of alerts.
5. A point on the curve. Each point is one threshold, with one confusion matrix. Reading off a point gives you the trade-off you would get if you deployed the model there.
6. Two curves. If one curve is above the other everywhere, that model is better at every threshold. If they cross, each is better in a different region.

## What AUC means

The **area under the ROC curve** (AUC, or ROC AUC) has a direct meaning: it is the probability that the model gives a randomly chosen positive a higher score than a randomly chosen negative, with ties counting half. Hanley and McNeil showed this equals the Wilcoxon–Mann–Whitney statistic.

$$
\text{AUC} = P(s_{+} > s_{-}) + \tfrac{1}{2}P(s_{+} = s_{-})
$$

In the worked example there are 4 × 6 = 24 positive–negative pairs. The positive scored 0.95 beats all 6 negatives, 0.80 beats 6, 0.60 beats 5 (not 0.70) and 0.35 beats 3. That is 20 of 24 pairs, or 0.833, the same as the area under the staircase.

| AUC | What it means |
| --- | --- |
| 1.0 | Every positive scores above every negative |
| 0.9 or more | Outstanding discrimination (Hosmer and Lemeshow's rule of thumb) |
| 0.8 to 0.9 | Excellent |
| 0.7 to 0.8 | Acceptable |
| 0.5 | No better than chance: the diagonal |
| Below 0.5 | Worse than chance: the scores are probably reversed |

Because AUC only depends on the order of the scores, it doesn't change if you rescale them, and it says nothing about whether a score of 0.8 really means an 80% chance. In credit scoring, the same quantity is often reported as the **Gini coefficient**, 2 × AUC − 1.

## The precision-recall curve

A **precision-recall curve** (PR curve) plots precision against recall as the threshold sweeps from high to low. It starts at the top left, where the few cases flagged are mostly correct, and falls as the threshold drops and more negatives get through.

Its no-skill baseline is a flat line: a model that guesses has a precision equal to the share of positives in the data, the **prevalence**, at every recall. With 5% positives, the no-skill line is flat at 0.05, and that is the level the model must beat.

The usual summary is **average precision** (AP), the precision at each threshold weighted by how much recall rose since the previous one:

$$
\text{AP} = \sum_n (R_n - R_{n-1})\, P_n
$$

For the ten cases, recall rises by 0.25 at the four positives, where precision is 1, 1, 0.75 and 0.57, so AP = 0.25 × (1 + 1 + 0.75 + 0.571) = 0.830. AP is close to the area under the PR curve, but it avoids drawing straight lines between PR points, which overstates the area: Davis and Goadrich showed that interpolation in PR space is not linear.

### Why imbalance changes the picture

Suppose 1% of 100,000 transactions are fraud. A model that catches 900 of the 1,000 frauds (TPR 0.90) and flags 2% of the 99,000 genuine ones (FPR 0.02) looks excellent on a ROC curve. But 2% of 99,000 is 1,980 false alarms, so only 900 of 2,880 flagged cases are fraud: a precision of 0.31. The FPR divides by the huge number of negatives, which hides the false alarms; precision doesn't. Saito and Rehmsmeier found that PR plots describe performance on imbalanced data more informatively than ROC plots.

## ROC curve vs precision-recall curve

The two curves use the same confusion matrices and rank models the same way when one dominates the other (Davis and Goadrich proved a curve dominates in ROC space exactly when it dominates in PR space). They differ in what they make visible.

| Chart or metric | Plots or measures | Baseline (no skill) | Best for | Watch out for |
| --- | --- | --- | --- | --- |
| ROC curve and AUC | TPR against FPR | Diagonal, AUC 0.5 | Balanced classes; comparing rankings; when both errors matter | Looks good even when most alarms are false, if positives are rare |
| Precision-recall curve and AP | Precision against recall | Flat line at the prevalence | Rare positives: fraud, screening, search, defect detection | AP isn't comparable between datasets with different prevalence |
| Accuracy | (TP + TN) / total at one threshold | Share of the majority class | Quick check on balanced data | With 1% positives, "always negative" scores 99% |
| F1 score | Harmonic mean of precision and recall at one threshold | Depends on prevalence | One operating point when positives are rare | Ignores true negatives; depends on the threshold |
| Detection error tradeoff (DET) curve | Miss rate against FPR on normal-deviate scales | Straight line | Comparing very good systems, such as speaker or biometric verification | Less familiar to most readers |

Reporting both is often the clearest choice: ROC AUC for the ranking, and the PR curve or AP for what the people acting on the alerts will see.

## Choosing a threshold

The curve shows the options; a deployed model needs one point on it. Common ways to choose:

- **Youden's J**, $J = \text{TPR} - \text{FPR}$ (sensitivity + specificity − 1), is the vertical distance from the diagonal. Its maximum treats a miss and a false alarm as equally bad. In the worked example it peaks at 0.58 at a threshold of 0.60.
- Cost-based. If a false positive costs $C_{FP}$ and a false negative costs $C_{FN}$, and there are P positives and N negatives, the cheapest point is where the curve's slope equals $\frac{N}{P} \cdot \frac{C_{FP}}{C_{FN}}$. When misses are expensive (a missed cancer), the slope is shallow and the point sits high and to the right; when false alarms are expensive, it sits low and to the left.
- A fixed requirement. Many uses set one rate and maximise the other: at least 95% sensitivity for a screening test, or a false positive rate below 1 in 1,000 for an alarm.
- Capacity. If a team can review 200 alerts a day, the threshold is the score of the 200th case.

The best threshold depends on the prevalence where the model is deployed, not only on the test set. A threshold tuned on balanced test data will flag too many cases in a population where positives are rare.

## Comparing models with ROC curves

Draw the curves on the same axes before comparing AUCs. When one curve is above the other everywhere, the choice is easy. When they cross, the AUCs can be equal while the models behave very differently at the thresholds you would use. In the live demo, model B has almost the same AUC as model A (0.885 against 0.890 at the default settings), but its positives are more spread out, so its highest scores are purer: at 5% positives its average precision is 0.72 against A's 0.42.

Tools for a fairer comparison:

- Partial AUC: the area over only the FPR range you would use, for example 0 to 0.1.
- A significance test. Two AUCs measured on the same test cases are correlated; DeLong's test accounts for that. A difference of 0.01 on a few hundred cases is often noise.
- Confidence intervals by bootstrapping: resample the test cases, recompute the curve and AUC many times, and draw the band.

## ROC curves and calibration

A ROC curve measures **discrimination**, how well the model ranks cases. It says nothing about **calibration**, whether the scores mean what they say: among cases scored 0.8, are 80% positive? A model can have an AUC of 0.95 and still be badly calibrated, because squeezing or stretching the scores doesn't change their order. If you use the scores as probabilities, to estimate risk or expected cost, check a calibration (reliability) curve as well, and recalibrate if needed, for example with Platt scaling or isotonic regression.

## Where ROC curves are used

ROC curves are used wherever a yes/no decision trades missed cases against false alarms.

- Radar and signal detection. ROC analysis began with radar operators in the Second World War, judging how well they could tell aircraft from noise. Psychology adopted it as signal detection theory.
- Medical diagnostic tests. ROC curves compare tests and set cut-offs, for example the level of a blood marker above which a test counts as positive, trading sensitivity against specificity. This page explains how the curves are drawn and read; it is not clinical guidance. See how SciChart is used for [diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/) software.
- Machine learning. ROC AUC and average precision are standard ways to evaluate classifiers, from spam filters to image classifiers.
- Credit scoring and fraud detection. Lenders report AUC or the Gini coefficient for scorecards; fraud teams lean on precision-recall because fraud is rare.
- Industrial inspection. Defect detectors and alarm systems trade missed faults against false alarms that waste engineers' time.

## Common ROC curve mistakes

Most ROC mistakes come from trusting AUC alone: on rare positives, at a deployed threshold, or on data that leaked into training.

- **Trusting AUC when positives are rare.** In the [live demo](#how-to-plot-a-roc-curve-in-javascript-react-or-angular), with a class separation of 2.3 and 1% positives, the AUC is 0.95, yet the average precision is 0.42 and at the best Youden threshold only about 1 flagged case in 20 is a real positive. Moving the positive rate from 5% to 1% at the default separation barely changes the AUC (0.89 to 0.91) but halves the AP (0.42 to 0.23). Check the precision-recall curve, or the precision at the threshold you will deploy.
- **Quoting a threshold-free metric for a deployed model.** AUC averages over every threshold, including ones you would never use. Report the sensitivity, specificity and precision at the chosen threshold as well.
- **Evaluating on leaked data.** Scaling, feature selection or threshold tuning done on the whole dataset before splitting, duplicates of the same patient or customer in training and test sets, or features recorded after the outcome, all inflate the curve. Fit every step on training data only.
- **Choosing the threshold on the test set.** Tune it on a validation set, then report the result on held-out data.
- **Comparing AUCs without the curves.** Equal AUCs can hide curves that cross, and a small difference may not be significant.
- **Drawing a smooth curve from a handful of cases.** With 20 positives, each positive moves the curve up by 0.05. Show the steps, and give a confidence interval.
- **Comparing AP across datasets.** The PR baseline is the prevalence, so an AP of 0.4 is strong at 1% positives and weak at 30%.
- **Forgetting which class is positive.** Swapping the labels, or using the score for the wrong class, mirrors the curve below the diagonal.

## How to plot a ROC curve in JavaScript, React or Angular

The demo simulates 5,000 test cases scored by two models, builds both curves in the browser, and recomputes the confusion matrix as you drag the threshold.

Drag the **Threshold** slider, or the dashed line on the histogram, to move the marker along both curves and update the confusion matrix and its rates. **Class separation** sets how far apart the two score distributions are, and **Positive rate** sets the share of positives, from 50% to 1%. **Best Youden's J** jumps to the threshold that maximises TPR − FPR, and **Compare model B** adds a second model with almost the same AUC but a different shape. **Histogram** switches between the share of each class and raw counts, which shows how small the positive class becomes at 1%. Hover for values, zoom with the mouse wheel, drag to pan and double-click to see everything again.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="ROC curve" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The ROC, AUC, precision-recall and confusion-matrix maths are plain JavaScript; SciChart.js draws the histograms as step mountain series, the curves as line series and the operating points as scatter markers.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastLineRenderableSeries,
        XyDataSeries,
        LegendModifier,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // ROC points and AUC from scores and 0/1 labels: sort by score, then sweep the threshold down
    const rocCurve = (scores: number[], labels: number[]) => {
        const order = scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
        const positives = labels.filter((y) => y === 1).length;
        const negatives = labels.length - positives;
        const fpr = [0], tpr = [0];
        let tp = 0, fp = 0, auc = 0;
        order.forEach((i, k) => {
            labels[i] === 1 ? tp++ : fp++;
            if (k + 1 < order.length && scores[order[k + 1]] === scores[i]) return; // keep ties together
            const x = fp / negatives, y = tp / positives;
            auc += ((x - fpr[fpr.length - 1]) * (y + tpr[tpr.length - 1])) / 2;
            fpr.push(x);
            tpr.push(y);
        });
        return { fpr, tpr, auc };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "False positive rate", visibleRange: new NumberRange(0, 1) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "True positive rate", visibleRange: new NumberRange(0, 1) }));

        const { scores, labels } = getYourTestSetScores(); // model scores and true labels (1 = positive)
        const { fpr, tpr, auc } = rocCurve(scores, labels);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: [0, 1], yValues: [0, 1], dataSeriesName: "No skill" }),
                stroke: "#C8D3E8",
                strokeDashArray: [6, 4]
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: fpr, yValues: tpr, dataSeriesName: `Model (AUC ${auc.toFixed(3)})` }),
                stroke: "#3BD16F",
                strokeThickness: 2.5
            })
        );
        sciChartSurface.chartModifiers.add(
            new LegendModifier({ showCheckboxes: false }),
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const RocCurveChart = () => (
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
        FastLineRenderableSeries,
        XyDataSeries,
        LegendModifier,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // ROC points and AUC from scores and 0/1 labels: sort by score, then sweep the threshold down
    const rocCurve = (scores: number[], labels: number[]) => {
        const order = scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
        const positives = labels.filter((y) => y === 1).length;
        const negatives = labels.length - positives;
        const fpr = [0], tpr = [0];
        let tp = 0, fp = 0, auc = 0;
        order.forEach((i, k) => {
            labels[i] === 1 ? tp++ : fp++;
            if (k + 1 < order.length && scores[order[k + 1]] === scores[i]) return; // keep ties together
            const x = fp / negatives, y = tp / positives;
            auc += ((x - fpr[fpr.length - 1]) * (y + tpr[tpr.length - 1])) / 2;
            fpr.push(x);
            tpr.push(y);
        });
        return { fpr, tpr, auc };
    };

    @Component({
        selector: "app-roc-curve-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class RocCurveChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "False positive rate", visibleRange: new NumberRange(0, 1) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "True positive rate", visibleRange: new NumberRange(0, 1) }));

            const { scores, labels } = getYourTestSetScores(); // model scores and true labels (1 = positive)
            const { fpr, tpr, auc } = rocCurve(scores, labels);
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: [0, 1], yValues: [0, 1], dataSeriesName: "No skill" }),
                    stroke: "#C8D3E8",
                    strokeDashArray: [6, 4]
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: fpr, yValues: tpr, dataSeriesName: `Model (AUC ${auc.toFixed(3)})` }),
                    stroke: "#3BD16F",
                    strokeThickness: 2.5
                })
            );
            sciChartSurface.chartModifiers.add(
                new LegendModifier({ showCheckboxes: false }),
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

- Each curve is a `FastLineRenderableSeries` over an `XyDataSeries` of (FPR, TPR) or (recall, precision) points. Both axes are fixed from 0 to 1, so curves from different models and settings stay comparable.
- The diagonal and the precision-recall baseline are ordinary line series with `strokeDashArray`, so they appear in the legend; the model's AUC and AP go into each `dataSeriesName`.
- The score histograms are `FastMountainRenderableSeries` with `isDigitalLine: true`, which draws each bin as a flat step. The threshold is a `VerticalLineAnnotation` with `isEditable: true`; its `dragDelta` event moves the slider and the markers.
- The operating points are `XyScatterRenderableSeries` with an `EllipsePointMarker`, left out of the legend and tooltip with `includeSeries(series, false)`.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart), and for draggable threshold lines, [JavaScript draggable threshold chart](https://www.scichart.com/demo/javascript/chart-drag-horizontal-threshold) · [React draggable threshold chart](https://www.scichart.com/demo/react/chart-drag-horizontal-threshold) · [Angular draggable threshold chart](https://www.scichart.com/demo/angular/chart-drag-horizontal-threshold).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [mountain (area) series documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/) for the histograms, and the [histogram guide](/learn/chart-types/cartesian/histogram/). For how diagnostic and laboratory software uses SciChart, see [SciChart for diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

## Frequently asked questions

### What does a ROC curve show?

A ROC curve shows how well a classifier separates two classes at every possible decision threshold. Each point is one threshold: its height is the share of real positives the model catches (the true positive rate) and its distance from the left is the share of negatives it wrongly flags (the false positive rate). A curve that rises steeply towards the top-left corner belongs to a model that ranks positives above negatives.

### What is a good AUC score?

An AUC of 0.5 means the model ranks cases no better than chance, and 1.0 means it ranks every positive above every negative. A widely quoted rule of thumb from Hosmer and Lemeshow calls 0.7 to 0.8 acceptable, 0.8 to 0.9 excellent and 0.9 or more outstanding. What counts as good depends on the task and on the baseline you are trying to beat, and a high AUC can still hide poor precision when positives are rare.

### When should I use a precision-recall curve instead of a ROC curve?

Use a precision-recall curve when the positive class is rare and you care mainly about the cases the model flags, as in fraud detection, screening or information retrieval. The false positive rate on a ROC curve divides by the large number of negatives, so thousands of false alarms barely move it, while precision drops sharply. When the classes are roughly balanced and both kinds of error matter, the ROC curve is the standard choice.

### What is the difference between sensitivity and specificity?

Sensitivity is the share of real positives that a test or model correctly flags as positive: TP / (TP + FN). It is the same as recall and the true positive rate. Specificity is the share of real negatives correctly cleared as negative: TN / (TN + FP). The false positive rate on a ROC curve is 1 minus the specificity. Lowering the threshold raises sensitivity and lowers specificity.

### What is the F1 score?

The F1 score is the harmonic mean of precision and recall, 2PR / (P + R). It is high only when both are high, ignores true negatives, and depends on the threshold you choose. Use it to compare models at one operating point when positives are rare; use the precision-recall curve to see every threshold at once.

### Can AUC be below 0.5?

Yes. An AUC below 0.5 means the model ranks negatives above positives more often than the reverse. On a test set it is usually a bug, such as swapped labels or a score that rises for the wrong class, or chance when the model has no skill and the test set is small. Reversing the scores of a model with an AUC of 0.3 gives an AUC of 0.7.

### How do I plot a ROC curve in JavaScript?

Sort the test cases by score from highest to lowest, then walk down the list counting true and false positives. After each distinct score, add a point at (false positive rate, true positive rate), and sum the trapezoids under the points for the AUC. Draw the points as a line series from (0, 0) to (1, 1) with a dashed diagonal for chance. SciChart.js draws it with a FastLineRenderableSeries over an XyDataSeries, and its React and Angular wrappers take the same code.

## Sources

- Fawcett, T. (2006), [An introduction to ROC analysis](https://doi.org/10.1016/j.patrec.2005.10.010). *Pattern Recognition Letters*, 27(8), 861–874. ROC space, building curves from scores, AUC, iso-cost lines and history.
- Saito, T. and Rehmsmeier, M. (2015), [The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets](https://doi.org/10.1371/journal.pone.0118432). *PLOS ONE*, 10(3), e0118432.
- Davis, J. and Goadrich, M. (2006), [The relationship between precision-recall and ROC curves](https://doi.org/10.1145/1143844.1143874). *Proceedings of the 23rd International Conference on Machine Learning*, 233–240. Dominance in both spaces, and why PR points can't be joined with straight lines.
- Hanley, J. A. and McNeil, B. J. (1982), [The meaning and use of the area under a receiver operating characteristic (ROC) curve](https://doi.org/10.1148/radiology.143.1.7063747). *Radiology*, 143(1), 29–36. AUC as the probability of ranking a positive above a negative.
- DeLong, E. R., DeLong, D. M. and Clarke-Pearson, D. L. (1988), [Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach](https://doi.org/10.2307/2531595). *Biometrics*, 44(3), 837–845.
- Youden, W. J. (1950), Index for rating diagnostic tests. *Cancer*, 3(1), 32–35.
- Hosmer, D. W. and Lemeshow, S. (2000), *Applied Logistic Regression*, 2nd edition, Wiley. Rule of thumb for AUC values.
- scikit-learn, [Metrics and scoring: classification metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics) (ROC, average precision, confusion matrix) and [probability calibration](https://scikit-learn.org/stable/modules/calibration.html).

<LearnCta position="bottom" chart="ROC curve" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
