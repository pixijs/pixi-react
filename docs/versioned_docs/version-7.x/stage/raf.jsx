import { Stage, Sprite } from '@pixi/react';
import React from 'react';

const useIteration = (incr = 0.1) => {
    const [i, setI] = React.useState(0);

    // at mount start raf
    React.useEffect(() => {
        let raf;

        const loop = () => {
            raf = requestAnimationFrame(loop);
            setI((i) => i + incr);
        };

        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
        };
    }, []);

    return i;
};

export default function RAFExample() {
    // a simple incremental hook
    // https://gist.github.com/inlet/3e80965127d16c056da247f66839f51d
    const i = useIteration(0.1);
    return (
        <Stage
            width={300}
            height={300}
            raf={false}
            renderOnComponentChange={true}
            options={{ antialias: true, backgroundAlpha: 0 }}
        >
            <Sprite
                anchor={[-(2 + Math.sin(i / 5) * 2), 0.5]}
                position={150}
                rotation={(Math.PI / 180) * 90 + -i}
                image='https://pixijs.io/pixi-react/img/bunny.png'
            />
        </Stage>
    );
}
