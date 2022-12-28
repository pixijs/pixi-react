module.exports = {
    root: true,
    extends: ['pixi-react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname
    },
    ignorePatterns: [
        '/**/*Docz.js',
        '/index.d.ts',
        '/index.js',
        '/module.js',
        '/dist',
        '/test/__fixtures__',
    ]
};
