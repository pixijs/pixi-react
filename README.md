<p align="center">
  <img src="./.github/react.svg" alt="pixi-react" width="310" />
</p>

<h1 align="center">
  <code>@pixi/react</code>
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

`@pixi/react` is an open-source, production-ready library to render high performant PixiJS applications in React.

## Features

- React v19 support
- PixiJS v8 support

## Getting Started

### Quick Start

If you want to start a new React project from scratch then we recommend [Create React App](https://github.com/facebook/create-react-app), but `@pixi/react` should work with any React application (Remix, Next.js, etc).
To add `@pixi/react` to an existing React application, just install the dependencies:

#### Install Dependencies
```bash
npm install pixi.js@^8.2.6 @pixi/react
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

const MyComponent = () => {
  const drawCallback = useCallback(graphics => {
    graphics.clear()
    graphics.setFillStyle({ color: 'red' })
    graphics.rect(0, 0, 100, 100)
    graphics.fill()
  }, [])

  return (
    <Application>
      <pixiContainer x={100} y={100}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  )
}
```

## Docs

### `extend`

One of the most important concepts to understand with v8 is `extend`. Normally `@pixi/react` would have to import all pf Pixi.js to be able to provide the full library as JSX components. Instead, we use an internal catalogue of components populated by the `extend` API. This allows you to define exactly which parts of Pixi.js you want to import, keeping your bundle sizes small.

To allow `@pixi/react` to use a Pixi.js component, pass it to the `extend` API:

```jsx
import { Container } from 'pixi.js'
import { extend } from '@pixi/react'

extend({ Container })

const MyComponent = () => (
  <pixiContainer />
)
```

> [!CAUTION]
> Attempting to use components that haven't been passed to the `extend` API **will result in errors**.

### Components

#### `<Application>`

The `<Application>` component is used to wrap your `@pixi/react` app. The `<Application>` component can take [all props that can be set](https://pixijs.download/release/docs/app.ApplicationOptions.html) on [`PIXI.Application`](https://pixijs.download/release/docs/app.Application.html).

##### Example Usage

```jsx
import { Application } from '@pixi/react'

const MyComponent = () => {
  return (
    <Application
      autoStart
      sharedTicker />
  )
}
```

###### `defaultTextStyle`

`defaultTextStyle` is a convenience property. Whatever is passed will automatically be assigned to Pixi.js's [`TextStyle.defaultTextStyle`](https://pixijs.download/release/docs/text.TextStyle.html#defaultTextStyle).

> [!NOTE]
> This property **is not retroactive**. It will only apply to text components created after `defaultTextStyle` is set. Any text components created before setting `defaultTextStyle` will retain the base styles they had before `defaultTextStyle` was changed.

###### `extensions`

`extensions` is an array of extensions to be loaded. Adding and removing items from this array will automatically load/unload the extensions. The first time this is handled happens before the application is initialised. See Pixi.js's [`extensions`](https://pixijs.download/release/docs/extensions.html) documentation for more info on extensions.

###### `resizeTo`

The `<Application>` component supports the `resizeTo` property, with some additional functionality: it can accept any HTML element **or** it can take a React `ref` directly.

```jsx
import { Application } from '@pixi/react'
import { useRef } from 'react'
const MyComponent = () => {
  const parentRef = useRef(null)
  return (
    <div ref={parentRef}>
      <Application resizeTo={parentRef} />
    </div>
  )
}
```

#### Pixi Components

All other components should be included in your IDE's intellisense/autocomplete once you've installed/imported `@pixi/react`. If it's exported from Pixi.js, it's supported as a component with the `pixi` prefix. Here's a selection of commonly used components:

```jsx
<pixiContainer />
<pixiGraphics />
<pixiSprite />
<pixiAnimatedSprite />
<pixiText />
<pixiHtmlText />
```

##### `<pixiGraphics>`

The `pixiGraphics` component has a special `draw` property. `draw` takes a callback which receives the `Graphics` context, allowing drawing to happen on every tick.

```jsx
const MyComponent = () => {
  return (
    <pixiGraphics draw={graphics => {
      graphics.clear()
      graphics.setFillStyle({ color: 'red' })
      graphics.rect(0, 0, 100, 100)
      graphics.fill()
    }} />
  )
}
```

#### Custom Components

`@pixi/react` supports custom components via the `extend` API. For example, you can create a `<viewport>` component using the [`pixi-viewport`](https://github.com/davidfig/pixi-viewport) library:

```jsx
import { extend } from '@pixi/react'
import { Viewport } from 'pixi-viewport'

extend({ Viewport })

const MyComponent = () => {
  <viewport>
    <pixiContainer />
  </viewport>
}
```

The `extend` API will teach `@pixi/react` about your components, but TypeScript won't know about them nor their props. If you're using Typescript, check out our [docs for Typescript Users](#for-typescript-users).

### Hooks

#### `useApplication`

`useApplication` allows access to the parent `PIXI.Application` created by the `<Application>` component. This hook _will not work_ outside of an `<Application>` component. Additionally, the parent application is passed via [React Context](https://react.dev/reference/react/useContext). This means `useApplication` will only work appropriately in _child components_, and in the same component that creates the `<Application>`.

For example, the following example `useApplication` **will not** be able to access the parent application:

```jsx
import {
  Application,
  useApplication,
} from '@pixi/react'

const ParentComponent = () => {
  // This will cause an invariant violation.
  const { app } = useApplication()

  return (
    <Application />
  )
}
```

Here's a working example where `useApplication` **will** be able to access the parent application:

```jsx
import {
  Application,
  useApplication,
} from '@pixi/react'

const ChildComponent = () => {
  const { app } = useApplication()

  console.log(app)

  return (
    <container />
  )
}

const ParentComponent = () => (
  <Application>
    <ChildComponent />
  </Application>
)
```

#### `useExtend`

`useExtend` allows the `extend` API to be used as a React hook. Additionally, the `useExtend` hook is memoised, while the `extend` function is not.

```jsx
import { Container } from 'pixi.js'
import { useExtend } from '@pixi/react'

const MyComponent = () => {
  useExtend({ Container })

  return (
    <container />
  )
}
```

#### `useTick`

`useTick` allows a callback to be attached to the [`Ticker`](https://pixijs.download/release/docs/ticker.Ticker.html) on the parent application.

```jsx
import { useTick } from '@pixi/react'

const MyComponent = () => {
  useTick(() => console.log('This will be logged on every tick'))
}
```

`useTick` optionally takes an options object. This allows control of all [`ticker.add`](https://pixijs.download/release/docs/ticker.Ticker.html#add) options, as well as adding the `isEnabled` option. Setting `isEnabled` to `false` will cause the callback to be disabled until the argument is changed to true again.

```jsx
import { useState } from 'react'
import { useTick } from '@pixi/react'

const MyComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false)

  useTick(() => console.log('This will be logged on every tick as long as `isEnabled` is `true`'), isEnabled)

  return (
    <sprite onClick={setIsEnabled(previousState => !previousState)}>
  )
}
```

> [!CAUTION]
> The callback passed to `useTick` **is not memoised**. This can cause issues where your callback is being removed and added back to the ticker on every frame if you're mutating state in a component where `useTick` is using a non-memoised function. For example, this issue would affect the component below because we are mutating the state, causing the component to re-render constantly:
> ```jsx
> import { useState } from 'react'
> import { useTick } from '@pixi/react'
>
> const MyComponent = () => {
>   const [count, setCount] = useState(0)
>
>   useTick(() => setCount(previousCount => previousCount + 1))
>
>   return null
> }
> ```
> This issue can be solved by memoising the callback passed to `useTick`:
> ```jsx
> import {
>   useCallback,
>   useState,
> } from 'react'
> import { useTick } from '@pixi/react'
>
> const MyComponent = () => {
>   const [count, setCount] = useState(0)
>
>   const updateCount = useCallback(() => setCount(previousCount => previousCount + 1), [])
>
>   useTick(updateCount)
> }
> ```

### For Typescript Users

#### Custom Components

`@pixi/react` already offers types for built-in components, but custom components need to be added to the library's type catalogue so it knows how to handle them. This can be achieved by adding your custom components to the `PixiElements` interface. Here's what it may look like to add the `viewport` component from our earlier `extend` example:

```ts
// global.d.ts
import { type PixiReactElementProps } from '@pixi/react'
import { type Viewport } from 'pixi-viewport'

declare module '@pixi/react' {
  interface PixiElements {
    viewport: PixiReactElementProps<typeof Viewport>;
  }
}
```

Now you'll be able to use your custom component in your project without any type errors!

#### Unprefixed Elements

If you like to live life on the wild side, you can enable unprefixed Pixi elements (i.e. `<container>` instead of `<pixiContainer>`) by adding the `UnprefixedPixiElements` interface to the `PixiElements` interface.

```ts
// global.d.ts
import { type UnprefixedPixiElements } from '@pixi/react'

declare module '@pixi/react' {
  interface PixiElements extends UnprefixedPixiElements {}
}
```

The prefixed and unprefixed elements have the same functionality, but we recommend sticking to the prefixed components to avoid collisions with other libraries that add intrinsic elements to JSX (such as [`react-dom`](https://www.npmjs.com/package/react-dom) and [`@react-three/fiber`](https://www.npmjs.com/package/@react-three/fiber)).

> [!IMPORTANT]
> Some components conflict with other libaries, such as `<svg>` in `react-dom` and `<color>` in `@react-three/fiber`. To address this the `pixi` prefixed elements are always available, even after injecting the unprefixed elements.


#### Extending Built-in Components

The props for built-in components are available on the `PixiElements` type and can be used to extend the built-in types.

```ts
import { type PixiElements } from '@pixi/react'

export type TilingSpriteProps = PixiElements['pixiTilingSprite'] & {
  image?: string;
  texture?: Texture;
};
```
