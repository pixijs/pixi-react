import { createContext } from 'react';

export const Context = /** @type {import('../typedefs/ApplicationContext.ts').ApplicationContext} */ (createContext(null));

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
