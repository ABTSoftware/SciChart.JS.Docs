import { SciChartSurface, NumericAxis, SciChartJsNavyTheme, TriangleRenderableSeries, XyDataSeries, ETriangleSeriesDrawMode, ZoomPanModifier, ZoomExtentsModifier, NumberRange } from "scichart";
// code based on Sweep-line algorithm for constrained Delaunay triangulation
function findTrianglesWithEdge(edge, triangles) {
    const [p1, p2] = edge;
    return triangles.filter(triangle => {
        const edges = [
            [triangle.a, triangle.b],
            [triangle.b, triangle.c],
            [triangle.c, triangle.a]
        ];
        return edges.some(e => (pointsEqual(e[0], p1) && pointsEqual(e[1], p2)) || (pointsEqual(e[0], p2) && pointsEqual(e[1], p1)));
    });
}
function formQuadrilateral(triangle1, triangle2, sharedEdge) {
    // Find the two vertices not on the shared edge
    const [p1, p2] = sharedEdge;
    const vertices1 = [triangle1.a, triangle1.b, triangle1.c];
    const vertices2 = [triangle2.a, triangle2.b, triangle2.c];
    const vertex1 = vertices1.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));
    const vertex2 = vertices2.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));
    return [p1, vertex1, p2, vertex2];
}
function isConvex(quad) {
    // Check if quadrilateral is convex by testing all interior angles < 180°
    const [p1, p2, p3, p4] = quad;
    function crossProduct(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }
    const signs = [
        crossProduct(p1, p2, p3),
        crossProduct(p2, p3, p4),
        crossProduct(p3, p4, p1),
        crossProduct(p4, p1, p2)
    ];
    // All cross products should have the same sign for convex polygon
    return signs.every(s => s >= 0) || signs.every(s => s <= 0);
}
function shouldFlip(edge, quad) {
    // Check if flipping the edge improves Delaunay property
    const [p1, p2, p3, p4] = quad;
    // Current configuration: edge p1-p3
    // Proposed flip: edge p2-p4
    // Check if new triangles would be better (simplified heuristic)
    const currentAngle1 = getMinAngle([p1, p2, p3]);
    const currentAngle2 = getMinAngle([p1, p3, p4]);
    const newAngle1 = getMinAngle([p1, p2, p4]);
    const newAngle2 = getMinAngle([p2, p3, p4]);
    return Math.min(newAngle1, newAngle2) > Math.min(currentAngle1, currentAngle2);
}
function flipEdge(affectedTriangles, triangles) {
    if (affectedTriangles.length !== 2)
        return;
    const [tri1, tri2] = affectedTriangles;
    // Find shared edge
    const edges1 = [
        [tri1.a, tri1.b],
        [tri1.b, tri1.c],
        [tri1.c, tri1.a]
    ];
    const edges2 = [
        [tri2.a, tri2.b],
        [tri2.b, tri2.c],
        [tri2.c, tri2.a]
    ];
    let sharedEdge = null;
    for (let e1 of edges1) {
        for (let e2 of edges2) {
            if ((pointsEqual(e1[0], e2[0]) && pointsEqual(e1[1], e2[1])) ||
                (pointsEqual(e1[0], e2[1]) && pointsEqual(e1[1], e2[0]))) {
                sharedEdge = e1;
                break;
            }
        }
        if (sharedEdge)
            break;
    }
    if (!sharedEdge)
        return;
    // Find the vertices not on shared edge
    const vertices1 = [tri1.a, tri1.b, tri1.c];
    const vertices2 = [tri2.a, tri2.b, tri2.c];
    const [p1, p2] = sharedEdge;
    const vertex1 = vertices1.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));
    const vertex2 = vertices2.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));
    // Remove old triangles
    const index1 = triangles.indexOf(tri1);
    const index2 = triangles.indexOf(tri2);
    if (index1 > -1)
        triangles.splice(index1, 1);
    if (index2 > -1)
        triangles.splice(index2 > index1 ? index2 - 1 : index2, 1);
    // Add new triangles with flipped edge
    triangles.push({ a: p1, b: vertex1, c: vertex2 });
    triangles.push({ a: p2, b: vertex1, c: vertex2 });
}
function pointsEqual(p1, p2) {
    const epsilon = 1e-10;
    return Math.abs(p1[0] - p2[0]) < epsilon && Math.abs(p1[1] - p2[1]) < epsilon;
}
function getMinAngle(triangle) {
    const [a, b, c] = triangle;
    function angle(p1, vertex, p2) {
        const v1 = [p1[0] - vertex[0], p1[1] - vertex[1]];
        const v2 = [p2[0] - vertex[0], p2[1] - vertex[1]];
        const dot = v1[0] * v2[0] + v1[1] * v2[1];
        const mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
        const mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
        return Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))));
    }
    const angle1 = angle(b, a, c);
    const angle2 = angle(a, b, c);
    const angle3 = angle(a, c, b);
    return Math.min(angle1, angle2, angle3);
}
function constrainedDelaunayTriangulation(points) {
    // Close polygon if needed
    const polygon = closePolygon(points);
    const constraints = createConstraints(polygon);
    // Create bounding triangle
    const bounds = getBounds(polygon);
    const superTriangle = createSuperTriangle(bounds);
    const allPoints = [...polygon, ...superTriangle];
    // Initial Delaunay triangulation using Bowyer-Watson
    let triangles = bowyerWatson(allPoints);
    // Enforce constraints using sweep-line approach
    constraints.forEach(constraint => {
        triangles = enforceConstraint(constraint, triangles);
    });
    // Remove super triangle and external triangles
    triangles = triangles.filter(t => !containsSuperVertex(t, superTriangle) && isTriangleInside(t, polygon));
    return triangles.map(t => [t.a, t.b, t.c]);
}
// Bowyer-Watson algorithm for Delaunay triangulation
function bowyerWatson(points) {
    const triangles = [];
    // Start with super triangle
    const bounds = getBounds(points);
    const super1 = [bounds.minX - 100, bounds.minY - 100];
    const super2 = [bounds.maxX + 100, bounds.minY - 100];
    const super3 = [bounds.maxX / 2, bounds.maxY + 100];
    triangles.push({ a: super1, b: super2, c: super3 });
    // Add points one by one
    points.forEach(point => {
        const badTriangles = [];
        const polygon = [];
        // Find bad triangles (circumcircle contains point)
        triangles.forEach((triangle, i) => {
            if (inCircumcircle(point, triangle)) {
                badTriangles.push(i);
                // Add edges to polygon
                addEdgeToPolygon(polygon, [triangle.a, triangle.b]);
                addEdgeToPolygon(polygon, [triangle.b, triangle.c]);
                addEdgeToPolygon(polygon, [triangle.c, triangle.a]);
            }
        });
        // Remove bad triangles
        badTriangles.sort((a, b) => b - a).forEach(i => triangles.splice(i, 1));
        // Create new triangles
        polygon.forEach(edge => {
            triangles.push({ a: edge[0], b: edge[1], c: point });
        });
    });
    return triangles;
}
// Constraint enforcement using edge swapping
function enforceConstraint(constraint, triangles) {
    const [p1, p2] = constraint;
    const intersectingEdges = findIntersectingEdges(p1, p2, triangles);
    intersectingEdges.forEach(edge => {
        const affectedTriangles = findTrianglesWithEdge(edge, triangles);
        if (affectedTriangles.length === 2) {
            const quad = formQuadrilateral(affectedTriangles[0], affectedTriangles[1], edge);
            if (isConvex(quad) && shouldFlip(edge, quad)) {
                flipEdge(affectedTriangles, triangles);
            }
        }
    });
    return triangles;
}
// Geometric helper functions
function inCircumcircle(point, triangle) {
    const [ax, ay] = triangle.a;
    const [bx, by] = triangle.b;
    const [cx, cy] = triangle.c;
    const [dx, dy] = point;
    const adx = ax - dx, ady = ay - dy;
    const bdx = bx - dx, bdy = by - dy;
    const cdx = cx - dx, cdy = cy - dy;
    const abdet = adx * bdy - bdx * ady;
    const bcdet = bdx * cdy - cdx * bdy;
    const cadet = cdx * ady - adx * cdy;
    const alift = adx * adx + ady * ady;
    const blift = bdx * bdx + bdy * bdy;
    const clift = cdx * cdx + cdy * cdy;
    return alift * bcdet + blift * cadet + clift * abdet > 0;
}
function orientation(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (Math.abs(val) < 1e-10)
        return 0; // collinear
    return val > 0 ? 1 : 2; // clockwise or counterclockwise
}
function segmentsIntersect(p1, q1, p2, q2) {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);
    return ((o1 !== o2 && o3 !== o4) ||
        (o1 === 0 && onSegment(p1, p2, q1)) ||
        (o2 === 0 && onSegment(p1, q2, q1)) ||
        (o3 === 0 && onSegment(p2, p1, q2)) ||
        (o4 === 0 && onSegment(p2, q1, q2)));
}
function onSegment(p, q, r) {
    return (q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1]));
}
function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if (polygon[i][1] > point[1] !== polygon[j][1] > point[1] &&
            point[0] <
                ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1])) / (polygon[j][1] - polygon[i][1]) +
                    polygon[i][0]) {
            inside = !inside;
        }
    }
    return inside;
}
// Utility functions
function closePolygon(points) {
    const first = points[0];
    const last = points[points.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        return [...points, first];
    }
    return points;
}
function createConstraints(polygon) {
    const constraints = [];
    for (let i = 0; i < polygon.length - 1; i++) {
        constraints.push([polygon[i], polygon[i + 1]]);
    }
    return constraints;
}
function getBounds(points) {
    return points.reduce((bounds, point) => ({
        minX: Math.min(bounds.minX, point[0]),
        maxX: Math.max(bounds.maxX, point[0]),
        minY: Math.min(bounds.minY, point[1]),
        maxY: Math.max(bounds.maxY, point[1])
    }), {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity
    });
}
function createSuperTriangle(bounds) {
    const dx = bounds.maxX - bounds.minX;
    const dy = bounds.maxY - bounds.minY;
    const deltaMax = Math.max(dx, dy) * 2;
    return [
        [bounds.minX - deltaMax, bounds.minY - deltaMax],
        [bounds.maxX + deltaMax, bounds.minY - deltaMax],
        [(bounds.minX + bounds.maxX) / 2, bounds.maxY + deltaMax]
    ];
}
function findIntersectingEdges(p1, p2, triangles) {
    const intersecting = [];
    triangles.forEach(triangle => {
        const edges = [
            [triangle.a, triangle.b],
            [triangle.b, triangle.c],
            [triangle.c, triangle.a]
        ];
        edges.forEach(edge => {
            if (segmentsIntersect(p1, p2, edge[0], edge[1])) {
                intersecting.push(edge);
            }
        });
    });
    return intersecting;
}
function isTriangleInside(triangle, polygon) {
    const centroid = [
        (triangle.a[0] + triangle.b[0] + triangle.c[0]) / 3,
        (triangle.a[1] + triangle.b[1] + triangle.c[1]) / 3
    ];
    return pointInPolygon(centroid, polygon);
}
function containsSuperVertex(triangle, superTriangle) {
    return superTriangle.some(superVertex => (triangle.a[0] === superVertex[0] && triangle.a[1] === superVertex[1]) ||
        (triangle.b[0] === superVertex[0] && triangle.b[1] === superVertex[1]) ||
        (triangle.c[0] === superVertex[0] && triangle.c[1] === superVertex[1]));
}
function addEdgeToPolygon(polygon, edge) {
    // Only add edge if it's not already in polygon (removes duplicates)
    const exists = polygon.some(existingEdge => existingEdge[0] === edge[1] && existingEdge[1] === edge[0]);
    if (!exists) {
        polygon.push(edge);
    }
    else {
        // Remove the existing edge (it was shared by two triangles)
        const index = polygon.findIndex(existingEdge => existingEdge[0] === edge[1] && existingEdge[1] === edge[0]);
        polygon.splice(index, 1);
    }
}
// code based on Sweep-line algorithm for constrained Delaunay triangulation end //
const tasmania = [
    // [146, -42],
    // [147.68925947488418, -40.808258152022674],
    [146.3641207216237, -41.13769540788336],
    [145.3979781434948, -40.79254851660594],
    [144.7437545106797, -40.70397511165767],
    [144.71807132383066, -41.16255177181576],
    [145.29509036680173, -42.033609714527564],
    [145.4319295595106, -42.693776137056254],
    [146.04837772032033, -43.549744561538844],
    [146.87034305235488, -43.6345972633621],
    [147.56456424376393, -42.937688897473905],
    [147.91405195535384, -43.211522312188535],
    [148.01730146707303, -42.40702361426865],
    [148.35986453673587, -42.06244516374644],
    [148.289067824496, -40.87543751400211],
    [147.68925947488418, -40.808258152022674]
];
const australia = [
    // [135, -25],
    // [126.14871382050114, -32.21596607842059],
    [127.1028674663383, -32.28226694105106],
    [129.53579389863972, -31.590422865527465],
    [131.32633060112084, -31.49580331800104],
    [132.28808068250487, -31.982646986622782],
    [132.99077680880976, -32.01122405368019],
    [134.27390262261702, -32.61723357516699],
    [134.08590376193916, -32.84807219821479],
    [134.6134167827746, -33.222778008763164],
    [135.23921837782916, -33.94795338311502],
    [135.20821251845405, -34.478670342752565],
    [135.98904341038428, -34.89011809666046],
    [136.37206912653164, -34.094766127256236],
    [136.9968371929404, -33.752771498348615],
    [137.81032759007905, -32.90000701266812],
    [137.8901160015377, -33.64047861097838],
    [137.50388634658827, -34.13026783624075],
    [137.35237104710848, -34.7073385556441],
    [136.8294055523147, -35.26053476332861],
    [137.71917036351618, -35.076825046531],
    [138.20756432510672, -34.38472258884593],
    [138.44946170466494, -35.127261244447865],
    [138.12074791885635, -35.61229623793939],
    [139.08280805883413, -35.732754001611745],
    [139.57414757706528, -36.13836231867066],
    [139.8065881695141, -36.64360279718831],
    [139.99215823787426, -37.402936293285094],
    [140.63857872941327, -38.019332777662555],
    [141.60658165910468, -38.30851409276788],
    [142.17832970598192, -38.380034275059835],
    [143.60997358619602, -38.8094654274053],
    [144.48568240781407, -38.085323581699285],
    [145.03221235573295, -37.89618783951102],
    [144.87697635312816, -38.41744801203915],
    [145.4896521343806, -38.59376799901902],
    [146.31792199115478, -39.03575652441141],
    [147.38173302631526, -38.21921721776752],
    [148.30462243061584, -37.809061374666925],
    [149.42388227762552, -37.77268116633344],
    [149.99728397033613, -37.42526051203518],
    [150.0752120302323, -36.42020558039054],
    [150.3282198427333, -35.671879164371916],
    [150.71413943908902, -35.173459974916796],
    [151.0105554547152, -34.31036020277793],
    [151.70911746643674, -33.041342054986394],
    [152.45000247620533, -32.550002536755265],
    [152.89157759013938, -31.640445651986],
    [153.08960167868184, -30.923641859665423],
    [153.06924116435886, -30.350240166954794],
    [153.51210818910022, -28.99507740653271],
    [153.56946902894418, -28.11006682710208],
    [153.0929089703485, -27.260299574494514],
    [153.1361621441768, -26.071173191026215],
    [152.8551973818059, -25.267501316023],
    [152.07353966695905, -24.457886651306225],
    [150.89955447815225, -23.462236830338696],
    [150.72726525289113, -22.402404880464665],
    [150.48293908101516, -22.556142266532994],
    [150.07738244038853, -22.122783705333337],
    [149.6783370302307, -22.342511895438385],
    [149.28942020080206, -21.260510756111135],
    [148.71746544819558, -20.63346892668155],
    [148.84841352762322, -20.391209812097244],
    [147.4710815777479, -19.48072275154673],
    [146.38747846901964, -18.958274021075887],
    [146.06367394427872, -18.28007252367734],
    [146.16030887266453, -17.761654554925272],
    [145.88890425026761, -16.906926364817686],
    [145.637033319277, -16.78491830817657],
    [145.27199100156724, -15.428205254785732],
    [145.3747237489635, -14.98497649501833],
    [144.89490807513346, -14.594457696188641],
    [144.56371382057483, -14.171176039285903],
    [143.9220992372389, -14.548310642151996],
    [143.5618111513, -13.763655694232192],
    [143.5221236512998, -12.834358412327433],
    [143.15863162655876, -12.325655612846232],
    [143.11594689348573, -11.905629571177885],
    [142.86676313697427, -11.784706719614903],
    [142.797310011974, -11.157354831591562],
    [142.51526004452495, -10.668185723516686],
    [142.1437064963464, -11.042736504768186],
    [142.11848839738798, -11.328042087451612],
    [141.68699018775084, -12.407614434461145],
    [141.8426912782462, -12.741547539931231],
    [141.65092003801107, -12.944687595270585],
    [141.5198686057189, -13.698078301653808],
    [141.6355204611881, -14.270394789286307],
    [141.56338016170866, -14.561333103089552],
    [141.70218305884464, -15.044921156476901],
    [141.39822228410384, -15.840531508042588],
    [141.27409549373874, -16.38887013109165],
    [140.87546349503924, -17.369068698803908],
    [140.21524539607827, -17.710804945550066],
    [139.2605749859182, -17.371600843986208],
    [139.10854292211548, -17.06267913174539],
    [138.58516401586343, -16.806622409739155],
    [138.30321740127897, -16.807604261952704],
    [137.06536014215942, -15.87076222093333],
    [136.2951745952813, -15.55026498785913],
    [135.50018436090318, -14.997740573794424],
    [135.4286641786112, -14.715432224183912],
    [136.07761681533253, -13.724278252825783],
    [135.96175825413417, -13.324509372615852],
    [136.3054065288751, -13.291229750219884],
    [136.6851249533558, -12.887223402562022],
    [136.951620314685, -12.351958916882793],
    [136.49247521377168, -11.857208754120398],
    [136.2583809754895, -12.049341729381588],
    [135.8826933127276, -11.962266940969776],
    [135.29849124566795, -12.248606052299046],
    [134.67863244032696, -11.941182956594693],
    [134.39306847548204, -12.042365411022182],
    [133.55084598198908, -11.786515394745116],
    [133.01956058159635, -11.376411228076812],
    [132.3572237489114, -11.128519382372696],
    [131.82469811414364, -11.27378183354515],
    [132.55721154188097, -11.603012383676678],
    [132.5752982931831, -12.114040622611007],
    [131.73509118054955, -12.302452894747184],
    [131.22349450086, -12.183648776908166],
    [130.61779503796697, -12.536392103732489],
    [130.18350630098604, -13.107520033422276],
    [130.33946577364293, -13.357375583553484],
    [129.8886405783286, -13.618703301653492],
    [129.40960005098293, -14.42066985439107],
    [129.62147342337965, -14.969783623924522],
    [128.35968997610894, -14.869169610252243],
    [127.80463341686196, -14.27690601975508],
    [127.06586714081732, -13.817967624570954],
    [125.68579634003055, -14.23065561285385],
    [125.67008670461381, -14.510070082256014],
    [125.16727501841387, -14.680395603090028],
    [124.92615278534004, -15.07510019293536],
    [124.37972619028575, -15.56705982835399],
    [124.25828657439985, -16.327943617419535],
    [123.81707319549184, -16.111316013252],
    [123.50324222218329, -16.596506036040402],
    [123.85934451710659, -17.069035332917288],
    [123.43378909718304, -17.268558037996215],
    [123.01257449757193, -16.405199883695886],
    [122.3127722514754, -17.25496713630345],
    [122.24166548064179, -18.197648614171804],
    [121.65513797412902, -18.70531788500717],
    [121.39985639860717, -19.239755547769725],
    [120.85622033089668, -19.683707777589206],
    [119.80522505094451, -19.976506442954964],
    [119.25249393115067, -19.952941989829867],
    [118.83608523974274, -20.263310642174858],
    [118.229558953933, -20.37420826587322],
    [117.44154503791424, -20.74689869556221],
    [117.16631635952771, -20.623598728113805],
    [116.71161543179153, -20.701681817306824],
    [115.94737267462702, -21.068687839443704],
    [115.46016727097924, -21.495173435148537],
    [114.6477620789187, -21.829519952076954],
    [114.22530724493262, -22.517488295178673],
    [114.1497563009219, -21.75588103606104],
    [113.73655154831609, -22.47547535572538],
    [113.84341841029567, -23.059987481378755],
    [113.5020438985756, -23.806350192970285],
    [113.39352339076264, -24.384764499613226],
    [114.21616051641698, -25.786281019801123],
    [113.93690107631167, -25.91123463308287],
    [113.44096235560656, -25.621278171493167],
    [113.77835778204022, -26.549025160429174],
    [113.47749759323692, -26.543134047147902],
    [114.04888390508816, -27.334765313427106],
    [114.17357913620847, -28.11807667410732],
    [114.6164978373821, -28.51639861421308],
    [114.64197431850201, -28.81023080822467],
    [115.04003787644629, -29.46109547294082],
    [114.99704308477948, -30.03072478609414],
    [115.160909051577, -30.601594333622465],
    [115.68961063035516, -31.612437025683807],
    [115.80164513556394, -32.205062351207005],
    [115.54512332566708, -33.48725798923297],
    [115.04861616420676, -33.623425388322055],
    [115.02680870977957, -34.19651702243893],
    [115.56434695847966, -34.38642791111157],
    [116.62510908413495, -35.02509693780683],
    [118.02497195848949, -35.0647327613747],
    [119.00734093635802, -34.46414926527854],
    [119.29889936734875, -34.50936614353394],
    [119.89369510302822, -33.9760653622818],
    [121.29919070850259, -33.821036065406176],
    [122.1830644064228, -34.0034021949642],
    [123.65966678273077, -33.89017913181271],
    [124.02894656788851, -33.4838473447017],
    [124.22164798390492, -32.95948658623607],
    [125.08862348846566, -32.72875131605285],
    [126.14871382050114, -32.21596607842059]
];
let tasmaniaData = constrainedDelaunayTriangulation(tasmania).flat();
let australiaData = constrainedDelaunayTriangulation(australia).flat();
async function australiaMap(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    const dataSeriesAustralia = new XyDataSeries(wasmContext, {
        xValues: australiaData.map(p => p[0]),
        yValues: australiaData.map(p => p[1])
    });
    const triangleSeriesAustralia = new TriangleRenderableSeries(wasmContext, {
        dataSeries: dataSeriesAustralia,
        drawMode: ETriangleSeriesDrawMode.List,
        fill: "cornflowerblue",
        opacity: 0.5
    });
    const dataSeriesTasmania = new XyDataSeries(wasmContext, {
        xValues: tasmaniaData.map(p => p[0]),
        yValues: tasmaniaData.map(p => p[1])
    });
    const triangleSeriesTasmania = new TriangleRenderableSeries(wasmContext, {
        dataSeries: dataSeriesTasmania,
        drawMode: ETriangleSeriesDrawMode.List,
        fill: "cornflowerblue",
        opacity: 0.5
    });
    sciChartSurface.renderableSeries.add(triangleSeriesAustralia);
    sciChartSurface.renderableSeries.add(triangleSeriesTasmania);
    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
    return sciChartSurface;
}
australiaMap("scichart-root");
