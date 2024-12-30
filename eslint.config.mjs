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
        },
    },
    {
        files: [
            '*.test.ts',
            '*.test.tsx',
        ],
        rules: {
            '@typescript-eslint/no-unused-expressions': 0,
            '@typescript-eslint/dot-notation': [
                0,
                {
                    allowPrivateClassPropertyAccess: true,
                    allowProtectedClassPropertyAccess: true,
                    allowIndexSignaturePropertyAccess: true,
                },
            ],
            'dot-notation': 0,
        },
    },
];
