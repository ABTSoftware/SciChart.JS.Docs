import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { SCITRADER_ICONS, TSciTraderIconName } from "scichart-scitrader";
import { SciTraderIcon } from "scichart-scitrader-react";

// Every icon name, from SCITRADER_ICONS: "pencil", "drawingList", "fx", ...
const NAMES = Object.keys(SCITRADER_ICONS) as TSciTraderIconName[];

export function IconGallery() {
    // Which icon is selected, to show the "selected" look on click
    const [selected, setSelected] = React.useState<TSciTraderIconName>("bookmark");

    return (
        <div style={galleryStyle}>
            {NAMES.map((name) => (
                <div key={name} style={cardStyle}>
                    {/* The icon is hidden from assistive technology, so label the button */}
                    <button aria-label={name} aria-pressed={selected === name} style={buttonStyle} onClick={() => setSelected(name)}>
                        {/* selected draws the theme's brand gradient, for icons that have a selected look */}
                        <SciTraderIcon name={name} width={24} height={24} selected={selected === name} />
                    </button>
                    <code style={labelStyle}>{name}</code>
                    <span style={hintStyle}>{SCITRADER_ICONS[name].selectedBody ? "has a selected look" : ""}</span>
                </div>
            ))}
        </div>
    );
}

// The gallery uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const galleryStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    alignContent: "start",
    gap: 12,
    height: "100%",
    boxSizing: "border-box",
    padding: 16,
    background: "var(--st-ui-background, #2b2839)",
    fontFamily: "var(--st-font-family, sans-serif)",
};

const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: 12,
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
};

// The icon fills with currentColor: set the button's colour, and the icon follows it
const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    padding: 6,
    border: "none",
    borderRadius: "50%",
    background: "transparent",
    color: "var(--st-ui-icon, #e5e7eb)",
    cursor: "pointer",
};

const labelStyle: React.CSSProperties = { color: "var(--st-ui-text-muted, #9da2bc)", fontSize: 12 };
const hintStyle: React.CSSProperties = { color: "var(--st-ui-text-muted, #9da2bc)", fontSize: 11, minHeight: 14 };
