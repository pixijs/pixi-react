import { PixiReactIgnoredProps } from '../constants/PixiReactIgnoredProps.js';
import { ReactIgnoredProps } from '../constants/ReactIgnoredProps.js';
import { gentleClone } from './gentleClone.js';

const IGNORED_PROPS = ReactIgnoredProps.concat(PixiReactIgnoredProps);

/**
 * Clones a props object, excluding keys that are special to React and Pixi React.
 *
 * @param {Record<string, any>} props The props object to clone.
 * @returns {Record<string, any>} The cloned props.
 */
export function gentleCloneProps(props)
{
    return gentleClone(props, IGNORED_PROPS);
}
