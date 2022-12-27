module.exports = {
    root: true,
    extends: ['pixi-react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname
    },
    ignorePatterns: [
        'index.d.ts',
        'index.js',
        'module.js',
        'dist',
        'node_modules',
    ]
};
