import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export function CodeSnippetBlock({ children, labels = ["TS", "JS"] }) {
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
