---
sidebar_position: 2
---

# ⭕ Axis APIs - Convert Polar Pixel to Data Coordinates

API // coordinate transform api (and reverse transform)

const trans = axis.getTransform() // returns a coordinate transform object

trans.transformPoint(radius, angle, vec) => to cartesian 
trans.transformDataPoint(radius, angle, vec) => to cartesian dp. (polar to cart with coordinate calculator) (should be radian / angle)
trans.transformPoint(radius, angle, vec) => to cartesian dp

USE getVector2() 


- getTransform() has xCenter, yCenter, startAngle

TODO 


- important if someone wants to implement hitTest on polar series

"annotationHelpers.convertPolarToCartesian"

-  when you do this, these transforms use radians and angles, for data values, use coordinateTransform first
-  
<LiveDocSnippet maxWidth={"100%"} name="./demo" />