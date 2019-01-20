import { bindable, customAttribute } from 'aurelia-templating';
// Ported from https://github.com/donmbelembe/vue-dragscroll

const POINTER_START_EVENTS = ['mousedown', 'touchstart'];
const POINTER_MOVE_EVENTS = ['mousemove', 'touchmove'];
const POINTER_END_EVENTS = ['mouseup', 'touchend'];

@customAttribute('dragscroll')
export class DragScroll {
    private static inject = [Element];

    @bindable public noChildDrag = false;
    @bindable public firstChildDrag = false;
    @bindable public x;
    @bindable public y;
    @bindable public pass;

    private lastClientX;
    private lastClientY;
    private pushed;
    private isDragging = false;
    private isClick = false;

    constructor(private element: Element) { }

    private attached() {
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

    private detached() {
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

    private md = (e) => {
        e.preventDefault();

        const isMouseEvent = e instanceof (window as any).MouseEvent;

        // The coordinates of the mouse pointer compared to the page when the mouse button is clicked on an element
        const pageX = isMouseEvent ? e.pageX : e.touches[0].pageX;
        const pageY = isMouseEvent ? e.pageY : e.touches[0].pageY;

        const clickedElement = document.elementFromPoint(pageX - window.pageXOffset, pageY - window.pageYOffset) as HTMLElement;

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
    }

    private mu = (e) => {
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
    }

    private mm = (e) => {
        const isMouseEvent = e instanceof (window as any).MouseEvent;
        let newScrollX;
        let newScrollY;
        const eventDetail: any = {};

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
            eventDetail.deltaX = -newScrollX
            eventDetail.deltaY = -newScrollY
            this.element.dispatchEvent(new CustomEvent('dragscrollmove', { detail: eventDetail }));
        }
    }
}
