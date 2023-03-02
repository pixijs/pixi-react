export const hasKey = (collection: Array<string> | object): ((arg: string) => boolean) =>
{
    const coll = Array.isArray(collection) ? collection : Object.keys(collection);

    const index: Record<string, boolean> = {};

    coll.forEach((key) =>
    {
        index[key] = true;
    });

    return (key: string) => !!index[key];
};

export const not
    = (boolFn: (...args: any) => boolean) =>
        (...args: any[]) =>
            !boolFn(...args);

export const isArrayWithLength = <T>(maybeArray: any): maybeArray is Array<T> =>
    Array.isArray(maybeArray) && maybeArray.length > 0;
