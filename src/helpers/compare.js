/**
 * @param {*} input
 * @returns {boolean} Whether the input is an array.
 */
export function isArray(input)
{
    return Array.isArray(input);
}

/**
 * @param {*} input
 * @returns {boolean} Whether the input is a boolean.
 */
export function isBoolean(input)
{
    return typeof input === 'boolean';
}

/**
 * @param {*} inputA The first input.
 * @param {*} inputB The second input.
 * @param {object} [options] Options to configure how equality is checked.
 * @param {'reference' | 'shallow'} [options.arrays] Whether to compare arrays by reference a === b or by shallow equality.
 * @param {'reference' | 'shallow'} [options.objects] Whether to compare objects by reference a === b or by shallow equality.
 * @param {boolean} [options.strict] If true both inputA and inputB's keys must match 1:1, otherwise inputA's keys must intersect inputB's.
 * @returns {boolean} Whether the inputs are equal.
 */
export function isEqual(inputA, inputB, options = {})
{
    const {
        arrays = 'reference',
        objects = 'reference',
        strict = true,
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

/**
 * @param {*} input
 * @returns {boolean} Whether the input is a function.
 */
export function isFunction(input)
{
    return typeof input === 'function';
}

/**
 * @param {*} input
 * @returns {boolean} Whether the input is a number.
 */
export function isNumber(input)
{
    return typeof input === 'number';
}

/**
 * @param {*} input
 * @returns {boolean} Whether the input is an object.
 */
export function isObject(input)
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

/**
 * @param {*} input
 * @returns {boolean} Whether the input is a string.
 */
export function isString(input)
{
    return typeof input === 'string';
}

/**
 * @param {*} input
 * @returns {boolean} Whether the input is undefined.
 */
export function isUndefined(input)
{
    // eslint-disable-next-line no-void
    return input === void 0;
}