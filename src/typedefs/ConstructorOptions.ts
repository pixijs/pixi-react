import type { ConstructorOverrides } from './ConstructorOverrides';

/**
 * We're adding a specific options type overrides for some components because their deprecated overloads get in the way.
 * @see https://github.com/pixijs/pixi-react/issues/500
 */
export type ConstructorOptions<T extends new (...args: any[]) => any> =
    T extends new (...args: any[]) => infer Instance
        ? Instance extends keyof ConstructorOverrides
            ? ConstructorOverrides[Instance]
            : ConstructorParameters<T>[0]
        : unknown;
