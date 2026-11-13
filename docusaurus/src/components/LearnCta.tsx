import React from "react";
import styles from "./LearnCta.module.css";

// Calls to action for the learning center (docs/learn/). Use one near the top of each page, after the live
// demo, and one at the end:
//   <LearnCta position="top" chart="candlestick chart" demo="candlestick-chart" />
//   <LearnCta position="bottom" chart="candlestick chart" demo="candlestick-chart" />
// `chart` is the chart name as it reads in a sentence; `demo` is the chart's slug in the demo app
// (https://www.scichart.com/demo/javascript/<demo>). Both are optional, for pages about no single chart.
// Each link carries data-cta, so Google Tag Manager can count clicks per position and button.

const GET_STARTED_URL = "https://www.scichart.com/getting-started/scichart-javascript/";
const DEMOS_URL = "https://www.scichart.com/demo/javascript/";
const FEATURES_URL = "https://www.scichart.com/javascript-chart-features/";
const PRICING_URL = "https://www.scichart.com/shop/";

type Props = {
    position: "top" | "bottom";
    chart?: string;
    demo?: string;
};

export default function LearnCta({ position, chart, demo }: Props) {
    const demoUrl = demo ? `${DEMOS_URL}${demo}` : DEMOS_URL;
    const what = chart ? `an interactive ${chart}` : "interactive charts";

    if (position === "top") {
        return (
            <aside className={`${styles.cta} ${styles.top}`} aria-label="Build this chart with SciChart.js">
                <p className={styles.text}>
                    <strong>Build {what}</strong> in JavaScript, React or Angular with SciChart.js, the high-performance
                    WebGL chart library.
                </p>
                <div className={styles.buttons}>
                    <a className={`${styles.button} ${styles.primary}`} href={GET_STARTED_URL} data-cta="learn-top-get-started">
                        Get started free
                    </a>
                    <a className={`${styles.button} ${styles.secondary}`} href={demoUrl} data-cta="learn-top-demo">
                        {chart ? "See the live demo" : "Explore the demos"}
                    </a>
                </div>
            </aside>
        );
    }

    return (
        <aside className={`${styles.cta} ${styles.bottom}`} aria-label="Start building with SciChart.js">
            <h2 className={styles.heading}>Build {chart ? `your own ${chart}` : "your own charts"} with SciChart.js</h2>
            <ul className={styles.points}>
                <li>
                    <strong>Fast:</strong> WebGL and WebGPU rendering keeps charts smooth with millions of points and
                    real-time updates.
                </li>
                <li>
                    <strong>Your stack:</strong> JavaScript, TypeScript, React and Angular, with full source code for every
                    demo.
                </li>
                <li>
                    <strong>Free to start:</strong> a free community license for non-commercial use, and commercial
                    licenses with technical support.
                </li>
            </ul>
            <div className={styles.buttons}>
                <a className={`${styles.button} ${styles.primary} ${styles.large}`} href={GET_STARTED_URL} data-cta="learn-bottom-get-started">
                    Get started free
                </a>
                <a className={`${styles.button} ${styles.secondary} ${styles.large}`} href={demoUrl} data-cta="learn-bottom-demo">
                    {chart ? "See the live demo" : "Explore the demos"}
                </a>
            </div>
            <p className={styles.small}>
                <a href={FEATURES_URL} data-cta="learn-bottom-features">
                    All SciChart.js features
                </a>
                {" · "}
                <a href={PRICING_URL} data-cta="learn-bottom-pricing">
                    Licensing and pricing
                </a>
            </p>
        </aside>
    );
}
