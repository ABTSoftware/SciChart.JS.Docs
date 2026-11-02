import * as React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import {
    CandleInterval,
    filterStudyMenuItems,
    groupStudyMenuItems,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    RSIStudy,
    SMAStudy,
    STUDY_MENU_ITEMS,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, StudyList, useSciTraderTheme } from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { useSampleData } from "../../framework/useSampleData";
import { SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * Adding, editing and removing studies. "Add" is a picker built here in a few lines, on the SDK's
 * study catalogue (`STUDY_MENU_ITEMS`), search (`filterStudyMenuItems`, `groupStudyMenuItems`) and
 * `studyProvider`. "Manage" is the SDK's `StudyList`: each study opens its `StudySettingsForm`,
 * whose edits apply to the chart as you make them.
 */
export default function StudiesUiExample(): JSX.Element {
    const { loaded, error } = useSampleData();
    const [chart, setChart] = React.useState<ISciFinanceChartPanelApi>();
    const [tab, setTab] = React.useState<"add" | "manage">("manage");
    const theme = useSciTraderTheme();

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: SAMPLE_EXCHANGE,
            symbol: "BTCUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            lockPeriodWidth: false,
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new RSIStudy()],
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; the theme then follows through setTheme
        []
    );

    React.useEffect(() => {
        chart?.financeApi.setTheme(theme);
    }, [chart, theme]);

    return (
        <ExamplePage
            title="Studies UI"
            description={
                <>
                    Add indicators from the catalogue, searched with <code>filterStudyMenuItems</code> and created by{" "}
                    <code>studyProvider</code>. <code>StudyList</code> edits or removes the ones attached: expand a
                    study to change its inputs and colours live; they are saved with the chart.
                </>
            }
            ready={chart !== undefined}
            error={error}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    {loaded && (
                        <SciFinanceChartView
                            config={config}
                            useSubCharts={false}
                            onInit={(api) => {
                                (window as unknown as { __example?: unknown }).__example = api;
                                setChart(api);
                            }}
                        />
                    )}
                </div>
                <div
                    style={{
                        width: 360,
                        display: "flex",
                        flexDirection: "column",
                        background: "var(--st-ui-background, #2b2839)",
                    }}
                >
                    <Tabs value={tab} onChange={(_e, next) => setTab(next)} variant="fullWidth">
                        <Tab value="add" label="Add" data-testid="studies-tab-add" />
                        <Tab value="manage" label="Manage" data-testid="studies-tab-manage" />
                    </Tabs>
                    <div style={{ flex: 1, overflow: "auto" }}>
                        {chart &&
                            (tab === "add" ? (
                                <StudyPicker chart={chart} onAdded={() => setTab("manage")} />
                            ) : (
                                <StudyList chart={chart.financeApi} />
                            ))}
                    </div>
                </div>
            </div>
        </ExamplePage>
    );
}

/**
 * A minimal "add indicator" picker: a search box over the SDK's study catalogue, grouped by
 * category. Clicking a study creates it with `studyProvider` and attaches it to the chart.
 */
function StudyPicker({ chart, onAdded }: { chart: ISciFinanceChartPanelApi; onAdded: () => void }): JSX.Element {
    const [query, setQuery] = React.useState("");
    const groups = groupStudyMenuItems(filterStudyMenuItems(STUDY_MENU_ITEMS, { query }));

    const add = async (type: string) => {
        const study = studyProvider.getStudy(type);

        if (study) {
            await chart.financeApi.attachStudy(study);
            onAdded();
        }
    };

    return (
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <TextField
                size="small"
                placeholder="Search indicators"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                inputProps={{ "aria-label": "Search indicators" }}
            />
            {groups.map((group) => (
                <div key={group.category}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.6, margin: "4px 0" }}>
                        {group.category}
                    </div>
                    {group.items.map((item) => (
                        <button
                            key={item.type}
                            type="button"
                            disabled={item.disabled}
                            onClick={() => add(item.type)}
                            data-testid={`add-${item.type}`}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "6px 8px",
                                border: 0,
                                borderRadius: 4,
                                background: "transparent",
                                color: "inherit",
                                font: "inherit",
                                textAlign: "left",
                                cursor: "pointer",
                            }}
                        >
                            <strong>{item.label}</strong> <span style={{ opacity: 0.6 }}>{item.description}</span>
                        </button>
                    ))}
                </div>
            ))}
            {groups.length === 0 && <div style={{ opacity: 0.6 }}>No indicators match.</div>}
        </div>
    );
}
