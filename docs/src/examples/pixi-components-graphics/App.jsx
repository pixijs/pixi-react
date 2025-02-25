import { Application } from '@pixi/react';

export default function App() {
    return (
        <Application>
            <pixiGraphics draw={(graphics) => {
                graphics.clear();
                graphics.setFillStyle({ color: 'red' });
                graphics.rect(0, 0, 100, 100);
                graphics.fill();
            }} />
        </Application>
    );
};
