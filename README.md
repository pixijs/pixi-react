# React PIXI 🌈

![release](https://img.shields.io/github/v/release/inlet/react-pixi)
![downloads](https://img.shields.io/npm/dm/@inlet/react-pixi)
[![CircleCI](https://img.shields.io/circleci/project/github/inlet/react-pixi/master.svg)](https://circleci.com/gh/inlet/react-pixi-fiber)
![license](https://img.shields.io/badge/license-MIT-green.svg)
![react](https://img.shields.io/badge/react-v16.8+-ff69b4.svg)
![pixi](https://img.shields.io/badge/pixi-v5+-ff69b4.svg)

Write [PIXI](http://www.pixijs.com/) applications using React declarative style 👌

![logo](https://user-images.githubusercontent.com/17828231/61295022-6ffa6980-a7d7-11e9-9bff-e71670156cca.png)

## Install

    yarn add pixi.js @inlet/react-pixi

or

    npm install pixi.js @inlet/react-pixi --save

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
import { Application } from 'pixi.js'

// Setup PIXI app
const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0x10bb99,
  view: document.getElementById('container'),
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

- [Container](http://pixijs.download/release/docs/PIXI.Container.html)
- [ParticleContainer](http://pixijs.download/release/docs/PIXI.ParticleContainer.html)
- [Sprite](http://pixijs.download/release/docs/PIXI.Sprite.html)
- [TilingSprite](http://pixijs.download/release/docs/PIXI.TilingSprite.html)
- [Graphics](http://pixijs.download/release/docs/PIXI.Graphics.html)
- [SimpleMesh](http://pixijs.download/release/docs/PIXI.SimpleMesh.html)
- [SimpleRope](http://pixijs.download/release/docs/PIXI.SimpleRope.html)
- [Text](http://pixijs.download/release/docs/PIXI.Text.html)
- [BitmapText](http://pixijs.download/release/docs/PIXI.BitmapText.html)
- [NineSlicePlane](http://pixijs.download/release/docs/PIXI.NineSlicePlane.html)

You can easily add new components to your project:

`./components/Rectangle.js`

```jsx
import { Graphics } from 'pixi.js'
import { PixiComponent } from '@inlet/react-pixi'

export default PixiComponent('Rectangle', {
  create: props => {
    return new Graphics()
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
  },
})
```

`App.js`

```jsx
import { Stage } from '@inlet/react-pixi'
import Rectangle from './components/Rectangle'

export default () => (
  <Stage>
    <Rectangle x={100} y={100} width={500} height={300} fill={0xff0000} />
  </Stage>
)
```

**Props helper**

ReactPixi comes with a handy utility method `applyDefaultProps` that can help you applying
props directly to a PIXI primitive instance handling events, PIXI props and point-like values.

Here's an example to pass through every other DisplayObject props and handle prop `count` separately:

```jsx
import { Text } from 'pixi.js'
import { Stage, applyDefaultProps, PixiComponent } from '@inlet/react-pixi'

export default PixiComponent('Counter', {
  create: ({ count }) => {
    return new Text(count.toString())
  },
  applyProps: (instance, oldProps, newProps) => {
    const { count, ...oldP } = oldProps
    const { count, ...newP } = newProps

    // apply rest props to PIXI.Text
    applyDefaultProps(instance, oldP, newP)

    // set new count
    instance.text = count.toString()
  },
})
```

## Access the `PIXI.Application` in child components

Consider this rotating bunny example:

`./components/RotatingBunny.jsx`

```jsx
import { Sprite } from '@inlet/react-pixi'

class RotatingBunny extends React.Component {
  state = { rotation: 0 }

  componentDidMount() {
    this.props.app.ticker.add(this.tick)
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick)
  }

  tick = delta => {
    this.setState(({ rotation }) => ({
      rotation: rotation + 0.1 * delta,
    }))
  }

  render() {
    return <Sprite image="./bunny.png" rotation={this.state.rotation} />
  }
}
```

There are 2 ways of accessing the `PIXI.Application` instance.

1. Using `AppConsumer` and pass the instance via [render props](https://reactjs.org/docs/render-props.html):

`App.jsx`

```jsx
import { Stage, Container, AppConsumer } from '@inlet/react-pixi'
import { RotatingBunny } from './components/RotatingBunny'

export default () => (
  <Stage>
    <Container>
      <AppConsumer>{app => <RotatingBunny app={app} />}</AppConsumer>
    </Container>
  </Stage>
)
```

2. Or use a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html):

`App.jsx`

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

3. Use hooks API in Functional Components

`RotatingBunny.jsx`

```jsx
import { useApp } from '@inlet/react-pixi'

function RotatingBunny(props) {
  const app = useApp()
  // app => PIXI.Application

  return (
    ...
  )
}
```

## API

### `<Stage />`

Renders [Root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of a `PIXI.Application`.

Props:

- `width` the width of the renderers view, default `800`
- `height` the height of the renderers view, default `600`
- `onMount` a callback function for the created app instance
- `onUnMount` a callback function when the Stage gets unmounted
- `raf` use the internal PIXI ticker (requestAnimationFrame) to render the stage, default `true`
- `renderOnComponentChange` render stage when the Stage component updates. This is ignored if `raf` is `true`.
- `options` see [PIXI.Application options](http://pixijs.download/release/docs/PIXI.Application.html)

The Stage stores the created `PIXI.Application` instance to context, which can be accessed using a [Provider or a Higher
Order Component](#access-the-pixiapplication-in-child-components).

### Components

Pass component options as props, example:

```jsx
import { Sprite } from '@inlet/react-pixi'

const MyComponent = () => <Sprite image=".image.png" x={100} y={200} />
```

The `image` prop here is a short-hand for [`PIXI.Sprite.from()`](http://pixijs.download/release/docs/PIXI.Sprite.html#.from):

```jsx
import { Sprite } from '@inlet/react-pixi'

const texture = new PIXI.Sprite.fromImage('./image.png')

const MyComponent = () => <Sprite texture={texture} x={100} y={200} />
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

## ❤️ Support

If this project helps you reduce time to develop and/or you want to help the maintainer of this project. You can sponsor him. Thank you!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/donatepatrick)

## We're on Slack

You have an amazing feature in mind or just want to get in touch with fellow developers? Feel free to join our Slack channel.

[Join us on Slack](https://join.slack.com/t/reactpixi/shared_invite/enQtODk5NjQ2ODQ4MTI5LWVjNzlkZTJjYmI4NDcxYzljNDM4MmYwMzZkYWFlM2VkNmFhNDBmYzg3OGE5YzBiY2NmZTIwZDY0MTA4ZjA4OGM)
