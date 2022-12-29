module.exports = {
    root: true,
    extends: ['pixi-react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: [
        'node_modules',
    ]
};
