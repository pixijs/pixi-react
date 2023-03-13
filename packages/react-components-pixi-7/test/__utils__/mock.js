export const getCall = (ins) =>
{
    const r = (index) =>
    {
        if (Array.isArray(ins.mock.calls[index]))
        {
            return {
                args: ins.mock.calls[index],
            };
        }

        return ins.mock.calls[index];
    };

    r.all = ins.mock.calls;
    r.fn = ins;

    return r;
};

export function spyOnObjectMethods(object)
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
