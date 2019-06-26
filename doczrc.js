export default {
  title: 'React PIXI',
  description: 'Write PIXI apps using React declarative style',
  propsParser: false,
  ordering: 'ascending',
  dest: 'docs',
  public: 'config/docz/public',
  htmlContext: {
    favicon: 'public/favicon.ico',
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://codemirror.net/theme/lucario.css',
        },
      ],
    },
  },
  themeConfig: {
    mode: 'dark',
    showPlaygroundEditor: true,
    // codemirrorTheme: 'duotone-dark',
    codemirrorTheme: 'lucario',
  },
}
