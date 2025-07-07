---
sidebar_position: 4
---

# ✅ The SciChartSurface Camera

The property [SciChart3DSurface.Camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) defines an [ICameraController:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/icameracontroller.html) instance. By default this interface is implemented in [CameraController:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html) class.

By default, the [SciChart3DSurface.Camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) is set to a new [CameraController:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html) instance which defines the [position:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position), [target:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#target) (in world coordinates) of the camera, and whether the camera is in Perspective or Orthogonal projection modes.

<CenteredImageWrapper
    src="/images/Chart3D_Camera.png"
/>

Above: the representation of a Camera in 3D Space. The camera is attached to the [SciChart3DSurface.Camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) property and is defined by a [position:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position), [target:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position), plus other properties which define the properties of the viewport.

Camera Position, Target and other Properties
--------------------------------------------

The camera is defined by a [position:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position), [target:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position) which are XYZ vectors in World Coordinates. These can be set in the create() function of SciChart3DSurface or after creation of the chart.

Other properties which define the viewport as seen by the camera include:

| Property | Description | Default |
|----------|-------------|---------|
| [position:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position) | The position of the camera as a 3-component vector in World coordinates | `-` |
| [target:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#target) | The target (look-at) of the camera as a 3-component vector in World coordinates | `-` |
| [orbitalPitch:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orbitalpitch) | The pitch (vertical rotation angle) above or below the target in degrees | `-` |
| [orbitalYaw:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orbitalyaw) | The yaw (horizontal rotation angle) around the target in degrees | `-` |
| [projectionMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#projectionmode) | Defines if the camera is perspective or orthogonal | `Perspective` |
| [fieldOfView:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#fieldofview) | When `projectionMode=Perspective`, defines the field of view in degrees | `60` |
| [radius:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#radius) | When `projectionMode=Perspective`, get or set the distance of the camera position to target in World units | `-` |
| [orthoWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orthowidth) | Defines the width of the projected viewport when in `projectionMode=Orthogonal` | `600` |
| [orthoHeight:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orthoheight) | Defines the height of the projected viewport when in `projectionMode=Orthogonal` *(Note: Fixed typo from "Perspective" to "Orthogonal")* | `400` |
| [nearClip:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#nearclip) | Objects closer than `nearClip` will be hidden | `1` |
| [farClip:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#farclip) | Objects further than `farClip` will be hidden | `4000` |

A full list of properties, methods can be seen at the [CameraController:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html) Typedoc page.


### Debugging Camera Properties

You can be notified if any property on the camera is updated by subscribing to [camera.propertyChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#propertychanged). Note that this event will fire for properties set in code, or user input such as rotating, zooming or panning the chart.

It's also possible to debug the camera position & properties by calling [camera.debugOutput():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#debugoutput). This logs properties to the console window. The same function also returns an array of strings, which you can use to update the UI.

Putting these together you can create the following example:

<LiveDocSnippet maxWidth={"100%"} name="./DebuggingCameraProperties/demo" htmlPath="./DebuggingCameraProperties/demo.html" cssPath="./DebuggingCameraProperties/demo.css" />

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts showLineNumbers file=./DebuggingCameraProperties/demo.ts
```
```html showLineNumbers file=./DebuggingCameraProperties/demo.html
```
```css showLineNumbers file=./DebuggingCameraProperties/demo.css
```
</CodeSnippetBlock>

Camera Perspective vs. Orthogonal Mode
--------------------------------------

SciChart.js 3D also has an orthogonal mode. In this mode, there is no perspective effect of lines converging or diverging and all lines in the same X,Y or Z plane are parallel.

### In Perspective Mode

[Camera.position:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#position) and [camera.target:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#target) are obeyed. [Camera.radius:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#radius) can be get/set to adjust the distance between position & target. [Camera.fieldOfView:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#fieldofview) is obeyed.

### In Orthogonal Mode

Apparent distance to target is defined by [camera.orthoWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orthowidth) and [orthoHeight property:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orthoheight). Camera.radius is ignored.

when [projectionMode = ECameraProjectionMode.Orthogonal:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#projectionmode), instead of a pyramid shape for the camera view, imagine a box with parallel sides. The [orthoWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orthowidth) and [orthoHeight:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#orthoheight) specify the width and height of the view in 3D world coordinates. [Camera.radius:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cameracontroller.html#radius) makes no difference to apparent closeness to target as there is no persective (closer objects are not larger).  
    src="
        src="/images/Chart3D_Camera_Ortho.png"
    />

In this mode, **radius** and **fieldOfView** are ignored. Update the **orthoWidth** and **orthoHeight** property to modify apparent zoom. Camera **position**, **target** as well as **orbitalPitch**, **orbitalYaw** can be set to define camera orientation.

Find an example demonstrating camera orthogonal projection below.

<LiveDocSnippet maxWidth={"100%"} name="./Orthogonal/demo" htmlPath="./Orthogonal/demo.html" cssPath="./Orthogonal/demo.css" />

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts showLineNumbers file=./Orthogonal/demo.ts
```
```html showLineNumbers file=./Orthogonal/demo.html
```
```css showLineNumbers file=./Orthogonal/demo.css
```
</CodeSnippetBlock>