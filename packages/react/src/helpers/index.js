export const isFunction = (...args) => args.every((v) => typeof v === 'function');

export const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

export const hasKey = (collection) =>
{
    let coll = collection;

    if (!Array.isArray(coll))
    {
        if (isObject(collection))
        {
            coll = Object.keys(collection);
        }
        else
        {
            throw new Error('collection needs to be an Array or Object');
        }
    }

    const index = {};

    coll.forEach((key) =>
    {
        index[key] = true;
    });

    return (key) => typeof index[key] !== 'undefined';
};

export const not
  = (boolFn) =>
      (...args) =>
          !boolFn(...args);

export const lcFirst = (value) =>
    value.charAt(0).toLowerCase() + value.substring(1);
