export function isReadOnlyProperty(
    objectInstance: Record<string, unknown>,
    propertyKey: string,
)
{
    const prototype = Object.getPrototypeOf(objectInstance);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);

    return !(typeof propertyDescriptor === 'undefined' || propertyDescriptor.writable || propertyDescriptor.set);
}
