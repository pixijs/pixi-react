import { store } from '../store.js';

/**
 * @param  {'error' | 'info' | 'log' | 'warn'} logType The type of the log.
 * @param  {...any} args Args to be forwarded to the logging function.
 */
export function log(logType, ...args)
{
    if (!store.debug)
    {
        return;
    }

    // eslint-disable-next-line no-console
    const logMethod = console[logType];

    if (!(logMethod instanceof Function))
    {
        // eslint-disable-next-line no-console
        console.warn(`Attempted to create an invalid log type: "${logType}"`);

        return;
    }

    logMethod('@pixi/react', ...args);
}
