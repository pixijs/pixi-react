import { ReactIgnoredProps } from '../constants/ReactIgnoredProps';
import { gentleClone } from './gentleClone';

/** Clones a props object, excluding keys that are special to React and Pixi React. */
export function gentleCloneProps(
    props: Record<string, any>,
    additionalIgnoredProps: readonly string[] = [],
)
{
    return gentleClone(props, ReactIgnoredProps.concat(additionalIgnoredProps));
}
