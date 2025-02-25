import {
    Application,
    useApplication,
} from '@pixi/react';

const ChildComponent = () => {
    const { app } = useApplication();

    return <container />;
};

export default function App() {
    return (
        <Application>
            <ChildComponent />
        </Application>
    );
};
