export default function ChartFromSciChartDemo({
    src,
    title,
    width = "100%",
    description
}: {
    src: string;
    title: string;
    width?: string | number;
    description: string
}) {
    return (
        <div>
            <iframe src={src} style={{ width, aspectRatio: 3 / 2 }} frameBorder="0"></iframe>

            <div style={{ textAlign: "center" }}>
                Above: The JavaScript <a href={src} target="_blank">{title}</a> example
                from the <a href="https://www.scichart.com/demo/react" target="_blank">SciChart.js Demo</a> {description}
            </div>
        </div>
    );
}
