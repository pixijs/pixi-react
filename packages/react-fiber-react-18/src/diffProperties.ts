import type { PropsType, UpdatePayload } from '@pixi/react-types';

const CHILDREN = 'children';

// get diff between 2 objects
// https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
export function diffProperties<PixiDisplayObject>(
    _pixiElement: PixiDisplayObject,
    _type: string,
    lastProps: PropsType,
    nextProps: PropsType,
): UpdatePayload
{
    let updatePayload = null;

    for (const propKey in lastProps)
    {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] === null)
        {
            continue;
        }
        if (propKey === CHILDREN)
        {
            // Noop. Text children not supported
        }
        else
        {
            // For all other deleted properties we add it to the queue. We use
            // the whitelist in the commit phase instead.
            if (!updatePayload)
            {
                updatePayload = [];
            }
            updatePayload.push(propKey, null);
        }
    }

    for (const propKey in nextProps)
    {
        const nextProp = nextProps[propKey];
        const lastProp = lastProps !== null ? lastProps[propKey] : undefined;

        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp === null && lastProp === null))
        {
            continue;
        }

        if (propKey === CHILDREN)
        {
            // Noop. Text children not supported
        }
        else
        {
            // For any other property we always add it to the queue and then we
            // filter it out using the whitelist during the commit.
            if (!updatePayload)
            {
                updatePayload = [];
            }
            updatePayload.push(propKey, nextProp);
        }
    }

    return updatePayload;
}
