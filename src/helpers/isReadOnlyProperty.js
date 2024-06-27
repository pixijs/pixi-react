/**
 * @param {Record<any, any>} objectInstance
 * @param {string} propertyKey
 * @returns {boolean}
 */
export function isReadOnlyProperty(objectInstance, propertyKey)
{
    const prototype = Object.getPrototypeOf(objectInstance);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);

    return !(typeof propertyDescriptor === 'undefined' || propertyDescriptor.set);
}
