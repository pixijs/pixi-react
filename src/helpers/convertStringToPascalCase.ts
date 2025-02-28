/** Converts a string to PascalCase. */
export function convertStringToPascalCase<S extends string>(string: S)
{
    const firstChar = string.charAt(0);
    const rest = string.substring(1);

    return `${firstChar.toUpperCase()}${rest}`;
}
