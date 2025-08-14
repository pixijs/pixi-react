import { store } from '../store';
import { isFunction } from './typeChecks';

export type LogType = 'error' | 'info' | 'log' | 'warn';

export function log(logType: LogType, ...args: any[])
{
    if (!store.debug)
    {
        return;
    }

    // eslint-disable-next-line no-console
    const logMethod = console[logType];

    if (!isFunction(logMethod))
    {
        console.warn(`Attempted to create an invalid log type: "${logType}"`);

        return;
    }

    logMethod('@pixi/react', ...args);
}
