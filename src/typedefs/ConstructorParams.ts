import type {
    Text,
    TextOptions,
} from 'pixi.js';

export type ConstructorParams<T extends abstract new (...args: any) => any> =
    /**
     * We're adding a specific options type override for Text components because of the order of overloads.
     * @see https://github.com/pixijs/pixi-react/issues/500
     */
    T extends typeof Text
        ? TextOptions
        : T extends new (...args: infer A) => any
            ? A[0]
            : never;
