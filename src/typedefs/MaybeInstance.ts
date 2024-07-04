import type { Instance } from './Instance.ts';
import type { PartialBy } from './PartialBy.ts';

export type MaybeInstance = PartialBy<Instance, '__pixireact'>;
