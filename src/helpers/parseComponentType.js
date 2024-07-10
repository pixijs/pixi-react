/**
 * @param {string} _fullMatch
 * @param {string} firstCharacter
 * @returns {string}
 */
function lowercaseFirstCharacter(_fullMatch, firstCharacter)
{
    return firstCharacter.toLowerCase();
}

/**
 * @param {string} type The component type to be parsed.
 * @returns {string} The parsed component type.
 */
export function parseComponentType(type)
{
    let parsedType = type;

    if (type.startsWith('pixi'))
    {
        parsedType = type.replace(/^pixi([A-Z])/, lowercaseFirstCharacter);
    }

    return parsedType;
}
