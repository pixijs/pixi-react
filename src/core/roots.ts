import { type Root } from '../typedefs/Root';

/** We store roots here since we can render to multiple canvases. */
export const roots: Map<HTMLElement, Root> = new Map();
