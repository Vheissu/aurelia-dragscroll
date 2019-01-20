export declare class DragScroll {
    private element;
    private static inject;
    noChildDrag: boolean;
    firstChildDrag: boolean;
    x: any;
    y: any;
    pass: any;
    private lastClientX;
    private lastClientY;
    private pushed;
    private isDragging;
    private isClick;
    constructor(element: Element);
    private attached;
    private detached;
    private md;
    private mu;
    private mm;
}
