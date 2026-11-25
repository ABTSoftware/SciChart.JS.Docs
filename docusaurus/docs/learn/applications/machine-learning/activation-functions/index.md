---
sidebar_position: 10
sidebar_label: Activation Functions
title: "Activation Functions: Sigmoid, Tanh, ReLU, GELU and Softmax"
description: "What an activation function is, why neural networks need one, and how sigmoid, tanh, ReLU, GELU, Swish and softmax compare: formulas, ranges, derivatives, vanishing gradients and how to choose."
keywords:
    [
        "activation function",
        "what is an activation function",
        "activation function in neural network",
        "softmax",
        "softmax activation function",
        "relu",
        "relu activation function",
        "sigmoid function",
        "sigmoid activation function",
        "tanh activation function",
        "leaky relu",
        "elu activation function",
        "gelu activation function",
        "swish activation function",
        "silu activation function",
        "softplus",
        "vanishing gradient",
        "dying relu",
        "softmax temperature"
    ]
image: /img/learn/activation-functions-og.png
related: [decision-boundary, regularization, roc-curve, line-chart]
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
                    "name": "What is an activation function in a neural network?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An activation function is the non-linear function applied to each unit's weighted sum of inputs before the result goes to the next layer. Without one, a neural network of any depth can only compute a linear function of its input, because stacked linear layers collapse into a single layer. ReLU, GELU, tanh and sigmoid are common choices for hidden layers, and sigmoid or softmax for the output." }
                },
                {
                    "@type": "Question",
                    "name": "Why is ReLU the most used activation function?",
                    "acceptedAnswer": { "@type": "Answer", "text": "ReLU, max(0, x), is cheap to compute and has a slope of exactly 1 for positive inputs, so it does not shrink the gradient as it passes back through many layers. That makes deep networks much easier to train than with sigmoid or tanh, which flatten out for large inputs. Its weakness is that a unit whose input is negative for every example stops learning, the dying ReLU problem." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between sigmoid and softmax?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sigmoid maps one score to a probability between 0 and 1, and is used for a single yes/no output or for each label when several labels can be true at once. Softmax maps a vector of scores to probabilities that add up to 1, and is used when each example belongs to exactly one of several classes. With two classes they give the same result, since softmax of (z1, z2) equals the sigmoid of z1 − z2." }
                },
                {
                    "@type": "Question",
                    "name": "What does temperature do in softmax?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Temperature divides every score before the softmax is applied. A temperature below 1 makes the distribution sharper, giving more of the probability to the top class, and as it approaches 0 softmax becomes a hard argmax. A temperature above 1 makes the distribution flatter, and very high temperatures give every class nearly the same probability. Language models use it to control how varied their sampled text is." }
                },
                {
                    "@type": "Question",
                    "name": "What is the vanishing gradient problem?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The vanishing gradient problem is when the error signal gets smaller and smaller as backpropagation carries it from the output back to the early layers, so those layers learn very slowly or not at all. It happens with saturating activations: the sigmoid's derivative is at most 0.25, so ten sigmoid layers can shrink the gradient to about a millionth. ReLU-family activations, careful initialisation, normalisation layers and residual connections reduce it." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot an activation function in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sample the input range, for example 801 points from −5 to 5, compute the function and its derivative at each point in plain JavaScript, and draw each as a line series, with the derivative dashed. SciChart.js does this with FastLineRenderableSeries and XyDataSeries in plain JavaScript, React or Angular, and adds zoom, pan and a tooltip so you can read values near the corners and flat regions." }
                }
            ]
        })}
    </script>
</head>

# Activation Functions

## What is an activation function?

An **activation function** is the non-linear function a neural network applies to each unit's weighted sum of inputs before passing it on. Common ones are sigmoid, tanh, ReLU, GELU and Swish in hidden layers, and sigmoid or softmax at the output. Without them, any stack of layers would compute only a straight-line (linear) function of its input.

![Four charts in a dark navy theme: sigmoid, tanh, ReLU and GELU curves drawn from x = −5 to 5; a column chart of softmax probabilities for three classes, cat, dog and bird, at 70.5%, 25.9% and 3.5%; a small neural network's output fitted to noisy points of a sine wave; and its training loss falling on a log scale](/img/learn/activation-functions-og.png)

*Activation curves, a softmax over three scores and a one-hidden-layer network fitted in the browser (sample data). [Try the interactive version](#how-to-plot-activation-functions-in-javascript-react-or-angular).*

:::tip Key takeaways
- A unit computes a weighted sum, then bends it with an activation function. Without that bend, stacked layers collapse into one linear layer.
- ReLU, max(0, x), is the usual default for hidden layers. GELU and Swish are smooth relatives used in transformers and recent image models.
- Sigmoid and tanh flatten out for large inputs, so their gradients shrink layer by layer in deep networks.
- Softmax turns a vector of scores into probabilities that sum to 1. It belongs in the output layer of a multi-class classifier.
- The output activation follows the task: sigmoid for yes/no, softmax for one class out of many, none (linear) for regression.
:::

## Why neural networks need non-linear activation functions

Each unit (or neuron) in a layer multiplies its inputs by weights, adds a bias and gets a single number, the **pre-activation** $z$. The activation function $f$ turns $z$ into the unit's output $a = f(z)$, which the next layer uses as an input.

![Diagram of one unit: three inputs multiplied by weights and summed with a bias into z, then bent by an activation function f into the output a, which goes to the next layer. Below, two linear layers y = 2x + 1 then z = 3y − 4 give the straight line z = 6x − 1, while the same layers with a ReLU between them give a line with a bend at x = −0.5](./activation-function-neuron.svg)

The weighted sum is linear, and a linear function of a linear function is still linear. Take two one-input layers, $y = 2x + 1$ followed by $z = 3y - 4$. Substituting gives $z = 6x - 1$: one straight line, so the second layer added nothing. The same holds for matrices of any size, since $W_2(W_1x + b_1) + b_2 = (W_2W_1)x + (W_2b_1 + b_2)$.

Put a ReLU between the layers and the result is $z = 3\max(0, 2x + 1) - 4$, a line with a bend at $x = -0.5$. Each unit adds a bend of its own, and enough bends can approximate any smooth curve. The universal approximation theorems make this precise: a network with one hidden layer and a non-polynomial activation can approximate any continuous function on a bounded range, given enough units (Leshno and colleagues, 1993). The theorems don't say how many units, or whether training will find the right weights.

## Common activation functions: formulas, ranges and derivatives

The derivative matters as much as the function. Training by backpropagation multiplies the error signal by $f'(z)$ at every unit it passes through, so a derivative near 0 stops learning and a derivative of 1 passes the signal on untouched.

| Function | Formula $f(x)$ | Output range | Derivative $f'(x)$ | Typical use |
| --- | --- | --- | --- | --- |
| Sigmoid (logistic) | $\dfrac{1}{1 + e^{-x}}$ | 0 to 1 | $\sigma(x)\,(1 - \sigma(x))$, at most 0.25 | Binary output layer; gates in LSTM and GRU cells |
| Tanh | $\dfrac{e^{x} - e^{-x}}{e^{x} + e^{-x}}$ | −1 to 1 | $1 - \tanh^2 x$, at most 1 | Recurrent hidden state; small networks |
| ReLU | $\max(0, x)$ | 0 to ∞ | 0 for $x < 0$, 1 for $x > 0$ | Default for hidden layers in feed-forward and convolutional networks |
| Leaky ReLU | $x$ if $x > 0$, else $\alpha x$ ($\alpha \approx 0.01$) | −∞ to ∞ | 1 or $\alpha$ | Hidden layers, when units are dying |
| ELU | $x$ if $x > 0$, else $\alpha(e^{x} - 1)$ | $-\alpha$ to ∞ | 1 or $\alpha e^{x}$ | Hidden layers; smoother than ReLU at 0 |
| GELU | $x\,\Phi(x)$, with $\Phi$ the normal CDF | about −0.17 to ∞ | $\Phi(x) + x\,\varphi(x)$ | Transformer feed-forward layers (BERT, GPT) |
| Swish / SiLU | $x\,\sigma(\beta x)$, SiLU when $\beta = 1$ | about −0.28 to ∞ | $\sigma(x) + x\,\sigma(x)(1 - \sigma(x))$ for $\beta = 1$ | Image and language models; gated forms such as SwiGLU |
| Softplus | $\ln(1 + e^{x})$ | 0 to ∞ | $\sigma(x)$ | A smooth ReLU; outputs that must be positive, such as a standard deviation |
| Softmax | $\dfrac{e^{z_i}}{\sum_j e^{z_j}}$ over a vector | each 0 to 1, summing to 1 | $p_i(\delta_{ij} - p_j)$ | Output layer of a multi-class classifier; attention weights |

### Sigmoid and tanh

The **sigmoid function** (also called the logistic function) squeezes any input into the range 0 to 1, which reads naturally as a probability: $\sigma(0) = 0.5$, $\sigma(2) = 0.88$ and $\sigma(-2) = 0.12$. Tanh has the same S shape stretched to −1 to 1; in fact $\tanh x = 2\sigma(2x) - 1$. Because tanh is centred on zero, the next layer receives inputs that average near zero, which usually makes training easier than with sigmoid. Both were the standard hidden-layer activations until about 2010.

Far from zero both curves go flat, which is called saturation. The sigmoid's slope is 0.0066 at $x = 5$, and tanh's is 0.0099 at $x = 3$. A unit stuck out there passes almost no gradient back.

### ReLU, leaky ReLU and ELU

The rectified linear unit, **ReLU**, outputs its input when it is positive and 0 otherwise. Nair and Hinton (2010) used it in restricted Boltzmann machines, and Glorot, Bordes and Bengio (2011) showed it trained deep networks well without pre-training. For positive inputs its slope is exactly 1, so it doesn't saturate there, and it costs one comparison to compute. At initialisation about half of the units output exactly 0 for a given input, which gives sparse activations. Goodfellow, Bengio and Courville's *Deep Learning* calls ReLU the default recommendation for modern feed-forward networks.

ReLU's flat left half has a cost. A unit whose input is negative for every training example outputs 0 and gets a gradient of 0, so it can never recover. Leaky ReLU (Maas, Hannun and Ng, 2013) keeps a small slope $\alpha$ for negative inputs, and PReLU learns $\alpha$ during training. ELU (Clevert, Unterthiner and Hochreiter, 2015) curves smoothly down to $-\alpha$, which pushes the mean output towards zero.

### GELU and Swish

**GELU**, the Gaussian error linear unit (Hendrycks and Gimpel, 2016), multiplies the input by the probability that a standard normal variable is below it: $x\,\Phi(x)$. Large positive inputs pass through, large negative ones are switched off, and inputs near zero are scaled down smoothly. A common fast form is $0.5x\,(1 + \tanh[\sqrt{2/\pi}\,(x + 0.044715x^{3})])$. BERT and OpenAI's GPT models use GELU.

**Swish**, $x\,\sigma(\beta x)$, came out of an automated search for activation functions by Ramachandran, Zoph and Le (2017), who found it matched or beat ReLU on deep models in their tests. With $\beta = 1$ it is the same function as the SiLU (sigmoid-weighted linear unit) proposed earlier. Both GELU and Swish dip slightly below zero for negative inputs, to a minimum of about −0.17 (GELU, at $x \approx -0.75$) and −0.28 (Swish, at $x \approx -1.28$), so their gradient is never zero everywhere on the left the way ReLU's is.

### Softplus

Softplus, $\ln(1 + e^{x})$, is a smooth version of ReLU: it approaches 0 on the left and $x$ on the right, and its derivative is the sigmoid. It is rarely used in hidden layers now, but it is a handy output activation when a value must be positive.

## Vanishing gradients and dying ReLU

Backpropagation sends the error from the output back through the network, multiplying by each layer's weights and by each unit's activation derivative on the way. The two failure modes below come from that multiplication.

![Bar chart of the largest share of the output gradient that reaches each of six layers, counting back from the output, ignoring the weights. Sigmoid bars fall from 1 to 0.25, 0.0625, 0.0156, 0.0039 and 0.001. ReLU bars for an active unit stay at 1 for every layer](./vanishing-gradient.svg)

### The vanishing gradient problem

The **vanishing gradient** problem is when the gradient shrinks as it travels back through the layers, so the early layers barely learn. The sigmoid's derivative is at most 0.25, reached only at $x = 0$. Ignoring the weights, ten sigmoid layers scale the gradient by at most $0.25^{10} \approx 9.5 \times 10^{-7}$, about one millionth. Saturated units make it worse, because their derivative is close to 0 rather than 0.25. Tanh's derivative reaches 1 at the centre, so it suffers less, but saturated tanh units still block the gradient. Bengio, Simard and Frasconi (1994) analysed the problem in recurrent networks, and Glorot and Bengio (2010) traced poor training of deep sigmoid networks to saturated top layers.

ReLU passes the gradient through an active unit unchanged, which is a large part of why deep networks became trainable. Careful weight initialisation (Glorot for tanh, He for ReLU), batch or layer normalisation and residual connections help as well.

### The dying ReLU problem

The **dying ReLU** problem is when a ReLU unit's input becomes negative for every training example. Its output is then always 0 and its gradient is always 0, so gradient descent can never move it again and the unit is dead. A large learning rate or a large negative update to the bias is the usual cause. Lu and colleagues (2019) studied how often whole networks die at initialisation. Remedies are a lower learning rate, He initialisation, leaky ReLU or ELU, or a smooth function such as GELU.

The [live demo](#how-to-plot-activation-functions-in-javascript-react-or-angular) counts dead units while a ReLU network trains.

## The softmax function

The **softmax function** turns a vector of real-valued scores into a probability distribution. A classifier's last layer produces one score per class, called the **logits**; softmax exponentiates each one and divides by the total:

$$
p_i = \frac{e^{z_i / T}}{\sum_{j} e^{z_j / T}}
$$

Here $T$ is the temperature, normally 1. Every $p_i$ is between 0 and 1, they add up to 1, and a larger score always gets a larger probability. The name comes from its being a smooth ("soft") version of the argmax, which would put all the probability on the top class.

### A worked softmax example

An image classifier gives a photo the logits 2.0 for cat, 1.0 for dog and −1.0 for bird:

| Class | Logit $z$ | $e^{z}$ | Probability, $T = 1$ | $T = 0.5$ | $T = 2$ |
| --- | --- | --- | --- | --- | --- |
| Cat | 2.0 | 7.389 | 70.5% | 87.9% | 54.7% |
| Dog | 1.0 | 2.718 | 25.9% | 11.9% | 33.1% |
| Bird | −1.0 | 0.368 | 3.5% | 0.2% | 12.2% |
| Sum | | 10.475 | 100% | 100% | 100% |

At $T = 1$ each probability is $e^{z}$ divided by 10.475: cat 7.389 / 10.475 = 0.705. A gap of one logit between cat and dog becomes a ratio of $e^{1} = 2.72$ between their probabilities, whatever the other scores are.

### Softmax temperature

**Temperature** divides every logit before the softmax. Below 1 it sharpens the distribution towards the top class; as $T$ approaches 0, softmax becomes the argmax. Above 1 it flattens the distribution; as $T$ grows, every class approaches the same probability. Language models expose temperature as a sampling setting for this reason, and knowledge distillation (Hinton, Vinyals and Dean, 2015) trains a small model on a large model's softmax at a high temperature, where the small differences between wrong classes are visible.

### Softmax vs sigmoid

With two classes, softmax and sigmoid are the same model: $\text{softmax}(z_1, z_2)_1 = \sigma(z_1 - z_2)$. Use softmax when each example has exactly one class out of several. Use a separate sigmoid per class when an example can have several labels at once (multi-label classification), such as the tags on a photo: then the outputs needn't add up to 1.

### Computing softmax safely

$e^{1000}$ overflows a 64-bit floating-point number. Softmax doesn't change if you subtract the same number from every logit, so implementations subtract the largest logit first: the logits 1000, 999 and 997 give exactly the same 70.5%, 25.9% and 3.5% as 2, 1 and −1. Training pairs softmax with the cross-entropy loss, and the gradient of the two together with respect to the logits is $p - y$, the predicted probabilities minus the one-hot target. Libraries compute them as one fused, numerically stable step, which is why their loss functions take logits rather than probabilities.

## Sigmoid vs tanh vs ReLU vs GELU: choosing an activation function

Use ReLU or GELU in hidden layers, and choose the output activation by task: sigmoid for yes/no, softmax for one class out of many, none for regression.

| Property | Sigmoid | Tanh | ReLU | Leaky ReLU / ELU | GELU / Swish |
| --- | --- | --- | --- | --- | --- |
| Zero-centred output | No | Yes | No | Leaky ReLU: no; ELU: closer to zero | No, but closer than ReLU |
| Saturates (flat gradient) | Both ends | Both ends | Left half only (gradient 0) | Leaky ReLU: no; ELU: left side, towards $-\alpha$ | Left side, slowly |
| Can units die? | No | No | Yes | No | Rarely |
| Smooth at 0 | Yes | Yes | No (a corner) | Leaky: no; ELU: yes when $\alpha = 1$ | Yes |
| Cost to compute | An exponential | An exponential | A comparison | A comparison (+ exp for ELU) | An erf or exponential |

Choose by where the function sits in the network:

| Layer or task | Usual choice | Alternatives | Why |
| --- | --- | --- | --- |
| Hidden layers, feed-forward or convolutional | ReLU | Leaky ReLU, ELU, GELU, SiLU | Cheap, and no saturation for positive inputs |
| Transformer feed-forward layers | GELU | SiLU, gated forms such as SwiGLU | Smooth; used by BERT and GPT |
| Recurrent cells (LSTM, GRU) | Tanh for the state, sigmoid for the gates | | Bounded state keeps the recurrence stable; gates need 0 to 1 |
| Output, binary classification | Sigmoid | | The probability of the positive class |
| Output, one class out of many | Softmax | | Probabilities that sum to 1 |
| Output, several labels at once | Sigmoid per class | | Each label is its own yes/no |
| Output, regression | None (linear) | Softplus for positive targets | The target can be any real number |

Shazeer (2020) compared gated activations such as SwiGLU in transformer feed-forward layers. If you are unsure, start with ReLU in the hidden layers and change only if training shows a problem, such as many dead units.

## Training a small network with each activation

The demo's third chart trains a network with one input, one hidden layer and one output to fit 60 noisy points of $y = \sin 2x$ on −3 to 3, using full-batch gradient descent with the Adam optimiser and a learning rate that falls from 0.02 to 0.002. Every run starts from the same seeded weights, so only the activation and the number of hidden units change. The noise has a variance of 0.0025, which is roughly the lowest loss a good fit can reach without memorising the noise. These figures were measured with the demo's own code:

| Activation, hidden units | Loss after 1,000 epochs | After 5,000 epochs | Dead units at the end |
| --- | --- | --- | --- |
| Tanh, 8 | 0.0037 | 0.0021 | |
| Sigmoid, 8 | 0.0157 | 0.0022 | |
| GELU, 8 | 0.0116 | 0.0025 | |
| ReLU, 8 | 0.067 | 0.055 | 2 of 8 |
| Leaky ReLU ($\alpha = 0.1$), 8 | 0.066 | 0.055 | |
| ReLU, 32 | 0.0049 | 0.0040 | 10 of 32 |

Smooth activations fit this curve with few units, and sigmoid gets there more slowly than tanh. ReLU builds the curve from straight segments, one bend per live unit, so with 8 units it settles on a rough zig-zag; leaky ReLU, which has no dead units, stalls at the same loss, so the shortage of bends matters more than the deaths here. With 32 units ReLU fits well even with 10 dead. The vanishing gradient problem doesn't arise in a network this shallow; ReLU's advantage shows in deep networks, so a toy result like this one is not a reason to drop it.

## Common activation function mistakes

Most activation bugs come from pairing the function with the wrong loss, task or weight initialisation.

- **Applying softmax twice.** Many loss functions, such as a cross-entropy loss that takes logits, apply softmax themselves. Feeding them probabilities squashes the outputs and slows training. Check whether your loss expects logits or probabilities.
- **Using softmax for multi-label problems.** Softmax forces the classes to compete for a total of 1. When several labels can be true, use a sigmoid per label.
- **Squashing a regression output.** A sigmoid or ReLU on the last layer of a regression model can't produce values outside its range: a ReLU output can never predict a negative number. Use a linear output and scale the targets.
- **Mismatching initialisation and activation.** Weights sized for tanh (Glorot initialisation) are too small for deep ReLU networks, and He initialisation is too large for sigmoid. Use the scheme designed for your activation.
- **Not watching for dead units.** Track the share of ReLU units that output 0 for a whole batch. If it climbs during training, lower the learning rate or switch to leaky ReLU or GELU.
- **Reading softmax outputs as calibrated confidence.** A probability of 0.95 from a deep network is often over-confident (Guo and colleagues, 2017). Check calibration on held-out data, or apply temperature scaling, before treating the numbers as real probabilities.
- **Computing softmax without subtracting the maximum.** Large logits overflow to infinity and produce NaN. Subtract the largest logit, or use the library's log-softmax.

## How to plot activation functions in JavaScript, React or Angular

The demo trains its network 10 epochs per animation frame, up to 5,000, and redraws the fitted curve and the loss chart after each batch.

Tick functions in the top-left chart, or pick a group from **Show**, and tick **Derivatives** to add their slopes as dashed lines. Type three scores into **Cat**, **Dog** and **Bird** and drag **Temperature** to see the softmax change. In the bottom row, choose an **Activation** and a number of **Hidden units**: the network retrains from the same starting weights, and the loss chart keeps the previous run in grey for comparison until you **Clear previous run**. **Pause** and **Reset** control training. Each chart zooms with the mouse wheel, pans by dragging and resets on a double-click; hover to read values.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="activation function chart" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The activation functions, softmax and the network's training are plain JavaScript; SciChart.js draws the curves as line series, the softmax as a column series and the training data as a scatter series.

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

    // Each activation function with its derivative
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    const activations = [
        { name: "Sigmoid", colour: "#50C7E0", f: sigmoid, df: (x: number) => sigmoid(x) * (1 - sigmoid(x)) },
        { name: "Tanh", colour: "#F48420", f: Math.tanh, df: (x: number) => 1 - Math.tanh(x) ** 2 },
        { name: "ReLU", colour: "#3BD16F", f: (x: number) => Math.max(0, x), df: (x: number) => (x > 0 ? 1 : 0) }
    ];

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Input x", visibleRange: new NumberRange(-5, 5) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "f(x)", visibleRange: new NumberRange(-1.25, 2.5) }));

        const xValues = getYourInputRange(); // e.g. 801 points from -5 to 5
        for (const a of activations) {
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(a.f), dataSeriesName: a.name }),
                    stroke: a.colour,
                    strokeThickness: 2.5
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(a.df), dataSeriesName: `${a.name} derivative` }),
                    stroke: a.colour,
                    strokeDashArray: [6, 4] // dashed: the derivative
                })
            );
        }
        sciChartSurface.chartModifiers.add(
            new LegendModifier({ showCheckboxes: true }),
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const ActivationFunctionChart = () => (
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

    // Each activation function with its derivative
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    const activations = [
        { name: "Sigmoid", colour: "#50C7E0", f: sigmoid, df: (x: number) => sigmoid(x) * (1 - sigmoid(x)) },
        { name: "Tanh", colour: "#F48420", f: Math.tanh, df: (x: number) => 1 - Math.tanh(x) ** 2 },
        { name: "ReLU", colour: "#3BD16F", f: (x: number) => Math.max(0, x), df: (x: number) => (x > 0 ? 1 : 0) }
    ];

    @Component({
        selector: "app-activation-function-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class ActivationFunctionChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Input x", visibleRange: new NumberRange(-5, 5) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "f(x)", visibleRange: new NumberRange(-1.25, 2.5) }));

            const xValues = getYourInputRange(); // e.g. 801 points from -5 to 5
            for (const a of activations) {
                sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(a.f), dataSeriesName: a.name }),
                        stroke: a.colour,
                        strokeThickness: 2.5
                    }),
                    new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(a.df), dataSeriesName: `${a.name} derivative` }),
                        stroke: a.colour,
                        strokeDashArray: [6, 4] // dashed: the derivative
                    })
                );
            }
            sciChartSurface.chartModifiers.add(
                new LegendModifier({ showCheckboxes: true }),
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

- Each activation and its derivative is a `FastLineRenderableSeries` over an `XyDataSeries` of 801 points; the derivative uses the same colour with `strokeDashArray`. Hiding a series sets `isVisible`, and the legend is rebuilt to list only the functions on show.
- The softmax is a `FastColumnRenderableSeries` on a `NumericAxis` with a `TextLabelProvider` for the class names, with `dataLabels` showing each probability above its column.
- The network trains a few epochs per `requestAnimationFrame` and redraws its fit with `clear()` and `appendRange()`; the loss is appended point by point to a line series on a `LogarithmicAxis`, so early and late progress are both visible.
- The training points are an `XyScatterRenderableSeries` with an `EllipsePointMarker`.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart), and for a live-updating chart like the loss curve, [JavaScript real-time chart performance](https://www.scichart.com/demo/javascript/chart-realtime-performance-demo) · [React real-time chart performance](https://www.scichart.com/demo/react/chart-realtime-performance-demo) · [Angular real-time chart performance](https://www.scichart.com/demo/angular/chart-realtime-performance-demo).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [column series documentation](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/) for the softmax bars, the [logarithmic axis documentation](/2d-charts/axis-api/axis-types/logarithmic-axis/) for the loss curve, and the [line chart guide](/learn/chart-types/cartesian/line-chart/).

## Frequently asked questions

### What is an activation function in a neural network?

An activation function is the non-linear function applied to each unit's weighted sum of inputs before the result goes to the next layer. Without one, a neural network of any depth can only compute a linear function of its input, because stacked linear layers collapse into a single layer. ReLU, GELU, tanh and sigmoid are common choices for hidden layers, and sigmoid or softmax for the output.

### Why is ReLU the most used activation function?

ReLU, max(0, x), is cheap to compute and has a slope of exactly 1 for positive inputs, so it does not shrink the gradient as it passes back through many layers. That makes deep networks much easier to train than with sigmoid or tanh, which flatten out for large inputs. Its weakness is that a unit whose input is negative for every example stops learning, the dying ReLU problem.

### What is the difference between sigmoid and softmax?

Sigmoid maps one score to a probability between 0 and 1, and is used for a single yes/no output or for each label when several labels can be true at once. Softmax maps a vector of scores to probabilities that add up to 1, and is used when each example belongs to exactly one of several classes. With two classes they give the same result, since softmax of (z1, z2) equals the sigmoid of z1 − z2.

### What does temperature do in softmax?

Temperature divides every score before the softmax is applied. A temperature below 1 makes the distribution sharper, giving more of the probability to the top class, and as it approaches 0 softmax becomes a hard argmax. A temperature above 1 makes the distribution flatter, and very high temperatures give every class nearly the same probability. Language models use it to control how varied their sampled text is.

### What is the vanishing gradient problem?

The vanishing gradient problem is when the error signal gets smaller and smaller as backpropagation carries it from the output back to the early layers, so those layers learn very slowly or not at all. It happens with saturating activations: the sigmoid's derivative is at most 0.25, so ten sigmoid layers can shrink the gradient to about a millionth. ReLU-family activations, careful initialisation, normalisation layers and residual connections reduce it.

### How do I plot an activation function in JavaScript?

Sample the input range, for example 801 points from −5 to 5, compute the function and its derivative at each point in plain JavaScript, and draw each as a line series, with the derivative dashed. SciChart.js does this with FastLineRenderableSeries and XyDataSeries in plain JavaScript, React or Angular, and adds zoom, pan and a tooltip so you can read values near the corners and flat regions.

## Sources

- Goodfellow, I., Bengio, Y. and Courville, A. (2016), [*Deep Learning*](https://www.deeplearningbook.org/), MIT Press. Chapter 6: hidden units, output units, softmax and the cross-entropy gradient.
- Nair, V. and Hinton, G. E. (2010), [Rectified linear units improve restricted Boltzmann machines](https://www.cs.toronto.edu/~hinton/absps/reluICML.pdf). *Proceedings of the 27th International Conference on Machine Learning*, 807–814.
- Glorot, X., Bordes, A. and Bengio, Y. (2011), [Deep sparse rectifier neural networks](https://proceedings.mlr.press/v15/glorot11a.html). *Proceedings of AISTATS*, PMLR 15, 315–323.
- Glorot, X. and Bengio, Y. (2010), [Understanding the difficulty of training deep feedforward neural networks](https://proceedings.mlr.press/v9/glorot10a.html). *Proceedings of AISTATS*, PMLR 9, 249–256.
- Bengio, Y., Simard, P. and Frasconi, P. (1994), [Learning long-term dependencies with gradient descent is difficult](https://doi.org/10.1109/72.279181). *IEEE Transactions on Neural Networks*, 5(2), 157–166.
- Hendrycks, D. and Gimpel, K. (2016), [Gaussian error linear units (GELUs)](https://arxiv.org/abs/1606.08415). arXiv:1606.08415.
- Ramachandran, P., Zoph, B. and Le, Q. V. (2017), [Searching for activation functions](https://arxiv.org/abs/1710.05941). arXiv:1710.05941.
- Clevert, D.-A., Unterthiner, T. and Hochreiter, S. (2015), [Fast and accurate deep network learning by exponential linear units (ELUs)](https://arxiv.org/abs/1511.07289). arXiv:1511.07289.
- Maas, A. L., Hannun, A. Y. and Ng, A. Y. (2013), [Rectifier nonlinearities improve neural network acoustic models](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf). *ICML Workshop on Deep Learning for Audio, Speech and Language Processing*.
- He, K., Zhang, X., Ren, S. and Sun, J. (2015), [Delving deep into rectifiers](https://arxiv.org/abs/1502.01852). arXiv:1502.01852. He initialisation and PReLU.
- Lu, L., Shin, Y., Su, Y. and Karniadakis, G. E. (2019), [Dying ReLU and initialization: theory and numerical examples](https://arxiv.org/abs/1903.06733). arXiv:1903.06733.
- Leshno, M., Lin, V. Y., Pinkus, A. and Schocken, S. (1993), [Multilayer feedforward networks with a nonpolynomial activation function can approximate any function](https://doi.org/10.1016/S0893-6080(05)80131-5). *Neural Networks*, 6(6), 861–867.
- Hinton, G., Vinyals, O. and Dean, J. (2015), [Distilling the knowledge in a neural network](https://arxiv.org/abs/1503.02531). arXiv:1503.02531. Softmax temperature.
- Devlin, J., Chang, M.-W., Lee, K. and Toutanova, K. (2019), [BERT: pre-training of deep bidirectional transformers for language understanding](https://arxiv.org/abs/1810.04805). arXiv:1810.04805. GELU in BERT.
- Radford, A., Narasimhan, K., Salimans, T. and Sutskever, I. (2018), [Improving language understanding by generative pre-training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf). OpenAI. GELU in GPT.
- Shazeer, N. (2020), [GLU variants improve transformer](https://arxiv.org/abs/2002.05202). arXiv:2002.05202.
- Guo, C., Pleiss, G., Sun, Y. and Weinberger, K. Q. (2017), [On calibration of modern neural networks](https://arxiv.org/abs/1706.04599). arXiv:1706.04599.

<LearnCta position="bottom" chart="activation function chart" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
