// 🔑 PASTE YOUR CESIUM TOKEN HERE
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjEyOGQ2Mi1jMGUwLTRhNmMtYThhZi1lYTcyMzAwYWFiMDYiLCJpZCI6MTIxODQ5LCJpYXQiOjE2NzQxNjE4MDh9.-_OgfjufhglZ0BdQkgwdlNqABiJNfe61EzpscAFljBE";

const viewer = new Cesium.Viewer("cesiumContainer", {
  timeline: false,
  animation: false,
  baseLayerPicker: false,
});

// Santa starting position (North Pole)
let latitude = 90;
let longitude = 0;
let gifts = 0;

// Santa entity
const santa = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 300000),
  billboard: {
    image: "assets/santa.png",
    width: 64,
    height: 64,
  },
  label: {
    text: "🎅 Santa",
    font: "14px sans-serif",
    pixelOffset: new Cesium.Cartesian2(0, -40),
    fillColor: Cesium.Color.WHITE,
  },
});

viewer.trackedEntity = santa;

// Fake flight path (demo)
function moveSanta() {
  longitude += 10;
  latitude -= 5;

  if (latitude < -60) latitude = 60;
  if (longitude > 180) longitude = -180;

  santa.position = Cesium.Cartesian3.fromDegrees(
    longitude,
    latitude,
    300000
  );

  gifts += Math.floor(Math.random() * 50000);

  document.getElementById("location").innerText =
    `Lat ${latitude.toFixed(1)}, Lon ${longitude.toFixed(1)}`;
  document.getElementById("gifts").innerText = gifts.toLocaleString();
}

setInterval(moveSanta, 3000);
