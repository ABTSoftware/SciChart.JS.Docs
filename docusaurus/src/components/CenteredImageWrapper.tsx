export default function CenteredImageWrapper({src, title}: {
    src: string, 
    title: string, 
    height?: string | number
}) {
    return (
        <div style={{ width: "85%", margin: "0 auto" }}>
            <img
                src={src}
                alt={title}
                title={title}
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    objectFit: "contain"
                }}
            />
            <p style={{ textAlign: "center" }}>{title}</p>
        </div>
    )
}