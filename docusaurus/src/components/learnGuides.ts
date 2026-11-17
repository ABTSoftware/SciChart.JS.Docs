import { usePluginData } from "@docusaurus/useGlobalData";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import type { LearnGuide, LearnGuidesData } from "../../custom-plugins/learnGuidesPlugin";

export type { LearnGuide };

// All learning center guides, from the learn-guides plugin (custom-plugins/learnGuidesPlugin.ts)
export function useLearnGuides(): LearnGuide[] {
    const data = usePluginData("learn-guides") as LearnGuidesData | undefined;
    return data?.guides ?? [];
}

// The learn guide being shown, or undefined on every other page (hubs and the rest of the docs).
// Must be called inside a doc page (it uses useDoc).
export function useCurrentLearnGuide(): LearnGuide | undefined {
    const { metadata } = useDoc();
    const guides = useLearnGuides();
    const id = metadata.id.replace(/\/index$/, "");
    return guides.find((g) => g.id === id);
}
