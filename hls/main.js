// hls.js https://github.com/video-dev/hls.js

const url = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const video = document.getElementById("video");

// First check for native browser HLS support
if (video.canPlayType("application/vnd.apple.mpegurl")) {
  video.src = url;
  // If no native HLS support, check if hls.js is supported
} else if (Hls.isSupported()) {
  // special playlist post processing function
  function process(playlist) {
    return playlist;
  }

  class pLoader extends Hls.DefaultConfig.loader {
    constructor(config) {
      super(config);
      const loader = new Hls.DefaultConfig.loader(config);

      this.abort = () => loader.abort();
      this.destroy = () => loader.destroy();

      const _load = this.load.bind(this);
      this.load = function (context, config, callbacks) {
        if (context.type == "manifest") {
          const _onSuccess = callbacks.onSuccess;
          callbacks.onSuccess = function (response, stats, context) {
            response.data = process(response.data);
            _onSuccess(response, stats, context);
          };
        }
        _load(context, config, callbacks);
      };
    }
  }

  // config source: https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
  const config = {
    debug: !true,
  };

  const hls = new Hls({ pLoader, ...config });
  hls.attachMedia(video);

  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    hls.loadSource(url);
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      //
    });
  });

  hls.on(Hls.Events.ERROR, function (event, data) {
    const { type, details, fatal } = data;

    if (fatal) {
      switch (type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
          console.log("fatal network error encountered, try to recover");
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log("fatal media error encountered, try to recover");
          hls.recoverMediaError();
          break;
        default:
          // cannot recover
          hls.destroy();
          break;
      }
    }
  });

  function onLevelLoaded(event, data) {
    const duration = data.details.totalduration;
  }
  // subscribe event
  hls.on(Hls.Events.LEVEL_LOADED, onLevelLoaded);
  // unsubscribe event
  hls.off(Hls.Events.LEVEL_LOADED, onLevelLoaded);
  // subscribe for a single event call only
  hls.once(Hls.Events.LEVEL_LOADED, onLevelLoaded);
}
