export function isReadOnlyProperty<T>(
    objectInstance: T,
    propertyKey: keyof T,
): boolean
{
    const prototype = Object.getPrototypeOf(objectInstance);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);

    return !(typeof propertyDescriptor === 'undefined' || propertyDescriptor.writable || propertyDescriptor.set);
}

/** Attempts to assign the `value` to the `key` within `obj`, but only when `key` is *not* a readonly prop */
export function safeAssign<T>(obj: T, key: keyof T, value: T[keyof T])
{
    if (!isReadOnlyProperty(obj, key))
    {
        obj[key] = value;
    }
}
