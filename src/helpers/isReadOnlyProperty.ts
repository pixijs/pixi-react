export function isReadOnlyProperty(objectInstance: Record<any, any>, propertyKey: string)
{
    const prototype = Object.getPrototypeOf(objectInstance);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);

    return !(typeof propertyDescriptor === 'undefined' || propertyDescriptor.set);
}
