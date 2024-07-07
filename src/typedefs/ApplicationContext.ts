import type { Context } from 'react';
import type { InternalState } from '../typedefs/InternalState.ts';

export type ApplicationContext = Context<InternalState | null>;
