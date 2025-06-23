import useBaseUrl from '@docusaurus/useBaseUrl';

export default function CenteredImageWrapper({src, title, height, width, children}: {
    src: string, 
    title: string, 
    height?: string | number,
    width?: string | number,
    children?: React.ReactNode // use children instead of the title when your text needs markdown rendering (links, bolds, etc.)
}) {
    const imgUrl = src.startsWith("http") ? src : useBaseUrl(src);
    return (
        <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        }}>
            <img
                src={imgUrl}
                alt={title}
                title={title}
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    objectFit: "contain",
                    height: height ?? "auto",
                    width: width ?? "85%", 
                    margin: "0 auto" 
                }}
            />

            <div style={{ marginInline: '3rem' }}>
                <p>{title}</p>

                {children ?? null} 
            </div>
        </div>
    )
}