/** @typedef {import('pixi.js').Container} Container */
/** @typedef {import('../typedefs/HostContainer.js').HostContainer} HostContainer */

/**
 * Adds elements to our scene and attaches geometry and material to meshes.
 *
 * @param {HostContainer & Container} parentInstance
 * @param {HostContainer & Container} child
 */
export function appendChild(parentInstance, child)
{
    if (!child)
    {
        return;
    }

    parentInstance.addChild(child);
}
