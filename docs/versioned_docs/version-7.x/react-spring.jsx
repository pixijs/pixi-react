import * as ReactPixiAnimated from '@pixi/react-animated';
import { Texture } from 'pixi.js';
import { useState } from 'react';
import { Spring } from 'react-spring';
import { Stage } from '@pixi/react';

const config = {
    size: { width: 800, height: 500 },
    spring: { mass: 10, tension: 1000, friction: 100 },
    stage: { antialias: true, backgroundColor: 0x1099bb },
};

const set = () => ({
    x: Math.random() * config.size.width,
    y: Math.random() * config.size.height,
    rotation: Math.random() * 10,
    scale: Math.max(1, Math.random() * 10),
});

const Box = (props) => (
    <Spring native to={props} config={config.spring}>
        {(props) => <ReactPixiAnimated.Sprite texture={Texture.WHITE} tint={0xaddb67} anchor={0.5} {...props} />}
    </Spring>
);

export default function ReactSpringExample() {
    const [transform, setTransform] = useState(set);
    return (
        <Stage {...config.size} options={config.stage} onPointerUp={() => setTransform(set)}>
            <Box {...transform} />
        </Stage>
    );
}
