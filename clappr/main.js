const playerDOM = document.getElementById("player");
const urls = {
  mp4: {
    fatal: "https://example.mp4",
    right:
      "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4",
  },
  hls: {
    right: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  dash: {
    right: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
  },
};

let player;

const ErrorPlugin = Clappr.ContainerPlugin.extend({
  name: "error_plugin",
  background:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAFoBAMAAAA1HFdiAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEX5+fn//wAA//8A/wD/AP//AAAAAP8XFxf///8H5gWfAAAAAWJLR0QIht6VegAAAAd0SU1FB98IBRIsAXmGk48AAAI5SURBVHja7dJBDYBADADBs4AFLGABC1iohbOPhv1BMvu+NLlp10odqTN1pe7Uk5pQ8wMIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDA/wKWxzM71T7ZZrfltNnppgACBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAL8B+ALjSfYzPnmdzgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wOC0wNVQxODo0NDowMSswMTowMCL95a4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTUtMDgtMDVUMTg6NDQ6MDErMDE6MDBToF0SAAAAAElFTkSuQmCC",
  bindEvents: function () {
    this.listenTo(this.container, Clappr.Events.CONTAINER_ERROR, this.onError);
  },
  hide: function () {
    this._err && this._err.remove();
  },
  show: function () {
    const $ = Clappr.$;
    this.hide();
    const txt =
      this.options.errorPlugin && this.options.errorPlugin.text
        ? this.options.errorPlugin.text
        : "A fatal error occured.";
    this._err = $("<div>")
      .css({
        position: "absolute",
        "z-index": "999",
        width: "100%",
        height: "100%",
        "background-image": "url(" + this.background + ")",
        "background-size": "contain",
        "background-repeat": "no-repeat",
        "padding-top": "15%",
        "text-align": "center",
        "font-weight": "bold",
        "text-shadow": "1px 1px #fff",
      })
      .append(
        $("<h2>").text(txt).css({
          "font-size": "200%",
        })
      )
      .append(
        $("<p>")
          .html('Retrying in <span class="retry-counter">5</span> seconds ...')
          .css({
            "font-size": "120%",
            margin: "15px",
          })
      );
    this.container && this.container.$el.prepend(this._err);
  },
  onError: function (e) {
    if (!this.container) return;
    this.show();
    this.container.getPlugin("click_to_pause").disable();
    let tid,
      t = 5,
      retry = function () {
        clearTimeout(tid);
        if (t === 0) {
          this.container.getPlugin("click_to_pause").enable();
          if (this.options.errorPlugin && this.options.errorPlugin.onRetry) {
            this.options.errorPlugin.onRetry(e);
            return;
          } else {
            this.container.stop();
            this.container.play();
            return;
          }
        }
        $(".retry-counter").text(t);
        t--;
        tid = setTimeout(retry, 1000);
      }.bind(this);
    retry();
  },
});

const configs = {
  disableErrorScreen: true, // Disable the internal error screen plugin
  poster:
    "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
  source: urls.hls.right,
  plugins: [
    ErrorPlugin,
    ClapprStats,
    HlsjsPlayback,
    DashShakaPlayback,
    PlaybackRatePlugin,
    QueuePlugin,
    ClapprMarkersPlugin,
    ClapprNerdStats,
    ClapprStats,
    ClapprPauseTabVisibility,
    ContextMenuPlugin,
  ],
  // https://github.com/video-dev/hls.js/blob/master/docs/API.md
  hlsjsConfig: {
    autoStartLoad: true,
  },
  // https://github.com/clappr/dash-shaka-playback#usage
  shakaConfiguration: {
    preferredAudioLanguage: "pt-BR",
    streaming: {
      rebufferingGoal: 15,
    },
  },
  shakaOnBeforeLoad: function (shaka_player) {
    // shaka_player.getNetworkingEngine().registerRequestFilter() ...
  },
  playbackRateConfig: {
    defaultValue: 1,
    options: [
      { value: 0.5, label: "0.5x" },
      { value: 1, label: "1x" },
      { value: 2, label: "2x" },
    ],
    // rateSuffix: 'x',
  },
  // https://github.com/joaopaulovieira/clappr-queue-plugin#configuration
  queue: {
    nextVideos: [urls.hls.right, urls.mp4.fatal],
    autoPlayNextVideo: true,
  },
  // https://github.com/bikegriffith/clappr-playback-rate-plugin#getting-started
  markersPlugin: {
    markers: [
      new ClapprMarkersPlugin.StandardMarker(55, "Oh! Good mornig!"),
      new ClapprMarkersPlugin.StandardMarker(197, "Hey! Be dangers!"),
      new ClapprMarkersPlugin.StandardMarker(388, "What are you looking for?"),
    ],
    tooltipBottomMargin: 17, // optional
  },
  // https://github.com/lucasrodcosta/clappr-nerd-stats#usage
  clapprNerdStats: {
    // Optional: provide multiple combination of keyboard shortcuts to show/hide the statistics.
    // For reference, visit: https://github.com/ccampbell/mousetrap.
    // Default: ['command+shift+s', 'ctrl+shift+s']
    shortcut: ["command+shift+s", "ctrl+shift+s"],

    // Optional: position of the icon to show/hide the statistics.
    // Values: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'none'
    // Default: 'top-right'
    iconPosition: "top-right",
  },
  errorPlugin: {
    // text: 'My custom error message.',
    onRetry: function (e) {
      // simulate successful recovery
      // or decide here what to do between each retry
      player.configure({
        source: urls.mp4.right,
        autoPlay: true,
      });
    },
  },
  clapprStats: {
    // optional: time in miliseconds for each report.
    // default: 5000
    runEach: 10 * 1000,
    // optional: callback function.
    // default: console.log
    onReport: (metrics) => {
      const { extra } = metrics;
      console.log(
        "[Report] ",
        "time: ",
        extra.currentTime / 1000,
        "percentage: ",
        extra.watchedPercentage
      );
    },
    // Fire PERCENTAGE_EVENT when video complete some percentage.
    // default: []
    onCompletion: [0, 25, 50, 75, 100],
    // optional: number of reports between two consecutive bandwidth tests.
    // default: 10
    runBandwidthTestEvery: 10,
  },
  // https://github.com/joaopaulovieira/clappr-context-menu-plugin#configuration
  contextMenu: {
    menuItems: [`copyURL`, `copyURLCurrentTime`, `loop`, `playerVersion`],
    // extraOptions: [
    //   {
    //     name: "test",
    //     label: "Test Label",
    //     //optional
    //     callback: function () {
    //       console.log("A absolutely awesome extra context menu item action");
    //     },
    //   },
    // ],
    customStyle: {
      container: {
        display: "block",
      },
      list: {
        "background-color": "gray",
      },
      items: {
        color: "yellow",
      },
    },
  },
  autoPlay: true,
  mute: false,
  persistConfig: true,
  width: 1024,
  height: 600,
  // https://github.com/leandromoreira/clappr-pause-tab-visibility#usage
  // This will pause when you leave and resume after come back.
  visibilityEnableIcon: true,
  events: { onReady, onPause },
};

function onReady() {}
function onPause() {}

player = new Clappr.Player(configs);

player.attachTo(playerDOM);

function init() {
  player.play();
}

window.onload = init;
