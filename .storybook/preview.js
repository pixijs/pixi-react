export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        'About',
        'CDN Links',
        'Components',
        'Context Bridge',
        'Custom Components',
        'Fallback to Canvas',
        'HOC',
        'Hooks',
        'React-Spring',
        'Render',
        'Stage',
        'TypeScript',
      ],
    },
  },
  viewMode: 'docs',
}
