export default function ChartFromSciChartDemo({
    src,
    title,
    width = "100%",
    description,
    aspectRatio = 3 / 2
}: {
    src: string;
    title: string;
    width?: string | number;
    description: string
    aspectRatio?: number;
}) {
    return (
        <div style={{ width: '100%' }}>
            <iframe src={src} style={{ width, aspectRatio }} frameBorder="0"></iframe>

            <div style={{ textAlign: "center" }}>
                Above: The JavaScript <a href={src} target="_blank">{title}</a> example
                from the <a href="https://www.scichart.com/demo/react" target="_blank">SciChart.js Demo</a> {description}
            </div>
            <br/>
        </div>
    );
}
