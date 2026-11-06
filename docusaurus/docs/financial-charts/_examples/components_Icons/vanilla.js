import "scichart-scitrader/scitrader.css";
import { SCITRADER_ICONS, sciTraderIconSvg } from "scichart-scitrader";
// This example expects this HTML:
// <div id="gallery"></div>
// Every icon name, from SCITRADER_ICONS: "pencil", "drawingList", "fx", ...
const names = Object.keys(SCITRADER_ICONS);
const gallery = document.getElementById("gallery");
gallery.className = "icon-gallery";
for (const name of names) {
    const card = document.createElement("div");
    card.className = "icon-card";
    // The normal look: the icon fills with currentColor, so it takes the button's text colour
    const button = document.createElement("button");
    button.className = "icon-button";
    button.setAttribute("aria-label", name); // the icon is hidden from assistive technology: label the button
    button.innerHTML = sciTraderIconSvg(name, { width: 24, height: 24 });
    card.appendChild(button);
    // The "selected" look, for icons that have one: filled with the theme's brand gradient
    if (SCITRADER_ICONS[name].selectedBody) {
        const selected = document.createElement("button");
        selected.className = "icon-button";
        selected.setAttribute("aria-label", `${name}, selected`);
        selected.innerHTML = sciTraderIconSvg(name, { width: 24, height: 24, selected: true });
        card.appendChild(selected);
    }
    const label = document.createElement("code");
    label.textContent = name;
    card.appendChild(label);
    gallery.appendChild(card);
}
// The gallery's look. The icon buttons are plain CSS: style the button, and the icon follows its colour
const style = document.createElement("style");
style.textContent = `
    .icon-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        align-content: start;
        gap: 12px;
        height: 100%;
        box-sizing: border-box;
        padding: 16px;
        background: var(--st-ui-background, #2b2839);
        font-family: var(--st-font-family, sans-serif);
    }
    .icon-card {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        border-radius: 6px;
        background: var(--st-ui-surface, #373447);
    }
    .icon-card code {
        width: 100%;
        text-align: center;
        color: var(--st-ui-text-muted, #9da2bc);
        font-size: 12px;
    }
    .icon-button {
        display: inline-flex;
        padding: 6px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--st-ui-icon, #e5e7eb); /* the icon's colour */
        cursor: pointer;
    }
    .icon-button:hover {
        background: rgb(255 255 255 / 0.08);
        color: #ffffff;
    }
`;
document.head.appendChild(style);
