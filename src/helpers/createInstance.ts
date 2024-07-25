import { PixiReactIgnoredProps } from '../constants/PixiReactIgnoredProps.ts';
import { applyProps } from './applyProps.ts';
import { catalogue } from './catalogue.ts';
import { convertStringToPascalCase } from './convertStringToPascalCase.ts';
import { gentleCloneProps } from './gentleCloneProps.ts';
import { log } from './log.ts';
import { parseComponentType } from './parseComponentType.ts';
import { prepareInstance } from './prepareInstance.ts';

import type { HostConfig } from '../typedefs/HostConfig.ts';

export function createInstance(
    type: HostConfig['type'],
    props: HostConfig['props'],
    root: HostConfig['containerInstance'],
)
{
    log('info', 'lifecycle::createInstance');

    const parsedType = parseComponentType(type);

    // Convert lowercase component name to PascalCase
    const name = convertStringToPascalCase(parsedType);

    if (!(name in catalogue))
    {
        throw new Error(`${name} is not part of the PIXI namespace! Did you forget to extend?`);
    }

    // Get the class from an imported Pixi.js namespace
    const PixiComponent = catalogue[name];

    const pixiProps = gentleCloneProps(props, PixiReactIgnoredProps);

    const instance = prepareInstance(new PixiComponent(pixiProps), {
        root,
        type: parsedType,
    });

    // Set initial props
    applyProps(instance, props);

    return instance;
}
