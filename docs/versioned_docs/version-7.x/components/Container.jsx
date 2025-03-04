import { Container, Stage, Sprite } from '@pixi/react';

export default function App() {
    const url = 'https://react.pixijs.io/img/bunny.png';
    return (
        <Stage width={300} height={300} options={{ backgroundColor: 0xeef1f5 }}>
            <Container position={[150, 150]}>
                <Sprite anchor={0.5} x={-75} y={-75} image={url} />
                <Sprite anchor={0.5} x={0} y={0} image={url} />
                <Sprite anchor={0.5} x={75} y={75} image={url} />
            </Container>
        </Stage>
    );
}
