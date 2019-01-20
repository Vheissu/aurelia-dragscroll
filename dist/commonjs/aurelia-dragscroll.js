"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_templating_1 = require("aurelia-templating");
// Ported from https://github.com/donmbelembe/vue-dragscroll
var POINTER_START_EVENTS = ['mousedown', 'touchstart'];
var POINTER_MOVE_EVENTS = ['mousemove', 'touchmove'];
var POINTER_END_EVENTS = ['mouseup', 'touchend'];
var DragScroll = /** @class */ (function () {
    function DragScroll(element) {
        var _this = this;
        this.element = element;
        this.noChildDrag = false;
        this.firstChildDrag = false;
        this.isDragging = false;
        this.isClick = false;
        this.md = function (e) {
            e.preventDefault();
            var isMouseEvent = e instanceof window.MouseEvent;
            // The coordinates of the mouse pointer compared to the page when the mouse button is clicked on an element
            var pageX = isMouseEvent ? e.pageX : e.touches[0].pageX;
            var pageY = isMouseEvent ? e.pageY : e.touches[0].pageY;
            var clickedElement = document.elementFromPoint(pageX - window.pageXOffset, pageY - window.pageYOffset);
            var hasNoChildDrag = _this.noChildDrag;
            var hasFirstChildDrag = _this.firstChildDrag;
            var isEl = clickedElement === _this.element;
            var isFirstChild = clickedElement === _this.element.firstChild;
            var isDataDraggable = hasNoChildDrag ? typeof clickedElement.dataset.dragscroll !== 'undefined' : typeof clickedElement.dataset.noDragscroll === 'undefined';
            if (!isEl && (!isDataDraggable || (hasFirstChildDrag && !isFirstChild))) {
                return;
            }
            _this.pushed = 1;
            // The coordinates of the mouse pointer compared to the viewport when the mouse button is clicked on an element
            _this.lastClientX = isMouseEvent ? e.clientX : e.touches[0].clientX;
            _this.lastClientY = isMouseEvent ? e.clientY : e.touches[0].clientY;
            if (e.type === 'touchstart') {
                _this.isClick = true;
            }
        };
        this.mu = function (e) {
            _this.pushed = 0;
            if (_this.isDragging) {
                _this.element.dispatchEvent(new CustomEvent('dragscrollend'));
            }
            _this.isDragging = false;
            if (e.type === 'touchend' && _this.isClick === true) {
                // this workaround enable click will using touch
                e.target.click();
                _this.isClick = false;
            }
        };
        this.mm = function (e) {
            var isMouseEvent = e instanceof window.MouseEvent;
            var newScrollX;
            var newScrollY;
            var eventDetail = {};
            if (_this.pushed) {
                if (!_this.isDragging) {
                    _this.element.dispatchEvent(new CustomEvent('dragscrollstart'));
                }
                _this.isDragging = true;
                // when we reach the end or the begining of X or Y
                var isEndX = ((_this.element.scrollLeft + _this.element.clientWidth) >= _this.element.scrollWidth) || _this.element.scrollLeft === 0;
                var isEndY = ((_this.element.scrollTop + _this.element.clientHeight) >= _this.element.scrollHeight) || _this.element.scrollTop === 0;
                // get new scroll dimentions
                newScrollX = (-_this.lastClientX + (_this.lastClientX = isMouseEvent ? e.clientX : e.touches[0].clientX));
                newScrollY = (-_this.lastClientY + (_this.lastClientY = isMouseEvent ? e.clientY : e.touches[0].clientY));
                if (_this.x) {
                    newScrollY = -0;
                }
                if (_this.y) {
                    newScrollX = -0;
                }
                // compute and scroll
                _this.element.scrollLeft -= newScrollX;
                _this.element.scrollTop -= newScrollY;
                if (_this.element === document.body) {
                    _this.element.scrollLeft -= newScrollX;
                    _this.element.scrollTop -= newScrollY;
                }
                // pass scroll when max reached
                if (_this.pass) {
                    // if one side reach the end scroll window
                    if (isEndX) {
                        window.scrollBy(-newScrollX, 0);
                    }
                    if (isEndY) {
                        window.scrollBy(0, -newScrollY);
                    }
                }
                // Emit events
                eventDetail.deltaX = -newScrollX;
                eventDetail.deltaY = -newScrollY;
                _this.element.dispatchEvent(new CustomEvent('dragscrollmove', { detail: eventDetail }));
            }
        };
    }
    DragScroll.prototype.attached = function () {
        for (var _i = 0, POINTER_START_EVENTS_1 = POINTER_START_EVENTS; _i < POINTER_START_EVENTS_1.length; _i++) {
            var startEvent = POINTER_START_EVENTS_1[_i];
            this.element.addEventListener(startEvent, this.md);
        }
        for (var _a = 0, POINTER_END_EVENTS_1 = POINTER_END_EVENTS; _a < POINTER_END_EVENTS_1.length; _a++) {
            var endEvent = POINTER_END_EVENTS_1[_a];
            this.element.addEventListener(endEvent, this.mu);
        }
        for (var _b = 0, POINTER_MOVE_EVENTS_1 = POINTER_MOVE_EVENTS; _b < POINTER_MOVE_EVENTS_1.length; _b++) {
            var moveEvent = POINTER_MOVE_EVENTS_1[_b];
            this.element.addEventListener(moveEvent, this.mm);
        }
    };
    DragScroll.prototype.detached = function () {
        for (var _i = 0, POINTER_START_EVENTS_2 = POINTER_START_EVENTS; _i < POINTER_START_EVENTS_2.length; _i++) {
            var startEvent = POINTER_START_EVENTS_2[_i];
            this.element.removeEventListener(startEvent, this.md);
        }
        for (var _a = 0, POINTER_END_EVENTS_2 = POINTER_END_EVENTS; _a < POINTER_END_EVENTS_2.length; _a++) {
            var endEvent = POINTER_END_EVENTS_2[_a];
            this.element.removeEventListener(endEvent, this.mu);
        }
        for (var _b = 0, POINTER_MOVE_EVENTS_2 = POINTER_MOVE_EVENTS; _b < POINTER_MOVE_EVENTS_2.length; _b++) {
            var moveEvent = POINTER_MOVE_EVENTS_2[_b];
            this.element.removeEventListener(moveEvent, this.mm);
        }
    };
    DragScroll.inject = [Element];
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], DragScroll.prototype, "noChildDrag", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], DragScroll.prototype, "firstChildDrag", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], DragScroll.prototype, "x", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], DragScroll.prototype, "y", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], DragScroll.prototype, "pass", void 0);
    DragScroll = __decorate([
        aurelia_templating_1.customAttribute('dragscroll'),
        __metadata("design:paramtypes", [Element])
    ], DragScroll);
    return DragScroll;
}());
exports.DragScroll = DragScroll;
//# sourceMappingURL=aurelia-dragscroll.js.map