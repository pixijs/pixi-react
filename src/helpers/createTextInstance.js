import { log } from './log.js';

/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */

/**
 * text: string, rootContainer: Instance, hostContext: null, internalHandle: any
 * @param {string} _text Unused.
 * @param {Instance} _rootContainer Unused.
 * @param {null} _hostContext Unused.
 * @param {any} _internalHandle Unused.
 * @throws {Error} Always throws, because we don't support this (yet).
 * @returns {Instance}
 */
export function createTextInstance(_text, _rootContainer, _hostContext, _internalHandle)
{
    log('info', 'lifecycle::createTextInstance');
    throw new Error('Text instances are not yet supported. Please use a `<text>` component.');
}
