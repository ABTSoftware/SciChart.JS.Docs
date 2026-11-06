/**
 * Remark plugin: inline code inside table cells gets optional line breaks (<wbr />) at word
 * boundaries, so long identifiers such as `ETradingAnnotationType.HorizontalTrendLineAnnotation` or
 * `getDefaultDescriptor()` wrap inside their cell on a phone instead of widening the table past the
 * screen. <wbr /> only breaks when the cell is too narrow, so wide screens are unchanged, and it isn't
 * copied with the text.
 *
 * Breaks go between a lowercase letter or digit and a capital (camelCase), and after ".", ",", "(",
 * "_", "/", "|", "<", ":", "-" and spaces. Applies to the pages whose path matches `include`.
 */
type TNode = { type: string; value?: string; children?: TNode[]; [key: string]: unknown };

const BREAK = /(?<=[a-z0-9])(?=[A-Z])|(?<=[.,(_/|<: -])(?=.)/;

const text = (value: string): TNode => ({ type: "text", value });
const wbr = (): TNode => ({ type: "mdxJsxTextElement", name: "wbr", attributes: [], children: [] });

function codeWithBreaks(value: string): TNode {
    const parts = value.split(BREAK).filter((part) => part.length > 0);
    const children = parts.flatMap((part, i) => (i === 0 ? [text(part)] : [wbr(), text(part)]));
    // data-table-code: src/theme/MDXComponents.ts renders it as inline code (see there)
    const marker = { type: "mdxJsxAttribute", name: "data-table-code", value: "true" };
    return { type: "mdxJsxTextElement", name: "code", attributes: [marker], children };
}

function walk(node: TNode, inCell: boolean): void {
    if (!node.children) return;
    const cell = inCell || node.type === "tableCell";
    node.children = node.children.map((child) => {
        if (cell && child.type === "inlineCode" && typeof child.value === "string" && BREAK.test(child.value)) {
            return codeWithBreaks(child.value);
        }
        walk(child, cell);
        return child;
    });
}

export default function remarkTableCodeBreaks(options: { include?: RegExp } = {}) {
    const include = options.include ?? /./;
    return (tree: TNode, file: { path?: string; history?: string[] }) => {
        const path = file.path ?? file.history?.[0] ?? "";
        if (include.test(path)) walk(tree, false);
    };
}
