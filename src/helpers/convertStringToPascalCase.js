/**
 * Converts a string to PascalCase.
 *
 * @template {string} S
 * @param {S} string The string to be converted.
 * @returns {Capitalize<S>} The converted string.
 */
export function convertStringToPascalCase(string)
{
    const firstChar = string.charAt(0);
    const rest = string.substring(1);

    return /** @type {Capitalize<S>} */ (`${firstChar.toUpperCase()}${rest}`);
}
