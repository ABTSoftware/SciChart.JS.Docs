import * as SciChart from "scichart";

// Turns the compact text rows at the end of this file back into heights: elevation[row][column], in metres.
// Each character carries 5 bits; each number is the change in height from the previous cell in the row.
function decodeElevationRows(rows) {
    return rows.map((row) => {
        const heights = [];
        let index = 0;
        let height = 0;
        while (index < row.length) {
            let result = 0;
            let shift = 0;
            let chunk;
            do {
                chunk = row.charCodeAt(index++) - 63;
                result |= (chunk & 0x1f) << shift;
                shift += 5;
            } while (chunk >= 0x20);
            height += result & 1 ? ~(result >> 1) : result >> 1;
            heights.push(height);
        }
        return heights;
    });
}

// The control bar, the colour key and the two chart areas each need an element. This splits the page's div
// into them; in your app they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    const font = "14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B; color:#ffffff; font:" + font;
    const button = "font:inherit; color:#ffffff; border:1px solid #6f86b3; border-radius:4px; padding:3px 10px; cursor:pointer";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        `<span role="group" aria-label="View" style="display:inline-flex; gap:4px">` +
        `<button type="button" data-view="3d" style="${button}">3D terrain</button>` +
        `<button type="button" data-view="2d" style="${button}">Contour map</button></span>` +
        `<label>Vertical exaggeration <input data-id="exaggeration" type="range" min="1" max="5" step="0.5" value="2" ` +
        `style="vertical-align:middle"> <span data-id="exaggerationText">2×</span></label>` +
        `<label>Contour interval <select data-id="interval" style="font:inherit">` +
        `<option value="50">50 m</option><option value="100" selected>100 m</option><option value="200">200 m</option>` +
        `</select></label>` +
        `<label><input data-id="shading" type="checkbox" checked style="vertical-align:middle"> Hillshade</label>`;
    const info = document.createElement("div");
    info.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:4px 16px; padding:0 12px 6px; font-size:13px;";
    info.innerHTML =
        `<span data-id="key" style="display:inline-flex; align-items:center; gap:6px"></span>` +
        `<span data-id="readout" aria-live="polite" style="color:#c8d3e8"></span>`;
    const chart3d = document.createElement("div");
    chart3d.id = divElementId + "-3d";
    chart3d.style.cssText = "flex:1; min-height:0;";
    // The map sits in a box as wide as it is tall (plus room for the axis), so east and north have the same scale
    const chart2d = document.createElement("div");
    chart2d.style.cssText = "flex:1; min-height:0; display:none; justify-content:center;";
    const map = document.createElement("div");
    map.id = divElementId + "-2d";
    map.style.cssText = "height:100%;";
    chart2d.append(map);
    new ResizeObserver(() => {
        map.style.width = Math.min(chart2d.clientWidth, chart2d.clientHeight * 1.08) + "px";
    }).observe(chart2d);
    root.append(bar, info, chart3d, chart2d);
    const get = (id) => root.querySelector(`[data-id="${id}"]`);
    return {
        chart3d,
        chart2d,
        map,
        viewButtons: Array.from(bar.querySelectorAll("button")),
        exaggerationSlider: bar.querySelectorAll("input")[0],
        exaggerationText: get("exaggerationText"),
        intervalSelect: bar.querySelector("select"),
        shadingCheckbox: bar.querySelectorAll("input")[1],
        key: get("key"),
        readout: get("readout")
    };
}

async function terrainMap(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A digital elevation model (DEM) as a 3D terrain surface and as a 2D contour map, with SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D,
        SciChartSurface,
        NumericAxis,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Your DEM: a grid of heights in metres, elevation[row][column], one row per step north
    const elevation = decodeElevationRows(MOUNT_ST_HELENS_ROWS);
    const CELL_KM = 0.07; // 70 m between grid points, the same east-west and north-south
    const rows = elevation.length;
    const columns = elevation[0].length;
    const widthKm = (columns - 1) * CELL_KM;
    const MIN_M = 600; // the bottom and top of the colour scale and the height axis
    const MAX_M = 2600;

    // Hypsometric tints: colour by height, with lightness rising steadily from low to high ground
    const tints = [
        { offset: 0, color: "#2E4A33" },
        { offset: 0.25, color: "#5A7040" },
        { offset: 0.5, color: "#9E9058" },
        { offset: 0.75, color: "#CBA683" },
        { offset: 1, color: "#F6F1EC" }
    ];
    const theme = new SciChartJsNavyTheme();

    // --- 3D terrain: a surface mesh, coloured by height, with contour lines draped over it ---
    // At true scale the box is as tall, relative to its width, as the height range is to the ground distance
    const trueScaleHeight = (300 * (MAX_M - MIN_M)) / (widthKm * 1000);
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(ui.chart3d, {
        theme,
        worldDimensions: new Vector3(300, trueScaleHeight * 2, 300),
        cameraOptions: { position: new Vector3(90, 270, 300), target: new Vector3(0, 0, -10) }
    });
    // Y is up in SciChart 3D: elevation. X is east and Z is north.
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "East (km)", labelPrecision: 0 });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Elevation (m)",
        labelPrecision: 0,
        visibleRange: new NumberRange(MIN_M, MAX_M)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "North (km)", labelPrecision: 0 });

    const terrainData = new UniformGridDataSeries3D(wasmContext, {
        yValues: elevation,
        xStart: 0,
        xStep: CELL_KM,
        zStart: 0,
        zStep: CELL_KM,
        dataSeriesName: "Elevation"
    });
    const terrain = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries: terrainData,
        meshColorPalette: new GradientColorPalette(wasmContext, { gradientStops: tints }),
        minimum: MIN_M,
        maximum: MAX_M,
        drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
        contourInterval: 100, // a contour line every 100 m of height
        contourOffset: 0,
        contourStroke: "#3B2A1C",
        contourStrokeThickness: 1.5,
        drawSkirt: false,
        lightingFactor: 0.7 // shading from the light, the 3D version of a hillshade
    });
    sciChart3DSurface.renderableSeries.add(terrain);
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(),
        new MouseWheelZoomModifier3D(),
        new ResetCamera3DModifier(),
        new TooltipModifier3D({
            tooltipDataTemplate: (seriesInfo) => {
                if (!seriesInfo || !seriesInfo.isHit) return [];
                return [
                    `East ${seriesInfo.xValue.toFixed(2)} km, north ${seriesInfo.zValue.toFixed(2)} km`,
                    `Elevation ${seriesInfo.yValue.toFixed(0)} m`
                ];
            }
        })
    );

    // --- 2D contour map: the same grid as a coloured heatmap, a hillshade and contour lines ---
    const map = await SciChartSurface.create(ui.map, { theme });
    const mapSurface = map.sciChartSurface;
    mapSurface.xAxes.add(new NumericAxis(map.wasmContext, { axisTitle: "East (km)", drawMinorGridLines: false }));
    mapSurface.yAxes.add(new NumericAxis(map.wasmContext, { axisTitle: "North (km)", drawMinorGridLines: false }));

    const mapData = new UniformHeatmapDataSeries(map.wasmContext, {
        zValues: elevation,
        xStart: 0,
        xStep: CELL_KM,
        yStart: 0,
        yStep: CELL_KM
    });
    const tintSeries = new UniformHeatmapRenderableSeries(map.wasmContext, {
        dataSeries: mapData,
        colorMap: new HeatmapColorMap({ minimum: MIN_M, maximum: MAX_M, gradientStops: tints })
    });

    // Hillshade: how brightly each cell would be lit by a sun in the north-west (azimuth 315°), 45° above the horizon.
    // Flat ground is left clear; slopes facing away from the sun are darkened, slopes facing it are lightened.
    const cellMetres = CELL_KM * 1000;
    const sunAzimuth = (315 * Math.PI) / 180;
    const sunAltitude = (45 * Math.PI) / 180;
    const sun = [Math.cos(sunAltitude) * Math.sin(sunAzimuth), Math.cos(sunAltitude) * Math.cos(sunAzimuth), Math.sin(sunAltitude)];
    const shade = elevation.map((rowValues, r) =>
        rowValues.map((_, c) => {
            const east = (elevation[r][Math.min(c + 1, columns - 1)] - elevation[r][Math.max(c - 1, 0)]) / (2 * cellMetres);
            const north = (elevation[Math.min(r + 1, rows - 1)][c] - elevation[Math.max(r - 1, 0)][c]) / (2 * cellMetres);
            const length = Math.hypot(east, north, 1);
            return Math.max(0, (-east * sun[0] - north * sun[1] + sun[2]) / length);
        })
    );
    const flat = Math.sin(sunAltitude);
    const shadeSeries = new UniformHeatmapRenderableSeries(map.wasmContext, {
        dataSeries: new UniformHeatmapDataSeries(map.wasmContext, {
            zValues: shade,
            xStart: 0,
            xStep: CELL_KM,
            yStart: 0,
            yStep: CELL_KM
        }),
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 1,
            gradientStops: [
                { offset: 0, color: "#000000C0" },
                { offset: flat, color: "#00000000" },
                { offset: 1, color: "#FFFFFF60" }
            ]
        })
    });

    // Contour lines: a thin line every interval and a thicker, labelled index contour every fifth line.
    // Lakes are perfectly flat, and the contour lines would fill a flat area, so tilt the grid by 1 mm per cell.
    const contourData = new UniformHeatmapDataSeries(map.wasmContext, {
        zValues: elevation.map((rowValues) => rowValues.map((height, c) => height + c * 0.001)),
        xStart: 0,
        xStep: CELL_KM,
        yStart: 0,
        yStep: CELL_KM
    });
    const contours = new UniformContoursRenderableSeries(map.wasmContext, {
        dataSeries: contourData,
        zMin: 0,
        zMax: 3000,
        zStep: 500, // index contours every 500 m
        minorsPerMajor: 4, // four thin lines between them: every 100 m
        majorLineStyle: { color: "#2A1D12", strokeThickness: 2 },
        minorLineStyle: { color: "#2A1D12AA", strokeThickness: 1 },
        dataLabels: { style: { fontSize: 13 }, color: "#1B120A", labelRowCount: 3, precision: 0 }
    });
    mapSurface.renderableSeries.add(tintSeries, shadeSeries, contours);
    mapSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            includedSeriesIds: [tintSeries.id],
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit)
                    .map((info) => {
                        const col = Math.min(columns - 1, Math.max(0, Math.round(info.xValue / CELL_KM)));
                        const row = Math.min(rows - 1, Math.max(0, Math.round(info.yValue / CELL_KM)));
                        return `East ${(col * CELL_KM).toFixed(2)} km, north ${(row * CELL_KM).toFixed(2)} km: ${elevation[row][col]} m`;
                    })
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- The controls ---
    let view = "3d";
    function update() {
        const exaggeration = Number(ui.exaggerationSlider.value);
        const interval = Number(ui.intervalSelect.value);
        const shading = ui.shadingCheckbox.checked;
        // Vertical exaggeration stretches the box upwards; the data stays the same
        sciChart3DSurface.worldDimensions = new Vector3(300, trueScaleHeight * exaggeration, 300);
        terrain.contourInterval = interval;
        terrain.lightingFactor = shading ? 0.7 : 0;
        contours.zStep = interval * 5;
        shadeSeries.isVisible = shading;

        ui.chart3d.style.display = view === "3d" ? "" : "none";
        ui.chart2d.style.display = view === "2d" ? "flex" : "none";
        ui.exaggerationSlider.disabled = view === "2d";
        ui.exaggerationText.textContent = `${exaggeration}×`;
        for (const b of ui.viewButtons) {
            const active = b.dataset.view === view;
            b.setAttribute("aria-pressed", String(active));
            b.style.background = active ? "#4A6FB5" : "transparent";
        }
        ui.readout.textContent =
            view === "3d"
                ? exaggeration === 1
                    ? `True scale: heights and distances drawn alike. Contours every ${interval} m.`
                    : `Heights drawn ${exaggeration}× taller than true scale. Contours every ${interval} m.`
                : `Contours every ${interval} m; the thick, labelled index contours are every ${interval * 5} m. Map view, so no exaggeration.`;
    }
    ui.key.innerHTML =
        `${MIN_M} m <span style="display:inline-block; width:140px; height:10px; border-radius:2px; background:linear-gradient(90deg, ` +
        tints.map((t) => `${t.color} ${t.offset * 100}%`).join(", ") +
        `)"></span> ${MAX_M.toLocaleString("en")} m`;
    for (const b of ui.viewButtons) {
        b.addEventListener("click", () => {
            view = b.dataset.view;
            update();
            if (view === "2d") mapSurface.zoomExtents();
        });
    }
    ui.exaggerationSlider.addEventListener("input", update);
    ui.intervalSelect.addEventListener("change", update);
    ui.shadingCheckbox.addEventListener("change", update);
    update();
    // #region_A_end
}

// Elevation data: the area around Mount St. Helens, Washington, USA, from the USGS 3D Elevation Program (3DEP)
// bare-earth DEM (public domain, https://www.usgs.gov/3d-elevation-program). Requested on 26 Nov 2026 as a
// 14 m grid in UTM zone 10N (NAD83), averaged to one value every 70 m and rounded to the nearest metre: 201 rows
// of 201 values, 14 km × 14 km. Heights are metres above the NAVD88 vertical datum. Row 0 is the south edge.
// Each row is delta-encoded (each value is stored as the change from the one before it) with the same compact
// text encoding as Google's encoded polylines, so the 40,401 heights fit in about 54 KB of text.
const MOUNT_ST_HELENS_ROWS = [
    "eq@VIGMMJ?GEEIE@@IGEIAA@CCGE?@F@GMMIQ[UEAK]UQEB?AAACIGAAAAAEA@EFJBAC@@@QQKIBFFABIE@FE?MOCGAHGQKO?@FI@DDJNKeA_BcACKO@KNHAAX`@BIJt@dApBxAIHIMEFDDBIi@Gt@pAb@Kc@y@wAmARBe@Lz@n@j@DBQ?HJRM@PNHCCC?GAEBDHHJHDHFBFHHBF?B@@DBB?B??BG@?",
    "ss@l@@FI_@BTH@IEIC@CCCGGC@@CEIAADBEQOSQMSOEKQOGK@?CACCCAEEAACAECA@BDCA@@C[OCGCJF?C??EH@AQKGACBAQQGAAFG?BFPFKkAwAgAEFK?ACJL@BHHFJ~@zAdB~@KHEMEJJD@Q]NlAx@?i@c@gAyAy@LBG\\r@l@d@UG@NDHHLVJBDC?E?CCC?HHHFHH@DDFJFF?BBBDDD?B@??@C@?",
    "yt@\\J\\EOKDPPCCGGCAC?EEG?@EI@EA?B?KSWSWKKKGMIEECCCCCEAACEEACCCAAA?BCE?@KSKE?C@D@CA?IDNCKKKAGCAGQIECB?DAFRJWwA{Aq@JBQEJ?@B@A?H^\\rAjBtANIDAOUXXFA_@Gr@`A^Wo@u@wAiAi@d@HCf@|@b@GEIELTN`@LHDBDAAAACAC?HHJHFB@FDFJDDADDFDBBB@@?BC?@@",
    "}u@b@T\\BG@HJC?CCEEEG??CGA?CC?ECA@CEWMSUSOGGKECGCECCCCECAGEACCCAAAA?CE?CMOGAAACKAFABCEREEEICKKAKKCMA?@FAFJPWiAwAu@H@QGJBB@DB?HX\\n@bBlB\\QB?MQZNRI_@T~@^DSs@qAeAo@Yj@HL^p@?@NSSNXn@ZFBFB@A@C?AAC?HHLHD?DFDHDH@?DBHDDD?@@?@??B?",
    "uv@j@`@XDCBFB@EACEAEKI@DGC???ACECAAEMQSUUKOCEIGCCECCCEEECEGE?CACAAE?EGA?IOCEE@COG@F?AGFPIOACQGIGQK??IDBANNJ_@kAyAe@@@GEFFAFLBDJHNr@jBlB\\U?BKGJJTMOv@f@FE?k@{@_Am@a@\\JRNXCb@HSQF\\|@PDDDB??@C??C?@FJLJCBDHFFHDCBBHHDD@?@BAB?@@?",
    "ex@t@l@f@PAAF@BCGCCECAKK@DG?@B?CMGBCCGSYKMSKMQBACICCCCEEEGEGGAAACCACEAECAMMGCCAAOAE@?DCBTGOK?KKMKOODEMBAANRIe@_AoAMHEKC@TD@JJ@GH`@p@~AnBb@[AFGECV?ICv@f@J?@g@y@{@a@WBNLAHHn@JQBFXp@FDDDBA?BA?AA?DJLH??FHHFFB?BDDHFDBA@B??B?B@@",
    "ez@`Av@r@h@@E?B?DGEECCC?MIDAEF?BCEs@NTEEGYKMQMYUDAC?ECAECGGIGEGGAAACAEECCEEIWG?CE?GEE?@@ABFLKOGKGQQIME@KAEEKQ?Sq@i@D@AGMBZDDFDGATf@d@jA~AfAe@ADGCCAE?Rv@X@NJQ_As@c@UKLFK@Vd@REZ^DPBDDDBC@@????@HJFBABLHFF@BBFHHDD@??BBA@@BB@@",
    "}{@bAdAr@z@VCECCDBEGEEC@CKCBGBB??Am@QFJF?GOOGE]SIIEC@???IKKMIEEEGC?AEAGGCECQWEBEGACM?@??GCBPDGIKOQKWGGEIAEIQm@a@AUBHEBEO@THAHJ?Fd@Vb@f@hAnADQHIE?Y?^v@P??RPCy@u@]SMAAE@PZZBZf@L@BDDD@A@@A?B@DFDBD?JDFHDBDFFHBHD?@ABB?@BB@B@",
    "y}@`ApAhAt@l@FAACGBCEGEEA?GE?C@@@@?a@k@EDTPEEGAQWY?AGCH?ACIQQ]MCEGGECCACCKCGCQQECG?EMGA@?DMIAJRCACSYMSOAKKCAIGOuAu@\\\\F??AOGDd@DEHXPTNr@Zn@x@ZIHIE?CT`@NFAFZJFq@wAUGMC??AHNZHf@j@B?DBDH?AA@@@B?DBFD@FH@HFDFDHF@DJB?B?B@@D@D@B@",
    "e`AxApAtAbAj@ZFACKIBAGGCEAAECGBBD@Gm@[?FRFAEEC@QM?AGEECEEEGGOc@[EEGGIEACGMEICMKMCA?IMCA@?AEMALDF@?Oa@WEOCGMGCKCAy@uAFl@P@I?QKJf@LFHZP^X`@Xn@l@A?FKA?Tb@FQFLXPHRU}BWGGA@B@@?TB^p@V?BFHFACA?@DB@@FBDDBHBHDJD@H@BJJ@D@?D?BBBDBBB",
    "icAnB|ApAdAz@b@RPOc@?NL?IGGCACAEAFH@Ss@M@FHBDAEEEACGCEEGCEEEGGGMu@MCGIIKGGEMEKEMGECGEGCCABAE?OEDBFAJU_@_@E?ECMKIEA?k@uA[j@h@@MKYDT\\`@ZPZRX`@^^XADDFI?@VPFODTDGMx@H}Aa@IIABBBDAM@\\t@h@?FFLCGFA@AFB@DBDDDDDFBFJBDD@HLFBD@@B@BBDBDBJ",
    "ocAlAxAhA~@z@b@Tb@[e@FJd@PGKGGCAACAHFAm@a@G?BBNPCGCGCEAEECCAEGEGIGIQQWSKKKKKIMCGIMCCEIEIAACBCEAMG@D?A?Sk@C?CAAKQMCA@o@uA[Rn@VGGYNVVd@h@j@b@RTPJPEFFHHI??Zb@MQJPWKEJX][KECBDBFDEKTd@h@JDETUEZ@@?F@BBBFDBFBBFHDFBBDJNDBF@@@BBBFBBFZ",
    "o`An@`A~@v@`@XHTc@]HRv@PCIIEEECA?DM[WMC@BFPL?EEGEGAAEACCCEGGIIGIKQWQMMKOSKGEIKEGGIKE@@E?E?CEI@@CAOYW@?C?COOKI?C{@gAKAd@d@?EMb@XR^|@j@TTBDJFAFHHHKCZJ?HCNOASELL@GWKC?DDHRDO^NRD?M?BTP?B@B@@DFDBDDBDHDFH?DHLLDBD@@BBBFBBDLP",
    "w}@p@`@r@p@VD@@c@[BX~@NAGIECEEE?Cg@SGCA@BJL@FAEEGGC@ACACCGEGGKGIGMQQOSOOUOKGIKEEMKGA?BGIID?EECAAAOa@E?AACII[AGAMkAm@@?Tb@LAOl@j@Rh@v@`@L@BF?N?@LJDQN\\KHD@HW@OAC?^\\a@WG@BFJHHRHPF?MCKN`@D?B@B@BFFDBBDBFDFH@DJJJHF@BBD@@FDBFDZO",
    "}{@x@b@^`@FE@Eg@]Bb@z@BDGGCEEECCIk@SA?A@DJD@DAEAGCE@?AAAIMA@GIKKIQSSMIQWOKOIKIGGKKIA??GCGIDAEM?@CKYI?CAISK[G??g@_AIBCF`@THIXdA`Ad@XJD@@AFLBDJNEKJ@NBJBDYAWK?JZPCKI@BDFFXJLHA?GBAFVB@@B@DDFDBDBDDFBH@DJNHHJB@DD@@DDFDLPEK",
    "a{@fAj@FR?IBG]CJNXBBCICCECEAEG[WGC@DFBBBCEAGAA???AAGU@BCIOOGSYUMIKUSCKMKMGGGIOEAAEAKKED?OBACISM@EIK[QSG@Ok@_@ILA@ZTTRRxAdALF@@DCAA@NRLDAQDBARJG\\YOYELHF?NNI?BBFPLNPI?B@@DFL?BBD@DFFBDBDDFBDFBJLHHFFF@FD?DDFHP?BI?",
    "uz@lAh@@H?E@ACAABBD?@EGEECCC?GGOUKCBBD@@EE@GAA????CAKI?CKMOIM[WSGMUSGCIKKKIGKMECCCEGMACCK@AAESK@GKMYWOKEI_@WUJHBb@JVp@h@tAh@C@@?IG?ABJ`@NBCg@FTE\\@Of@QMa@BJD@DFNF?BDLLHVAEDB@BFJD?@FBBDHBFDBDDDDFBJJFHHHHBBF@DDFLJDACA?",
    "{y@p@l@DB?A?CCCCABBB?AGCEEEE?CEECQMI?FA@AEAEAA??A@C?EKEKKIMOKUYSOUOOGEEIGIKKKMEAEEEGM?AKOAEFCKSCCKMWWo@a@EZAe@EAVN\\RVdAjAj@@GH@AIMABBFl@@EOSHFHIPJFDw@CBPEGAIJl@`@DFNDPHEDD@@FHL??BDDDFDDFBDDDDHBHJHHHJFDBDBBDFHL?@HEA@",
    "cx@JLT@A?AACCEA@?BA?CCECEEEACCGKKMECCLAEAGA??A??AAGIIQOIGKQSSYSQMKEGEGGIKKMKI?CGIGGAEMEQCB@GYCEMIOa@mAm@?X\\QEDR^ZPx@hATNP@F??COG@FPb@GYMBHANKE`@ESMD@?g@EHLJ^~@JJFJFB@FBBDHJBB@BDDFFDDBDFDDHDHHHJHJFDBBDBFFHJB?@HE?B",
    "uv@@????A?ACGCA??BAAAECCEEEEACEOMMGC?D?AECA??C?@CAESMQOMECMSU]]GAIGIEGKGIMMMIAGCKMA@@]CUCB?OEMMQAKcAmAe@BXd@JMJTb@^f@hAPBRVLF?AUBGER\\NU_@KNXE?GEZJ[M@DKWHN@DP`AXHHJ@D@HBDDHF@DDBFFDFDBBFFDFHFJHLJHH@BDBDDJJBB@BBFC@@",
    "ov@A?C@A?AACIAAA@@?CACGCCEEGCACGQOIEC?@?EAA?AC?@AAE_@MKMMGIOUY[[CDAIIIKIEKKOKKCIGGME@KSOMD?@QKIOMEGeAsAY@Pd@\\OH^p@`@x@h@QNFJV`@AOWJEBX^BAy@?R?NJQGTL_@KBAYDHHDDX~@RFJBF@DFDFBL@DDBDFFFDBDFFBHHHHHJJJHDBBBFFHFBD@BBHA@@B",
    "ov@AAGDAA??EGEA??@A?ACGCEEEGGAEEIMOEEC??CCA?AAA@AAC_@OKMKKOOW]YUBDCEKMKIKEKMMIGIGIKGCOUKMDCDIOCSMGIm@_B]D?^p@KHn@p@l@~@Q@AAA^z@FSWQVJDZGB_@?JB^?WEVBY?CIOFBFHXv@^FJBFD@FFFFFFBDBBHDFFDBFDFFHJHHLFJFFFBDDJDDDBD@DBFABBB",
    "qv@?AAAAA?CGEC??A??A?CGECCIIECEIGIMIGC?AAEA?AAA??AESQKOQSSUUWYIAFK?KMIKKIGKMIIKCGKIEGWQQBGGFUCQMIGi@aBu@UHn@hAAH`Av@~@Te@D[QFbAv@RIYM@VADML@DL@`@UYELJa@MI^@??DPj@n@JFHDFBBHFFFFBDBBFHDHDBFFFFFJJJHJFHFFFBFHBDDDDBBBF?BBBD",
    "qv@?AAAAACCECE?AAA??CGECCCIIICCIIGIIGEAACE?A?ACA?AGIQKMU[WUU[UQAB??EOKMEMCGMOIGGEKIGAQYQGAKKK?OOEEm@gBeAGRf@nA@BlAfAx@[a@K]I\\fAv@b@COY?RFm@Kb@Z?XGUBO?DVw@G@VZD?Dj@v@HDJHFBFBFJFDBDDBDHFDFFDDFHFJNJHHHFHFFBFH@DFD@FBDDB@BBDB",
    "qv@?ACAAAACCAGEACA?CEGEEACEGGICEKGEIGGEACEC??ACC?AAIKKMY]Y[Y]WWGBN?IGQMEEEGKSGIIEOGGMCWOOEGSIAMOK?a@cBaAKLd@`AT?|@vAn@q@o@ESOx@|@dAf@?Ge@@HLc@I\\PAJa@QB?HBf@i@QADr@H?JbAXHDLFFDDDJFFBDFBFDHBFDFDHHJLNHHHFHHHFBDH@DFBBDDDDBBBBDBD",
    "ov@AAG@ACACCCCECECACEEGGEACGEGGEEIGGGGECEEEA@AEACA@CCGU_@c@Wa@]Y]SEBHCEISKCAEEUOAEOIMMEKKOQKKEOMEMMGA]aB{@OA\\n@t@Hl@nA\\m@k@GKUlAbA`Ab@LEi@BGLKEDPCMo@T?DJJv@i@k@FLt@@BZn@LLVJ?CTHHFHH?HDDFDFDFDFJFLNLJFHFFJJFBDH@DDDD@DDDDBDBDDDF",
    "ov@A?MDACCCCCCECEEEAEGEEKECAGCIGAEKGEIGEEEEC@AECEA@@@AY_@i@_@][a@WSG@CAIISK@@CGUO?GISKMCIWIMOUBKSMMWAC[wAu@GIF`@z@b@h@f@JJm@IQ]lAfA~@~@BHo@EAB@IIDJc@OTAEBVt@e@WF`@Z?PRFF^`@RQ?Tf@FFL?DHDFDFFDFHFHLLNJHHJHJFDDBHBBBFDBDDBBFBFBFDDF",
    "ov@?AMDACCCCECCEEGECEEEGKGECAEGGEEEICGIGGGGC?ACEEA@DDCS_@g@_@_@e@e@YMIGGMEAKMCDIIKOAGGMSM?G]QMO]DESKOc@KOOiAc@?AOXl@t@HNh@f@i@MGUp@fAbAtACCUU@ENKC??k@AJHUFj@Vm@C^n@?PZOEV|@JB?DHp@NJBBHFDDFFDFHHJNNJJHLLHFF@HBH@DBDFBBFBBDDFDDDFDF",
    "ov@?AKBAAACEGEECEGEEEEEGKKGCACIEGI?ECGKIGGIEAACEEABFDGO][_@g@e@k@a@QMIMOA?CKEIGEEIIGAOWK?MWYOG]KAOE?k@Q[UcAQTEUBh@\\Sf@nAd@a@MBEVz@~@|AK_@NMDW\\@GB]]?B@HLh@Uc@Fn@f@FJBYDt@bAECc@DLx@t@JGJNFBFFFFHJNNJJLJHLHFJ?FFDF?DBFDBDDBDDFDDFFBFF",
    "ov@?AEAAACEEGCEGEEGEECGEIKIGCCGGEIG@EEIIGIKEEACEG?DHSCGW[[e@i@o@_@WMGYEACACGWIECAMIFO[UEMOa@OEGUEGCE_@][a@s@[d@IQI`@BGbAbAd@OSF@L`Af@nAKg@PZH[TFACw@DMD]\\v@L[ABNHPMLJNv@PCA[D\\r@dA?U@Td@THHFHJRJHJLJNJJFJ@BHBJADDBDBFD@FDDFFDDDFHD",
    "mv@ACAACCCCEGGEKGAGCEEEGGGIKEEGGGKI?@EGIEKMIEECCG?DSg@DQ]YMYc@gAAKKQMECECIKUIK?AMO@?Qa@KSS_@QGDOIA?OQk@g@Yc@g@^@OQTJ?hAdAFRS?FZh@Vt@?[Lp@EIRAG]c@JOLEd@j@?OQ@[?t@BPX\\?P?DKBp@n@JHIFVZp@ZHHLPFHNLLNJJFJBDDDH@@DBBFBDDFDDFFDDFFFDD",
    "mv@AACCACCCEGEGIIIEECEEGGEIIKEGKGIIGB?EKCIKOGEGCEAGs@m@IQo@[GUi@eAPb@EICGGEEY]EKG?IIUCCEQSI[[UIGEEE?KYY{@SIq@IJQARXNhAp@ELBM^f@RT@CNHl@F?L@Gi@Y_@?\\Jx@X?Me@GKJx@HRVLGLID@Db@VFXXBZVr@h@HPNDJPLNJJHJHDDDDDJADB@DDBFHDDDFDFFFFDDD",
    "mv@?CACCCEEIECCEIKKGEEEEGGGIIGGIKIIGE?@GICGUMAKGCCC}@uAq@uAu@Va@Cs@WJnA^A?EEGGOo@MICGOMQIECAMOY[WQMKAABG[Sa@a@Y_@m@[MVp@`@L`AXBJDKf@p@RN?QL?v@HB\\BOYk@g@TVT~@NAGk@MCZ\\I@h@b@DFYEAGHJFr@bAh@L`@t@b@NL@NRPLLDHLJFDFBDHB@D@@FBFHDDDFFFDFHDDDF",
    "kv@ACACCCEEIKEEE?KKIEGGEGIIIGGGIIKIGGE@?IEEOQIIIGACc@}AcC{Bs@A_@YELRjAzA@AKBEIMa@c@MEKSSMIGEE?M]_@UQOWGFC@UWO]i@]m@y@M`@z@p@Ar@JJTPDh@\\b@REYFCv@ABf@P_@Ww@[d@Rl@d@JXc@[I?^GNF^n@VGm@KGIAALh@fAlAl@ZZ~@LDNRLLJJLJJHDBDFDF?DB@BDFHDDDFFFFFFDFFFD",
    "kv@ACCCCGECCIKEGGCEMEEIIGIIIIGIGGMIGGEE?AGEKSMEMIAIm@qAwBuB_Ac@o@c@AJb@jB|AP?CEGM_@[k@UDKQWKEIEK@Mi@a@EWUYKCGBBS]M[i@q@eA]R`AhAId@DNb@`@Db@Zn@\\K]?N^?LVNSq@s@UVfAfAEJ^m@MFHAJLb@Lx@|@u@cAOGJGDD\\j@v@tAr@Vz@NPNLLNHJRHHDBBHDF@BB@BDFHFDBFFFFFFFDFFDF",
    "kv@ACCCEGGECCGMEGGGGIEGIIIKIIIEIGIMIIICA?CCGMWMCQGEw@_BqBuBgAi@}@o@UHtA|B`Bd@?@GUYw@i@UKFOOMQK@EM?I]u@MQSYUOKAB@_@QYS}@cAu@VbAhAUXE`@r@f@LZh@n@ZI]@HTBRJHK{@{@Gt@`BV?\\@i@FNRQFV^r@h@d@}@w@IHB?NEZZh@jApA`@r@PNLRJDDHZLHB@FDHB@BBBBFHFDBFFFFFFFFFFDFD",
    "kv@ACCCEEECCEGKKGGEGEGIIIKIMQIECIKKKKKG?A??EY[AIGOIa@_BuB}Aw@qAmByADj@fBhB|Az@BUg@KGk@y@WEDGQEIS?IGBK_@c@YYSWW_@GO?AKc@QM{@gAo@PjAt@i@FAdAz@\\`@Vx@b@BKE@@PFL@D?o@o@HhAhAETR_@GNN?EV`@^Nf@Bk@E@JBDF?X`@j@v@bBv@PNNPHBFFPRC^@HFDD@BB@DFFHDDDDHDFFHFFFFFDF",
    "kv@ACCECECEECKIEGGEIIIEGKWKWm@PFCEKOKKKGEA??EaAU\\GKCSIcAaB_BqBcAaByAK`@jAbB`BhA@m@gAQR]w@MC?AKO?MQ@IBG_@UOY[][e@KUMUMUKUo@oAKAnAN}@Gn@tAh@j@h@Lf@f@GSRJEDR?APQm@@d@lA^QPGKVPH_@@p@f@APREERRDHFRNDx@t@x@nAZNLPJ@JFJTMEr@PHBDD?DBBDFHDFDDFFFFHFFFHDFFJ",
    "kv@CAECECECEEGGGEQWGMCCBWm@]c@g@~@LAIIEIOMKGG??[q@OFNKK@U[qAuB}Bq@gAqA_@T^~A`BdAKw@_AgAPCa@F@GAKKGGQAEGFc@OUU[Yc@c@SQ[_@WKIWm@qA?A`ASkAN`BtA^b@ZFFz@GIJDFVTGOHUQRfAhAK]XQXXb@g@m@L|@RARXVFRTJNR\\l@\\f@\\\\fAVNPFDLFNNAA\\\\FBDH@@BBDFFFFFDDHDHFFFFHFHHHF",
    "kv@CCCCECCEEEEEEEq@gASGJJB_@u@g@Yl@p@CAGKIEEMQMKE?g@c@ME@NGGCUg@}A}BgAmAoAYDNzAfAZC{@u@yAKVFHDGGGKOGOG?KA[Ua@QWUc@[S]c@g@UKQMq@qA@I`@Ww@v@~Bz@H\\XGt@PIMGVXd@XO[@WLp@zAL_@JPBV~@XkAq@L\\b@RTTNd@VTXTf@XV`@RRt@|@VHDHJNPJ@DVVHFBDH?@DBDFHFFDDFHFFFFHHFJHFHD",
    "kv@CCCCECCCEEEEEC{@yAu@AHDCQeAa@l@`AJCECIIIIGIOOMKSk@KQMFTED[Ou@gA{AyAgBo@K?|@d@LRo@cAw@RLBF?AIMEUSK?ECOO[q@_@YQ[SW]{@q@AIGMq@uACYEm@B|BdBNDXTTj@HSMMp@d@d@ZO_@WDPvAZCHt@AA`@`ARs@u@HX^\\JCVbAx@\\\\TVLLPVj@hA\\BHLPLNHHNXIXFDBDHADBDDHFFFDFHFHFHHHFHHFHDD",
    "kv@CCCCCECEEECCCKq@uAwAYABCUg@Vv@`@AEAKAMIGGMGGISOe@[WKGBPFI]u@eAqAwAaBiAa@AZ^NX_@_AZB?@DCCGQGS[O?I@MM]k@q@e@UWQOg@k@}@K?CU_@qA]S_@gAx@fC|@JH\\Jn@B`@WC?f@p@`AAEs@SX|@|@AD`@jA]QVj@`@m@e@f@h@D?NZr@vAx@ZXZ@DFV`@p@v@BPPNFLNLPPEFVBDAJHABDFHDFFFFFHHHHHJFFHHFDDF",
    "kv@CACCEGCOMDCEAa@i@w@yAcASA_@Cl@d@h@JICAOAIKEIIIKGIMOk@c@MSOJXJe@_AsAwAcBeBkA[MAb@T\\B?N?CA@EGGQMISi@KFAI[Uk@k@m@a@[EYg@_@g@_@UN[c@w@{@?q@c@r@zAt@PFPTRR\\MFXd@fAZGMs@Ph@r@ZZZx@n@q@a@?j@b@g@Bx@CATv@~@fAz@VTZn@VRFVVXVRNLJNPRLF?BLNBB?LF?DDHDFHFFFHHJHHHFHHHFDDFJ",
    "iv@CCCCYi@@KHFCEKu@aAi@g@aAq@i@[x@~@r@\\CKGAOIAIGKGGMKIGIQ{@UQSBJRQmAwA_BgBiB{AUP@ADfAf@B?AEGACKIWGGO[i@?@WUS[u@k@a@e@WYYc@Kk@YSXq@y@u@USc@ZbAr@PFR`@LXXMTX~@|@KAWUXfAHd@h@z@d@Bk@k@Mh@v@_@\\n@D?XlA~@fA~@\\JL^R`@HRVZ`@TLLNZHFHHLHD@D@BLB@DFFFHFFHHHJHJFFJFJFDFDJD",
    "iv@CCCAe@mA[Fl@DCEYaAaAcA_@q@{@eA`@|AbA^d@?[ICGKGCKKIEIKOKEEk@e@UKCOA`@uA_ByAuAyA{A}@?d@@IjAr@@CEIEEEIMUQMIYi@SAE]WOe@u@g@_@k@e@[YISe@]LSuA[q@C]Hj@^^LXd@Ff@b@[Vl@~AMCJe@?bA\\Nj@v@`@XQe@UAj@n@DV`@ZHLx@`B|ANTXJN\\n@RXVX`@\\RLF@BHRTPB?@D?HJ@@FFFHFHHJHHHJHFHHJDDFFJF?",
    "qv@GC?Ce@oAkANz@REGQaA{AuAi@_@gAe@hAvAz@d@d@@e@M?CMGEGKMGEIOOMMISo@OOUITAiB_AkAwAsAsABIBOz@|@DEKMKGCGOYQSMMg@c@KCW[YYi@i@a@i@m@g@WMM]_@QLiA[gAIOBX?v@Zd@XBl@DPT~@l@W?CMZdACZ|@p@TKUIJd@^d@f@RTR^Tv@|AjAY@b@v@TXj@THTVfABCGICD\\NN`@b@N@@FJD@BFFHJFHJJHJJHFHHHFFFFFJA@",
    "yv@KCAC_@kA}AIf@l@DISYsAeByAk@o@LzAjAl@Hj@Rm@S?EGIGGIMKEGOQKMMOSa@[SOGVMmAmAiAaAQSWa@GCh@FOOMIIGIWOUUSIW_@a@U_@c@KU]a@g@e@m@m@c@OQO]_@GMw@}@]AQN\\t@b@h@Bb@@BX^rACQSANl@^En@|@TAGLXTr@fA`@Vb@LFf@h@z@n@b@FH\\^NZf@Zf@v@`@OGWGABJTPHNd@hALDJHBBDFHJHHHJJLHHFHFHHHHDJHA?F",
    "{w@ORAEQgAwAgATz@ZKSUc@qAoAmAaAv@pAdAXCVr@a@e@AECIIGGKKMGOSIIKUOSm@SWMIZEy@k@_A[[YWMGOUUOOKGIYa@OCSUSWU[e@o@c@MUS_@k@e@e@o@e@[QKOc@]Aq@q@q@IYDl@z@t@f@LJMN^v@~@_@AOIV|@GGz@d@@Rn@`@r@r@\\b@N^x@h@HZj@f@d@b@RFb@h@`@VR\\?AFBFFF?DPJFHFd@xA\\FJFFBDJHHJHJLLJFDHHHJHHJHB?@HD",
    "ky@Yj@RKM{@uA{ASdAd@Uk@ASq@iAuAaAnAtA|@@?Ff@\\{@MEEEKKGIIMMKOSKKOQOo@a@[OOGPGWq@[Sg@[UOQU[SOMMMSm@WGKSWUQa@g@i@o@[YYYW{@c@a@g@_@UOI[_@a@KaAu@_@O?n@pA~@\\N@ITh@|@^_@OYR\\v@GAl@Xh@Xf@rA`AVS^x@n@v@XJTf@d@r@p@^^^d@@DXDEBBHHLJDHLHBHRl@tAVJFHJ@HHJJJLNJFFFHJFJHLJD@@FFDD",
    "_z@y@n@h@AUc@oA_B{@|@ZO}@EOc@s@{Au@vA~A|@DC@Ht@Oo@EEGGKIGIMMKMQOQOOQUk@g@YOMQIKBo@[GM][QSSSSUSQSs@i@KESWSUc@i@Um@{@e@g@KW_@aA]_@_@UOSOi@OUs@y@k@c@Hr@tAx@FA^C^r@hAAW[i@\\r@XDZx@j@IH|AtAz@@Ef@|@z@d@`@`@d@b@h@n@h@X^b@GKX\\FFHFFFJLFFLJLP`@x@p@LJJL@FHJLLPLFDHHHJHJJHLB@DFFBFF",
    "_z@mAJh@ZQ[q@kAwAELSQi@Oo@WoA]bBvA~@HE??p@NaAAGGIIIGIMMKOKMQQQSUSi@e@YYU_@EDD]k@UKQQQSSSUWWWYmAm@?BU]YWu@]Yk@cAcAQK[}@i@][QKSUe@Q?UgAu@u@Hf@jAn@TDNJ\\lAz@Se@_@WPl@RVx@x@XDj@lAhA\\A`@hAjAt@`@l@ZRb@PXp@z@n@c@@I\\^HZRLJHHJJHLLPL^fAZRLDDFHJLPRDFHFJJLJHHJJD@FFDFBE?",
    "yy@kAw@d@n@AU_@o@yAqAE_@Dq@K_Ae@{@XhBvA~@NEC?t@NeA?IEIKIGIMOKKMKIQWSSUUu@g@Y[Y[SCLBWe@MMQQQSYe@Qg@Oq@y@U@[[c@]s@e@e@Wq@wAi@Ia@c@u@e@[QKQ]]KLGo@oAgAD^t@n@n@NLXv@|@DOo@a@L`@`@^n@x@j@ZVd@n@~@DZ|@tAjAP\\p@XRf@XdA\\^\\k@LC`@b@^VXLLJJJJLJJTVd@~@TH@HLJJNRJBJJHLHJJJHLHBBDHFFDM[O",
    "yz@e@qACx@DUWa@u@}AqAc@Bk@]]mAKvA`BxAn@L@GAt@NgA?EGGKMIGMIOOKKIMWUUSSc@o@i@a@SU[WWDDD_@EMQOc@s@Ki@c@Q_@{@SAUUo@m@m@}@[o@SmA_A_@g@SYu@c@SQQe@UDHI_@kAqAJt@^r@j@NRn@v@HAQw@Cb@d@^l@z@h@d@Vl@b@Zb@`@LfAxAv@Jd@`Ab@JVvAd@?f@`@s@@Tn@r@ZTNPPJLJJLRVR\\v@ZAHLNJPRJDJLHHLJHJJJLH@DFHFFDB[e@N",
    "w|@C{@k@p@DY][Wm@}AgBUOcAE]z@nApA`A^T@G?|@C_AAAEGIOMIMCUOKIMKOY]SMMYy@u@YUUW_@UCTWGDS]k@]Ug@u@e@WUi@OASm@s@u@aAo@i@g@q@s@u@u@[Ie@i@a@YSa@QAHFm@s@oAb@fAh@d@LHRfAH@AUe@Nb@j@d@|@n@Vf@p@n@RRb@l@h@r@r@fAR\\|@`@Xr@fA@`@j@Da@HXb@x@b@NTRPPLNNPXVh@b@P@FLNTTJBHLJHJJJJJJJNHBDFHFFBA@c@Cv@",
    "a_ANg@s@TDQi@]UM{@}AoBOu@u@jA`BnA~@r@`@NDEJbAk@k@EBEASi@CDGKOQMKKKMS_@UQQOYc@}@i@SSW[WABUE?UYWq@{@g@q@e@Ea@i@E@[cA_AaAq@i@g@q@o@aAe@a@O_@m@e@a@]Mc@GLF[k@mAn@`AfAZKGXfACDM[@T\\x@j@t@`@f@p@d@b@b@z@l@NLt@lAb@Zn@p@\\f@j@j@Vl@t@a@ANPXbAl@VXVPPJNVb@PHb@VBNNTXDDJJLJHNJJJJJNLFDFFFFHFGc@IGn@fA",
    "maAVKu@MFUm@i@GI[oAwAyAk@e@lBpA~@pA~@h@NF?B`Aa@i@G@GCm@sADz@CGMMSOIMOOUYSSWYOUw@q@YU][OI@KQ@Io@gAq@e@u@m@EFg@k@YYs@y@{@m@k@k@i@aAkAe@QQG_Au@c@c@Iq@EV@We@kAf@rAbA`@a@Ef@t@?Fc@MVXl@h@t@n@Xj@d@f@h@|@v@f@ZZ^n@\\t@pA\\b@f@d@Vh@v@FER\\`@^\\t@f@TNLJR\\TBFPl@VLZXF@FNLLJLLLJJJJPLDDHHFFDBD[oASR|A~A",
    "kaAIQy@q@?My@o@ASK_@kAsA_BHpAbArAtAdAp@LJH?t@L}@MACK_AcBBlAPGGMOQOMQ]KMYUSWWSM]_Ae@Sc@YSCCKUCu@qAc@Ws@{@QBCu@m@e@i@u@{@{@_@i@m@{@_A{@_@U@]_A{@Sc@y@Oh@Fc@a@y@j@jAz@Va@Nv@PJKm@H^`@l@h@|@h@`@P`@p@t@vAl@Ph@Zd@v@r@`Ax@p@Z\\\\Xp@VHP\\\\ZZTl@`APJJVVFNRTTf@\\\\D@HLLNLLLLLJLJLNLDFHFHHFIo@CQaA_@p@nBlB",
    "g_AQo@cAeA{@_@e@c@g@e@Kc@g@q@y@[b@tA`BtArAv@HJPJ^j@eAICCOkAaBWzAh@CGIOIS[m@[I@OUKS]USQWs@q@Yc@YKI@]Us@eAWUe@u@m@SEi@q@_@Uw@iAqAw@Si@y@q@}@w@g@AUQo@]i@mASd@L_@g@m@p@|@x@MEb@~@IPe@IZFh@r@v@z@XL@r@v@lAjAZb@v@j@n@x@|@lAr@\\H\\h@d@RTX^^\\^ZXt@`@NRTPJTZXZd@ZFCNNNLNJNLNLLLJJNLBHHJFHFFWsA_@Ua@TjAnBbB",
    "_}@]aA}@iAoAQG]oAoAgAH@Oq@u@a@nAdB|AtAd@FFAXr@~@q@WECSsAuBYbBx@BGIKOOg@c@OOKSUQGy@[LOYQc@m@_@_@WUCKk@o@iA_@[o@Mi@e@WEo@w@_@q@gAqAgAi@m@c@m@q@gAw@U?YE]{@gA[V\\Qg@y@f@v@h@MZr@r@EGm@Tl@?^z@bA`@DKPlAnAz@j@z@fAj@l@tAfAv@t@\\RXd@d@PZb@b@`@b@f@f@\\ZZN\\PHNV\\b@h@R@HJPNLLNLPNNNLJJJLN?Of@TFFCU^o@oAs@OBbBxAnAnA",
    "c{@k@u@mAwAs@HC}@sAcB{@l@BUe@y@o@XrAtA|@NEAKv@|@nAAq@G?UsAuB[|Az@DEIKIOQ[g@UKMWi@c@o@c@DRIY[Yg@]YWUO_@a@o@o@q@y@]Qs@_@IIy@y@iAiAgA_A{@y@m@a@k@u@aAg@AMDYcAeAg@Fl@O_@o@@v@f@R^l@`@Bi@Ef@t@Gd@z@l@@EJlA`AhAz@|@jAx@r@bAjAh@Zr@t@l@VHZf@d@`@d@b@`@j@f@^ZTTNTX`@h@b@DAHJPPNLNPPNRPJJJNLLJJc@{@z@p@DGIe@f@e@mAo@Ed@zBhA|@fA",
    "{y@q@qAmAo@OAUqAaBkBU~@R]Q_@g@KLV^HSULbBbAx@`Aw@UAMmAkB]rAl@@AGKMKMOYg@WMQw@i@e@[OOJBQ[Wa@_@WSYw@OUq@g@u@k@a@e@{@m@DOmAeAiAwAqAeA}@w@a@g@o@i@k@]A?G{@eAi@IHC_@WKl@p@h@Zh@f@Oe@V`Ad@Kp@\\?DLhAzAlA`AlAz@`Ap@bAp@f@`@j@|@bAVF\\d@h@f@f@f@f@j@d@Xb@NNXh@`AXFDCDPRPRLPPTRNLJLLLPLLLJBg@kAGr@OGJg@t@UkA[Vj@hAbB`BdA",
    "}x@}@iAy@UQE{@gBkBcBFjAr@G?a@m@]B{@o@AO_@`A~AdA|@fABq@EIgAkB?`ATA?GIIOMQK[_@_@Us@m@]SQSUORG[a@g@]SI_@m@u@[Ui@m@e@i@aAkAQPkAgAeAwAwA_BeAs@i@c@k@k@Oc@S?Ba@aAy@QSUSMA^v@t@b@Rl@]Mr@dA??p@AMb@lA|AlAhA|@~@z@fAz@h@v@^\\dAfAd@F`@j@j@h@l@p@b@Z^f@^Td@`@p@h@CALHHRRPTRRPPNJLNLPPLLLLLF?My@s@Sg@STWr@Fm@Rv@p@t@l@r@z@",
    "ax@}@mA]QG]mAcB}AiB?vAnAb@Dg@y@c@OuAmBkAMQ`BjAhAdA`A~@q@UGcAgBHv@JACIIGQMQQGS_@e@q@k@]WSUUQUB@]q@i@[IIOqAu@YOa@g@o@aAiAe@D}@qAoAyAgAaA{@_A}@w@i@o@a@UIWR[o@w@g@W_@QEEXl@~@j@R`@]LhAb@_@`@RKp@pAtAdAdAfAbAdAfA`@h@|@j@^r@dA|@J`@p@r@r@h@l@Zh@`@XZ`@r@Xd@v@UGRLPRRRTTTRPLPNNPNLLLLLNF?B?G]s@aAeAe@A~@BP`A~@jA~@h@n@`@",
    "sw@w@w@UIK}@mAgBiBaBZnAzAdABWy@w@mAyAeBoBm@Xt@|@rAfAhAvAUe@Eu@aBJh@B?IIKKKQQOQKI]c@o@m@QQa@k@OWQ@Oq@e@_@WIMuAu@OOOk@c@{@kA_ASQmAyAaAaA_AaAsAkA{@q@i@m@YA_@KAa@m@m@a@Y]GEXh@x@h@ZV]d@hAAUd@At@vA|A`An@nAz@~@fAl@T~@|@j@v@bAt@f@\\~@~@t@t@d@`@P\\`@\\\\^f@`Ad@OUTRPRTTTRTTRRNPPPLNJLNPH@FDBACA_@oAsAqAIb@f@nAhAv@lApA|Af@T",
    "ew@k@]GUu@eAsAaBiBq@bA|@fAfAH_@}@cBoBoA}AiB[z@t@`@f@v@lAbBA_@Ka@uADP??GKMOOMSSOQME[_@m@e@OIi@w@_@UQWS[e@e@YMk@mAQWCMm@o@aAsAm@Sk@qA_A_AaA{AmBoAm@i@q@i@e@Wk@[HIe@i@c@_@[OAZj@t@\\PPOp@t@GMNl@nAlAnA~@dA|@~@jAr@Zj@z@x@hApAx@\\v@fAx@p@z@n@j@h@j@VRPXXh@TEFRPVVTVVTRRRRRRPNNLNLNN@FHJB@?ACu@cBaBs@Xr@v@fAtAnAlAjBlAj@T",
    "wv@SUUu@mAmAkAeBiARjAdAv@n@Ks@kAsBmBqBmBgALtAhAt@b@h@l@`AHg@OIgAG@AAGKKMOSOQWSUOESe@e@c@MWYq@w@[Ui@c@QWe@a@Qu@m@e@IGi@u@]w@gAm@c@u@cAqAeB}AeAmAiAo@g@g@e@k@u@WEQK_@_@g@WOCXj@l@\\JBBp@l@Gc@ZjA`AtApAlA`At@rA|@f@l@x@lAlApAv@z@`AfAdAn@b@\\n@x@b@^Td@b@ZPG@XZ\\FXZXTTPTRRTRPNNLNJPP@HJHF@D?@YcAwAgAENf@hArA`Ar@`AnBt@b@h@",
    "iv@OUg@eAsAuAoAsAO`Ax@z@x@Ri@w@uAwBsB_CaCcBx@dBtAvAv@b@ZPDNg@QW_@KCEKIIMQQQUQS[WQMK]i@a@Kg@g@{@Wa@c@k@m@_@U[e@e@g@e@[GWu@i@i@{@y@k@o@eAuAcBoBeBcAm@kAi@OWo@u@o@_@SEAS[g@MELd@d@b@JEPn@j@I[|@bAz@zAvAhAbAbA~@j@v@bAtAxAlAfAjApAbAr@f@`@h@n@f@`@EPj@d@b@N\\XRR\\j@`@@NXVTPTRRRRPNJLPRPBFHJFDD@ABc@cAaAg@LERv@d@j@`AxAhAj@r@t@",
    "av@KWo@gAyAoAsASZh@f@t@x@]s@aAoAeBqBeCoCyBv@jB|A~AlAZLFF?Lq@EK[MIKOMGMQOUYYMSY[YMM]o@Wq@o@]g@o@e@c@i@g@c@c@i@g@o@SCSi@}@s@g@gA_A[i@sA}AoBwBsBe@o@y@IWw@s@a@o@YE?I]_@QGBh@b@`@PMZd@`@Yb@dA|@lApAtAdA`AdAt@j@|AxAxArAxAtAv@t@f@b@^Xj@h@`@ZXd@b@b@d@\\Z\\XZX`@j@`@NJTRRRRTRPLHLNRPDFJJHFDBYEE_@{@WHHGEEB|@pAbAnAx@h@^",
    "uu@MYy@iAsAoA]H\\b@`@j@Pg@s@wAkByAoBqBkC}BbAhBxA|AjAV@FCCZAWWOQWMOMMOOOSYYWUIKe@_@[UK[[m@g@c@i@s@s@w@e@e@g@u@s@s@c@O[W}@cAq@w@{@i@Qo@uAqBoB}BeBEs@a@c@o@w@Yk@o@EJGo@OOGBf@`@^DIh@`@FJrA~@v@pApA`A`AnA`A`AfBzB`BfAfAt@j@Vr@z@f@Rf@n@n@f@d@d@b@f@d@d@ZVVTVZf@r@v@VTNHFLLJPPLLPNRFDLLJHDEm@Y?IMNVR@IA]_@EfApAdAt@RZ",
    "qu@M_@{@qAcAg@AR\\ZZXOq@cAwAqBiBgBiBqBoB~@fB|AtAx@PA?@IAb@HIQU_@c@SOMKOQS[Y[]UOCKYo@g@SQg@QSq@s@o@eAo@k@i@y@{@_Aq@a@[g@UiAcA{@s@k@m@Ww@gAmBuB_Cs@U[m@aAu@u@e@m@ONGk@UEHx@N@TQEh@\\JnAzAt@|@fA`A`A|AfBfB~AlAbAnAr@R`@x@fAfAbAh@`@l@|@n@p@R`@`@\\^j@Z\\X^Xp@b@TZ^NLTRTNPJFLRLFDGD^\\HFBa@aAE`@Rb@^PDCO@Qu@m@B`A`Ar@?`A",
    "wu@M]y@kAk@EJVXHP?e@u@iAyAsBiBmA}AoBaCx@jB~AtAj@@E@BAKJBBQMEGOWYUUS]g@OMYYYYYEF]g@_@y@i@U]_@s@w@u@m@u@}@gAeAq@i@a@c@_@[yA{@iAkAo@W_@_A_AiBkBwAg@Q{@wAk@y@q@i@@lAKN]`@b@jA@QPSs@aAA~@tA~@z@bAdA|AjBvBjB~A~@h@`@b@Nx@pAd@lA~ApAfAb@h@^x@hA\\XR\\d@x@h@TRVZDD\\x@f@RZLNLNNPPLFFJDAe@x@h@VBKo@Wl@j@d@`@RVCOEGIw@k@\\NKBTfB",
    "}u@Oa@s@q@SDTVH@CSe@w@oA{AiBwB{AsAyAmBp@`BxArAh@IE@??CFEKCMMKIGGIWcAq@kASBAEEWY[]CGIK[o@cAs@i@m@u@oAeAo@o@cAy@}@o@_@q@Sw@qAoAaB}@[Ms@iAyAiBkBu@@{@s@_AcAy@Y`AvCz@PJDVXJIUUu@Im@SAdAlA~AnBvBtBdBtA`Ad@DNf@z@jAh@x@zAfBvArAz@PNr@dAl@Zn@^f@f@H@ZNd@`@n@h@XZb@XNJLJJLJLJJDB?o@Fn@d@J]Wr@bAh@j@\\VNJMMKM_APd@FS{@Yn@",
    "iv@QSc@UC?RFEMQUc@{@kA_BqB_BsAaByAa@t@dA|@`A^ECCACA@?GIGKKKMMQSm@uAeAWOCIE@W[S]YWSABE{@y@{@iAkAqAeAw@w@i@}@k@q@q@u@]aAmA_BgAu@g@c@aAqAsAmBoA?i@y@o@uAIj@hBxAxAb@VJFHCGYIQEc@}@uAp@lBxBtBnBdBnAx@TD?fA~@`A`A`A`BvArBtAr@`@?t@r@b@v@t@l@b@ALVJ^f@x@p@b@\\Z`@^VNDJTA@b@LJHD??s@q@t@t@GOd@tAnAl@h@d@L^d@]MEm@u@p@^DMQ_@y@",
    "kv@QQUAGBBCQQSY[eA{AcBuAuAwA}AsAPz@~@t@`@HACCCECACCEIGKKMMOS_AiAu@YISWMQQOWWW[a@a@Q?V[k@oAqB}AkAi@q@y@q@g@o@y@eAy@m@iAkAgAgAu@aAcA{@kAsAuAo@Qk@}@ThAz@fAv@z@XPLDBAKSF?Os@wBwAzAxBxBfBxAdAn@T?JjAnAfAnA`A|AdBbAvA|@x@ZZ\\Zn@fBr@FNLDXVDh@n@nA\\v@l@VTNBDLXERv@RDFB?c@w@s@f@p@Dj@fAvApAj@n@j@b@PPi@Zm@mA@~@VLAIc@aA",
    "kv@OWUFC@BMQOW_@i@m@cA}AeBiB}A{AmAX~@|@r@^F?ACAACEGGGIGIKOQQSYi@o@gAUQY_@K[[]YQQWe@g@_@Q_@e@k@aA}@m@s@k@aA_Ay@{@w@w@_AeAoAeAu@cAgAeAuAmAk@gAmAaAk@e@|@vA|Av@f@d@VAHPH@?SQVJMcA_CqApBjB|AjAv@f@LLb@pArAnApAhAdAnAv@lAtA~@r@TVl@`AdBHTVVVRTA?\\~@t@p@hAbA\\RJHF@LLf@bAFBBUSu@]Jb@`@^r@hAhApAdAl@v@v@Ni@EGcAgAn@`A^Z@Mq@y@",
    "gu@Sc@YBBIMGKQa@y@aAe@[q@_BsBmBkBwAAx@t@l@x@h@FAABECIIGEIMKKOQQUWUYeA_@OS]_@c@_@_@c@_@]]]e@c@_@k@s@a@]s@_A}@g@W_A}@eAeAaAy@w@kAoAmAw@w@eAsAmA}@eAcAmAm@bBfAlBrAh@X@AC@RPCEk@Bf@\\Gs@{B_B|AhAn@^f@VNbAnArAr@`AzAv@r@fAvAzAz@`Af@Zv@n@hBVAt@Hd@l@\\PJHXl@z@hAj@nA`@LLJI[Pl@hAv@D?M}@AJPRf@PTf@j@dA|ArAjAl@p@ZOQaAy@oAbAfAl@`@@S{@w@",
    "wu@a@BIMOGIIO[_Ay@w@eA_@U}@aByAgBqBw@x@j@v@nAfAN?AFEGEEAKCUSOOO[u@WQUY]_@WY[[_@a@c@c@e@g@c@e@g@c@c@k@w@o@k@q@m@u@i@c@}@cBsA{@aAw@o@q@qAoAw@u@aAiAcAcAyAoAj@|BxBlArAXKCBA]AJQFODb@x@Cg@uBwCd@\\X^\\d@hAdAnA`An@fAhAt@t@xAzA|@~@z@l@jArAdAd@Cl@XPdAx@v@`@Ra@h@l@l@n@j@r@VFJLFA@t@z@z@XAa@Bp@RPHVNTLn@`@fAhBnBrAh@j@Iq@cAaAmAhAbAl@l@Do@s@aA",
    "yu@SYKGEGIOYm@mAgA[cAcAi@]oAsA_B_B_At@t@jAvAdAVCCRDSBFMMIYg@]MMe@w@SOUUW]Y[]]]_@a@c@e@g@c@a@a@g@m@q@c@c@m@y@{@cAw@w@a@s@iAeAeAgAkAy@k@aAgAcAaAeAiAmAsAF`BvBdBvAj@AMIo@_@S]l@BVFMdAl@FYuBeCyBIXZd@vAlAlAdAx@r@rAbAp@lAbA~@bAvAlA~AbBr@Ff@\\n@^t@bAdAdAp@RYKXl@d@j@b@VRNJLDHv@PXNXp@|@f@\\F?HVV?\\v@nAdBlB~AdAf@u@}@}@uA_ApAlAv@`ABoAe@aA",
    "mv@UGQICEIUm@y@kAkAq@k@eAeA]_AcAoA_BSj@t@jAtAhAj@A@XVMIg@k@_@ICM[UQS][SSU[a@_@]_@a@e@_@a@]WS_@g@a@g@e@g@k@m@m@w@cAsAgA}@}@u@}@}@{@}@s@cA{@u@gAmAiAqAwAuAg@|AxBlBrAhAPIEw@gAYSSPR`@Xn@z@XLOiAoBuCwCg@b@pA~AjAjAn@l@bA|AlAfAdA`AjAvAvApAtAfAX^r@b@n@n@n@r@lAfAz@v@JS@d@j@\\RT`@XPD@Ph@H\\HhAvAr@d@d@CCHRn@LGf@vBjBxAjAjAb@q@y@_A{Ak@fAjAlAr@Ou@qBwA",
    "aw@KMEGIGK_@cA{@_AgAcAw@}@aA{@o@eAaA_@ZHLdAxArAx@RZHg@Q]a@KSYQOMOOQSSUUW]c@a@_@a@_@]S[A_@_Ak@e@k@o@i@o@m@m@o@s@o@s@iAu@{@y@eAiAkAmA}@q@u@i@cAuAuAoAuAmA~@~BvBfBbA`@IAQoAiAUQMIFz@j@`A`A\\DQw@wAwBkDaDJxA~ApAn@^`AzAzAdA`AdAtA`BhBlAv@z@|@bAr@^\\`@j@z@r@f@p@lA~AfA@]Rp@TP@|@l@d@NHBPRn@d@vA|@x@^f@C?PV`@d@A@pAvB~AvAbAf@g@a@gAiAe@l@pAv@n@g@kAqAwB",
    "sw@OEGEIIUc@aAaAcAeAcA}@aA_AeA}@}@i@l@x@LWd@zAnAdAl@Po@_@YQOOOWUAEIQWUQY[_@c@_@_@][MA[Iu@cAo@m@e@g@c@k@o@s@m@q@}@aAeAaA{@{@{@u@y@cAkAcAy@w@y@y@mAsAuAuA_AbAfD~CvAz@TOAUiAgAi@QD[F~@~@vA|@FCMo@wAsB_C{C}A`AzA|@x@fAlAtAnAfAdAfA~AdB`Bb@p@fAnA|@ZZVr@n@v@p@B^xAbCdBl@FCLLDFx@p@`ATLJN@OpAfClBfAVb@FUNNNl@`@Pd@pAfBjAbAl@[[s@q@g@BlA`AVeAyAkByA",
    "yw@SMIGAOYa@q@aAcAoAsAcA{@}@c@c@s@c@h@bAPKLnAhA`Av@Qe@e@YYQIIE@IKSSUW[Y_@]YYS]K?K]m@w@o@i@e@g@]k@cAu@s@{@cAiAmAkAiAiAgA}@{@w@g@i@{@y@w@y@_AkAqAoAwAUxArCvDlAp@JEBY_A_AeAURIN~@fAfAb@?AIq@sAmBoBuB_CMjAjAtAlAjApAnAjAnAvAxAfAVr@hAjAhAT^h@n@|@r@~@d@Ch@`B~BtBv@RRLM?PfAt@\\NLJBWAtAxBhB~A`BpAVWH^RL^X\\t@nA`Av@x@?Sc@k@[_@r@jAEgB}AiAU",
    "ww@WUSOCIWYc@u@oAqAsAqAy@GG_@s@s@X~@X^Ll@v@v@h@Ui@c@UYMOGN?KWQQ[WYSQOSUUWUY[[a@c@i@m@o@u@_Ay@{@u@m@}@kAoAsAuAqAoAkAy@_@[_@}@q@q@w@cAkAoAy@kAwAGfCzCdCpAn@R?DYo@{@gA[HD\\bAbAh@HEBAo@gBqBiBkD}CPjArArAlApAtApAbAdAlAdAv@x@jAhAz@p@^b@z@bA`Az@|@v@Dj@bBvBjBn@@K\\x@PHz@PN^HB]s@h@tBpBdBfAfAfAjBbBEX\\JE?j@v@bAh@j@j@XKSUU[@hA{@yAqAGO",
    "}w@MW]]WGe@[e@a@w@qAuAcAILOg@o@]SfAj@`AVf@\\RJ[a@WEOUMFE[u@a@SSEMGGOSUSUUWSo@cAq@c@e@i@o@o@m@i@e@y@aAcAiAoAwAyA{AwAy@FOi@q@y@q@u@_AuAoAu@_AsAyAUpDxCrBnAz@XJLGg@{@q@UC@\\v@l@LBB@Ac@sAwBwByBmDo@dApAnAjAjAhAx@v@pApAz@h@~@xAzA~@v@d@t@nAlAdAjA~@f@Zz@dBxAjAT?CFjAdANJB@f@@e@u@ArAfBbBpAdA|AnAxAvBtAr@VD??Np@v@l@b@V^FMM@]Od@g@}@o@_@E",
    "qx@OMSe@e@WWe@k@k@q@y@y@k@V@CU[k@g@v@fAdAR^VAMWOAK][A[g@s@[UUSS]a@UKGKICGY?Q_Ak@a@g@g@o@y@u@g@m@eAsAiAgAqAyA}A{AsAFB_@}@q@o@w@y@eAkAkAy@iAuAuARvCjCdBvA|@d@TNJYm@c@i@s@@Nn@r@HTH?Kg@eAaBiBsCaCmBt@~@fAdAz@z@x@nAzAnA~@t@|@zA|AdA`At@dAtAlAv@`A`Ax@~@bAlAv@TF\\X\\|@\\FL@?NAm@{@f@rAbBbB|AhAhBdBbBrAz@b@`@bAd@XRLLd@Zb@ZXDA@MUXe@e@Ss@B",
    "_x@W_@_@_@WUY[e@o@s@a@Qk@DXDG_@aAa@RrAhA^@`@cAe@GIO]GA_@_@Y_@YYUUSU]e@[YQUQKWDNWq@o@k@i@k@i@g@k@w@cAuAoAeAqA{A_BgAg@LYi@u@iAy@m@u@aA}@cAaAoAqAuA[xCpCjBvAlAz@LRRGo@w@u@q@EZXl@h@b@HAY}@iAeByAoB_CyCf@x@fAnAhAdA`AjAnAjAfAjApApAlAjA`Av@z@jAfAt@|@dAbA|@j@bAl@XRt@z@ZH@HNFDH?Q_@`AhBjBjBhAvA|Ax@R^t@j@d@r@f@^l@n@d@f@ZXd@`@XLFCIFe@SOa@H",
    "}w@WYWY[]SW_@[]_@Wo@Jb@E@W}@g@DhAdA^FNaAsAa@OGOMSUSSWWUQUWUS]_@YWW]YYWMSm@o@o@e@e@c@[_@o@cAgAcAgAoAuA{@W]Yy@y@s@{@u@o@w@y@aA_AaAoA{AyAk@fChBfAvCbChANFTF{@uAa@?XSb@Bh@p@HAi@mAqBsCwBcAkB{Bp@jAnApAnAhAfAhAdAfAlAzAxAnAhAbAx@h@|@dAbAhA~@l@z@fAn@n@l@d@v@l@RLJFHJDDFBBH\\zAbBfBdBbAPR?p@~@p@d@~@\\j@p@v@l@n@b@d@f@^`@d@VTBBWUI]C",
    "cx@MQYYUC@s@Qa@[W]e@TDJDMw@YBf@t@l@^AaBgBQLSUm@i@G?e@IO_@UUWUQUU_@YY[]]]a@]_@i@a@_@[[a@g@w@{@_AkAmAkAq@W]k@kAaAk@o@eAg@i@s@{@_A_AiAwAqAmAeAl@dAnCxCzC|Ap@FLJs@kAe@Jl@@RO\\v@CUaBuB{CcCsAs@qAqBRrBfBrApAjAbAdAlAbAjApAnArAvAlAp@v@t@v@t@z@|@jAt@rAvAh@\\^\\VTLJHHFFFHFJFFv@`BzAdAx@RJF^x@`A|@f@Jx@vAfA|@l@n@j@VTh@h@h@j@TPKQIKK",
    "mw@?GOUIF_@k@Yi@e@SYELJAEDk@]L@p@t@LWiBeA@Wg@g@WWFAIXeAw@a@[Q@FQo@o@[]a@]]a@e@_@]c@]]]c@e@g@e@s@aAiAiAe@a@i@w@wAu@k@o@o@s@i@m@u@{@_AcAmAoAsAqAeBLbCrCpBfBbCnAVRVc@iAi@Jz@Gp@?ZRWc@mCaBcAmAgA}AqAoBuAjBlBbBvAjA|@x@bAfA`A`ApAvAvAbAbAbAz@|@j@fAfAz@|@pA`A^\\^ZXPLJJHFFHHHDAAh@hA`AvAZNHb@`@dA`Ad@XRjAxAlAt@dA|@^RRh@rAt@VNT`@BGCA",
    "}t@?GMU?Co@YYaA{@SODR?MSRI@GI`@d@c@cAq@YEu@g@WYGBR\\?{@aAqA_@P`@UeA}@c@i@_@_@[Y]e@]]]_@_@a@g@i@o@m@q@i@c@_@YaAuAuAo@i@q@k@c@k@k@m@u@_AaAeAqAuAwAgBiBP`BjAfBdD`D~Al@Xb@Dq@u@JRJp@^TUG_AwBaAaAuA}A}AqB}Bm@fAbAxA|AxAnAfAbA~@fAnAtAjAfA~@x@p@n@hAtAlApAbAn@v@d@ZRZx@\\RLHJHFHFHFCCe@V|@z@~@RXr@l@v@p@b@Vb@|@fAbAx@lAtAl@^`@h@nAtAGX^XXf@ZPA",
    "kr@AGOQKEs@UQqAw@SSFCW@@BBFIBN?y@a@e@E]g@e@e@SEn@l@Ze@aBeBg@L^Q{AmA_@m@g@[[[Wc@e@[YY]_@e@k@m@g@WGUa@y@oAyAsAi@m@i@g@m@e@]c@o@y@aAeAoAuAaBsB}AaAi@lAjCfC`CbCfBjAd@Z\\K_@QNXVL@QCw@uA{AwAwA}AyBaCkBG|@|@fAfAjAtArAjAdAjAtA`A~@x@dAhAbAz@p@hAnAz@v@jAr@LJ\\p@nA`@TNHHFFFFFBEKg@Up@x@XTpA~@j@z@n@XTd@~@~@x@bAtAdAfA|@z@`ApAk@G|@n@\\T\\d@RT",
    "{o@GKMOMMo@Qi@i@s@e@[GMS]FPH?CD?Se@UYa@g@SY]NCp@p@?eByAS?ASyAiBs@W_@_@g@i@[a@e@YOQW]a@a@YQSOi@{@mAsAoA}@c@k@g@e@_@u@o@O]q@y@gAyAkBwAeBuAu@q@}@QfCzB|BbErBtA|@PPd@MEJFDOSK?w@uAsAqAiAsB{AcCsCTv@v@~@fAbAfArAlAdAz@vAnApA`Az@v@v@^l@fAxAnA|@`Ah@El@v@`Ar@h@HHLHFDFDD?EE_@cADnAp@j@xAtA`Ax@j@\\b@Nb@p@z@rApAjApAnA`AKQO\\~@x@f@^b@HB\\",
    "ko@GGGGKGQ[c@i@k@o@w@YO@SKHh@UEEYk@a@[]WA?GO|@Eb@\\cAkASGQa@iA_BkAq@m@]_@m@g@g@a@UOJK[_@SAYc@m@}@qAwAgAy@k@[k@a@a@][_Aa@S[y@mA{AsBiBw@eAw@w@y@mAeAdBtDhCtBxBhCfALHb@ZJJ?IYe@CCs@oAiAgAiAoAsC}BuBw@lAbAbAfAhA|@fAhA`AhArAfAtA`Az@~@h@Zx@nAhAbAp@b@d@j@pA`Al@`@VLLJHDDBFBAIG]kATbBbAt@dAhAdAhA~@h@l@VJl@bA`AjAbAdAdAQk@OFj@hAt@Zv@h@]Rd@",
    "mo@GIEIGIGO[c@k@c@q@g@QJSMTXiAWSi@[]OM@b@TI?t@?ROg@e@c@m@_AeAcAiAaAo@]]c@w@m@QOKP?IMUc@{@iAy@k@cAcA{@k@c@]i@_@[_@Gq@q@QWgAcByAqAwAoAq@u@m@o@gAeB_AhBnC|BlC|B~ApAh@HL^`@XHQm@a@@Eo@cAaAeAeAmBqCiBsBsAb@`AlAjA`BrAx@lAfA`ArAfAdA`A`AhA`APn@dA`Al@l@`@n@fAz@r@`@f@TLTHFFDDDBGi@WQi@pAtA~@n@v@z@hAlAbA`AbAp@Nd@bAn@p@jA~@D}@kAKX`AfAv@rAr@c@@Nd@",
    "oo@KKGGEGGIKOYSu@]MOGJ\\_AiB_@A_@]UQ?h@z@TGHN?]_@a@q@y@_AiAkAaAo@a@[]]m@q@YAIn@PKa@y@cAgAgAcAgAa@a@Ya@e@_@i@a@YYCMs@Y[_BkBgAs@qA_A{@cAw@k@aAsAoAaAjAxBjCxCrBvAxA|@??V^VVQk@WFBg@{@aAaAwAiC_Cu@eBmBoAr@vArAzBdC|@x@vApAhAfA`Ar@vAzAx@LVpApAp@d@h@h@d@`@d@b@f@JP\\FHHFFDBE_@w@e@IfBrAjAfA`Ad@~@vAv@t@dA`Bt@b@l@h@^PJQy@oASt@pAbBxBn@]SJNX",
    "mo@MMGIIGEGIIIGUQO[A@_Bi@YBq@iAg@E\\h@h@p@PGCKi@cAs@e@k@w@gAoAk@AY]m@]i@u@SCY|@l@o@eA_A_A}@{@y@w@w@OMSc@]i@_@_@YFLm@q@WgBaBcA_A}@y@q@w@}@{@{@qAoAwAcAhB|BxBxBdBbB|A~@BAHVVLCWKFHc@s@cAiAuAkB_BaBoBwB_Bd@fAbBtBzChAp@h@xAtAlAzAlA|@hAr@d@Rp@|@p@~@~@^^Z`@h@LJVVLJJHDD@AWWe@_@tAlArAzA~AhAl@|@dAn@^nAjATRLPBFWw@iAEhAnB~BvA]O?NR\\",
    "qo@IIKIIIGGGKGIKIIOGUw@WWQcAg@g@Pl@`@^DAEYw@aA_AeAs@m@q@g@GTa@s@a@Ye@q@a@Do@lAbA{@eBu@s@gAy@s@o@]i@WM_@Yc@a@]_@K|@Xw@wAsBkBk@y@aAa@k@cAcAeAu@cAmA_B}AeAl@rAjCjCjBnCfB`ALCAVXJGEANK_@m@aAuAwAsAgAoBmAgBmBTj@|AxBtB|A`Al@p@tApAlAnAnA`Az@j@f@\\Xj@|@`A~@d@X\\`@NRPNJLHFDB@?CE[o@x@zAxA`Ar@l@|@fAlAv@p@rAt@?BJHDAWu@}@ZfBbC`B?[?BZd@V",
    "uo@IGIIIIIGGOGKIGGIOKM]C_@Q[UNPCQKC[s@}@cAy@m@e@_@WGXRiA_@c@Sk@u@Ci@OnB`@yBqAm@sAgAk@a@[c@m@YU[a@[c@YEj@|@QwAwBiCgAq@e@Ym@{@eA}@u@aAuA_BcBqAs@p@p@vAxB~ClCjBjATEGPVLG@DHS[YeAqAmA_AcAuBsBAkAUAj@nBlBdBrA|@f@v@pArAjAlAt@~@t@p@j@Rp@v@r@x@h@ZVXTLJLPJJH@@B?AAGYH|@|@l@r@l@bAvAnAfA`AdANCFRCAMc@_@CnBtBzAPe@MT?l@r@b@",
    "wo@IGIGIIGIIIIIKMIIIIGMOGGMOIOKOMQKMu@kAu@g@]RYIT]g@Ow@k@q@UIm@NbBm@aC_AcAkAu@]Ye@i@k@M[a@]_@WHf@r@JiAyBeCqAq@a@Ys@}@aAi@iAoA_BoA_BsAgAC|@~@fAhA|AjCrB`Bb@?EDVJDADBK?_@iAkAgAaAkAyCw@ZM_A_@JxAfB`BxA~@p@^r@xAtApAbAx@j@r@r@v@b@n@d@X`@h@d@ZLLJJNFJLB@@@?AAI_@Xv@l@l@VnB`CbAb@p@^BHDp@UEU_@D|AdBtAR?]ZJ@l@x@hA",
    "wo@GGMGGGGKIGMMEIKKMGIIIKEKWSMKKMKKMQy@i@k@Ab@QIKcAYoAmA}@NXQIbADcCkAu@gAuAm@Ig@k@g@WOc@]KYLn@\\P_@aBgBy@uAiA{@s@u@y@}@{AoBeByBmAq@m@[h@v@jAhAp@r@vBfB`Bx@?@CPND@@LLAy@}@aAoA{AeBkCG`AGu@k@Hh@fBzAlAhAr@l@h@v@|AdAdAr@j@l@r@z@p@t@h@VRVZVP\\VNFHJHB@B??C@EYSPj@bAbBpAvARh@`@TC^Zx@e@QQRpAp@|@h@TCGr@TLh@z@rA",
    "qo@GQKIGGIIGEOUEGKMKKEGIIKKQOMQKKIKKSQ]_@XKUOWm@gA_BeA_@x@BW^r@iAoAmAqAoAi@Oq@i@SCKy@y@Ev@KTRFG}@y@y@aAiAmAmCgAaAeAcBgBwBmByAsAUOLbAx@nA~@n@v@hB~@|@pAAFCJN@HAJRYo@g@iA}AeBqBuB\\hAJg@i@JXjAvA`A`Az@p@f@b@nAhAx@x@v@r@h@d@l@t@n@n@^NLHLRPh@RHFFBBBAACB?IO[JzAnAv@hAI~@X@Jl@r@p@o@]H`Ad@^hANR?H`An@d@l@fApA",
    "_q@R@IKIKIGIIOMGGIKMKIKKCIKKKMKMGKKSCUSOCUWUYo@c@oAQy@f@WWhASaAyA}@gA_@g@s@GQIGa@}@WLf@HBIW}@mAy@}@aAeAwAoCcAy@oAyAkBoBmBgBk@KQf@dB`AjAt@l@z@rA|@b@hAAFGFHHDLCJQa@aAqA{AgB{BkAv@rARg@O?^l@hA~@x@t@p@d@d@x@bAt@p@p@f@l@r@p@z@l@b@j@d@LNDBFh@VHFFB@B@I@@?EEFa@VfAdAX?x@PHZl@dA\\]c@l@\\Ln@~@HHBXdAfBvA~@jAv@",
    "et@z@`@NCKKGGKKKKGIKKKKIKMMEGMQQMUIIKMKEEGGOIIUSWy@o@k@Ne@Qt@w@uAmAUi@_Aq@RBOOO_@S@GEAe@_A_AmA_BoB{@w@s@aAeAs@g@_AwAoBoB}A}@q@q@OjAbBdAbAp@d@x@jA~@Pt@??EDHHFXFNS_AoAuA{AgBuBs@tAhAh@e@?C^\\f@|@|@p@j@f@j@j@~@r@d@`@f@p@p@v@`Ax@p@f@XRNFDVLHHFDDBBAWEHBVb@LWa@`@z@`@RXMAXdAb@b@M_@VVTr@x@h@n@r@j@\\|@dBrAxAp@",
    "uu@p@?`@NJJAGKIKKIOIQGIIIIKI[s@_@UUGELZ?OUWS]YC@Lq@[b@K[]IMWgAkA{@q@m@Wd@XEMOUWUOUg@_AeAiAeA}AoB]e@iA}@s@k@Qu@iA_BaBsAy@k@_AgAFvA~@z@bAr@\\z@tAp@NXECCD@LTTHPe@{@qA{AeBwBeBKzAdAdA[G@X\\T`@p@v@n@h@^`@j@dA`ARXZ`@v@nAfAz@p@VLNLFJJHHDDBD@Kk@EKPjAj@THGN~@p@h@JYi@g@HHj@KYf@`Ap@p@dAfAbAp@dAh@`@t@~@tAhA",
    "}v@ZW^Xr@EFBCCAKEMOQU_@WEFD@W{@w@[EKEAL`@?a@o@e@]c@QV\\k@aALLr@?a@a@a@_@}@m@a@SPr@IYa@k@e@]]g@s@{@cAgAqA{AaAMMsAy@q@i@[UcAeBaAeAw@o@m@qAw@HpAf@d@dA`Aj@`A|@t@BBIG?BDPd@LK\\c@oAyAeB{AwAcAMjAhA`AK?CZ^XRT`@t@h@\\b@d@n@dAd@b@\\d@^~@nAdAl@b@HJJLHFHDFB@B@_@_@a@Uj@dA|@f@j@RZ~@p@x@FUm@u@u@_AC?\\vAbAv@x@dAp@^f@`AjAzAxAx@n@d@",
    "wy@b@e@n@~@^DM?BHNM@MCO]o@e@MAZHFc@iA[QSIC?HHc@s@a@i@i@]f@\\Hy@y@N`Ar@?UU[[]IIEc@u@w@w@y@m@][c@o@u@oAuAcAm@HNoA_Aq@k@[Sg@kAo@u@cAo@k@{@mAg@Rt@L`@r@bArAv@t@b@D@OAMCDT`@DCd@o@qA_BeBiAu@u@Yr@jA~@L?KVh@XTN@h@^\\^h@n@t@j@p@d@r@z@Zn@fAn@j@LJJFJHDDB@@?MUc@o@H~@z@Xb@x@lApAb@n@\\DC[s@kAuAcADpAlAbA~@b@P^Xv@fA~@pArA~@r@j@",
    "{|@f@QxA@x@v@iAKFVLTBEG?S][YYGL@P_AaAg@QUAD?OW]c@y@m@]\\^`@IiAg@x@t@RB@BGYe@o@o@k@y@}@_A}@w@o@Yg@a@o@q@m@[Mp@c@mAo@{@YYOo@g@i@aAw@o@m@w@iAUNV@\\h@fAl@z@lA`@NNAUGOIR^BJ?o@}AaBiAk@k@o@OT~@`A`@HSBx@^NN@VT\\Pf@z@f@l@d@v@hAjAP^~@d@h@LFHLFFHD@?COi@]a@[p@z@j@t@t@dA|AhAj@^BA?Gu@mAeAiAWdAbAv@f@RPf@j@x@r@n@vA|ArAx@j@",
    "_`A\\d@x@ClAxAoAa@Bh@Bf@?@CIAEQc@i@c@@N?^w@uAa@S@@[k@Ua@]s@s@_@Hf@f@@o@aALh@BNJJDYk@g@e@m@w@}@kAaAc@a@YWY[[W]Lz@s@mAs@s@_@QYm@Mo@y@s@k@q@g@m@c@IEH\\p@x@^n@bA|@D\\a@U?BBLLDVYu@iBiAo@q@o@m@JR^bAl@TSMz@l@JFNDP\\NZp@v@`@b@p@j@zAhA\\^`@TLNJJHDHF??CMa@y@iA_@`AfAvAzAnApAhAl@VF@LBGc@s@wAmAe@Tn@b@d@Xl@r@l@j@|@rAnA~@x@t@x@",
    "_cAZv@f@XzA~AuAc@JHRr@IJDg@APAc@y@w@A^Q`@d@y@}@c@MK_@kAo@c@]MUYUJ^?]a@E??BJNGSa@[m@{@{@_@a@YYWUU[YSUS`@r@e@gAaA}@e@S]O_@i@o@k@g@e@m@c@eAUGLj@t@^b@r@t@n@\\Bu@@??FFV^Fa@w@wAgAi@k@iAo@Fp@f@j@t@b@SYn@r@TBTA^ZPX\\n@RZl@n@v@r@p@t@n@NPNJJLHDD?@CIUw@uAiAt@dBxAbA`AlB|Ah@JB?TDPWcAoA_@Ma@]Jh@|@bAt@p@n@|@|@t@x@jA|AtA",
    "afAb@vAJ|@`BtAsAq@LNZj@CRE{@Md@TcAMi@[FKB~@\\e@u@c@Um@uAqA][ECEIABCEEGIEGGGSm@e@g@]OMSUWUUWYWUMUBr@Zu@_BeAi@WUISe@i@e@a@[[q@mAiASAH|@f@Tn@p@f@l@ZM_@DOFJGh@x@Si@[kAuAm@g@uAs@]Zx@hAlA`@?c@Vv@b@JTBRn@RTCLh@Vr@|@t@j@h@x@`@NLLLJJJHFABKKGm@iA}@l@|AfAzAdBt@lA^LI?THXAaAq@@Iu@w@_A`@rApA|@t@z@dAfA`Ah@nApAjA",
    "miAhAjATzAtAfAgA}@TZDh@L?EqAW~@x@}A[RUYBLjABo@i@Ys@{@{@g@Ya@MBDG??CMCEIGGCG[gAg@QEGSUUUWUUWUMQOFlA[sB_Ag@US@Ka@a@e@_@WUu@iAgAk@SCB|@VZj@p@h@d@NYGTk@N^YDt@h@{@B{@_B_Am@_BiA[d@h@v@hBz@Pc@Av@f@`@LNN^d@LAOPt@n@l@j@l@v@b@VTTNNJJHHJDAKGB[{@u@`@z@fAzAbCbAVT@HBJRR?a@GJKgAiAgAWpAnAfAjAdAlA~@fAfA`AbAdA",
    "qkAv@`A`AtApAz@gAcAd@VAt@BYJsAi@xAlAyAs@VQI`@d@Nc@mASSi@i@g@UQCCD?EA@a@O?CACLESWa@e@YQUUSSUSWYSQOOKRfAo@aC{@OK?MU_@[_@YW}@}@s@i@YWABNZ\\h@`@`@t@ASDZ]BRSIh@bAe@QkAy@aAs@wAuAWh@z@XlAvA^OSj@`@b@`@TRVRVXUc@Lv@z@v@b@DP`@`@d@RP\\TLHHHG?ERY_@}@HtAvAjAtAfAN?IZNF@Jp@KM\\YmAcAaAu@x@hAjAfAbAdAdAtAvAjA~@]",
    "olAD|@jAr@nBl@_AcAz@CGdAG_@Va@s@lAl@EkBGGDx@\\c@q@s@QGSYe@QEh@BKCCED]YIHAJ?SWU][YSSQOOQ[[UQOMO?f@p@}@cBs@EK]QYYU_@EmA{@e@y@WMGAa@BZb@d@^`@j@OMR^@BEAS@nAGq@{@o@o@}@uAcAWVj@Lx@jBv@AYd@RTl@l@LLNTZ@m@Mh@v@z@Rm@@^h@b@Pd@v@l@XHFNBED@QUy@MvAhCbAd@\\\\GCHV^@R`@`AIHc@aAy@_AqAJnAlAlA~@d@z@pA|AzAG_@",
    "ylAWv@z@|ApA?m@_Ap@WRz@o@DTM[^j@\\qAaA@b@`@\\e@i@[SQKIi@Mb@p@FKGGGD]OZHMSQUWUYWSUMKGMc@]USOMKD\\f@GmAgAWO_@[QUQWGeAiAUq@u@e@HDIi@KXb@l@\\\\`@SUXl@D?AAIi@nAZg@iAa@i@s@cAy@a@?`@`@p@fAnAFU\\HPZl@VJVVZRg@EXz@v@KeAk@Nf@d@`@h@n@x@p@VPJPADYKMq@[pA~Ar@f@x@PFVJRVj@nABz@@K]m@qAqA{ACj@`A`Ar@bAxAdBxA@_@W",
    "qlAFNv@~@`@Qi@m@f@Gx@@g@Z\\KQAz@Fm@oAAf@PPEWi@m@WKHDP~@Z?IGEEKSZHSQSUUWUUWQKICKc@]WSQMMJj@ZCq@gAs@KYg@OKQQCy@uAa@Ms@o@UFMC_ABPd@p@TPZQUd@l@DFACOw@dAl@_@eAW]a@q@s@e@E`@l@h@^jALEDTFH\\`@RX\\Vb@C@Jp@v@s@cAo@At@l@`@^Vh@h@b@THZN?MOSq@m@t@^f@lA`ATx@d@HRf@xAxA|@?@cAK_@oAeBmA\\NNj@lAxA|AtAEC_@[",
    "}iARCUP?[i@W^b@ZCU\\n@WOCf@Ii@u@Q^LRJS}@}@YTjAx@Jn@?AKCAOQb@FQQSQ_@WOUSOMGC?e@a@WUQMMGt@j@Ky@cAg@EQk@YEKOM_@eAq@IYw@a@@QQa@c@EJb@j@FTVQ[|@d@FF?EYaAd@bA?kAKGSe@m@[@T^`@Zr@JFBPBKX`@`@R\\h@d@PRD^l@aA}@w@?h@n@\\b@ZTXT\\VVRJQy@[o@Ej@EFjAj@rAzAx@XHpArAbB~@Be@eAKk@oAkBUb@JHH|@xA~@DIKWD",
    "{fAT[CKi@a@a@m@UTPVEDb@?MBHUe@e@QT?HLK}@s@h@|@~At@H@ACAIQ[f@`@SSS_@a@CMSUMME?Ea@a@WSQQKI?nAJq@sAY?Mk@e@MEKIa@Mo@e@Cs@s@?Ee@[c@YQAh@TFR\\e@I`Ab@N@BCu@m@d@hAKkALBE]e@O?LTXV\\RLAPCK@\\n@Zb@VZb@j@\\TRgAcAu@Fh@Xp@Rb@Jd@NLVZ`@Jc@o@M}@V`ADa@Cr@`BnAdA~@z@jAxBjAn@UoAo@_@_@uAgCr@v@RIm@\\x@`@BMK`@jA",
    "wdAR@CQk@{@{@i@s@y@Cr@T@LFCCOQa@m@UNRFIUSj@l@v@jBZ@C?DSWOFz@B]]Ua@@ISSUOITMi@]SSUMKIMLjA@iAy@BCo@o@UIKEUWKSi@Eo@_@@_@e@e@YW[I`@@HN`@e@Nf@d@VCBEs@y@d@zA}@i@`@TCA[O?DHRLVXJINFQ@Pd@d@h@VJf@p@f@RDcAgAc@B`@f@Ht@PXRd@d@ZV\\BMa@[k@Gt@f@BSo@hAbBvArAv@rAzBdBf@{@uA?Di@qAkCQhBXc@w@cAVXHZbAvApA",
    "scAFHFM]eAuAm@}@iAkAVxAV?WQOYOYU^^RCc@c@NfAp@bA`BF@F?WUS\\l@LG[_@a@QDQS[WMTJy@[SSQQICOM\\|@C_AMWk@w@WIMGI]IUU_@HKK]w@q@YUW]MHMBT^MN\\b@VC?Iw@w@z@lAcBMd@f@@REIGADJ@RLZa@\\RI?N`@Nj@h@\\Nd@ZJLGe@i@u@TR`@Vp@Rf@d@\\f@ZXf@Ca@k@o@q@f@pAb@WoAJ`BxAnAnAlArBjBv@q@Uj@I}@qBaCW`BXo@mA{Aw@NdA|A`B`BbA",
    "gcANFPCi@iA_AeAsAkAqAu@|@v@@i@IEQBV`@j@NDHGSQVv@tAnADFCWWQA|@h@@M[s@U?CU[]WHh@]o@]QSQGCA[Dr@\\S]c@aAm@]CCUC[ISKc@GFRW_Am@c@W[U_@WGQBBp@HAZ^VBBSmAMvANaBK^j@h@LLBOC@AEV?`@g@Pb@p@IS\\LVv@^HH^PHNAMaAm@f@Ht@h@|@Zj@b@b@XVjA?u@Ws@aCXbBpAJaBgAz@lApAxAtAvBrBjAb@BFWc@cBsBFLV{@yAeB{@Fn@bB`B|AlA",
    "ubAHBZOa@cAqAsA}AkAeAcAg@dAGG~@n@BHb@b@NJFN[@KSh@bBbALB]UMAXh@^CG]q@SFMa@[IK\\@o@g@SMOGCIUId@l@CMe@kA{@UM@QCUOGQSg@DXC_@}@a@Q_@_@Sc@MSQOKZhAUVZVBB[i@F`Ag@uAJ^f@p@ZBVIEGCEN@Vc@HLjAp@}@LRVn@^DRLRLJBLK_BMt@v@z@l@nA@l@h@j@NdAV?c@_A}C}@vAdBpAeAgARs@rAfBhBrBzAfAvAn@BSCi@eAw@[IcAcBmBYHXt@~@jArA",
    "maAGHFYe@gAsAmAoAkA_@w@wA?VfA~A`AFPXDFPE?EISi@LxApAd@c@AOKVj@XBMAGa@s@HYUWC?Rg@q@QMECCMOSLn@FGQeAkAUUCAKIWIEQ]i@H`@G[aAYYa@QYWKSSYQ?l@t@FJR?@]SZf@i@{@J^j@^VDPHIIAA?HN]CVbAhAw@i@b@j@p@NBJRLJJJJd@iAmAn@lAdA~ArBHc@j@t@\\lAt@Iq@iAmBiC]lDnB\\k@k@kC^nBdB~A`Bz@dAhA`AAPBo@aAq@aAoAiByAAFXn@`Al@r@",
    "e_AMEa@k@{@gAgAaAs@{@g@o@sAXf@fA~Al@NFBB?HKC?MIO@ZnAnAMSI?Tt@A?MAKQe@GWS@MMFaAUGM?AOMSNd@DKIq@oAc@IS@CEYMM?Sc@e@Lb@Sw@[YWWQ[QMQSWOG?Jn@l@VYBSGNZDi@_@b@v@JXJJJACEIE@TWEd@tAp@q@_Ah@h@p@RFFHJFJLFj@UmBZjA|BtApCv@cBVzA`@x@TYg@gAeCmCTfCnBvA]}@eDw@xApBlBpAlApAjAjAl@^@i@w@iAeBsBaBg@TFNv@fAdAX",
    "}}@Sc@o@m@y@aAeAq@q@y@w@i@{@t@dA~@n@PJF?B@HEI?ONBBI|@lAj@g@El@IZECIEMSUMKLE]Is@a@EMIBGWKIn@JMMs@}@k@?YG?@UQQCGKe@_@F`@m@k@SMSOYYOQQMQOG@CLZ`Ba@WUHAr@~A{@eBR|@JVNFFABKE?IPSDd@`@nAU}@d@h@b@DNHFHTALT`@IsB\\jCzBhBfAl@EwA~Ab@|@DE]_BaBe@q@lA`B`BXeAqDyBxAhBzAtAtApAvAnA|@`AD_@cAuA_CsBuAGLRHh@tA~@|@",
    "_~@]a@c@aAaAg@s@w@s@o@q@q@{@vAt@Xb@PNRMHV@l@Oq@KPZ@Jl@l@p@_@Jn@AGAIGGQOQKNOm@Ga@_@AEICAK_@GV^KMy@u@c@K?WI@GSOOAKKc@_@Hd@u@g@[?MQWYMSQGWGCADADdBnA{Bk@LGV~B\\mBBRJ\\@J@?@ICDIAIDf@BbAd@u@d@j@HCDDLJj@BD\\BG_B@fDdCxAlA`A`@aBa@dA|@VBMyAc@[iAj@vAxAh@aAqCmDX|A~A~AdBzA~AtAnA`APM{@{A{BiBu@[SBHPnAnAx@",
    "e_A[[c@mAmAi@k@m@Qc@m@y@y@nAt@V^Ft@Vg@n@xAZCmAm@c@VJL~@t@j@F_@^\\EI@MCOMM[CT{@o@OCAAEC@I_@IGl@AGw@m@c@UCIMEGOYKBKKMk@QVXs@m@S@SGOW]MMIa@@?AFBAr@~BsAiBJAVjApAoAPCHT?H@C@AGH@UA?Rb@Xz@Q\\VC@BAFNd@f@H??Aq@aAxChCjBpAz@`AQkADjA|@DKqAGe@kA`@dAfAh@s@kCwBk@nA~@v@hB`CnBzAvApAf@WiAwA{A{BIa@qAIRAr@jA|@",
    "{_AW]g@}AiAo@o@i@AYe@cAq@jAx@^TL`BhAk@x@pBd@g@{BcA]GCVbB`At@Sa@`@TGCEGKMMg@i@l@FiAc@C@AE?EJc@SAXFGI_Ak@[SFQCKQS[ENQISm@E^\\s@i@QIYJI]_@IUI[CA@FD@RhCaAuBLJZn@v@?QCHBBCPC@@?@@_@FD?r@^RVJNCHKCDB^j@Z?CE]iAzAnCzBxAbAv@bAIi@NnB\\e@sARi@q@FPt@x@o@}BaCgArA~A|@`@`C`CnBhBrAf@OkA{@wAaBW_B{AIl@DVr@|@",
    "y_A[c@q@wAkAy@cAg@ISc@y@@|@b@Rf@bAtAnBr@d@l@Jg@gAiBs@o@Jr@lAn@rAWc@PPAAKOGO_@m@Td@[qAOB@EE?FKa@?HLGGg@{@a@O??MKWM]ORG@Qa@k@?h@^a@i@_@SSV?WSa@[KWIA?FHBLtCg@{BMJn@r@LT[BEBDCJ@F?BA@_@PAJLr@RHFLJBGEEAPf@l@FKG[oAt@jBzC|A`Az@fA`AEF`Bz@S{@Ks@a@FTPf@cAqBeCiBz@~A|AbB|A~BzA|ArA~@Ac@u@}AoAwAiAqAc@Zb@^Zv@",
    "g`AYa@q@y@y@eAyAmA[W]c@h@t@x@Xp@vAnA`BrAv@l@OoAw@oA_B}@ZlAr@d@lAFq@G`@ACMKKk@u@`@n@SaAs@H@CIAF@]GETGEa@{@]QADYAU_@]K@`@KEWe@[C`@b@Oq@[[E^FSa@q@MYQK@CHHDVjDUyBu@LLx@RJQ@ACFA@FH@B@G@DA\\BT@LLBLFAMC??Vl@`@KKe@sATjBhCfBdBdA|@`AbANbAbAJY[w@[Aj@B?oAaCwCwA]nAhBzBdCxB~AxAxA~@^Yq@oAqBs@kAyAm@Np@^|@b@",
    "w`Ac@m@i@y@w@}@gAyAe@ADYRx@dAd@j@~@vA~AhAtA`@_@qAy@mAqB{@bA|@~@p@r@Dk@MZBKKKk@}@MhANkAq@FDEIE?NKUILAGO_A_@MADYGW[i@OATTBYUm@S@^^U[]KCPD[O_@e@a@MK?AFJDvArBUeAi@UJHRHMAFEHAADCPBHULTHBH@?BR?FJEM?DLJZj@OMi@uANbB`B~AxBnA~@dAlA|AlA^VASWa@OXTs@}AgCgBiB}AhAbCxBbBjB~BbBrAv@r@Ak@{@oAeBwA}@s@Eh@f@t@tA",
    "kbAOM_A}@y@cAgAq@d@b@Z?CJfANk@fAbBnAfAbBf@y@kBw@cAsAaAdArA~@r@d@@OCBCKIOs@i@FfAa@qAGJCGKA?NUO?HKEg@g@SLQ[MW[_@[C@b@H?Me@e@MBXXIYKM??SQI_@e@QQKC?HHJ`B~AKgAFa@R]CHKAHCDJIFGVFBWCJ\\FDBA?JF?JAOCDRJPp@Ga@w@mATz@nB~AbB~AdAx@|@jAlBlAf@JBU]_@T?gAwAmBmB}@u@JdBbB~A~AlBnBbBdAj@Ze@w@uA}A{@y@c@u@Dl@z@z@",
    "}bAw@MOo@uAgAq@Pp@|@XJJ`@d@EMd@n@t@jAzAt@kA_C}@aBmAm@bAnA|Ar@f@FCA@IICGMkAB~@u@eADHEMID@@QIHKIEQQUk@[Aa@c@QWQPGZDHUg@SEDPR?EWQBK[KUWWKUMC@JDLz@pBD}@RQ@s@IRSEHA?N?DCJH@SABPFFF?AFBBFBUKDXJXj@MgA_AKv@`@r@|@nAdCnAx@|@~@jBvBx@VTQW[L_@s@}AaByAOk@m@r@~AtB|ArA~AzAjA|@h@Yi@}@iAoAm@q@s@KR^T",
    "{dASw@[CoAoADt@j@f@XZ\\Th@TAVZx@|@fAf@cB_CuAiBaBk@v@fBrBXt@h@FBAKACI_@aAVv@o@cA@BIIED@EIFMOEUc@e@c@UZOg@OWUIRIJHF_@]G@@JLHWUBDM_@QOSSOQOA@FFJ`@bBf@_@DC_@i@IP[INCANF@CFH@KC@HF?NA?DEJ@H[KF^b@\\HEq@}@Vh@h@`@~@n@tAzAjAr@z@vA|BhAf@\\?SIE]}@mAo@w@_@k@u@^n@r@fA`B~AzAnAhAr@Ne@o@iAgAu@y@WUJv@G",
    "}eAq@e@q@P_AkAl@x@b@T`@^b@l@lAn@JPJTPdBDuBcCiBgB}AeA|@pB~Bd@|@`@d@DEG?Eu@y@Zp@D_Am@BCGGCB?ADMQMOWGm@]@I_@c@GWOBPKLBAa@U@FAA@V[GJBQ_@MMYMQMOABBHFL~@pAAQDw@WDAUQRG@FFBGLIPI?BDDAHB@BC@JBYOVp@f@@AC]m@l@^t@p@r@r@j@v@~@dAtA~AxAdAl@f@POIWMc@u@g@o@Uo@i@CNd@v@pAlArAjAlAx@f@W]w@y@qASYOHPZ",
    "ggAg@}@k@Rk@y@h@|@d@d@f@b@d@zAdAJNPPEj@pBu@cBsBcBmB}BqApAtB~@vAzAt@FNGA?Ae@cAd@h@QmAO@GAEAE@DUMCUs@c@IVUWUk@IKMIHRMJCKWQ@DCCBV[L@ASQMUWESMM@DAHDBZvA\\MB_AYHBOIBKHBFDMLKPIDB@FEBH@?AAFPWGN\\h@BACIe@t@p@\\z@z@~@\\V`@`A~AjB~A~@l@d@ZDQUMOc@e@a@_@Yi@]CTx@v@v@hAfA`ApAl@F[[_A{@[MIFKj@",
    "mhA[y@g@?a@k@XjAbAj@p@pAp@z@^ANv@d@Tp@`AiBuA_BoC{BoB_AlAd@|@vAnBbBj@FG@??e@{@p@Rc@aAECEC?AGFQGCKq@Ik@s@a@HIe@OA?GFRT]@AMOSA?A?NP]TCDSKWQQCUOGBBCBJCTp@~@BI}@U@@?AAQJFF?KBED?D@?D?CD@@?@?RCC?HXVCEEOfAl@b@p@lAv@r@DJr@pAjApAfAt@t@ZTFYISQW[]e@[_@OX`@d@r@jAv@`AnAh@`@QQe@i@o@CKHQd@",
    "uiAQa@?RO@i@`@rAv@v@lAh@h@z@FTdBz@V^SgB{BeBmBaBeBkBE^lA`BrB|A~AXC@?Bq@ARC_Aa@EGA@AAGFQACOU]k@_AiAk@@Y@TLB\\^Da@CMEMWAAC?\\CILL@QSMUKIWKGDBCCP?H`@|@NCeAOABBDCUJJDAKBK?BF@AAB?BA@B@@LXAOFTFEE[KrAfAxAt@v@r@b@TB\\fAdAp@~@hAb@`@b@V?OYGSQQc@UWOTXF^`A`AdA~@f@^ROY[g@AEFWb@",
    "ekAHFn@`@IAc@ChAl@t@b@`@`Ax@v@|@nAh@`@Hs@{BeCeBcByAoB{Am@^dAfB|AlBtBbAG?@@KGG[gACCM@FCCA?KE?S[Wm@w@gAcAc@CPT`@RTb@Vk@UY?KSCAK@`@EBJVEKQSWGSQKID@AC\\ADFl@d@Bo@_@EA@NIIDH@CMBEIJBBACB?@A?B?BNTBB@FAC[i@f@hApAzAnAp@f@Xz@XJz@~@~@h@DKx@bAb@T@KYUC?SMIAFPOJXh@`AbAp@`@`@HQOMIC?CJ",
    "okA`Ah@`@l@QMc@Up@f@^X\\bA|@j@jA`Bv@l@EqAaDkBaB_BiA}A_Ac@h@\\t@hBrBxBzAEA?AEIQkAWHEI?@CDAMCAEIMYaA{@cA_Aq@A^n@Bf@R`@Va@e@YASOEOGRd@G@LH@IK[MG[OIMHDCEVf@BLLNBO[_@GLJUFD@@IKEBKDDBA?@B?ECB?FLV@BBA@Uw@RpAfArA|@t@v@x@n@h@l@f@ZFF@Df@`At@p@XZRMc@@JDAA?D?KDNTZv@p@d@Z\\@AGCA?FB",
    "ekAtA`Bh@p@g@c@m@e@Lb@ZT`@hA|@f@lA~Ax@~@EwA}C{BeBsAw@c@k@i@`@XDbA~B|BvAHAI@EUcA_@D@AECAAHQCA?GCIa@kAeA}@y@s@?h@x@PTZ\\@K]_@USMOO@Tf@DA@DJMKSEOYOKKHJCMHdAT@E@B@U[]VEYNJ??GMCFIIHBA@@@?EEB?FNXA@?BMYk@bAlAdA`Al@`@^\\t@v@XXL@JEb@|@bA~@h@Zh@d@NIQJHF@DB?C@DPNTl@^\\\\PDHDB?@J",
    "}kAnAjBtBjAGkAk@}@S?TV`@hAbAhA|AjAl@|@DkA}BeCwAqAq@m@m@i@Vh@Al@fBjB~AZCCEKq@y@?B?AGAABEIAC@GA?k@gAsAs@s@{@Gj@p@v@LZB?CKu@QUSIMFXn@@?C?LOKKKKUOAMDFAEJv@XCGA?BI[YLD]BL?CCK?BEQ?FENA?AEC@?DRVAADEi@g@OjAfA^v@d@R^d@pA@RZNH@@v@fAbAfAt@h@n@PZ`@PEFRAAH??@?JNJP^`@\\NJHFEN@G",
    "ojAtArAnBnAv@y@y@{@c@o@UP^`ArApBxAl@f@z@j@cA{BoBaAsA_AcA_Aw@b@v@Tv@dAbBrAZCCIUw@e@FA?EAC??ICCA?ECG_A_Aq@s@y@gAQj@`At@TDD@EKo@OWKIKJd@b@DCE?HOMEQCOIIIBPBF@d@LICC?@@e@GAL[EL@BKGADIIAKERDCAECBEDVT?CBSy@}@JfAb@b@NRFjAzAXGLLHTd@?t@dAnAnAhAr@`@XN\\d@f@PNHEZG??@@LLHNZ^RFC??BBB",
    "mkArAlB~BbA|AHm@Io@oBoAKp@fA`B|BjA`@l@V~@}@}A{AuAgAyAyAsA{@h@~@bAv@fApAlAF@IGe@}@G@C?ACC@EEEA?CCAEw@kAoAaAk@u@[h@p@x@f@FF?GMa@UQAKEXb@^CCECJUO?U@EGOEFb@JHAHCECC???MSGPSQP?@GIA@IASGKNN?ACEDADRND?QY}@_AR~@J\\GTHzAtAG?YHIn@~AZ^|@zAzA|@^v@X\\R`@d@j@ZNNPb@RB?B?TFJJD@ACDDD@D",
    "ukAnCfCnBrAz@z@K[q@mB}AeAfAlBdBtBrAn@TALm@{AcBeBqAuA_BqAcAVxAhA`A|@vAlAHAEI{@c@CEAA?AC?ICAA?ECAMs@aAoA{AeAo@Mf@l@r@h@ZD@IMSYK@MHb@\\VKAE@EWCEM?EGEDVPBH?EGECAA?CISGNCSH?BICEECK?WGFHJ?CCBDFHJLUk@cAk@k@Zb@p@?ITJpAb@O@OJ\\RxAlAt@`AnAd@t@z@l@l@T`@`@d@t@XNVJTZRHPRC@ACFPLD@DBD@",
    "ghAfCbB|ApA`An@VUg@iAuBeBbAfBtBfB~@p@RD]cAuAaBwAkA}A_BuA{@JjAlAzAtAvAz@@AGIw@_@CGC?ACAAIC?AAEA?_@y@gAqA}AeAc@F`@Vl@b@l@JDIMMUG@@P\\XNSCCDQOBQEE?MBNBLJDCEEEACAACGEQJBM@AFO?IKFMES?@?FD?@NH@PA_@e@{@uAc@i@ZlAXGIFb@dA@S@NHz@?p@dAtAfB^VjAv@`@n@l@\\|@z@XJ\\TLXRRNFEI@DRb@ZTAEP@UQ",
    "{eA~AzAxAlAx@r@h@D]y@sBsBFvBhC~Av@`@VCQgAgBoBkByA_A{@y@_AJ|@~@lAtA`Bt@DCGKw@YACEAECAEEA@CCE?Ka@u@mAwAsA}@YN`@Nb@h@`@JBIGGSCCDRj@VCQEAHSECQEI@MBLAAVJECECC?CCEE?OH?EA?@KCEI@AMKCBACHFL^LIGq@cAo@w@s@_AQdA`@F?]PdA^BWFJl@dABb@r@hArAKp@lBb@l@p@j@pAhAHRNV^X\\PXRPRLVJFD?@WCn@HgAg@",
    "keAtA~A|AjA`A|@f@VQo@_BwBBvBtBjAj@XHEi@iAwAaB{Aw@q@}@cAmAB~@r@t@hA~AfAFAIMs@SAEICECACAAACCCE?UcAoAyAkAw@YH\\VVh@VJDM?CSCBDLp@RKME?HSAIKKGAA?@C?LRAECCA?EEEC?C@AG@DCM@CICDKGIA?E?RXPFKoA{@gA}@o@Oq@Hd@MRBa@\\nADTW@PdAp@n@h@Zl@FLxAfAl@t@p@nApBPAh@NR^h@TRn@^j@PQOOHANT_@Jt@n@{AkA",
    "yeAnAjBrArAnAdAr@Z@k@wAuAPtAzAz@^PDOs@gAuAcAs@gAmAkAeAgAI~@bAvAxAzA`@?AKUk@IEKGECCA?CAAEAA?AUkAoAyAoAu@MHVNNh@^JFOBAU@BBJx@FGIEAHQEGIKKA??GGJNL?GCAAAEGACA@ACA@FCK@CMIPI?OIE?ETb@@Hk@wBcAo@i@m@c@]E?QPHAZd@H\\I@l@~@d@f@h@`@LB\\lAfAv@x@jAtBd@If@n@^VZb@Xb@h@n@`Am@k@HI@M`@JAJn@p@g@mB",
    "kfAlA~A~AzApAlA`A\\Nc@yAq@NjAfAn@RL@O{@yAsAaAiAs@iAsAiA}@f@|Ax@hA`BlAH@GEc@_@GIMGACEA@AAAE?A?Um@aAwAwAy@[@@FLNTn@XHOCD]BDAH`A@KEG@BMGCKIQ?BCWKF^TGCCA@EGG?CA@AC?F?AIFGQKVEAMGE?EVX?BoAyBGHSc@y@y@[c@Wr@Z^_@_AAXD`@z@f@b@`@\\b@XXVf@j@dArB|A|AQObA`@v@|@VTXh@fAvA@wA]LEFHN@B?n@rAm@}A",
    "mgAbBhB|AhAdApAlAt@XMcAYVt@p@^D@AWaA_BuAiAsAiAw@y@aAo@jA~A|ApAx@n@@?GMs@IEMIGACCA@@CAEA?EUm@sAuAaAg@UFGA@NRf@l@JODCUKFEHdACGGEFKEEEGOMEDCMKMXd@GE@?AKGE@G@@AA?B@ACDKSBP@?UGCHBHFBBgAqANJO]g@{@s@eAG|@`@Rw@gA_@[Gr@r@`@h@t@t@j@~@XLRNj@bCfBh@QYv@p@jAx@ZNp@xAxA@MiAEFBL@ABNFNj@MW",
    "}fAfAvAhAlAlAdAjAvAj@NSBDT\\B???c@gAoAmAqAsA{AmA}@}@Q`A|A|AbBxAZ?ACo@]?GKKE?ECA@BAAEA?EYa@q@y@y@w@{@FOG?JZVf@p@OCQAUIGb@v@KCK?DMGCE?YA[DPOESD`@DAFESECAAG@@?A?@@?ABISHNFBY?AJ?GH?Bi@QC@U_@a@e@uAmBDjA\\Lo@k@Ui@_A?f@l@nArAx@f@x@^NDb@p@rAl@NEIt@jAt@d@t@fAjA~AIe@DWMLLHDAHFTZXq@K",
    "mdAIdAxApAjAx@x@tA|@f@PHDAD????_@qAyA{A}Aw@kAoAgAw@Ep@tAxA~AhBh@A?Iu@O?GMICCCCA@@?ACA@?IAk@}@kA{Ag@FEW?Jh@d@r@d@U]KCUWEz@XMCC?@KIAE?OE[ATED[Q`@L?COKAABO?@@?C@@A@ABIOAXDDICAP@OBEJE@EASS}@eAwAoB@~@X^]WCk@{Aw@Rx@~ArAv@bAl@XJNBJl@~@JNh@p@h@z@jAnA`BxA?o@w@BBHPNRHFP`@XJI_@a@",
    "cbAUv@tA~@p@p@l@~@hAv@ZRB?????Ag@uAsAwAyAiA_AmAcAi@Xd@hA~AzAtAf@??Uc@MEMGGAIEA?@@@AAA?B?_@y@w@gAqAH?F@GAb@n@b@\\i@c@CHSa@Az@@I?CA@GI??KAOMMHNTG[FEDYGEAHQE?@@?A?@?@A?IKCRLDAEHL?Q?IHIDD??WwAcA{AcBN~@@j@APMy@eBUWPp@rAbAjAl@VRREFb@fAv@b@`@d@^x@`ApA~AbA_Ak@y@CR\\RPX\\f@f@ICBM_@M",
    "w_AWLbA~@v@b@^h@`A|@p@^@?????GeAyAmAsAmAkA_AcA}@Hf@Vb@x@lA~AfAB?WWKQMECQICD@@B@AA??@Uw@y@aAk@e@j@?NJ?GJb@TNm@e@FJIe@F^DK?AC@EE?AI?MI[Ed@\\OUOHI[EBFKKC??B?A??D?@IGICHX@FAJH?IIKFK@H@@YoA_BuAu@n@t@j@n@Jb@{@kA}@]c@YFdA|@`Az@^PTLDr@|@|@d@\\d@f@r@~@xArA[iA_Ak@I\\ZX\\x@z@t@Oo@QFPm@G",
    "m}@YWh@z@t@l@ZVp@~@jA^??????UwA{AsAsAgA}@_Ay@c@d@d@TPl@tArAbADESQMW?OQGGAD@B@@@A??Ca@o@kAoAa@\\r@F@TC?FRXQe@g@NBAa@AB^OBECBGAC??GGOQQd@NYEDG_@KCREUCC??B?C@?BD@KEKIF\\D@HHF@?QKDICFD@]cB}AkAT|@x@j@l@VXi@iAs@aA]o@Wb@p@n@fAt@h@d@XBv@t@l@F^Xd@r@l@v@xA]_B{@i@IJ\\`@bAh@|@vA[iAw@HVg@?",
    "a{@]e@Cl@p@l@d@b@x@|@|@V?????A[o@mA_BuAeAiAkAaAGl@h@ZP`@|@nA~@AGMIIQSUIGG?B@D@B@??@Ki@_AmAy@Ct@r@JKVE?FLBOc@O?BG_@A?XMDICDE?E?BIGY?HRWEDMe@KETCUECC@?@@C?BBDBKGKSRVJGJNDD?MK@EEBHI}@wAqAe@x@p@`A|@l@^Tg@y@wA{@Yk@c@YV|@nAlA|@v@ZFZ\\`@`@XHXd@j@bAnA_AkAw@{@MP^Vj@z@tA|A@yAqA_@b@I@",
    "ux@]c@]Hh@h@r@x@|@z@f@B?????IkAiAe@UkA}AwAwAcATbA`AXH^v@fAZEGGGO[OKIKE@@@BBD?@?@Ws@iAoAc@f@n@~@RW^QWDR?G[SE@MMOFJKBG?BCBAJKSEIALCIGO[SEVCWECEA??B?C@DBFDGMS_@VXVKDZBB@COEACBH]oA{AgABdAt@`AlAlAP?Yu@kAq@m@{@c@s@?jApA~@z@`AXVFBHl@\\j@`@l@`@lAXwA_Ay@m@[ZTRl@fBzAl@^YcAyAc@ZD",
    "ev@a@MSo@Et@rAdAz@h@D??????i@yAsAy@]w@gAqAmAk@d@p@bAlAb@Hx@n@?EGEGMa@MMCOIAF@BBBD?@Ek@_AiAm@JXVpAb@WROY?HKEUUCAGCO@DI?GJILLDEKQOA?IQSQGGGJH[KEACA???DE?BHDFAQ]a@P\\^GETRD?GKIAAHHo@wAwAg@Zt@fAxAdAn@BAIm@eAy@{@cAu@w@TdAtAjAr@TZLHFHn@b@n@b@d@x@z@JaBaAeAa@UXPb@nAzAx@RN\\EcBwAFH",
    "{s@SIMk@k@j@rAjAj@B??????E}@qAkAkA{@{@aA_Au@Nd@h@l@r@dAn@V\\GEEEKOQWMIKMF@@BDBB@@_@{@s@UGPBLnALEIIE?OIKQQACACGA??MGRP@WQN@IGGEU_@AAB@EMWMCACCA???FCCBNBDCS]IDL\\HMDZL?GOE?@FHw@}A{@Ht@p@x@dAx@HACG}@mAy@m@}@gAw@j@x@tAdAZVJVVHPl@d@`@R`@z@jAYmAgA}@UBRRZj@hA`ATZf@\\yAeBQD",
    "ur@HEB[g@DdAz@D???????a@}@eAyAeA_AgA{@k@Lb@f@b@h@\\Zx@h@AECCEQMS[UAIA@@@?HB@DEm@q@Q@DH?Hn@?EECGOIGIWIGCAA?CA@Q?h@M[EIOAACKEPCGKGSSMCCCACAC??BDAEBNDB@MQGB?\\@M?XP?CKICH@LcAiAUl@p@t@r@h@N?ACUiAqAy@}@w@w@q@X|@~@z@^\\L^^PXd@\\Zj@r@jAEe@_AiAm@OLPXPXz@z@`@\\v@r@mAaBo@H",
    "{r@p@RDI]Md@Z???????My@mAo@qAqA}@_Ao@Lj@^\\`@h@f@NZZSCDCCQGUc@[I?O?P@?JB@DEa@UICFPJF@CKMIIGGGKMQOA@B?CDIMVXg@MGKIOIIIGE?GGEAECCC?GAAAA@B@FI?HN@B@KEBANMICRXDAAQCFDJg@o@[h@n@v@h@L@AACc@sAyAaAu@i@c@e@Up@f@l@l@h@d@l@d@ZVX`@l@l@|@^c@u@u@aAm@QP^TPh@j@d@Th@lAbA}@iAsAG",
    "_t@~@n@H@AI?J???????i@sAgAeA_@kAgAaAGt@r@h@P`@h@Z@NLWGN@?IU_@q@G@MAEH@@F?BJIKG@GF?BAOIKMKMDEGMCU[@HD?FEQEj@Ee@KMKKOM?ICEEEEACCACCBIAACAB@JAC?NDB@B??@BKIKEHb@J?@Q?D@DJg@i@N~@t@N@???Eo@_B{A_Ae@SWo@m@Pf@d@`@d@~@z@p@b@Zb@`@l@|@`@_@a@g@aAiAu@MZj@Jl@p@\\`@^XfBr@}As@}@E",
    "yu@nAhAZ??????????EK[w@{AcBaAg@_Ai@^t@~@r@NRPJDRFOADCGQSa@]I?EI?GF@BDJKACC?AA?DWGEOQM?JBGKK]_@ANFLIQGDr@Ya@UIKIMMICCECEE?ACAC?@IAE?AD?NGBFLA@@@B@ABKCQIHZV?@MCDBDF?i@Hz@\\D????E_AeBqAi@WWa@k@_@Zt@l@ZZTl@hAr@RR^x@XC[e@_@k@qAgAQXf@b@fAj@F\\p@ZvAb@yA{@_@`@",
    "mw@zAdAx@L?????????g@s@[q@g@qBgAg@e@Nj@p@t@v@F?LARLLGCGQOEQSYS?EGC???@HDQ?A?AA?@JIEMOS@MFBQIUS[KLPDSEGVd@e@_@QMMMIICCCCGEC?CACCHICAI?B@DJ?ADJ??@@B@ABAIKIDDXL@KCHDBHFADTHD????IsAqAs@g@SYa@e@Ib@t@f@j@X^V^`@^NVRCHQm@YgAi@g@y@Dl@~@nAl@RNb@v@v@I_A{@Il@",
    "mx@v@fAdAx@H???????EeAuAi@i@a@aAuAUZf@f@d@t@P?LP@JBDAMMOKGQUUQ?A?GB??CNKO?BAAA??REEEWK@?O@SSa@GGMJNAQIBf@Le@c@MMMOCAECEEGI?ECCEAPQHQEA@HD@DBCL?@?BB@?AFGIG@FFRBECDFDHD@DFDF@???Ks@o@s@aAg@Ua@_@Ed@t@n@^n@ZLR?XBRFALYq@c@_@uAQo@M`AlAdAn@\\j@t@r@Ge@u@s@\\dA",
    "yz@z@dAdAxAp@@??????Gu@kAwAgA_Aa@_@Nl@`Av@BXADVDHBC?GSOKMQIUUIC@@AA@S@V?QGD?CCD?PAAAYODBKMUYUKGGDTKSEZ^Go@UKKKKCGCCCEIKAI?EE?JJWKE?@BDF@FGHF?B@@B?AFEICBFDJBAA@JBFF@@DFD????Cc@eAmAu@KSe@i@Gd@v@l@d@d@XPG?ZJFDCFa@q@aAQUeAe@@pAbAx@l@`Ah@z@Pc@g@u@IjAbA",
    "_}@lAlAnA~AhAD??????AWiAkA{AyAs@`@b@Th@hAR?@HH@@ECBQ[IKIASe@K@K@FEGDE?JTGIMCDGFBLG?AQM@GQI[SOIIM@\\WI?n@?c@UKOKKIIEACAAKKCIBICBJIOCE?@@@DHDAEN?BB?B@?DCIA@FDBF@?@FDDF@BBD@????McAq@[Yc@c@o@u@]\\x@l@l@h@NLEBPJHCEHg@{@_Aq@Hg@u@ZpAjAz@z@\\hAbAc@q@k@i@r@pA|@",
    "c}@lApAvA`BbA@??????Y{@q@{AiB{@Xp@p@TTh@XBH?ACCE@CUOIIMGUa@D@SDBGYF`@@@FEYO?FB@DJG?ESE@QGEYc@a@SGFPVWEJd@S_@GKKMMMIGC@AAOEIEDKCFR_@EEEA?@BDF@HEF?BBB?@@B@EG@DD@BF?BBFDDBB@B?????Ig@s@y@o@g@c@m@w@w@Xv@t@~@h@RJK@B@JSCTQeB}@m@LGc@fApAdAj@b@d@fBCa@s@u@EhApAhA",
    "qz@p@x@`AzA`A@??????w@wAgAgAeABp@h@f@j@ZLCF@C??CCEQYICIMGUQF@WMHKMRNHBBIWYDH?ALJAEUA@AKEOe@o@e@OV\\TKYEVXQ]GIKMOOKG???GMAKEHM@PIUCCGEADHDD@@D?A@@DB?@BB?E?B@@AHB@BDBDBB@B?????ScAaAy@o@_@a@e@cAy@?|@lAdAf@LXMECG?]EN\\mA_Bu@?Lt@lAhAr@b@XTVV[s@c@RlAvAfA",
    "ox@`Az@d@z@j@??????Ay@qAaBkAO`@h@h@f@j@X@IK?FIGIMQKGAIKESQAFKQKDGXJGCFHICE@@EKBJEIEAEIEG]e@g@[Z\\BSWCEPb@Ka@MGKOQMGC@?EKGEI@BKTEUEEGEEEBND@D?@@A@@DB?B@@B@C@@A?BDBBBBBB@BB????Aw@oAcA{@o@e@c@a@q@e@@j@hA|@b@h@DMMAYG_@SJ`@HgBeAEfAfApAr@j@^F?DAKk@Wv@|AbA\\",
    "ox@|AlA`AXB??????As@kA}A}@LZVd@l@d@H?EEG_@GKSKAE??EOMGBACAIMABFJIEFB@?ACCEG@HCKGICGIEQk@o@ZPWWA?EI?v@Ac@SOCQSGC??CGIKAKH?ANYCGGAKEKGNNBD?@BAABBD@@@?BB@@?E@?BD@BBBBB@B????A{@gBqAaAw@g@GKc@k@E`@p@|@v@\\GWMBc@g@]SLr@La@qARhAbAnAx@d@JACBQSk@B~@hAn@`@",
    "wy@nApArAz@@??????Ey@yAcBXf@PNX`@JDGSWYIGGAC??A?CGKIECECEQGJHBFE?F?CAKKACFBUICGACII[]ERg@QEFCGIAn@R_@a@MKOICC?CIGIEAC@DB?UDII?MMMGLNBDABFE?CFBD@@?BB@@BAA?B@@@BB?DB@????A_AgBaBsAi@Df@?c@w@aAGj@z@h@\\M[UJ[s@g@_@Rx@@Ec@`@nAdAhAv@ZHIIIa@[a@^h@|@d@^",
    "cz@pAnA~Az@@?????Ao@cAkAk@p@hA^JDGAAa@_@OIE?B?C@AGCAESECECCGKGDHHBD@A@ECSGNDG_@GB?EIIIIQEM_@KKEDECEA`@ZOm@MOIGCAEIIGEAADDCDCQ?GDGYUKFJD@D?@F??CB@CL?@?B@B@@?@@A?B@@@@D@????Au@oAsBcBWb@j@P_@cAcBs@Rl@f@JIUc@HB{@s@]Ph@BAVv@`Ax@~@v@f@HQO_@q@e@EVp@p@X^",
    "yy@zAzAxAb@??????QmAgAe@\\f@t@b@EEEAc@_@GIMC??@@EACECMKECCACICAEHPF?AADM?OEX]SMBNOISMKG]GG?GKCAGCEBn@NW_@MAIOMIMGGEAACJDAB?EEAEc@o@CDHF?AHFFBDB?CBELAAB@?@B@@@@A?@@@B@@@?????WyAsBqAM\\f@Lc@eAgBwAGf@^?IS_@I@Uy@OJ^BFj@v@j@|@|@|@h@JMa@i@{@}@Dj@~@r@l@n@",
    "oy@zAfBtAP??????_@mAm@L^`@XFGE?]c@IIICGAF?CIACIAKICCC?CEC?CFR?AAELI?MGPk@GIFLWQSMIEQEAEGII@AIEDn@F]a@EGGUIKIEEKDA@FD@A@C?Ka@u@WBFDLGJBDNF@BB?@?@@A?B??B@@@@??@@@@@@??????GkAqAg@WHZ[k@}@aBiBi@VV@KWa@UMKMKIb@JLp@jAl@t@z@z@b@MMe@{@y@u@j@nAdAv@f@j@",
    "iy@`BlBjAH??????Oq@OVFFDCCAa@a@G?GKMGBD?CKAEM?KE@AGEE??BBFD?EEHFCCIC?[GC@CYOOUIEGEAEKMCD?IAR\\Ag@Y]S?DKIICFI@HCF??A@CSc@[i@[Lb@LJWHDILHP?BB@?C@BA@@@@@?@@@??@@@@????????Ug@[g@[@}@_A{@gAoAu@Q?FQ[a@YUED?UVVRn@lAv@n@t@x@NKa@g@s@{@JvA`At@n@t@`@",
    "{x@~ArB~@B?????C@KIDE?CCE_@]G?CKKOAB@AIEISE@@?AAGGGBBHD@?HWSNTESDNGIKEIc@IMOWMECGGGCK?@ROTNFi@]S[WMFBCOCVACFF?C@ACe@[Ia@UYTd@NNGK?AFENL@B@@?A@@A@@@@?@@@???@B???????????IYo@]{@mAgA_As@e@y@c@MWYSE?QUI?\\p@DFnAz@r@n@TDEa@q@q@UnAnA|@j@h@t@\\",
    "gx@tAtBv@????IQ?DPE@O?EGUa@AC?EMMEE@@CCOSOBDJ?QAAECDBTFO@HMYKV@[^CKOQKJ]SMKKKKEEKKCEA@l@L?Ki@SO[[IGBGCE?TBJCDEA@Aa@a@JOy@AAPNHJFKGFCG@\\@@@@@???A@@@@@?@??@?@@????????????AQw@mAwAo@[CQoA}A_AODJPHQk@yAd@fAj@?WL|@n@`@ACSK}@u@j@hBvA`Ar@n@h@d@",
    "ow@hAfBv@@?AIQ@D@JLYM@AOUICE?IIKIA?ACEKKMBHTE]EGGHFDTEOP@CMMFFEEMIS[ITW]I?GOGEGMMIE?F|@?Yg@CYI_@QD?MIEENHERJMA?Ba@]ORE[USZ@?RFE?IKKFf@B@@@?@?AAB@?@@?@???@@???????????????g@sAy@g@QLW_AyBqAGf@NLBGo@eAKjA^?OUEZPMEYAg@Ql@nBxAhAx@~@p@d@",
    "qv@|@~@~@NIKGBJ@@FJ_@GAKQGAGAAOMGAE@CE?CGODJNUQKERHADJ?KJACCCEIIIOI[WGTYQI@CMIEMQKIE@^p@Qe@SQK?KGKSQGBJCCGb@@OAFC_@c@ADOi@]?d@BRH?CDOWOZ\\H@@@?@??AD??@??@?@??????????????????Es@i@k@GHa@gAsB_BIl@TPF@[UONBCCe@c@e@QYMKPd@v@Sr@pAzA~@l@lAf@",
    "mu@j@f@l@FG@LL?BNDAYEIWEAE?AGSKAEECCDCCI?@LEWCGLXH?ACC?CIIGIGGEGKKU_@EHDIYEAGEGKQKGGp@\\E[k@AMGEGEESQ?B@IDHZa@G?LSY[WFOCEGJJNGURDG]WR^R@@@@???@@BA?@????????????????????????Ue@CHk@eAyAwBy@FTXd@\\GG?HT]o@k@k@q@k@w@c@z@x@d@z@BHx@hAv@d@h@z@",
    "_t@\\RTADN^BAFPAOUMICE@AEIEKKMGECB@EEGAFTOWHHLH@?ECIKEKECIIEKAEMs@AAKBFOO?AACGOUKNz@CIw@EQMGCEACEGA@AHRAOEOEBWWu@EDCLACB?@[i@f@XKYJLRD?@BB??@?@@?????????????????????????????ACe@gAeBgBo@?JZdAj@?@LPLMeA{AmAw@m@o@?j@j@b@p@VT^\\f@\\Z|@",
    "qr@LFRBPPHAENHWOGGA??EIMIGMECC?CG?AESHJVKAFH@ACESOWCL@CEYUA??CIk@SVAHEYCKIC?EKUFd@PGYg@MCKGIEGC?RP?ECE]]ANAWUEg@[DD@H@@GQ[Yn@NGKR@JG[?Nd@B?@?@????????????????????????????????QmAeBuAe@RX^p@^XD?HBEe@iA}BmA{@o@Lf@d@b@\\t@Hr@JP`@XT",
    "mq@IC\\XDNFA?NQWEG?ACAQUKAGAAACAEMD?GOLNRA@@?CEGKOOCCB?CEWk@BTFAIYBRAEEGEKSa@WGAD\\DSMUEQWMGEC??\\DQIGODN?CIUc@KIe@_@J?@J@?AIQOFD@ADDDMINXR?@?@?????????????????????????????????AsAgBcAg@HT\\f@T^^XIDI_@{@oBiB}@q@It@l@\\^|@Lr@n@JDHJ",
    "yp@KKf@LNPBADC]GC@CCAKSSEI?EC@AGGID?ONNFJ?ACEGEEEEGESFAAEKi@LNECCEKM[BHC?ISJGQABGS[IEBKEa@MA?FLBa@M[Ig@A\\f@N?MQFg@k@YBKFHCECCGEK?DDB@@DBJJF@@@???????????????????????????????????u@yB{@k@KNZ`@`@^p@j@MEQ[iAsBmAcA}@Or@jAf@j@h@NVn@h@C?F",
    "kp@AGXLPH@@DUG@EEGGMKMMIGAA?EGGCCDCGb@L@CCCECCECCEEEECEECEEEEEEKSc@g@g@n@F_@HEU?ZXKc@ED@K@IAAQWE?J?UMSe@Q@a@C\\VLHAEMYq@@?ECECCGEEUSNPDBDDBF@DJB@???????????????????????????????????]}A{@k@_@Hj@l@P^t@^Ui@MQ{@kBiAiAoAC~@x@h@n@`@d@?d@n@R@C",
    "cp@AJTJF@D?BOCKGMEIIIKME?ECCMKEFH@BPL@ICACCCEEEECEEEEGKGGCAOI?a@c@}@e@DfAFy@ANIG?NACCIGACC@CC@H?ISSS{@e@Gl@SQRL^JAOY?SI[U?GCBDAGI]HLJFDDFDDDCJB???????????????????????????????????E}@s@m@YPv@z@TJNCKcASWa@iA{A{AqAKfAz@Zd@j@l@DJn@f@LF",
    "{o@?ZLB@DB@DQIIEIMIKIGEACKGGG@E@DHJNBECEGCEEEECECECEGMKIIIG_@YTO}@s@Ml@t@_@i@ILD@BCCAECEKQGGCIGDJS[D?s@[AZEEF?X?Eg@MFIOYO?GIRBALSYDHRNHDFBIQU^ZF???????????????????????????????????Km@y@E`@n@b@B???Ay@}@c@y@qAcAcAwAAbA`Ab@X^j@d@PVr@B^",
    "{o@RRBBH@@FEQEEGMKIMECAAOGEG@CC?JLLBEGUICIF?ACOGDAEGKIKGISI]KGCy@a@Bv@@c@EEBJCCE@CKIGIIGIMACCIM[GEUQFNF?C?C@a@{@MBN?QI?@IH@OPDWERVXFD@a@cASTf@r@`@@???????????????????????????????????Gy@Sh@f@B?????OgAgA}@iBsAc@iA@r@|@\\Zf@f@v@Z\\l@NP",
    "cp@R^DF?HD?OGECIOKGEEKACGIKA@AIEZPFGKKc@CFQQJVMQSVCCCEI]GUQ?GU@g@]?@JNQQ@FKGACE@AICMIGOGAGOYYUIMBQVPF?AAGOiA}@]CVVPCCDAFCK?PYHPPZ@Nm@oBm@Pn@x@p@v@H????????????????????????????????????Oc@N`@@?????GiAuAk@uAaBw@aAGj@x@^Xl@b@dAd@Th@p@B",
    "mp@Th@NJGN?OM?AEKKEEGKMFCMMEA?EOL^D?_@ASw@NB[Rb@ISE]T@CEGOc@IHUIKKUc@O?@F@B@EI?GEEE?ESCC@M_@EAMOY_@UG@JCITR@?CCYiBkAo@?b@f@^BDHC@IGEPGHHJJD[kAyBGl@bA`Ar@x@X?????????????????????????????????????GQV@?????OqAuAc@uA}A_AaAEj@r@j@Vp@`AfAj@XV^F",
    "sp@b@h@XBFCMKE@CCEKEIMAE?KOM?CEIQl@JFi@MCQk@DDUr@RCMc@IH?G[CW[FBKMWAMWSAK?B??E@@EQOOJDYGFD]aAU?SD?IS@@@@A@PH?AEi@yBqA}@D`@b@f@`@P@KIIDLBKJLCFIeBuAaAVx@fA`Az@z@h@@?????????????????????????????????????KBF?????c@wA_A_@qAqA}AiAHl@l@t@TZ~@lAx@XPZT",
    "wp@n@Z\\PCIMCCCC?GCKO@@GIGOK@EGOBd@BBc@GYa@I?`@AT@AEe@WFAm@_ACXYDHCYUECEM_@g@KRPN?D@KWWCNHMI@?w@wAe@ASXd@@U?@B?B@HJ@CAw@}ByAsABb@n@t@n@PIOM?JRECHF?@g@mCwA]x@|@bAhAfAz@j@@?????????????????????????????????????AAB????Ce@oAo@u@eAkAaBaBJl@l@t@X`@f@`AbAl@PVR",
    "uo@n@@ZRKKGEK??C?AGEIGGEAGMKCG]^XDAQAQc@IFJJAACAOa@UUuAq@Sf@FGBQYWABFFYw@Bh@BBGGH?Uc@DXABKAOkAeBe@KOVt@RED?BB@@LDBC?q@eC_B_BGr@p@p@b@PBOGHJDAAL?HIcAmBuBUhAhA`AhAfA`An@@????????????????????????????????????????????WeA}@m@k@w@wA_BwAEl@r@~@b@`@h@^xAz@JRA",
    "yn@b@E\\LWCIIAA?AACEOECG??GIKMOWp@JF]WB?FIKHACGAAKSU_AuAy@a@PJPWS]MBPT?c@c@Q^@`@k@APNCQCRHBIGYoAyA{@WCLr@^TDB@@DBFDB?Ea@gCcBaBa@j@l@^L\\`@EADTFA?LDEu@sBuAiAL~@dAhAbAp@`Bz@?????????????????????????????????????????????k@{AaAs@i@q@uAyAy@Cn@z@t@^\\b@h@dA|@`@F]",
    "um@?Ef@A_@BKC?A??ACCAIIE??MGGIOMf@DDm@UUDXAFCAEMGABCGi@cBwAaASHVQm@_@SD`@t@BcAQE`@TPy@IILRXFJF?CMWwAwA_Ac@OVt@t@TD@CH@DADL?I]_CkByAy@Z\\Tb@p@`@CFEDb@C@FBk@cBuBoAMl@~@bAhAbAdAjAbAB???????????????????????????????????????????As@wAcAs@}@aAmAgAYD^t@n@VZXj@p@lAh@Cq@",
    "qm@CRXUWAAG??A????CGKACEGIMIHGJJKw@?AOPCLGAUWCPFEAm@sAyAiAc@KDMeAg@WJz@x@@{@SRz@RD][c@Y`@~@LLD??Mk@}AyAcAc@Lf@j@f@HIQUVE@GXl@IS@aBeBgBmAEb@`@t@v@\\CF@BZBUAUiA}BiAi@Lx@z@~@dAbA|AhAv@D???????????????????????????????????????????E_AsA{@g@m@q@qAu@JAWRp@VTf@b@|@dAd@]i@",
    "im@H\\I_@OB?EAAA?@??AEGD?BQQY?TMKXKm@YEVI?ESQUBX@_@_@`@_AwA_Ai@s@e@Ga@oAe@QZ~@f@CIg@j@`ATHUYeAs@`@~@~@T?B?KkAoAaBiAe@Fd@p@P@e@KER?EE^d@D]RaAuBeBcAGh@n@l@r@d@@CLJPAWk@mAyAcAeAGd@z@`AbA`AlArAjA|@B???????????????????????????????????????????Gg@cAiA[Gc@y@i@WS[]XZVt@`An@l@De@a@",
    "el@JGa@WAJK?CACD@?AADFBCCEEOMGg@Db@IQm@SJ@U]KCHRCs@o@k@p@o@wAiA_@]o@a@OmA{@@j@v@\\H?GJbA\\RYo@eBs@X|AlAb@AFBKiAaBeBoAw@?v@TLDi@OLACCCXX^a@PIwBqBqAXf@j@l@j@j@HGPX?SYqAqAqAsAe@Xv@~@r@z@lApAzAvAv@????????????????????????????????????????????C_@s@gAWLOo@e@g@i@Sg@SZLnAlAj@RSW_A",
    "qk@SWe@RDQABCKBD@??HJCAAECEGGIYIVIK]EQc@YMAJR?Cm@mBw@h@UqAiAs@Wk@u@Sa@}@PpA^P\\PJI\\d@T[w@kBqAV`At@xALi@r@EiAmAcBiBaADb@FVA]YJ?IEGNTb@IDXgB{B_A`@b@p@n@d@l@N@JL]Mu@wAsAmA_ASz@z@z@|@t@~@vAvAtA~@B????????????????????????????????????????????KYw@QC?a@{@[q@]s@i@b@f@x@z@VF[e@i@",
    "qk@s@[PNGCCGMBB@??BT?ACEGGCAGEEGAKu@a@?CWQAIRJK[?wAyAo@NmAiAu@e@o@y@e@Q]\\jAj@T^`@LJ@j@Lc@wAqA_BQZrAxAr@eAz@NoBmAo@wAmA?DPZGIGMOM?QD@ZR@^w@sBq@Xf@l@j@`@j@RH?Bm@Ss@sAqAoAy@Vz@|@x@|@l@x@jA|ApAjAL??????????????????????????????????????????????KWULq@kAKo@{@}@q@Xj@~@d@LFQ}@e@"
];

terrainMap("scichart-root");
