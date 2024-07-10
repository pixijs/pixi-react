import { PixiReactIgnoredProps } from '../constants/PixiReactIgnoredProps.js';
import { applyProps } from './applyProps.js';
import { catalogue } from './catalogue.js';
import { convertStringToPascalCase } from './convertStringToPascalCase.js';
import { gentleCloneProps } from './gentleCloneProps.js';
import { log } from './log.js';
import { parseComponentType } from './parseComponentType.js';
import { prepareInstance } from './prepareInstance.js';

/** @typedef {import('../typedefs/HostConfig.ts').HostConfig} HostConfig */
/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */
/** @typedef {import('../typedefs/InstanceProps.ts').InstanceProps} InstanceProps */

/**
 * @param {HostConfig['type']} type
 * @param {InstanceProps} props
 * @param {Instance} root
 * @returns {Instance}
 */
export function createInstance(type, props, root)
{
    log('info', 'lifecycle::createInstance');

    const parsedType = parseComponentType(type);

    // Convert lowercase component name to PascalCase
    const name = convertStringToPascalCase(parsedType);

    // Get the class from an imported Pixi.js namespace
    const PixiComponent = /** @type {new (...args: any[]) => any} */ (catalogue[name]);

    if (!PixiComponent)
    {
        throw new Error(`${name} is not part of the PIXI namespace! Did you forget to extend?`);
    }

    const pixiProps = gentleCloneProps(props, PixiReactIgnoredProps);

    let component;

    switch (name)
    {
        case 'Application':
            component = new PixiComponent();
            component.init(pixiProps);
            break;

        default:
            component = new PixiComponent(pixiProps);
    }

    const instance = prepareInstance(component, {
        root,
        type: parsedType,
    });

    // Set initial props
    applyProps(instance, props);

    return instance;
}
