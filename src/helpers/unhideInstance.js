/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */

/**
 * @param {Instance} instance
 */
export function unhideInstance(instance)
{
    instance.visible = true;
}
