import { ReactToPixiEventPropNames } from '../constants/EventPropNames';
import { PixiReactIgnoredProps } from '../constants/PixiReactIgnoredProps';
import { type HostConfig } from '../typedefs/HostConfig';
import { applyProps } from './applyProps';
import { catalogue } from './catalogue';
import { convertStringToPascalCase } from './convertStringToPascalCase';
import { gentleCloneProps } from './gentleCloneProps';
import {
    applySceneOwnProps,
    sceneNodeCreated,
} from './hostChildren';
import { log } from './log';
import { splitOwnProps } from './ownProps';
import { parseComponentType } from './parseComponentType';
import { prepareInstance } from './prepareInstance';

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

    const [initialProps, ownProps] = splitOwnProps(PixiComponent, props);
    const pixiProps = gentleCloneProps(initialProps, PixiReactIgnoredProps);

    // Leave dashed props to `applyProps`: constructors copy them verbatim, so it would skip them as already set
    Object.keys(pixiProps).forEach((key) =>
    {
        if (key.includes('-'))
        {
            delete pixiProps[key];
        }
    });

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

    sceneNodeCreated(instance);

    applyProps(instance, initialProps, { skipUnchanged: true });

    if (ownProps)
    {
        applySceneOwnProps(instance, ownProps);
    }

    return instance;
}
