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

- React v17 and v18 support
- PixiJS v8 support

## Getting Started

### Quick Start

If you want to start a new React project from scratch then we recommend [Create React App](https://github.com/facebook/create-react-app), but Pixi React should work with any React application (Remix, Next.js, etc).
To add to an existing React application, just install the dependencies:

#### Install Pixi React Dependencies
```bash
npm install pixi.js@^8.2.1 @pixi/react@beta
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
      <container x={100} y={100}>
        <graphics draw={drawCallback} />
      </container>
    </Application>
  )
}
```

## Docs

### `extend`

One of the most important concepts to understand with Pixi React v8 is `extend`. Normally, Pixi React would have to import all pf Pixi.js to be able to provide the full library as JSX components. Instead, we use an internal catalogue of components populated by the `extend` API. This allows you to define exactly which parts of Pixi.js you want to import, keeping your bundle sizes small.

To allow Pixi React to use a Pixi.js component, pass it to the `extend` API:

```jsx
import { Container } from 'pixi.js'
import { extend } from '@pixi/react'

extend({ Container })

const MyComponent = () => (
  <container />
)
```

> [!CAUTION]
> Attempting to use components that haven't been passed to the `extend` API **will result in errors**.

### Components

#### `<Application>`

The `<Application>` component is used to wrap your Pixi React app. The `<Application>` component can take [all props that can be set](https://pixijs.download/release/docs/app.ApplicationOptions.html) on [`PIXI.Application`](https://pixijs.download/release/docs/app.Application.html).

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

###### `attachToDevtools`

Setting `attachToDevtools` to `true` will automatically attach the application to the [Official Pixi.js Devtools](https://chromewebstore.google.com/detail/pixijs-devtools/dlkffcaaoccbofklocbjcmppahjjboce).

###### `defaultTextStyle`

`defaultTextStyle` is a convenience property. Whatever is passed will automatically be assigned to Pixi.js's[`TextStyle.defaultTextStyle`](https://pixijs.download/release/docs/text.TextStyle.html#defaultTextStyle).

> [!NOTE]
> This property **is not retroactive**. It will only apply to text components created after `defaultTextStyle` is set. Any text components created before setting `defaultTextStyle` will retain the base styles they had before `defaultTextStyle` was changed.

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

All other Pixi React components should be included in your IDE's intellisense/autocomplete once you've installed/imported `@pixi/react`. If it's exported from Pixi.js, it's supported as a component in Pixi React. The only difference is that Pixi React components will always start with lowercase characters. Here's a selection of commonly used components:

```jsx
<container />
<graphics />
<sprite />
<animatedSprite />
<text />
<htmlText />
```

##### `<graphics>`

The `graphics` component has a special `draw` property. `draw` takes a callback which receives the `Graphics` context, allowing drawing to happen on every tick.

```jsx
const MyComponent = () => {
  return (
    <graphics draw={graphics => {
      graphics.clear()
      graphics.setFillStyle({ color: 'red' })
      graphics.rect(0, 0, 100, 100)
      graphics.fill()
    }} />
  )
}
```

> [!IMPORTANT]
> You may run into some components that conflict with others. For example, the `<text>` component conflicts with the `<text>` component that's built-in to React for use in SVGs. To address this issue, all components are available with the `pixi` prefix. For example, you can replace the `<text>` component with the `<pixiText>` component. It will have the same functionality with none of the collisions.

#### Custom Components

Pixi React supports custom components via the `extend` API. For example, you can create a `<viewport>` component using the [`pixi-viewport`](https://github.com/davidfig/pixi-viewport) library:

```jsx
import { extend } from '@pixi/react'
import { Viewport } from 'pixi-viewport'

extend({ Viewport })

const MyComponent = () => {
  <viewport>
    <container />
  </viewport>
}
```

##### For Typescript Users

If you're using Typescript, this new `<viewport>` component will throw type errors. Pixi React exports a `PixiReactNode` type that can be used to solve this. You'll need to pass the `Viewport` into `PixiReactNode` and inject it into JSX:

```ts
import type { PixiReactNode } from '@pixi/react'
import type { Viewport } from 'pixi-viewport'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      viewport: PixiReactNode<typeof Viewport>;
    }
  }
}
```

### Hooks

#### `useApp`

**DEPRECATED.** Use `useApplication` hook instead.

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

#### `useAsset`

**DEPRECATED.** Use `useAssets` of `useSuspenseAssets` instead.

#### `useAssets`

The `useAssets` hook wraps the functionality of [Pixi's Asset loader](https://pixijs.download/release/docs/assets.Assets.html) and [Cache](https://pixijs.download/release/docs/assets.Cache.html) into a convenient React hook. The hook can accept an array of items which are either an [`UnresolvedAsset`](https://pixijs.download/release/docs/assets.html#UnresolvedAsset) or a url.

```jsx
import { useAssets } from '@pixi/react'

const MyComponent = () => {
  const {
    assets: [
      bunnyTexture1,
      bunnyTexture2,
    ],
    isSuccess,
  } = useAssets([
    'https://pixijs.com/assets/bunny.png',
    {
      alias: 'bunny',
      src: 'https://pixijs.com/assets/bunny.png',
    }
  ])

  return (
    <container>
      {isSuccess && (
        <sprite texture={bunnyTexture}>
        <sprite texture={bunnyTexture2}>
      )}
    </container>
  )
}
```

##### Tracking Progress

`useAssets` can optionally accept a [`ProgressCallback`](https://pixijs.download/release/docs/assets.html#ProgressCallback) as a second argument. This callback will be called by the asset loader as the asset is loaded.

```jsx
const bunnyTexture = useAssets('https://pixijs.com/assets/bunny.png', progress => {
  console.log(`We have achieved ${progress * 100}% bunny.`)
})
```

#### `useSuspenseAssets`

`useSuspenseAssets` is similar to the `useAssets` hook, except that it supports [React Suspense](https://react.dev/reference/react/Suspense). `useSuspenseAssets` accepts the same parameters as `useAssets`, but it only returns an array of the loaded assets. This is because given a suspense boundary it's possible to prevent components from rendering until they've finished loading their assets.
> ```jsx
> import {
> 	Application,
> 	useSuspenseAssets,
> } from '@pixi/react'
>
> import { Suspense } from 'react'
>
> const BunnySprite = () => {
> 	const [bunnyTexture] = useSuspenseAssets(['https://pixijs.com/assets/bunny.png'])
>
> 	return (
> 		<sprite texture={bunnyTexture} />
> 	)
> }
>
> const LoadingText = () => (
> 	<pixiText text={'Loading...'} />
> )
>
> const MyApp = () => (
> 	<Application>
> 		<Suspense fallback={<LoadingText />}>
> 			<BunnySprite />
> 		</Suspense>
> 	</Application>
> )
> ```

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

  useTick(() => console.log('This will be logged on every tick as long as `isEnabled` is `true`'), )

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
