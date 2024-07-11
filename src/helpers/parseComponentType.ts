function lowercaseFirstCharacter(_fullMatch: string, firstCharacter: string)
{
    return firstCharacter.toLowerCase();
}

export function parseComponentType(type: string)
{
    let parsedType = type;

    if (type.startsWith('pixi'))
    {
        parsedType = type.replace(/^pixi([A-Z])/, lowercaseFirstCharacter);
    }

    return parsedType;
}
