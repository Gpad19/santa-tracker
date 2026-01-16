Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjEyOGQ2Mi1jMGUwLTRhNmMtYThhZi1lYTcyMzAwYWFiMDYiLCJpZCI6MTIxODQ5LCJpYXQiOjE2NzQxNjE4MDh9.-_OgfjufhglZ0BdQkgwdlNqABiJNfe61EzpscAFljBE";

const viewer = new Cesium.Viewer("cesiumContainer", {
  timeline: false,
  animation: false,
  baseLayerPicker: false,
  shouldAnimate: true,
});

// Santa position path
const santaPath = new Cesium.SampledPositionProperty();
const start = Cesium.JulianDate.now();

// Starting point (North Pole)
let lat = 90;
let lon = 0;
const height = 300000;

for (let i = 0; i <= 72; i++) {
  const time = Cesium.JulianDate.addSeconds(
    start,
    i * 10,
    new Cesium.JulianDate()
  );

  lon += 5;
  lat -= 2;

  if (lon > 180) lon = -180;
  if (lat < -60) lat = 60;

  santaPath.addSample(
    time,
    Cesium.Cartesian3.fromDegrees(lon, lat, height)
  );
}

// Santa entity as a red dot
const santa = viewer.entities.add({
  position: santaPath,
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 1,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
});

// Optional flight path line
viewer.entities.add({
  polyline: {
    positions: santaPath,
    width: 2,
    material: Cesium.Color.RED.withAlpha(0.6),
  },
});

viewer.trackedEntity = santa;

// Clock setup
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = Cesium.JulianDate.addSeconds(start, 720, new Cesium.JulianDate());
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 1;
