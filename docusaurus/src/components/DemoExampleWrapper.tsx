type Props = { src: string; label: string };

export const DemoExampleWrapper = (props: Props) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <a href={`https://demo.scichart.com/${props.src}`}>{props.label}</a>
            <iframe src={`https://demo.scichart.com/iframe/${props.src}`} width="600" height="400"></iframe>
        </div>
    );
};
