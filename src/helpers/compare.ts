/** Whether the input is an array. */
export function isArray(input: any): input is []
{
    return Array.isArray(input);
}

/** Whether the input is a boolean. */
export function isBoolean(input: any): input is boolean
{
    return typeof input === 'boolean';
}

/** Whether the inputs are equal. */
export function isEqual(
    inputA: any,
    inputB: any,
    options: {
        arrays?: 'reference' | 'shallow',
        objects?: 'reference' | 'shallow',
        strict?: boolean,
    } = {
        arrays: 'reference',
        objects: 'reference',
        strict: true,
    })
{
    const {
        arrays,
        objects,
        strict,
    } = options;

    // If input types are incompatible, or one input is undefined
    if (typeof inputA !== typeof inputB || !!inputA !== !!inputB)
    {
        return false;
    }

    // Atomic, just compare a against b
    if (isString(inputA) || isNumber(inputA))
    {
        return inputA === inputB;
    }

    const isInputAAnObject = isObject(inputA);

    if (isInputAAnObject && objects === 'reference')
    {
        return inputA === inputB;
    }

    const isInputAAnArray = isArray(inputA);

    if (isInputAAnArray && arrays === 'reference')
    {
        return inputA === inputB;
    }

    // If we're dealing with either an array or object, we'll shallow compare first to see if they match
    if ((isInputAAnArray || isInputAAnObject) && inputA === inputB)
    {
        return true;
    }

    // Last resort, go through keys
    let key;

    // Check if inputB has all the keys of inputA
    for (key in inputA)
    {
        if (!(key in inputB))
        {
            return false;
        }
    }

    let input = inputA;

    if (strict)
    {
        input = inputB;
    }

    // Check if values between keys match
    if (isInputAAnObject && arrays === 'shallow' && objects === 'shallow')
    {
        for (key in input)
        {
            const equalityCheckResult = isEqual(inputA[key], inputB[key], {
                strict,
                objects: 'reference',
            });

            if (!equalityCheckResult)
            {
                return false;
            }
        }
    }
    else
    {
        for (key in input)
        {
            if (inputA[key] !== inputB[key])
            {
                return false;
            }
        }
    }

    if (isUndefined(key))
    {
        if (isInputAAnArray && (inputA.length === 0) && (inputB.length === 0))
        {
            return true;
        }

        if (isInputAAnObject && Object.keys(inputA).length === 0 && Object.keys(inputB).length === 0)
        {
            return true;
        }

        if (inputA !== inputB)
        {
            return false;
        }
    }

    return true;
}

/** Whether the input is a function. */
export function isFunction(input: any): input is (...args: any) => any
{
    return typeof input === 'function';
}

/** Whether the input is null. */
export function isNull(input: any): input is null
{
    return input === null;
}

/** Whether the input is a number. */
export function isNumber(input: any): input is number
{
    return typeof input === 'number';
}

/** Whether the input is an object. */
export function isObject(input: any): input is Record<string, unknown>
{
    if (input !== Object(input))
    {
        return false;
    }

    if (isArray(input))
    {
        return false;
    }

    if (typeof input === 'function')
    {
        return false;
    }

    return true;
}

/** Whether the input is a string. */
export function isString(input: any): input is string
{
    return typeof input === 'string';
}

/** Whether the input is undefined. */
export function isUndefined(input: any): input is undefined
{
    // eslint-disable-next-line no-void
    return input === void 0;
}
