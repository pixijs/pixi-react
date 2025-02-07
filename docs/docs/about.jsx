import { Application, extend } from '@pixi/react';
import { Container, Graphics } from 'pixi.js';
import { useCallback } from 'react';

extend({
    Container,
    Graphics,
});

export default function App() {
    const drawCallback = useCallback((graphics) => {
        graphics.clear();
        graphics.setFillStyle({ color: 'red' });
        graphics.rect(0, 0, 100, 100);
        graphics.fill();
    }, []);

    return (
        <Application>
            <pixiContainer x={100} y={100}>
                <pixiGraphics draw={drawCallback} />
            </pixiContainer>
        </Application>
    );
}
