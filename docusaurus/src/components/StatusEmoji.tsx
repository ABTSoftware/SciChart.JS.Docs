const SHOW_STATUS = true;

export default function StatusEmoji({status}: {status: "✅" | "⚠️" | "⭕" | "🔄"}) {
    return (
        <span>
            {SHOW_STATUS ? status : null}
        </span>
    )
}