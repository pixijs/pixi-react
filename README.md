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

**Pixi React will be a first-party React layer for PIXI and maintained by the core devs of PIXI!**

Dear Pixi React community,

I am thrilled to announce that Pixi React, the premier library for using Pixi.js with React, is being officially transferred to the Pixi team! This project started as a passion of mine, and it quickly grew into a beloved resource for the Pixi community thanks to all of your support.
We are excited to be working closely with the team at Pixi, to continue improving and supporting the library. We want to extend a huge thank you to everyone who has supported Pixi React over the years, and we especially want to thank Mat Groves for making this transfer possible.
We can't wait to see what the future holds for the library under the stewardship of the Pixi team. Stay tuned for updates and new developments as we work together to take Pixi React to the next level!

Sincerely,
Patrick Brouwer

## Get started

### Quick start

```
npm install pixi.js @pixi/react
```

```jsx
import { Stage, Container, Sprite } from '@pixi/react'

export const MyComponent = () => (
  <Stage>
    <Sprite image="./my-image.png" x={100} y={100} />

    <Container x={500}>
      <Text text="Hello World" filter={[blurFilter]} />
    </Container>
  </Stage>
)
```

### Docs

Check out [our documentation](https://pixijs.io/pixi-react/) for guides and a full API reference.

Or checkout [our examples](https://codepen.io/collection/XPpGdb) on codepen for inspiration.

## Contribute

Want to contribute to Pixi React? Our [contributing guide](CONTRIBUTING.md) has you covered.

## License

Pixi React is MIT licensed.

This projects codebase was originally forked from @michalochman 's [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber).

## Meet fellow developers

You have an amazing feature in mind or just want to get in touch with other developers? Feel free to join our Discord channel.

[Join us on Discord](https://discord.com/channels/734147990985375826/968068526566965279)
