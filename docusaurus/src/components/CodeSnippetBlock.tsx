import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export function CodeSnippetBlock({ children, labels = ["TS", "JS"] }) {
    const codeBlocks = Array.isArray(children) ? children : [children];

    if (labels.length === 1)
        return (
            <Tabs>
                <TabItem value={children} label={labels[0]}>
                    {children}
                </TabItem>
            </Tabs>
        );
    return (
        <Tabs>
            {codeBlocks.map((child, index) => (
                <TabItem key={index} value={index.toString(10)} label={labels[index]}>
                    {child}
                </TabItem>
            ))}
        </Tabs>
    );
}
