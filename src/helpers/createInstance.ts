import { ReactToPixiEventPropNames } from '../constants/EventPropNames';
import { applyProps } from './applyProps';
import { catalogue } from './catalogue';
import { convertStringToPascalCase } from './convertStringToPascalCase';
import { gentleCloneProps } from './gentleCloneProps';
import { log } from './log';
import { parseComponentType } from './parseComponentType';
import { prepareInstance } from './prepareInstance';

import type { HostConfig } from '../typedefs/HostConfig';

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

    const pixiProps = gentleCloneProps(props);

    // Clone event props
    Object.entries(props).forEach(([key, value]) =>
    {
        if (key in ReactToPixiEventPropNames)
        {
            const pixiEventName = ReactToPixiEventPropNames[key as keyof typeof ReactToPixiEventPropNames];

            pixiProps[pixiEventName] = value;
        }
    });

    const instance = prepareInstance(new PixiComponent(pixiProps), {
        root,
        type: parsedType,
    });

    // Set initial props
    applyProps(instance, props);

    return instance;
}
