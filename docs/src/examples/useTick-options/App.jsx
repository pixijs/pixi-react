import {
    Application,
    useTick,
} from '@pixi/react';
import { UPDATE_PRIORITY } from 'pixi.js'
import { useRef } from 'react'

function ChildComponent() {
    const spriteRef = useRef(null)

    useTick({
        callback() {
            // this === context
            this.current.rotation += 1
        },
        context: spriteRef,
        isEnabled: true,
        priority: UPDATE_PRIORITY.HIGH,
    })

    return (
        <pixiSprite ref={spriteRef} />
    )
};

export default function App() {
    return (
        <Application>
            <ChildComponent />
        </Application>
    )
};
