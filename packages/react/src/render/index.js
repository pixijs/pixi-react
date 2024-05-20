import { Container } from '@pixi/display';
import invariant from '../utils/invariant';
import { PixiFiber } from '../reconciler';

// cache both root PixiFiber containers and React roots
export const roots = new Map();

/**
 * @param {Container} container
 */
function unmountComponent(container)
{
    invariant(
        Container.prototype.isPrototypeOf(container),
        'Invalid argument `container`, expected instance of `Container`.'
    );

    if (roots.has(container))
    {
        const { pixiFiberContainer } = roots.get(container);

        // unmount component
        PixiFiber.updateContainer(null, pixiFiberContainer, undefined, () =>
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
 * @returns {{ render: Function, unmount: Function}}
 */
export function createRoot(container)
{
    invariant(
        Container.prototype.isPrototypeOf(container),
        'Invalid argument `container`, expected instance of `Container`.'
    );

    let root = roots.get(container);

    invariant(!root, 'createRoot should only be called once');

    if (!root)
    {
        const pixiFiberContainer = PixiFiber.createContainer(container);

        const reactRoot = {
            render(element)
            {
                // schedules a top level update
                PixiFiber.updateContainer(
                    element,
                    pixiFiberContainer,
                    undefined
                );

                return PixiFiber.getPublicRootInstance(pixiFiberContainer);
            },
            unmount()
            {
                unmountComponent(container);
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
export function unmountComponentAtNode(container)
{
    unmountComponent(container);
}
