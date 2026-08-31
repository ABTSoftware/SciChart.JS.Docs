import {
    CursorModifier,
    CustomChartModifier2D,
    ECursorStyle,
    EStrokePaletteMode,
    EAutoRange,
    EAxisAlignment,
    EAxisType,
    EXyDirection,
    FastLineRenderableSeries,
    getCoordinateWithCoordinateMode,
    layoutAxisParts,
    layoutAxisPartsLeftStrategy,
    LeftAlignedInnerAxisLayoutStrategy,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    NumericLabelProvider,
    parseColorToUIntArgb,
    Point,
    Rect,
    RubberBandXyZoomModifier,
    SciChartJsNavyTheme,
    SciChartSurface,
    SeriesSelectionModifier,
    SplineLineRenderableSeries,
    TextLabelProvider,
    translateFromCanvasToSeriesViewRect,
    translateToNotScaled,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import type {
    AxisBase2D,
    ChartLayoutState,
    IAxisBase2dOptions,
    IChartModifierBaseOptions,
    ICursorModifierOptions,
    IDeletable,
    IFastLineRenderableSeriesOptions,
    IInnerAxisLayoutStrategyOptions,
    IPointMetadata,
    IRenderableSeries,
    IRubberBandXyZoomModifierOptions,
    ISplineLineRenderableSeriesOptions,
    IStrokePaletteProvider,
    ModifierMouseArgs,
    SeriesInfo,
    TCursorTooltipDataTemplate,
    TSciChart
} from "scichart";

// #region_data_start
// A synthetic "Cars" dataset. Each record has 7 dimensions, 6 numeric and one string (origin), which is
// exactly the shape a Parallel Coordinate Plot is designed for.
const originList = ["USA", "Europe", "Japan"];

// Per-origin engine profiles reproduce the classic auto-mpg relationships:
// USA cars trend to big engines / low mpg, European and Japanese cars to smaller engines / higher mpg.
const originProfiles: Record<string, { minCyl: number; maxCyl: number }> = {
    USA: { minCyl: 6, maxCyl: 8 },
    Europe: { minCyl: 4, maxCyl: 6 },
    Japan: { minCyl: 3, maxCyl: 4 }
};

const originColors: Record<string, string> = {
    USA: "#F48420",
    Europe: "#50C7E0",
    Japan: "#30BC9A"
};

// Mulberry32 - a small deterministic PRNG so the generated dataset is reproducible
const createSeededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

interface ICarsData {
    origins: string[];
    mpg: number[];
    cylinders: number[];
    displacement: number[];
    horsepower: number[];
    weight: number[];
    acceleration: number[];
}

const generateData = (recordCount: number): ICarsData => {
    const random = createSeededRandom(1972);
    const data: ICarsData = {
        origins: [],
        mpg: [],
        cylinders: [],
        displacement: [],
        horsepower: [],
        weight: [],
        acceleration: []
    };
    for (let i = 0; i < recordCount; i++) {
        const origin = originList[i % originList.length];
        const profile = originProfiles[origin];
        // Correlated values: cylinders drives displacement -> horsepower -> weight; mpg and acceleration fall
        // as the engine grows.
        const cyl = Math.round(profile.minCyl + random() * (profile.maxCyl - profile.minCyl));
        const disp = Math.round((60 + cyl * 45) * (0.85 + random() * 0.3));
        const hp = Math.round(disp * (0.4 + random() * 0.25));
        const wt = Math.round(1400 + disp * 6 * (0.85 + random() * 0.3));
        const mpgVal = Math.max(9, Math.round(46 - hp * 0.12 - cyl * 1.5 + random() * 6));
        const accel = Math.round((26 - hp * 0.05 + random() * 4) * 10) / 10;
        data.origins.push(origin);
        data.cylinders.push(cyl);
        data.displacement.push(disp);
        data.horsepower.push(hp);
        data.weight.push(wt);
        data.mpg.push(mpgVal);
        data.acceleration.push(accel);
    }
    return data;
};
// #region_data_end

// #region_datasource_start
/**
 * The id of the hidden Y axis created by {@link ParallelCoordinateDataSource},
 * which all parallel coordinate series are bound to
 */
export const PCP_HIDDEN_YAXIS_ID = "pcp-hidden-yAxis";

/**
 * Metadata attached to every data point created by {@link ParallelCoordinateDataSource},
 * holding the actual (pre-normalization) value so it can be displayed on tooltips
 */
export interface TParallelPointMetadata extends IPointMetadata {
    /** The actual data value of the point, before normalization to the hidden axis coordinate space */
    value: number | string;
    /** The name of the category the point belongs to */
    category: string;
    /** The index of the record (the line) this point belongs to */
    recordIndex: number;
}

/** Defines one category (dimension) of a Parallel Coordinate Plot */
export interface IParallelCoordinateCategory {
    /** The category name, used as the axis title and the default axis id */
    name: string;
    /**
     * The values for this category, one per record. All categories must have the same number of values.
     * String values require axisType {@link EAxisType.CategoryAxis}
     */
    values: Array<number | string>;
    /**
     * The axis type for this category, either {@link EAxisType.CategoryAxis} or
     * {@link EAxisType.NumericAxis}. Default {@link EAxisType.NumericAxis}
     */
    axisType?: EAxisType;
    /** Optional axis options applied to the category axis */
    axisOptions?: IAxisBase2dOptions;
}

/** Options passed to the {@link ParallelCoordinateDataSource} constructor */
export interface IParallelCoordinateDataSourceOptions {
    /** The relative padding applied when deriving a category axis visibleRange from data. Default 0.1 */
    rangePadding?: number;
}

/**
 * @summary The data source for creating Parallel Coordinate Plots on an existing {@link SciChartSurface}
 * @description
 * A Parallel Coordinate Plot draws each record as a polyline across N vertical category axes,
 * where each Y value is scaled by its own category axis.
 *
 * Add categories with {@link addCategory} (one array of values per category, all of equal length),
 * then call {@link build} to create the category Y axes, the hidden coordinate axis, and one
 * {@link XyDataSeries} + renderable series per record. Data values are normalized into the
 * coordinate space of the hidden Y axis (0..1) using each category's data range, so before
 * drawing every value is already converted from data space to coordinate space.
 *
 * ```ts
 * const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
 * sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
 *
 * const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface);
 * data.addCategory("name", ["Ford Mustang", "Toyota Corolla"], EAxisType.CategoryAxis);
 * data.addCategory("Price", [45000, 23125], EAxisType.NumericAxis);
 * data.createSeriesFn = (index) => ({ stroke: index === 0 ? "red" : "blue" });
 * data.build();
 * ```
 */
export class ParallelCoordinateDataSource implements IDeletable {
    /**
     * A callback used to create the renderable series for the record at the given index.
     * When {@link ISplineLineRenderableSeriesOptions.interpolationPoints} is 0 (the default)
     * a {@link FastLineRenderableSeries} is created, otherwise a {@link SplineLineRenderableSeries}
     */
    public createSeriesFn: (index: number) => ISplineLineRenderableSeriesOptions = () => ({});
    public yGrowBy = new NumberRange(0.06, 0.06);

    protected readonly webAssemblyContext: TSciChart;
    protected readonly sciChartSurface: SciChartSurface;
    protected readonly rangePadding: number;

    protected categoriesProperty: IParallelCoordinateCategory[] = [];
    protected yAxesProperty: AxisBase2D[] = [];
    protected renderableSeriesProperty: IRenderableSeries[] = [];
    protected hiddenYAxis: AxisBase2D | undefined = undefined;
    protected xAxisProperty: AxisBase2D | undefined = undefined;
    protected layoutStrategy: ParallelCoordinatesInnerAxisLayoutStrategy | undefined = undefined;
    /** Maps unique string value to its index, per CategoryAxis-type category */
    protected uniqueValuesMaps: Array<Map<string, number> | undefined> = [];
    /**
     * The fixed data-value range used to normalize each category, in category order.
     * Normalization is always relative to this build-time range, so that zooming and panning
     * (which changes the category axes' visibleRange) never re-scales the stored coordinates.
     */
    protected normalizationRanges: NumberRange[] = [];
    private hiddenRangeUnsubscribe: (() => void) | undefined = undefined;
    private isBuilding: boolean = false;

    constructor(
        webAssemblyContext: TSciChart,
        sciChartSurface: SciChartSurface,
        options?: IParallelCoordinateDataSourceOptions
    ) {
        this.webAssemblyContext = webAssemblyContext;
        this.sciChartSurface = sciChartSurface;
        this.rangePadding = options?.rangePadding ?? 0.1;
    }

    /** The category Y axes in category order. This is populated by {@link build} */
    public get yAxes(): AxisBase2D[] {
        return this.yAxesProperty;
    }

    /** The renderable series, one per record. This is populated by {@link build} */
    public get renderableSeries(): IRenderableSeries[] {
        return this.renderableSeriesProperty;
    }

    /** The categories added with {@link addCategory} */
    public get categories(): IParallelCoordinateCategory[] {
        return this.categoriesProperty;
    }

    /**
     * Adds a category (dimension) to the plot. Call {@link build} afterwards to (re)create the chart
     * @param name The category name, used as the axis title and the default axis id
     * @param values The values for this category, one per record
     * @param axisType {@link EAxisType.CategoryAxis} or {@link EAxisType.NumericAxis} (the default,
     * or CategoryAxis when the values are strings)
     * @param axisOptions Optional axis options applied to the category axis
     */
    public addCategory(
        name: string,
        values: Array<number | string>,
        axisType?: EAxisType,
        axisOptions?: IAxisBase2dOptions
    ): void {
        if (!name) {
            throw new Error("Category name is required");
        }
        if (!values || values.length === 0) {
            throw new Error(`Category "${name}" must have at least one value`);
        }
        const recordsCount = this.categoriesProperty[0]?.values.length;
        if (recordsCount !== undefined && values.length !== recordsCount) {
            throw new Error(
                `Category "${name}" has ${values.length} values, but existing categories have ${recordsCount}. All categories must have the same number of values`
            );
        }
        const hasStringValues = values.some(v => typeof v === "string");
        const resolvedAxisType = axisType ?? (hasStringValues ? EAxisType.CategoryAxis : EAxisType.NumericAxis);
        if (hasStringValues && resolvedAxisType !== EAxisType.CategoryAxis) {
            throw new Error(`Category "${name}" has string values, which require EAxisType.CategoryAxis`);
        }
        this.categoriesProperty.push({ name, values, axisType: resolvedAxisType, axisOptions });
    }

    /**
     * Creates or rebuilds the category Y axes, DataSeries and RenderableSeries from the current categories.
     * Call again after changing categories or data to update the chart
     */
    public build(): void {
        if (this.categoriesProperty.length === 0) {
            throw new Error("Add at least one category with addCategory() before calling build()");
        }
        const xAxis = this.sciChartSurface.getDefaultXAxis();
        if (!xAxis) {
            throw new Error("Add an X axis to the SciChartSurface before calling build()");
        }
        this.isBuilding = true;
        try {
            this.xAxisProperty = xAxis;
            const categoriesCount = this.categoriesProperty.length;
            const recordsCount = this.categoriesProperty[0].values.length;

            // Only apply the default X range when the user has not set one on the axis, so a caller can
            // control the horizontal padding/zoom (e.g. new NumericAxis(wasmContext, { visibleRange })).
            if (xAxis.hasDefaultVisibleRange()) {
                xAxis.visibleRange = new NumberRange(-0.5, categoriesCount - 0.5);
            }

            this.updateUniqueValuesMaps();
            this.normalizationRanges = this.categoriesProperty.map((_, index) => this.deriveVisibleRange(index));

            // Axes and series objects are reused across rebuilds (e.g. a drag-reorder) whenever the counts
            // still match, so reordering does not recreate the whole chart
            const canUpdateInPlace =
                this.yAxesProperty.length === categoriesCount && this.renderableSeriesProperty.length === recordsCount;
            if (!canUpdateInPlace) {
                this.teardown();
            }

            this.ensureHiddenYAxis();
            this.ensureLayoutStrategy();

            if (canUpdateInPlace) {
                this.updateAxesInPlace();
                this.updateSeriesInPlace();
            } else {
                this.createAxes();
                this.createSeries();
            }

            // Keep the visible category axes consistent with the hidden axis, in case it was
            // left zoomed/panned from a previous build
            this.syncCategoryAxesToHidden();
        } finally {
            this.isBuilding = false;
        }
    }

    /** Synonym of {@link build} */
    public invalidate(): void {
        this.build();
    }

    /**
     * Moves the category (dimension) at {@link fromIndex} to {@link toIndex}, shifting the others, then
     * rebuilds. Because the category axes and the record x-values are both derived positionally from the
     * category order (axis at group position i, record vertex at x = i), this reorders both the axes and the
     * polylines. Used by the drag-to-reorder modifier. No-op if the indexes are equal or out of range.
     */
    public moveCategory(fromIndex: number, toIndex: number): void {
        const count = this.categoriesProperty.length;
        if (fromIndex < 0 || fromIndex >= count || toIndex < 0 || toIndex >= count || fromIndex === toIndex) {
            return;
        }
        const [moved] = this.categoriesProperty.splice(fromIndex, 1);
        this.categoriesProperty.splice(toIndex, 0, moved);
        this.build();
    }

    /**
     * The custom hit-test for range selection on one category axis: iterates just the values of the category
     * at the given index and returns the indexes of the records whose value falls inside the inclusive range
     * [min, max]. For {@link EAxisType.CategoryAxis} categories the range is in unique-value-index space
     * (the same space the category axis' coordinate calculator works in).
     */
    public getRecordIndexesInRange(categoryIndex: number, min: number, max: number): number[] {
        const category = this.categoriesProperty[categoryIndex];
        if (!category) {
            return [];
        }
        const rangeMin = Math.min(min, max);
        const rangeMax = Math.max(min, max);
        const recordIndexes: number[] = [];
        category.values.forEach((rawValue, recordIndex) => {
            const numericValue = this.getNumericValue(categoryIndex, rawValue);
            if (numericValue >= rangeMin && numericValue <= rangeMax) {
                recordIndexes.push(recordIndex);
            }
        });
        return recordIndexes;
    }

    /** @inheritDoc */
    public delete(): void {
        this.teardown();
        if (this.hiddenRangeUnsubscribe) {
            this.hiddenRangeUnsubscribe();
            this.hiddenRangeUnsubscribe = undefined;
        }
        if (this.hiddenYAxis) {
            this.sciChartSurface.yAxes.remove(this.hiddenYAxis);
            this.hiddenYAxis = undefined;
        }
        this.categoriesProperty = [];
        this.uniqueValuesMaps = [];
        this.normalizationRanges = [];
        this.xAxisProperty = undefined;
    }

    /**
     * Normalizes a raw category value into the coordinate space of the hidden Y axis (0..1),
     * using the fixed build-time {@link normalizationRanges} (not the live axis visibleRange,
     * which changes on zoom/pan)
     */
    protected normalizeValue(categoryIndex: number, rawValue: number | string): number {
        const range = this.normalizationRanges[categoryIndex];
        const numericValue = this.getNumericValue(categoryIndex, rawValue);
        let normalized = range.max === range.min ? 0.5 : (numericValue - range.min) / (range.max - range.min);
        if (this.isCategoryFlipped(categoryIndex)) {
            normalized = 1 - normalized;
        }
        return normalized;
    }

    /**
     * The inverse of {@link normalizeValue}: converts a normalized coordinate (0..1) back to a raw data value.
     * Used to derive each category axis' visibleRange from the hidden axis when zooming/panning
     */
    protected denormalizeValue(categoryIndex: number, normalized: number): number {
        const range = this.normalizationRanges[categoryIndex];
        const fraction = this.isCategoryFlipped(categoryIndex) ? 1 - normalized : normalized;
        return range.min + fraction * (range.max - range.min);
    }

    private isCategoryFlipped(categoryIndex: number): boolean {
        return this.yAxesProperty[categoryIndex]?.flippedCoordinates ?? false;
    }

    /**
     * Converts a raw category value to a numeric value.
     * For CategoryAxis-type categories this is the index of the unique value
     */
    protected getNumericValue(categoryIndex: number, rawValue: number | string): number {
        const uniqueValues = this.uniqueValuesMaps[categoryIndex];
        return uniqueValues ? uniqueValues.get(String(rawValue)) : (rawValue as number);
    }

    private updateUniqueValuesMaps(): void {
        this.uniqueValuesMaps = this.categoriesProperty.map(category => {
            if (category.axisType !== EAxisType.CategoryAxis) {
                return undefined;
            }
            const map = new Map<string, number>();
            category.values.forEach(value => {
                const key = String(value);
                if (!map.has(key)) {
                    map.set(key, map.size);
                }
            });
            return map;
        });
    }

    private deriveVisibleRange(categoryIndex: number): NumberRange {
        const category = this.categoriesProperty[categoryIndex];
        const overriddenRange = category.axisOptions?.visibleRange;
        if (overriddenRange) {
            return new NumberRange(overriddenRange.min, overriddenRange.max);
        }
        if (category.axisType === EAxisType.CategoryAxis) {
            const uniqueCount = this.uniqueValuesMaps[categoryIndex].size;
            return uniqueCount > 1 ? new NumberRange(0, uniqueCount - 1) : new NumberRange(-0.5, 0.5);
        }
        const values = category.values as number[];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding =
            min === max ? Math.abs(min) * this.rangePadding || this.rangePadding : (max - min) * this.rangePadding;
        return new NumberRange(min - padding, max + padding);
    }

    private ensureHiddenYAxis(): void {
        if (this.hiddenYAxis) {
            return;
        }
        this.hiddenYAxis = new NumericAxis(this.webAssemblyContext, {
            id: PCP_HIDDEN_YAXIS_ID,
            isVisible: false,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0 - this.yGrowBy.min, 1 + this.yGrowBy.max),
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false
        });
        this.sciChartSurface.yAxes.add(this.hiddenYAxis);

        // The hidden axis is what zoom/pan modifiers act on (it is the default Y axis the series bind to).
        // When its range changes, derive each visible category axis' range from it so the axis ticks stay
        // aligned with the record lines.
        const handler = () => {
            if (!this.isBuilding) {
                this.syncCategoryAxesToHidden();
            }
        };
        this.hiddenYAxis.visibleRangeChanged.subscribe(handler);
        this.hiddenRangeUnsubscribe = () => this.hiddenYAxis?.visibleRangeChanged.unsubscribe(handler);
    }

    /**
     * Derives every visible category axis' visibleRange from the hidden axis' current range, so that the record
     * lines (drawn against the hidden axis) stay aligned with the category axis ticks under zoom and pan.
     */
    protected syncCategoryAxesToHidden(): void {
        if (!this.hiddenYAxis) {
            return;
        }
        const { min: hiddenMin, max: hiddenMax } = this.hiddenYAxis.visibleRange;
        this.yAxesProperty.forEach((axis, categoryIndex) => {
            const a = this.denormalizeValue(categoryIndex, hiddenMin);
            const b = this.denormalizeValue(categoryIndex, hiddenMax);
            axis.visibleRange = new NumberRange(Math.min(a, b), Math.max(a, b));
        });
    }

    private ensureLayoutStrategy(): void {
        if (this.layoutStrategy) {
            return;
        }
        this.layoutStrategy = new ParallelCoordinatesInnerAxisLayoutStrategy({
            orthogonalAxisId: this.xAxisProperty.id
        });
        this.sciChartSurface.layoutManager.leftInnerAxesLayoutStrategy = this.layoutStrategy;
    }

    private createAxes(): void {
        this.categoriesProperty.forEach((category, categoryIndex) => {
            const axisOptions: IAxisBase2dOptions = {
                axisTitle: category.name,
                ...category.axisOptions,
                id: category.axisOptions?.id ?? category.name,
                axisAlignment: EAxisAlignment.Left,
                isInnerAxis: true,
                autoRange: EAutoRange.Never
            };
            const axis = new NumericAxis(this.webAssemblyContext, axisOptions);
            this.configureDimensionAxis(axis, category, categoryIndex);
            this.yAxesProperty.push(axis);
            this.sciChartSurface.yAxes.add(axis);
        });
    }

    private configureDimensionAxis(
        axis: AxisBase2D,
        category: IParallelCoordinateCategory,
        categoryIndex: number
    ): void {
        axis.visibleRange = this.normalizationRanges[categoryIndex];
        if (category.axisType === EAxisType.CategoryAxis) {
            // Labels are the unique string values, one per integer tick
            axis.labelProvider = new TextLabelProvider({
                labels: Array.from(this.uniqueValuesMaps[categoryIndex].keys())
            });
            axis.autoTicks = false;
            axis.majorDelta = 1;
        } else {
            // Reset the CategoryAxis styling: axis objects are reused positionally across reorders/rebuilds,
            // so an axis that previously hosted a string category would otherwise keep its TextLabelProvider
            axis.labelProvider = new NumericLabelProvider();
            axis.autoTicks = category.axisOptions?.autoTicks ?? true;
        }
    }

    private updateAxesInPlace(): void {
        this.categoriesProperty.forEach((category, categoryIndex) => {
            const axis = this.yAxesProperty[categoryIndex];
            axis.axisTitle = category.axisOptions?.axisTitle ?? category.name;
            this.configureDimensionAxis(axis, category, categoryIndex);
        });
    }

    private createSeries(): void {
        const recordsCount = this.categoriesProperty[0].values.length;
        for (let recordIndex = 0; recordIndex < recordsCount; recordIndex++) {
            const series = this.createRenderableSeries(recordIndex);
            this.renderableSeriesProperty.push(series);
            this.sciChartSurface.renderableSeries.add(series);
        }
    }

    private createRenderableSeries(recordIndex: number): IRenderableSeries {
        const userOptions = this.createSeriesFn?.(recordIndex) ?? {};
        const { xValues, yValues, metadata } = this.buildRecordData(recordIndex);
        const dataSeries = new XyDataSeries(this.webAssemblyContext, {
            dataSeriesName: `pcp-series-${recordIndex}`,
            xValues,
            yValues,
            metadata
        });
        const { interpolationPoints, ...lineOptions } = userOptions;
        const seriesOptions: IFastLineRenderableSeriesOptions = {
            ...lineOptions,
            id: userOptions.id ?? `pcp-series-${recordIndex}`,
            xAxisId: this.xAxisProperty.id,
            yAxisId: PCP_HIDDEN_YAXIS_ID,
            dataSeries
        };
        // interpolationPoints > 0 draws a smooth curve through the category vertices instead of straight lines
        return interpolationPoints > 0
            ? new SplineLineRenderableSeries(this.webAssemblyContext, { ...seriesOptions, interpolationPoints })
            : new FastLineRenderableSeries(this.webAssemblyContext, seriesOptions);
    }

    /**
     * One record becomes one polyline: x = the category index (so vertex i lands on category axis i),
     * y = the value normalized into the hidden axis' 0..1 coordinate space, and the raw value is kept
     * on the point metadata for tooltips
     */
    private buildRecordData(recordIndex: number): {
        xValues: number[];
        yValues: number[];
        metadata: TParallelPointMetadata[];
    } {
        const xValues: number[] = [];
        const yValues: number[] = [];
        const metadata: TParallelPointMetadata[] = [];
        this.categoriesProperty.forEach((category, categoryIndex) => {
            const rawValue = category.values[recordIndex];
            xValues.push(categoryIndex);
            yValues.push(this.normalizeValue(categoryIndex, rawValue));
            metadata.push({ isSelected: false, value: rawValue, category: category.name, recordIndex });
        });
        return { xValues, yValues, metadata };
    }

    private updateSeriesInPlace(): void {
        this.renderableSeriesProperty.forEach((series, recordIndex) => {
            const { xValues, yValues, metadata } = this.buildRecordData(recordIndex);
            const dataSeries = series.dataSeries as XyDataSeries;
            dataSeries.clear();
            dataSeries.appendRange(xValues, yValues, metadata);
        });
    }

    private teardown(): void {
        this.renderableSeriesProperty.forEach(series => this.sciChartSurface.renderableSeries.remove(series));
        this.renderableSeriesProperty = [];
        this.yAxesProperty.forEach(axis => this.sciChartSurface.yAxes.remove(axis));
        this.yAxesProperty = [];
    }
}
// #region_datasource_end

// #region_layout_start
/**
 * A LayoutStrategy for Parallel Coordinate Plots, which places each vertical inner axis at its own
 * position on the orthogonal (horizontal) axis.
 * @remarks
 * Axis with index i in the group is placed at data value i on the horizontal axis,
 * so N dimension axes are drawn at x = 0, 1, ..., N-1.
 * Use {@link axisPositions} to override the position per axis id.
 * The base {@link LeftAlignedInnerAxisLayoutStrategy} anchors the whole group at a single
 * axisPosition and stacks the axes; the overrides below position every axis independently instead.
 * Assign to {@link LayoutManager.leftInnerAxesLayoutStrategy} and add axes with
 * axisAlignment {@link EAxisAlignment.Left} and isInnerAxis = true.
 * Each axis is drawn with its title to the left of the axis line and its labels/ticks to the right.
 */
export class ParallelCoordinatesInnerAxisLayoutStrategy extends LeftAlignedInnerAxisLayoutStrategy {
    /**
     * Optional map of axis id to position on the orthogonal axis.
     * Axes not present in the map use their index within the group.
     */
    public axisPositions: Map<string, number> | undefined = undefined;

    constructor(options?: IInnerAxisLayoutStrategyOptions) {
        super(options);
        // Title occupies the left part of the axis viewRect, labels/ticks the right part
        this.layoutAxisPartsStrategy = layoutAxisPartsLeftStrategy;
    }

    public measureAxes(
        sciChartSurface: SciChartSurface,
        chartLayoutState: ChartLayoutState,
        axes: AxisBase2D[]
    ) {
        this.sciChartSurface = sciChartSurface;
        axes.forEach(axis => {
            axis.measure();
            this.updateAxisLayoutState(axis);
        });
        // Dimension axes are drawn inside the series area, no outer space is reserved
        return 0;
    }

    public updateAreaSize(chartLayoutState: ChartLayoutState, requiredSize: number) {
        chartLayoutState.leftInnerAreaSize = 0;
    }

    public layoutAxes(left: number, top: number, right: number, bottom: number, axes: AxisBase2D[]): void {
        if (axes.length === 0) {
            return;
        }
        const horizontalAxis =
            this.sciChartSurface.getXAxisById(this.orthogonalAxisId) ?? this.sciChartSurface.getDefaultXAxis();
        if (!horizontalAxis || !horizontalAxis.isHorizontalAxis) {
            throw new Error("orthogonalAxisId should be a valid id of horizontal axis on the surface!");
        }
        const coordinateCalculator = horizontalAxis.getCurrentCoordinateCalculator();
        const seriesViewRectLeft = horizontalAxis.parentSurface.seriesViewRect.left;

        axes.forEach((axis, index) => {
            // Set axisLength to default value which is seriesViewRect.height
            axis.axisLength = undefined;
            axis.offset = 0;

            const position = this.axisPositions?.get(axis.id) ?? index;
            const axisCoord =
                getCoordinateWithCoordinateMode(position, coordinateCalculator, this.coordinateMode) +
                seriesViewRectLeft;

            // Split the axis viewRect around the axis line at axisCoord: the title occupies the space to
            // the left of the line, the axis renderer (line + ticks + labels) the space to the right.
            const titleWidth = axis.axisTitleRenderer.desiredWidth;
            const labelWidth = axis.axisRenderer.desiredWidth;
            axis.viewRect = Rect.createWithCoords(axisCoord - titleWidth, top, axisCoord + labelWidth, bottom);

            layoutAxisParts(axis, this.layoutAxisPartsStrategy);
        });
    }
}
// #region_layout_end

// #region_palette_start
/**
 * The highlight state of one record series while a {@link ParallelCoordinatePlotHighlightModifier}
 * range selection is active
 */
export enum EParallelHighlightState {
    /** No highlight is active; the series renders with its own styling (the palette returns undefined) */
    None = "None",
    /** A highlight is active and this record passes through the selected range */
    Highlighted = "Highlighted",
    /** A highlight is active and this record does NOT pass through the selected range */
    Dimmed = "Dimmed"
}

/**
 * A stroke {@link IStrokePaletteProvider} attached by {@link ParallelCoordinatePlotHighlightModifier} to each
 * record series of a Parallel Coordinate Plot.
 * @remarks
 * While a range highlight is active, records outside the selected range are dimmed (the series' own stroke with
 * its alpha multiplied down) and records inside it are drawn at the highlighted opacity. With no highlight active
 * every callback returns undefined, so the user's own styling (stroke, opacity, hover/selection effects) shows
 * through untouched.
 *
 * Note that a colour returned by a stroke palette replaces the series-level opacity, so both the dimmed and
 * highlighted opacities are baked into the returned colour's alpha channel.
 *
 * The palette is range-independent and only recomputes when {@link setHighlightState} changes the state,
 * so paletting does not re-run on zoom/pan.
 */
export class ParallelCoordinateHighlightPaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public isRangeIndependant: boolean = true;

    private parentSeries: IRenderableSeries | undefined = undefined;
    private state: EParallelHighlightState = EParallelHighlightState.None;
    /** The ARGB colour the whole series is drawn with, or undefined for the series' natural styling */
    private overrideArgb: number | undefined = undefined;
    private isDirty: boolean = true;

    /**
     * Sets this series' highlight state and the opacities to apply, and marks the palette dirty
     * so it is recomputed on the next render
     */
    public setHighlightState(state: EParallelHighlightState, dimmedOpacity: number, highlightedOpacity: number): void {
        this.state = state;
        this.overrideArgb = this.computeOverrideArgb(dimmedOpacity, highlightedOpacity);
        this.isDirty = true;
    }

    /** @inheritDoc */
    public onAttached(parentSeries: IRenderableSeries): void {
        this.parentSeries = parentSeries;
        this.isDirty = true;
    }

    /** @inheritDoc */
    public onDetached(): void {
        this.parentSeries = undefined;
    }

    /** @inheritDoc */
    public shouldUpdatePalette(): boolean {
        if (this.isDirty) {
            this.isDirty = false;
            return true;
        }
        return false;
    }

    /** @inheritDoc */
    public overrideStrokeArgb(): number | undefined {
        return this.overrideArgb;
    }

    private computeOverrideArgb(dimmedOpacity: number, highlightedOpacity: number): number | undefined {
        const stroke = this.parentSeries?.stroke;
        if (this.state === EParallelHighlightState.None || !stroke) {
            return undefined;
        }
        const alpha =
            this.state === EParallelHighlightState.Highlighted
                ? highlightedOpacity
                : (this.parentSeries.opacity ?? 1) * dimmedOpacity;
        const alphaByte = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
        return parseColorToUIntArgb(stroke, alphaByte);
    }
}
// #region_palette_end

// #region_highlight_start
/**
 * The arguments passed to {@link IParallelCoordinatePlotHighlightModifierOptions.onHighlightChanged}
 * when a range highlight is applied
 */
export type TParallelHighlightChangedArgs = {
    /** The index of the category (Y axis) the range was selected on */
    categoryIndex: number;
    /** The lower bound of the selected range, as a raw data value on that axis */
    min: number;
    /** The upper bound of the selected range, as a raw data value on that axis */
    max: number;
    /** The indexes of the records passing through the selected range */
    recordIndexes: number[];
};

/** Optional parameters used to configure a {@link ParallelCoordinatePlotHighlightModifier} */
export interface IParallelCoordinatePlotHighlightModifierOptions extends IRubberBandXyZoomModifierOptions {
    /**
     * Multiplier (0..1) applied to a record's own opacity when it falls outside the selected range,
     * while a highlight is active. Default 0.15
     */
    dimmedOpacity?: number;
    /** The stroke alpha (0..1) used for records inside the selected range, while a highlight is active. Default 1 */
    highlightedOpacity?: number;
    /**
     * Called when the highlight changes: with the selected axis/range/records when a range is selected,
     * or with undefined when the highlight is cleared
     */
    onHighlightChanged?: (args: TParallelHighlightChangedArgs | undefined) => void;
}

/**
 * @summary A chart modifier that highlights the records of a Parallel Coordinate Plot passing through
 * a range selected on one category Y axis
 * @description
 * Drag a rubber-band rectangle over one of the category axes: the x extent of the rectangle determines
 * which category axis is selected (the axis position nearest the centre of the dragged x range), and the
 * y extent is converted through that axis' own coordinate calculator into a raw value range. A custom
 * hit-test ({@link ParallelCoordinateDataSource.getRecordIndexesInRange}) then iterates just that category's
 * values, and every record series is paletted via {@link ParallelCoordinateHighlightPaletteProvider}:
 * records passing through the range keep full colour, all others are dimmed. Click (without dragging)
 * to clear the highlight.
 */
export class ParallelCoordinatePlotHighlightModifier extends RubberBandXyZoomModifier {
    public dimmedOpacity: number;
    public highlightedOpacity: number;
    public onHighlightChanged: ((args: TParallelHighlightChangedArgs | undefined) => void) | undefined;

    private readonly dataSource: ParallelCoordinateDataSource;
    private highlightedRecordIndexesProperty: number[] | undefined = undefined;

    constructor(dataSource: ParallelCoordinateDataSource, options?: IParallelCoordinatePlotHighlightModifierOptions) {
        super(options);
        this.dataSource = dataSource;
        this.dimmedOpacity = options?.dimmedOpacity ?? 0.15;
        this.highlightedOpacity = options?.highlightedOpacity ?? 1;
        this.onHighlightChanged = options?.onHighlightChanged;
    }

    /** The indexes of the currently highlighted records, or undefined when no highlight is active */
    public get highlightedRecordIndexes(): number[] | undefined {
        return this.highlightedRecordIndexesProperty;
    }

    /** Clears the highlight, restoring every record's own styling */
    public clearHighlight(): void {
        const hadHighlight = this.highlightedRecordIndexesProperty !== undefined;
        this.highlightedRecordIndexesProperty = undefined;
        this.dataSource.renderableSeries.forEach(series => {
            const provider = series.paletteProvider;
            if (provider instanceof ParallelCoordinateHighlightPaletteProvider) {
                provider.setHighlightState(EParallelHighlightState.None, this.dimmedOpacity, this.highlightedOpacity);
            }
        });
        if (hadHighlight) {
            this.onHighlightChanged?.(undefined);
            this.parentSurface?.invalidateElement();
        }
    }

    /** @inheritDoc */
    public modifierMouseUp(args: ModifierMouseArgs): void {
        const wasDragging = this.isClicked;
        super.modifierMouseUp(args);
        // A click (drag below the rubber-band sensitivity) clears the highlight. isClicked flipping to false
        // means the base class accepted and processed this mouse-up (execute conditions matched).
        if (
            wasDragging &&
            !this.isClicked &&
            this.pointFrom &&
            this.pointTo &&
            this.calculateDraggedDistance() <= RubberBandXyZoomModifier.MIN_DRAG_SENSITIVITY
        ) {
            this.clearHighlight();
        }
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.clearHighlight();
        super.onDetach();
    }

    /** Overridden to perform the range highlight instead of zooming. No axis range is changed */
    protected performZoom(pointFrom: Point, pointTo: Point): void {
        const categoryIndex = this.getCategoryIndexForXRange(pointFrom.x, pointTo.x);
        if (categoryIndex === undefined) {
            // The dragged x range contains no category axis position: treat as "select nothing"
            this.clearHighlight();
            return;
        }
        // Convert the y pixel range through the selected category axis' own calculator, so the range is in
        // that axis' raw data space at any zoom/pan level (and for flipped axes)
        const yCalc = this.dataSource.yAxes[categoryIndex].getCurrentCoordinateCalculator();
        const value1 = yCalc.getDataValue(pointFrom.y);
        const value2 = yCalc.getDataValue(pointTo.y);
        this.highlightRange(categoryIndex, Math.min(value1, value2), Math.max(value1, value2));
    }

    /**
     * Highlights the records passing through the given raw-value range on the category axis with the
     * given index, dimming all other records. Called by the rubber-band gesture, but can also be called
     * programmatically
     */
    public highlightRange(categoryIndex: number, min: number, max: number): void {
        const recordIndexes = this.dataSource.getRecordIndexesInRange(categoryIndex, min, max);
        this.applyHighlight({ categoryIndex, min, max, recordIndexes });
    }

    /**
     * Uses a dragged x coordinate range (pixels relative to the seriesViewRect) to find which category
     * Y axis to work on: category axes sit at x data positions 0..K-1, so this returns the position inside
     * the dragged x data range nearest to its centre, or undefined when no axis position falls inside the range
     */
    public getCategoryIndexForXRange(xFrom: number, xTo: number): number | undefined {
        const xCalc = this.parentSurface.getDefaultXAxis().getCurrentCoordinateCalculator();
        const dataValue1 = xCalc.getDataValue(xFrom);
        const dataValue2 = xCalc.getDataValue(xTo);
        const rangeMin = Math.min(dataValue1, dataValue2);
        const rangeMax = Math.max(dataValue1, dataValue2);
        const rangeCenter = (rangeMin + rangeMax) / 2;
        let nearestIndex: number | undefined;
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (let categoryIndex = 0; categoryIndex < this.dataSource.yAxes.length; categoryIndex++) {
            if (categoryIndex < rangeMin || categoryIndex > rangeMax) {
                continue;
            }
            const distance = Math.abs(categoryIndex - rangeCenter);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = categoryIndex;
            }
        }
        return nearestIndex;
    }

    private applyHighlight(args: TParallelHighlightChangedArgs): void {
        const selected = new Set(args.recordIndexes);
        this.dataSource.renderableSeries.forEach((series, recordIndex) => {
            const existing = series.paletteProvider;
            const provider =
                existing instanceof ParallelCoordinateHighlightPaletteProvider
                    ? existing
                    : new ParallelCoordinateHighlightPaletteProvider();
            if (provider !== existing) {
                series.paletteProvider = provider;
            }
            provider.setHighlightState(
                selected.has(recordIndex) ? EParallelHighlightState.Highlighted : EParallelHighlightState.Dimmed,
                this.dimmedOpacity,
                this.highlightedOpacity
            );
        });
        this.highlightedRecordIndexesProperty = args.recordIndexes;
        this.onHighlightChanged?.(args);
        this.parentSurface.invalidateElement();
    }
}
// #region_highlight_end

// #region_reorder_start
const SVG_NS = "http://www.w3.org/2000/svg";

/** Optional parameters used to configure a {@link ParallelCoordinateAxisReorderModifier} */
export interface IParallelCoordinateAxisReorderModifierOptions extends IChartModifierBaseOptions {
    /**
     * How close (in x data units, i.e. category positions) the pointer must be to a category axis on
     * mouse-down to start dragging it. Default 0.4
     */
    grabTolerance?: number;
}

/**
 * @summary A chart modifier that drags a category (Y) axis of a Parallel Coordinate Plot left/right to
 * reorder the dimensions.
 * @description
 * On mouse-down the modifier grabs the category axis nearest the pointer (within {@link grabTolerance}). On
 * mouse-up {@link ParallelCoordinateDataSource.moveCategory} moves the grabbed dimension into the slot nearest
 * the release point and rebuilds once - reordering on release (rather than per crossing) avoids repeated
 * rebuilds when dragging across several columns. Category axes sit at x data positions 0..K-1, so the target
 * slot is just the rounded pointer x.
 *
 * Shares the left-drag gesture with the range-highlight / rubber-band-zoom modifiers, so enable only one at a time.
 */
export class ParallelCoordinateAxisReorderModifier extends CustomChartModifier2D {
    public grabTolerance: number;

    private readonly dataSource: ParallelCoordinateDataSource;
    /** The category index currently being dragged, or undefined when not dragging */
    private dragIndex: number | undefined = undefined;
    /** A dashed vertical line marking the drop slot while dragging (pure SVG, no rebuild) */
    private dropIndicator: SVGLineElement | undefined = undefined;

    constructor(dataSource: ParallelCoordinateDataSource, options?: IParallelCoordinateAxisReorderModifierOptions) {
        super(options);
        this.dataSource = dataSource;
        this.grabTolerance = options?.grabTolerance ?? 0.4;
    }

    /** @inheritDoc */
    public get isEnabled(): boolean {
        return super.isEnabled;
    }
    /**
     * Overridden so the canvas shows the "grab" affordance while reordering is enabled, and reverts to the
     * default cursor when disabled (no mouse event fires while disabled, so this is the reset hook).
     */
    public set isEnabled(value: boolean) {
        super.isEnabled = value;
        this.setCursor(value ? ECursorStyle.Grab : ECursorStyle.Default);
    }

    private setCursor(style: ECursorStyle): void {
        const canvas = this.parentSurface?.getMainCanvas();
        if (canvas) {
            canvas.style.cursor = style;
        }
    }

    /**
     * Converts a canvas mouse point to a fractional category position on the x axis, or undefined when the
     * point is outside the series area.
     */
    private getFractionalCategory(args: ModifierMouseArgs): number | undefined {
        const xAxis = this.parentSurface?.getDefaultXAxis();
        if (!xAxis || !args.mousePoint) {
            return undefined;
        }
        const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
        if (!point) {
            return undefined;
        }
        return xAxis.getCurrentCoordinateCalculator().getDataValue(point.x);
    }

    /** The nearest category slot (0..K-1) to the pointer, clamped into range */
    private getTargetIndex(fractionalCategory: number): number {
        const lastIndex = this.dataSource.categories.length - 1;
        return Math.max(0, Math.min(lastIndex, Math.round(fractionalCategory)));
    }

    /**
     * Draws (or moves) a full-height dashed line at the drop slot. Coordinates are computed in device pixels
     * from the x coordinate calculator, then converted with translateToNotScaled into the not-scaled CSS-pixel
     * space the modifier SVG layer uses, so the line stays aligned with the axes on high-DPI displays.
     */
    private updateDropIndicator(slotIndex: number): void {
        const surface = this.parentSurface;
        if (!surface?.domSvgContainer) {
            return;
        }
        if (!this.dropIndicator) {
            const line = document.createElementNS(SVG_NS, "line");
            line.setAttribute("stroke", "#FFFFFF");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("stroke-dasharray", "4 4");
            line.setAttribute("pointer-events", "none");
            surface.domSvgContainer.appendChild(line);
            this.dropIndicator = line;
        }
        const { height } = surface.seriesViewRect;
        const coordSvgTranslation = surface.getCoordSvgTranslation();
        const xCalc = surface.getDefaultXAxis().getCurrentCoordinateCalculator();
        const x = translateToNotScaled(xCalc.getCoordinate(slotIndex) + coordSvgTranslation.x);
        this.dropIndicator.setAttribute("x1", String(x));
        this.dropIndicator.setAttribute("x2", String(x));
        this.dropIndicator.setAttribute("y1", String(translateToNotScaled(coordSvgTranslation.y)));
        this.dropIndicator.setAttribute("y2", String(translateToNotScaled(height + coordSvgTranslation.y)));
    }

    private removeDropIndicator(): void {
        this.dropIndicator?.remove();
        this.dropIndicator = undefined;
    }

    /** @inheritDoc */
    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        if (!this.checkExecuteConditions(args).isPrimary) {
            return;
        }
        const fractional = this.getFractionalCategory(args);
        if (fractional === undefined) {
            return;
        }
        const nearest = this.getTargetIndex(fractional);
        // Only grab if the pointer actually landed near an axis, so an empty-space drag does nothing.
        if (Math.abs(fractional - nearest) <= this.grabTolerance) {
            this.dragIndex = nearest;
            this.setCursor(ECursorStyle.Grabbing);
            this.updateDropIndicator(nearest);
        }
    }

    /** @inheritDoc */
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        if (this.dragIndex === undefined) {
            return;
        }
        // Move the drop indicator to the slot under the pointer. No reorder/rebuild happens until mouse-up.
        const fractional = this.getFractionalCategory(args);
        if (fractional !== undefined) {
            this.updateDropIndicator(this.getTargetIndex(fractional));
        }
    }

    /** @inheritDoc */
    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        if (this.dragIndex !== undefined) {
            // Reorder once, into the slot nearest the release point (a no-op if it lands back on itself).
            const fractional = this.getFractionalCategory(args);
            if (fractional !== undefined) {
                this.dataSource.moveCategory(this.dragIndex, this.getTargetIndex(fractional));
            }
        }
        this.dragIndex = undefined;
        this.removeDropIndicator();
        this.setCursor(ECursorStyle.Grab);
    }

    /** @inheritDoc */
    public modifierMouseLeave(args: ModifierMouseArgs): void {
        super.modifierMouseLeave(args);
        this.dragIndex = undefined;
        this.removeDropIndicator();
    }

    /** @inheritDoc */
    public onAttach(): void {
        super.onAttach();
        if (this.isEnabled) {
            this.setCursor(ECursorStyle.Grab);
        }
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.dragIndex = undefined;
        this.removeDropIndicator();
        this.setCursor(ECursorStyle.Default);
        super.onDetach();
    }
}
// #region_reorder_end

// #region_cursor_start
/** Optional parameters used to configure a {@link ParallelCoordinateCursorModifier} */
export interface IParallelCoordinateCursorModifierOptions extends ICursorModifierOptions {
    /** Fill colour of the data-point marker. Default "#32CD32" (green) */
    markerFill?: string;
    /** Radius of the data-point marker in CSS pixels. Default 4 */
    markerRadius?: number;
}

/**
 * A {@link CursorModifier} that additionally draws a small green circle over the data point the tooltip is
 * describing. The stock cursor draws the crosshair + tooltip but gives no marker at the hit-tested vertex; here
 * the nearest hit point (from the same hit-test the tooltip uses) is marked with an SVG circle in the modifier
 * layer. Coordinates come back in device pixels (seriesViewRect space) and are converted with
 * translateToNotScaled into the not-scaled space the SVG layer uses.
 */
export class ParallelCoordinateCursorModifier extends CursorModifier {
    public markerFill: string;
    public markerRadius: number;
    private marker: SVGCircleElement | undefined = undefined;

    constructor(options?: IParallelCoordinateCursorModifierOptions) {
        super(options);
        this.markerFill = options?.markerFill ?? "#32CD32";
        this.markerRadius = options?.markerRadius ?? 4;
    }

    /** @inheritDoc */
    protected getSeriesInfos(): SeriesInfo[] {
        const seriesInfos = super.getSeriesInfos();
        // Mark the nearest hit point - the same one whose record the tooltip is showing.
        const nearestHit = seriesInfos.filter(info => info.isHit).sort((a, b) => a.distance - b.distance)[0];
        if (nearestHit && nearestHit.xCoordinate !== undefined && nearestHit.yCoordinate !== undefined) {
            this.updateMarker(nearestHit.xCoordinate, nearestHit.yCoordinate);
        } else {
            this.hideMarker();
        }
        return seriesInfos;
    }

    private updateMarker(xCoord: number, yCoord: number): void {
        const surface = this.parentSurface;
        if (!surface?.domSvgContainer) {
            return;
        }
        if (!this.marker) {
            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("fill", this.markerFill);
            circle.setAttribute("stroke", "#FFFFFF");
            circle.setAttribute("stroke-width", "1");
            circle.setAttribute("pointer-events", "none");
            surface.domSvgContainer.appendChild(circle);
            this.marker = circle;
        }
        const coordSvgTranslation = surface.getCoordSvgTranslation();
        this.marker.setAttribute("cx", String(translateToNotScaled(xCoord + coordSvgTranslation.x)));
        this.marker.setAttribute("cy", String(translateToNotScaled(yCoord + coordSvgTranslation.y)));
        this.marker.setAttribute("r", String(this.markerRadius));
        this.marker.style.display = "";
    }

    private hideMarker(): void {
        if (this.marker) {
            this.marker.style.display = "none";
        }
    }

    /** @inheritDoc */
    public get isEnabled(): boolean {
        return super.isEnabled;
    }
    /** Hide the marker when the modifier is disabled (no mouse events fire while disabled). */
    public set isEnabled(value: boolean) {
        super.isEnabled = value;
        if (!value) {
            this.hideMarker();
        }
    }

    /** @inheritDoc */
    public modifierMouseLeave(args: ModifierMouseArgs): void {
        super.modifierMouseLeave(args);
        this.hideMarker();
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.marker?.remove();
        this.marker = undefined;
        super.onDetach();
    }
}
// #region_cursor_end

// #region_tooltip_start
const isParallelCoordinateHit = (seriesInfo: SeriesInfo): boolean => {
    const metadata = seriesInfo.pointMetadata as TParallelPointMetadata;
    // A PCP hit has category metadata. Note: isWithinDataBounds is intentionally NOT required - the
    // nearest-point hit-test can report a valid hit with isWithinDataBounds false.
    return metadata?.category !== undefined && metadata.recordIndex >= 0;
};

/**
 * Returns the {@link SeriesInfo} whose line passes closest to the cursor, out of a Parallel Coordinate Plot's
 * per-record series, or undefined if none were hit.
 * @remarks
 * Uses {@link SeriesInfo.distance}, the distance from the cursor to the series' point on the hovered category.
 * Because every record shares the same category X positions, this is effectively the vertical distance, so the
 * closest series is the record passing nearest the pointer.
 */
export const getClosestParallelCoordinateSeriesInfo = (seriesInfos: SeriesInfo[]): SeriesInfo | undefined => {
    let closest: SeriesInfo | undefined;
    seriesInfos.forEach(seriesInfo => {
        if (!isParallelCoordinateHit(seriesInfo)) {
            return;
        }
        if (!closest || seriesInfo.distance < closest.distance) {
            closest = seriesInfo;
        }
    });
    return closest;
};

/**
 * Creates a {@link TCursorTooltipDataTemplate} for a Parallel Coordinate Plot. A PCP draws every record as its
 * own series, so the default cursor tooltip would list all of them; this picks the single record whose line
 * passes closest to the cursor and shows the hovered category plus every dimension's value for that record.
 *
 * ```ts
 * sciChartSurface.chartModifiers.add(new CursorModifier({
 *     showTooltip: true,
 *     hitTestRadius: 2000,
 *     tooltipDataTemplate: createParallelCoordinateTooltipDataTemplate(data)
 * }));
 * ```
 */
export const createParallelCoordinateTooltipDataTemplate = (
    dataSource: ParallelCoordinateDataSource
): TCursorTooltipDataTemplate => {
    return (seriesInfos: SeriesInfo[], tooltipTitle: string): string[] => {
        const hit = getClosestParallelCoordinateSeriesInfo(seriesInfos);
        if (!hit) {
            return [];
        }
        const hitMetadata = hit.pointMetadata as TParallelPointMetadata;
        const lines: string[] = [`Category: ${hitMetadata.category}`, `Record Index: ${hitMetadata.recordIndex}`];
        // Then every category's actual value for the hovered record
        dataSource.categories.forEach(category => {
            lines.push(`${category.name} = ${category.values[hitMetadata.recordIndex]}`);
        });
        return lines;
    };
};
// #region_tooltip_end

// #region_main_start
const RECORD_COUNT = 100;

/**
 * Multi-series Parallel Coordinate Plot: one renderable series per record. Each line can be hovered or
 * clicked with the SeriesSelectionModifier, and dragging a range over a category axis highlights all the
 * records passing through that range.
 */
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });

    // A single, label-less X axis: the category axes are laid out along it, one per dimension
    const xAxis = new NumericAxis(wasmContext, { drawLabels: false, growBy: new NumberRange(0.07, 0.07) });
    sciChartSurface.xAxes.add(xAxis);

    // 1. Feed the multivariate dataset in, one array of values per dimension
    const carsData = generateData(RECORD_COUNT);
    const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface);
    data.addCategory("mpg", carsData.mpg, EAxisType.NumericAxis);
    data.addCategory("cylinders", carsData.cylinders, EAxisType.NumericAxis);
    data.addCategory("displacement", carsData.displacement, EAxisType.NumericAxis);
    data.addCategory("horsepower", carsData.horsepower, EAxisType.NumericAxis);
    data.addCategory("weight", carsData.weight, EAxisType.NumericAxis);
    data.addCategory("acceleration", carsData.acceleration, EAxisType.NumericAxis);
    data.addCategory("origin", carsData.origins, EAxisType.CategoryAxis);

    // 2. Style each record polyline. Bold + opaque when selected or hovered, faint otherwise
    const applySelectionStyle = (series: IRenderableSeries) => {
        series.strokeThickness = series.isSelected ? 4 : series.isHovered ? 3 : 2;
        series.opacity = series.isSelected || series.isHovered ? 1 : 0.5;
    };
    data.createSeriesFn = index => ({
        // interpolationPoints > 0 -> SplineLineRenderableSeries (smooth curves); 0 -> straight segments
        interpolationPoints: 0,
        stroke: originColors[carsData.origins[index]],
        strokeThickness: 2,
        opacity: 0.5,
        onSelectedChanged: applySelectionStyle,
        onHoveredChanged: applySelectionStyle
    });

    // 3. Create the axes, DataSeries and RenderableSeries
    data.build();

    // Range highlight: drag over a Y axis to highlight the records passing through it, click to clear
    const highlightModifier = new ParallelCoordinatePlotHighlightModifier(data);
    // Drag a category axis left/right to reorder the dimensions
    const axisReorderModifier = new ParallelCoordinateAxisReorderModifier(data);
    axisReorderModifier.isEnabled = false;
    // X-only rubber-band zoom and pan: the hidden Y axis holds all the geometry, so only X is zoomed
    const rubberBandZoomModifier = new RubberBandXyZoomModifier({ xyDirection: EXyDirection.XDirection });
    rubberBandZoomModifier.isEnabled = false;
    const panModifier = new ZoomPanModifier({ xyDirection: EXyDirection.XDirection });
    panModifier.isEnabled = false;
    // Hover/click a record line to select it (drives the per-series styling above)
    const seriesSelectionModifier = new SeriesSelectionModifier({ enableHover: true, enableSelection: true });
    // Hover tooltip showing every value of the nearest record
    const cursorModifier = new ParallelCoordinateCursorModifier({
        showAxisLabels: false,
        showTooltip: true,
        hitTestRadius: 2000,
        tooltipDataTemplate: createParallelCoordinateTooltipDataTemplate(data),
        isSvgOnly: true
    });
    cursorModifier.isEnabled = false;

    sciChartSurface.chartModifiers.add(
        highlightModifier,
        axisReorderModifier,
        rubberBandZoomModifier,
        panModifier,
        seriesSelectionModifier,
        cursorModifier,
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ includedYAxisIds: [PCP_HIDDEN_YAXIS_ID] })
    );

    // Wire up the toolbar. Highlight / reorder / zoom / pan all use the left-drag gesture, so only one
    // of them may be enabled at a time
    const leftDragTools: Record<string, { isEnabled: boolean }> = {
        highlight: highlightModifier,
        reorder: axisReorderModifier,
        zoom: rubberBandZoomModifier,
        pan: panModifier
    };
    document.querySelectorAll<HTMLInputElement>("input[name=tool]").forEach(radio => {
        radio.addEventListener("change", () => {
            Object.keys(leftDragTools).forEach(key => (leftDragTools[key].isEnabled = key === radio.value));
        });
    });
    document.getElementById("selection")?.addEventListener("change", e => {
        seriesSelectionModifier.isEnabled = (e.target as HTMLInputElement).checked;
    });
    document.getElementById("cursor")?.addEventListener("change", e => {
        cursorModifier.isEnabled = (e.target as HTMLInputElement).checked;
    });

    return { sciChartSurface, wasmContext };
};
// #region_main_end

drawExample("scichart-root");
