import React, { useRef, useState } from 'react';
import { Stage, Sprite, useTick } from '@pixi/react';
import { UI } from './UI';

const Game = () =>
{
    const iteration = useRef(0);
    const [spriteData, setSpriteData] = useState({});

    useTick((delta) =>
    {
        iteration.current += 0.05 * delta;
        const i = iteration.current;

        setSpriteData({
            x: 400 + Math.sin(i) * 100,
            y: 300 + Math.sin(i / 1.5) * 100,
            rotation: Math.sin(i) * Math.PI,
            anchor: Math.sin(i / 2),
        });
    });

    return <Sprite image="https://pixijs.io/pixi-react/img/bunny.png" {...spriteData} />;
};

const ReactApplicationLayer = () => (
    <Stage>
        <Game />
        <UI />
    </Stage>
);

export default ReactApplicationLayer;
