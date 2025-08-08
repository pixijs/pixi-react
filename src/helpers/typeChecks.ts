import { Application, Container, Filter, Graphics } from 'pixi.js';

/**
 * Cross-realm compatible type checking utilities.
 * These functions work across different JavaScript realms/contexts
 * where instanceof checks may fail.
 */

/**
 * Checks if an object is a PixiJS Container across realms.
 * Uses constructor name and key properties as fallback to instanceof.
 */
export function isContainer(obj: any): obj is Container
{
    if (!obj || typeof obj !== 'object') return false;

    // Primary check: instanceof (works in same realm)
    if (obj instanceof Container) return true;

    // Fallback: check constructor name and key properties
    const constructorName = obj.constructor?.name;

    return constructorName === 'Container'
           || constructorName === 'Sprite'
           || constructorName === 'Graphics'
           || constructorName === 'Text'
           || constructorName === 'BitmapText'
           || constructorName === 'SimpleMesh'
           || constructorName === 'NineSlicePlane'
           || (typeof obj.addChild === 'function'
            && typeof obj.removeChild === 'function'
            && typeof obj.getChildIndex === 'function'
            && 'children' in obj);
}

/**
 * Checks if an object is a PixiJS Graphics across realms.
 */
export function isGraphics(obj: any): obj is Graphics
{
    if (!obj || typeof obj !== 'object') return false;

    // Primary check: instanceof (works in same realm)
    if (obj instanceof Graphics) return true;

    // Fallback: check constructor name and key methods
    const constructorName = obj.constructor?.name;

    return constructorName === 'Graphics'
           || (typeof obj.clear === 'function'
            && typeof obj.rect === 'function'
            && typeof obj.fill === 'function');
}

/**
 * Checks if an object is a PixiJS Filter across realms.
 */
export function isFilter(obj: any): obj is Filter
{
    if (!obj || typeof obj !== 'object') return false;

    // Primary check: instanceof (works in same realm)
    if (obj instanceof Filter) return true;

    // Fallback: check constructor name and key properties
    const constructorName = obj.constructor?.name;

    return constructorName === 'Filter'
           || constructorName?.endsWith('Filter')
           || ('enabled' in obj
            && 'resolution' in obj
            && typeof obj.apply === 'function');
}

/**
 * Checks if an object is a PixiJS Application across realms.
 */
export function isApplication(obj: any): obj is Application
{
    if (!obj || typeof obj !== 'object') return false;

    // Primary check: instanceof (works in same realm)
    if (obj instanceof Application) return true;

    // Fallback: check constructor name and key properties
    const constructorName = obj.constructor?.name;

    return constructorName === 'Application'
           || ('stage' in obj
            && 'renderer' in obj
            && 'ticker' in obj
            && typeof obj.init === 'function');
}

/**
 * Checks if an object is an HTMLCanvasElement across realms.
 */
export function isHTMLCanvasElement(obj: any): obj is HTMLCanvasElement
{
    if (!obj || typeof obj !== 'object') return false;

    // Primary check: instanceof (works in same realm)
    if (typeof HTMLCanvasElement !== 'undefined' && obj instanceof HTMLCanvasElement) return true;

    // Fallback: check node properties and methods
    return isHTMLElement(obj)
           && obj.nodeName === 'CANVAS'
           && typeof (obj as HTMLCanvasElement).getContext === 'function'
           && typeof (obj as HTMLCanvasElement).toDataURL === 'function';
}

/**
 * Checks if an object is an HTMLElement across realms.
 */
export function isHTMLElement(obj: any): obj is HTMLElement
{
    if (!obj || typeof obj !== 'object') return false;

    // Primary check: instanceof (works in same realm)
    if (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) return true;

    // Fallback: check node properties
    return obj.nodeType === Node.ELEMENT_NODE || (
        obj.nodeType === Node.TEXT_NODE
        && obj.parentElement?.nodeType === Node.ELEMENT_NODE
    );
}

/**
 * Checks if an object is a Function across realms.
 */
export function isFunction(obj: any): obj is (...args: any[]) => any
{
    return typeof obj === 'function';
}
