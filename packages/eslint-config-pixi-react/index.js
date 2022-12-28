module.exports = {
    extends: ['@pixi/eslint-config'],
    settings: {
        jsdoc: {
            mode: 'typescript',
            tagNamePreference: {
                method: 'method',
                function: 'function',
                extends: 'extends',
                typeParam: 'typeParam',
                api: 'api'
            }
        }
    },
    rules: {
        'no-empty-function': 0,
        'no-prototype-builtins': 0,
        'spaced-comment': [1, 'always', { markers: ['/'] }],
        '@typescript-eslint/triple-slash-reference': [1, { path: 'always' }],
        '@typescript-eslint/consistent-type-imports': [1, { disallowTypeAnnotations: false }],
        '@typescript-eslint/no-parameter-properties': 1,
        '@typescript-eslint/type-annotation-spacing': 1
    },
    overrides: [
        {
            files: ['test/**'],
            rules: {
                '@typescript-eslint/no-unused-expressions': 0,
                '@typescript-eslint/dot-notation': [
                    0,
                    {
                        allowPrivateClassPropertyAccess: true,
                        allowProtectedClassPropertyAccess: true,
                        allowIndexSignaturePropertyAccess: true
                    }
                ],
                'dot-notation': 0
            },
            env: {
                jest: true
            }
        }
    ]
};
