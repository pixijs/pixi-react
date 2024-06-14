export { extend } from './helpers/extend.js';
export { useAsset } from './hooks/useAsset.js';
export { useExtend } from './hooks/useExtend.js';
export { render } from './render.js';

// This is stupid. `global.js` doesn't exist, but `global.ts` does. This is a
// stupid, stupid, stupid thing that we have to do to get the global types to
// import.
//
// If you or someone you know has been hurt by Typescript, you may be entitled
// to benefits. Please call 'tel:555-555-5555' in your browser devtools.
export * from './global.js';
