# React Fiber renderer for PIXI

![](https://img.shields.io/badge/tested_with-jest-green.svg)
[![CircleCI](https://img.shields.io/circleci/project/github/inlet/react-pixi/master.svg)](https://circleci.com/gh/inlet/react-pixi-fiber)
![](https://img.shields.io/badge/license-MIT-green.svg) 
![](https://img.shields.io/badge/code_style-prettier-blue.svg)
![](https://img.shields.io/badge/react-fiber-ff69b4.svg)
![](https://img.shields.io/badge/pixi-v4+-ff69b4.svg)

A custom React 16 (Fiber) renderer. Write [PIXI](http://www.pixijs.com/) applications using React declarative style.

![](https://user-images.githubusercontent.com/232559/37669267-b46a8f8e-2c66-11e8-96e7-cae2ae6bdd7d.png)

## Install

    yarn add @inlet/react-pixi

or

    npm install @inlet/react-pixi --save


## Usage 

#### With ReactDOM

```jsx
import { Stage, Sprite } from '@inlet/react-pixi'

const App = () => (
  <Stage>
    <Sprite image="./bunny.png" x={100} y={100} />
  </Stage>
)
```

This example will render a [`PIXI.Sprite`](http://pixijs.download/release/docs/PIXI.Sprite.html) object into a 
[Root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of a 
[`PIXI.Application`](http://pixijs.download/release/docs/PIXI.Application.html) on the page. The `Stage` object will 
create a valid `<canvas />` element to render to.

#### Without ReactDOM

```jsx
import { render, Text } from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'

// Setup PIXI app
const app = new PIXI.Application(800, 600, {
  backgroundColor: 0x10bb99,
  view: document.getElementById('container')
})

// Use the custom renderer to render a valid PIXI object into a PIXI container.
render(<Text text="Hello World" x={200} y={200} />, app.stage)
```

## Examples

Watch the [collection on codepen](https://codepen.io/collection/XPpGdb).

- [Text](https://codepen.io/inlet/pen/zWEaoR)
- [Sprite - Rotating Bunny](https://codepen.io/inlet/pen/aYLvrZ)
- [Tiling Sprite](https://codepen.io/inlet/pen/rdGvQj)
- [Graphics](https://codepen.io/inlet/pen/vRejPV)
- [Interaction - Click](https://codepen.io/inlet/pen/NYazPq)
- [Rope](https://codepen.io/inlet/pen/RMLWxV)
- [Custom Components](https://codepen.io/inlet/pen/RMLJKm)
- [NineSlicePlane](https://codepen.io/inlet/pen/JLrBqK)
- [Custom Render - Without Stage](https://codepen.io/inlet/pen/PRJdgg)

## Custom Components

Currently the following Components are implemented by default:

- [Container](http://pixijs.download/dev/docs/PIXI.Container.html)
- [ParticleContainer](http://pixijs.download/dev/docs/PIXI.particles.ParticleContainer.html)
- [Sprite](http://pixijs.download/dev/docs/PIXI.Sprite.html)
- [TilingSprite](http://pixijs.download/dev/docs/PIXI.extras.TilingSprite.html)
- [Graphics](http://pixijs.download/dev/docs/PIXI.Graphics.html)
- [Mesh](http://pixijs.download/dev/docs/PIXI.mesh.Mesh.html)
- [Rope](http://pixijs.download/dev/docs/PIXI.mesh.Rope.html)
- [Text](http://pixijs.download/dev/docs/PIXI.Text.html)
- [BitmapText](http://pixijs.download/dev/docs/PIXI.extras.BitmapText.html)
- [NineSlicePlane](http://pixijs.download/dev/docs/PIXI.mesh.NineSlicePlane.html)

You can easily add new components to your project:

`./components/Rectangle.js`

```jsx
import * as PIXI from 'pixi.js'
import { PixiComponent } from '@inlet/react-pixi'

export default PixiComponent('Rectangle', {
  create: props => {
    return new PIXI.Graphics()
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { fill, x, y, width, height } = newProps
    instance.clear()
    instance.beginFill(fill)
    instance.drawRect(x, y, width, height)
    instance.endFill()
  }
})
```

`App.js`

```jsx
import { Stage } from '@inlet/react-pixi'
import Rectangle from './components/Rectangle'
export default () => (
  <Stage>
    <Rectangle x={100} 
               y={100} 
               width={500} 
               heigth={300} 
               fill={0xff0000} />
  </Stage>
)
```

## Access the `PIXI.Application` in child components

Consider this rotating bunny example:

`./components/RotatingBunny.js`

```jsx
import { Sprite } from '@inlet/react-pixi'

class RotatingBunny extends React.Component {

  state = { rotation: 0 }

  componenDidMount() {
    this.props.app.ticker.add(this.tick)
  }
  
  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick)
  }
  
  tick(delta) {
    this.setState(({ rotation }) => ({
      rotation + 0.1 * delta
    }))
  }
  
  render() {
    return <Sprite image="./bunny.png" rotation={this.state.rotation} />
  }
}
```

There are 2 ways of accessing the `PIXI.Application` instance.

1. Using `Provider` and pass the instance via [function as child](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9):

`App.js`

```jsx
import { Stage, Container, Provider } from '@inlet/react-pixi'
import { RotatingBunny } from './components/RotatingBunny'

export default () => (
  <Stage>
    <Container>
      <Provider>
        {app => <RotatingBunny app={app} />}
      </Provider>
    </Container>
  </Stage>
)
```

2. Or use a Higher Order Component:

`App.js`

```jsx
import { Stage, Container, withPixiApp } from '@inlet/react-pixi'
import { RotatingBunny } from './components/RotatingBunny'

const BunnyWithApp = withPixiApp(RotatingBunny)

export default () => (
  <Stage>
    <Container>
      <BunnyWithApp />
    </Container>
  </Stage>
)
```

## API

### `<Stage />`

Renders [Root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of a `PIXI.Application`.

Props:

- `width` the width of the renderers view, default `800`
- `height` the height of the renderers view, default `600`
- `onMount` a callback function for the created app instance
- `onUnMount` a callback function when the Stage gets unmounted
- `raf` use the internal PIXI ticker (requestAnimationFrame), default `true`
- `renderOnComponentChange` render stage on Stage changes? only useful in combination with `raf`
- `options` see [PIXI.Application options](http://pixijs.download/release/docs/PIXI.Application.html)

The Stage stores the created `PIXI.Application` instance to context, which can be accessed using a [Provider or a Higher 
Order Component](#access-the-pixiapplication-in-child-components).

### Components

Pass component options as props, example:

```jsx
import { Sprite } from '@inlet/pixi-react'

const MyComponent = () => (
  <Sprite image=".image.png" x={100} y={200} />
)
```

The `image` prop here is a short-hand for [`PIXI.Sprite.fromImage()`](http://pixijs.download/release/docs/PIXI.Sprite.html#.fromImage):

```jsx
import { Sprite } from '@inlet/pixi-react'

const texture = new PIXI.Sprite.fromImage('./image.png')

const MyComponent = () => (
  <Sprite texture={texture} x={100} y={200} />
)
```

## Scripts

```bash
# compile umd & es builds
yarn build

# compile dev builds
yarn build:dev

# compile production builds
yarn build:prod

# watch development builds
yarn build:watch

# lint code
yarn eslint

# fix linting issues
yarn eslint --fix

# test
yarn test

# watch tests
yarn test:watch
```

## Resources

- [github.com/acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
- [github.com/nitin42/Making-a-custom-React-renderer](https://github.com/nitin42/Making-a-custom-React-renderer)
- [github.com/facebook/react/tree/master/packages/react-art](https://github.com/facebook/react/tree/master/packages/react-art)
- [github.com/facebook/react](https://github.com/facebook/react)
- [github.com/michalochman/react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber)
- [github.com/Izzimach/react-pixi](https://github.com/Izzimach/react-pixi)
