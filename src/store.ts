import { type Root } from './typedefs/Root';

const store: {
    debug: boolean,
    unmountQueue: Set<Root>,
} = {
    debug: false,
    unmountQueue: new Set(),
};

export { store };
