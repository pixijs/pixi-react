import { createContext } from 'react';

/** @typedef {import('pixi.js').Application} Application */
/**
 * @template T
 * @typedef {import('react').Context<T>} Context
 */

/** @typedef {import('../typedefs/InternalState.ts').InternalState} InternalState */

export const Context = /** @type {Context<InternalState | null>} */ (createContext(null));

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
