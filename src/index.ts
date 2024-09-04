console.warn(`
Be aware that you are using a beta version of Pixi React.
- Things may be broken.
- Things may (but shouldn't) change.
- All functionality that's deprecated in the beta version WILL BE REMOVED for the production release.
`);

export { Application } from './components/Application';
export { UseAssetsStatus } from './constants/UseAssetsStatus';
export { createRoot } from './core/createRoot';
export * from './global';
export { extend } from './helpers/extend';
export { useApp } from './hooks/useApp';
export { useApplication } from './hooks/useApplication';
export { useAsset } from './hooks/useAsset';
export { useAssets } from './hooks/useAssets';
export { useExtend } from './hooks/useExtend';
export { useSuspenseAssets } from './hooks/useSuspenseAssets';
export { useTick } from './hooks/useTick';
export type { PixiReactElementProps } from './typedefs/PixiReactNode';
