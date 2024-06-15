import { applyProps } from './applyProps.js';
import { catalogue } from './catalogue.js';
import { convertStringToPascalCase } from './convertStringToPascalCase.js';
import { gentleCloneProps } from './gentleCloneProps.js';
import { log } from './log.js';
import { prepareInstance } from './prepareInstance.js';

/** @typedef {import('../typedefs/HostConfig.js').HostConfig} HostConfig */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */
/** @typedef {import('../typedefs/InstanceProps.js').InstanceProps} InstanceProps */

/**
 * @param {HostConfig['type']} type
 * @param {InstanceProps} props
 * @param {Instance} root
 * @returns {Instance}
 */
export function createInstance(type, props, root)
{
    log('info', 'lifecycle::createInstance');

    // Convert lowercase primitive to PascalCase
    const name = convertStringToPascalCase(type);

    // Get the class from an imported Pixi.js namespace
    const PixiComponent = /** @type {new (...args: any[]) => any} */ (catalogue[name]);

    if (!PixiComponent)
    {
        throw new Error(`${name} is not part of the PIXI namespace! Did you forget to extend?`);
    }

    const pixiProps = gentleCloneProps(props);

    const instance = prepareInstance(new PixiComponent(pixiProps), {
        root,
        type,
    });

    // Set initial props
    applyProps(instance, props);

    return instance;
}
