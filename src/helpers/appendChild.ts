import type { Container } from 'pixi.js';

/**
 * Adds elements to our scene and attaches geometry and material to meshes.
 *
 * @param {*} parentInstance
 * @param {*} child
 * @returns
 */
export function appendChild(parentInstance: Container, child: Container)
{
    if (!child)
    {
        return;
    }

    parentInstance.addChild(child);
}
