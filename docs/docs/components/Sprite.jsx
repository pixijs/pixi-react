import { Stage, Sprite } from '@pixi/react';

export default function SpriteExample() {
    return (
        <Stage width={300} height={300} options={{ backgroundColor: 0xeef1f5 }}>
            <Sprite
                image='https://pixijs.io/pixi-react/img/coin.png'
                scale={{ x: 0.5, y: 0.5 }}
                anchor={0.5}
                x={150}
                y={150}
            />
        </Stage>
    );
}
