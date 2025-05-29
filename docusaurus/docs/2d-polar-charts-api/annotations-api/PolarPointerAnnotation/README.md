# PolarPointerAnnotation

The [PolarPointerAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpointerannotation.html) creates a customizable SVG pointer for polar charts, ideal for gauges or radial indicators. It consists of 3 customizable elements: a pointer stick, center circle (optional), and arrowhead (also optional).

## Basic Usage
```ts showLineNumbers file=./Basic/demo.js
```

## Key Configuration Properties

### Core Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `x1` | number | 0 | Rotation angle (radians/data-value) |
| `y1` | number | 0 | Pointer length (pixels/data-value) |
| `xCoordinateMode` | ECoordinateMode | DataValue | Units for rotation angle |
| `yCoordinateMode` | ECoordinateMode | DataValue | Units for pointer length |
| `isStrokeAboveCenter` | boolean | false | Z-order: pointer above/below center |

### Style Objects
```ts
// Pointer stick style
type TPointerStyle = {
  baseSize: number;    // Width relative to length (0.1 = 10%)
  fill: string;
  stroke: string;
  strokeWidth: number;
  backExtensionSize: number; // Base extension (0-1)
};

// Center circle style  
type TPointerCenterStyle = {
  size: number;       // Diameter relative to length
  fill: string;
  stroke: string;
  strokeWidth: number;
};

// Arrowhead style
type TPointerArrowStyle = {
  height: number;     // Size relative to pointer length
  width: number;
  headDepth: number;  // 0 (sharp) to 1 (filled triangle)
  fill: string;
  stroke: string;
  strokeWidth: number;
};
```

## Advanced Customization
Override SVG generation methods for full control:

```ts
const customPointer = new PolarPointerAnnotation({...});

// 1. Custom pointer stick
customPointer.getPointerStickSvg = (length, width) => `
  <path d="M0,0 L${length},${width/2} ..." 
        fill="..." stroke="..."/>
`;

// 2. Custom center circle
customPointer.getPointerCenterSvg = (length, size) => `
  <circle cx="${length}" cy="${length}" r="${size/2}" .../>
`;

// 3. Custom arrowhead 
customPointer.getPointerArrowSvg = (length, height, width) => `
  <polygon points="${tipX},${tipY} ${wing1X},${wing1Y} ..."/>
`;
```

## Inheritance & Coordinates
- Extends `SvgAnnotationBase` - inherits common SVG annotation properties
- Uses polar coordinate system:
  - `x1`: Angular position (radians or data values)
  - `y1`: Radial length (pixels or axis units)