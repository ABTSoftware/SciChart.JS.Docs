import React from "react";
import clsx from "clsx";
import Content from "@theme-original/CodeBlock/Content";
import type ContentType from "@theme/CodeBlock/Content";
import type { WrapperProps } from "@docusaurus/types";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { usePrismTheme } from "@docusaurus/theme-common";
import { useCodeBlockContext } from "@docusaurus/theme-common/internal";
import styles from "@docusaurus/theme-classic/lib/theme/CodeBlock/Content/styles.module.css";
import lineStyles from "@docusaurus/theme-classic/lib/theme/CodeBlock/Line/styles.module.css";

// Lighter code blocks, on every page: keeps the HTML small (a Bing SEO rule, see CLAUDE.md).
//
// Docusaurus highlights code with Prism while it builds the page, wrapping every token in a <span> with an inline
// colour style. On pages with long code samples that markup made up most of the HTML: on learn pages, a median of
// 288 KB of a 417 KB page, for about 17 KB of code.
//
// The HTML now carries each code block as plain text, one line per row, keeping line numbers and highlighted lines.
// Search engines and AI crawlers still read all of it. Once the page has loaded in the browser, the usual Prism
// highlighting takes over, so readers see the same coloured code as before.

type Props = WrapperProps<typeof ContentType>;

function PlainContent({ className }: Props): React.ReactElement {
    const { metadata, wordWrap } = useCodeBlockContext();
    const prismTheme = usePrismTheme();
    const { code, language, lineNumbersStart, lineClassNames } = metadata;
    const showLineNumbers = lineNumbersStart !== undefined;
    // Same line splitting as prism-react-renderer: a trailing newline does not add an empty line.
    const lines = code.replace(/\n$/, "").split("\n");

    return (
        <pre
            ref={wordWrap.codeBlockRef}
            tabIndex={0}
            className={clsx(className, `prism-code language-${language}`, styles.codeBlock, "thin-scrollbar")}
            style={{ color: prismTheme.plain.color, backgroundColor: prismTheme.plain.backgroundColor }}
        >
            <code
                className={clsx(styles.codeBlockLines, showLineNumbers && styles.codeBlockLinesWithNumbering)}
                style={showLineNumbers ? { counterReset: `line-count ${lineNumbersStart - 1}` } : undefined}
            >
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className={clsx("token-line", lineClassNames[i], showLineNumbers && lineStyles.codeLine)}
                    >
                        {showLineNumbers ? (
                            <>
                                <span className={lineStyles.codeLineNumber} />
                                <span className={lineStyles.codeLineContent}>{line}</span>
                            </>
                        ) : (
                            line
                        )}
                        <br />
                    </div>
                ))}
            </code>
        </pre>
    );
}

export default function ContentWrapper(props: Props): React.ReactElement {
    const isBrowser = useIsBrowser();

    // useIsBrowser is false while the page is built and while React hydrates it, so the plain version is what
    // goes into the HTML and the coloured one replaces it straight after hydration, with no hydration mismatch.
    if (!isBrowser) {
        return <PlainContent {...props} />;
    }
    return <Content {...props} />;
}
