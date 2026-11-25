---
sidebar_position: 150
sidebar_label: PID Control
title: "PID Control: How a PID Controller Works and How to Tune It"
description: "What a PID controller does, what the P, I and D terms mean, how to read a step response (rise time, overshoot, settling time) and how to tune a loop by hand, with Ziegler–Nichols or lambda tuning. With a live simulator."
keywords:
    [
        "pid tuning",
        "pid controller",
        "pid control",
        "how to tune a pid controller",
        "pid controller explained",
        "step response",
        "ziegler nichols",
        "ziegler nichols tuning",
        "overshoot settling time rise time",
        "proportional integral derivative",
        "integral windup",
        "derivative kick",
        "lambda tuning",
        "cohen coon"
    ]
image: /img/learn/pid-control-og.png
related: [bode-plot, hmi-scada, power-quality, strip-chart]
datePublished: 2026-11-20
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a PID controller do?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A PID controller holds a measured quantity, such as a temperature, a pressure or a motor speed, at a target value called the setpoint. Many times a second it subtracts the measurement from the setpoint to get the error, and sets its output (a heater's power, a valve's opening, a motor's voltage) from three terms: proportional to the error now, to the error added up over time, and to how fast the error is changing." }
                },
                {
                    "@type": "Question",
                    "name": "How do you tune a PID controller?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start with the integral and derivative gains at zero. Raise the proportional gain until the loop responds quickly to a setpoint step with a little overshoot, then add integral gain until the offset disappears in a reasonable time without slow oscillation. Add derivative gain last, only if the loop overshoots and the measurement is clean, to damp it. Make one change at a time and test each with a small setpoint step and a load disturbance. Ziegler–Nichols or lambda tuning give a starting point from a measured test." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Ziegler–Nichols tuning method?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Ziegler–Nichols closed-loop method, published in 1942, finds the ultimate gain Ku, the proportional-only gain at which the loop oscillates with a steady amplitude, and the period Tu of that oscillation. A PID controller then gets Kp = 0.6 Ku, an integral time of Tu/2 and a derivative time of Tu/8. The rules aim for a quarter-amplitude decay, so they give an aggressive, oscillatory response that usually needs detuning." }
                },
                {
                    "@type": "Question",
                    "name": "What are rise time, overshoot and settling time?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They describe a step response. Rise time is how long the output takes to go from 10% to 90% of the step. Overshoot is how far it peaks beyond the new value, as a percentage of the step. Settling time is how long after the step it takes to enter, and stay inside, a band around the final value, usually plus or minus 2%. Steady-state error is the gap left between the setpoint and the output once everything has settled." }
                },
                {
                    "@type": "Question",
                    "name": "What is integral windup?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Integral windup happens when the controller's output hits a limit, such as a valve fully open, while the error persists. The integral term keeps adding up error that the saturated actuator can't act on, and when the process finally reaches the setpoint the oversized integral holds the output high, causing a large overshoot. Anti-windup stops or bleeds off the integration while the output is saturated." }
                },
                {
                    "@type": "Question",
                    "name": "How do I simulate and chart a PID loop in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Write the process as a difference equation (for a first-order process with dead time, an Euler step plus a buffer for the delay) and the PID as a function called once per sample with the setpoint and the measurement. Run both in a timer, append each sample of setpoint, process variable and controller output to line series with a FIFO capacity, and scroll the time axis. SciChart.js does this with FastLineRenderableSeries and XyDataSeries in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# PID Control

## What is PID control?

**PID control** (proportional–integral–derivative control) is a feedback method that keeps a measured quantity, such as a temperature or a motor speed, at a target value. A PID controller compares the target (the setpoint) with the measurement, and sets its output from three terms: the error now, the error accumulated over time, and how fast the error is changing.

![Two stacked trend charts in a dark navy theme: on top, a dashed orange setpoint steps from 40% to 60% and a blue process variable rises after a short delay, overshoots slightly and settles on the new setpoint; below, the white controller output jumps, then eases back, with its proportional, integral and derivative parts drawn as thinner coloured lines](/img/learn/pid-control-og.png)

*Setpoint, process variable and controller output for a PID loop on a simulated heating process with dead time. [Try the interactive simulator](#how-to-chart-a-pid-control-loop-in-javascript-react-or-angular).*

:::tip Key takeaways
- A PID controller sets its output from the error between setpoint and measurement: P reacts to the error now, I removes the error that remains, D damps the response.
- A step response shows how well a loop is tuned, through four numbers: rise time, overshoot, settling time and steady-state error.
- Tune by hand with P first, then I, then D, or start from a test such as Ziegler–Nichols or lambda tuning.
- Ziegler–Nichols gives fast, oscillatory loops; lambda tuning gives slower ones with no overshoot, and lets you choose the speed.
- Real controllers need anti-windup, a filtered derivative on the measurement, and a sample time well below the process's time constant.
:::

## How a feedback control loop works

A feedback loop has four signals. The **setpoint** (SP, or reference r) is the value you want, for example 60 °C. The **process variable** (PV, or y) is what a sensor measures. The **error** is the setpoint minus the process variable, $e = r - y$. The **controller output** (CO, or u) is what the controller sends to the actuator: a heater's power, a valve position or a motor voltage, often as 0 to 100%.

![A PID feedback loop: the setpoint enters a summing junction that subtracts the measured process variable to give the error. The error feeds three parallel blocks, P, I and D, whose outputs add to give the controller output. The output passes through an actuator with 0 to 100% limits into the process, where a load disturbance also enters, and a sensor feeds the process variable back to the summing junction](./pid-feedback-loop.svg)

The loop runs continuously. If a door opens and the oven cools, the error grows, the controller turns the heater up, the temperature recovers and the error shrinks again. A change that the controller didn't cause, like the open door, is a disturbance. A good loop follows setpoint changes quickly and rejects disturbances, without oscillating and without driving the actuator harder than it can go.

Control without feedback, where the output is set from a recipe and never checks the result, is open-loop control. It is simple, but it can't correct for disturbances or for a process that changes over time.

## The P, I and D terms

In the parallel (independent-gain) form, the controller output is the sum of three terms:

$$
u(t) = K_p\, e(t) + K_i \int_0^t e(\tau)\, d\tau + K_d \frac{de(t)}{dt}
$$

$K_p$, $K_i$ and $K_d$ are the proportional, integral and derivative gains. Industrial controllers more often use the standard (ISA) form, with one gain and two times:

$$
u(t) = K_p \left( e(t) + \frac{1}{T_i} \int_0^t e(\tau)\, d\tau + T_d \frac{de(t)}{dt} \right)
$$

The two are the same controller written differently: $K_i = K_p / T_i$ and $K_d = K_p T_d$. The **integral time** $T_i$ is in seconds (some controllers use repeats per minute, its inverse), and the derivative time $T_d$ is in seconds too. Check which form a controller uses before copying gains from one to another: a $K_i$ of 0.5 and a $T_i$ of 0.5 s are very different settings.

### Proportional: the error now

The P term pushes in proportion to the error. A bigger $K_p$ reacts harder and faster, but with a process that has delay it also overshoots and, past a certain gain, oscillates. On its own, P control leaves a **steady-state error** (offset) whenever the process needs a non-zero output to stay at the setpoint, because with zero error the P term is zero. A loop with process gain $K$ and P-only gain $K_p$ settles with a remaining error of $1/(1 + K K_p)$ of the step: with $K = 1$ and $K_p = 3$, a quarter of it.

Some controllers set the P action as a proportional band instead: the error, in % of the measurement range, that drives the output from 0 to 100%. A proportional band of 50% is a gain of 2.

### Integral: the error that remains

The I term adds up the error over time, so it keeps growing as long as any error is left, until the output is exactly what holds the process at the setpoint. It removes the offset. Too much integral action makes the loop slow to settle, with long, lazy oscillations, and it causes integral windup when the output is limited (see [practical problems](#practical-pid-problems-and-their-fixes)).

### Derivative: the trend

The D term reacts to how fast the error is changing, so it acts before the error gets large: as the process variable races towards the setpoint, D eases the output off, which reduces overshoot. It also amplifies measurement noise, because noise changes fast. Many loops, especially in process plants where measurements are noisy, run as PI with no D at all.

### The discrete PID formula

A digital controller runs once every sample time $T_s$, so the integral becomes a running sum and the derivative a difference:

$$
u_k = K_p\, e_k + K_i T_s \sum_{j=0}^{k} e_j + K_d \frac{e_k - e_{k-1}}{T_s}
$$

In code, the sum is a variable that adds $K_i T_s e_k$ on each sample. Storing the integral term itself, rather than the sum of errors, means a change to $K_i$ doesn't make the output jump. The simulator below runs this formula every 10 ms, with the derivative taken from the measurement and passed through a 0.2 s low-pass filter.

## What is a step response?

A **step response** is how a system's output moves after its input changes suddenly from one constant value to another. For a control loop, the step is usually a setpoint change, and the response is the process variable over the following seconds or minutes. It is the standard test for judging a loop's tuning, because the same handful of features appear on every step response and can be measured.

![An annotated step response: the setpoint steps from 0 to 1 at 2 seconds. The process variable rises; callout 1 marks the rise time between 10% and 90% of the step, callout 2 the overshoot where the curve peaks above the setpoint, and callout 3 the settling time, when the curve enters a shaded band of plus or minus 2% around the setpoint and stays inside it. A dashed grey curve from a P-only controller levels off below the setpoint, and callout 4 marks the gap as the steady-state error](./step-response-anatomy.svg)

### How to read a step response

| Metric | Definition | What it tells you | Usual fix if too large |
| --- | --- | --- | --- |
| Rise time | Time from 10% to 90% of the step | How fast the loop responds | More $K_p$, or more $K_i$ |
| Overshoot | Peak beyond the final value, as % of the step | How aggressive or underdamped the loop is | Less $K_p$ or $K_i$, or some $K_d$ |
| Settling time | Time after the step to enter, and stay inside, ±2% of the final value | When the response is finished | Depends: less oscillation, or more speed |
| Steady-state error | Setpoint minus the final value | Whether the loop reaches the target | Add or increase $K_i$ |
| Peak time | Time from the step to the highest point | Speed of an underdamped loop | As for rise time |

Some textbooks use 0 to 100% for the rise time of underdamped systems, or a ±5% settling band. Say which definition you use when you quote a number. The simulator measures against the new setpoint, which is the final value whenever the loop has integral action.

For a second-order system, overshoot depends only on the damping ratio ζ: $\text{OS} = 100\, e^{-\pi\zeta / \sqrt{1 - \zeta^2}}$ %. A damping ratio of 0.7 gives about 4.6% overshoot, 0.5 gives 16%, and 0.3 gives 37%. Many loops are tuned for a few per cent to 20%, depending on whether overshoot harms the product; a chemical reactor or a robot arm near an obstacle may need none.

Rise time and overshoot pull against each other: a faster loop overshoots more. Settling time is often best at a moderate overshoot, because a very slow loop takes long to arrive and a very fast one takes long to stop ringing.

## How to tune a PID controller

**PID tuning** means choosing $K_p$, $K_i$ and $K_d$ so the loop meets its goals: fast enough, little enough overshoot, and robust to disturbances and to changes in the process. There are three families of methods: manual trial and error, rules applied to a measured test (Ziegler–Nichols, Cohen–Coon, lambda), and software that fits a model and optimises the gains.

### Manual PID tuning procedure

1. Put the loop in manual, check the actuator works in both directions, and check the controller's direction: if more output raises the process variable, the controller must be reverse acting (output rises when PV falls below SP).
2. Set $K_i$ and $K_d$ to zero. Raise $K_p$ in steps, testing each with a small setpoint step, until the response is fast with a small overshoot. Expect an offset.
3. Add integral action. Raise $K_i$ until the offset disappears in about the time the loop takes to settle. If the response starts to oscillate slowly, back off $K_i$ or reduce $K_p$ a little.
4. Add derivative action only if the loop overshoots more than you want and the measurement is clean. Raise $K_d$ until the overshoot drops; stop if the output turns noisy.
5. Test with a load disturbance as well as a setpoint step, because most loops spend their life rejecting disturbances. Record the final gains and the test results.

Change one gain at a time, and give each test long enough to settle. In the simulator, a 20% step on the default process takes 20 to 30 seconds of process time to finish.

## The Ziegler–Nichols tuning method

The **Ziegler–Nichols method** is the best-known set of PID tuning rules, and one of the earliest (Callender, Hartree and Porter published rules in 1936). It comes from John Ziegler and Nathaniel Nichols of the Taylor Instrument Companies in 1942. Its closed-loop (ultimate gain) version needs one test:

1. Set the controller to P only.
2. Raise $K_p$ until the process variable oscillates with a constant amplitude, neither growing nor dying away. That gain is the **ultimate gain** $K_u$.
3. Measure the period of the oscillation, the **ultimate period** $T_u$.
4. Calculate the gains from the table.

| Controller | $K_p$ | $T_i$ | $T_d$ |
| --- | --- | --- | --- |
| P | $0.5\, K_u$ | – | – |
| PI | $0.45\, K_u$ | $T_u / 1.2$ | – |
| PID | $0.6\, K_u$ | $T_u / 2$ | $T_u / 8$ |

For the parallel form, $K_i = K_p / T_i$ and $K_d = K_p T_d$.

### Worked example

The simulator's default process has a gain $K = 1$, a time constant $\tau = 8$ s and a dead time $\theta = 2$ s. For this first-order-plus-dead-time process, the loop oscillates at the frequency where the process lags by 180°, $\arctan(\omega\tau) + \omega\theta = \pi$, which gives $\omega = 0.858$ rad/s. So:

- $T_u = 2\pi / \omega = 7.33$ s, and $K_u = \sqrt{1 + (\omega\tau)^2} / K = 6.93$;
- the PID rule gives $K_p = 4.16$, $T_i = 3.66$ s and $T_d = 0.92$ s, or in parallel form $K_i = 1.14$ /s and $K_d = 3.81$ s.

The simulator's Ziegler–Nichols button finds $K_u$ and $T_u$ by simulation instead, by halving the interval between a gain that decays and one that grows: it gets 6.91 and 7.34 s, within 0.3% of the calculation.

The rules were designed for a quarter-amplitude decay, each overshoot a quarter of the one before, which is fast but oscillatory. With the gains above and no output limit, a setpoint step overshoots by about 56%. With the simulator's 0 to 100% output limit, the 20% step overshoots by about 10%, because the limit clips the output. Treat Ziegler–Nichols gains as a starting point, and reduce $K_p$ if the overshoot is too large.

Driving a real plant to the edge of instability for the test is often unacceptable. The relay method of Åström and Hägglund gets the same two numbers safely: it swaps the controller for an on-off relay, which makes the loop oscillate with a small, controlled amplitude at the ultimate period. Many controllers with an autotune button use it.

## Cohen–Coon and lambda tuning

Both start from an open-loop step test. With the controller in manual, step the output by a few per cent and record the process variable. Fit a first-order-plus-dead-time (FOPDT) model: the process gain $K$ (change in PV divided by change in output), the dead time $\theta$ (delay before the PV starts to move) and the time constant $\tau$ (time to 63% of the final change, after the dead time).

- **Cohen–Coon** (1953) rules turn $K$, $\tau$ and $\theta$ into gains aimed, like Ziegler–Nichols, at quarter-amplitude decay. They handle processes with a long dead time relative to the time constant better than Ziegler–Nichols, but are just as aggressive.
- **Lambda tuning** (an internal model control, IMC, method) lets you choose the closed-loop time constant $\lambda$: how fast you want the loop to respond. For a PI controller on an FOPDT process, $K_p = \tau / \big(K(\lambda + \theta)\big)$ and $T_i = \tau$. Skogestad's SIMC rules refine this with $T_i = \min\big(\tau,\, 4(\lambda + \theta)\big)$ for slow processes, and suggest $\lambda = \theta$ as a good default for a fast, robust loop.

For the default process, $\lambda = 4$ s gives $K_p = 1.33$ and $K_i = 0.167$ /s; in the simulator the 20% step then rises in 7.9 s with no overshoot and settles in about 16 s. Choosing $\lambda = \tau = 8$ s, a common conservative choice, gives $K_p = 0.80$, $K_i = 0.10$ /s and a settling time of about 32 s.

## PID tuning methods compared

PID tuning methods differ in the test they need and the response they aim for, from trial and error to model-based rules such as lambda tuning.

| Method | Test needed | Response it aims for | Best for | Watch out for |
| --- | --- | --- | --- | --- |
| Manual (trial and error) | Repeated setpoint steps | Whatever you judge right | Fast loops (flow, motors) where tests take seconds | Slow on slow processes; depends on experience |
| Ziegler–Nichols closed loop | Sustained oscillation at $K_u$ | Quarter-amplitude decay | A quick first setting | Aggressive; driving a plant to oscillation can be unsafe |
| Relay autotune | Small relay oscillation | As the rules applied to it | Built-in autotune buttons | Disturbances during the test spoil it |
| Cohen–Coon | Open-loop step test | Quarter-amplitude decay | Processes with long dead time | Aggressive; needs a good FOPDT fit |
| Lambda (IMC, SIMC) | Open-loop step test | No overshoot, chosen speed $\lambda$ | Process plants, interacting loops, valves you don't want to wear | Slow if $\lambda$ is chosen too large |
| Model-based software | Step or frequency data | Optimised for chosen goals and margins | Critical or complex loops | Only as good as the model |

### P vs PI vs PID

| Controller | Removes offset? | Typical use |
| --- | --- | --- |
| P | No | Level control where an offset is acceptable, inner loops of a cascade |
| PI | Yes | Most loops: flow, pressure, level, temperature, motor speed |
| PD | No | Position control where the process already integrates, such as a motor's angle |
| PID | Yes | Slow, lag-dominated loops with clean measurements: temperature, multirotor attitude |

## Practical PID problems and their fixes

Industrial controllers add the following features to the textbook formula, and the simulator has most of them.

### Integral windup and anti-windup

Every actuator has limits: a valve can't open more than fully, and a heater can't give more than 100% power. When the output is saturated and the error persists, the integral keeps growing even though the output can't. When the process finally reaches the setpoint, the oversized integral holds the output at its limit, and the process overshoots well past the setpoint before the integral unwinds. That is **integral windup**.

**Anti-windup** prevents it. Clamping (conditional integration) stops integrating while the output is saturated and the error would push it further. Back-calculation feeds the difference between the requested and the actual output back into the integrator, bleeding it off. In the simulator, with the default gains and the output limit at 65%, a step from 40% to 60% overshoots by about 20% and takes about 44 s to settle with anti-windup off, against no overshoot and 20 s with it on.

### Derivative kick and derivative filtering

If the D term acts on the error, a setpoint step makes the error jump, its derivative is momentarily huge, and the output spikes: a **derivative kick**. The fix is to take the derivative of the measurement instead of the error ($-dy/dt$ in place of $de/dt$). The two are the same between setpoint changes, so disturbance rejection doesn't change.

The derivative of a noisy measurement is noisier still. Practical controllers low-pass filter the D term, with a filter time constant of $T_d/N$ where $N$ is typically between 2 and 20 (Åström and Murray). In the simulator, set the D acts on menu to error, step the setpoint, and watch the spike in the D trace.

### Setpoint weighting

Weighting lets you tune for disturbances and setpoint changes separately. The P term acts on $b\,r - y$ instead of $r - y$, with $b$ between 0 and 1, while the I term keeps the full error so the loop still reaches the setpoint. With $b < 1$ a setpoint step gives a smaller output jump and less overshoot, without making the loop slower to reject disturbances. Taking the derivative of the measurement only, as above, is the same idea with a derivative weight of 0.

### Saturation and rate limits

Besides windup, saturation sets a speed limit: if the output sits at 100% during a large step, no tuning can make the response faster. Tune with step sizes like the ones the loop will see, since a loop tuned on small steps may behave differently on large ones. Some actuators also limit the rate of change, such as a valve with a slow motor; that adds lag the tuning has to allow for.

### Sample time

A digital PID needs to sample several times faster than the fastest dynamics it controls. Too slow a sample time adds delay, about half a sample on average plus computation time, which erodes the stability margin. For a temperature loop with a time constant of minutes, one sample a second is plenty; motor current loops run at thousands of samples a second. Keep the sample time constant too, because a jittery $T_s$ makes the integral and derivative wrong.

## Stability margins and the Bode plot

Step tests show how a loop behaves; frequency response shows how close it is to oscillating. Draw a [Bode plot](/learn/applications/signal-processing/bode-plot/) of the open-loop response (controller times process) and read the [gain margin and phase margin](/learn/applications/signal-processing/bode-plot/#gain-margin-and-phase-margin): how much more gain, or how much more delay, the loop can take before it oscillates. Ziegler–Nichols tuning tends to leave small margins; lambda tuning with $\lambda$ at least equal to the dead time leaves larger ones. Dead time is what limits most loops, because it adds phase lag that grows with frequency, $-\omega\theta$ radians, while adding nothing to the gain.

## Where PID control is used

PID control runs most of the feedback loops in industry, from process plants to motor drives and temperature controllers.

- Process plants. Flow, pressure, level and temperature loops in refineries, chemical plants and paper mills. A Honeywell survey of more than 11,000 controllers in those industries found that 97% of regulatory controllers used a PID algorithm (reported by Desborough and Miller, 2002). Operators watch the loops on [HMI and SCADA trend charts](/learn/applications/hmi-scada/), and SciChart is used to build [HMI and SCADA](https://www.scichart.com/scada-big-data/) software.
- Temperature control. Ovens, furnaces, 3D-printer hot ends, incubators, and heating, ventilation and air conditioning. Thermal loops are slow and lag-dominated, so they often use derivative action.
- Motor speed and position. Drives, conveyors, CNC axes and robot joints, usually with a fast current loop inside a speed loop inside a position loop (a cascade).
- Drones and vehicles. Multirotor flight controllers stabilise attitude with cascaded PID loops on angle and angular rate, tuned from step responses logged in flight. Cruise control and lane keeping use PID too.
- Test and measurement. Environmental chambers, dynamometers and power supplies hold set conditions while an instrument records data; see SciChart in [instrumentation software](https://www.scichart.com/best-instrumentation-engineering-software/).

## Common PID tuning mistakes

Many PID tuning problems come from testing the wrong thing or from mixing up controller forms, units and direction.

- **Tuning only for setpoint steps.** Most loops spend their time rejecting disturbances. Test with a load change too: a loop with no setpoint overshoot can still recover slowly from a disturbance.
- **Copying gains between controllers.** Parallel, standard and series forms use different numbers for the same behaviour, and some controllers use proportional band or repeats per minute. Convert before you copy.
- **Wrong controller direction.** A direct-acting controller on a process that needs reverse action drives the output to a limit and stays there. Check the sign before tuning.
- **Running derivative on a noisy signal.** The D term turns noise into actuator chatter and wear. Filter it, or use PI.
- **Leaving out anti-windup.** Any loop whose output can saturate, which is nearly all of them, needs it. Large steps or start-up from cold then overshoot badly.
- **Tuning at one operating point only.** Process gain and dead time often change with load, flow or temperature. Tune at the worst case, or schedule the gains.
- **Fighting a mechanical problem with tuning.** A sticking valve (stiction) or backlash makes a loop cycle whatever the gains. Check the actuator with a manual step first.

## How to chart a PID control loop in JavaScript, React or Angular

Tuning a loop means watching several signals move together at once: setpoint, process variable, controller output and its three parts, sampled tens or hundreds of times a second. The demo simulates the process and the controller in the browser every 10 ms of process time, running four times faster than real time, and streams a point every 0.1 s into two scrolling trends: the setpoint and process variable, and the controller output with its P, I and D parts.

Change **Kp**, **Ki** and **Kd** to tune the controller, and **Gain K**, **Time constant τ** and **Dead time θ** to change the process. **Step setpoint** toggles the setpoint between 40% and 60%, and **Add load disturbance** takes 15% off the process input. Lower the **Output limit** and untick **Anti-windup** to see integral windup, and set **D acts on** to error to see derivative kick. **Ziegler–Nichols** finds the ultimate gain and period for the current process and applies the classic PID rule. The readout measures each step's rise time, overshoot and settling time as it happens. Hover for values; scrolling or dragging a chart pauses it so you can zoom and pan, and **Pause** stops or restarts the run.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="control loop chart" demo="chart-realtime-performance-demo" demoLabel="real-time line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The process, the PID controller, the Ziegler–Nichols search and the step metrics are plain JavaScript; SciChart.js draws the trends as line series with a FIFO buffer. The React and Angular versions chart a logged loop from your own data.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        FastLineRenderableSeries,
        XyDataSeries,
        LegendModifier,
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
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Process (%)", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 100) })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { id: "output", axisTitle: "Output (%)", axisAlignment: EAxisAlignment.Right, visibleRange: new NumberRange(0, 100) })
        );

        // Logged samples from your controller: time (s), setpoint, process variable and controller output (%)
        const { time, setpoint, processVariable, output } = getYourControlLoopData();
        const line = (name: string, y: number[], stroke: string, extra = {}) =>
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: time, yValues: y, dataSeriesName: name }),
                stroke,
                strokeThickness: 2,
                ...extra
            });
        sciChartSurface.renderableSeries.add(
            line("Setpoint", setpoint, "#F48420", { strokeDashArray: [6, 4] }),
            line("Process variable", processVariable, "#50C7E0"),
            line("Controller output", output, "#FFFFFF", { yAxisId: "output" })
        );
        sciChartSurface.chartModifiers.add(
            new LegendModifier({ showCheckboxes: true }),
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const ControlLoopChart = () => (
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
        EAxisAlignment,
        FastLineRenderableSeries,
        XyDataSeries,
        LegendModifier,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-control-loop-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class ControlLoopChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisTitle: "Process (%)", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 100) })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { id: "output", axisTitle: "Output (%)", axisAlignment: EAxisAlignment.Right, visibleRange: new NumberRange(0, 100) })
            );

            // Logged samples from your controller: time (s), setpoint, process variable and controller output (%)
            const { time, setpoint, processVariable, output } = getYourControlLoopData();
            const line = (name: string, y: number[], stroke: string, extra = {}) =>
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: time, yValues: y, dataSeriesName: name }),
                    stroke,
                    strokeThickness: 2,
                    ...extra
                });
            sciChartSurface.renderableSeries.add(
                line("Setpoint", setpoint, "#F48420", { strokeDashArray: [6, 4] }),
                line("Process variable", processVariable, "#50C7E0"),
                line("Controller output", output, "#FFFFFF", { yAxisId: "output" })
            );
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

- Each trend is a `FastLineRenderableSeries` over an `XyDataSeries` with `fifoCapacity`, so old samples drop off automatically as new ones arrive; the demo sets the time axis's `visibleRange` to the last 60 seconds after each update.
- The two charts share one time window, and a `SciChartVerticalGroup` lines up their axes so the setpoint step and the output's response sit directly above each other.
- The output limit is a `HorizontalLineAnnotation` that moves with the Output limit slider.
- A timer runs the simulation and appends the new samples in one `appendRange` call per series, about 60 times a second; `addDeletable` stops the timer when the chart is deleted.

**See it in the demo app:** [JavaScript real-time chart](https://www.scichart.com/demo/javascript/chart-realtime-performance-demo) · [React real-time chart](https://www.scichart.com/demo/react/chart-realtime-performance-demo) · [Angular real-time chart](https://www.scichart.com/demo/angular/chart-realtime-performance-demo), and for linked charts that pan and zoom together, [JavaScript synchronised charts](https://www.scichart.com/demo/javascript/sync-multi-chart) · [React synchronised charts](https://www.scichart.com/demo/react/sync-multi-chart) · [Angular synchronised charts](https://www.scichart.com/demo/angular/sync-multi-chart).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), [real-time updates and FIFO data series](/2d-charts/chart-types/data-series-api/realtime-updates/), [synchronising multiple charts](/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/) and the [horizontal line annotation](/2d-charts/annotations-api/horizontal-line-annotation/). Our guides to the [strip chart](/learn/real-time/strip-chart/) and the [low-pass filter](/learn/applications/signal-processing/low-pass-filter/) cover scrolling trends and the filter used on the D term. For how industry uses SciChart, see the [HMI and SCADA](https://www.scichart.com/scada-big-data/) and [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/) pages.

## Frequently asked questions

### What does a PID controller do?

A PID controller holds a measured quantity, such as a temperature, a pressure or a motor speed, at a target value called the setpoint. Many times a second it subtracts the measurement from the setpoint to get the error, and sets its output (a heater's power, a valve's opening, a motor's voltage) from three terms: proportional to the error now, to the error added up over time, and to how fast the error is changing.

### How do you tune a PID controller?

Start with the integral and derivative gains at zero. Raise the proportional gain until the loop responds quickly to a setpoint step with a little overshoot, then add integral gain until the offset disappears in a reasonable time without slow oscillation. Add derivative gain last, only if the loop overshoots and the measurement is clean, to damp it. Make one change at a time and test each with a small setpoint step and a load disturbance. Ziegler–Nichols or lambda tuning give a starting point from a measured test.

### What is the Ziegler–Nichols tuning method?

The Ziegler–Nichols closed-loop method, published in 1942, finds the ultimate gain Ku, the proportional-only gain at which the loop oscillates with a steady amplitude, and the period Tu of that oscillation. A PID controller then gets Kp = 0.6 Ku, an integral time of Tu/2 and a derivative time of Tu/8. The rules aim for a quarter-amplitude decay, so they give an aggressive, oscillatory response that usually needs detuning.

### What are rise time, overshoot and settling time?

They describe a step response. Rise time is how long the output takes to go from 10% to 90% of the step. Overshoot is how far it peaks beyond the new value, as a percentage of the step. Settling time is how long after the step it takes to enter, and stay inside, a band around the final value, usually plus or minus 2%. Steady-state error is the gap left between the setpoint and the output once everything has settled.

### What is integral windup?

Integral windup happens when the controller's output hits a limit, such as a valve fully open, while the error persists. The integral term keeps adding up error that the saturated actuator can't act on, and when the process finally reaches the setpoint the oversized integral holds the output high, causing a large overshoot. Anti-windup stops or bleeds off the integration while the output is saturated.

### How do I simulate and chart a PID loop in JavaScript?

Write the process as a difference equation (for a first-order process with dead time, an Euler step plus a buffer for the delay) and the PID as a function called once per sample with the setpoint and the measurement. Run both in a timer, append each sample of setpoint, process variable and controller output to line series with a FIFO capacity, and scroll the time axis. SciChart.js does this with FastLineRenderableSeries and XyDataSeries in plain JavaScript, React or Angular.

## Sources

- Ziegler, J. G. and Nichols, N. B. (1942), [Optimum settings for automatic controllers](https://doi.org/10.1115/1.4019264). *Transactions of the ASME*, 64, 759–768. The closed-loop and reaction-curve tuning rules.
- Callender, A., Hartree, D. R. and Porter, A. (1936), [Time-lag in a control system](https://doi.org/10.1098/rsta.1936.0007). *Philosophical Transactions of the Royal Society A*, 235. Early published tuning rules for controllers with dead time.
- Åström, K. J. and Murray, R. M. (2021), [*Feedback Systems: An Introduction for Scientists and Engineers*](https://fbswiki.org/wiki/index.php/Feedback_Systems:_An_Introduction_for_Scientists_and_Engineers), 2nd edition, Princeton University Press (free online). Step response specifications, PID control, Ziegler–Nichols tuning, relay feedback, windup, derivative filtering and setpoint weighting.
- Åström, K. J. and Hägglund, T. (2006), *Advanced PID Control*, ISA. Controller forms, anti-windup, the relay autotuner and tuning rules.
- Skogestad, S. (2003), [Simple analytic rules for model reduction and PID controller tuning](https://doi.org/10.1016/S0959-1524(02)00062-8). *Journal of Process Control*, 13(4), 291–309. The SIMC (lambda-style) rules for FOPDT models.
- Cohen, G. H. and Coon, G. A. (1953), Theoretical consideration of retarded control. *Transactions of the ASME*, 75, 827–834.
- Desborough, L. and Miller, R. (2002), Increasing customer value of industrial control performance monitoring. *Chemical Process Control VI*, AIChE Symposium Series 98(326), 169–189. Reports Honeywell's survey of 11,000 industrial controllers.
- Ogata, K. (2010), *Modern Control Engineering*, 5th edition, Pearson. Transient response specifications and the second-order overshoot formula.

<LearnCta position="bottom" chart="control loop chart" demo="chart-realtime-performance-demo" demoLabel="real-time line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
