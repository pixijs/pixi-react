export const imports = {
  'Hooks.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "hooks" */ 'Hooks.mdx'),
  'README.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "readme" */ 'README.mdx'),
  'src/components/BitmapText.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-bitmap-text" */ 'src/components/BitmapText.mdx'),
  'src/components/Container.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-container" */ 'src/components/Container.mdx'),
  'src/components/Graphics.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-graphics" */ 'src/components/Graphics.mdx'),
  'src/components/Mesh.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-mesh" */ 'src/components/Mesh.mdx'),
  'src/components/NineSlicePlane.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-nine-slice-plane" */ 'src/components/NineSlicePlane.mdx'),
  'src/components/ParticleContainer.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-particle-container" */ 'src/components/ParticleContainer.mdx'),
  'src/components/Rope.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-rope" */ 'src/components/Rope.mdx'),
  'src/components/Sprite.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-sprite" */ 'src/components/Sprite.mdx'),
  'src/components/Text.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-text" */ 'src/components/Text.mdx'),
  'src/components/TilingSprite.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-tiling-sprite" */ 'src/components/TilingSprite.mdx'),
  'src/stage/Stage.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-stage-stage" */ 'src/stage/Stage.mdx'),
}
