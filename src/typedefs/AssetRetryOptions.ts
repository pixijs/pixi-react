export interface AssetRetryOptions
{
    /** @description The maximum number of retries allowed before we give up on loading this asset. */
    maxRetries?: number

    /** @description Whether to try loading this asset again if it fails. */
    retryOnFailure?: boolean
}
