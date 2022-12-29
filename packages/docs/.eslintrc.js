module.exports = {
    root: true,
    extends: ['plugin:mdx/recommended', 'pixi-react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.md', '.mdx']
    },
    ignorePatterns: [
        'node_modules',
    ],
    settings: {
        'mdx/code-blocks': true,
    }
};
