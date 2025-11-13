export function isReadOnlyProperty(
    objectInstance: { [key: string]: any },
    propertyKey: string | number | symbol
)
{
    const prototype = Object.getPrototypeOf(objectInstance);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);

    return !(typeof propertyDescriptor === 'undefined' || propertyDescriptor.writable || propertyDescriptor.set);
}
