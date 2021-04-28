// dash.js https://github.com/Dash-Industry-Forum/dash.js

// Load video by Javascript
// DOM
const video = document.getElementById("video");
const bufferLevel = document.getElementById("bufferLevel");
const framerate = document.getElementById("framerate");
const reportedBitrate = document.getElementById("reportedBitrate");
const calculatedBitrate = document.getElementById("calculatedBitrate");
const tracePanel = document.getElementById("trace");

const url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
const settings = {
  debug: {
    // logLevel: dashjs.Debug.LOG_LEVEL_DEBUG,
  },
  streaming: {
    scheduleWhilePaused: false /* stops the player from loading segments while paused */,
    fastSwitchEnabled: true /* enables buffer replacement when switching bitrates for faster switching */,
    cmcd: {
      enabled: true /* enable reporting of cmcd parameters */,
      sid:
        "b248658d-1d1a-4039-91d0-8c08ba597da5" /* session id send with each request */,
      cid:
        "21cf726cfe3d937b5f974f72bb5bd06a" /* content id send with each request */,
      mode: "query",
    },
  },
};
let player, eventPoller, bitrateCalculator, lastDecodedByteCount, version;

function init() {
  player = dashjs.MediaPlayer().create();
  version = player.getVersion();

  player.on(
    dashjs.MetricsReporting.events.CMCD_DATA_GENERATED,
    handleCmcdDataGeneratedEvent
  );

  player.registerCustomCapabilitiesFilter(filterCapabilities);

  /* Extend RequestModifier class and implement our own behaviour */
  player.extend("RequestModifier", function () {
    return {
      modifyRequestHeader: function (xhr) {
        /* Add custom header. Requires to set up Access-Control-Allow-Headers in your */
        /* response header in the server side. Reference: */
        /* https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader */
        /* xhr.setRequestHeader('DASH-CUSTOM-HEADER', 'MyValue'); */
        return xhr;
      },
      modifyRequestURL: function (url) {
        /* Modify url adding a custom query string parameter */
        return url + "?customQuery=value";
      },
    };
  });

  player.on(dashjs.MediaPlayer.events.PLAYBACK_NOT_ALLOWED, function (data) {
    video.muted = true;
  });

  player.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, function (data) {
    video.muted = false;
  });

  player.initialize(video, url, true);
  player.updateSettings(settings);
  player.preload();
  player.setTextDefaultEnabled(true);

  player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, function () {
    clearInterval(eventPoller);
    clearInterval(bitrateCalculator);
  });

  eventPoller = setInterval(updateStats, 500);

  if (video.webkitVideoDecodedByteCount !== undefined) {
    lastDecodedByteCount = 0;
    const bitrateInterval = 5;
    bitrateCalculator = setInterval(function () {
      const _calculatedBitrate =
        (((video.webkitVideoDecodedByteCount - lastDecodedByteCount) / 1000) *
          8) /
        bitrateInterval;

      calculatedBitrate.innerText = Math.round(_calculatedBitrate) + " Kbps";
      lastDecodedByteCount = video.webkitVideoDecodedByteCount;
    }, bitrateInterval * 1000);
  } else {
    document.getElementById("chrome-only").style.display = "none";
  }
}

function updateStats() {
  // const buffer = player.getBufferLength();
  // stats.innerHTML = buffer;

  const streamInfo = player.getActiveStream().getStreamInfo();
  const dashMetrics = player.getDashMetrics();
  const dashAdapter = player.getDashAdapter();

  if (dashMetrics && streamInfo) {
    const periodIdx = streamInfo.index;
    const repSwitch = dashMetrics.getCurrentRepresentationSwitch("video", true);
    const _bufferLevel = dashMetrics.getCurrentBufferLevel("video", true);
    const bitrate = repSwitch
      ? Math.round(
          dashAdapter.getBandwidthForRepresentation(repSwitch.to, periodIdx) /
            1000
        )
      : NaN;
    const adaptation = dashAdapter.getAdaptationForType(
      periodIdx,
      "video",
      streamInfo
    );
    const _frameRate = adaptation.Representation_asArray.find(function (rep) {
      return rep.id === repSwitch.to;
    })?.frameRate;
    bufferLevel.innerText = _bufferLevel + " secs";
    framerate.innerText = _frameRate + " fps";
    reportedBitrate.innerText = bitrate + " Kbps";
  }
}

function handleCmcdDataGeneratedEvent(event) {
  log("type: " + event.mediaType);
  log("file: " + event.url.split("/").pop());
  var keys = Object.keys(event.cmcdData);
  keys = keys.sort();
  for (var key of keys) {
    log(key.padEnd(4) + ": " + event.cmcdData[key]);
  }
  log("");
}

function log(msg) {
  msg =
    msg.length > 200
      ? msg.substring(0, 200) + "..."
      : msg; /* to avoid repeated wrapping with large objects */

  tracePanel.innerHTML += msg + "\n";
  tracePanel.scrollTop = tracePanel.scrollHeight;
  // console.log(msg);
}

function filterCapabilities(representation) {
  console.log(
    "Representation ",
    representation.mimeType,
    representation.height
  );
  /* Filter representations based on certain attributes like the resolution. Return false to filter specific representation */
  if (representation.mimeType === "video/mp4") {
    return representation.height <= 720;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", init);
