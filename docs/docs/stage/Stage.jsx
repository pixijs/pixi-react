import { Stage, Sprite } from '@pixi/react';
import lodash from 'lodash';

const count = 10;
const width = 300;
const height = 300;
const stageProps = {
    height,
    width,
    options: {
        backgroundAlpha: 0,
        antialias: true,
    },
};

export default function StageExample() {
    return (
        <Stage {...stageProps}>
            {lodash.times(count, (i) => (
                <Sprite
                    key={i}
                    image='https://pixijs.io/pixi-react/img/coin.png'
                    scale={(360 / count) * 0.004}
                    anchor={0.5}
                    rotation={i * (360 / count) * (Math.PI / 180)}
                    x={width / 2 + Math.cos(i * (360 / count) * (Math.PI / 180)) * 100}
                    y={height / 2 + Math.sin(i * (360 / count) * (Math.PI / 180)) * 100}
                />
            ))}
        </Stage>
    );
}
