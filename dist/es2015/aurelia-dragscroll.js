var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable, customAttribute } from 'aurelia-templating';
// Ported from https://github.com/donmbelembe/vue-dragscroll
const POINTER_START_EVENTS = ['mousedown', 'touchstart'];
const POINTER_MOVE_EVENTS = ['mousemove', 'touchmove'];
const POINTER_END_EVENTS = ['mouseup', 'touchend'];
let DragScroll = class DragScroll {
    constructor(element) {
        this.element = element;
        this.noChildDrag = false;
        this.firstChildDrag = false;
        this.isDragging = false;
        this.isClick = false;
        this.md = (e) => {
            e.preventDefault();
            const isMouseEvent = e instanceof window.MouseEvent;
            // The coordinates of the mouse pointer compared to the page when the mouse button is clicked on an element
            const pageX = isMouseEvent ? e.pageX : e.touches[0].pageX;
            const pageY = isMouseEvent ? e.pageY : e.touches[0].pageY;
            const clickedElement = document.elementFromPoint(pageX - window.pageXOffset, pageY - window.pageYOffset);
            const hasNoChildDrag = this.noChildDrag;
            const hasFirstChildDrag = this.firstChildDrag;
            const isEl = clickedElement === this.element;
            const isFirstChild = clickedElement === this.element.firstChild;
            const isDataDraggable = hasNoChildDrag ? typeof clickedElement.dataset.dragscroll !== 'undefined' : typeof clickedElement.dataset.noDragscroll === 'undefined';
            if (!isEl && (!isDataDraggable || (hasFirstChildDrag && !isFirstChild))) {
                return;
            }
            this.pushed = 1;
            // The coordinates of the mouse pointer compared to the viewport when the mouse button is clicked on an element
            this.lastClientX = isMouseEvent ? e.clientX : e.touches[0].clientX;
            this.lastClientY = isMouseEvent ? e.clientY : e.touches[0].clientY;
            if (e.type === 'touchstart') {
                this.isClick = true;
            }
        };
        this.mu = (e) => {
            this.pushed = 0;
            if (this.isDragging) {
                this.element.dispatchEvent(new CustomEvent('dragscrollend'));
            }
            this.isDragging = false;
            if (e.type === 'touchend' && this.isClick === true) {
                // this workaround enable click will using touch
                e.target.click();
                this.isClick = false;
            }
        };
        this.mm = (e) => {
            const isMouseEvent = e instanceof window.MouseEvent;
            let newScrollX;
            let newScrollY;
            const eventDetail = {};
            if (this.pushed) {
                if (!this.isDragging) {
                    this.element.dispatchEvent(new CustomEvent('dragscrollstart'));
                }
                this.isDragging = true;
                // when we reach the end or the begining of X or Y
                const isEndX = ((this.element.scrollLeft + this.element.clientWidth) >= this.element.scrollWidth) || this.element.scrollLeft === 0;
                const isEndY = ((this.element.scrollTop + this.element.clientHeight) >= this.element.scrollHeight) || this.element.scrollTop === 0;
                // get new scroll dimentions
                newScrollX = (-this.lastClientX + (this.lastClientX = isMouseEvent ? e.clientX : e.touches[0].clientX));
                newScrollY = (-this.lastClientY + (this.lastClientY = isMouseEvent ? e.clientY : e.touches[0].clientY));
                if (this.x) {
                    newScrollY = -0;
                }
                if (this.y) {
                    newScrollX = -0;
                }
                // compute and scroll
                this.element.scrollLeft -= newScrollX;
                this.element.scrollTop -= newScrollY;
                if (this.element === document.body) {
                    this.element.scrollLeft -= newScrollX;
                    this.element.scrollTop -= newScrollY;
                }
                // pass scroll when max reached
                if (this.pass) {
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
                this.element.dispatchEvent(new CustomEvent('dragscrollmove', { detail: eventDetail }));
            }
        };
    }
    attached() {
        for (const startEvent of POINTER_START_EVENTS) {
            this.element.addEventListener(startEvent, this.md);
        }
        for (const endEvent of POINTER_END_EVENTS) {
            this.element.addEventListener(endEvent, this.mu);
        }
        for (const moveEvent of POINTER_MOVE_EVENTS) {
            this.element.addEventListener(moveEvent, this.mm);
        }
    }
    detached() {
        for (const startEvent of POINTER_START_EVENTS) {
            this.element.removeEventListener(startEvent, this.md);
        }
        for (const endEvent of POINTER_END_EVENTS) {
            this.element.removeEventListener(endEvent, this.mu);
        }
        for (const moveEvent of POINTER_MOVE_EVENTS) {
            this.element.removeEventListener(moveEvent, this.mm);
        }
    }
};
DragScroll.inject = [Element];
__decorate([
    bindable,
    __metadata("design:type", Object)
], DragScroll.prototype, "noChildDrag", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], DragScroll.prototype, "firstChildDrag", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], DragScroll.prototype, "x", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], DragScroll.prototype, "y", void 0);
__decorate([
    bindable,
    __metadata("design:type", Object)
], DragScroll.prototype, "pass", void 0);
DragScroll = __decorate([
    customAttribute('dragscroll'),
    __metadata("design:paramtypes", [Element])
], DragScroll);
export { DragScroll };
//# sourceMappingURL=aurelia-dragscroll.js.map