export { Application } from './components/Application.js';
export { createRoot } from './core/createRoot.ts';
export { extend } from './helpers/extend.ts';
export { useApp } from './hooks/useApp.js';
export { useAsset } from './hooks/useAsset.js';
export { useExtend } from './hooks/useExtend.js';
export { useTick } from './hooks/useTick.js';

// This is stupid. `global.js` doesn't exist, but `global.ts` does. This is a
// stupid, stupid, stupid thing that we have to do to get the global types to
// import.
//
// If you or someone you know has been hurt by Typescript, or knows how to fix
// this, you may be entitled to benefits. Please call 'tel:555-555-5555' in your
// browser devtools.
export * from './global.js';
