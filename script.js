let gifts = 0;

function updateSanta() {
  gifts += Math.floor(Math.random() * 1000);

  document.getElementById("location").innerText =
    "Flying over the North Pole ❄️";

  document.getElementById("gifts").innerText = gifts;
}

function updateCountdown() {
  const christmas = new Date(new Date().getFullYear(), 11, 25);
  const now = new Date();
  const diff = christmas - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  document.getElementById("time").innerText =
    hours > 0 ? `${hours} hours` : "🎄 Merry Christmas!";
}

setInterval(updateSanta, 3000);
setInterval(updateCountdown, 1000);

