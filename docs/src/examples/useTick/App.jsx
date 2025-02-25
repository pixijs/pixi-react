import {
    Application,
    useTick,
} from '@pixi/react';

function ChildComponent() {
    useTick(() => console.log('This will be logged on every tick'));
};

export default function App() {
    return (
        <Application>
            <ChildComponent />
        </Application>
    )
};
