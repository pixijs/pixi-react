import { store } from '../store.ts';

export type LogType = 'error' | 'info' | 'log' | 'warn';

export function log(logType: LogType, ...args: any[])
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
