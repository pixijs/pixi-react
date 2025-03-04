import { useEffect, useState } from 'react';
import { Stage, Sprite } from '@pixi/react';
import React from 'react';

const useIteration = (incr = 0.1) => {
    const [i, setI] = useState(0);

    // at mount start raf
    useEffect(() => {
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
    const [app, setApp] = useState();
    const i = useIteration(0.1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Stage
                width={300}
                height={300}
                raf={false}
                renderOnComponentChange={false}
                onMount={setApp}
                options={{ backgroundColor: 0xeef1f5, antialias: true }}
            >
                <Sprite
                    anchor={0.5}
                    position={[150 + Math.cos(i) * 50, 150]}
                    rotation={i}
                    image='https://react.pixijs.io/img/bunny.png'
                />
            </Stage>
            <button style={{ margin: '20px auto 0 0' }} onClick={() => app.renderer.render(app.stage)}>
                Render
            </button>
        </div>
    );
}
