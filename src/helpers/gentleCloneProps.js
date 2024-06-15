import { ReactIgnoredProps } from '../constants/ReactIgnoredProps.js';
import { gentleClone } from './gentleClone.js';

/**
 * Clones a props object, excluding keys that are special to React and Pixi React.
 *
 * @param {Record<string, any>} props The props object to clone.
 * @param {readonly string[]} additionalIgnoredProps Additional props to ignore.
 * @returns {Record<string, any>} The cloned props.
 */
export function gentleCloneProps(props, additionalIgnoredProps = [])
{
    return gentleClone(props, ReactIgnoredProps.concat(additionalIgnoredProps));
}
