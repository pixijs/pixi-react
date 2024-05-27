/** @typedef {import('pixi.js').Container} Container */

/**
 * Removes elements from our scene and disposes of them.
 *
 * @param {Container} _parentInstance Unused.
 * @param {Container} child The child to be removed.
 */
export function removeChild(_parentInstance, child)
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
