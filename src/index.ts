console.warn(`
Be aware that you are using a beta version of Pixi React.
- Things may be broken.
- Things may (but shouldn't) change.
- All functionality that's deprecated in the beta version WILL BE REMOVED for the production release.
`);

export { Application } from './components/Application.ts';
export { createRoot } from './core/createRoot.ts';
export * from './global.ts';
export { extend } from './helpers/extend.ts';
export { useApp } from './hooks/useApp.ts';
export { useApplication } from './hooks/useApplication.ts';
export { useAsset } from './hooks/useAsset.ts';
export { useExtend } from './hooks/useExtend.ts';
export { useTick } from './hooks/useTick.ts';
