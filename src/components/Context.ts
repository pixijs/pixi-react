import { createContext } from 'react';

import type { InternalState } from '../typedefs/InternalState.ts';

export const Context = createContext<Partial<InternalState>>({});

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
