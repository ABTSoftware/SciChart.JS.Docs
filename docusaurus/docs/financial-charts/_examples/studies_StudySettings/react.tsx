import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BollingerBandsStudy,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EDescriptorSectionName,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    IStudy,
    OHLCStudy,
    RSIStudy,
    SciFinanceChart,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, StudyList, StudySettingsForm } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Change one setting of a live study, in code.
// A study's settings are its descriptor: an "inputs" section (lengths, levels) and a "styles"
// section (colours, thickness), each a set of named controls holding their value in `default`.
// Copy the descriptor with one value changed and apply it: built-in studies update in place
function setStudySetting(study: IStudy, section: EDescriptorSectionName, control: string, value: string | number) {
    const descriptor = study.getDescriptor();
    const controls = descriptor[section].controls;
    study.applyDescriptor({
        ...descriptor,
        [section]: { controls: { ...controls, [control]: { ...controls[control], default: value } } },
    });
}

export function StudySettingsChart() {
    // The chart's finance API, once it has initialised. StudyList needs it
    const [chart, setChart] = React.useState<SciFinanceChart>(null);

    // Create the studies and config once per mounted chart: studies are live objects bound to one chart
    const { rsi, config } = React.useMemo(() => {
        const rsi = new RSIStudy({ length: 14 });
        const config: ISciFinanceChartPanelConfig = {
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new BollingerBandsStudy(), rsi],
        };
        return { rsi, config };
    }, []);

    // Change a setting in code: the RSI's period (an input) and colour (a style).
    // The forms show the new values, because they listen to the study's descriptorApplied
    const fastRsi = () => {
        setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7);
        setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c");
    };

    // Reset every study: getDefaultDescriptor() is the study's settings as first attached
    const resetAll = () => chart?.studies.forEach((study) => study.applyDescriptor(study.getDefaultDescriptor()));

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <button style={buttonStyle} disabled={!chart} onClick={fastRsi}>
                    RSI period 7, amber
                </button>
                <button style={buttonStyle} disabled={!chart} onClick={resetAll}>
                    Reset all to defaults
                </button>
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* financeApi throws until the chart has initialised, so read it in onInit */}
                    <SciFinanceChartView config={config} onInit={(api: ISciFinanceChartPanelApi) => setChart(api.financeApi)} />
                </div>
                {chart && (
                    <div style={sidePanelStyle}>
                        {/* StudyList: a card per study. A card opens that study's settings form;
                            edits apply as you make them, and × removes the study.
                            It follows studiesChanged, so studies added or removed elsewhere appear and disappear */}
                        <StudyList chart={chart} title="Studies" style={{ flex: 1, minHeight: 0, overflowY: "auto" }} />
                        {/* StudySettingsForm on its own: here the RSI's inputs only, without the
                            section heading. The same form StudyList opens, for a settings page of your own */}
                        <div style={formPanelStyle}>
                            <div style={headingStyle}>RSI inputs</div>
                            <StudySettingsForm
                                study={rsi}
                                sectionFilter={[EDescriptorSectionName.INPUTS]}
                                hideSectionLabels
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle: React.CSSProperties = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
const sidePanelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: 320,
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const formPanelStyle: React.CSSProperties = {
    padding: "8px 16px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const headingStyle: React.CSSProperties = {
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};
