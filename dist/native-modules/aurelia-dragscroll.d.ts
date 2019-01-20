export declare class DragScroll {
    private element;
    private lastClientX;
    private lastClientY;
    private pushed;
    private isDragging;
    private isClick;
    noChildDrag: boolean;
    firstChildDrag: boolean;
    x: any;
    y: any;
    pass: any;
    static inject: {
        new (): Element;
        prototype: Element;
    }[];
    constructor(element: Element);
    attached(): void;
    detached(): void;
    reset(): void;
    md: (e: any) => void;
    mu: (e: any) => void;
    mm: (e: any) => void;
}
