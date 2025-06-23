import * as SciChart from "scichart";

/** @import {BoxAnnotation} from "scichart" */

const {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    BoxAnnotation,
    ECoordinateMode,
    AnnotationHoverModifier,
    EHoverMode
} = SciChart;

async function annotationHover(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    // Add an annotation with hover behaviour
    const boxAnnotation = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        fill: "#3d34eb",
        strokeThickness: 1,
        x1: 0.1,
        x2: 0.4,
        y1: 0.4,
        y2: 0.6,
        onHover: args => {
            const { sender, mouseArgs, isHovered } = args;
            if (mouseArgs && isHovered) {
                const relativeCoordinates = args.getRelativeCoordinates();
                console.log("The annotation is hovered at", relativeCoordinates);
            }
        }
    });
    sciChartSurface.annotations.add(boxAnnotation);
    // Add AnnotationHoverModifier to enable hover behaviour
    const annotationHoverModifier = new AnnotationHoverModifier({
        enableHover: true,
        targets: [boxAnnotation],
        hoverMode: EHoverMode.AbsoluteTopmost,
        notifyOutEvent: true,
        notifyPositionUpdate: true,
        onHover: args => {
            const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
            const hoveredAnnotations = /** @type {BoxAnnotation[]} */ hoveredEntities;
            const unhoveredAnnotations = /** @type {BoxAnnotation[]} */ unhoveredEntities;
            hoveredAnnotations.forEach(annotation => {
                annotation.fill = "#34eb8c";
                annotation.strokeThickness = 3;
            });
            unhoveredAnnotations.forEach(annotation => {
                annotation.fill = "#3d34eb";
                annotation.strokeThickness = 1;
            });
        }
    });
    sciChartSurface.chartModifiers.add(annotationHoverModifier);
    // #region_A_end
    // #region_B_start
    // subscribe via Event Handler
    boxAnnotation.hovered.subscribe(args => {
        // ...
    });
    // #region_B_end
    // #region_C_start
    // subscribe via Event Handler
    annotationHoverModifier.hoverChanged.subscribe(args => {
        // ...
    });
    // #region_C_end
    return { sciChartSurface };
}

annotationHover("scichart-root");

const { chartBuilder, EChart2DModifierType, EAnnotationType } = SciChart;

async function builderExample(divElementId) {
    // #region_D_start
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: new SciChartJsNavyTheme()
        },
        // Add an annotation with hover behaviour
        annotations: [
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    id: "boxAnnotation",
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    fill: "#3d34eb",
                    strokeThickness: 1,
                    x1: 0.1,
                    x2: 0.4,
                    y1: 0.4,
                    y2: 0.6,
                    onHover: args => {
                        const { sender, mouseArgs, isHovered } = args;
                        if (mouseArgs && isHovered) {
                            const relativeCoordinates = args.getRelativeCoordinates();
                            console.log("The annotation is hovered at", relativeCoordinates);
                        }
                    }
                }
            }
        ],
        // Add AnnotationHoverModifier to enable hover behaviour
        modifiers: [
            {
                type: EChart2DModifierType.AnnotationHover,
                options: {
                    enableHover: true,
                    targets: ["boxAnnotation"],
                    hoverMode: EHoverMode.AbsoluteTopmost,
                    notifyOutEvent: true,
                    notifyPositionUpdate: true,
                    onHover: args => {
                        const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
                        const hoveredAnnotations = /** @type {BoxAnnotation[]} */ (hoveredEntities);
                        const unhoveredAnnotations = /** @type {BoxAnnotation[]} */ (unhoveredEntities);
                        hoveredAnnotations.forEach(annotation => {
                            annotation.fill = "#34eb8c";
                            annotation.strokeThickness = 3;
                        });
                        unhoveredAnnotations.forEach(annotation => {
                            annotation.fill = "#3d34eb";
                            annotation.strokeThickness = 1;
                        });
                    }
                }
            }
        ]
    });
    // #region_D_end

    return { sciChartSurface };
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
