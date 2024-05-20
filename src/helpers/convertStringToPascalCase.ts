/**
 * Converts a string to PascalCase.
 *
 * @param {string} string The string to be converted.
 * @returns {string} The converted string.
 */
export function convertStringToPascalCase(string: string): string
{
    const firstChar = string.charAt(0);
    const rest = string.substring(1);

    return `${firstChar.toUpperCase()}${rest}`;
}
