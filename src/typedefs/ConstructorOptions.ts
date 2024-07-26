import type { ConstructorOverrides } from './ConstructorOverrides';

/**
 * We're adding a specific options type overrides for some components because their deprecated overloads get in the way.
 * @see https://github.com/pixijs/pixi-react/issues/500
 */
export type ConstructorOptions<T extends new (...args: any[]) => any> =
    Extract<ConstructorOverrides, { 0: T }> extends [T, infer R]
        ? unknown extends R
            ? ConstructorParameters<T>[0]
            : R
        : never;
