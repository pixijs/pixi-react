import {
    Application,
    extend,
} from '@pixi/react';
import { Container } from 'pixi.js';

extend({ Container });

export default function App() {
    return (
        <Application>
            <pixiContainer />
        </Application>
    );
};
