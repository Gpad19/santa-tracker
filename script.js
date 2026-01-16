Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjEyOGQ2Mi1jMGUwLTRhNmMtYThhZi1lYTcyMzAwYWFiMDYiLCJpZCI6MTIxODQ5LCJpYXQiOjE2NzQxNjE4MDh9.-_OgfjufhglZ0BdQkgwdlNqABiJNfe61EzpscAFljBE";

const viewer = new Cesium.Viewer("cesiumContainer", {
  timeline: false,
  animation: false,
  baseLayerPicker: false,
  shouldAnimate: true,
});

// ----------------------------
// CONFIG
// ----------------------------
const MIN_STOPS = 300;
const MAX_STOPS = 500;
const FLIGHT_HEIGHT = 300000; // meters
const TOTAL_DURATION_SECONDS = 24 * 60 * 60; // 24 hours

// Random number of stops
const stops = Math.floor(
  Math.random() * (MAX_STOPS - MIN_STOPS + 1) + MIN_STOPS
);

// Time per stop
const secondsPerStop = TOTAL_DURATION_SECONDS / stops;

// ----------------------------
// Generate Santa's Route
// ----------------------------
const santaPath = new Cesium.SampledPositionProperty();
const startTime = Cesium.JulianDate.now();

// Start at North Pole
let lat = 90;
let lon = 0;

for (let i = 0; i < stops; i++) {
  const time = Cesium.JulianDate.addSeconds(
    startTime,
    i * secondsPerStop,
    new Cesium.JulianDate()
  );

  // Bias toward populated latitudes
  lat = Cesium.Math.lerp(-60, 70, Math.random());
  lon = Cesium.Math.lerp(-180, 180, Math.random());

  santaPath.addSample(
    time,
    Cesium.Cartesian3.fromDegrees(lon, lat, FLIGHT_HEIGHT)
  );
}

// ----------------------------
// Santa Entity (Red Dot)
// ----------------------------
const santa = viewer.entities.add({
  position: santaPath,
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 1,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
  label: {
    text: "🎅 Santa",
    font: "14px sans-serif",
    fillColor: Cesium.Color.WHITE,
    pixelOffset: new Cesium.Cartesian2(0, -20),
  },
});

// Optional flight path
viewer.entities.add({
  polyline: {
    positions: santaPath,
    width: 2,
    material: Cesium.Color.RED.withAlpha(0.5),
  },
});

viewer.trackedEntity = santa;

// ----------------------------
// Clock (24-hour real-time run)
// ----------------------------
viewer.clock.startTime = startTime.clone();
viewer.clock.stopTime = Cesium.JulianDate.addSeconds(
  startTime,
  TOTAL_DURATION_SECONDS,
  new Cesium.JulianDate()
);
viewer.clock.currentTime = startTime.clone();
viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
viewer.clock.multiplier = 1; // REAL TIME (24 hours)

let lastModeSwitch = 0;
let cinematicMode = "WIDE";

viewer.scene.postRender.addEventListener(() => {
  const time = viewer.clock.currentTime;
  const position = santa.position.getValue(time);
  if (!position) return;

  const camera = viewer.camera;

  // Switch camera style every ~45 seconds
  const seconds = Cesium.JulianDate.secondsDifference(time, viewer.clock.startTime);
  if (seconds - lastModeSwitch > 45) {
    cinematicMode = cinematicMode === "WIDE" ? "CLOSE" : "WIDE";
    lastModeSwitch = seconds;
  }

  // Convert Santa position
  const carto = Cesium.Cartographic.fromCartesian(position);
  const height = carto.height;

  let distance;
  let offset;

  if (cinematicMode === "WIDE") {
    // 🌍 Epic globe shot
    distance = Cesium.Math.clamp(height * 10, 3_000_000, 8_000_000);
    offset = new Cesium.Cartesian3(
      -distance * 0.8,
      distance * 0.4,
      distance * 0.6
    );
  } else {
    // 🎅 Close tracking shot
    distance = Cesium.Math.clamp(height * 4, 800_000, 2_500_000);
    offset = new Cesium.Cartesian3(
      -distance,
      0,
      distance * 0.3
    );
  }

  // Smooth camera movement
  camera.lookAt(
    position,
    Cesium.Cartesian3.lerp(
      camera.positionWC,
      offset,
      0.03,
      new Cesium.Cartesian3()
    )
  );
});

let driftAngle = 0;

viewer.scene.postRender.addEventListener(() => {
  driftAngle += 0.0005;

  const camera = viewer.camera;
  camera.roll = Math.sin(driftAngle) * 0.002;
});



