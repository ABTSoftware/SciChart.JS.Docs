import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import ChartPreviewWrapper from "@site/src/components/ChartPreviewWrapper";
import { CodeSnippetBlock } from "@site/src/components/CodeSnippetBlock";
import { DemoExampleWrapper } from "@site/src/components/DemoExampleWrapper";
import CenteredImageWrapper from "../components/CenteredImageWrapper";
import LiveDocSnippet from "../components/LiveDocSnippet";
import ChartFromSciChartDemo from "../components/ChartFromSciChartDemo";
import MinimizedImageAndTextHeader from "../components/MinimizedImageAndTextHeader";
import { YouTubeVideo } from "../components/YouTubeVideo";

export default {
    // Re-use the default mapping
    ...MDXComponents,
    // Map the "<ChartPreviewWrapper>" tag to our ChartPreviewWrapper component
    // `ChartPreviewWrapper` will receive all props that were passed to `<ChartPreviewWrapper>` in MDX
    ChartPreviewWrapper,
    CodeSnippetBlock,
    CenteredImageWrapper,
    LiveDocSnippet,
    DemoExampleWrapper,
    ChartFromSciChartDemo,
    YouTubeVideo,
    MinimizedImageAndTextHeader
};
