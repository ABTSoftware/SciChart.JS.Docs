export default function CenteredImageWrapper({src, title, height = 600}: {
    src: string, 
    title: string, 
    height?: string | number
}) {
    return (
        <div style={{ width: "100%", height: `${height}`, margin: "0 auto" }}>
            <img
                src={src}
                alt={title}
                title={title}
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: `${height}`,
                    objectFit: "contain"
                }}
            />
            <p style={{ textAlign: "center" }}>{title}</p>
        </div>
    )
}