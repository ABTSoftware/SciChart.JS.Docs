type Props = {
    html?: string;
    js?: string;
    css?: string;
    title?: string;
};

export const CodePenLauncher: React.FC<Props> = ({ html, js, css, title = "Demo" }) => {
    const openInCodePen = () => {
        const form = document.createElement("form");
        form.action = "https://codepen.io/pen/define";
        form.method = "POST";
        form.target = "_blank";

        const data = {
            title,
            html,
            js,
            css,
            js_pre_processor: "typescript"
        };

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "data";
        input.value = JSON.stringify(data).replace(/"/g, "&quot;"); // Escape for HTML

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <button onClick={openInCodePen} disabled={!js}>
            {!js ? "Loading…" : "Open in CodePen"}
        </button>
    );
};
