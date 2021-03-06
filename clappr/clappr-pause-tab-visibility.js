!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e(require("Clappr")))
    : "function" == typeof define && define.amd
    ? define(["Clappr"], e)
    : "object" == typeof exports
    ? (exports.ClapprPauseTabVisibility = e(require("Clappr")))
    : (t.ClapprPauseTabVisibility = e(t.Clappr));
})(this, function (t) {
  return (function (t) {
    function e(n) {
      if (i[n]) return i[n].exports;
      var r = (i[n] = { exports: {}, id: n, loaded: !1 });
      return t[n].call(r.exports, r, r.exports, e), (r.loaded = !0), r.exports;
    }
    var i = {};
    return (e.m = t), (e.c = i), (e.p = ""), e(0);
  })([
    function (t, e, i) {
      "use strict";
      function n(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      function r(t, e) {
        if ("function" != typeof e && null !== e)
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof e
          );
        (t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          e &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(t, e)
              : (t.__proto__ = e));
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var o = (function () {
          function t(t, e) {
            var i = [],
              n = !0,
              r = !1,
              o = void 0;
            try {
              for (
                var u, a = t[Symbol.iterator]();
                !(n = (u = a.next()).done) &&
                (i.push(u.value), !e || i.length !== e);
                n = !0
              );
            } catch (l) {
              (r = !0), (o = l);
            } finally {
              try {
                !n && a["return"] && a["return"]();
              } finally {
                if (r) throw o;
              }
            }
            return i;
          }
          return function (e, i) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, i);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          };
        })(),
        u = (function () {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              (n.enumerable = n.enumerable || !1),
                (n.configurable = !0),
                "value" in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n);
            }
          }
          return function (e, i, n) {
            return i && t(e.prototype, i), n && t(e, n), e;
          };
        })(),
        a = function (t, e, i) {
          for (var n = !0; n; ) {
            var r = t,
              o = e,
              u = i;
            (n = !1), null === r && (r = Function.prototype);
            var a = Object.getOwnPropertyDescriptor(r, o);
            if (void 0 !== a) {
              if ("value" in a) return a.value;
              var l = a.get;
              if (void 0 === l) return;
              return l.call(u);
            }
            var s = Object.getPrototypeOf(r);
            if (null === s) return;
            (t = s), (e = o), (i = u), (n = !0), (a = s = void 0);
          }
        },
        l = i(1),
        s = (function (t) {
          function e() {
            n(this, e),
              a(Object.getPrototypeOf(e.prototype), "constructor", this).apply(
                this,
                arguments
              );
          }
          return (
            r(e, t),
            u(e, [
              {
                key: "bindEvents",
                value: function () {
                  var t = this,
                    e = this.resoleVisibilityAPI(),
                    i = o(e, 2),
                    n = i[0],
                    r = i[1];
                  (this.visibilityEvent = r),
                    (this.originalTitle = document.title),
                    (this.onVisibilityChange = function () {
                      return t.togglePauseResume(n);
                    }),
                    document.addEventListener(
                      this.visibilityEvent,
                      this.onVisibilityChange
                    );
                },
              },
              {
                key: "resoleVisibilityAPI",
                value: function () {
                  var t = [],
                    e = [
                      "hidden",
                      "webkithidden",
                      "mozhidden",
                      "mshidden",
                      "ohidden",
                    ],
                    i = [
                      "visibilitychange",
                      "webkitvisibilitychange",
                      "mozvisibilitychange",
                      "msvisibility",
                      "ovisibility",
                    ];
                  return (
                    e.forEach(function (e, n) {
                      e in document && (t.push(e), t.push(i[n]));
                    }),
                    t
                  );
                },
              },
              {
                key: "togglePauseResume",
                value: function (t) {
                  var e = document[t] ? "pause" : "play";
                  t && this[e]();
                },
              },
              {
                key: "play",
                value: function () {
                  this.container.play(),
                    this.options.visibilityEnableIcon &&
                      (document.title = this.originalTitle);
                },
              },
              {
                key: "pause",
                value: function () {
                  this.container.pause(),
                    this.options.visibilityEnableIcon &&
                      (document.title = "???  " + this.originalTitle);
                },
              },
              {
                key: "stopListening",
                value: function () {
                  document.removeEventListener(
                    this.visibilityEvent,
                    this.onVisibilityChange
                  );
                },
              },
              {
                key: "name",
                get: function () {
                  return "clappr_pause_tab_visibility";
                },
              },
            ]),
            e
          );
        })(l.ContainerPlugin);
      (e["default"] = s), (t.exports = e["default"]);
    },
    function (e, i) {
      e.exports = t;
    },
  ]);
});
