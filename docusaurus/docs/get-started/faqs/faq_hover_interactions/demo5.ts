import {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    BoxAnnotation,
    AnnotationHoverModifier,
    EHoverMode,
    NumberRange
} from "scichart";

async function demo(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Add axes with some padding
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // Create BoxAnnotation with hover behavior
    const boxAnnotation = new BoxAnnotation({
        // Position the box over part of the data
        x1: 2,
        x2: 6,
        y1: 3,
        y2: 5,

        // Initial styling
        fill: "#3d34eb77", // Semi-transparent blue
        stroke: "#3d34eb",
        strokeThickness: 1,

        // Individual annotation hover callback
        onHover: args => {
            const { isHovered, mouseArgs } = args;
            console.log("BoxAnnotation hovered:", isHovered);

            if (isHovered && mouseArgs) {
                const coordinates = args.getRelativeCoordinates();
                console.log("Hover position (relative):", coordinates);
            }
        }
    });

    // Add the annotation to the chart
    sciChartSurface.annotations.add(boxAnnotation);

    const secondBoxAnnotation = new BoxAnnotation({
        x1: 7,
        x2: 9,
        y1: 4,
        y2: 5.5,
        fill: "#eb343477", // Semi-transparent red
        stroke: "#eb3434",
        strokeThickness: 1,
        onHover: args => {
            console.log("Second BoxAnnotation hovered:", args.isHovered);
        }
    });

    sciChartSurface.annotations.add(secondBoxAnnotation);

    // region_A_start
    // Create AnnotationHoverModifier to enable hover detection
    const annotationHoverModifier = new AnnotationHoverModifier({
        enableHover: true,
        targets: [boxAnnotation, secondBoxAnnotation], // Specify which annotations to monitor
        hoverMode: EHoverMode.AbsoluteTopmost, // Only top annotation if overlapping
        notifyOutEvent: true, // Fire events when mouse leaves annotation
        notifyPositionUpdate: false, // Don't fire events on position updates within annotation

        // Global hover callback for all targeted annotations
        onHover: args => {
            const { hoveredEntities, unhoveredEntities } = args;

            // Change appearance of hovered annotations
            hoveredEntities.forEach(annotation => {
                console.log(annotation);

                if (annotation instanceof BoxAnnotation) {
                    annotation.fill = "#34eb8c77"; // Semi-transparent green
                    annotation.stroke = "#34eb8c";
                    annotation.strokeThickness = 3;
                }
                console.log("Annotation became hovered:", annotation);
            });

            // Reset appearance of unhovered annotations
            unhoveredEntities.forEach(annotation => {
                if (annotation instanceof BoxAnnotation) {
                    annotation.fill = "#3d34eb77"; // Back to blue
                    annotation.stroke = "#3d34eb";
                    annotation.strokeThickness = 1;
                }
                console.log("Annotation became unhovered:", annotation);
            });
        }
    });

    // Add the hover modifier to enable the functionality
    sciChartSurface.chartModifiers.add(annotationHoverModifier);
    // region_A_end

}

demo("scichart-root");
