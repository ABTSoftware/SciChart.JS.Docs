---
sidebar_position: 3
---

# 3D Label Options

## Axis Label Styling

### Basic Label Style Properties

Configure axis label appearance using the labelStyle property on any 3D axis:

```typescript
import { NumericAxis3D } from "scichart";

const xAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "X Axis",
    labelStyle: {
        fontSize: 12,
        color: "#FFFFFF",
        fontFamily: "Arial"
    }
});
```

### Available Label Style Options

| Property     | Type     | Description                     | Example                  |
| ------------ | -------- | ------------------------------- | ------------------------ |
| `fontSize`   | `number` | Font size in pixels             | `12`                     |
| `color`      | `string` | Text color (hex, rgb, or named) | `"#FFFFFF"`, `"white"`   |
| `fontFamily` | `string` | Font family name                | `"Arial"`, `"Helvetica"` |

### Dynamic Label Style Updates

Update label styles at runtime:

```typescript
// Update font size
const setAxisLabelFontSize = (value: number, axis?: "x" | "y" | "z") => {
    if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelStyle.fontSize = value;
    if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelStyle.fontSize = value;
    if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelStyle.fontSize = value;
};

// Update font family
const updateFont = (font: string, axis?: "x" | "y" | "z") => {
    if (axis === "x" || !axis) {
        sciChart3DSurface.xAxis.labelStyle.fontFamily = font;
    }
    if (axis === "y" || !axis) {
        sciChart3DSurface.yAxis.labelStyle.fontFamily = font;
    }
    if (axis === "z" || !axis) {
        sciChart3DSurface.zAxis.labelStyle.fontFamily = font;
    }
};

// Update label color
sciChart3DSurface.xAxis.labelStyle.color = "#FF6B35";
```

## Axis Title Styling

### Basic Title Style Properties

Configure axis title appearance using the titleStyle property:

```typescript
const yAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Y Axis",
    titleStyle: {
        fontSize: 14,
        color: "#FF6B35",
        fontFamily: "Arial"
    }
});
```

### Dynamic Title Style Updates

```typescript
// Update title colors dynamically
const updateAxisTitleColor = (axis?: "x" | "y" | "z") => {
    if (axis === "x") {
        sciChart3DSurface.xAxis.titleStyle.color = "#FF6B35";
    }
    // Similar logic for y and z axes...
};
```

## Label Positioning

### Tick Labels Offset

Control the distance between axis labels and the axis line using tickLabelsOffset:

```typescript
const xAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "X Axis",
    tickLabelsOffset: 10 // Distance in pixels
});

// Update at runtime
const setTickLabelsOffset = (offset: number, axis?: "x" | "y" | "z") => {
    if (axis === "x" || !axis) sciChart3DSurface.xAxis.tickLabelsOffset = offset;
    if (axis === "y" || !axis) sciChart3DSurface.yAxis.tickLabelsOffset = offset;
    if (axis === "z" || !axis) sciChart3DSurface.zAxis.tickLabelsOffset = offset;
};
```

### Title Offset

Control the distance between axis titles and the axis using titleOffset:

```typescript
// Set title offset at runtime
const setTitleOffset = (offset: number, axis?: "x" | "y" | "z") => {
    if (axis === "x" || !axis) sciChart3DSurface.xAxis.titleOffset = offset;
    if (axis === "y" || !axis) sciChart3DSurface.yAxis.titleOffset = offset;
    if (axis === "z" || !axis) sciChart3DSurface.zAxis.titleOffset = offset;
};
```

## Label Orientation

### Label Orientation Modes

Control how labels are oriented in 3D space using labelOrientationMode:

```typescript
import { E3DLabelOrientationMode } from "scichart/types/TextStyle3D";

const xAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "X Axis",
    labelOrientationMode: E3DLabelOrientationMode.Auto
});
```

### Available Orientation Modes

| Mode                                 | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| `E3DLabelOrientationMode.Auto`       | Automatically orient labels for best readability |
| `E3DLabelOrientationMode.Horizontal` | Keep labels horizontal                           |
| `E3DLabelOrientationMode.Vertical`   | Keep labels vertical                             |

### Dynamic Orientation Updates

```typescript
const setLabelOrientationMode = (mode: E3DLabelOrientationMode, axis?: "x" | "y" | "z") => {
    if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelOrientationMode = mode;
    if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelOrientationMode = mode;
    if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelOrientationMode = mode;
};

// Usage
setLabelOrientationMode(E3DLabelOrientationMode.Horizontal, "x");
```

## Zy, Zx, Xy Planes

The Planes are defined as follows.

The Zy Plane is perpedicular to the X Axis (Right by default)
The Zx Plane is perpendicular to the Y Axis (up)
The Xy Plane is perpendicular to the Z Axis (Left by default)


## Axis Plane Label Display

### Draw Labels Mode

Control which labels are displayed on each axis plane using drawLabelsMode:

```typescript
import { EAxisPlaneDrawLabelsMode } from "scichart";

// Configure label display for XY plane
sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both;
sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalX;
sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Hidden;
```

### Available Draw Labels Modes

| Mode                              | Description                            |
| --------------------------------- | -------------------------------------- |
| `EAxisPlaneDrawLabelsMode.Both`   | Show labels for both axes on the plane |
| `EAxisPlaneDrawLabelsMode.LocalX` | Show only X-axis labels                |
| `EAxisPlaneDrawLabelsMode.LocalY` | Show only Y-axis labels                |
| `EAxisPlaneDrawLabelsMode.Hidden` | Hide all labels on this plane          |

### Draw Titles Mode

Control axis title display on planes using drawTitlesMode:

```typescript
// Configure title display for each plane
sciChart3DSurface.xyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Both;
sciChart3DSurface.zyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalX;
sciChart3DSurface.zxAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Hidden;
```

### Dynamic Plane Label Configuration

```typescript
const setDrawLabelsMode = (plane: string, mode: string) => {
    const labelMode =
        mode === "both"
            ? EAxisPlaneDrawLabelsMode.Both
            : mode === "hidden"
              ? EAxisPlaneDrawLabelsMode.Hidden
              : mode === "localx"
                ? EAxisPlaneDrawLabelsMode.LocalX
                : EAxisPlaneDrawLabelsMode.LocalY;

    if (plane === "xy") {
        sciChart3DSurface.xyAxisPlane.drawLabelsMode = labelMode;
    }
    if (plane === "zy") {
        sciChart3DSurface.zyAxisPlane.drawLabelsMode = labelMode;
    }
    if (plane === "zx") {
        sciChart3DSurface.zxAxisPlane.drawLabelsMode = labelMode;
    }
};
```

## Complete Configuration Examples

### Basic 3D Chart with Styled Labels

```typescript
import { SciChart3DSurface, NumericAxis3D, E3DLabelOrientationMode, EAxisPlaneDrawLabelsMode } from "scichart";

export const createStyledChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement);

    // Configure X-axis with custom label styling
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
        tickLabelsOffset: 15,
        labelOrientationMode: E3DLabelOrientationMode.Auto,
        labelStyle: {
            fontSize: 12,
            color: "#FF6B35",
            fontFamily: "Arial"
        },
        titleStyle: {
            fontSize: 14,
            color: "#FF6B35",
            fontFamily: "Arial"
        }
    });

    // Configure Y-axis
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        tickLabelsOffset: 15,
        labelStyle: {
            fontSize: 12,
            color: "#FFFFFF"
        }
    });

    // Configure Z-axis
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
        tickLabelsOffset: 15,
        labelStyle: {
            fontSize: 12,
            color: "#FFFFFF"
        }
    });

    // Configure axis plane label display
    sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both;
    sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalX;
    sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalY;

    return { sciChart3DSurface, wasmContext };
};
```

### Advanced Label Configuration with Runtime Updates

```typescript
export const createAdvancedChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement);

    // Initial axis setup
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
        tickLabelsOffset: 10,
        labelOrientationMode: E3DLabelOrientationMode.Auto
    });

    // Utility functions for runtime updates
    const controls = {
        // Update label font size
        setLabelFontSize: (size: number, axis?: "x" | "y" | "z") => {
            if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelStyle.fontSize = size;
            if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelStyle.fontSize = size;
            if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelStyle.fontSize = size;
        },

        // Update label colors
        setLabelColor: (color: string, axis?: "x" | "y" | "z") => {
            if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelStyle.color = color;
            if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelStyle.color = color;
            if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelStyle.color = color;
        },

        // Update label positioning
        setTickLabelsOffset: (offset: number, axis?: "x" | "y" | "z") => {
            if (axis === "x" || !axis) sciChart3DSurface.xAxis.tickLabelsOffset = offset;
            if (axis === "y" || !axis) sciChart3DSurface.yAxis.tickLabelsOffset = offset;
            if (axis === "z" || !axis) sciChart3DSurface.zAxis.tickLabelsOffset = offset;
        },

        // Update orientation mode
        setLabelOrientation: (mode: E3DLabelOrientationMode, axis?: "x" | "y" | "z") => {
            if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelOrientationMode = mode;
            if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelOrientationMode = mode;
            if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelOrientationMode = mode;
        }
    };

    return { sciChart3DSurface, wasmContext, controls };
};
```

### Font Registration for Custom Fonts

```typescript
// Register custom fonts before using them
const fonts = [
    {
        name: "braahone",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf"
    },
    {
        name: "iceland",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/iceland/Iceland-Regular.ttf"
    },
    { name: "antic", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/antic/Antic-Regular.ttf" },
    { name: "coda", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/coda/Coda-Regular.ttf" },
    { name: "forum", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/forum/Forum-Regular.ttf" }
];

// Register all fonts
await Promise.all(fonts.map(font => sciChart3DSurface.registerFont(font.name, font.url)));

// Use custom font in label styling
sciChart3DSurface.xAxis.labelStyle.fontFamily = "braahone";
sciChart3DSurface.xAxis.titleStyle.fontFamily = "braahone";
```

## Best Practices

1. **Performance**: Use reasonable font sizes (8-16px) for optimal rendering performance
2. **Readability**: Choose high contrast colors between labels and background
3. **Consistency**: Maintain consistent styling across all axes for professional appearance
4. **Responsive Design**: Consider adjusting label sizes and offsets based on chart dimensions
5. **Font Loading**: Always register custom fonts before applying them to avoid fallback issues
