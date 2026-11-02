import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import { EStudyType, studyProvider } from "scichart-scitrader";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample, setTheme, THEMES } from "./drawExample";

export default function ThemesExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);
    const [themeName, setThemeName] = React.useState(THEMES[0].name);

    // The toggle shows whatever theme the chart has, including one set by the Sandbox header.
    React.useEffect(() => {
        if (!api) {
            return undefined;
        }
        const onThemeChanged = (theme: { name: string }) => setThemeName(theme.name);
        setThemeName(api.financeApi.theme.name);
        api.financeApi.themeChanged.subscribe(onThemeChanged);
        return () => api.financeApi.themeChanged.unsubscribe(onThemeChanged);
    }, [api]);

    const toolbar = (
        <>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={themeName}
                onChange={(_e, next: string | null) => {
                    const theme = THEMES.find((t) => t.name === next);
                    if (theme && api) {
                        setThemeName(theme.name);
                        setTheme(api, theme);
                    }
                }}
            >
                {THEMES.map((t) => (
                    <ToggleButton key={t.name} value={t.name} data-testid={`theme-${t.name}`}>
                        {t.name}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            {/* Studies added later take the chart's current theme too. */}
            <Button
                size="small"
                variant="outlined"
                disabled={!api}
                onClick={() => api.financeApi.attachStudy(studyProvider.getStudy(EStudyType.EMA))}
                data-testid="add-ema"
            >
                Add EMA
            </Button>
        </>
    );

    return (
        <ExamplePage
            title="Themes"
            description={
                <>
                    A theme is one <code>ISciTraderTheme</code> object holding every colour the chart uses. Pass it as{" "}
                    <code>theme</code>, build variants with <code>createSciTraderTheme</code>, and switch a live chart
                    with <code>financeApi.setTheme</code>. The white SMA was given its colour explicitly, so it keeps
                    it; the other colours follow the theme.
                </>
            }
            toolbar={toolbar}
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
