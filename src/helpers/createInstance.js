import * as PIXI from 'pixi.js';
import { applyProps } from './applyProps.js';
import { convertStringToPascalCase } from './convertStringToPascalCase.js';

/** @typedef {import('../../types/index.js').PixiElements} PixiElements */
/** @typedef {import('../../types/index.js').PixiElementsImpl} PixiElementsImpl */

/**
 * @param {keyof PixiElements} type
 * @param {Record<string, unknown>} props
 * @returns
 */
export function createInstance(type, props)
{
    const { args } = props;

    // Convert lowercase primitive to PascalCase
    const name = convertStringToPascalCase(type);

    // Get class from Pixi.js namespace
    const TARGET = /** @type {PixiElementsImpl} */ PIXI[name];

    let instance;

    // Create instance
    if (Array.isArray(args))
    {
        instance = new TARGET(...args);
    }
    else
    {
        instance = new TARGET(args);
    }

    // Set initial props
    applyProps(instance, props);

    return instance;
}
