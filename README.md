<p align="center">
  <img src="./.github/react.svg" alt="pixi-react" width="310" />
</p>

<h1 align="center">
  Pixi React
</h1>

<p align="center">
  <strong>Simply the best way to write PixiJS applications in React</strong>
  <br />
  <sub>Write <a href="http://www.pixijs.com/">PixiJS</a> applications using React declarative style 👌</sub>
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/github/v/release/pixijs/pixi-react" alt="release" />
  <img src="https://img.shields.io/npm/dm/@pixi/react" alt="downloads" />
  <img src="https://img.shields.io/circleci/project/github/pixijs/pixi-react/master.svg" alt="ci tests" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license" />
  <img src="https://img.shields.io/badge/react-v18.0.0-ff69b4.svg" alt="react version" />
</p>

<br />

Pixi React is an open-source, production-ready library to render high performant PixiJS applications in React.

## Features

- React 17 and 18 support
- PixiJS v8 support

## Getting Started

### Quick Start

If you want to start a new React project from scratch then we recommend [Create React App](https://github.com/facebook/create-react-app), but Pixi React should work with any React application (Remix, Next.js, etc).
To add to an existing React application, just install the dependencies:

#### Install Pixi React Dependencies
```bash
npm install pixi.js@^8.2.1 @pixi/react
```

#### Pixie React Usage
```jsx
import {
  Application,
  extend,
} from '@pixi/react'
import {
  Container,
  Graphics,
} from 'pixi.js'
import { useCallback } from 'react'

extend({
  Container,
  Graphics,
})

export function MyComponent() {
  const drawCallback = useCallback(graphics => {
    graphics.clear()
    graphics.setFillStyle({ color: 'red' })
    graphics.rect(0, 0, 100, 100)
    graphics.fill()
  }, [])

  return (
    <Application>
      <container x={100} y={100}>
        <graphics draw={drawCallback} />
      </container>
    </Application>
  )
}
```
