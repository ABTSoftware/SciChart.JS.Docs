import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import CodeInline from "@theme/CodeInline";
import ChartPreviewWrapper from "@site/src/components/ChartPreviewWrapper";
import { CodeSnippetBlock } from "@site/src/components/CodeSnippetBlock";
import { DemoExampleWrapper } from "@site/src/components/DemoExampleWrapper";
import CenteredImageWrapper from "../components/CenteredImageWrapper";
import LiveDocSnippet from "../components/LiveDocSnippet";
import LearnCta from "../components/LearnCta";
import ChartFromSciChartDemo from "../components/ChartFromSciChartDemo";
import MinimizedImageAndTextHeader from "../components/MinimizedImageAndTextHeader";
import StatusEmoji from "../components/StatusEmoji";
import { YouTubeVideo } from "../components/YouTubeVideo";
import LearnByline from "../components/LearnByline";
import { useLocation } from "@docusaurus/router";

// A learning center page's H1 is followed by its byline (author, published and updated dates) and article schema.
// Only learn pages (under /learn/) get it; every other page's H1 is unchanged.
function H1(props: Record<string, unknown>) {
    const { pathname } = useLocation();
    const heading = React.createElement(MDXComponents.h1, props);
    if (!/\/learn(\/|$)/.test(pathname)) return heading;
    return React.createElement(React.Fragment, null, heading, React.createElement(LearnByline));
}

// Inline code in a Financial Charts table, given optional line breaks (<wbr />) by
// custom-plugins/remarkTableCodeBreaks. The default `code` component renders code whose children
// aren't all text as a code block, so render this as inline code ourselves
function Code(props: { "data-table-code"?: string; children?: React.ReactNode }) {
    if (props["data-table-code"] !== undefined) {
        const { "data-table-code": _, ...rest } = props;
        return React.createElement(CodeInline, rest);
    }
    return React.createElement(MDXComponents.code, props);
}

export default {
    // Re-use the default mapping
    ...MDXComponents,
    code: Code,
    h1: H1,
    // Map the "<ChartPreviewWrapper>" tag to our ChartPreviewWrapper component
    // `ChartPreviewWrapper` will receive all props that were passed to `<ChartPreviewWrapper>` in MDX
    ChartPreviewWrapper,
    CodeSnippetBlock,
    CenteredImageWrapper,
    LiveDocSnippet,
    LearnCta,
    DemoExampleWrapper,
    ChartFromSciChartDemo,
    YouTubeVideo,
    MinimizedImageAndTextHeader,
    StatusEmoji
};
