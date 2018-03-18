# React Pixi Fiber

A simple custom renderer written on React Fiber. Make it possible to render [Pixi](http://www.pixijs.com/) 
elements using the declarative React syntax.

```jsx
import from '@inlet/react-pixi-fiber'

const drawGraphics = (g) => {
  g.beginFill(0x000000, 0.03)
  g.drawRect(0, 0, 10, 10)
}

const App = () => (
  <Stage>
    <Sprite image="./bunny.png" x={100} y={100} />
    <Graphics draw={drawGraphics} />
  </Stage>
)
```

## Resources used

- [github.com/acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
- [github.com/nitin42/Making-a-custom-React-renderer](https://github.com/nitin42/Making-a-custom-React-renderer)
- [github.com/facebook/react/tree/master/packages/react-art](https://github.com/facebook/react/tree/master/packages/react-art)
- [github.com/facebook/react](https://github.com/facebook/react)
- [github.com/michalochman/react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber)

## Purpose

Integration with [Spirit Studio](https://github.com/inlet/spirit-app)
