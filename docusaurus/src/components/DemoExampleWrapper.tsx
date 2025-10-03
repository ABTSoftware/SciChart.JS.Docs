import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = { src: string; label: string };

export const DemoExampleWrapper = (props: Props) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <a href={`https://www.scichart.com/demo/${props.src}`}>{props.label}</a>
            <BrowserOnly>
                {() => <iframe src={`https://www.scichart.com/demo/iframe/${props.src}`} width="600" height="400"></iframe>}
            </BrowserOnly>
        </div>
    );
};
