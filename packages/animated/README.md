# React Spring

Use `"@pixi/react-animated"` with [`"@pixi/react"`](https://github.com/pixijs/pixi-react/tree/master/packages/react)
for react-spring compatible animated components.

## Usage

```jsx
import React from 'react';
import { Spring } from 'react-spring';
import { Texture } from 'pixi.js';
import { Stage, Sprite } from '@pixi/react-animated';

const App = () => (
  <Stage>
    <Spring native from={{ x: 0, y: 0 }} to={{ x: 200, y: 200 }}>
      {(props) => <Sprite texture={Texture.WHITE} tint={0xff0000} {...props} />}
    </Spring>
  </Stage>
);
```
