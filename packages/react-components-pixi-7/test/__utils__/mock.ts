export function spyOnObjectMethods<T extends { [key: string]: any }>(object: T): T
{
    return Object.keys(object).reduce((spyedOnObject, key) =>
    {
        const existingProperty = object[key];

        if (typeof existingProperty !== 'function')
        {
            return spyedOnObject;
        }

        return {
            ...spyedOnObject,
            [key]: jest.fn(existingProperty),
        };
    }, object);
}
