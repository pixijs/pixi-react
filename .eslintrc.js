module.exports = {
  extends: ['plugin:react/recommended', 'prettier', 'prettier/react'],
  plugins: ['react', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    "prettier/prettier": "error"
  },
  globals: {
    '__DEV__': false
  }
}
