import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export function CodeSnippetBlock({ children, labels = ["TS", "JS"] }) {
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
            {children.map((child, index) => (
                <TabItem key={index} value={index} label={labels[index]}>
                    {child}
                </TabItem>
            ))}
        </Tabs>
    );
}
