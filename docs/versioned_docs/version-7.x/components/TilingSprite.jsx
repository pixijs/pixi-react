import { Stage, TilingSprite } from '@pixi/react';

export default function TilingSpriteExample() {
    return (
        <Stage width={500} height={300}>
            <TilingSprite
                image={'https://react.pixijs.io/img/tile.jpeg'}
                width={500}
                height={300}
                tilePosition={{ x: 100, y: 150 }}
                tileScale={{ x: 0.1, y: 2 }}
            />
        </Stage>
    );
}
