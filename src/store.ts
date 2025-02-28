import { DefaultEventPriority } from 'react-reconciler/constants';
import { type Root } from './typedefs/Root';

const store: {
    currentUpdatePriority: number,
    debug: boolean,
    unmountQueue: Set<Root>,
} = {
    currentUpdatePriority: DefaultEventPriority,
    debug: false,
    unmountQueue: new Set(),
};

export { store };
