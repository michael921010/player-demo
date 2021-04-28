// dash.js https://github.com/Dash-Industry-Forum/dash.js

// Load video by Html
let player;
const video = document.getElementById("video");
const stats = document.getElementById("stats");

function init() {
  player = dashjs.MediaPlayerFactory.create(video);
  player.setTextDefaultEnabled(true);

  setInterval(updateStats, 500);
}

function updateStats() {
  const buffer = player.getBufferLength();
  stats.innerHTML = "Buffer level " + buffer + "s";
}

document.addEventListener("DOMContentLoaded", init);
