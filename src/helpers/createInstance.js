import { applyProps } from './applyProps.js';
import { catalogue } from './catalogue.js';
import { convertStringToPascalCase } from './convertStringToPascalCase.js';

/** @typedef {import('../typedefs/PixiElements.js').PixiElements} PixiElements */

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

    // Get the class from an imported Pixi.js namespace
    const TARGET = /** @type {new (...args: any[]) => any} */ (catalogue[name]);

    if (!TARGET)
    {
        throw new Error(
            `@react/pixi: ${name} is not part of the PIXI namespace! Did you forget to extend?`,
        );
    }

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
