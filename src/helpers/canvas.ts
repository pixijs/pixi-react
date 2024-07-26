export function getIsCanvasElement(target: HTMLElement): target is HTMLCanvasElement {
    if (target instanceof HTMLCanvasElement) return true;

    /**
     * In case Application is rendered into another window (created with window.open() and rendered into it using React portal)
     * canvas is instance of openedWindow.HTMLCanvasElement, not global window.HTMLCanvasElement
     * 
     * Thus we need to check for that.
     */
    const OwnerWindowHTMLCanvasElement = target?.ownerDocument?.defaultView?.HTMLCanvasElement;

    if (!OwnerWindowHTMLCanvasElement) return false;

    return target instanceof OwnerWindowHTMLCanvasElement;
}