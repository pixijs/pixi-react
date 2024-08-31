import { Container } from '@pixi/display';
import invariant from '../utils/invariant';
import { PixiFiber } from '../reconciler';
import { Reconciler } from 'react-reconciler';

// cache both root PixiFiber containers and React roots
export const roots = new Map();

/**
 * @param {Container} container
 */
function unmountComponent(container, fiber = PixiFiber)
{
    invariant(
        Container.prototype.isPrototypeOf(container),
        'Invalid argument `container`, expected instance of `Container`.'
    );

    if (roots.has(container))
    {
        const { pixiFiberContainer } = roots.get(container);

        // unmount component
        fiber.updateContainer(null, pixiFiberContainer, undefined, () =>
        {
            roots.delete(container);
        });
    }
}

/**
 * Custom Renderer with react 18 API
 * Use this without React-DOM
 *
 * @param {Container} container
 * @param {Reconciler} custom fiber
 * @returns {{ render: Function, unmount: Function}}
 */
export function createRoot(container, fiber = PixiFiber)
{
    invariant(
        Container.prototype.isPrototypeOf(container),
        'Invalid argument `container`, expected instance of `Container`.'
    );

    let root = roots.get(container);

    invariant(!root, 'createRoot should only be called once');

    if (!root)
    {
        const pixiFiberContainer = fiber.createContainer(
            container,
            0,
            null,
            false,
            null,
            '',
            (error) => console.error('React recoverable error:', error),
            null
        );

        const reactRoot = {
            render(element)
            {
                // schedules a top level update
                fiber.updateContainer(
                    element,
                    pixiFiberContainer,
                    undefined
                );

                return fiber.getPublicRootInstance(pixiFiberContainer);
            },
            unmount()
            {
                unmountComponent(container, fiber);
                roots.delete(container);
            },
        };

        root = { pixiFiberContainer, reactRoot };
        roots.set(container, root);
    }

    return root.reactRoot;
}

/**
 * Custom Renderer
 * Use this without React-DOM
 *
 * @deprecated use createRoot instead
 *
 * @param {React.ReactNode} element
 * @param {Container} container (i.e. the Stage)
 * @param {Function} callback
 */
export function render(element, container, callback)
{
    console.warn(
        'Pixi React Deprecation Warning: render is deprecated, use createRoot instead'
    );

    if (callback !== undefined)
    {
        console.warn(
            'Pixi React Deprecation Warning: render callback no longer exists in React 18'
        );
    }

    let reactRoot;

    if (roots.has(container))
    {
        ({ reactRoot } = roots.get(container));
    }
    else
    {
        reactRoot = createRoot(container);
    }

    return reactRoot.render(element);
}

/**
 * @deprecated use root.unmount() instead
 * @param {Container} container
 */
export function unmountComponentAtNode(container, fiber)
{
    unmountComponent(container, fiber);
}
