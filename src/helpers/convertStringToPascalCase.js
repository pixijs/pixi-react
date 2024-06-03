/**
 * Converts a string to PascalCase.
 *
 * @template {string} S
 * @param {S} string The string to be converted.
 * @returns {S} The converted string.
 */
export function convertStringToPascalCase(string)
{
    const firstChar = string.charAt(0);
    const rest = string.substring(1);

    return /** @type {S} */ (`${firstChar.toUpperCase()}${rest}`);
}
