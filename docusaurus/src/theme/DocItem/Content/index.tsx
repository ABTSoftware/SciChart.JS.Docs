import React from "react";
import Content from "@theme-original/DocItem/Content";
import type ContentType from "@theme/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import RelatedGuides from "@site/src/components/RelatedGuides";

// Adds the "Related guides" cards after the content of each learning center guide (above the
// "Edit this page" footer and the previous/next links). RelatedGuides renders nothing on other pages.
type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): React.ReactElement {
    return (
        <>
            <Content {...props} />
            <RelatedGuides />
        </>
    );
}
