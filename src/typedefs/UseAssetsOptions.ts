import { type ErrorCallback } from './ErrorCallback';

import type { ProgressCallback } from 'pixi.js';

export interface UseAssetsOptions
{
    /** @description The maximum number of retries allowed before we give up on loading this asset. */
    maxRetries?: number

    /** @description A function to be called when if the asset loader encounters an error. */
    onError?: ErrorCallback,

    /** @description A function to be called when the asset loader reports loading progress. */
    onProgress?: ProgressCallback,

    /** @description Whether to try loading this asset again if it fails. */
    retryOnFailure?: boolean
}
