import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { EAutoRange, EAxisAlignment, FastLineRenderableSeries, HorizontalLineAnnotation, NumberRange, NumericAxis, XyDataSeries, } from "scichart";
import { CandleInterval, CoinbaseExchange, ColorDescriptor, defaultExchangeProvider, EDataSourceStringId, EDataUpdateType, EDescriptorSectionName, idbPriceStore, NumberDescriptor, OHLCStudy, PaneId, STROKE_STYLE_TO_DASH_ARRAY, StrokeTypeDescriptor, StudyBase, studyProvider, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView, StudyList } from "scichart-scitrader-react";
// ---------------------------------------------------------------------------------------------
// Step 1. A study type: the key it is registered and saved under.
// IStudy.type is typed as the built-in EStudyType, so a custom type needs a cast for now
// ---------------------------------------------------------------------------------------------
const Z_SCORE = "ZScore";
/**
 * Z-Score: how many standard deviations the close is from its `period`-candle mean.
 * Above `+threshold` price is stretched high; below `-threshold`, stretched low.
 * An oscillator, so it draws in a pane of its own, with guide lines at +threshold, 0 and -threshold.
 */
class ZScoreStudy extends StudyBase {
    constructor(options) {
        // PaneId.createUnique: a new pane for every Z-Score added.
        // An overlay would pass PaneId.DEFAULT to share the price pane instead
        super(Z_SCORE, PaneId.createUnique(Z_SCORE), options);
        // Pane size relative to the others (the price pane is 3)
        this.paneSizeConfig = { grow: 1 };
        this.period = 20;
        this.threshold = 2;
        this.stroke = "#26c6da";
        this.strokeThickness = 2;
        this.strokeStyle = "solid";
        this.guideLines = [];
        this.period = options?.period ?? this.period;
        this.threshold = options?.threshold ?? this.threshold;
        this.stroke = options?.stroke ?? this.stroke;
        this.strokeThickness = options?.strokeThickness ?? this.strokeThickness;
        this.strokeStyle = options?.strokeStyle ?? this.strokeStyle;
    }
    // Step 3. Warm-up: candles needed before the first value. The chart loads this many extra
    // candles to the left of the period, so the line starts at the left edge
    getRequiredWarmup() {
        return this.period;
    }
    // Step 4. The five methods every study implements, called in this order when it attaches.
    // (1) What it reads and writes: the default feed's close in, one output column out
    createInputOutputIds() {
        this.inputId = this.getInputSourceId(EDataSourceStringId.CLOSE);
        this.inputIds.push(this.inputId);
        this.outputId = this.createOutputSourceId("Z", this.inputId); // "Z" is its legend name
        this.outputIds.push(this.outputId);
    }
    // (2) Where its values are kept for drawing: a SciChart data series
    createDataSeries() {
        this.series = new XyDataSeries(this.wasmContext, { dataSeriesName: `Z-Score ${this.period}` });
    }
    // (3) The Y axis of its pane. Spread axisDefaults first, so it is styled like the chart's other axes.
    // An overlay returns [] and uses the price axis
    createAxes() {
        return [
            new NumericAxis(this.wasmContext, {
                ...this.parentFinanceChart.axisDefaults,
                axisAlignment: EAxisAlignment.Right,
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.1, 0.1),
                labelPrecision: 1,
                maxAutoTicks: 4,
            }),
        ];
    }
    // (4) How it is drawn: one line, bound to its data series
    createRenderableSeries() {
        this.line = new FastLineRenderableSeries(this.wasmContext, {
            stroke: this.stroke,
            strokeThickness: this.strokeThickness,
            strokeDashArray: STROKE_STYLE_TO_DASH_ARRAY[this.strokeStyle],
        });
        this.line.dataSeries = this.series;
        return [this.line];
    }
    // (5) Step 5: keep up with the data. Called with the first load, history loaded as the user scrolls back
    // (Insert), candles dropped to save memory (Evict), each new candle (Append) and each live tick (Update)
    onDataChanged(update) {
        const change = update[this.inputId.id];
        const closes = this.dataManager.getValues(this.inputId) ?? [];
        if (change?.updateType === EDataUpdateType.Update && change.startIndex < this.series.count()) {
            // A live tick changes the last candle's close: recompute that one value only
            const i = change.startIndex;
            const z = this.zScoreAt(closes, i);
            this.series.update(i, z);
            this.dataManager.updateValues([this.outputId], [z], i);
            return;
        }
        this.recalculate(closes);
    }
    // Recompute every value. The output is index-aligned with the candles, with NaN for the warm-up,
    // so the legend reads the value of the candle under the cursor
    recalculate(closes) {
        const zScores = closes.map((_, i) => this.zScoreAt(closes, i));
        this.series.clear();
        this.series.appendRange(this.dataManager.xValues, zScores);
        this.dataManager.replaceValues([this.outputId], [zScores]);
    }
    zScoreAt(closes, i) {
        if (i < this.period - 1)
            return NaN;
        const window = closes.slice(i - this.period + 1, i + 1);
        const mean = window.reduce((sum, c) => sum + c, 0) / this.period;
        const sd = Math.sqrt(window.reduce((sum, c) => sum + (c - mean) ** 2, 0) / this.period);
        return sd === 0 ? 0 : (closes[i] - mean) / sd;
    }
    // Step 6. Guide lines, once the pane exists. addReferenceAnnotation removes them when the study
    // is detached; an annotation left behind outlives its axis and breaks the chart
    onInitComplete() {
        this.guideLines = [this.threshold, 0, -this.threshold].map((y) => new HorizontalLineAnnotation({
            y1: y,
            stroke: this.theme.chart.referenceLine, // the chart theme's guide-line colour
            strokeThickness: 1,
            strokeDashArray: [4, 4],
            showLabel: false,
        }));
        this.addReferenceAnnotation(...this.guideLines);
    }
    // Colours that aren't settings, like the guide lines, follow the theme here.
    // The line colour is a setting, so StudyBase moves it between themes for you
    onThemeChanged(theme) {
        this.guideLines.forEach((line) => (line.stroke = theme.chart.referenceLine));
    }
    // Step 7. The settings form. Each control has a name, a label and its current value, in an
    // "inputs" (what it calculates) or "styles" (how it looks) section. StudySettingsForm and
    // StudyList draw the form from these, and toJSON saves them
    configureDescriptor() {
        this.addDescriptor(EDescriptorSectionName.INPUTS, new NumberDescriptor("period", "Period", this.period));
        this.addDescriptor(EDescriptorSectionName.INPUTS, new NumberDescriptor("threshold", "Threshold (σ)", this.threshold));
        this.addDescriptor(EDescriptorSectionName.STYLES, new ColorDescriptor("strokeColor", "Line colour", this.stroke));
        this.addDescriptor(EDescriptorSectionName.STYLES, new NumberDescriptor("strokeThickness", "Line thickness", this.strokeThickness));
        this.addDescriptor(EDescriptorSectionName.STYLES, new StrokeTypeDescriptor("strokeStyle", "Line style", this.strokeStyle));
    }
    // The settings back to options: applyDescriptor calls this, and so does the registration below
    // when a saved chart is restored. Optional chaining, so settings saved by an older version still load
    static getOptionsFromDescriptor(descriptor) {
        const inputs = descriptor.inputs.controls;
        const styles = descriptor.styles.controls;
        return {
            period: Number(inputs.period?.default ?? 20),
            threshold: Number(inputs.threshold?.default ?? 2),
            stroke: String(styles.strokeColor?.default ?? "#26c6da"),
            strokeThickness: Number(styles.strokeThickness?.default ?? 2),
            strokeStyle: String(styles.strokeStyle?.default ?? "solid"),
        };
    }
    // Step 8. Apply edited settings in place, with no reload. Without this (supportsLiveApply false),
    // StudyList rebuilds the study through studyProvider instead
    get supportsLiveApply() {
        return true;
    }
    onDescriptorApplied(options) {
        this.stroke = this.line.stroke = options.stroke;
        this.strokeThickness = this.line.strokeThickness = options.strokeThickness;
        this.strokeStyle = options.strokeStyle;
        this.line.strokeDashArray = STROKE_STYLE_TO_DASH_ARRAY[options.strokeStyle];
        if (options.threshold !== this.threshold) {
            this.threshold = options.threshold;
            [this.guideLines[0].y1, this.guideLines[2].y1] = [this.threshold, -this.threshold];
        }
        if (options.period > 1 && options.period !== this.period) {
            this.period = options.period;
            this.series.dataSeriesName = `Z-Score ${this.period}`;
            this.recalculate(this.dataManager.getValues(this.inputId) ?? []);
        }
    }
}
// Step 9. Register it, once, at app startup: studyProvider.getStudy("ZScore") can then create it
// (for a study picker), and fromJSON can restore it from a saved chart
studyProvider.registerStudy(Z_SCORE, {
    type: Z_SCORE,
    name: "Z-Score",
    description: "Standard deviations from the mean",
    createStudy: (descriptor, options) => new ZScoreStudy({ ...options, ...(descriptor ? ZScoreStudy.getOptionsFromDescriptor(descriptor) : {}) }),
});
// ---------------------------------------------------------------------------------------------
// Using it in React: the same as a built-in study
// ---------------------------------------------------------------------------------------------
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function CustomStudyChart() {
    // The chart's finance API, once it has initialised. StudyList needs it
    const [chart, setChart] = React.useState(null);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new ZScoreStudy({ period: 20, threshold: 2 })],
    }), []);
    // Created by type, the way a study picker or a restored chart creates it
    const addZScore = () => chart?.attachStudy(studyProvider.getStudy(Z_SCORE));
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, disabled: !chart, onClick: addZScore }, "Add a Z-Score")),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: (api) => setChart(api.financeApi) })),
            chart && React.createElement(StudyList, { chart: chart, title: "Studies", style: sidePanelStyle }))));
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
const sidePanelStyle = {
    width: 320,
    overflowY: "auto",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
