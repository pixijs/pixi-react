import { createContext } from 'react';
import { type ApplicationState } from '../typedefs/ApplicationState';

export const Context = createContext<ApplicationState>({} as ApplicationState);

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
