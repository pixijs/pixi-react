import {
    Application,
    useExtend,
} from '@pixi/react';
import { Container } from 'pixi.js';

function ChildComponent() {
    useExtend({ Container });

    return <pixiContainer />;
};

export default function App() {
    return (
        <Application>
            <ChildComponent />
        </Application>
    );
};
