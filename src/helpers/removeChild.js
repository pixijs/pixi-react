/** @typedef {import('pixi.js').Container} Container */
/** @typedef {import('../typedefs/HostContainer.js').HostContainer} HostContainer */

/**
 * Removes elements from our scene and disposes of them.
 *
 * @param {HostContainer & Container} _container Unused.
 * @param {HostContainer & Container} child The child to be removed.
 */
export function removeChild(_container, child)
{
    if (!child)
    {
        return;
    }

    if (child.destroy)
    {
        child.destroy();
    }
}
