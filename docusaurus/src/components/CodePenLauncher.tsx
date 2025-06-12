type Props = {
    html?: string;
    js?: string;
    css?: string;
    title?: string;
};

export const CodePenLauncher: React.FC<Props> = ({ html, js, css, title = "Demo" }) => {
    const openInCodePen = () => {
        if (!js) {
            return;
        }
        const form = document.createElement("form");
        form.action = "https://codepen.io/pen/define";
        form.method = "POST";
        form.target = "_blank";

        const data = {
            title,
            html,
            js,
            css,
            js_pre_processor: "typescript",
            editors: "0010", // HTML, CSS, JS, Console
            layout: "left",
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
        <nav className="codepen-nav">
            <style>{
                `.codepen-nav {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    background-color: rgb(8,13,51);

                    .scichart {
                        display: flex;
                        padding: 0.5rem 1rem;
                        align-items: center;
                        color: #CCCCCC;
                        font-size: 1.5rem;

                        > div {
                            width: 2rem;
                            height: 2rem;
                        }
                    }

                    span, svg {
                        color: #CCCCCC;
                        transition: all 0.2s;
                    }

                    button {
                        all: unset;
                        cursor: pointer;
                        display: flex;
                        color: white;
                        padding: 0.4rem 0.8rem;
                        margin-left: auto;
                        display: flex;
                        flex-direction: column;
                        align-items: end;

                        .codepen_logo {
                            width: 100px;
                            margin-bottom: -2px;
                        }
                    }

                    &:hover {
                        span, svg {
                            color: #FFFFFF;
                        }
                    }
                }`
            }</style>

            <div className="scichart">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="3 3 18 18">
                        <path stroke="#007bb0" strokeWidth="1.1" d="M 13.1 5.85, l -4.7 3.55 M 13.5 14.5, l -4.7 3.55 M 8.6 10.65, l 4.7 2.8" />
                        <path stroke="#ed7465" strokeWidth="0.68" d="M 16.19 7.15, l -3.32 2.56, 3.5 2.1"/>
                        
                        <g stroke="#007bb0" strokeWidth="0.6">
                            <circle cx="7.85" cy="10.15" r="1"/>
                            <circle cx="13.75" cy="5.35" r="1"/>
                            <circle cx="14.23" cy="13.8" r="1"/>
                            <circle cx="8.05" cy="18.74" r="1"/>
                        </g>
                        
                        <g stroke="#ed7465" strokeWidth="0.8">
                            <circle cx="16.5" cy="12" r="0.4"/>
                            <circle cx="16.5" cy="6.95" r="0.4"/>
                            <circle cx="12.9" cy="9.6" r="0.4"/>
                        </g>
                    </svg>
                </div>
                <strong>SCI</strong>CHART
            </div>

            <button 
                className="prefill-edit-button" 
                onClick={openInCodePen} 
                disabled={!js} 
                title="Open in CodePen" 
                aria-label="Open in CodePen"
            >
                <span style={{fontSize: 9}}>E D I T &nbsp; O N&nbsp;</span>
                <div className="codepen_logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} viewBox="0 0 138 26" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="CodePen">
                        <path d="M80 6h-9v14h9m34-14h-9v14h9m-3-7h-6m-28 0h-6m51 7V6l11 14V6M22 16.7L33 24l11-7.3V9.3L33 2 22 9.3v7.4zm22 0L33 9.3l-11 7.4m0-7.4l11 7.3 11-7.3M33 2v7.3m0 7.4V24m55-10h6c2.2 0 4-1.8 4-4s-1.8-4-4-4h-6v14M15 8c-1.3-1.3-3-2-5-2-4 0-7 3-7 7s3 7 7 7c2 0 3.7-.8 5-2m49-5c0 4-3 7-7 7h-5V6h5c4 0 7 3 7 7z"></path>
                    </svg>
                </div>
            </button>

        </nav>
    );
};
