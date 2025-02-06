import * as ReactPixiAnimated from '@pixi/react-animated';
import { Texture, utils } from 'pixi.js';
import { useState } from 'react';
import { Spring } from 'react-spring';
import { Stage } from '@pixi/react';

const config = {
    size: { width: 800, height: 500 },
    stage: { antialias: true, backgroundColor: 0x1099bb },
};

const toHex = (color) =>
    /^#/.test(color)
        ? utils.string2hex(color)
        : utils.rgb2hex(
              color
                  .replace(/^rgba?\(|\s+|\)$/g, '')
                  .split(',')
                  .map((val) => val / 255),
          );

const set = () => ({
    x: Math.random() * config.size.width,
    y: Math.random() * config.size.height,
    rotation: Math.random() * 10,
    scale: Math.max(1, Math.random() * 10),
    tint: '#' + Math.floor(Math.random() * 16777215).toString(16),
});

export default function App() {
    const [props, setProps] = useState(set);

    return (
        <Stage
            width={config.size.width}
            height={config.size.height}
            options={config.stage}
            onPointerUp={() => setProps(set)}
        >
            <Spring native to={props}>
                {({ tint, ...props }) => (
                    <ReactPixiAnimated.Sprite
                        anchor={0.5}
                        width={100}
                        height={100}
                        texture={Texture.WHITE}
                        tint={tint.to((color) => toHex(color))}
                        {...props}
                    />
                )}
            </Spring>
        </Stage>
    );
}
