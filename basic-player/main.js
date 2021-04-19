const myplayer = document.getElementById("myplayer");
const video = document.getElementById("video");
const controls = document.getElementById("controls");
const playerPlay = document.getElementById("player-play");
const dataSkip = myplayer.querySelectorAll("[data-skip]");
const ranges = myplayer.querySelectorAll(".player-sound");
const fullscreen = myplayer.querySelector(".fullscreen");
const duration = myplayer.querySelector(".duration");
const realTime = myplayer.querySelector(".real-time");

// 切換播放, 暫停
function togglePlay(e) {
  video[video.paused ? "play" : "pause"]();
}
// 全螢幕
function toggleScreen() {
  if (!document.webkitFullscreenElement) {
    myplayer.webkitRequestFullScreen();
  } else {
    document.webkitExitFullscreen();
  }
}
// 快進
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// 音量
function handleRangeUpdate() {
  video[this.name] = Number(this.value);
}

// 更新播放按鈕ICON
function updateButton() {
  const icon = this.paused ? "►" : "❚❚";
  playerPlay.textContent = icon;
}

function setRealTime(percent) {
  realTime.style.width = percent + "%";
}

function handlePlaying() {
  const percent = (video.currentTime / video.duration) * 100;
  setRealTime(percent);
}

function handleDuration(event) {
  const { right, left } = duration.getBoundingClientRect();
  const { clientX } = event;
  const ratiol = (clientX - left) / (right - left); // [0, 1]
  const percent = ratiol * 100;

  video.currentTime = video.duration * ratiol;
  setRealTime(percent);
}

// 監聽
video.onclick = togglePlay;
video.onplay = updateButton;
video.onpause = updateButton;
video.ontimeupdate = handlePlaying;

duration.onclick = handleDuration;
playerPlay.onclick = togglePlay;
fullscreen.onclick = toggleScreen;
dataSkip.forEach((button) => (button.onclick = skip));
ranges.forEach((range) => {
  range.addEventListener("input", handleRangeUpdate);
});
