import {
    Application,
    extend,
} from '@pixi/react';
import { Viewport } from 'pixi-viewport';

extend({ Viewport });

export default function App() {
    return (
        <Application>
            <viewport>
                <pixiContainer />
            </viewport>
        </Application>
    );
};
