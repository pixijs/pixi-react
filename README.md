<h1 align="center">
  <img src="https://user-images.githubusercontent.com/232559/108500263-cd0da980-72af-11eb-8928-cf6a87bab28f.jpg" alt="react-pixi" width="295" />
</h1>
<p align="center">
  <strong>Simply the best way to write PIXI applications in React</strong>
  <br />
  <sub>Write <a href="http://www.pixijs.com/">PIXI</a> applications using React declarative style 👌</sub>
</p>
<br />
<p align="center">
  <img src="https://img.shields.io/github/v/release/inlet/react-pixi" alt="release" />
  <img src="https://img.shields.io/npm/dm/@inlet/react-pixi" alt="downloads" />
  <img src="https://img.shields.io/circleci/project/github/inlet/react-pixi/master.svg" alt="ci tests" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license" />
  <img src="https://img.shields.io/badge/react-latest-ff69b4.svg" alt="react version" />
  <img src="https://img.shields.io/badge/pixi-v6+-ff69b4.svg" alt="pixi version" />
</p>
<br />

ReactPixi is an open-source, production-ready library to render high performant PIXI applications in React.

## Get started

### Quick start

```
npm install pixi.js @inlet/react-pixi
```

```jsx
import { Stage, Container, Sprite } from '@inlet/react-pixi';

export const MyComponent = () => (
  <Stage>
    <Sprite image="./my-image.png" x={100} y={100} />

    <Container x={500}>
      <Text text="Hello World" filter={[blurFilter]} />
    </Container>
  </Stage>
);
```

### Docs

Check out [our documentation](https://reactpixi.org) for guides and a full API reference.

Or checkout [our examples](https://codepen.io/collection/XPpGdb) on codepen for inspiration.

## Contribute

Want to contribute to ReactPixi? Our [contributing guide](CONTRIBUTING.md) has you covered.

## License

ReactPixi is MIT licensed.

## Meet fellow developers

You have an amazing feature in mind or just want to get in touch with other developers? Feel free to join our Slack channel.

[Join us on Slack](https://join.slack.com/t/reactpixi/shared_invite/enQtODk5NjQ2ODQ4MTI5LWVjNzlkZTJjYmI4NDcxYzljNDM4MmYwMzZkYWFlM2VkNmFhNDBmYzg3OGE5YzBiY2NmZTIwZDY0MTA4ZjA4OGM)
