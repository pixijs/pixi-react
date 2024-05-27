/** @typedef {import('pixi.js').Container} Container */

/**
 * Adds elements to our scene and attaches geometry and material to meshes.
 *
 * @param {Container} parentInstance
 * @param {Container} child
 */
export function appendChild(parentInstance, child)
{
    if (!child)
    {
        return;
    }

    parentInstance.addChild(child);
}
