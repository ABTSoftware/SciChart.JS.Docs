import React from "react";
import Link from "@docusaurus/Link";
import styles from "./LearnCta.module.css";

// Calls to action for the learning center (docs/learn/). Use one near the top of each page, after the live
// demo, and one at the end:
//   <LearnCta position="top" chart="candlestick chart" demo="candlestick-chart"
//       docs="/2d-charts/chart-types/fast-candlestick-renderable-series/" />
//   <LearnCta position="bottom" ...same props />
// - chart: the chart name as it reads in a sentence.
// - demo: the chart's slug in the demo app; links go to /demo/javascript|react|angular/<demo>.
// - docs: the chart's API documentation page (a docs path). docsLabel overrides its link text, which is
//   otherwise "SciChart.js <chart> documentation".
// All are optional, for pages about no single chart (the hub). Rules for learn pages: docs/learn/CLAUDE.md.
// Each link carries data-cta, so Google Tag Manager can count clicks per position and button.
//
// SEO: Google reads a link's text (its anchor text), not its title attribute. The demo pills show a short
// label ("React") but their full link text is "React candlestick chart": the rest is visually hidden, read
// by screen readers and search engines. That text matches the search the demo page targets.

const GET_STARTED_URL = "https://www.scichart.com/getting-started/scichart-javascript/";
const DEMO_BASE_URL = "https://www.scichart.com/demo/";
const FEATURES_URL = "https://www.scichart.com/javascript-chart-features/";
const PRICING_URL = "https://www.scichart.com/shop/";
const FRAMEWORKS = [
    { key: "javascript", label: "JavaScript" },
    { key: "react", label: "React" },
    { key: "angular", label: "Angular" }
];

type Props = {
    position: "top" | "bottom";
    chart?: string;
    demo?: string;
    docs?: string;
    docsLabel?: string;
};

function DemoAndDocsLinks({ position, chart, demo, docs, docsLabel }: Props) {
    if (!demo && !docs) return null;
    return (
        <p className={styles.links}>
            {demo && (
                <>
                    <span className={styles.linksLabel}>Live demo:</span>{" "}
                    {FRAMEWORKS.map((f, i) => (
                        <React.Fragment key={f.key}>
                            <a
                                className={styles.chip}
                                href={`${DEMO_BASE_URL}${f.key}/${demo}`}
                                title={chart ? `${f.label} ${chart}` : `${f.label} chart demos`}
                                data-cta={`learn-${position}-demo-${f.key}`}
                            >
                                {f.label}
                                {chart && <span className={styles.visuallyHidden}> {chart}</span>}
                            </a>
                        </React.Fragment>
                    ))}
                </>
            )}
            {demo && docs && <span className={styles.separator}>|</span>}
            {docs && (
                <Link className={styles.docsLink} to={docs} data-cta={`learn-${position}-docs`}>
                    {docsLabel ?? (chart ? `SciChart.js ${chart} documentation` : "SciChart.js documentation")}
                </Link>
            )}
        </p>
    );
}

export default function LearnCta(props: Props) {
    const { position, chart } = props;
    const what = chart ? `an interactive ${chart}` : "interactive charts";

    if (position === "top") {
        return (
            <aside className={`${styles.cta} ${styles.top}`} aria-label="Build this chart with SciChart.js">
                <div className={styles.topRow}>
                    <p className={styles.text}>
                        <strong>Build {what}</strong> in JavaScript, React or Angular with SciChart.js, the
                        high-performance WebGL chart library.
                    </p>
                    <div className={styles.buttons}>
                        <a className={`${styles.button} ${styles.primary}`} href={GET_STARTED_URL} data-cta="learn-top-get-started">
                            Get started free
                        </a>
                    </div>
                </div>
                <DemoAndDocsLinks {...props} />
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
                {!props.demo && (
                    <a className={`${styles.button} ${styles.secondary} ${styles.large}`} href={`${DEMO_BASE_URL}javascript/`} data-cta="learn-bottom-demo">
                        Explore the demos
                    </a>
                )}
            </div>
            <DemoAndDocsLinks {...props} />
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
