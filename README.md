# React Fiber renderer for PIXI

![](https://img.shields.io/badge/tested_with-jest-green.svg) 
![](https://img.shields.io/github/license/mashape/apistatus.svg)
![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A custom React 16 (Fiber) renderer. Write [PIXI](http://www.pixijs.com/) applications using React declarative style.

## Usage 

```jsx
import { Stage, Sprite } from '@inlet/react-pixi-fiber'

const App = () => (
  <Stage>
    <Sprite image="./bunny.png" x={100} y={100} />
  </Stage>
)
```

## Scripts

```bash
# compile npm lib
yarn build

# lint code
yarn eslint

# fix linting issues
yarn eslint --fix

# test
yarn test

# watch tests
yarn test --watch
```

## Resources

- [github.com/acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
- [github.com/nitin42/Making-a-custom-React-renderer](https://github.com/nitin42/Making-a-custom-React-renderer)
- [github.com/facebook/react/tree/master/packages/react-art](https://github.com/facebook/react/tree/master/packages/react-art)
- [github.com/facebook/react](https://github.com/facebook/react)
- [github.com/michalochman/react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber)
