import React from "react";

type TProps = {
  js: string;
};

const chartId = "chart_id";

export default function CodePenEmbed(props: TProps) {
  const formRef = React.useRef<HTMLFormElement>(undefined);

  React.useEffect(() => {
    formRef.current?.submit();
  }, []);

  return (
    <div id={chartId} style={{ width: "100%", aspectRatio: 3 / 2 }}>
      <iframe
        sandbox="allow-scripts allow-same-origin allow-popups"
        allow="none"
        allowFullScreen={true}
        height="100%"
        width="100%"
        name={chartId}
        scrolling="no"
        src="https://codepen.io//embed/prefill"
        style={{
          width: "100%",
          overflow: "hidden",
          display: "block",
        }}
        title="CodePen Embed"
      />
      <form
        ref={formRef}
        style={{ display: "none" }}
        method="post"
        action="https://codepen.io//embed/prefill"
        target={chartId}
      >
        <input type="hidden" name="height" value="100%" />
        <input type="hidden" name="editable" value="true" />
        <input type="hidden" name="default-tab" value="result" />
        <input type="hidden" name="theme-id" value="44333" />
        <input type="hidden" name="name" value={chartId} />
        <input
          type="hidden"
          name="data"
          value={JSON.stringify({
            description:
              "A documentation snippet for SciChart.JS from scichart.com/javascript-chart-documentation. Find out more about SciChart at scichart.com/javascript-chart-features",
            head: "<meta name='viewport' content='width=device-width, initial-scale=1'>",
            scripts: [
              "https://cdn.jsdelivr.net/npm/scichart@4.0.0-beta.770/index.min.js",
            ],
            tags: ["scichart", "documentation"],
            title: "SciChart.js documentation snippet",
            html: '<div id="scichart-root"></div>',
            css: "body { margin: 0; }\n#scichart-root { width: 100%; height: 100vh; }",
            js: props.js,
          })}
        />
      </form>
    </div>
  );
}
