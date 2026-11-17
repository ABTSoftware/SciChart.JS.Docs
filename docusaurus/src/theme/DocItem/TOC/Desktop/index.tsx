import React from "react";
import Desktop from "@theme-original/DocItem/TOC/Desktop";
import type DesktopType from "@theme/DocItem/TOC/Desktop";
import type { WrapperProps } from "@docusaurus/types";
import SciChartIntroCard from "@site/src/components/SciChartIntroCard";
import styles from "./styles.module.css";

// The right-hand table of contents (desktop only), with the "introduce SciChart" card below it. The TOC and
// the card share one sticky column: the card always shows in full and the TOC scrolls in the space left.
type Props = WrapperProps<typeof DesktopType>;

export default function DesktopWrapper(props: Props): React.ReactElement {
    return (
        <div className={styles.column}>
            <Desktop {...props} />
            <SciChartIntroCard />
        </div>
    );
}
