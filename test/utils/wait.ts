export function wait(waitMS: number, rejectOnComplete: boolean = false)
{
    return new Promise((resolve, reject) =>
    {
        setTimeout(rejectOnComplete ? reject : resolve, waitMS);
    });
}
