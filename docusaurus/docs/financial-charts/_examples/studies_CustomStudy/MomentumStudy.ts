import {
    AxisBase2D,
    EAutoRange,
    EAxisAlignment,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    XyDataSeries,
} from "scichart";
import {
    ColorDescriptor,
    DataSourceId,
    EDataSourceStringId,
    EDescriptorSectionName,
    EStudyType,
    IStudyOptions,
    NumberDescriptor,
    PaneId,
    StudyBase,
    studyProvider,
    TDataUpdate,
    TStudyDescriptor,
} from "scichart-scitrader";

/**
 * A custom study: momentum, the change in close over `length` candles, in a pane of its own.
 *
 * A study extends `StudyBase` and answers five questions: which data it reads
 * (`createInputOutputIds`), where it keeps its output (`createDataSeries`), what axes its pane needs
 * (`createAxes`), how it is drawn (`createRenderableSeries`), and what to do when the input changes
 * (`onDataChanged`). A descriptor (`configureDescriptor`, `getOptionsFromDescriptor`,
 * `onDescriptorApplied`) gives it a settings form and lets it be saved and restored.
 */
export const MOMENTUM = "Momentum" as EStudyType; // study types are typed as the built-in enum for now (SCT-766)

export interface IMomentumOptions extends IStudyOptions {
    length?: number;
    color?: string;
}

export class MomentumStudy extends StudyBase<number> {
    public readonly paneSizeConfig = { grow: 1 };
    public length = 10;
    public color = "#26C6DA";

    private inputId: DataSourceId;
    private outputId: DataSourceId;
    private series: XyDataSeries;

    constructor(options?: IMomentumOptions) {
        super(MOMENTUM, PaneId.createUnique(MOMENTUM), options);
        this.length = options?.length ?? this.length;
        this.color = options?.color ?? this.color;
        this.configureDescriptor();
    }

    /** Candles needed before the first output: the chart loads this many extra to the left. */
    public getRequiredWarmup(): number {
        return this.length;
    }

    public createInputOutputIds(): void {
        this.inputId = this.getInputSourceId(EDataSourceStringId.CLOSE);
        this.inputIds.push(this.inputId);
        this.outputId = this.createOutputSourceId("MOM", this.inputId);
        this.outputIds.push(this.outputId);
    }

    public createDataSeries(): void {
        this.series = new XyDataSeries(this.wasmContext, { dataSeriesName: `Momentum ${this.length}` });
    }

    public createAxes(): AxisBase2D[] {
        return [
            new NumericAxis(this.wasmContext, {
                ...this.parentFinanceChart.axisDefaults,
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.1, 0.1),
                axisAlignment: EAxisAlignment.Right,
            }),
        ];
    }

    public createRenderableSeries(): FastLineRenderableSeries[] {
        const rs = new FastLineRenderableSeries(this.wasmContext, { stroke: this.color, strokeThickness: 2 });
        rs.dataSeries = this.series;
        return [rs];
    }

    /** Recompute from scratch on every change: simple, and fast enough for a line of a few thousand points. */
    protected onDataChanged(_update: TDataUpdate<number>): void {
        const closes = this.dataManager.getValues<number>(this.inputId) ?? [];
        const out = closes.map((c, i) => (i >= this.length ? c - closes[i - this.length] : NaN));
        this.series.clear();
        this.series.appendRange(this.dataManager.xValues, out);
        this.dataManager.replaceValues([this.outputId], [out]);
    }

    // ----- settings form and persistence -----

    protected configureDescriptor(): void {
        this.addDescriptor(EDescriptorSectionName.INPUTS, new NumberDescriptor("length", "Length", this.length));
        this.addDescriptor(EDescriptorSectionName.STYLES, new ColorDescriptor("color", "Line colour", this.color));
    }

    public static getOptionsFromDescriptor(descriptor: TStudyDescriptor): IMomentumOptions {
        return {
            length: Number(descriptor.inputs.controls.length.default),
            color: String(descriptor.styles.controls.color.default),
        };
    }

    public get supportsLiveApply(): boolean {
        return true;
    }

    protected onDescriptorApplied(opts: IMomentumOptions): void {
        const rs = this.renderableSeries.get(0) as FastLineRenderableSeries;
        if (opts.color) {
            this.color = opts.color;
            rs.stroke = opts.color;
        }
        if (opts.length && opts.length !== this.length) {
            this.length = opts.length;
            this.onDataChanged({});
        }
    }
}

/** Register once, so the study can be created by type and restored from a saved chart. */
export function registerMomentumStudy(): void {
    studyProvider.registerStudy(MOMENTUM, {
        type: MOMENTUM,
        name: "Momentum",
        description: "Change in close over N candles",
        createStudy: (descriptor, options) =>
            new MomentumStudy({
                ...options,
                ...(descriptor ? MomentumStudy.getOptionsFromDescriptor(descriptor) : {}),
            }),
    });
}
