import { type GraphicsContext, type Texture } from 'pixi.js';
import { type ConstructorOverrides } from './ConstructorOverrides';

type ConstructorOptionExcludes = GraphicsContext | Texture;

/**
 * We're adding a specific options type overrides for some components because their deprecated overloads get in the way.
 * @see https://github.com/pixijs/pixi-react/issues/500
 */
export type ConstructorOptions<T extends new (...args: any[]) => any> =
    Extract<ConstructorOverrides, { 0: T }> extends [T, infer R]
        ? unknown extends R
            ? NonNullable<Exclude<ConstructorParameters<T>[0], ConstructorOptionExcludes>>
            : R
        : unknown;
