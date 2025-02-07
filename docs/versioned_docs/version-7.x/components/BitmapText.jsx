import { BitmapText, Stage, Text } from '@pixi/react';
import ExampleAssetLoader from './ExampleAssetLoader';

const position = {
    anchor: 0.5,
    x: 250,
    y: 150,
};
export default function App() {
    return (
        <Stage width={500} height={300} options={{ backgroundColor: 0xffffff }}>
            <ExampleAssetLoader
                name='desyrel'
                url='https://pixijs.io/pixi-react/font/desyrel.xml'
                loader={<Text {...position} text='⌛ Loading font...' style={{ fontFamily: 'Arial', fontSize: 15 }} />}
            >
                <BitmapText {...position} text='Hello World!' style={{ fontName: 'Desyrel', fontSize: 50 }} />
            </ExampleAssetLoader>
        </Stage>
    );
}
