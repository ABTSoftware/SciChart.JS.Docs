import { BaseSceneEntity3D, Vector3, ESceneEntityType, ImmediateLitMeshContext } from "scichart";
export class AuroraRibbonSceneEntity extends BaseSceneEntity3D {
    type = ESceneEntityType.Custom;
    centers = [];
    left = [];
    right = [];
    colors = [];
    constructor(webAssemblyContext) {
        super(webAssemblyContext);
        this.setNativeEntity(webAssemblyContext.SCRTSceneEntity.implement(this));
        this.buildRibbon();
    }
    Render() {
        if (!this.isVisible || !this.currentRenderPassData)
            return;
        const context = new ImmediateLitMeshContext(this.webAssemblyContext, this.webAssemblyContext.eTSRRenderMode.TSR_RENDERMODE_TRIANGLESTRIP);
        // #region_coordinate_transform_start 
        const { xCalc, yCalc, zCalc, worldDimensions } = this.currentRenderPassData;
        const toWorld = (point) => new Vector3(xCalc.getCoordinate(point.x) - worldDimensions.x / 2, yCalc.getCoordinate(point.y), zCalc.getCoordinate(point.z) - worldDimensions.z / 2);
        // #region_coordinate_transform_end
        for (let i = 0; i < this.left.length; i++) {
            const left = toWorld(this.left[i]);
            const right = toWorld(this.right[i]);
            const previous = toWorld(this.centers[Math.max(0, i - 1)]);
            const next = toWorld(this.centers[Math.min(this.centers.length - 1, i + 1)]);
            const normal = this.getNormal(left, right, previous, next);
            context.normal3(normal.x, normal.y, normal.z);
            context.texCoord2(0, i / (this.left.length - 1));
            context.setVertexColor(this.colors[i]);
            context.setVertex3(left.x, left.y, left.z);
            context.texCoord2(1, i / (this.left.length - 1));
            context.setVertex3(right.x, right.y, right.z);
        }
        context.dispose();
    }
    buildRibbon() {
        const segmentCount = 240;
        const halfWidth = 13;
        const turns = 2.5;
        for (let i = 0; i < segmentCount; i++) {
            const progress = i / (segmentCount - 1);
            const angle = progress * turns * Math.PI * 2;
            const radius = 62 + 10 * Math.sin(angle * 0.6);
            this.centers.push(new Vector3(radius * Math.cos(angle), -75 + progress * 150, radius * Math.sin(angle)));
        }
        for (let i = 0; i < segmentCount; i++) {
            const center = this.centers[i];
            const previous = this.centers[Math.max(0, i - 1)];
            const next = this.centers[Math.min(segmentCount - 1, i + 1)];
            const angle = (i / (segmentCount - 1)) * turns * Math.PI * 2;
            const bank = 7 * Math.sin(angle * 3);
            const tangentX = next.x - previous.x;
            const tangentZ = next.z - previous.z;
            const tangentLength = Math.hypot(tangentX, tangentZ) || 1;
            const widthX = tangentZ / tangentLength;
            const widthZ = -tangentX / tangentLength;
            const left = new Vector3(center.x - widthX * halfWidth, center.y - bank, center.z - widthZ * halfWidth);
            const right = new Vector3(center.x + widthX * halfWidth, center.y + bank, center.z + widthZ * halfWidth);
            this.left.push(left);
            this.right.push(right);
            const progress = i / (segmentCount - 1);
            const red = Math.round(50 + progress * 170);
            const green = Math.round(225 - progress * 125);
            const blue = Math.round(255 - progress * 45);
            this.colors.push(((0xff << 24) | (red << 16) | (green << 8) | blue) >>> 0);
        }
    }
    getNormal(left, right, previous, next) {
        const acrossX = right.x - left.x;
        const acrossY = right.y - left.y;
        const acrossZ = right.z - left.z;
        const alongX = next.x - previous.x;
        const alongY = next.y - previous.y;
        const alongZ = next.z - previous.z;
        let normalX = acrossY * alongZ - acrossZ * alongY;
        let normalY = acrossZ * alongX - acrossX * alongZ;
        let normalZ = acrossX * alongY - acrossY * alongX;
        const length = Math.hypot(normalX, normalY, normalZ) || 1;
        normalX /= length;
        normalY /= length;
        normalZ /= length;
        return new Vector3(normalX, normalY, normalZ);
    }
}
