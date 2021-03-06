define("handy/iscroll/1.0.0/iscroll", ["$"], function (t) {
    var i = t("$"), s = i.support, e = function (t, s) {
        var o = e.utils;
        this.wrapper = i(t).get(0), this.enabled = !0, o.addEvent(window, "orientationchange", this), o.addEvent(window, "resize", this), o.addEvent(this.wrapper, o.events.START, this), this.reset(s)
    };
    return e.utils = function () {
        function t(t) {
            return "" === h ? t.toLowerCase() : h + t
        }

        function i(t, i, s, e) {
            t.addEventListener(i, s, !!e)
        }

        function e(t, i, s, e) {
            t.removeEventListener(i, s, !!e)
        }

        function o(t) {
            var i, s, e = getComputedStyle(t, null);
            return e = e[c.transform].split(")")[0].split(", "), i = +(e[12] || e[4]), s = +(e[13] || e[5]), {
                x: i,
                y: s
            }
        }

        function r(t, i, s, e, o) {
            var r, n, h = t - i, a = Math.abs(h) / s, l = 9e-4;
            return r = t + a * a / (2 * l) * (0 > h ? -1 : 1), n = a / l, e > r ? (r = o ? e - o / 2 * (a / 10) : e, h = Math.abs(r - t), n = h / a) : r > 0 && (r = o ? o / 2 * (a / 10) : 0, h = Math.abs(t) + r, n = h / a), {
                destination: Math.round(r),
                duration: n
            }
        }

        var n = Date.now, h = s.vendor, a = t("Transform"), l = {
            transform: s.transform,
            trans3d: s.trans3d,
            touch: s.touch,
            pointer: s.pointer,
            transition: s.transition
        }, c = {
            transform: a,
            transitionTimingFunction: t("TransitionTimingFunction"),
            transitionDuration: t("TransitionDuration"),
            translateZ: l.trans3d ? " translateZ(0)" : ""
        }, d = {startX: 0, startY: 0, scrollX: !0, scrollY: !0, lockDirection: !0, overshoot: !0, momentum: !0}, p = {};
        return p = l.touch ? {
            START: "touchstart",
            MOVE: "touchmove",
            END: "touchend",
            CANCEL: "touchcancel"
        } : l.pointer ? {
            START: "MSPointerDown",
            MOVE: "MSPointerMove",
            END: "MSPointerUp",
            CANCEL: "MSPointerCancel"
        } : {
            START: "mousedown",
            MOVE: "mousemove",
            END: "mouseup",
            CANCEL: "mousecancel"
        }, p.TRANSITIONEND = function () {
            switch (h) {
                case"webkit":
                    return "webkitTransitionEnd";
                case"O":
                    return "oTransitionEnd";
                default:
                    return "transitionend"
            }
        }(), {
            events: p,
            options: d,
            getTime: n,
            has: l,
            style: c,
            addEvent: i,
            removeEvent: e,
            getComputedPosition: o,
            momentum: r
        }
    }(), e.prototype.handleEvent = function (t) {
        var i = e.utils.events;
        switch (t.type) {
            case i.START:
                this._start(t);
                break;
            case i.MOVE:
                this._move(t);
                break;
            case i.END:
            case i.CANCEL:
                this._end(t);
                break;
            case"orientationchange":
            case"resize":
                this._resize();
                break;
            case i.TRANSITIONEND:
                this._transitionEnd(t)
        }
    }, e.prototype.reset = function (t) {
        var o = e.utils, r = o.events;
        this.scroller && o.removeEvent(this.scroller, r.TRANSITIONEND, this), this.options = i.extend({}, o.options, t), this.scroller = i(this.options.scroller, this.wrapper).get(0), this.scrollerStyle = this.scroller.style, s.transition && (this.scrollerStyle[o.style.transitionTimingFunction] = "cubic-bezier(0.33,0.66,0.66,1)"), this.refresh(), this.scrollTo(this.options.startX, this.options.startY, 0), o.addEvent(this.scroller, r.TRANSITIONEND, this)
    }, e.prototype.refresh = function () {
        this.wrapper.offsetHeight, this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = Math.round(this.scroller.offsetWidth), this.scrollerHeight = Math.round(this.scroller.offsetHeight), this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && 0 > this.maxScrollX, this.hasVerticalScroll = this.options.scrollY && 0 > this.maxScrollY
    }, e.prototype.resetPosition = function (t) {
        if (0 >= this.x && this.x >= this.maxScrollX && 0 >= this.y && this.y >= this.maxScrollY)return !1;
        var i = this.x, s = this.y;
        return t = t || 0, !this.hasHorizontalScroll || this.x > 0 ? i = 0 : this.x < this.maxScrollX && (i = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? s = 0 : this.y < this.maxScrollY && (s = this.maxScrollY), this.scrollTo(i, s, t), !0
    }, e.prototype.scrollBy = function (t, i, s) {
        t = this.x + t, i = this.y + i, s = s || 0, this.scrollTo(t, i, s)
    }, e.prototype.scrollTo = function (t, i, s) {
        this._transitionTime(s), this._translate(t, i)
    }, e.prototype.destory = function () {
        var t = e.utils, i = t.events;
        t.removeEvent(window, "orientationchange", this), t.removeEvent(window, "resize", this), t.removeEvent(this.wrapper, i.START, this), t.removeEvent(window, i.MOVE, this), t.removeEvent(window, i.END, this), t.removeEvent(window, i.CANCEL, this), t.removeEvent(this.scroller, i.TRANSITIONEND, this)
    }, e.prototype.enable = function () {
        this.enabled = !0
    }, e.prototype.disable = function () {
        this.enabled = !1
    }, e.prototype._resize = function () {
        this.refresh(), this.resetPosition()
    }, e.prototype._start = function (t) {
        if (this.enabled && (!this.initiated || t.type == this.initiated) && 0 !== i(t.target).closest(this.options.scroller).length) {
            var s, o = e.utils, r = o.events, n = t.touches ? t.touches[0] : t;
            this.initiated = t.type, this.moved = !1, this.distX = 0, this.distY = 0, this.directionLocked = 0, this.refresh(), this._transitionTime(), this.isAnimating = !1, this.options.momentum && (s = e.utils.getComputedPosition(this.scroller), (s.x != this.x || s.y != this.y) && this._translate(s.x, s.y)), this.startX = this.x, this.startY = this.y, this.pointX = n.pageX, this.pointY = n.pageY, this.startTime = o.getTime(), o.addEvent(window, r.MOVE, this), o.addEvent(window, r.END, this), o.addEvent(window, r.CANCEL, this)
        }
    }, e.prototype._move = function (t) {
        if (this.enabled && this.initiated) {
            var i, s, o, r, n = t.touches ? t.touches[0] : t, h = this.hasHorizontalScroll ? n.pageX - this.pointX : 0, a = this.hasVerticalScroll ? n.pageY - this.pointY : 0, l = e.utils.getTime();
            this.pointX = n.pageX, this.pointY = n.pageY, this.distX += h, this.distY += a, o = Math.abs(this.distX), r = Math.abs(this.distY), 10 > o && 10 > r || (!this.directionLocked && this.options.lockDirection && (this.directionLocked = o > r + 5 ? "h" : r > o + 5 ? "v" : "n"), "h" == this.directionLocked ? a = 0 : "v" == this.directionLocked && (h = 0), i = this.x + h, s = this.y + a, (i > 0 || this.maxScrollX > i) && (i = this.options.overshoot ? this.x + h / 3 : i > 0 ? 0 : this.maxScrollX), (s > 0 || this.maxScrollY > s) && (s = this.options.overshoot ? this.y + a / 3 : s > 0 ? 0 : this.maxScrollY), this.moved = !0, l - this.startTime > 300 && (this.startTime = l, this.startX = this.x, this.startY = this.y), this._translate(i, s))
        }
    }, e.prototype._end = function (t) {
        if (this.enabled && this.initiated) {
            var i, s, o, r = e.utils, n = r.events, h = (t.changedTouches ? t.changedTouches[0] : t, r.getTime() - this.startTime), a = Math.round(this.x), l = Math.round(this.y);
            this.initiated = !1, r.removeEvent(window, n.MOVE, this), r.removeEvent(window, n.END, this), r.removeEvent(window, n.CANCEL, this), this.resetPosition(300) || this.moved && (this.options.momentum && 300 > h && (i = this.hasHorizontalScroll ? e.utils.momentum(this.x, this.startX, h, this.maxScrollX, this.options.overshoot ? this.wrapperWidth : 0) : {
                destination: a,
                duration: 0
            }, s = this.hasVerticalScroll ? e.utils.momentum(this.y, this.startY, h, this.maxScrollY, this.options.overshoot ? this.wrapperHeight : 0) : {
                destination: l,
                duration: 0
            }, a = i.destination, l = s.destination, o = Math.max(i.duration, s.duration)), (a != this.x || l != this.y) && this.scrollTo(a, l, o))
        }
    }, e.prototype._translate = function (t, i) {
        this.scrollerStyle[e.utils.style.transform] = "translate(" + t + "px," + i + "px)" + e.utils.style.translateZ, this.x = t, this.y = i
    }, e.prototype._transitionEnd = function (t) {
        t.target == this.scroller && (this._transitionTime(0), this.resetPosition(435))
    }, e.prototype._transitionTime = function (t) {
        t = t || 0, this.scrollerStyle[e.utils.style.transitionDuration] = t + "ms"
    }, e
});