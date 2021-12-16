const button = document.getElementById("button");
const DOM = {
  audio: document.getElementById("audio"),
  video: document.getElementById("video"),
};

const src = DOM.video;

window.onload = async function () {
  console.log(src);
  try {
    await src.play();
  } catch (err) {
    console.log(err);
  }
};

video.ontimeupdate = function handlePlaying() {
  const percent = (src.currentTime / src.duration) * 100;
  console.log(percent);
};

button.addEventListener("click", () => {
  src.muted = !src.muted;
  button.innerText = src.muted ? "Unmuted" : "Muted";
});
