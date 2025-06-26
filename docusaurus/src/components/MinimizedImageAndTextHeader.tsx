import useBaseUrl from '@docusaurus/useBaseUrl';

type Props = {
    imgSrc: string;
    children: React.ReactNode;
};

export default function MinimizedImageAndTextHeader(props: Props) {
    const imgUrl = useBaseUrl(props.imgSrc);
    
    return (
        <div style={{
            width: "100%",
            display: "flex",
            border: "1px solid var(--gray)",
        }}>
            <div style={{ padding: 8, borderRight: "1px solid var(--gray)" }}>
                <img 
                    src={imgUrl} 
                    alt="Minimized Header" 
                    style={{ 
                        minWidth: "min(220px, 25vw)",
                        height: "auto",
                        marginBottom: -6
                    }}
                />
            </div>

            <div style={{ padding: '8px 10px 0 10px' }}>
                {props.children}
            </div>
        </div>
    );
}
