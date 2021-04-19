const myplayer = document.getElementById("myplayer");
const video = document.getElementById("video");
const controls = document.getElementById("controls");
const playerPlay = document.getElementById("player-play");
const dataSkip = myplayer.querySelectorAll("[data-skip]");
const ranges = myplayer.querySelectorAll(".player-sound");
const fullscreen = myplayer.querySelector(".fullscreen");

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
// 監聽
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
playerPlay.addEventListener("click", togglePlay);
fullscreen.addEventListener("click", toggleScreen);
dataSkip.forEach((button) => button.addEventListener("click", skip));
ranges.forEach((range) => {
  range.addEventListener("input", handleRangeUpdate);
});
