type Props = { url: string; title: string };

export const YouTubeVideo = (props: Props) => {
    return (
        <div>
            <iframe
                style={{ aspectRatio: 16 / 9, width: "100%" }}
                src={props.url}
                title={props.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
            <div style={{ textAlign: "center", fontWeight: 'bold' }}>
                {props.title}
            </div>
            <br/>
        </div>
    );
};
