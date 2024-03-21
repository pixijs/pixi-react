import { cancelable } from 'cancelable-promise';

export class TrackablePromise
{
    isPending;
    isRejected;
    isFulfilled;
    promise = null;
    promiseCallback = null;
    constructor(promise)
    {
        this.isPending = true;
        this.isRejected = false;
        this.isFulfilled = false;
        this.promise = cancelable(promise);

        this.promise
            .then((value) =>
            {
                this.promiseCallback?.(value);
                this.isFulfilled = true;
                this.isPending = false;

                return value;
            })
            .catch((error) =>
            {
                this.isRejected = true;
                this.isPending = false;
                throw error;
            });
    }

    destroy()
    {
        this.promise.cancel();
        this.isPending = false;
        this.isRejected = false;
        this.isFulfilled = false;
    }
}
