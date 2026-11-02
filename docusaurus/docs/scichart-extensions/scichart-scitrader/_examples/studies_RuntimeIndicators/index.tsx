import * as React from "react";
import Chip from "@mui/material/Chip";
import { EStudyCategory, EStudyType, STUDY_MENU_ITEMS } from "scichart-scitrader";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { addStudy, drawExample, removeStudy } from "./drawExample";

/** Everything in the menu except price types and order-book studies, which need their own data. */
const MENU = STUDY_MENU_ITEMS.filter(
    (item) => !item.disabled && item.category !== EStudyCategory.Price && item.category !== EStudyCategory.OrderBook
);

export default function RuntimeIndicatorsExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);
    const [, rerender] = React.useReducer((n: number) => n + 1, 0);

    // Re-render when studies change, whether from these chips or anywhere else.
    React.useEffect(() => {
        if (!api) {
            return undefined;
        }
        const onChange = () => rerender();
        api.financeApi.studiesChanged.subscribe(onChange);
        return () => api.financeApi.studiesChanged.unsubscribe(onChange);
    }, [api]);

    const attached = (type: EStudyType) => api?.financeApi.studies.find((s) => s.type === type);

    const toggle = (type: EStudyType) => {
        const study = attached(type);
        if (study) {
            removeStudy(api, study);
        } else {
            addStudy(api, type);
        }
    };

    const toolbar = MENU.map((item) => (
        <Chip
            key={item.type}
            label={item.label}
            title={item.description}
            size="small"
            clickable
            disabled={!api}
            color={attached(item.type) ? "primary" : "default"}
            variant={attached(item.type) ? "filled" : "outlined"}
            onClick={() => toggle(item.type)}
            data-testid={`toggle-${item.type}`}
        />
    ));

    return (
        <ExamplePage
            title="Add and Remove Indicators at Runtime"
            description={
                <>
                    <code>studyProvider.getStudy(type)</code> creates any study from its type, and{" "}
                    <code>attachStudy</code> / <code>detachStudy</code> add and remove it. The chips are built from{" "}
                    <code>STUDY_MENU_ITEMS</code>, the same catalogue the App's indicator picker uses. The chart stops
                    adding panes at <code>maxPanes</code> (default 6) and raises <code>paneLimitReached</code>.
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
