import { Application } from 'pixi.js';

/** @typedef {import('../typedefs/Instance.js').Instance} Instance */

/**
 * @type {{
 *   [name: string]: {
 *     new (...args: any): Instance
 *   }
 * }}
 */
export const catalogue = {
    // @ts-expect-error
    Application,
};
