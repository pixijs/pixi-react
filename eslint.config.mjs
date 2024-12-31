import pixiConfig from '@pixi/eslint-config';

export default [
    {
        ignores: [
            'dist/**/*',
            'lib/**/*',
            'types/**/*',
        ],
    },
    ...pixiConfig,
    {
        rules: {
            'max-len': 0,
            '@typescript-eslint/no-empty-object-type': [
                0,
                {
                    allowInterfaces: 'with-single-extends',
                },
            ],
        },
    },
    {
        files: [
            '*.test.ts',
            '*.test.tsx',
        ],
        rules: {
            '@typescript-eslint/dot-notation': [
                0,
                {
                    allowPrivateClassPropertyAccess: true,
                    allowProtectedClassPropertyAccess: true,
                    allowIndexSignaturePropertyAccess: true,
                },
            ],
            '@typescript-eslint/no-unused-expressions': 0,
            'dot-notation': 0,
        },
    },
];
