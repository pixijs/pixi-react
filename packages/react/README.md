<p align="center">
  <img src="https://user-images.githubusercontent.com/232559/142733492-3c106f68-8b8e-459c-95f9-aca77561d438.png" alt="pixi-react" width="310" />
</p>

<h1 align="center">
  Pixi React
</h1>

<p align="center">
  <strong>Simply the best way to write PIXI applications in React</strong>
  <br />
  <sub>Write <a href="http://www.pixijs.com/">PIXI</a> applications using React declarative style 👌</sub>
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/github/v/release/pixijs/pixi-react" alt="release" />
  <img src="https://img.shields.io/npm/dm/@pixi/react" alt="downloads" />
  <img src="https://img.shields.io/circleci/project/github/pixijs/pixi-react/master.svg" alt="ci tests" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license" />
  <img src="https://img.shields.io/badge/react-latest-ff69b4.svg" alt="react version" />
  <img src="https://img.shields.io/badge/pixi-v6+-ff69b4.svg" alt="pixi version" />
</p>

<br />

Pixi React is an open-source, production-ready library to render high performant PIXI applications in React.

## News!

We're delighted to announce Pixi React v7.0.0, the first major release since making it an official Pixi package!

While all the core components remain the same, there have been some significant changes under the hood:

* Full React 18 support including a new `createRoot` API, matching the signature of [React 18's `ReactDOM/client`](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis)
* Full Pixi V7 support
* New up-to-date [docs site](https://pixijs.io/pixi-react/)
* Repository converted to a monorepo with separate [`@pixi/react`](https://www.npmjs.com/package/@pixi/react) and [`@pixi/animated`](https://www.npmjs.com/package/@pixi/react-animated) packages
* Internally all `pixi.js` library imports were replaced with `@pixi/` scoped package versions, providing bundlesize improvements for users who use modular builds
* Scoped imports allowed us to remove `@pixi/react-legacy` and `@pixi/react-animated-legacy` packages, with rendering deferred to a user's installed `pixi.js` package
* `sideEffects: false` added to `package.json` to support tree-shaking

We're excited to see what the community builds with the library and as ever please let us know on [GitHub](https://github.com/pixijs/pixi-react/issues) if you run into any issues, or reach out to us on the [Discord](https://discord.com/channels/734147990985375826/968068526566965279) to chat.

Thanks!
PixiJS Team

## Get started

### Quick start

If you want to start a new React project from scratch, we recommend [Create React App](https://github.com/facebook/create-react-app).
To add to an existing React application, just install the dependencies:

#### Start New React Project "my-app" with Create React App:
```bash
# for typescript add "--template typescript"
npx create-react-app my-app
cd my-app
```

#### Install Pixi React Dependencies:
```bash
npm install pixi.js @pixi/react
```

#### Usage:
```jsx
import { BlurFilter } from 'pixi.js';
import { Stage, Container, Sprite, Text } from '@pixi/react';
import { useMemo } from 'react';

export const MyComponent = () =>
{
  const blurFilter = useMemo(() => new BlurFilter(4), []);

  return (
    <Stage>
      <Sprite
        image="https://pixijs.io/pixi-react/img/bunny.png"
        x={400}
        y={270}
        anchor={{ x: 0.5, y: 0.5 }}
      />

      <Container x={400} y={330}>
        <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} filters={[blurFilter]} />
      </Container>
    </Stage>
  );
};
```

### Docs

Check out [our documentation](https://pixijs.io/pixi-react/) for guides and a full API reference.

Or checkout [our examples](https://codepen.io/collection/XPpGdb) on codepen for inspiration.

## Contribute

Want to contribute to Pixi React? Our [contributing guide](/.github/CONTRIBUTING.md) has you covered.

## License

Pixi React is MIT licensed.

This project was originally created and maintained by @inlet. He graciously gave the Pixi team the keys to maintain and push the project forward. Big thanks for all the hard work on making this project so awesome.

This projects codebase was originally forked from @michalochman 's [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber).

## Meet fellow developers

You have an amazing feature in mind or just want to get in touch with other developers? Feel free to join our Discord channel.

[Join us on Discord](https://discord.gg/zqbXQAADuM)
